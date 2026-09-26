export function createControls({move,aim,settings=()=>({}),active=()=>true}){
  const state={x:0,z:0,aim:0,fire:false},keys=new Set(),pads=new Map();
  const reset=()=>{keys.clear();pads.clear();state.x=state.z=0;state.fire=false;for(const el of [move,aim]){el.classList.remove('engaged');el.querySelector('i').style.transform='translate(0,0)';}};
  function update(el,e,kind){const r=el.getBoundingClientRect(),s=settings(),max=r.width*.34,dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2,d=Math.hypot(dx,dy),scale=Math.min(1,max/(d||1)),nx=dx*scale/max,nz=dy*scale/max,dz=s.deadzone??.14;el.querySelector('i').style.transform=`translate(${dx*scale}px,${dy*scale}px)`;if(kind==='move'){state.x=d/max>dz?nx:0;state.z=d/max>dz?nz:0;}else{state.fire=d/max>dz;if(state.fire)state.aim=Math.atan2(-nx,-nz);}}
  for(const [el,kind] of [[move,'move'],[aim,'aim']]){
    el.style.touchAction='none';el.addEventListener('pointerdown',e=>{if(!active()||pads.has(kind))return;e.preventDefault();pads.set(kind,e.pointerId);el.setPointerCapture(e.pointerId);el.classList.add('engaged');update(el,e,kind);});
    el.addEventListener('pointermove',e=>{if(pads.get(kind)===e.pointerId)update(el,e,kind);});
    const end=e=>{if(pads.get(kind)!==e.pointerId)return;pads.delete(kind);el.classList.remove('engaged');el.querySelector('i').style.transform='translate(0,0)';if(kind==='move')state.x=state.z=0;else state.fire=false;};
    for(const ev of ['pointerup','pointercancel','lostpointercapture'])el.addEventListener(ev,end);
  }
  addEventListener('keydown',e=>{if(e.target.closest('input,textarea,select')||!active())return;keys.add(e.code);});
  addEventListener('keyup',e=>keys.delete(e.code));addEventListener('blur',reset);document.addEventListener('visibilitychange',()=>{if(document.hidden)reset();});
  const read=()=>{if(!active()){reset();return {x:0,z:0,aim:state.aim,fire:false};}let x=state.x+(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0),z=state.z+(keys.has('KeyS')||keys.has('ArrowDown')?1:0)-(keys.has('KeyW')||keys.has('ArrowUp')?1:0);const d=Math.max(1,Math.hypot(x,z));return {x:x/d,z:z/d,aim:state.aim,fire:state.fire||keys.has('Space')};};
  return {state,read,reset,setAim:(x,z)=>{state.aim=Math.atan2(-x,-z);}};
}
