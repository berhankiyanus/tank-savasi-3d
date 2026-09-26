import { randomBytes, randomUUID, createHash } from 'node:crypto';
import { ARENA_CATALOG,advanceArenaProgress } from '../game/arena-catalog.mjs';
import { elo } from '../game/combat.mjs';
export const hash=s=>createHash('sha256').update(s).digest('hex');
export const viewResult=(r,id)=>({...r,players:Object.fromEntries(Object.entries(r.players).map(([key,p])=>[key,key===id?p:{score:p.score,rating:p.rating,delta:p.delta}]))});
const publicAccount=a=>({id:a.id,name:a.name,rating:a.rating,games:a.games,wins:a.wins,credits:a.credits,history:(a.history||[]).map(r=>viewResult(r,a.id)),data:a.data||{},recoverable:!!a.recovery_hash});
// Memory store is explicitly for local development/tests; production never falls back to it.
export class AccountStore {
  constructor(pool=null){this.pool=pool;this.accounts=new Map();this.results=new Map();this.reports=new Map();this.ready=this.init();}
  async init(){if(this.pool)await this.pool.query(`CREATE TABLE IF NOT EXISTS arena_accounts(id text PRIMARY KEY, token_hash text UNIQUE NOT NULL, name text NOT NULL, rating integer NOT NULL DEFAULT 1000, games integer NOT NULL DEFAULT 0, wins integer NOT NULL DEFAULT 0, credits integer NOT NULL DEFAULT 0); CREATE TABLE IF NOT EXISTS arena_results(id text PRIMARY KEY, payload jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now()); ALTER TABLE arena_accounts ADD COLUMN IF NOT EXISTS data jsonb NOT NULL DEFAULT '{}'; ALTER TABLE arena_accounts ADD COLUMN IF NOT EXISTS recovery_hash text UNIQUE; CREATE TABLE IF NOT EXISTS arena_reports(id text PRIMARY KEY, reporter text REFERENCES arena_accounts(id) ON DELETE SET NULL, target text REFERENCES arena_accounts(id) ON DELETE SET NULL, reason text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), resolved_at timestamptz);`);}
  async create(name){await this.ready;const token=randomBytes(32).toString('hex'),a={id:randomUUID(),token_hash:hash(token),name,rating:1000,games:0,wins:0,credits:0,history:[],data:{}};if(this.pool)await this.pool.query('INSERT INTO arena_accounts(id,token_hash,name) VALUES($1,$2,$3)',[a.id,a.token_hash,name]);else this.accounts.set(a.id,a);return {token,account:publicAccount(a)};}
  async authenticate(token){await this.ready;if(typeof token!=='string'||!/^[a-f0-9]{64}$/.test(token))return null;const h=hash(token);if(this.pool){const r=await this.pool.query('SELECT * FROM arena_accounts WHERE token_hash=$1',[h]);return r.rows[0]?.data?.moderationBanned?null:(r.rows[0]||null);}return [...this.accounts.values()].find(a=>a.token_hash===h&&!a.data?.moderationBanned)||null;}
  async profile(a){let history=a.history||[];if(this.pool){const r=await this.pool.query("SELECT payload FROM arena_results WHERE payload->'players' ? $1 ORDER BY created_at DESC LIMIT 10",[a.id]);history=r.rows.map(r=>r.payload);}return {...publicAccount(a),history:history.map(r=>viewResult(r,a.id))};}
  async leaderboard(){if(this.pool)return (await this.pool.query("SELECT id,name,rating,games,wins FROM arena_accounts WHERE games>=5 AND COALESCE(data->>'moderationBanned','false')<>'true' ORDER BY rating DESC,id LIMIT 30")).rows;return [...this.accounts.values()].filter(a=>a.games>=5&&!a.data?.moderationBanned).sort((a,b)=>b.rating-a.rating).slice(0,30).map(({id,name,rating,games,wins})=>({id,name,rating,games,wins}));}
  async targetExists(id){if(typeof id!=='string'||!/^[a-f0-9-]{36}$/.test(id))return false;return this.pool?!!(await this.pool.query('SELECT id FROM arena_accounts WHERE id=$1',[id])).rowCount:this.accounts.has(id);}
  async block(id,target,blocked=true){
    if(target===id||!await this.targetExists(target))throw Error('invalid_target');
    return this.update(id,a=>{a.data||={};const list=new Set(a.data.blocked||[]);if(blocked)list.add(target);else list.delete(target);if(list.size>200)throw Error('block_limit');a.data.blocked=[...list];return a;});
  }
  async report(id,target,reason){
    if(!['name','abuse','cheating'].includes(reason)||id===target||!await this.targetExists(target))throw Error('invalid_report');
    const report={id:hash(id+':'+target+':'+new Date().toISOString().slice(0,10)),reporter:id,target,reason};
    if(this.pool)await this.pool.query('INSERT INTO arena_reports(id,reporter,target,reason) VALUES($1,$2,$3,$4) ON CONFLICT(id) DO NOTHING',[report.id,id,target,reason]);
    else if(!this.reports.has(report.id))this.reports.set(report.id,report);
    return {received:true,id:report.id};
  }
  async commit(m){
    if(!m.over||m.reason==='server')return null;
    if(!this.pool){if(this.results.has(m.id))return this.results.get(m.id);const aa=m.players.map(p=>this.accounts.get(p.id));const result=this.calculate(m,aa);aa.forEach((a,i)=>{Object.assign(a,result.players[a.id]);a.history=[result,...a.history].slice(0,10);});this.results.set(m.id,result);return result;}
    const c=await this.pool.connect();try{await c.query('BEGIN');
      // Stable lock order prevents deadlock; result insert and both wallets share one transaction.
      const ids=m.players.map(p=>p.id),rows=await c.query('SELECT * FROM arena_accounts WHERE id=ANY($1) ORDER BY id FOR UPDATE',[ids]);
      const prior=await c.query('SELECT payload FROM arena_results WHERE id=$1',[m.id]);if(prior.rows.length){await c.query('COMMIT');return prior.rows[0].payload;}
      const aa=ids.map(id=>rows.rows.find(a=>a.id===id)),result=this.calculate(m,aa);
      await c.query('INSERT INTO arena_results(id,payload) VALUES($1,$2)',[m.id,JSON.stringify(result)]);
      for(const a of aa){const p=result.players[a.id];await c.query('UPDATE arena_accounts SET rating=$2,games=$3,wins=$4,credits=$5,data=$6 WHERE id=$1',[a.id,p.rating,p.games,p.wins,p.credits,JSON.stringify(p.data)]);}
      await c.query('COMMIT');return result;
    }catch(e){await c.query('ROLLBACK');throw e;}finally{c.release();}
  }
  async deleteAccount(id){
    if(!this.pool){this.accounts.delete(id);for(const r of this.reports.values()){if(r.reporter===id)r.reporter=null;if(r.target===id)r.target=null;}for(const result of this.results.values()){delete result.players[id];if(result.winner===id)result.winner=null;}return;}
    const c=await this.pool.connect();try{await c.query('BEGIN');await c.query('SELECT id FROM arena_accounts WHERE id=$1 FOR UPDATE',[id]);await c.query("UPDATE arena_results SET payload=jsonb_set(jsonb_set(payload,'{players}',(payload->'players')-$1),'{winner}',CASE WHEN payload->>'winner'=$1 THEN 'null'::jsonb ELSE payload->'winner' END) WHERE payload->'players' ? $1",[id]);await c.query('DELETE FROM arena_accounts WHERE id=$1',[id]);await c.query('COMMIT');}catch(e){await c.query('ROLLBACK');throw e;}finally{c.release();}
  }
  async purchase(id,itemId){const offer=ARENA_CATALOG.find(i=>i.id===itemId);if(!offer)throw Error('unknown_item');return this.update(id,a=>{a.data||={};a.data.inventory||=[];if(a.data.inventory.includes(itemId))return a;if(a.credits<offer.price)throw Error('insufficient');a.credits-=offer.price;a.data.inventory.push(itemId);return a;});}
  async setGoal(id,itemId){if(itemId&&!ARENA_CATALOG.some(i=>i.id===itemId))throw Error('unknown_item');return this.update(id,a=>{a.data||={};a.data.goal=itemId;return a;});}
  async recovery(id){const code=randomBytes(24).toString('hex');await this.update(id,a=>{a.recovery_hash=hash(code);return a;});return {code};}
  async recover(code){if(typeof code!=='string'||!/^[a-f0-9]{48}$/.test(code))return null;const h=hash(code);let a;if(this.pool)a=(await this.pool.query('SELECT * FROM arena_accounts WHERE recovery_hash=$1',[h])).rows[0];else a=[...this.accounts.values()].find(a=>a.recovery_hash===h);if(!a)return null;const token=randomBytes(32).toString('hex');const account=await this.update(a.id,row=>{if(row.recovery_hash!==h)throw Error('used');row.token_hash=hash(token);row.recovery_hash=null;return row;});return {token,account};}
  async update(id,fn){await this.ready;if(!this.pool){const old=this.accounts.get(id);if(!old)throw Error('missing');const a=fn(structuredClone(old));this.accounts.set(id,a);return publicAccount(a);}const c=await this.pool.connect();try{await c.query('BEGIN');const r=await c.query('SELECT * FROM arena_accounts WHERE id=$1 FOR UPDATE',[id]);if(!r.rows[0])throw Error('missing');const a=fn(r.rows[0]);await c.query('UPDATE arena_accounts SET credits=$2,data=$3,token_hash=$4,recovery_hash=$5 WHERE id=$1',[id,a.credits,JSON.stringify(a.data||{}),a.token_hash,a.recovery_hash||null]);await c.query('COMMIT');return publicAccount(a);}catch(e){await c.query('ROLLBACK');throw e;}finally{c.release();}}
  calculate(m,aa){if(aa.some(a=>!a))throw Error('Account missing');const ratings=elo(aa[0].rating,aa[1].rating,m.winner===null?.5:m.winner===aa[0].id?1:0),players={};aa.forEach((a,i)=>{const progress=advanceArenaProgress(a.data,m,m.players[i],m.winner===a.id),reward=(m.reason==='disconnect'&&m.winner!==a.id?0:30+(m.winner===a.id?20:0))+progress.bonus;players[a.id]={data:progress.data,rating:ratings[i],delta:ratings[i]-a.rating,games:a.games+1,wins:a.wins+(m.winner===a.id?1:0),credits:a.credits+reward,reward,score:m.players[i].score};});return {id:m.id,winner:m.winner,reason:m.reason,map:m.map,players};}
}
