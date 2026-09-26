import * as THREE from '../libs/three.module.js';

// Original, code-generated environmental detailing. No external art or gameplay geometry.
export const MAP_FINISHES = [
  [0x657880,0xabb5ac,0x273d49,0xffbd68], // classic: weathered field concrete
  [0x42645a,0x849d78,0x253f38,0xe2cb92], // stadium
  [0xa17c53,0xd8ba87,0x64543e,0xe4ceb0], // desert
  [0x728c9a,0xdce9ed,0x3f596c,0xffc58a], // snow
  [0x3e516b,0x728197,0x202f45,0x65d6f0], // night
  [0x534843,0x8f7060,0x29292c,0xffa261], // lava
  [0x47526d,0x8696b5,0x252b43,0x9cb9ff], // space
  [0x486c7b,0x92a8aa,0x253e50,0xffc078], // open field
  [0x68756f,0xa2ac94,0x35453e,0xe9c785], // zigzag
  [0x677078,0xa5a99c,0x363e48,0xe4b27a], // city
  [0x466675,0x9ba9a4,0x273a47,0xf1ab69], // harbor
  [0x9e7055,0xd3a678,0x634d43,0xf1cca0], // canyon
  [0x53636e,0x93a0a2,0x2d3744,0xffb768], // factory
  [0x5a7278,0xa9b5ac,0x2f454c,0xffc17d], // outpost
  [0x3f5d70,0x8b9aa1,0x253847,0xeab071], // dry dock
  [0x657f91,0xd5e4e8,0x344f66,0xffc184], // polar
].map(([wall,cap,base,signal])=>({wall,cap,base,signal}));

export function finishLayout(grid, cell, height) {
  const walls=[],floor=[],edges=[];
  for(let r=0;r<grid.length;r++)for(let c=0;c<grid[r].length;c++){
    const x=(c-(grid[r].length-1)/2)*cell,z=(r-(grid.length-1)/2)*cell;
    if(grid[r][c]==='#'){
      walls.push({x,z,height});
      for(const [dr,dc] of [[0,1],[0,-1],[1,0],[-1,0]]){
        if(grid[r+dr]?.[c+dc]!=='.')continue;
        edges.push({x:x+dc*(cell/2-.04),z:z+dr*(cell/2-.04),side:dc!==0,signal:(r+c)%3===0});
      }
    }else if((r*7+c*13)%5===0)floor.push({x,z,variation:(r*17+c*13)%7});
  }
  return {walls,floor,edges};
}
function surfaceTexture(){
  const data=new Uint8Array(64*64*4);let seed=47;
  for(let i=0;i<64*64;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const n=218+(seed%29);data.set([n,n,n,255],i*4);}
  const t=new THREE.DataTexture(data,64,64);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(.3,.3);t.magFilter=THREE.LinearFilter;t.minFilter=THREE.LinearMipmapLinearFilter;t.generateMipmaps=true;t.needsUpdate=true;return t;
}
export function createMapFinish({grid,cell,height,mapIdx}){
  const palette=MAP_FINISHES[mapIdx]||MAP_FINISHES[0],layout=finishLayout(grid,cell,height),group=new THREE.Group();group.name='Map surface detailing';
  const natural=[2,3,11,15].includes(mapIdx),texture=surfaceTexture();
  const wallMaterial=new THREE.MeshStandardMaterial({color:palette.wall,map:texture,roughness:natural?.94:.82,metalness:natural?.02:.15});
  const cap=new THREE.MeshStandardMaterial({color:palette.cap,map:texture,roughness:.87,metalness:.1});
  const base=new THREE.MeshStandardMaterial({color:palette.base,roughness:.9});
  const light=new THREE.MeshStandardMaterial({color:palette.signal,emissive:palette.signal,emissiveIntensity:.35,roughness:.6});
  const ground=new THREE.MeshStandardMaterial({color:palette.cap,transparent:true,opacity:natural?.08:.12,depthWrite:false,roughness:1,polygonOffset:true,polygonOffsetFactor:-1});
  const matrix=new THREE.Matrix4(),q=new THREE.Quaternion(),box=new THREE.BoxGeometry(1,1,1);
  function batch(items,mat,transform){if(!items.length)return;const mesh=new THREE.InstancedMesh(box,mat,items.length);items.forEach((v,i)=>{const [x,y,z,w,h,d]=transform(v);matrix.compose(new THREE.Vector3(x,y,z),q,new THREE.Vector3(w,h,d));mesh.setMatrixAt(i,matrix);});mesh.receiveShadow=true;mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();group.add(mesh);}
  // All raised detailing stays INSIDE the existing collision footprint.
  batch(layout.walls,cap,v=>[v.x,height+.015,v.z,cell-.06,.16,cell-.06]);
  if(!natural){
    batch(layout.walls,wallMaterial,v=>[v.x,height+.12,v.z,cell*.72,.045,cell*.66]);
    const vents=layout.walls.flatMap(v=>[-1,0,1].map(n=>({...v,z:v.z+n*.25})));
    batch(vents,base,v=>[v.x,height+.15,v.z,cell*.42,.012,.06]);
  }
  batch(layout.walls,base,v=>[v.x,.14,v.z,cell-.015,.28,cell-.015]);
  batch(layout.edges,base,v=>[v.x,height*.7,v.z,v.side?.045:cell-.16,.13,v.side?cell-.16:.045]);
  batch(layout.edges.filter(v=>v.signal),light,v=>[v.x,height*.74,v.z,v.side?.055:.65,.065,v.side?.65:.055]);
  batch(layout.floor,ground,v=>[v.x,.012,v.z,cell*(natural?.65:.88),.012,cell*(natural?.5:.88)]);
  return {group,wallMaterial,dispose(){group.removeFromParent();for(const o of group.children)o.dispose();box.dispose();for(const m of [wallMaterial,cap,base,light,ground])m.dispose();texture.dispose();}};
}
