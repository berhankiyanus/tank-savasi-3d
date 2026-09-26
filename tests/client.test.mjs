import test from 'node:test';
import assert from 'node:assert/strict';
import {RankedClient} from '../net/client.mjs';
test('cancel during availability lookup cannot create an account or enter the queue',async()=>{
 const events=[],client=new RankedClient({wsBase:'ws://local',name:()=> 'Test',tank:()=> 'recruit',onEvent:e=>events.push(e)});assert.deepEqual(client.blocked(),[]);
 let resolve,calls=0;client.request=()=>{calls++;return new Promise(r=>resolve=r);};
 const pending=client.connect();client.cancel();resolve({available:true});await pending;
 assert.equal(calls,1);assert.equal(client.stopped,true);assert.equal(client.socket,null);assert.deepEqual(events.map(e=>e.t),['connecting']);
});
