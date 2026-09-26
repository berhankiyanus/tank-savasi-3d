// Collect actual notices without inferring copyright ownership from SPDX labels.
const fs=require('fs'),path=require('path'),crypto=require('crypto');process.chdir(path.resolve(__dirname,'..'));
const lock=JSON.parse(fs.readFileSync('package-lock.json')),rows=[],notices=[];
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
for(const [p,v]of Object.entries(lock.packages)){
 if(!p)continue;const exists=fs.existsSync(p),name=p.split('node_modules/').at(-1);
 const texts=exists?fs.readdirSync(p).filter(f=>/^(licen[sc]e|copying|notice)(\.|$)/i.test(f)&&fs.statSync(path.join(p,f)).isFile()).map(f=>({path:p+'/'+f,text:fs.readFileSync(p+'/'+f,'utf8')})):[];
 if(!texts.length && ['pg-types','pgpass'].includes(name)){const readme=fs.readFileSync(p+'/README.md','utf8');const start=readme.search(/^## license/im);if(start<0)throw Error('No license in README '+name);texts.push({path:p+'/README.md#license',text:readme.slice(start)});}
 const row={name,version:v.version,scope:v.dev?'build-tool':'runtime',declaredLicense:v.license,installed:exists,integrity:v.integrity,source:v.resolved,notices:texts.map(t=>({path:t.path,sha256:hash(t.text)}))};
 if(v.license==='SEE LICENSE')row.reviewedLicense='MIT (local complete license text)';
 if(name==='gitconfiglocal')row.reviewStatus='Unresolved BSD variant: package has only generic BSD metadata, no full license text; build-tool only, not bundled in game';
 rows.push(row);
 if(!v.dev){if(!texts.length)throw Error('Missing runtime license '+p);notices.push('=== '+name+' '+v.version+' ===\n'+texts.map(t=>t.text).join('\n'));}
}
fs.writeFileSync('legal/software-sbom.json',JSON.stringify({lockSha256:hash(fs.readFileSync('package-lock.json')),packages:rows},null,2)+'\n');
fs.writeFileSync('legal/licenses/npm-runtime-NOTICES.txt',notices.join('\n\n'));
if(fs.existsSync('/tmp/tank-ios-recovery-build/SourcePackages/checkouts/capacitor-swift-pm/LICENSE.md')) fs.writeFileSync('legal/licenses/Capacitor-SPM-MIT.txt',fs.readFileSync('/tmp/tank-ios-recovery-build/SourcePackages/checkouts/capacitor-swift-pm/LICENSE.md'));
if(fs.existsSync('ios/App/App.xcodeproj/project.xcworkspace/xcshareddata/swiftpm/Package.resolved')) fs.writeFileSync('legal/evidence/ios-Package.resolved.json',fs.readFileSync('ios/App/App.xcodeproj/project.xcworkspace/xcshareddata/swiftpm/Package.resolved'));
console.log(rows.length+' lockfile records; '+notices.length+' runtime notices collected.');
