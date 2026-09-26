import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as THREE from '../libs/three.module.js';
import {DECALS,PROJECTILES,WORKSHOP_ACCESSORIES,WORKSHOP_SETS,migrateWorkshop,decalSvg} from '../garage-content.mjs';
import {applyDecal} from '../garage-visuals.mjs';
const source=fs.readFileSync(new URL('../main.js',import.meta.url),'utf8');

test('workshop migration preserves existing progress, repairs invalid selections and grants the starter once',()=>{
 const p={coins:123,owned:['recruit','heavy'],decals:['dragonink','dragonink'],decal:'dragonink',projectiles:['bad'],projectile:'missing',decalSide:'wrong'};
 migrateWorkshop(p);assert.equal(p.coins,123);assert.deepEqual(p.owned,['recruit','heavy']);assert.deepEqual(p.decals,['default','dragonink']);assert.equal(p.decal,'dragonink');assert.equal(p.projectile,'default');assert.equal(p.decalSide,'both');
 migrateWorkshop(p);assert.deepEqual(p.projectiles,['default','snowball']);
});
test('all four themed crates contain valid, unique cosmetic items and can complete without duplicates',()=>{
 const lists={decal:DECALS,projectile:PROJECTILES,acc:WORKSHOP_ACCESSORIES};
 for(const s of WORKSHOP_SETS){
  assert(s.items.length>=3);assert.equal(new Set(s.items.map(i=>i.kind+':'+i.id)).size,s.items.length);
  for(const i of s.items){const item=lists[i.kind].find(x=>x.id===i.id);assert(item);assert.equal(item.set,s.id);assert(item.price>0);assert(!('health'in item));}
 }
});
test('real chest logic charges once per new item, stops at completion and rejects insufficient funds',()=>{
 const chestFns=source.slice(source.indexOf('function chestOdds('),source.indexOf('function chestSwatch('));
 for(const spec of WORKSHOP_SETS){
  const p={tokens:50,chestPity:{}},owned={decal:['default'],projectile:['default','snowball'],acc:[]};
  const kinds=Object.fromEntries(Object.keys(owned).map(k=>[k,{owned:()=>owned[k]}]));
  const lists={decal:DECALS,projectile:PROJECTILES,acc:WORKSHOP_ACCESSORIES};
  const ch={...spec,set:spec.id,cost:2,pool:()=>spec.items.filter(i=>!owned[i.kind].includes(i.id)).map(i=>({kind:i.kind,it:lists[i.kind].find(x=>x.id===i.id)}))};
  const ctx={profile:p,KINDS:kinds,RARITY:{c:{w:100,coin:40},r:{w:34,coin:120},e:{w:10,coin:260}},CHEST_PITY:30,ownsItem:(k,id)=>owned[k].includes(id),track(){},saveProfile(){},updateCoinBar(){},updateTokenBar(){},checkSets(){},showToast(){},T:()=>({}),addCoins(){throw new Error('duplicate compensation should not occur');}};
  vm.createContext(ctx);vm.runInContext(chestFns,ctx);const count=ch.pool().length;const odds=ctx.chestOdds(ch);assert(Math.abs(odds.c+odds.r+odds.e-100)<1e-7);
  for(let i=0;i<count;i++){const res=ctx.openChest(ch,false);assert.equal(res.dup,false);assert.equal(p.tokens,50-2*(i+1));}
  assert.equal(ch.pool().length,0);assert.equal(ctx.openChest(ch,false),null);assert.equal(p.tokens,50-2*count);
  owned.decal=['default'];p.tokens=1;assert.equal(ctx.openChest(ch,false),null);assert.equal(p.tokens,1);
 }
});
test('every projectile cosmetic preserves velocity, lifetime, ricochets and artillery rules',()=>{
 const fn=source.slice(source.indexOf('function fire('),source.indexOf('function clearBullets('));
 const ctx={THREE,player:{x:4,z:7,a:.4,stat:{bspeed:24}},profile:{projectile:'default'},mode:'solo',loadedAcc:Object.fromEntries(PROJECTILES.filter(p=>p.glb).map(p=>[p.id,new THREE.Group()])),projectileById:id=>PROJECTILES.find(p=>p.id===id)||PROJECTILES[0],bulletGeo:new THREE.SphereGeometry(.14,8,8),bulletTailGeo:new THREE.BoxGeometry(.1,.1,1),playerBulletMat:new THREE.MeshBasicMaterial(),enemyBulletMat:new THREE.MeshBasicMaterial(),playerTailMat:new THREE.MeshBasicMaterial(),enemyTailMat:new THREE.MeshBasicMaterial(),playerShotCustom:false,playerTrailBig:false,scene:new THREE.Scene(),bullets:[],fwdX:a=>-Math.sin(a),fwdZ:a=>-Math.cos(a),buildOn:()=>false,mechIs:()=>false,ENEMY_BSPEED:17,playerMuzzle:null,playerTurret:null,muzzleFlash(){},sfxFire(){}};
 vm.createContext(ctx);vm.runInContext(fn,ctx);
 for(const mode of ['solo','coop','duel'])for(const artillery of [false,true]){
  ctx.mode=mode;ctx.mechIs=id=>artillery&&id==='lob';ctx.profile.projectile='default';ctx.fire(ctx.player);const baseline=ctx.bullets.at(-1);
  for(const shot of PROJECTILES){ctx.profile.projectile=shot.id;ctx.fire(ctx.player);const b=ctx.bullets.at(-1);for(const key of ['vx','vz','life','bounces','b0','lob','lobDur'])assert.equal(b[key],baseline[key],shot.id+':'+mode+':'+key);assert.equal(!!b.mesh.userData.shotVisual,mode!=='duel'&&shot.id!=='default');}
 }
});
test('decals compose with camouflage shaders and do not mutate shared materials',()=>{
 globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>({fill(){},fillStyle:''})})};globalThis.Path2D=class{};
 try {
  const shared=new THREE.MeshStandardMaterial();shared.name='ArmorEdges';const root=new THREE.Group();root.userData.turretTop=1.99;const mesh=new THREE.Mesh(new THREE.BoxGeometry(),shared);root.add(mesh);
  applyDecal(root,'dragonink','left');assert.notEqual(mesh.material,shared);assert.equal(shared.userData.owned,undefined);
  let prior=false;const material=new THREE.MeshStandardMaterial();material.name='TankPaint';material.userData.owned=true;material.onBeforeCompile=sh=>{prior=true;sh.uniforms.camoMap={value:'test'};};const g=new THREE.Group();g.add(new THREE.Mesh(new THREE.BoxGeometry(),material));applyDecal(g,'dragonink','right');
  const shader={uniforms:{},vertexShader:'#include <begin_vertex>',fragmentShader:'#include <color_fragment>'};material.onBeforeCompile(shader);assert(prior);assert(shader.uniforms.camoMap);assert.equal(shader.uniforms.workshopSide.value,1);assert(shader.fragmentShader.includes('insideInk'));assert(decalSvg('dragonink').includes('<svg'));assert.equal(decalSvg('default'),'');
 }finally{delete globalThis.document;delete globalThis.Path2D;}
});
test('all eighteen Blender props are self-contained and bounded in download size',()=>{
 const manifest=JSON.parse(fs.readFileSync(new URL('../design/garage-expansion/manifest.json',import.meta.url)));assert.equal(manifest.length,18);
 for(const m of manifest){const b=fs.readFileSync(new URL('../assets/'+m.id+'.glb',import.meta.url));assert.equal(b.readUInt32LE(8),b.length);assert(b.length<90000,m.id);const g=JSON.parse(b.toString('utf8',20,20+b.readUInt32LE(12)));assert(g.buffers.every(b=>!b.uri));assert(!g.images?.length);assert(m.triangles<1300,m.id);}
 for(const it of [...WORKSHOP_ACCESSORIES,...PROJECTILES.filter(p=>p.glb),...WORKSHOP_SETS])assert(fs.existsSync(new URL('../'+it.glb,import.meta.url)),it.id);
});
