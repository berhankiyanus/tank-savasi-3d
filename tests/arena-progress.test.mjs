import test from 'node:test';
import assert from 'node:assert/strict';
import {advanceArenaProgress} from '../game/arena-catalog.mjs';
import {createMatch,acceptInput,step} from '../game/combat.mjs';
import {advancePractice,botInput} from '../game/practice.mjs';
test('daily and weekly rewards are bounded and reset without a streak penalty',()=>{let data={},bonus=0;const now=Date.UTC(2026,8,21);for(let i=0;i<11;i++){const r=advanceArenaProgress(data,{reason:'target'},{score:5,bounceHits:2},false,now);data=r.data;bonus+=r.bonus;}assert.equal(bonus,290);assert.equal(data.xp,330);const tomorrow=advanceArenaProgress(data,{reason:'time'},{score:0,bounceHits:0},false,now+86400000);assert.equal(tomorrow.bonus,20);assert.equal(tomorrow.data.daily.matches,1);assert.equal(tomorrow.data.weekly.matches,12);const quit=advanceArenaProgress(tomorrow.data,{reason:'disconnect'},{score:10,bounceHits:10},true,now+86400000);assert.equal(quit.bonus,0);assert.equal(quit.data.daily.matches,1);});
test('bot uses normalized input in the same deterministic simulation without progression',()=>{const m=createMatch('practice',13,['a','b']);for(let n=0;n<600;n++){const input=botInput(m,n+1);assert.ok(Math.hypot(input.x,input.z)<=1.0001);advancePractice(m);acceptInput(m,'a',{seq:n+1,x:0,z:0,aim:0,fire:true});step(m);}assert.equal(m.players[1].seq,600);assert.equal(m.players[1].hp<=3,true);});
