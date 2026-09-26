// Technical preflight is deliberately distinct from external submission readiness.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');process.chdir(root);
const metadata=require('../appstore/metadata.json'),release=require('../native/ios/release.json');
const checks=[],blockers=[];
function check(name,fn){try{if(fn()===false)throw Error('check failed');checks.push({name,pass:true});}catch(e){checks.push({name,pass:false,detail:e.message});}}
const read=f=>fs.readFileSync(f,'utf8');
const plist=f=>JSON.parse(execFileSync('plutil',['-convert','json','-o','-',f],{encoding:'utf8'}));
const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name)]);
check('Reviewed release assets and dependency licenses',()=>require('../legal/verify-release.cjs').verifyRelease());
check('Every shipped JavaScript module parses',()=>{for(const file of require('../release-policy.cjs').files.filter(f=>/\.m?js$/.test(f)))execFileSync(process.execPath,['--input-type=module','--check'],{input:read(file),stdio:['pipe','pipe','pipe']});});
const digest=crypto.createHash('sha256');for(const file of [...require('../release-policy.cjs').files].sort()){digest.update(file+'\0');digest.update(fs.readFileSync(file));}const sourceDigest=digest.digest('hex');
check('Packaged web source matches the current release revision',()=>JSON.parse(read('www/build-info.json')).sourceDigest===sourceDigest);
check('App metadata lengths and matching versions',()=>{
 if(metadata.version!==release.version||metadata.build!==release.build||!read('main.js').includes(`const GAME_VER = '${release.version}'`))return false;
 if(metadata.name.length>30||metadata.bundleId!==require('../capacitor.config.json').appId)return false;
 for(const l of Object.values(metadata.localizations))if(l.subtitle.length>30||l.promotionalText.length>170||l.description.length>4000||Buffer.byteLength(l.keywords)>100)return false;
 return true;
});
check('Support, privacy and safety are bundled offline',()=>['support.html','privacy.html','licenses.html','game/privacy.mjs'].every(f=>fs.existsSync('www/'+f)&&read('sw.js').includes(`'${f}'`)));
check('No payment or advertising provider is enabled',()=>/const IAP_ENABLED = false/.test(read('main.js'))&&!Object.keys(require('../package.json').dependencies).some(k=>/admob|purchases|in-app-purchase/i.test(k)));
check('Generated iOS orientation and privacy manifest',()=>{
 const info=plist('ios/App/App/Info.plist'),m=plist('ios/App/App/PrivacyInfo.xcprivacy');
 return info.UIRequiresFullScreen===true&&info.ITSAppUsesNonExemptEncryption===false&&info.UISupportedInterfaceOrientations.every(v=>v.includes('Landscape'))&&info['UISupportedInterfaceOrientations~ipad'].every(v=>v.includes('Landscape'))&&m.NSPrivacyTracking===false&&m.NSPrivacyCollectedDataTypes.length>=5&&hash('native/ios/PrivacyInfo.xcprivacy')===hash('ios/App/App/PrivacyInfo.xcprivacy');
});
check('Standard web/iOS payload excludes private audition recordings',()=>{
 for(const dir of ['www','ios/App/App/public']){const names=walk(dir);if(names.some(f=>f.includes('_audio-preview')||f.includes('.local-audio')))return false;}
 return read('www/game/audio.mjs').includes('this.preview=previewEnabled(href)');
});
const appIndex=process.argv.indexOf('--app'),app=appIndex>=0?process.argv[appIndex+1]:null;
if(app)check('Release archive metadata and privacy resource',()=>{
 const info=plist(path.join(app,'Info.plist'));
 return info.CFBundleIdentifier===metadata.bundleId&&info.CFBundleShortVersionString===release.version&&String(info.CFBundleVersion)===String(release.build)&&hash(path.join(app,'PrivacyInfo.xcprivacy'))===hash('native/ios/PrivacyInfo.xcprivacy')&&JSON.parse(read(path.join(app,'public/build-info.json'))).sourceDigest===sourceDigest&&!walk(app).some(f=>f.includes('_audio-preview'));
});
async function run(){
 if(process.argv.includes('--live')){
  for(const [label,url] of [['support',metadata.supportURL],['privacy',metadata.privacyURL],['arena',new URL('/api/arena/status',metadata.supportURL).href]]){
   try{const r=await fetch(url,{signal:AbortSignal.timeout(15000)});if(!r.ok)throw Error('HTTP '+r.status);if(label==='arena'){const s=await r.json();if(!s.available||s.development)throw Error('Production Arena unavailable');}checks.push({name:'Live '+label,pass:true});}
   catch(e){checks.push({name:'Live '+label,pass:false,detail:e.message});}
  }
 }
 for(const item of require('../appstore/readiness.json').gates)if(item.status!=='verified')blockers.push({id:item.id,reason:item.reason});
 const result={checkedAt:new Date().toISOString(),technicalPassed:checks.every(c=>c.pass),submissionReady:checks.every(c=>c.pass)&&blockers.length===0,checks,submissionBlockers:blockers};
 console.log(JSON.stringify(result,null,2));process.exitCode=result.submissionReady?0:result.technicalPassed?2:1;
}
run().catch(e=>{console.error(e.message);process.exitCode=1;});
