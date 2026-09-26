import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const {files,register,isAllowed}=require('../release-policy.cjs');
const {verifyRelease,validateRecords}=require('../legal/verify-release.cjs');
test('release payload passes source, license, integrity and runtime-reference checks',()=>{
 assert(verifyRelease().approved>80);
 for(const r of register.files.filter(r=>!r.release)){assert(!files.includes(r.file));assert(!isAllowed('/'+r.file));}
 assert(!isAllowed('/assets/unreviewed-upload.glb'));assert(!isAllowed('/legal/evidence/ios-Package.resolved.json'));
 assert(isAllowed('/licenses.html'));assert(isAllowed('/assets/tank_recruit_mk2.glb'));
});
test('changed or unreviewed assets stop packaging',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'tank-license-test-'));
 try{
  fs.writeFileSync(path.join(dir,'asset.bin'),'reviewed');
  const row={file:'asset.bin',release:true,status:'project-authored',source:'fixture source',sha256:crypto.createHash('sha256').update('reviewed').digest('hex')};
  validateRecords([row],dir);
  assert.throws(()=>validateRecords([{...row,status:'unknown'}],dir),/Unreviewed/);
  assert.throws(()=>validateRecords([{...row,status:'verified-license',license:'MIT'}],dir),/license evidence/);
  fs.writeFileSync(path.join(dir,'asset.bin'),'replacement');
  assert.throws(()=>validateRecords([row],dir),/content changed/);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('every shipped GLB is self-contained, with no hidden external images or buffer downloads',()=>{
 for(const r of register.files.filter(r=>r.release&&r.file.endsWith('.glb'))){
  const b=fs.readFileSync(r.file);assert.equal(b.readUInt32LE(8),b.length,r.file);
  const g=JSON.parse(b.toString('utf8',20,20+b.readUInt32LE(12)));
  assert(g.buffers.every(v=>!v.uri),r.file);assert(!g.images?.length,r.file);
 }
});
test('offline license page includes font copyrights, MIT text and Cordova Apache notice',()=>{
 const html=fs.readFileSync('licenses.html','utf8');
 for(const phrase of ['Barlow Project Authors','Copyright 2013 Google LLC','Apache Cordova','Apache License','Permission is hereby granted','Kenney'])assert(html.includes(phrase),phrase);
 assert(fs.readFileSync('sw.js','utf8').includes("'licenses.html'"));
});
test('standalone advertising exports contain reviewed Mk2 models and full font/software notices',()=>{
 for(const name of ['tank-savasi-playable.html','tank-savasi-playable-google.html']){
  const html=fs.readFileSync('tools/playable/dist/'+name,'utf8');
  const match=html.match(/window\.__PA = \{ player: "([^"]+)", enemy: "([^"]+)", boss: "([^"]+)"/);
  assert(match,'embedded models');
  for(const [i,id]of ['goldking','recruit','heavy'].entries())assert(Buffer.from(match[i+1],'base64').equals(fs.readFileSync(`assets/tank_${id}_mk2.glb`)),id);
  for(const notice of ['Copyright © 2010-2023 three.js authors','Barlow Project Authors','Copyright 2013 Google LLC'])assert(html.includes(notice),notice);
  assert(!html.includes('%%'));assert(html.includes('id="pa-licenses"'));
 }
});
