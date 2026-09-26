// Private device audition: generate an isolated Debug app, never modify the release payload.
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),privateRoot=path.join(root,'.local-audio');
const source=path.join(root,'ios'),destination=path.join(privateRoot,'ios-preview');
const preview=path.join(privateRoot,'preview');
const bundleId=require('../capacitor.config.json').appId+'.audiopreview';
const manifest=JSON.parse(fs.readFileSync(path.join(preview,'manifest.json'),'utf8'));
if(manifest.version!==1||manifest.licenseStatus!=='pending-local-preview')throw Error('Prepare the private audio selection first.');
const audioFiles=['manifest.json'];
for(const track of Object.values(manifest.tracks)){
  if(!/^\/_audio-preview\/[a-z0-9-]+\.(wav|m4a)$/.test(track.url))throw Error('Unexpected audio path');
  const name=path.basename(track.url),file=fs.realpathSync(path.join(preview,name));
  if(path.dirname(file)!==fs.realpathSync(preview))throw Error('Audio escapes private directory');
  audioFiles.push(name);
}
for(const script of ['build-www.js','node_modules/@capacitor/cli/bin/capacitor','tools/prepare-ios.cjs']){
  const args=script.includes('/bin/')?['sync','ios']:[];
  execFileSync(process.execPath,[path.join(root,script),...args],{cwd:root,stdio:'inherit'});
}
const project=path.join(destination,'App','App.xcodeproj'),pbx=path.join(project,'project.pbxproj');
const previous=fs.existsSync(pbx)?fs.readFileSync(pbx,'utf8'):'';
const team=process.env.TREAD_PREVIEW_TEAM||previous.match(/DEVELOPMENT_TEAM = ([A-Z0-9]+);/)?.[1];
if(team&&!/^[A-Z0-9]{10}$/.test(team))throw Error('Invalid preview signing team');
fs.cpSync(source,destination,{recursive:true,filter:p=>!['build','DerivedData','xcuserdata','.DS_Store'].includes(path.basename(p))});
const app=path.join(destination,'App','App'),web=path.join(app,'public');
const privateAudio=path.join(web,'_audio-preview');fs.mkdirSync(privateAudio,{recursive:true});
for(const file of audioFiles)fs.copyFileSync(path.join(preview,file),path.join(privateAudio,file));
const modulePath=path.join(web,'game','audio.mjs');let audio=fs.readFileSync(modulePath,'utf8');
const optIn='this.preview=previewEnabled(href);';
if(!audio.includes(optIn))throw Error('Audio preview opt-in changed; review required');
audio=audio.replace(optIn,"this.preview=new URL(href).protocol==='capacitor:' && new URL(href).hostname==='localhost';");
fs.writeFileSync(modulePath,audio);
const configPath=path.join(app,'capacitor.config.json'),config=JSON.parse(fs.readFileSync(configPath,'utf8'));
config.appId=bundleId;config.appName='TREAD Ses Testi';delete config.server?.url;
fs.writeFileSync(configPath,JSON.stringify(config,null,2));
const plist=path.join(app,'Info.plist');fs.writeFileSync(plist,fs.readFileSync(plist,'utf8').replace(/(<key>CFBundleDisplayName<\/key>\s*<string>)[^<]*(<\/string>)/,'$1TREAD Ses Testi$2'));
// The copied package is one directory deeper than the standard ios/ project.
const packagePath=path.join(destination,'App','CapApp-SPM','Package.swift');
fs.writeFileSync(packagePath,fs.readFileSync(packagePath,'utf8').replaceAll('../../../node_modules/','../../../../node_modules/'));
let projectText=fs.readFileSync(pbx,'utf8');
projectText=projectText.replace(/PRODUCT_BUNDLE_IDENTIFIER = [^;]+;/g,'PRODUCT_BUNDLE_IDENTIFIER = '+bundleId+';');
if(team&&!projectText.includes('DEVELOPMENT_TEAM ='))projectText=projectText.replaceAll('CODE_SIGN_STYLE = Automatic;','CODE_SIGN_STYLE = Automatic;\n\t\t\t\tDEVELOPMENT_TEAM = '+team+';');
const phaseId='F13DA0D10000000000000001';
const guard='if [ "$CONFIGURATION" != "Debug" ] || [ "$ACTION" = "install" ] || [ "$DEPLOYMENT_LOCATION" = "YES" ]; then\n  echo "error: Private audio audition is Debug-only. Use the standard ios project for releases."\n  exit 1\nfi\n';
projectText=projectText.replace('buildPhases = (','buildPhases = (\n\t\t\t\t'+phaseId+' /* Private audio Debug guard */,');
projectText=projectText.replace('/* Begin PBXSourcesBuildPhase section */',`/* Begin PBXShellScriptBuildPhase section */
\t\t${phaseId} /* Private audio Debug guard */ = {
\t\t\tisa = PBXShellScriptBuildPhase;
\t\t\tbuildActionMask = 2147483647;
\t\t\talwaysOutOfDate = 1;
\t\t\tfiles = (); inputPaths = (); outputPaths = ();
\t\t\tname = "Private audio Debug guard";
\t\t\trunOnlyForDeploymentPostprocessing = 0;
\t\t\tshellPath = /bin/sh;
\t\t\tshellScript = ${JSON.stringify(guard)};
\t\t};
/* End PBXShellScriptBuildPhase section */

/* Begin PBXSourcesBuildPhase section */`);
fs.writeFileSync(pbx,projectText);
const delegate=path.join(app,'AppDelegate.swift');
fs.writeFileSync(delegate,'#if !DEBUG\n#error("Private audio audition must not be built for release")\n#endif\n'+fs.readFileSync(delegate,'utf8'));
fs.writeFileSync(path.join(destination,'PRIVATE-AUDIO-PREVIEW.json'),JSON.stringify({licenseStatus:'pending-local-preview',bundleId,files:audioFiles,createdAt:new Date().toISOString()},null,2));
console.log('\nDevice audio preview ready: '+project+'\nApp: TREAD Ses Testi\nPrivate Debug build only; standard ios/ and www/ contain no purchased audio.');
