import { randomUUID } from 'node:crypto';
import { WebSocketServer } from 'ws';
import { AccountStore,viewResult } from './store.mjs';
import { RULES,createMatch,acceptInput,step,snapshot,finish } from '../game/combat.mjs';
import { ARENA_CATALOG } from '../game/arena-catalog.mjs';
import { ARENAS } from '../game/arenas.mjs';

export function installRanked(server,{pool,enabled=false,development=false,cleanName=n=>String(n).slice(0,14),maxMatches=25}={}){
 const available=enabled&&(development||!!pool),store=new AccountStore(pool),wss=new WebSocketServer({noServer:true,maxPayload:2048}),clients=new Map(),matches=new Map(),queue=[],limits=new Map();let stopping=false,healthy=false;
 store.ready.then(()=>healthy=true).catch(()=>{healthy=false;console.error('[ranked] persistence unavailable; matchmaking disabled');});
 const send=(ws,m)=>{if(ws?.readyState===1&&ws.bufferedAmount<65536)ws.send(JSON.stringify(m));};
 const status=()=>available&&healthy&&!stopping;
 const rate=(key,n,ms=60000)=>{const now=Date.now(),v=limits.get(key);if(!v||now-v.at>ms){limits.set(key,{at:now,n:1});return true;}return ++v.n<=n;};
 const removeQueue=id=>{for(let i=queue.length-1;i>=0;i--)if(queue[i].id===id)queue.splice(i,1);};
 const reply=(res,code,data)=>{res.writeHead(code,{'Content-Type':'application/json','Cache-Control':'no-store','Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type,Authorization','Access-Control-Allow-Methods':'GET,POST,OPTIONS'});res.end(JSON.stringify(data));};
 async function body(req){let s='';for await(const b of req){s+=b;if(s.length>2048)throw Error('too large');}return JSON.parse(s||'{}');}
 async function http(req,res){
  const url=new URL(req.url,'http://local');if(!url.pathname.startsWith('/api/arena/'))return false;
  if(req.method==='OPTIONS'){reply(res,204,{});return true;}
  if(url.pathname==='/api/arena/status'){reply(res,200,{available:status(),protocol:RULES.version,development,capacity:maxMatches,matches:matches.size,queued:queue.length});return true;}
  if(!status()){reply(res,503,{error:'unavailable'});return true;}
  const ip=req.socket.remoteAddress||'?';if(!rate('http:'+ip,60)){reply(res,429,{error:'rate'});return true;}
  try{
   if(req.method==='POST'&&url.pathname==='/api/arena/guest'){if(!rate('guest:'+ip,8)){reply(res,429,{error:'rate'});return true;}const b=await body(req);reply(res,201,await store.create(cleanName(b.name)));return true;}
   if(req.method==='GET'&&url.pathname==='/api/arena/leaderboard'){reply(res,200,{rows:await store.leaderboard()});return true;}
   if(req.method==='POST'&&url.pathname==='/api/arena/recover'){if(!rate('recover:'+ip,5)){reply(res,429,{error:'rate'});return true;}const b=await body(req),r=await store.recover(b.code);if(!r){reply(res,401,{error:'recovery'});return true;}clients.get(r.account.id)?.ws?.close(4009,'recovered');reply(res,200,r);return true;}
   const a=await store.authenticate((req.headers.authorization||'').replace(/^Bearer /,''));if(!a){reply(res,401,{error:'session'});return true;}
   if(req.method==='POST'&&url.pathname==='/api/arena/delete'){const b=await body(req);if(b.confirm!==a.id||clients.get(a.id)?.match){reply(res,409,{error:'confirmation_or_active_match'});return true;}removeQueue(a.id);clients.get(a.id)?.ws?.close(4009,'deleted');clients.delete(a.id);await store.deleteAccount(a.id);reply(res,200,{deleted:true});return true;}
   if(req.method==='GET'&&url.pathname==='/api/arena/profile'){reply(res,200,await store.profile(a));return true;}
   if(req.method==='GET'&&url.pathname==='/api/arena/catalog'){reply(res,200,{items:ARENA_CATALOG});return true;}
   if(req.method==='POST'&&url.pathname==='/api/arena/purchase'){const b=await body(req);reply(res,200,await store.purchase(a.id,b.id));return true;}
   if(req.method==='POST'&&url.pathname==='/api/arena/goal'){const b=await body(req);reply(res,200,await store.setGoal(a.id,b.id));return true;}
   if(req.method==='POST'&&url.pathname==='/api/arena/recovery'){reply(res,200,await store.recovery(a.id));return true;}
   reply(res,404,{error:'not_found'});
  }catch{reply(res,400,{error:'request_failed'});}return true;
 }
 server.on('upgrade',(req,socket,head)=>{if(new URL(req.url,'http://local').pathname!=='/ranked')return;if(!status()){socket.destroy();return;}wss.handleUpgrade(req,socket,head,ws=>wss.emit('connection',ws,req));});
 wss.on('connection',(ws,req)=>{
  let client=null,count=0,windowAt=Date.now(),authenticating=false;
  const authTimer=setTimeout(()=>{if(!client)ws.close(4001,'authenticate');},5000);authTimer.unref();
  ws.on('error',()=>{});
  ws.on('message',async raw=>{try{
   const now=Date.now();if(now-windowAt>1000){windowAt=now;count=0;}if(++count>60){ws.close(4008,'rate');return;}
   const m=JSON.parse(raw);if(!m||typeof m!=='object')return;
   if(!client){if(authenticating)return;if(m.t!=='hello'||m.version!==RULES.version){send(ws,{t:'error',code:'version'});ws.close(4002);return;}authenticating=true;
    const a=await store.authenticate(m.token);if(!a){ws.close(4001);return;}if(ws.readyState!==1)return;
    clearTimeout(authTimer);const old=clients.get(a.id);if(old?.ws&&old.ws!==ws){old.ws.close(4009,'replaced');}
    client=old||{id:a.id,account:a,match:null,rtt:0};client.ws=ws;client.gone=0;client.account=a;clients.set(a.id,client);send(ws,{t:'ready',account:await store.profile(a),development,activeMatch:client.match&&matches.has(client.match)?client.match:null});
    if(client.match){const entry=matches.get(client.match);if(entry){send(ws,{t:'start',you:a.id,names:entry.names,appearances:entry.appearances,...snapshot(entry.m),t:'start'});}}
    return;
   }
   if(m.t==='pong'&&m.n===client.pingAt){client.rtt=Math.min(2000,now-client.pingAt);return;}
   if(m.t==='queue'&&!client.match){removeQueue(client.id);client.joined=now;client.appearance=String(m.tank||'recruit').slice(0,24);queue.push(client);send(ws,{t:'queued',since:now});return;}
   if(m.t==='cancel'){removeQueue(client.id);send(ws,{t:'cancelled'});return;}
   const entry=matches.get(client.match);if(!entry)return;
   if(m.t==='input')acceptInput(entry.m,client.id,m);
   if(m.t==='leave')finish(entry.m,entry.m.players.find(p=>p.id!==client.id).id,'disconnect');
  }catch{send(ws,{t:'error',code:'request'});}});
  ws.on('close',()=>{clearTimeout(authTimer);if(client&&client.ws===ws){removeQueue(client.id);client.gone=Date.now();client.ws=null;}});
 });
 let cycle=0,last=performance.now(),acc=0;
 async function settle(entry){if(entry.settling)return;entry.settling=true;try{const result=await store.commit(entry.m);for(const p of entry.m.players){const c=clients.get(p.id);if(c){c.match=null;if(result)Object.assign(c.account,result.players[p.id]);send(c.ws,{t:'result',...viewResult(result,p.id)});}}matches.delete(entry.m.id);}catch{entry.settling=false;for(const p of entry.m.players)send(clients.get(p.id)?.ws,{t:'saving'});}}
 const timer=setInterval(()=>{
  const now=Date.now(),clock=performance.now();acc+=Math.min(.25,(clock-last)/1000);last=clock;
  // One public queue. A failed wide-latency pairing stays queued instead of silently adding a bot.
  for(let i=0;i<queue.length&&matches.size<maxMatches;i++){
   const a=queue[i];if(!a.ws||a.match)continue;const j=queue.findIndex((b,k)=>k>i&&b.ws&&!b.match&&a.rtt<250&&b.rtt<250&&Math.abs(a.account.rating-b.account.rating)<=Math.min(400,100+Math.floor((now-Math.min(a.joined,b.joined))/15000)*75));
   if(j<0)continue;const b=queue[j];queue.splice(j,1);queue.splice(i--,1);
   const id=randomUUID(),map=ARENAS[cycle++%ARENAS.length].id,m=createMatch(id,map,[a.id,b.id]),entry={m,names:{[a.id]:a.account.name,[b.id]:b.account.name},appearances:{[a.id]:a.appearance,[b.id]:b.appearance},events:[]};matches.set(id,entry);
   for(const c of [a,b]){c.match=id;send(c.ws,{...snapshot(m),t:'start',you:c.id,names:entry.names,appearances:entry.appearances});}
  }
  while(acc>=1/RULES.hz){acc-=1/RULES.hz;for(const e of matches.values()){
   if(e.m.over){settle(e);continue;}
   const gone=e.m.players.filter(p=>{const c=clients.get(p.id);return c?.gone&&now-c.gone>=RULES.reconnect*1000;});
   if(gone.length){finish(e.m,gone.length===2?null:e.m.players.find(p=>p.id!==gone[0].id).id,'disconnect');continue;}
   step(e.m);e.events.push(...e.m.events);
   if(e.m.tick%2===0){const s={...snapshot(e.m),events:e.events};e.events=[];for(const p of e.m.players)send(clients.get(p.id)?.ws,s);}
  }}
  for(const [id,c] of clients){if(c.ws&&now-(c.pingAt||0)>5000){c.pingAt=now;send(c.ws,{t:'ping',n:now});}if(c.gone&&!c.match&&now-c.gone>60000)clients.delete(id);}
  if(limits.size>1000)for(const [k,v] of limits)if(now-v.at>60000)limits.delete(k);
 },1000/RULES.hz);timer.unref();
 return {http,store,matches,queue,close(){stopping=true;clearInterval(timer);for(const e of matches.values())for(const p of e.m.players)send(clients.get(p.id)?.ws,{t:'void',reason:'server'});for(const c of clients.values())c.ws?.close(1012,'restart');wss.close();}};
}
