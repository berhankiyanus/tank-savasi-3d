import test from 'node:test';
import assert from 'node:assert/strict';
import {AccountStore} from '../net/store.mjs';
test('reports reject invalid targets and reasons and deduplicate repeated submissions',async()=>{
 const s=new AccountStore(),a=await s.create('A'),b=await s.create('B');
 await assert.rejects(s.report(a.account.id,a.account.id,'name'));await assert.rejects(s.report(a.account.id,b.account.id,'arbitrary text'));await assert.rejects(s.report(a.account.id,'missing','name'));
 const one=await s.report(a.account.id,b.account.id,'name'),two=await s.report(a.account.id,b.account.id,'name');assert.equal(one.id,two.id);assert.equal(s.reports.size,1);
 await s.deleteAccount(a.account.id);assert.equal(s.reports.get(one.id).reporter,null);
});
test('blocking is reversible, preserves progress and banned accounts cannot authenticate or appear in league',async()=>{
 const s=new AccountStore(),a=await s.create('A'),b=await s.create('B');
 const blocked=await s.block(a.account.id,b.account.id);assert.deepEqual(blocked.data.blocked,[b.account.id]);assert.equal(blocked.credits,0);
 assert.deepEqual((await s.block(a.account.id,b.account.id,false)).data.blocked,[]);await assert.rejects(s.block(a.account.id,a.account.id));
 await s.update(b.account.id,r=>({...r,games:5,data:{...r.data,moderationBanned:true}}));assert.equal(await s.authenticate(b.token),null);assert.equal((await s.leaderboard()).length,0);
});
