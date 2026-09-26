// Every offer is a known cosmetic. No stats, random rewards or paid gameplay items.
export const ARENA_CATALOG = Object.freeze([
 {id:'decal:clawink',kind:'decal',item:'clawink',price:150},
 {id:'projectile:football',kind:'projectile',item:'football',price:250},
 {id:'decal:dragonink',kind:'decal',item:'dragonink',price:450},
 {id:'acc:rallyrack',kind:'acc',item:'rallyrack',price:500},
 {id:'projectile:plasmacore',kind:'projectile',item:'plasmacore',price:650},
 {id:'acc:holodrone',kind:'acc',item:'holodrone',price:850},
]);
export function advanceArenaProgress(data,m,p,won,now=Date.now()){
 const next=globalThis.structuredClone?structuredClone(data||{}):JSON.parse(JSON.stringify(data||{})),date=new Date(now).toISOString().slice(0,10),week=Math.floor((now+3*86400000)/(7*86400000));next.inventory||=[];
 if(next.daily?.date!==date)next.daily={date,matches:0,kills:0,bounces:0,claimed:[],first:false};
 if(next.weekly?.week!==week)next.weekly={week,matches:0,claimed:false};
 const d=next.daily,w=next.weekly;let bonus=0;
 if(m.reason==='disconnect'||m.reason==='server')return {data:next,bonus};
 d.matches++;d.kills+=p.score;d.bounces+=p.bounceHits||0;w.matches++;
 if(!d.first){bonus+=20;d.first=true;}
 for(const [key,goal,reward] of [['matches',3,30],['kills',5,40],['bounces',2,50]])if(d[key]>=goal&&!d.claimed.includes(key)){d.claimed.push(key);bonus+=reward;}
 if(w.matches>=10&&!w.claimed){w.claimed=true;bonus+=150;}
 next.xp=(next.xp||0)+30+(won?10:0);
 return {data:next,bonus};
}
