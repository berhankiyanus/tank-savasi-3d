// Explicit upstream imports; output hashes are written for the commercial release audit.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),sharp=require('sharp');
const ROOT=path.resolve(__dirname,'../..');process.chdir(ROOT);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
fs.mkdirSync('review-2026-09-26/license-audit',{recursive:true});
const records=[];const headers={'User-Agent':'TankSavasi-LicenseAudit/1.0'};
async function get(url){const r=await fetch(url,{headers});if(!r.ok)throw Error(`${r.status} ${url}`);return Buffer.from(await r.arrayBuffer());}
async function imported(url,out,transform){const raw=await get(url),b=transform?await transform(raw):raw;fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,b);records.push({file:out,source:url,downloadSha256:sha(raw),sha256:sha(b),transformation:transform?'resize/re-encode; see this script':'none'});}
(async()=>{
const mapping={asphalt:'asphalt_03',ground:'brown_mud_leaves_01',grass:'leafy_grass',sand:'aerial_beach_01',snow:'snow_02',wall:'brick_wall_001'};
for(const [prefix,id] of Object.entries(mapping)){
 const api=await get('https://api.polyhaven.com/files/'+id),j=JSON.parse(api);fs.writeFileSync(`legal/evidence/${id}-files.json`,api);
 const info=await get('https://api.polyhaven.com/info/'+id);fs.writeFileSync(`legal/evidence/${id}-info.json`,info);
 for(const [suffix,key] of Object.entries({diff:'Diffuse',nor:'nor_gl',ao:'AO',rough:'Rough'})){
 const src=j[key]['1k'].jpg;const raw=await get(src.url);
 if(crypto.createHash('md5').update(raw).digest('hex')!==src.md5)throw Error('Upstream checksum mismatch');
 const file=`assets/textures/${prefix}_${suffix}.jpg`,b=await sharp(raw).resize(suffix==='diff'?1024:512).jpeg({quality:suffix==='nor'?88:82}).toBuffer();
 const backup=`review-2026-09-26/license-audit/old-${prefix}_${suffix}.jpg`;if(!fs.existsSync(backup))fs.copyFileSync(file,backup);fs.writeFileSync(file,b);
 records.push({file,asset:id,author:JSON.parse(info).authors,license:'CC0-1.0',source:src.url,sourcePage:`https://polyhaven.com/a/${id}`,downloadSha256:sha(raw),upstreamMd5:src.md5,sha256:sha(b),transformation:`Sharp resize ${suffix==='diff'?1024:512}px; JPEG ${suffix==='nor'?88:82}`});
 }console.log('Verified texture set:',id);
}
for(const [id,out] of [['kloofendal_48d_partly_cloudy_puresky','/tmp/tank-audit-outdoor.hdr'],['studio_small_09','/tmp/tank-audit-studio.hdr']]){
 const j=JSON.parse(fs.readFileSync(`legal/evidence/${id}-files.json`));await imported(j.hdri['1k'].hdr.url,out);records.at(-1).asset=id;
 fs.writeFileSync(`legal/evidence/${id}-info.json`,await get('https://api.polyhaven.com/info/'+id));
}
const base='https://raw.githubusercontent.com/google/fonts/main/ofl/barlowsemicondensed/';
await imported(base+'BarlowSemiCondensed-SemiBold.ttf','assets/fonts/BarlowSemiCondensed-SemiBold.ttf');
await imported(base+'OFL.txt','legal/licenses/Barlow-OFL.txt');
await imported('https://raw.githubusercontent.com/google/fonts/main/ofl/russoone/OFL.txt','legal/licenses/Archived-Russo-OFL.txt');
await imported('https://raw.githubusercontent.com/mrdoob/three.js/r160/LICENSE','legal/licenses/three-r160-MIT.txt');
fs.writeFileSync('legal/evidence/verified-downloads.json',JSON.stringify({checkedAt:new Date().toISOString(),files:records},null,2)+'\n');
})().catch(e=>{console.error(e);process.exit(1)});
