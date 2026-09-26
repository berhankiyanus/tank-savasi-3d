import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import WebSocket from 'ws';
import { installRanked } from '../net/ranked.mjs';
import { RULES } from '../game/combat.mjs';
const listen=s=>new Promise(resolve=>s.listen(0,'127.0.0.1',()=>resolve(s.address().port)));
const wait=(ws,type,timeout=5000)=>new Promise((resolve,reject)=>{const timer=setTimeout(()=>{ws.off('message',f);reject(Error('Timeout '+type));},timeout);const f=raw=>{const m=JSON.parse(raw);if(m.t===type){clearTimeout(timer);ws.off('message',f);resolve(m);}};ws.on('message',f);});
test('real sockets authenticate, pair, reject fake wins, reconnect and commit one result',{timeout:15000},async t=>{
 let service;const server=http.createServer(async(req,res)=>{if(!await service.http(req,res)){res.writeHead(404);res.end();}});service=installRanked(server,{development:true,enabled:true});await service.store.ready;const port=await listen(server);const sockets=[];t.after(()=>{sockets.forEach(w=>w.terminate());service.close();server.close();});
 const connect=async token=>{const w=new WebSocket('ws://127.0.0.1:'+port+'/ranked');sockets.push(w);await new Promise(resolve=>w.once('open',resolve));const ready=wait(w,'ready');w.send(JSON.stringify({t:'hello',version:RULES.version,token}));await ready;return w;};
 const a=await service.store.create('A'),b=await service.store.create('B'),wa=await connect(a.token),wb=await connect(b.token);const pa=wait(wa,'start'),pb=wait(wb,'start');wa.send(JSON.stringify({t:'queue',tank:'recruit'}));wb.send(JSON.stringify({t:'queue',tank:'titan'}));const [sa,sb]=await Promise.all([pa,pb]);assert.equal(sa.id,sb.id);assert.equal(service.matches.size,1);
 wa.send(JSON.stringify({t:'win'}));wa.send(JSON.stringify({t:'input',seq:1,x:Infinity,z:0,aim:0,fire:true}));await wait(wb,'snapshot');assert.equal(service.matches.get(sa.id).m.over,false);
 wa.terminate();await new Promise(resolve=>wa.once('close',resolve));const reconnect=new WebSocket('ws://127.0.0.1:'+port+'/ranked');sockets.push(reconnect);await new Promise(resolve=>reconnect.once('open',resolve));const resumed=wait(reconnect,'start');reconnect.send(JSON.stringify({t:'hello',version:RULES.version,token:a.token}));assert.equal((await resumed).id,sa.id);
 const end=wait(wb,'result');reconnect.send(JSON.stringify({t:'leave'}));const result=await end;assert.equal(result.winner,b.account.id);assert.equal((await service.store.authenticate(a.token)).games,1);assert.equal((await service.store.authenticate(b.token)).credits,50);
});
test('production fails closed without durable storage',async t=>{let service;const server=http.createServer((req,res)=>service.http(req,res));service=installRanked(server,{enabled:true});await service.store.ready;const port=await listen(server);t.after(()=>{service.close();server.close();});const r=await fetch('http://127.0.0.1:'+port+'/api/arena/status');assert.equal((await r.json()).available,false);assert.equal((await fetch('http://127.0.0.1:'+port+'/api/arena/guest',{method:'POST',body:'{}'})).status,503);});

test('25 simultaneous matches preserve capacity and accept delayed inputs',{timeout:15000},async t=>{
 let service;const server=http.createServer((req,res)=>service.http(req,res));service=installRanked(server,{development:true,enabled:true,maxMatches:25});await service.store.ready;const port=await listen(server),sockets=[],delayed=new Set();t.after(()=>{for(const timer of delayed)clearTimeout(timer);sockets.forEach(w=>w.terminate());service.close();server.close();});
 const connect=async n=>{const a=await service.store.create('Load '+n),w=new WebSocket('ws://127.0.0.1:'+port+'/ranked');sockets.push(w);await new Promise(resolve=>w.once('open',resolve));const ready=wait(w,'ready');w.on('message',raw=>{const m=JSON.parse(raw);if(m.t==='ping')w.send(JSON.stringify({t:'pong',n:m.n}));});w.send(JSON.stringify({t:'hello',version:RULES.version,token:a.token}));await ready;return w;};
 await Promise.all(Array.from({length:52},(_,i)=>connect(i)));const starts=sockets.slice(0,50).map(w=>wait(w,'start'));for(const w of sockets.slice(0,50))w.send(JSON.stringify({t:'queue'}));await Promise.all(starts);sockets.slice(50).forEach(w=>w.send(JSON.stringify({t:'queue'})));await wait(sockets[50],'queued');assert.equal(service.matches.size,25);assert.equal(service.queue.length,2);
 const seen=new Map(),latencies=[50,100,150];for(const [i,w] of sockets.slice(0,50).entries()){w.on('message',raw=>{const m=JSON.parse(raw);if(m.t==='snapshot')seen.set(i,m.tick);});for(let seq=1;seq<=30;seq++){const timer=setTimeout(()=>{delayed.delete(timer);if(w.readyState===1)w.send(JSON.stringify({t:'input',seq,x:0,z:0,aim:0,fire:false}));},seq*34+latencies[i%3]+seq%4*5);delayed.add(timer);}}
 await new Promise(resolve=>setTimeout(resolve,1400));assert.equal(seen.size,50);assert.ok(Math.min(...seen.values())>=20);for(const e of service.matches.values())for(const p of e.m.players)assert.equal(p.seq,30);
});
