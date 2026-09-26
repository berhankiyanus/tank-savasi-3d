import test from 'node:test';
import assert from 'node:assert/strict';
import pg from 'pg';
import {AccountStore} from '../net/store.mjs';
import {createMatch,finish} from '../game/combat.mjs';
// Dedicated ephemeral database only. Never run against live player data.
test('Postgres transactions survive concurrent settlement, purchases and reconnect',{skip:!process.env.ARENA_TEST_DATABASE_URL},async()=>{
 const pool=new pg.Pool({connectionString:process.env.ARENA_TEST_DATABASE_URL});
 try{const store=new AccountStore(pool);await store.ready;const a=await store.create('DB-A'),b=await store.create('DB-B');const m=createMatch('db-'+a.account.id,13,[a.account.id,b.account.id]);finish(m,a.account.id,'target');await Promise.all(Array.from({length:15},()=>store.commit(m)));assert.equal((await store.authenticate(a.token)).games,1);assert.equal((await store.authenticate(a.token)).credits,70);
 await store.update(a.account.id,row=>({...row,credits:1000}));await Promise.all(Array.from({length:10},()=>store.purchase(a.account.id,'decal:clawink')));assert.equal((await store.authenticate(a.token)).credits,850);
 const reopened=new AccountStore(pool);await reopened.ready;assert.equal((await reopened.authenticate(a.token)).data.inventory.length,1);assert.equal((await reopened.profile(await reopened.authenticate(a.token))).history.length,1);
 const {code}=await reopened.recovery(a.account.id),results=await Promise.allSettled([store.recover(code),reopened.recover(code)]);assert.equal(results.filter(r=>r.status==='fulfilled'&&r.value).length,1);assert.equal(await store.authenticate(a.token),null);
 }finally{await pool.end();}
});
test('Postgres account deletion removes credentials and removes account identity from match history',{skip:!process.env.ARENA_TEST_DATABASE_URL},async()=>{const pool=new pg.Pool({connectionString:process.env.ARENA_TEST_DATABASE_URL});try{const store=new AccountStore(pool);await store.ready;const a=await store.create('Delete'),b=await store.create('Keep');const m=createMatch('delete-'+a.account.id,13,[a.account.id,b.account.id]);finish(m,a.account.id,'target');await store.commit(m);await store.deleteAccount(a.account.id);assert.equal(await store.authenticate(a.token),null);const other=await store.profile(await store.authenticate(b.token));assert.equal(other.history.length,1);assert.equal(other.history[0].players[a.account.id],undefined);assert.equal(other.history[0].winner,null);}finally{await pool.end();}});
