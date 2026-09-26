const fs=require('fs'),path=require('path'),crypto=require('crypto');
const ROOT=path.resolve(__dirname,'..');const {files,register}=require('../release-policy.cjs');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function validateRecords(rows,root=ROOT){
 const seen=new Set();
 for(const r of rows){
  if(!r.release)continue;
  if(seen.has(r.file)||r.file.includes('..')||path.isAbsolute(r.file))throw Error('Unsafe or duplicate record: '+r.file);seen.add(r.file);
  if(!['project-authored','verified-license','license-notice'].includes(r.status))throw Error('Unreviewed asset: '+r.file);
  if(r.status!=='license-notice'&&!r.source)throw Error('Missing source: '+r.file);
  if(r.status==='verified-license'&&(!r.license||!r.licenseFile||!fs.existsSync(path.join(root,r.licenseFile))))throw Error('Missing license evidence: '+r.file);
  if(sha(fs.readFileSync(path.join(root,r.file)))!==r.sha256)throw Error('Reviewed content changed: '+r.file);
 }
}
function verifyRelease(){
 validateRecords(register.files);
 validateRecords(require('./native-art-register.json').files);
 for(const f of files)if(!fs.existsSync(path.join(ROOT,f)))throw Error('Missing release file '+f);
 const allowed=new Set(files);
 for(const f of files.filter(f=>!f.startsWith('libs/')&&/\.(m?js|html|css|json)$/.test(f))){
  const s=fs.readFileSync(path.join(ROOT,f),'utf8');
  for(const m of s.matchAll(/assets\/[a-zA-Z0-9_./-]+\.(?:glb|hdr|jpg|png|ttf|woff2)/g))if(!allowed.has(m[0]))throw Error('Unapproved runtime reference '+m[0]+' in '+f);
 }
 const sbom=JSON.parse(fs.readFileSync(path.join(ROOT,'legal/software-sbom.json')));
 if(sbom.lockSha256!==sha(fs.readFileSync(path.join(ROOT,'package-lock.json'))))throw Error('Dependency lock changed; review software licenses and refresh SBOM.');
 return {approved:register.files.filter(r=>r.release).length,excluded:register.files.filter(r=>!r.release).length};
}
module.exports={verifyRelease,validateRecords};
if(require.main===module)console.log('Release license gate:',verifyRelease());
