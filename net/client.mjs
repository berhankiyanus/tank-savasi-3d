import { readSession,saveSession } from './session.mjs';
import { RULES } from '../game/combat.mjs';
export class RankedClient {
 constructor({base='',wsBase,onEvent,name,tank}){Object.assign(this,{base,wsBase,onEvent,name,tank});this.socket=null;this.seq=0;this.stopped=true;this.account=null;this.match=null;this.generation=0;}
 async request(path,options={}){const r=await fetch(this.base+'/api/arena/'+path,{...options,headers:{'Content-Type':'application/json',...(this.token?{Authorization:'Bearer '+this.token}:{}),...options.headers},cache:'no-store'});if(!r.ok){const e=Error('HTTP '+r.status);e.status=r.status;throw e;}return r.json();}
 async connect(){const generation=++this.generation;this.stopped=false;this.onEvent({t:'connecting'});
  try { const status=await this.request('status');if(!status.available)throw Error('unavailable');if(this.stopped||generation!==this.generation)return;
   this.token=await readSession();
   if(this.token){try{this.account=await this.request('profile');}catch(e){if(e.status!==401)throw e;this.token=null;}}
   if(!this.token){const created=await this.request('guest',{method:'POST',body:JSON.stringify({name:this.name()})});this.token=created.token;this.account=created.account;await saveSession(this.token);}
   if(this.stopped||generation!==this.generation)return;this.open(generation);
  }catch(e){if(generation===this.generation){this.stopped=true;this.onEvent({t:'unavailable',code:e.message});}}
 }
 open(generation){if(this.stopped||generation!==this.generation)return;const ws=this.socket=new WebSocket(this.wsBase+'/ranked');let ready=false;
  const timeout=setTimeout(()=>ws.close(),12000);
  ws.onopen=()=>this.send({t:'hello',version:RULES.version,token:this.token});
  ws.onmessage=ev=>{if(this.socket!==ws)return;let m;try{m=JSON.parse(ev.data);}catch{return;}
   if(m.t==='ping'){this.send({t:'pong',n:m.n});return;}
   if(m.t==='ready'){clearTimeout(timeout);ready=true;this.account=m.account;this.onEvent(m);if(!this.match)this.send({t:'queue',tank:this.tank()});else{const result=m.account.history?.find(h=>h.id===this.match);if(result){this.match=null;this.onEvent({t:'result',...result});}else if(!m.activeMatch){this.match=null;this.onEvent({t:'void',reason:'server'});}}return;}
   if(m.t==='start')this.match=m.id;
   if(m.t==='result'||m.t==='void')this.match=null;
   this.onEvent(m);
  };
  ws.onerror=()=>{};
  ws.onclose=e=>{clearTimeout(timeout);if(this.socket!==ws||this.stopped)return;if([4001,4002,4009].includes(e.code)){this.stopped=true;this.onEvent({t:'error',code:e.code===4002?'version':'session'});return;}
   if(this.match){this.onEvent({t:'reconnecting'});clearTimeout(this.retry);this.retry=setTimeout(()=>this.open(generation),1000);}else{this.stopped=true;this.onEvent({t:'unavailable',code:ready?'disconnected':'unavailable'});}
  };
 }
 send(m){if(this.socket?.readyState===1)this.socket.send(JSON.stringify(m));}
 input(i){this.send({t:'input',seq:++this.seq,...i});}
 cancel(){this.send({t:'cancel'});this.stop();}
 leave(){if(this.match)this.send({t:'leave'});this.match=null;this.stop();}
 stop(){this.stopped=true;this.generation++;clearTimeout(this.retry);this.socket?.close();this.socket=null;}
}
