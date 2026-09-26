// Original cosmetic collection. Prices are earned in-game gold; no combat stats.
const item = (id,tr,en,price,r,extra={}) => ({id,name:{tr,en},price,r,...extra});
export const DECALS = [
 item('default','Desen Yok','No Decal',0,null),
 item('dragonink','Ejder Dövmesi','Dragon Tattoo',650,'e',{set:'forge',color:'#ffbf58',paths:[
  'M60 198 Q110 218 142 180 Q164 151 201 163 Q252 183 282 136 L242 149 Q208 122 178 134 Q139 150 115 170 Q87 195 60 198Z',
  'M224 151 Q272 89 323 83 L300 45 350 67 376 34 374 73 420 73 454 110 421 109 397 139 385 115 366 114 Q336 169 284 172L294 150Z',
  'M206 140 L176 58 231 78 281 42 267 107Z',
  'M305 154 L344 182 327 217 310 190 270 179Z',
  'M131 177 L146 214 184 224 163 195Z'],cuts:['M387 86 L405 91 385 98Z']}),
 item('krakenink','Kraken Mürekkebi','Kraken Ink',600,'r',{color:'#b890ff',paths:[
  'M205 104 Q196 45 253 39 Q310 44 300 105 L280 139 223 139Z',
  'M232 117 Q202 196 137 176 Q79 165 93 118 Q105 91 121 111 Q93 149 145 149 L202 112Z',
  'M243 132 Q228 240 169 218 Q140 204 158 184 Q170 214 191 188 L219 119Z',
  'M267 123 Q298 211 359 181 Q396 157 378 126 Q373 181 322 155 L289 110Z',
  'M260 130 Q269 225 322 229 L352 208 Q313 220 287 164Z'],cuts:['M224 92 L242 98 226 111Z','M265 98 L285 91 282 109Z']}),
 item('phoenixink','Anka Kanadı','Phoenix Wing',650,'e',{set:'forge',color:'#ff7049',paths:[
  'M243 107 L274 58 296 74 280 109 305 156 267 142 253 221 225 172 207 210 215 140Z',
  'M234 124 L184 89 78 48 132 105 87 92 143 143 120 143 204 165Z',
  'M281 111 L327 75 443 39 387 103 426 84 376 138 401 136 305 160Z']}),
 item('racecheck','Yarış Şeridi','Racing Check',350,'c',{set:'stadium',color:'#f2f3ee',paths:Array.from({length:8},(_,i)=>`M${64+i*48} ${i%2?78:126}h48v48h-48Z`)}),
 item('icefang','Buz Dişi','Ice Fang',450,'r',{set:'arcticlab',color:'#83dcff',paths:[
  'M74 68 L223 107 192 166 115 208 151 150Z','M438 68 L289 107 320 166 397 208 361 150Z',
  'M256 30 L285 128 256 221 227 128Z']}),
 item('circuitink','Siber Hat','Cyber Circuit',550,'r',{set:'neonlab',color:'#48f3d6',paths:[
  'M56 79 H187 L228 120 H366 V100 H453 V119 H384 V140 H220 L179 99 H56Z',
  'M58 162 H158 L184 136 H204 L169 181 H58Z',
  'M286 148 H308 L342 181 H451 V201 H334Z','M246 62H274V90H246Z','M246 177H274V205H246Z']}),
 item('cometink','Kuyruklu Yıldız','Comet',400,'r',{color:'#ffe392',paths:[
  'M332 52 L350 100 404 107 363 141 375 194 329 166 280 192 293 139 251 106 306 100Z',
  'M69 80 L272 112 81 105Z','M46 125 L274 133 58 153Z','M99 178 L279 154 133 200Z']}),
 item('clawink','Pençe İzi','Claw Marks',350,'c',{color:'#ffdfb0',paths:[
  'M123 47 L204 64 145 212 158 136Z','M231 37 L299 62 246 226 254 130Z','M335 51 L397 75 347 215 354 131Z']}),
];
export const PROJECTILES = [
 item('default','Standart Mermi','Standard Shell',0,null,{icon:'●'}),
 ...[
 ['snowball','Kartopu','Snowball',300,'c','❄','arcticlab'],
 ['football','Futbol Topu','Football',450,'r','⚽','stadium'],
 ['basketball','Basketbol Topu','Basketball',450,'r','🏀','stadium'],
 ['tennisball','Tenis Topu','Tennis Ball',350,'c','🎾','stadium'],
 ['beachball','Plaj Topu','Beach Ball',400,'r','◉','stadium'],
 ['meteor','Kor Meteoru','Ember Meteor',700,'e','☄','forge'],
 ['crystalshot','Buz Kristali','Ice Crystal',600,'e','◇','arcticlab'],
 ['plasmacore','Plazma Çekirdeği','Plasma Core',700,'e','✦','neonlab'],
 ].map(([id,tr,en,price,r,icon,set])=>item(id,tr,en,price,r,{icon,set,glb:`assets/shot_${id}.glb`})),
];
export const WORKSHOP_ACCESSORIES = [
 item('dragonhelm','Ejder Miğferi','Dragon Helm',1200,'e',{icon:'🐉',set:'forge',slot:'t',mount:{x:0,y:1.5,z:.08}}),
 item('championcup','Şampiyon Kupası','Champion Cup',900,'r',{icon:'🏆',set:'stadium',slot:'t',mount:{x:0,y:1.5,z:.12}}),
 item('icecrown','Buz Tacı','Ice Crown',1000,'e',{icon:'❄',set:'arcticlab',slot:'t',mount:{x:0,y:1.5,z:.12}}),
 item('holodrone','Holo Drone','Holo Drone',1200,'e',{icon:'✧',set:'neonlab',slot:'t',mount:{x:0,y:1.5,z:.12}}),
 item('turbopack','Çift Turbo','Twin Turbo',1100,'r',{icon:'♨',set:'neonlab',slot:'h',mount:{x:0,y:.72,z:1.18}}),
 item('rallyrack','Ralli Lambaları','Rally Lights',750,'r',{icon:'▥',set:'stadium',slot:'t',mount:{x:0,y:1.5,z:.10}}),
].map(a=>({...a,glb:`assets/acc_${a.id}.glb`}));
export const WORKSHOP_SETS = [
 {id:'forge',name:{tr:'Ejder Ocağı',en:'Dragon Forge'},icon:'🐉',title:'forgemaster',titleName:{tr:'Ocak Ustası',en:'Forge Master'},color:'#ffab55'},
 {id:'stadium',name:{tr:'Stadyum Koleksiyonu',en:'Stadium Collection'},icon:'⚽',title:'stadiumstar',titleName:{tr:'Arena Yıldızı',en:'Arena Star'},color:'#f1d674'},
 {id:'arcticlab',name:{tr:'Kutup Laboratuvarı',en:'Arctic Lab'},icon:'❄',title:'icewarden',titleName:{tr:'Buz Muhafızı',en:'Ice Warden'},color:'#85dfff'},
 {id:'neonlab',name:{tr:'Neon Atölyesi',en:'Neon Workshop'},icon:'✧',title:'neonpilot',titleName:{tr:'Neon Pilotu',en:'Neon Pilot'},color:'#69efd3'},
].map(s=>({...s,glb:`assets/crate_${s.id}.glb`,items:[...DECALS.filter(i=>i.set===s.id).map(i=>({kind:'decal',id:i.id})),...PROJECTILES.filter(i=>i.set===s.id).map(i=>({kind:'projectile',id:i.id})),...WORKSHOP_ACCESSORIES.filter(i=>i.set===s.id).map(i=>({kind:'acc',id:i.id}))]}));

export function migrateWorkshop(p) {
 for (const [list,key,defs] of [['decals','decal',DECALS],['projectiles','projectile',PROJECTILES]]) {
  p[list]=Array.isArray(p[list])?[...new Set(p[list].filter(id=>defs.some(d=>d.id===id)))]:[];
  if(!p[list].includes('default'))p[list].unshift('default');
  if(!p[list].includes(p[key]))p[key]='default';
 }
 if(!['left','right','both'].includes(p.decalSide))p.decalSide='both';
 // One permanent starter cosmetic lets everyone try the new category immediately.
 if(!p.workshopWelcome){if(!p.projectiles.includes('snowball'))p.projectiles.push('snowball');p.workshopWelcome=true;}
}
export function decalSvg(id){
 const d=DECALS.find(x=>x.id===id);if(!d?.paths)return '';
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 256"><g fill="${d.color}">${d.paths.map(p=>`<path d="${p}"/>`).join('')}</g><g fill="#132328">${(d.cuts||[]).map(p=>`<path d="${p}"/>`).join('')}</g></svg>`;
}
