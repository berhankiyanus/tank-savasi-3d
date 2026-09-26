import * as THREE from './libs/three.module.js';
import { DECALS, decalSvg } from './garage-content.mjs';
const textures = new Map();
export const decalImage = id => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(decalSvg(id));
function decalTexture(id) {
 if(textures.has(id))return textures.get(id);
 const def=DECALS.find(d=>d.id===id);if(!def?.paths)return null;
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=256;
 const ctx=canvas.getContext('2d');ctx.fillStyle=def.color;
 for(const path of def.paths)ctx.fill(new Path2D(path));
 ctx.fillStyle='#132328';for(const path of def.cuts||[])ctx.fill(new Path2D(path));
 const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;textures.set(id,t);return t;
}
// Surface paint rather than a floating quad: works on sloped armour and on top
// of an existing camouflage shader. Geometry, collision and tank stats stay intact.
export function applyDecal(root,id,side='both') {
 const map=decalTexture(id);if(!map)return;
 root.traverse(o=>{
  if(!o.isMesh||!['TankPaint','ArmorEdges'].includes(o.material?.name))return;
  if(!o.material.userData.owned){o.material=o.material.clone();o.material.userData.owned=true;}
  const m=o.material;
  const before=m.onBeforeCompile,oldKey=m.customProgramCacheKey();
  m.onBeforeCompile=shader=>{
   before.call(m,shader);
   shader.uniforms.workshopDecal={value:map};
   shader.uniforms.workshopSide={value:side==='left'?-1:side==='right'?1:0};
   shader.uniforms.workshopTop={value:root.userData.turretTop||1.83};
   shader.uniforms.workshopWidth={value:root.userData.decalWidth||1.22};
   shader.vertexShader='varying vec3 vWorkshopPos; varying vec3 vWorkshopNormal;\n'+shader.vertexShader
    .replace('#include <begin_vertex>','#include <begin_vertex>\nvWorkshopPos = transformed; vWorkshopNormal = normal;');
   shader.fragmentShader='varying vec3 vWorkshopPos; varying vec3 vWorkshopNormal; uniform sampler2D workshopDecal; uniform float workshopSide; uniform float workshopTop; uniform float workshopWidth;\n'+shader.fragmentShader
    .replace('#include <color_fragment>',`#include <color_fragment>
     float inkBottom = (1.20 + workshopTop - 0.10) * 0.5 - 0.17;
     vec2 inkUV = vec2(-vWorkshopPos.z / workshopWidth + 0.50, (vWorkshopPos.y - inkBottom) / 0.34);
     vec4 ink = texture2D(workshopDecal, inkUV);
     float insideInk = step(0.0,inkUV.x)*step(inkUV.x,1.0)*step(0.0,inkUV.y)*step(inkUV.y,1.0);
     float sideInk = smoothstep(0.35,0.80,abs(normalize(vWorkshopNormal).x));
     if (abs(workshopSide)>0.5) sideInk *= step(0.0, vWorkshopPos.x * workshopSide);
     diffuseColor.rgb = mix(diffuseColor.rgb, ink.rgb, ink.a * insideInk * sideInk);
    `);
  };
  m.customProgramCacheKey=()=>oldKey+'-workshop-decal-v1-'+id+'-'+side;m.needsUpdate=true;
 });
}
