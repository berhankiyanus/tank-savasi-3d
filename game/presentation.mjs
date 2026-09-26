// Cosmetics never participate in the combat simulation.
export function findTurret(root){let found=null;root.traverse(o=>{if(!found&&/^TankTurret/.test(o.name))found=o;});return found;}
export function installTurretPivot(THREE,root){
 if(root.userData.aimPivot)return root.userData.aimPivot;
 const turret=findTurret(root);if(!turret)return null;
 root.updateMatrixWorld(true);const point=new THREE.Vector3();turret.getWorldPosition(point);root.worldToLocal(point);
 const pivot=new THREE.Group();pivot.name='AimPivot';pivot.position.set(point.x,0,point.z);root.add(pivot);root.updateMatrixWorld(true);
 // Authored fleets sometimes export barrel meshes beside the turret rather than below it.
 const pieces=[];root.traverse(o=>{if(o===turret||/^(?:Barrel|Cannon|Muzzle|GunMantlet)/i.test(o.name))pieces.push(o);});
 for(const o of pieces)if(o.parent!==pivot&&!pieces.some(p=>p!==o&&isAncestor(p,o)))pivot.attach(o);
 root.userData.aimPivot=pivot;return pivot;
}
function isAncestor(a,b){for(let p=b.parent;p;p=p.parent)if(p===a)return true;return false;}
export function aimTank(root,aim,body){if(root.userData.aimPivot)root.userData.aimPivot.rotation.y=aim-body;}
export function enhanceMaterials(root){root.traverse(o=>{if(!o.isMesh||!o.material)return;const n=o.material.name||'';
 if(/Paint|Armor/i.test(n)){if(!o.material.userData.owned){o.material=o.material.clone();o.material.userData.owned=true;}o.material.roughness=.48;o.material.metalness=.32;}
 if(/Rubber|Track/i.test(n)){if(!o.material.userData.owned){o.material=o.material.clone();o.material.userData.owned=true;}o.material.roughness=.86;o.material.metalness=.08;}
});}
