// Reproducible customizations: generated ios/ is deliberately not committed.
const fs=require('fs'),path=require('path');
function writeIfChanged(file,value){const bytes=Buffer.isBuffer(value)?value:Buffer.from(value);if(!fs.existsSync(file)||!fs.readFileSync(file).equals(bytes))fs.writeFileSync(file,bytes);}
function copyIfChanged(source,destination){writeIfChanged(destination,fs.readFileSync(source));}
const root=path.resolve(__dirname,'..'),app=path.join(root,'ios/App/App');
if(!fs.existsSync(app))throw Error('Run npx cap add ios first.');
copyIfChanged(path.join(root,'native/ios/ArenaVault.swift'),path.join(app,'ArenaVault.swift'));
const pbx=path.join(root,'ios/App/App.xcodeproj/project.pbxproj');let s=fs.readFileSync(pbx,'utf8');
if(!s.includes('F13D00010000000000000001')){
 s=s.replace('/* Begin PBXBuildFile section */','/* Begin PBXBuildFile section */\n\t\tF13D00010000000000000001 /* ArenaVault.swift in Sources */ = {isa = PBXBuildFile; fileRef = F13D00010000000000000002; };');
 s=s.replace('/* Begin PBXFileReference section */','/* Begin PBXFileReference section */\n\t\tF13D00010000000000000002 /* ArenaVault.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = ArenaVault.swift; sourceTree = "<group>"; };');
 s=s.replace('504EC3071FED79650016851F /* AppDelegate.swift */,','504EC3071FED79650016851F /* AppDelegate.swift */,\n\t\t\t\tF13D00010000000000000002 /* ArenaVault.swift */,');
 s=s.replace('504EC3081FED79650016851F /* AppDelegate.swift in Sources */,','504EC3081FED79650016851F /* AppDelegate.swift in Sources */,\n\t\t\t\tF13D00010000000000000001 /* ArenaVault.swift in Sources */,');
 writeIfChanged(pbx,s);
}
const story=path.join(app,'Base.lproj/Main.storyboard');writeIfChanged(story,fs.readFileSync(story,'utf8').replace('customClass="CAPBridgeViewController" customModule="Capacitor"','customClass="FieldBridgeController" customModule="App"'));
const plist=path.join(app,'Info.plist');s=fs.readFileSync(plist,'utf8');s=s.replace(/(<key>UISupportedInterfaceOrientations(?:~ipad)?<\/key>\s*<array>)[\s\S]*?(<\/array>)/g,'$1\n<string>UIInterfaceOrientationLandscapeLeft</string>\n<string>UIInterfaceOrientationLandscapeRight</string>\n$2');writeIfChanged(plist,s);
console.log('iOS: landscape and Keychain plugin prepared.');
// Keep the installed name and launch artwork reproducible after every Capacitor sync.
const config=require('../capacitor.config.json');
const escapeXML=v=>v.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
let info=fs.readFileSync(plist,'utf8');info=info.replace(/(<key>CFBundleDisplayName<\/key>\s*<string>)[^<]*(<\/string>)/,'$1'+escapeXML(config.appName)+'$2');writeIfChanged(plist,info);
const catalogue=path.join(app,'Assets.xcassets');
const icons=path.join(catalogue,'AppIcon.appiconset');fs.mkdirSync(icons,{recursive:true});
copyIfChanged(path.join(root,'resources/icon.png'),path.join(icons,'AppIcon-512@2x.png'));
writeIfChanged(path.join(icons,'Contents.json'),JSON.stringify({images:[{filename:'AppIcon-512@2x.png',idiom:'universal',platform:'ios',size:'1024x1024'}],info:{author:'xcode',version:1}},null,2));
const splash=path.join(catalogue,'Splash.imageset');fs.mkdirSync(splash,{recursive:true});
// Only generated, unreferenced Capacitor launch images; the reviewed source stays in resources/.
for(const file of fs.readdirSync(splash))if(file!=='Contents.json'&&file!=='TreadRivals.png'&&file.endsWith('.png'))fs.unlinkSync(path.join(splash,file));
copyIfChanged(path.join(root,'resources/splash.png'),path.join(splash,'TreadRivals.png'));
writeIfChanged(path.join(splash,'Contents.json'),JSON.stringify({images:[{filename:'TreadRivals.png',idiom:'universal'}],info:{author:'xcode',version:1}},null,2));
console.log('iOS: '+config.appName+' icon and launch artwork installed.');
// Native release metadata and first-party privacy declaration survive regeneration.
const release=require('../native/ios/release.json');
if(!/^\d+\.\d+\.\d+$/.test(release.version)||!Number.isSafeInteger(release.build)||release.build<1)throw Error('Invalid iOS release version.');
s=fs.readFileSync(pbx,'utf8');
s=s.replace(/MARKETING_VERSION = [^;]+;/g,`MARKETING_VERSION = ${release.version};`).replace(/CURRENT_PROJECT_VERSION = [^;]+;/g,`CURRENT_PROJECT_VERSION = ${release.build};`);
copyIfChanged(path.join(root,'native/ios/PrivacyInfo.xcprivacy'),path.join(app,'PrivacyInfo.xcprivacy'));
if(!s.includes('F13D00020000000000000001')){
 s=s.replace('/* Begin PBXBuildFile section */','/* Begin PBXBuildFile section */\n\t\tF13D00020000000000000001 /* PrivacyInfo.xcprivacy in Resources */ = {isa = PBXBuildFile; fileRef = F13D00020000000000000002; };');
 s=s.replace('/* Begin PBXFileReference section */','/* Begin PBXFileReference section */\n\t\tF13D00020000000000000002 /* PrivacyInfo.xcprivacy */ = {isa = PBXFileReference; lastKnownFileType = text.xml; path = PrivacyInfo.xcprivacy; sourceTree = "<group>"; };');
 s=s.replace('504EC3131FED79650016851F /* Info.plist */,','504EC3131FED79650016851F /* Info.plist */,\n\t\t\t\tF13D00020000000000000002 /* PrivacyInfo.xcprivacy */,');
 s=s.replace('50B271D11FEDC1A000F3C39B /* public in Resources */,','50B271D11FEDC1A000F3C39B /* public in Resources */,\n\t\t\t\tF13D00020000000000000001 /* PrivacyInfo.xcprivacy in Resources */,');
}
writeIfChanged(pbx,s);
info=fs.readFileSync(plist,'utf8');
// The game requires landscape full-screen on iPad as well as iPhone.
if(!info.includes('<key>UIRequiresFullScreen</key>'))info=info.replace('</dict>','<key>UIRequiresFullScreen</key><true/>\n</dict>');
// Only OS-provided TLS/WSS and Keychain; no bundled/custom encryption implementation.
if(!info.includes('<key>ITSAppUsesNonExemptEncryption</key>'))info=info.replace('</dict>','<key>ITSAppUsesNonExemptEncryption</key><false/>\n</dict>');
writeIfChanged(plist,info);
console.log(`iOS: ${release.version} (${release.build}), privacy manifest and full-screen landscape prepared.`);
