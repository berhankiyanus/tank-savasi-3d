// Explicitly opt-in, loopback-only access to private audition derivatives.
// This is never part of release-policy.cjs or the native web payload.
const fs=require('node:fs'),path=require('node:path');
function createAudioPreview({enabled=false,production=false,root}={}){
 if(!enabled)return null;
 if(production)throw Error('Audio preview cannot run in production');
 const base=fs.realpathSync(root),manifest=JSON.parse(fs.readFileSync(path.join(base,'manifest.json'),'utf8'));
 if(manifest.licenseStatus!=='pending-local-preview')throw Error('Invalid audio preview manifest');
 const routes=new Map([['/_audio-preview/manifest.json','manifest.json']]);
 for(const track of Object.values(manifest.tracks)){
  if(!/^\/_audio-preview\/[a-z0-9-]+\.(wav|m4a)$/.test(track.url))throw Error('Invalid audio preview route');
  const name=path.basename(track.url),file=fs.realpathSync(path.join(base,name));
  if(path.dirname(file)!==base)throw Error('Audio preview source escapes private folder');
  routes.set(track.url,name);
 }
 return function preview(req,res){
  const route=(req.url||'').split('?')[0];if(!route.startsWith('/_audio-preview/'))return false;
  const remote=req.socket.remoteAddress,host=req.headers.host||'';
  const local=['127.0.0.1','::1','::ffff:127.0.0.1'].includes(remote)&&/^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/.test(host);
  const sameOrigin=!req.headers.origin||req.headers.origin==='http://'+host;
  if(!local||!sameOrigin||req.headers['sec-fetch-site']==='cross-site'||req.headers['x-forwarded-for']||!['GET','HEAD'].includes(req.method)||!routes.has(route)){
   res.writeHead(404,{'Cache-Control':'no-store'});res.end();return true;
  }
  const file=path.join(base,routes.get(route)),size=fs.statSync(file).size;
  let start=0,end=size-1,status=200;
  if(req.headers.range){
   const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
   if(!match||(!match[1]&&!match[2])){res.writeHead(416,{'Content-Range':`bytes */${size}`});res.end();return true;}
   if(!match[1])start=Math.max(0,size-Number(match[2]));
   else{start=Number(match[1]);if(match[2])end=Math.min(end,Number(match[2]));}
   if(!Number.isSafeInteger(start)||start>end||start>=size){res.writeHead(416,{'Content-Range':`bytes */${size}`});res.end();return true;}status=206;
  }
  res.writeHead(status,{'Content-Type':file.endsWith('.json')?'application/json':file.endsWith('.wav')?'audio/wav':'audio/mp4',
   'Cache-Control':'no-store','Cross-Origin-Resource-Policy':'same-origin','X-Content-Type-Options':'nosniff',
   'Accept-Ranges':'bytes','Content-Length':end-start+1,...(status===206?{'Content-Range':`bytes ${start}-${end}/${size}`}:{})});
  if(req.method==='HEAD')res.end();else{const stream=fs.createReadStream(file,{start,end});stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res);}return true;
 };
}
module.exports={createAudioPreview};
