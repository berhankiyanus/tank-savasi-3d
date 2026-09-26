import { acceptInput,angle,RULES } from './combat.mjs';
// A visible bot uses exactly the same input and combat rules as the public queue.
export function botInput(match,seq){
 const bot=match.players[1],target=match.players[0],open=match.geo.open;
 const nearest=p=>open.reduce((best,c,i)=>Math.hypot(c.x-p.x,c.z-p.z)<Math.hypot(open[best].x-p.x,open[best].z-p.z)?i:best,0);
 const from=nearest(bot),to=nearest(target),parents=new Map([[from,null]]),queue=[from];
 for(let k=0;k<queue.length&&!parents.has(to);k++){const at=queue[k];for(let j=0;j<open.length;j++){if(!parents.has(j)&&Math.abs(Math.hypot(open[j].x-open[at].x,open[j].z-open[at].z)-RULES.cell)<.01){parents.set(j,at);queue.push(j);}}}
 let next=to;while(parents.has(next)&&parents.get(next)!==from&&parents.get(next)!==null)next=parents.get(next);
 const destination=parents.has(to)?open[next]:open[from],dx=destination.x-bot.x,dz=destination.z-bot.z,d=Math.hypot(dx,dz);
 return {seq,x:d>.3?dx/Math.max(d,1):0,z:d>.3?dz/Math.max(d,1):0,aim:angle(target.x-bot.x,target.z-bot.z),fire:bot.alive&&target.alive&&Math.hypot(target.x-bot.x,target.z-bot.z)<30};
}
export function advancePractice(match){acceptInput(match,match.players[1].id,botInput(match,match.tick+1));}
