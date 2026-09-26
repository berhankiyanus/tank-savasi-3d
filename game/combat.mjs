import { ARENAS } from './arenas.mjs';

// Shared by the authoritative server, prediction and deterministic tests.
export const RULES = Object.freeze({ version: 2, hz: 30, snapshotHz: 15, seconds: 180, overtime: 30, target: 5, hp: 3, speed: 8, turn: 9, cooldown: .45, bulletSpeed: 24, bulletLife: 3, bounces: 2, radius: 1.25, respawn: 2, protection: 1.2, reconnect: 15, cell: 4.5 });
export const angle = (x,z) => Math.atan2(-x,-z);
export const wrap = a => Math.atan2(Math.sin(a),Math.cos(a));
export function inputOf(raw) {
  if (!raw || !Number.isSafeInteger(raw.seq) || raw.seq < 0 || raw.seq > 1e12 || ![raw.x,raw.z,raw.aim].every(Number.isFinite) || typeof raw.fire !== 'boolean') return null;
  const d=Math.max(1,Math.hypot(raw.x,raw.z));
  return {seq:raw.seq,x:raw.x/d,z:raw.z/d,aim:wrap(raw.aim),fire:raw.fire};
}
export function geometry(id) {
  const arena=ARENAS.find(a=>a.id===id)||ARENAS[0], walls=[], open=[];
  arena.grid.forEach((row,r)=>[...row].forEach((v,c)=>{
    const x=(c-6)*RULES.cell,z=(r-6)*RULES.cell;
    (v==='#'?walls:open).push(v==='#'?{x,z,h:RULES.cell/2}:{x,z});
  }));
  return {id:arena.id,walls,open};
}
export function collide(p,walls,r=RULES.radius) {
  for(let pass=0;pass<2;pass++) for(const w of walls){
    const qx=Math.max(w.x-w.h,Math.min(p.x,w.x+w.h)), qz=Math.max(w.z-w.h,Math.min(p.z,w.z+w.h));
    let dx=p.x-qx,dz=p.z-qz,d=Math.hypot(dx,dz);
    if(d>0&&d<r){p.x+=dx/d*(r-d);p.z+=dz/d*(r-d);}
    else if(d===0){const ex=w.h+r-Math.abs(p.x-w.x),ez=w.h+r-Math.abs(p.z-w.z);if(ex<ez)p.x=w.x+(p.x>=w.x?1:-1)*(w.h+r);else p.z=w.z+(p.z>=w.z?1:-1)*(w.h+r);}
  }
  return p;
}
export function movePlayer(p,i,dt,walls){
  if(!p.alive)return p;
  p.x+=i.x*RULES.speed*dt;p.z+=i.z*RULES.speed*dt;
  if(Math.hypot(i.x,i.z)>.05)p.a+=Math.max(-RULES.turn*dt,Math.min(RULES.turn*dt,wrap(angle(i.x,i.z)-p.a)));
  p.aim=i.aim;collide(p,walls);return p;
}
export function createMatch(id,map,ids){
  const geo=geometry(map),m={id,map:geo.id,geo,tick:0,time:0,bullets:[],nextBullet:0,events:[],over:false,winner:null,reason:'',players:ids.map((id,n)=>({id,x:n?22.5:-22.5,z:n?-22.5:22.5,a:0,aim:0,hp:RULES.hp,score:0,alive:true,cool:0,inv:RULES.protection,respawn:0,seq:-1,input:{seq:0,x:0,z:0,aim:0,fire:false},inputAt:0}))};
  m.players.forEach(p=>collide(p,geo.walls));return m;
}
export function acceptInput(m,id,raw){const p=m.players.find(p=>p.id===id),i=inputOf(raw);if(!p||!i||i.seq<=p.seq||m.over)return false;p.seq=i.seq;p.input=i;p.inputAt=m.time;return true;}
function canSee(a,b,walls){const d=Math.hypot(b.x-a.x,b.z-a.z),n=Math.ceil(d/.5);for(let j=1;j<n;j++){const x=a.x+(b.x-a.x)*j/n,z=a.z+(b.z-a.z)*j/n;if(walls.some(w=>Math.abs(x-w.x)<w.h&&Math.abs(z-w.z)<w.h))return false;}return true;}
function respawn(m,p){const enemy=m.players.find(q=>q!==p);const cells=[...m.geo.open].sort((a,b)=>{
  const grade=c=>Math.hypot(c.x-enemy.x,c.z-enemy.z)+(canSee(c,enemy,m.geo.walls)?0:20);
  return grade(b)-grade(a)||a.x-b.x||a.z-b.z;
});Object.assign(p,{...cells[0],hp:RULES.hp,alive:true,inv:RULES.protection,cool:.2});m.events.push({t:'spawn',id:p.id});}
export function finish(m,winner,reason){if(m.over)return; m.over=true;m.winner=winner;m.reason=reason;}
export function step(m,dt=1/RULES.hz){
  if(m.over)return;m.tick++;m.time+=dt;m.events=[];
  for(const p of m.players){
    p.cool=Math.max(0,p.cool-dt);p.inv=Math.max(0,p.inv-dt);
    if(!p.alive){p.respawn-=dt;if(p.respawn<=0)respawn(m,p);continue;}
    const i=m.time-p.inputAt>.25?{...p.input,x:0,z:0,fire:false}:p.input;
    movePlayer(p,i,dt,m.geo.walls);
    if(i.fire&&p.cool<=0){
      p.cool=RULES.cooldown;p.inv=0;
      const vx=-Math.sin(p.aim),vz=-Math.cos(p.aim);
      // Start inside the tank radius; swept travel checks the wall before exiting the muzzle.
      m.bullets.push({id:++m.nextBullet,owner:p.id,x:p.x,z:p.z,vx:vx*RULES.bulletSpeed,vz:vz*RULES.bulletSpeed,life:RULES.bulletLife,bounces:0});
      m.events.push({t:'fire',id:p.id,x:p.x,z:p.z,aim:p.aim});
    }
  }
  const [a,b]=m.players;
  if(a.alive&&b.alive){const dx=b.x-a.x,dz=b.z-a.z,d=Math.hypot(dx,dz),over=2*RULES.radius-d;if(over>0){const nx=d?dx/d:1,nz=d?dz/d:0;a.x-=nx*over/2;a.z-=nz*over/2;b.x+=nx*over/2;b.z+=nz*over/2;collide(a,m.geo.walls);collide(b,m.geo.walls);}}
  for(const bullet of m.bullets){
    bullet.life-=dt;const parts=Math.ceil(RULES.bulletSpeed*dt/.2),h=dt/parts;
    for(let k=0;k<parts&&bullet.life>0;k++){
      const ox=bullet.x,oz=bullet.z;bullet.x+=bullet.vx*h;bullet.z+=bullet.vz*h;
      const w=m.geo.walls.find(w=>Math.abs(bullet.x-w.x)<=w.h+.15&&Math.abs(bullet.z-w.z)<=w.h+.15);
      if(w){if(bullet.bounces>=RULES.bounces){bullet.life=0;break;}const hitX=Math.abs(ox-w.x)>w.h+.15,hitZ=Math.abs(oz-w.z)>w.h+.15;if(hitX)bullet.vx*=-1;if(hitZ)bullet.vz*=-1;if(!hitX&&!hitZ){bullet.life=0;break;}bullet.x=ox;bullet.z=oz;bullet.bounces++;m.events.push({t:'bounce',x:ox,z:oz});}
      const target=m.players.find(p=>p.id!==bullet.owner&&p.alive&&Math.hypot(p.x-bullet.x,p.z-bullet.z)<RULES.radius+.15);
      if(target){bullet.life=0;if(target.inv>0)break;target.hp--;if(bullet.bounces>0){const shooter=m.players.find(p=>p.id===bullet.owner);shooter.bounceHits=(shooter.bounceHits||0)+1;}m.events.push({t:'hit',id:target.id,x:target.x,z:target.z});if(target.hp<=0){target.alive=false;target.respawn=RULES.respawn;const shooter=m.players.find(p=>p.id===bullet.owner);shooter.score++;m.events.push({t:'kill',id:target.id,by:shooter.id,x:target.x,z:target.z});}break;}
    }
  }
  m.bullets=m.bullets.filter(b=>b.life>0);
  const lead=a.score>b.score?a:b, tied=a.score===b.score;
  if(lead.score>=RULES.target)finish(m,lead.id,'target');
  else if(m.time>=RULES.seconds&&(!tied||m.time>=RULES.seconds+RULES.overtime))finish(m,tied?null:lead.id,tied?'draw':'time');
}
export function snapshot(m){return {t:'snapshot',id:m.id,map:m.map,tick:m.tick,time:m.time,players:m.players.map(({input,inputAt,cool,...p})=>p),bullets:m.bullets.map(b=>({...b})),over:m.over};}
export function elo(a,b,result){const k=24,change=Math.round(k*(result-1/(1+10**((b-a)/400))));return [Math.max(0,a+change),Math.max(0,b-change)];}
