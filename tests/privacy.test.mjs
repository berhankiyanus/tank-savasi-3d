import test from 'node:test';
import assert from 'node:assert/strict';
import {createTelemetry,optedIn,clearSoloData} from '../game/privacy.mjs';
function storage(){const m=new Map();return {getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k),m};}
test('analytics requires an explicit boolean consent and never reads storage before opt-in',()=>{
 for(const v of [null,undefined,'true',1,false])assert.equal(optedIn(v),false);
 const t=createTelemetry({enabled:()=>false,storage:new Proxy({},{get(){throw Error('storage touched');}}),send:()=>assert.fail('network request')});
 assert.equal(t.track('load_start'),false);assert.equal(optedIn(true),true);
});
test('consent revocation stops transmission and rotates the identity after a new opt-in',()=>{
 const s=storage(),events=[];let enabled=true,n=0;
 const t=createTelemetry({enabled:()=>enabled,storage:s,send:e=>events.push(e),random:()=>String(++n),now:()=>42});
 t.track('open',{pid:'override',ev:'invalid'});t.track('end');assert.equal(events[0].pid,events[1].pid);assert.equal(events[0].ev,'open');assert.equal(events[0].t,42);
 enabled=false;t.revoke();assert.equal(s.getItem('tankanalytics'),null);assert.equal(t.track('secret'),false);assert.equal(events.length,2);
 enabled=true;t.track('open');assert.notEqual(events[2].pid,events[0].pid);assert.notEqual(events[2].sid,events[0].sid);
});
test('blocked storage cannot crash gameplay or send identity-free events',()=>{
 const t=createTelemetry({enabled:()=>true,storage:{getItem(){throw Error('disabled');}},send:()=>assert.fail('send')});assert.equal(t.track('open'),false);
});
test('solo reset removes migration backups and preferences, preserving the distinct Arena credential',()=>{
 const s=storage();for(const k of ['tankprofile','tankprofile-before-premium','tanksettings','tanklang','tankcid','tankanalytics','tank-arena-session','unrelated'])s.setItem(k,'value');
 clearSoloData(s);assert.deepEqual([...s.m.keys()],['tank-arena-session','unrelated']);
});
