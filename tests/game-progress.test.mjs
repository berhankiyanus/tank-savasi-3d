import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { dailyQuestIds, collectQuestRewards, isStandardTimeRecord } from '../game-progress.mjs';
const source = fs.readFileSync(new URL('../main.js', import.meta.url), 'utf8');
const extract = (start, end) => vm.runInNewContext(source.slice(source.indexOf(start), source.indexOf(end)).replace(/^const (\w+) = /, 'globalThis.value = ') + '; value');
const definitions = extract('const QUESTS = [', '\nconst questDef');
const maps = extract('const MAPS = [', '\nconst mapUnlocked');
const state = () => ({ list: [{id:'play1',prog:1,claimed:false},{id:'kill15',prog:15,claimed:false},{id:'wave3',prog:3,claimed:false}] });

test('one-tap collection includes each quest and exactly one daily chest', () => {
  const q=state(), r=collectQuestRewards(q,definitions,q.list.map(x=>x.id));
  assert.equal(r.coins,30+60+45+120); assert.equal(r.tokens,5); assert.equal(r.xp,75); assert.equal(r.seasonXp,75); assert.equal(r.chest,true);
  const again=collectQuestRewards(q,definitions,q.list.map(x=>x.id));
  assert.equal(again.coins,0); assert.equal(again.tokens,0); assert.equal(again.claimed.length,0);
});
test('partial claim cannot award unfinished quests or chest; last claim awards chest once', () => {
  const q=state();q.list[2].prog=2;
  const first=collectQuestRewards(q,definitions,q.list.map(x=>x.id));
  assert.equal(first.coins,90);assert.equal(first.chest,false);assert.equal(q.list[2].claimed,false);
  q.list[2].prog=3;
  assert.equal(collectQuestRewards(q,definitions,['wave3']).coins,165);
  assert.equal(collectQuestRewards(q,definitions,['wave3']).coins,0);
});
test('saved legacy quests retain progress and reward amounts', () => {
  const q={list:[{id:'kill30',prog:30,claimed:false},{id:'play3',prog:1,claimed:false},{id:'kill15',prog:15,claimed:true}]};
  assert.equal(collectQuestRewards(q,definitions,['kill30']).coins,110);
  assert.equal(q.list[1].prog,1);assert.equal(q.chest,undefined);
});
test('invalid or duplicate requested ids cannot multiply a reward', () => {
  const q=state(); const r=collectQuestRewards(q,definitions,['play1','play1','missing']);
  assert.equal(r.coins,30);assert.equal(r.claimed.length,1);
});
test('new day offers distinct objective types appropriate for progression', () => {
  for (let seed=0;seed<30;seed++) for (const level of [1,5,6,11]) {
    const ids=dailyQuestIds(level,seed), defs=ids.map(id=>definitions.find(q=>q.id===id));
    assert.equal(new Set(defs.map(q=>q.type)).size,3);
    if(level<6){assert(ids.includes('play1'));assert(ids.includes('wave3'));assert(!ids.includes('win2'));}
  }
});
test('weekly and boss-rush times never overwrite a standard record', () => {
  assert.equal(isStandardTimeRecord(60,300,{mod:'bossRush'}),false);
  assert.equal(isStandardTimeRecord(60,undefined,{mod:'fast'}),false);
  assert.equal(isStandardTimeRecord(240,300,null),true);
  assert.equal(isStandardTimeRecord(360,300,null),false);
  assert.equal(isStandardTimeRecord(240,undefined,null),true);
  assert.equal(isStandardTimeRecord(NaN,300,null),false);
});
test('new outpost has connected routes, sealed boundaries and rotational symmetry', () => {
  assert.equal(maps[0].name.en,'Classic');assert.equal(maps[12].name.en,'Factory');
  const m=maps[13],g=m.grid; assert.equal(m.name.en,'Border Outpost');assert.equal(g.length,13);
  for(let r=0;r<13;r++) for(let c=0;c<13;c++) {
    assert.equal(g[r].length,13);assert.equal(g[r][c],g[12-r][12-c]);
    if(!r||!c||r===12||c===12)assert.equal(g[r][c],'#');
  }
  const visited=new Set(['1,1']),queue=[[1,1]];
  for(let i=0;i<queue.length;i++) for(const [dr,dc] of [[0,1],[1,0],[0,-1],[-1,0]]) {
    const [r,c]=[queue[i][0]+dr,queue[i][1]+dc],key=`${r},${c}`;
    if(g[r]?.[c]==='.'&&!visited.has(key)){visited.add(key);queue.push([r,c]);}
  }
  assert.equal(visited.size,g.join('').split('').filter(x=>x==='.').length);
});
test('every declared GLB exists; radio is a valid small binary glTF', () => {
  for(const match of source.matchAll(/['"](assets\/[^'"]+\.glb)['"]/g)) assert(fs.existsSync(new URL('../'+match[1],import.meta.url)),match[1]);
  const bytes=fs.readFileSync(new URL('../assets/acc_fieldradio.glb',import.meta.url));
  assert.equal(bytes.toString('utf8',0,4),'glTF');assert.equal(bytes.readUInt32LE(4),2);assert(bytes.length<100000);
  const gltf=JSON.parse(bytes.toString('utf8',20,20+bytes.readUInt32LE(12)));
  assert.equal(gltf.meshes.length,1);assert.equal(gltf.scenes.length,1);assert.equal(gltf.materials.length,4);
});
