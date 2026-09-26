import test from 'node:test';
import assert from 'node:assert/strict';
import {fetchWithTimeout} from '../net/http.mjs';
const hanging=(_url,{signal})=>new Promise((resolve,reject)=>{if(signal.aborted)return reject(new DOMException('Aborted','AbortError'));signal.addEventListener('abort',()=>reject(new DOMException('Aborted','AbortError')),{once:true});});
test('unresponsive requests time out without relying on AbortSignal.timeout',async()=>{await assert.rejects(fetchWithTimeout('/offline',{},20,hanging),{name:'AbortError'});});
test('caller cancellation is preserved, including an already aborted request',async()=>{const c=new AbortController();const p=fetchWithTimeout('/cancel',{signal:c.signal},10000,hanging);c.abort();await assert.rejects(p,{name:'AbortError'});await assert.rejects(fetchWithTimeout('/cancel',{signal:c.signal},10000,hanging),{name:'AbortError'});});

test('timeout also covers a response body that never finishes',async()=>{await assert.rejects(fetchWithTimeout('/body',{},20,async(_url,{signal})=>({read:()=>hanging('',{signal})}),r=>r.read()),{name:'AbortError'});});
