// Original vector identity; no borrowed icon paths or logo images.
const fs=require('fs'),path=require('path'),sharp=require('sharp');process.chdir(path.resolve(__dirname,'../..'));
(async()=>{const icon=fs.readFileSync('design/identity/app-icon.svg');for(const n of [192,512,1024])await sharp(icon).resize(n,n).png().toFile(`assets/icon-${n}.png`);await sharp(icon).png().toFile('resources/icon.png');await sharp(icon).resize(512,512).png().toFile('resources/store/play-icon-512.png');
const badge=await sharp(icon).resize(650,650).toBuffer();for(const f of ['splash.png','splash-dark.png'])await sharp({create:{width:2732,height:2732,channels:3,background:'#17221c'}}).composite([{input:badge,gravity:'center'}]).png().toFile('resources/'+f);
await sharp({create:{width:1024,height:500,channels:3,background:'#17221c'}}).composite([{input:await sharp(icon).resize(410,410).toBuffer(),gravity:'center'}]).jpeg({quality:92}).toFile('resources/store/feature-1024x500.jpg');})();
