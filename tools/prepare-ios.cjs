// Reproducible customizations: generated ios/ is deliberately not committed.
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),app=path.join(root,'ios/App/App');
if(!fs.existsSync(app))throw Error('Run npx cap add ios first.');
fs.copyFileSync(path.join(root,'native/ios/ArenaVault.swift'),path.join(app,'ArenaVault.swift'));
const pbx=path.join(root,'ios/App/App.xcodeproj/project.pbxproj');let s=fs.readFileSync(pbx,'utf8');
if(!s.includes('F13D00010000000000000001')){
 s=s.replace('/* Begin PBXBuildFile section */','/* Begin PBXBuildFile section */\n\t\tF13D00010000000000000001 /* ArenaVault.swift in Sources */ = {isa = PBXBuildFile; fileRef = F13D00010000000000000002; };');
 s=s.replace('/* Begin PBXFileReference section */','/* Begin PBXFileReference section */\n\t\tF13D00010000000000000002 /* ArenaVault.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = ArenaVault.swift; sourceTree = "<group>"; };');
 s=s.replace('504EC3071FED79650016851F /* AppDelegate.swift */,','504EC3071FED79650016851F /* AppDelegate.swift */,\n\t\t\t\tF13D00010000000000000002 /* ArenaVault.swift */,');
 s=s.replace('504EC3081FED79650016851F /* AppDelegate.swift in Sources */,','504EC3081FED79650016851F /* AppDelegate.swift in Sources */,\n\t\t\t\tF13D00010000000000000001 /* ArenaVault.swift in Sources */,');
 fs.writeFileSync(pbx,s);
}
const story=path.join(app,'Base.lproj/Main.storyboard');fs.writeFileSync(story,fs.readFileSync(story,'utf8').replace('customClass="CAPBridgeViewController" customModule="Capacitor"','customClass="FieldBridgeController" customModule="App"'));
const plist=path.join(app,'Info.plist');s=fs.readFileSync(plist,'utf8');s=s.replace(/(<key>UISupportedInterfaceOrientations(?:~ipad)?<\/key>\s*<array>)[\s\S]*?(<\/array>)/g,'$1\n<string>UIInterfaceOrientationLandscapeLeft</string>\n<string>UIInterfaceOrientationLandscapeRight</string>\n$2');fs.writeFileSync(plist,s);
console.log('iOS: landscape and Keychain plugin prepared.');
