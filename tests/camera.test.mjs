import test from 'node:test';
import assert from 'node:assert/strict';
import { combatFraming,createCombatCamera,applyCombatCamera } from '../game/camera.mjs';
import { PerspectiveCamera, Vector3,Raycaster,Plane } from '../libs/three.module.js';
function projectedTank(width,height,competitive=false){
 const f=combatFraming(width,height,competitive),c=new PerspectiveCamera(f.fov,f.aspect,.1,400);
 applyCombatCamera(c,{x:0,z:f.centerZ},f);c.updateMatrixWorld();
 const a=new Vector3(-1.5,1,0).project(c),b=new Vector3(1.5,1,0).project(c);
 return (b.x-a.x)*Math.min(width,competitive?height*16/9:width)/2;
}
test('landscape phone tank remains readable, including Safari-height viewport',()=>{
 for(const [w,h] of [[844,390],[667,375],[852,320]])assert.ok(projectedTank(w,h)>=65,`${w}x${h}`);
});
test('camera opens the view modestly in landscape and portrait',()=>{assert.ok(Math.abs(combatFraming(852,393).elevation-14)<1e-9);assert.ok(Math.abs(combatFraming(393,720).elevation-20.16)<1e-9);});
test('competitive view is identical across devices, no wider arena on tablets',()=>{
 const reference=combatFraming(1280,720,true);
 for(const [w,h] of [[844,390],[667,375],[1024,768],[393,720]])assert.deepEqual(combatFraming(w,h,true),reference);
});
test('framing stays finite during a transient collapsed viewport',()=>{
 for(const v of Object.values(combatFraming(0,0)))assert.ok(Number.isFinite(v));
});

function movingView(x,z,{fps=60,fire=false,aim=0,competitive=true,reducedMotion=false}={}){
 const f=combatFraming(852,393,competitive),follow=createCombatCamera(),c=new PerspectiveCamera();let p,focus;
 for(let frame=0;frame<=fps*3;frame++){
  p={x:x*8*frame/fps,z:z*8*frame/fps};
  focus=follow.update({...p,input:{x,z,fire,aim},framing:f,dt:1/fps,reducedMotion});
 }
 applyCombatCamera(c,focus,f);c.updateMatrixWorld();return {c,p,follow,focus,f};
}
function edgeDistance(view,down){
 const ray=new Raycaster();ray.setFromCamera({x:0,y:down?-.85:.85},view.c);
 return Math.abs(ray.ray.intersectPlane(new Plane(new Vector3(0,1,0),-1),new Vector3()).z-view.p.z);
}
test('downward travel reveals the same useful distance as upward travel, with a readable nearby opponent',()=>{
 const down=movingView(0,1),up=movingView(0,-1);
 assert(edgeDistance(down,true)>8.8);assert(Math.abs(edgeDistance(down,true)-edgeDistance(up,false))<.2);
 for(const [x,z] of [[0,1],[0,-1],[1,0],[-1,0]]){
  const {c,p}=movingView(x,z),enemy=new Vector3(p.x+x*8.5,1,p.z+z*8.5).project(c),me=new Vector3(p.x,1,p.z).project(c);
  assert(Math.abs(enemy.x)<.85&&Math.abs(enemy.y)<.85,`Opponent visible while travelling ${x},${z}`);
  assert(Math.abs(me.x)<.4&&me.y>-.5&&me.y<.55,'Player stays clear of screen edges and top HUD');
 }
});
test('backward firing does not pull the camera away from the path of travel; held idle aim cannot bias it',()=>{
 const backward=movingView(0,1,{fire:true,aim:0});assert(backward.focus.z>backward.p.z+backward.f.centerZ);
 assert(edgeDistance(backward,true)>7);
 const idle=movingView(0,0,{fire:false,aim:Math.PI});assert(Math.abs(idle.focus.z-idle.f.centerZ)<.001);
 const aim=movingView(0,0,{fire:true,aim:Math.PI});assert(aim.focus.z>aim.f.centerZ+2.5);
});
test('world orientation remains fixed for all input directions and camera motion is frame-rate independent',()=>{
 const reference=movingView(0,1).c.getWorldDirection(new Vector3());
 for(const [x,z] of [[0,-1],[1,0],[-1,0]])assert(reference.distanceTo(movingView(x,z).c.getWorldDirection(new Vector3()))<1e-6);
 const slow=movingView(0,1,{fps:30}),fast=movingView(0,1,{fps:120});assert(Math.abs(slow.focus.z-fast.focus.z)<.12);
});
test('direction reversal is smoothed, release recentres, respawn never flies across the map',()=>{
 const {follow,f,p,focus}=movingView(0,1);
 const turn=follow.update({...p,input:{x:0,z:-1},framing:f,dt:1/60});assert(Math.abs(turn.z-focus.z)<.7);
 let centre;for(let i=0;i<180;i++)centre=follow.update({...p,framing:f,dt:1/60});assert(Math.abs(centre.z-(p.z+f.centerZ))<.01);
 const spawn=follow.update({x:-20,z:-20,input:{},framing:f,dt:1/60});assert.equal(spawn.x,-20);assert.equal(spawn.z,-20+f.centerZ);
 const edge=follow.update({x:23.5,z:23.5,input:{x:1,z:1},framing:f,dt:1/60,limit:24.25});assert(edge.x<=24.25&&edge.z<=24.25);
});
