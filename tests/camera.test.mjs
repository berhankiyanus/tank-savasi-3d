import test from 'node:test';
import assert from 'node:assert/strict';
import { combatFraming } from '../game/camera.mjs';
import { PerspectiveCamera, Vector3 } from '../libs/three.module.js';
function projectedTank(width,height,competitive=false){
 const f=combatFraming(width,height,competitive),c=new PerspectiveCamera(f.fov,f.aspect,.1,400);
 c.position.set(0,f.elevation,f.back);c.lookAt(0,0,-f.ahead);c.updateMatrixWorld();
 const a=new Vector3(-1.5,1,0).project(c),b=new Vector3(1.5,1,0).project(c);
 return (b.x-a.x)*Math.min(width,competitive?height*16/9:width)/2;
}
test('landscape phone tank remains readable, including Safari-height viewport',()=>{
 for(const [w,h] of [[844,390],[667,375],[852,320]])assert.ok(projectedTank(w,h)>=65,`${w}x${h}`);
});
test('portrait solo preserves earlier framing',()=>assert.equal(combatFraming(393,720).elevation,18));
test('competitive view is identical across devices, no wider arena on tablets',()=>{
 const reference=combatFraming(1280,720,true);
 for(const [w,h] of [[844,390],[667,375],[1024,768],[393,720]])assert.deepEqual(combatFraming(w,h,true),reference);
});
test('framing stays finite during a transient collapsed viewport',()=>{
 for(const v of Object.values(combatFraming(0,0)))assert.ok(Number.isFinite(v));
});
