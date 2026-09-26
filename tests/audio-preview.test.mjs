import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {createAudioPreview}=require('../tools/audio-preview-server.cjs');
const release=require('../release-policy.cjs');

test('pending audio is absent from web/native allowlists; production cannot opt in',()=>{
 assert.equal(createAudioPreview(),null);
 assert.throws(()=>createAudioPreview({enabled:true,production:true}),/production/);
 for(const name of ['/_audio-preview/manifest.json','/_audio-preview/menu.m4a','/.local-audio/selection.json'])assert(!release.isAllowed(name));
 assert(!release.files.some(f=>f.startsWith('.local-audio')||f.endsWith('.mp3')||f.endsWith('.wav')||f.endsWith('.m4a')));
 const sw=fs.readFileSync('sw.js','utf8');assert(sw.includes("if (url.pathname.startsWith('/_audio-preview/')) return;"));
});
test('private preview serves byte ranges but rejects cross-site, forwarded, traversal and non-allowlisted requests',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'tread-audio-test-'));
 fs.writeFileSync(path.join(dir,'fire.wav'),'1234567890');
 fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify({licenseStatus:'pending-local-preview',tracks:{fire:{url:'/_audio-preview/fire.wav'}}}));
 const handler=createAudioPreview({enabled:true,root:dir});
 const server=http.createServer((req,res)=>{if(!handler(req,res)){res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
 const request=(url,headers={},method='GET')=>new Promise((resolve,reject)=>{const req=http.request({host:'127.0.0.1',port,path:url,method,headers},res=>{const chunks=[];res.on('data',c=>chunks.push(c));res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body:Buffer.concat(chunks).toString()}));});req.on('error',reject);req.end();});
 try{
  const r=await request('/_audio-preview/fire.wav',{Range:'bytes=2-5'});assert.equal(r.status,206);assert.equal(r.body,'3456');assert.equal(r.headers['cache-control'],'no-store');
  assert.equal((await request('/_audio-preview/fire.wav',{Range:'bytes=-3'})).body,'890');
  assert.equal((await request('/_audio-preview/fire.wav',{Range:'bytes=99-'})).status,416);
  for(const headers of [{Host:'attacker.example'},{Origin:'https://attacker.example'},{'Sec-Fetch-Site':'cross-site'},{'X-Forwarded-For':'1.2.3.4'}])assert.equal((await request('/_audio-preview/fire.wav',headers)).status,404);
  assert.equal((await request('/_audio-preview/fire.wav',{},'POST')).status,404);
  assert.equal((await request('/_audio-preview/../selection.json')).status,404);
  assert.equal((await request('/_audio-preview/source.mp3')).status,404);
 }finally{await new Promise(r=>server.close(r));fs.rmSync(dir,{recursive:true,force:true});}
});
