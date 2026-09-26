// North stays at the top. Only the camera's focus moves; steering never rotates the world.
export function combatFraming(width, height, competitive = false) {
  const aspect = Math.max(1, width) / Math.max(1, height);
  // A modest 12% increase reveals more threats while retaining the close tank scale.
  // Competitive devices share a fixed view; solo still compensates for portrait height.
  const elevation = 1.12 * (competitive ? 12.5 : 12.5 + 5.5 * Math.max(0, Math.min(1, (1.3 - aspect) / .7)));
  const fov=50, slope=.45, back=elevation*slope;
  // Balance the usable ground distance above/below a tank, despite perspective.
  // The 85% band leaves room for the HUD and screen edges; tank centre is ~1 m high.
  const edge=Math.tan(fov*Math.PI/360)*.85;
  const centerZ=(elevation-1)*slope*(1+edge*edge)/(1-slope*slope*edge*edge)-back;
  return { fov, aspect: competitive ? 16 / 9 : aspect, elevation, back, ahead: 0, centerZ, lead: elevation*.224 };
}

export function cameraLead(input,framing) {
  const x=Number.isFinite(input.x)?input.x:0,z=Number.isFinite(input.z)?input.z:0;
  const magnitude=Math.hypot(x,z),aiming=input.fire&&Number.isFinite(input.aim);
  const ax=aiming?-Math.sin(input.aim):0,az=aiming?-Math.cos(input.aim):0;
  if(magnitude>.1){
    const distance=framing.lead*Math.min(1,magnitude/.7),weight=aiming?.15:0;
    return {x:distance*(x/magnitude*(1-weight)+ax*weight),z:distance*(z/magnitude*(1-weight)+az*weight)};
  }
  return {x:ax*framing.lead,z:az*framing.lead};
}

export function createCombatCamera() {
  let anchor=null,last=null,offset={x:0,z:0},wasAlive=false;
  return {
    reset(){anchor=last=null;offset={x:0,z:0};wasAlive=false;},
    update({x,z,input={},framing,dt=1/60,alive=true,reset=false,limit=Infinity,reducedMotion=false}){
      const step=Math.max(0,Math.min(.1,Number.isFinite(dt)?dt:0));
      const snap=reset||!anchor||(alive&&!wasAlive)||(last&&Math.hypot(x-last.x,z-last.z)>8);
      if(snap){anchor={x,z};offset={x:0,z:0};}
      else {const k=1-Math.exp(-14*step);anchor.x+=(x-anchor.x)*k;anchor.z+=(z-anchor.z)*k;}
      const lead=alive?cameraLead(input,framing):{x:0,z:0};
      const active=Math.hypot(lead.x,lead.z)>.01,k=1-Math.exp(-(active?7:3)*step),scale=reducedMotion?.6:1;
      offset.x+=(lead.x*scale-offset.x)*k;offset.z+=(lead.z*scale-offset.z)*k;
      last={x,z};wasAlive=alive;
      return {x:Math.max(-limit,Math.min(limit,anchor.x+offset.x)),z:Math.max(-limit,Math.min(limit,anchor.z+framing.centerZ+offset.z))};
    }
  };
}

export function applyCombatCamera(camera,focus,framing,shakeX=0) {
  if(camera.aspect!==framing.aspect||camera.fov!==framing.fov){camera.aspect=framing.aspect;camera.fov=framing.fov;camera.updateProjectionMatrix();}
  camera.position.set(focus.x+shakeX,framing.elevation,focus.z+framing.back);
  camera.lookAt(focus.x+shakeX,0,focus.z);
}
