import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { Matrix4, Quaternion, Vector3, Box3 } from '../libs/three.module.js';

const source=fs.readFileSync(new URL('../main.js',import.meta.url),'utf8');
const tanks=vm.runInNewContext(source.slice(source.indexOf('const TANKS = ['),source.indexOf('\nconst tankById'))+';TANKS');
const paths=vm.runInNewContext('('+source.match(/const MODEL_PATHS = (.*);/)[1]+')');
const manifest=JSON.parse(fs.readFileSync(new URL('../design/complete-fleet/manifest.json',import.meta.url)));
function readGlb(path){
 const bytes=fs.readFileSync(new URL('../'+path,import.meta.url));
 assert.equal(bytes.toString('utf8',0,4),'glTF');assert.equal(bytes.readUInt32LE(8),bytes.length);
 return {bytes,g:JSON.parse(bytes.toString('utf8',20,20+bytes.readUInt32LE(12)))};
}
test('all fifteen tanks use distinct redesigned models, preserving the saved tank identifiers',()=>{
 assert.equal(tanks.length,15);assert.equal(new Set(tanks.map(t=>t.model)).size,15);
 assert.equal(manifest.length,12);
 for(const tank of tanks){assert.equal(tank.model,tank.id);assert(paths[tank.model].endsWith('_mk2.glb'));assert(fs.existsSync(new URL('../'+paths[tank.model],import.meta.url)));}
});
test('the completed fleet is self-contained, paintable and has bounded geometry at the export origin',()=>{
 for(const m of manifest){
  const {bytes,g}=readGlb(paths[m.tank]);assert(bytes.length<350000,m.tank);assert(m.triangles<5000,m.tank);assert(g.meshes.length<=14);
  assert(!g.images?.length);assert(g.buffers.every(b=>!b.uri));assert.equal(g.scenes.length,1);
  assert(g.materials.some(x=>x.name==='TankPaint'));assert(g.materials.some(x=>x.name==='TankTracks'));assert(g.nodes.some(x=>x.name?.startsWith('TankTurret')));
  const bounds=new Box3();let primitives=0;
  function visit(i,parent){
   const n=g.nodes[i],local=n.matrix?new Matrix4().fromArray(n.matrix):new Matrix4().compose(new Vector3(...(n.translation||[0,0,0])),new Quaternion(...(n.rotation||[0,0,0,1])),new Vector3(...(n.scale||[1,1,1])));
   const world=parent.clone().multiply(local);
   for(const p of g.meshes[n.mesh]?.primitives||[]){const a=g.accessors[p.attributes.POSITION];assert(a.min.every(Number.isFinite));assert(a.max.every(Number.isFinite));bounds.union(new Box3(new Vector3(...a.min),new Vector3(...a.max)).applyMatrix4(world));primitives++;}
   for(const c of n.children||[])visit(c,world);
  }
  for(const i of g.scenes[0].nodes)visit(i,new Matrix4());
  assert(primitives<=14,m.tank);assert(bounds.min.y>=-.01,m.tank);assert(bounds.max.y<2.65,m.tank);
  assert(bounds.min.x>-1.5&&bounds.max.x<1.5,m.tank);assert(bounds.min.z>-2.85&&bounds.max.z<2.1,m.tank);
  const def=tanks.find(t=>t.id===m.tank);assert.equal(def.turretTop,m.turretTop);assert.equal(def.rearDeckTop,m.rearDeckTop);
 }
});
test('rear equipment uses the new deck height while turret and ground attachments keep their own mounts',()=>{
 const fn=source.slice(source.indexOf('function applyAccessory('),source.indexOf('// FAZ3: 2. yuva'));
 const accessories={cargorack:{id:'cargorack',mount:{y:1.1,z:1.12}},flag:{id:'flag',mount:{y:.86,z:1.15}},fieldradio:{id:'fieldradio',mount:{y:1.5,z:.28}},sled:{id:'sled',mount:{y:.04,z:2.6}}};
 for(const a of Object.values(accessories))a.build=()=>({position:new Vector3(),rotation:{},scale:{setScalar(){}}});
 const ctx={accById:id=>accessories[id],ACC_TURRET_SLOT:new Set(['fieldradio']),disposeSubtree(){}};vm.createContext(ctx);vm.runInContext(fn,ctx);
 for(const def of tanks.filter(t=>t.rearDeckTop))for(const [id,y]of [['cargorack',def.rearDeckTop],['flag',.86+def.rearDeckTop-.72],['fieldradio',def.turretTop],['sled',.04]]){
  const root={userData:{},add(g){this.child=g;}};ctx.applyAccessory(root,id,def);assert(Math.abs(root.child.position.y-y)<1e-9,def.id+':'+id);
 }
});
