export const PROFILE_VERSION=6;
export function migratePremium(p){
 if(!Array.isArray(p.loadouts))p.loadouts=[null,null,null];p.loadouts=p.loadouts.slice(0,3);while(p.loadouts.length<3)p.loadouts.push(null);
 p.cosmeticGoal=typeof p.cosmeticGoal==='string'?p.cosmeticGoal:'';
 p.accSlot2=true; // equipment slots are cosmetic customization, never a paid power gate.
 p.v=PROFILE_VERSION;return p;
}
const slots=['selected','skin','decal','decalSide','accessory','accessory2','track','trail','explosion','projectile'];
const ownership={selected:'owned',skin:'skins',decal:'decals',accessory:'accessories',accessory2:'accessories',track:'tracks',trail:'trails',explosion:'explosions',projectile:'projectiles'};
export function captureLoadout(p){return Object.fromEntries(slots.map(k=>[k,p[k]||'']));}
export function restoreLoadout(p,l){if(!l||typeof l!=='object')return false;for(const k of slots){const value=l[k];if(typeof value!=='string')continue;if(k==='decalSide'){if(['left','right','both'].includes(value))p[k]=value;}else if((k!=='selected'&&(value===''||value==='default'))||p[ownership[k]]?.includes(value))p[k]=value;}return true;}
