import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { createHash } from 'node:crypto';
import { MAP_FINISHES,finishLayout,createMapFinish } from '../game/map-finish.mjs';
const source=readFileSync(new URL('../main.js',import.meta.url),'utf8');
const block=source.slice(source.indexOf('const MAPS = ['));
const maps=runInNewContext(block.slice(0,block.indexOf('\n];')+3)+';MAPS');
test('all existing maps retain their collision layouts and have a surface palette',()=>{
 assert.equal(maps.length,16);assert.equal(MAP_FINISHES.length,16);
 assert.equal(createHash('sha256').update(JSON.stringify(maps.map(m=>m.grid))).digest('hex'),'4d45d2caaf5335ae421ec752e172fbbc24d5e3dc0ed8f63c6b99ac4346d1c53a');
});
test('details follow wall footprints and remain a bounded number of draw calls',()=>{
 for(const [mapIdx,map] of maps.entries())for(const height of [1.7,3]){
  const before=JSON.stringify(map.grid),layout=finishLayout(map.grid,4.5,height),finish=createMapFinish({grid:map.grid,cell:4.5,height,mapIdx});
  assert.equal(layout.walls.length,map.grid.join('').split('#').length-1);
  assert.ok(finish.group.children.length<=7);
  for(const mesh of finish.group.children){assert.ok(mesh.isInstancedMesh);assert.ok(Number.isFinite(mesh.boundingSphere.radius));}
  for(const p of layout.edges){const wall=layout.walls.find(w=>Math.abs(w.x-p.x)<=2.25&&Math.abs(w.z-p.z)<=2.25);assert.ok(wall);}
  let disposed=0;finish.wallMaterial.addEventListener('dispose',()=>disposed++);finish.dispose();assert.equal(disposed,1);
  assert.equal(JSON.stringify(map.grid),before);
 }
});
