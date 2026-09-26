// Packaging only: resize approved generated artwork for platform slots; keep sources intact.
const fs=require('fs'),path=require('path'),sharp=require('sharp');
process.chdir(path.resolve(__dirname,'../..'));
(async()=>{
 const icon='design/brand/tank-icon-source.png',logo='design/brand/tread-rivals-logo-source.png';
 for(const n of [192,512,1024])await sharp(icon).resize(n,n).flatten({background:'#09162e'}).png().toFile(`assets/icon-${n}.png`);
 await sharp(logo).resize({width:1200}).png({palette:true,quality:90,compressionLevel:9}).toFile('assets/tread-rivals-logo.png');
 fs.copyFileSync('assets/icon-1024.png','resources/icon.png');fs.copyFileSync('assets/icon-512.png','resources/store/play-icon-512.png');
 const lockup=await sharp(logo).resize({width:1180}).toBuffer();
 for(const name of ['splash.png','splash-dark.png'])await sharp({create:{width:2732,height:2732,channels:3,background:'#09162e'}}).composite([{input:lockup,gravity:'center'}]).png().toFile('resources/'+name);
 await sharp({create:{width:1024,height:500,channels:3,background:'#09162e'}}).composite([{input:await sharp(logo).resize({width:900}).toBuffer(),gravity:'center'}]).jpeg({quality:92}).toFile('resources/store/feature-1024x500.jpg');
})();
