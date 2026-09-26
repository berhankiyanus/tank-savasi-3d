import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { CAREER_STEPS, careerProgress, collectCareerReward } from '../game-progress.mjs';
const profile=()=>({tutorialDone:1,kills:10,bestWave:3,owned:['recruit','scout'],wins:1,accessories:[]});
test('career rewards are permanent and each can only be claimed once',()=>{
 const p=profile();for(const s of CAREER_STEPS){assert(collectCareerReward(p,s.id));assert.equal(collectCareerReward(p,s.id),null);}
 assert.equal(p.careerClaims.length,5);assert.deepEqual(p.accessories,['fieldradio','rescuepack']);
});
test('incomplete goals and unknown ids cannot grant rewards',()=>{
 const p={owned:['recruit'],kills:9,bestWave:2};assert.equal(collectCareerReward(p,'firstkills'),null);assert.equal(collectCareerReward(p,'missing'),null);assert.equal(p.careerClaims,undefined);
});
test('an already-owned cosmetic gets the displayed compensation exactly once',()=>{
 const p=profile();p.accessories=['fieldradio'];const r=collectCareerReward(p,'breakthrough');assert.equal(r.coins,100);assert.equal(r.accessory,'');assert.equal(p.accessories.length,1);assert.equal(collectCareerReward(p,'breakthrough'),null);
});
test('legacy profiles need no reset and duplicate tank IDs cannot satisfy fleet goal',()=>{
 const p=profile();p.owned=['recruit','recruit'];assert.equal(careerProgress(p,CAREER_STEPS.find(x=>x.id==='fleet')),1);assert.equal(collectCareerReward(p,'fleet'),null);assert(collectCareerReward(p,'training'));
});
const source=fs.readFileSync(new URL('../main.js',import.meta.url),'utf8');
const maps=vm.runInNewContext(source.slice(source.indexOf('const MAPS = ['),source.indexOf('\nconst mapUnlocked')).replace('const MAPS =','globalThis.maps =')+';maps');
test('both new tactical layouts have connected, symmetric routes and preserved map IDs',()=>{
 assert.equal(maps.length,16);assert.equal(maps[13].name.en,'Border Outpost');
 for(const m of maps.slice(14)){
  const g=m.grid;assert.equal(g.length,13);const seen=new Set(['1,1']),q=[[1,1]];
  for(let i=0;i<q.length;i++)for(const [dr,dc]of [[1,0],[-1,0],[0,1],[0,-1]]){const r=q[i][0]+dr,c=q[i][1]+dc,k=`${r},${c}`;if(g[r]?.[c]==='.'&&!seen.has(k)){seen.add(k);q.push([r,c]);}}
  assert.equal(seen.size,g.join('').split('').filter(x=>x==='.').length,m.name.en);
  for(let r=0;r<13;r++)for(let c=0;c<13;c++){assert.equal(g[r].length,13);assert.equal(g[r][c],g[12-r][12-c]);if(!r||!c||r===12||c===12)assert.equal(g[r][c],'#');}
 }
});
test('redesigned assets are self-contained, bounded and support paint plus turret recoil',()=>{
 const manifest=JSON.parse(fs.readFileSync(new URL('../design/armored-update/manifest.json',import.meta.url)));
 for(const item of manifest){
  const bytes=fs.readFileSync(new URL('../assets/'+item.id+'.glb',import.meta.url));assert.equal(bytes.toString('utf8',0,4),'glTF');assert.equal(bytes.readUInt32LE(8),bytes.length);
  const gltf=JSON.parse(bytes.toString('utf8',20,20+bytes.readUInt32LE(12)));assert.equal(gltf.scenes.length,1);assert(bytes.length<500000);assert(item.triangles<6500);assert(!gltf.images?.length);assert(gltf.buffers.every(b=>!b.uri));
  if(item.id.startsWith('tank_')){assert(gltf.materials.some(m=>m.name==='TankPaint'));assert(gltf.materials.some(m=>m.name==='TankTracks'));assert(gltf.nodes.some(n=>n.name?.startsWith('TankTurret')));}
 }
});
test('a run with zero kills or cleared waves does not advance those quests',()=>{
 const fn=source.slice(source.indexOf('function questProgress('),source.indexOf('function claimQuest('));
 const q=[{id:'kills',prog:0,claimed:false},{id:'waves',prog:0,claimed:false}];
 const defs={kills:{type:'kill',goal:10},waves:{type:'wave',goal:3}};
 const ctx={dailyQuests:()=>q,questDef:id=>defs[id],saveProfile(){},updateNavDots(){},$:()=>({classList:{contains:()=>false}}),showToast(){},T:()=>({}),track(){}};
 vm.createContext(ctx);vm.runInContext(fn,ctx);
 ctx.questProgress('kill',0);ctx.questProgress('wave',0);ctx.questProgress('kill',NaN);assert.equal(q[0].prog,0);assert.equal(q[1].prog,0);
 ctx.questProgress('kill',2);assert.equal(q[0].prog,2);assert.equal(q[1].prog,0);
});
test('replaying the tutorial cannot mint its first-completion reward again',()=>{
 const fn=source.slice(source.indexOf('function tutFinish()'),source.indexOf('function tutUpdate()'));
 let coins=0;const ctx={tut:{},profile:{},$:()=>({classList:{remove(){}}}),addCoins:n=>{coins+=n},saveProfile(){},showToast(){},T:()=>({tutDone:'done'}),track(){},lang:'tr'};
 vm.createContext(ctx);vm.runInContext(fn,ctx);ctx.tutFinish();ctx.tutFinish();assert.equal(coins,100);assert.equal(ctx.profile.tutorialDone,1);
});
