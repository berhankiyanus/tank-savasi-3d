// Run only by the service owner, using DATABASE_URL from the hosting secret store.
// This tool is not part of the public app, and never creates or spends resources.
import pg from 'pg';
import {randomBytes,createHash} from 'node:crypto';
const [action='list',id]=process.argv.slice(2);
if(!process.env.DATABASE_URL)throw Error('DATABASE_URL is required. Never paste it into chat or commit it.');
if(!['list','resolve','suspend'].includes(action))throw Error('Use list | resolve REPORT_ID | suspend ACCOUNT_ID');
if(action!=='list'&&!/^[a-f0-9-]{36,64}$/.test(id||''))throw Error('Invalid identifier');
const pool=new pg.Pool({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:true,...(process.env.DATABASE_CA?{ca:process.env.DATABASE_CA}:{})},max:1});
try {
 if(action==='list')console.log(JSON.stringify((await pool.query('SELECT r.id,r.target,r.reason,r.created_at,a.name FROM arena_reports r LEFT JOIN arena_accounts a ON a.id=r.target WHERE r.resolved_at IS NULL ORDER BY r.created_at LIMIT 100')).rows,null,2));
 if(action==='resolve')console.log('Resolved:',(await pool.query('UPDATE arena_reports SET resolved_at=now() WHERE id=$1',[id])).rowCount);
 if(action==='suspend'){
  const revoked=createHash('sha256').update(randomBytes(32)).digest('hex');
  console.log('Suspended:',(await pool.query("UPDATE arena_accounts SET data=jsonb_set(data,'{moderationBanned}','true'),token_hash=$2,recovery_hash=NULL WHERE id=$1",[id,revoked])).rowCount);
 }
} finally {await pool.end();}
