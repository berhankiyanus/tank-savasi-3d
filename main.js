import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from './libs/jsm/loaders/RGBELoader.js';

// ---------------------------------------------------------------- dil
const L = {
  tr: {
    title: 'TANK SAVAŞI 3D',
    sub: 'Duvarların arkasına saklanan düşman tankları yok et!',
    keysDesk: 'W / ↑ &nbsp;→&nbsp; ileri &nbsp;|&nbsp; S / ↓ &nbsp;→&nbsp; geri &nbsp;|&nbsp; A / D &nbsp;→&nbsp; dön &nbsp;|&nbsp; BOŞLUK &nbsp;→&nbsp; ateş',
    keysTouch: 'Soldaki joystick &nbsp;→&nbsp; sür ve dön &nbsp;|&nbsp; Sağdaki buton &nbsp;→&nbsp; ateş',
    single: 'TEK OYUNCU', duel: 'ARKADAŞLA DÜELLO', garage: 'GARAJ', back: '‹ GERİ',
    create: 'ODA KUR', join: 'KATIL', codePh: 'KOD',
    waiting: 'Arkadaşın bekleniyor...', roomLbl: 'ODA KODU:',
    joinFail: 'Oda bulunamadı!', connFail: 'Bağlantı kurulamadı!',
    health: 'CAN', wave: 'DALGA', score: 'SKOR', you: 'SEN', opp: 'RAKİP',
    over: 'OYUN BİTTİ', fire: 'ATEŞ',
    overSub: (s, w, c) => `Skor: ${s} · Dalga ${w} · Kazanılan 🪙 ${c}`,
    duelStart: 'DÜELLO!', duelSub: k => `İlk ${k} vuruş kazanır — tek atış öldürür!`,
    youWin: 'KAZANDIN! 🏆', youLose: 'KAYBETTİN',
    duelOverSub: (a, b) => `Sonuç: ${a} - ${b}`,
    peerLeft: 'Rakip oyundan ayrıldı',
    chooseMap: 'HARİTA SEÇ', garageTitle: 'GARAJ — Tank Al & Değiştir',
    buy: 'SATIN AL', owned: 'SEÇ', selected: '✓ SEÇİLİ', locked: w => `🔒 Dalga ${w}`,
    noMoney: 'Yetersiz 🪙!', sHealth: 'Can', sSpeed: 'Hız', sFire: 'Ateş',
    reward: '🪙', bestWave: w => `En iyi: Dalga ${w}`, maxLevel: 'MAKS',
    ballBtn: '1v1 TOP MAÇI', ballSub: t => `Topu ateşle karşı base'e sok! İlk ${t} gol kazanır.`,
    golYou: 'GOL! 🎉', golOpp: 'Gol yediniz!', ballScore: 'GOL',
    rematchBtn: 'TEKRAR OYNA', leaveBtn: 'ÇIKIŞ',
    rematchWait: 'Rakip bekleniyor...', rematchPeerReady: 'Rakip tekrar oynamak istiyor!',
    puSpeed: 'HIZ! ⚡', puTriple: "3'LÜ ATIŞ!", puShield: 'KALKAN! 🛡',
    setTitle: 'AYARLAR', setSound: 'Ses', setQuality: 'Kalite', onW: 'AÇIK', offW: 'KAPALI',
    qHigh: 'YÜKSEK', qLow: 'DÜŞÜK', resumeW: 'DEVAM ET', toMenuW: 'ANA MENÜ', closeW: 'KAPAT', pausedW: 'DURAKLADI',
    coopBtn: 'KOOPERATİF', coopSub: '2-4 kişi birlikte dalgalara karşı! Oda kur veya kod ile katıl.',
    startW: 'BAŞLAT', playersW: 'oyuncu', waitHost: 'Host başlatmasını bekle...',
    bossW: 'BOSS DALGASI! ☠️', bossLbl: 'BOSS',
  },
  en: {
    title: 'TANK BATTLE 3D',
    sub: 'Destroy the enemy tanks hiding behind the walls!',
    keysDesk: 'W / ↑ &nbsp;→&nbsp; forward &nbsp;|&nbsp; S / ↓ &nbsp;→&nbsp; back &nbsp;|&nbsp; A / D &nbsp;→&nbsp; turn &nbsp;|&nbsp; SPACE &nbsp;→&nbsp; fire',
    keysTouch: 'Left joystick &nbsp;→&nbsp; drive & turn &nbsp;|&nbsp; Right button &nbsp;→&nbsp; fire',
    single: 'SINGLE PLAYER', duel: 'DUEL WITH A FRIEND', garage: 'GARAGE', back: '‹ BACK',
    create: 'CREATE ROOM', join: 'JOIN', codePh: 'CODE',
    waiting: 'Waiting for your friend...', roomLbl: 'ROOM CODE:',
    joinFail: 'Room not found!', connFail: 'Connection failed!',
    health: 'HP', wave: 'WAVE', score: 'SCORE', you: 'YOU', opp: 'RIVAL',
    over: 'GAME OVER', fire: 'FIRE',
    overSub: (s, w, c) => `Score: ${s} · Wave ${w} · Earned 🪙 ${c}`,
    duelStart: 'DUEL!', duelSub: k => `First to ${k} kills wins — one hit destroys!`,
    youWin: 'YOU WIN! 🏆', youLose: 'YOU LOSE',
    duelOverSub: (a, b) => `Result: ${a} - ${b}`,
    peerLeft: 'Your rival left the game',
    chooseMap: 'CHOOSE MAP', garageTitle: 'GARAGE — Buy & Switch Tanks',
    buy: 'BUY', owned: 'SELECT', selected: '✓ SELECTED', locked: w => `🔒 Wave ${w}`,
    noMoney: 'Not enough 🪙!', sHealth: 'HP', sSpeed: 'Speed', sFire: 'Fire',
    reward: '🪙', bestWave: w => `Best: Wave ${w}`, maxLevel: 'MAX',
    ballBtn: '1v1 BALL MATCH', ballSub: t => `Shoot the ball into the rival base! First to ${t} goals wins.`,
    golYou: 'GOAL! 🎉', golOpp: 'They scored!', ballScore: 'GOAL',
    rematchBtn: 'PLAY AGAIN', leaveBtn: 'LEAVE',
    rematchWait: 'Waiting for opponent...', rematchPeerReady: 'Opponent wants a rematch!',
    puSpeed: 'SPEED! ⚡', puTriple: 'TRIPLE SHOT!', puShield: 'SHIELD! 🛡',
    setTitle: 'SETTINGS', setSound: 'Sound', setQuality: 'Quality', onW: 'ON', offW: 'OFF',
    qHigh: 'HIGH', qLow: 'LOW', resumeW: 'RESUME', toMenuW: 'MAIN MENU', closeW: 'CLOSE', pausedW: 'PAUSED',
    coopBtn: 'CO-OP', coopSub: '2-4 players together vs waves! Create a room or join with a code.',
    startW: 'START', playersW: 'players', waitHost: 'Waiting for host to start...',
    bossW: 'BOSS WAVE! ☠️', bossLbl: 'BOSS',
  },
};
let lang = localStorage.getItem('tanklang') || ((navigator.language || 'tr').startsWith('tr') ? 'tr' : 'en');
const T = () => L[lang];

// ---------------------------------------------------------------- kalıcı profil
const DEFAULT_PROFILE = { coins: 0, owned: ['recruit'], selected: 'recruit', bestWave: 1, upgrades: {}, kills: 0, wins: 0, games: 0 };
let profile;
try {
  profile = Object.assign({}, DEFAULT_PROFILE, JSON.parse(localStorage.getItem('tankprofile') || '{}'));
  if (!Array.isArray(profile.owned) || !profile.owned.length) profile.owned = ['recruit'];
  if (!profile.upgrades || typeof profile.upgrades !== 'object') profile.upgrades = {};
  profile.kills = profile.kills || 0; profile.wins = profile.wins || 0; profile.games = profile.games || 0;
} catch { profile = Object.assign({}, DEFAULT_PROFILE); }
function saveProfile() { localStorage.setItem('tankprofile', JSON.stringify(profile)); }
function addCoins(n) { profile.coins += n; saveProfile(); updateCoinBar(); }

// ayarlar (ses / kalite)
let settings;
try { settings = Object.assign({ muted: false, quality: 'high' }, JSON.parse(localStorage.getItem('tanksettings') || '{}')); }
catch { settings = { muted: false, quality: 'high' }; }
function saveSettings() { localStorage.setItem('tanksettings', JSON.stringify(settings)); }
let paused = false;

// ---------------------------------------------------------------- tanklar
const TANKS = [
  { id: 'recruit',  name: { tr: 'Acemi',      en: 'Recruit'  }, price: 0,    color: 0x4a5d26, scale: 1.00, health: 5, speed: 8.0,  turn: 2.6, cool: 0.45, bspeed: 24 },
  { id: 'scout',    name: { tr: 'Kaşif',      en: 'Scout'    }, price: 150,  color: 0x2f7db0, scale: 0.90, health: 4, speed: 10.6, turn: 3.3, cool: 0.40, bspeed: 28 },
  { id: 'guardian', name: { tr: 'Muhafız',    en: 'Guardian' }, price: 300,  color: 0x707070, scale: 1.15, health: 8, speed: 6.4,  turn: 2.0, cool: 0.50, bspeed: 22 },
  { id: 'sniper',   name: { tr: 'Nişancı',    en: 'Sniper'   }, price: 500,  color: 0x7a3aa0, scale: 1.00, health: 5, speed: 8.6,  turn: 2.8, cool: 0.30, bspeed: 42 },
  { id: 'phantom',  name: { tr: 'Hayalet',    en: 'Phantom'  }, price: 800,  color: 0x1aa37a, scale: 1.00, health: 6, speed: 9.6,  turn: 3.0, cool: 0.33, bspeed: 32, glow: true },
  { id: 'goldking', name: { tr: 'Altın Kral', en: 'Gold King'}, price: 1500, color: 0xffcc33, scale: 1.08, health: 9, speed: 9.2,  turn: 2.9, cool: 0.30, bspeed: 36, glow: true, metal: true },
];
const tankById = id => TANKS.find(t => t.id === id) || TANKS[0];
const STAT_MAX = { health: 14, speed: 13.6, fire: 1 / 0.16 };
// tank yükseltmeleri
const UPGRADES = [
  { key: 'health', name: { tr: 'Zırh', en: 'Armor' } },
  { key: 'speed', name: { tr: 'Hız', en: 'Speed' } },
  { key: 'fire', name: { tr: 'Ateş', en: 'Fire' } },
];
const UP_MAX = 5;
const upCost = lvl => 60 * (lvl + 1);
function effTank(id) {
  const b = tankById(id);
  const u = (profile.upgrades && profile.upgrades[id]) || {};
  return Object.assign({}, b, {
    health: b.health + (u.health || 0),
    speed: b.speed + (u.speed || 0) * 0.6,
    cool: Math.max(0.16, b.cool - (u.fire || 0) * 0.03),
  });
}

// ---------------------------------------------------------------- haritalar
const MAPS = [
  { name: { tr: 'Klasik', en: 'Classic' }, req: 1, grid: [
    '#############','#...........#','#.##..#..##.#','#.#...#...#.#','#....###....#',
    '#..#.....#..#','#.#..###..#.#','#..#.....#..#','#....###....#','#.#...#...#.#',
    '#.##..#..##.#','#...........#','#############' ] },
  { name: { tr: 'Stadyum', en: 'Stadium' }, req: 2, theme: 'stadium', grid: [
    '#############','#...........#','#...........#','#....#.#....#','#...........#',
    '#.#.......#.#','#...........#','#.#.......#.#','#...........#','#....#.#....#',
    '#...........#','#...........#','#############' ] },
  { name: { tr: 'Çöl', en: 'Desert' }, req: 3, theme: 'desert', grid: [
    '#############','#...........#','#.##.....##.#','#..#.....#..#','#...........#',
    '#.....#.....#','#....#.#....#','#.....#.....#','#...........#','#..#.....#..#',
    '#.##.....##.#','#...........#','#############' ] },
  { name: { tr: 'Kar', en: 'Snow' }, req: 4, theme: 'snow', grid: [
    '#############','#...........#','#.#.#...#.#.#','#...........#','#..#.....#..#',
    '#....###....#','#...........#','#....###....#','#..#.....#..#','#...........#',
    '#.#.#...#.#.#','#...........#','#############' ] },
  { name: { tr: 'Gece', en: 'Night' }, req: 5, theme: 'night', grid: [
    '#############','#...........#','#.###...###.#','#...........#','#.#..###..#.#',
    '#...........#','#..#.....#..#','#...........#','#.#..###..#.#','#...........#',
    '#.###...###.#','#...........#','#############' ] },
  { name: { tr: 'Lav', en: 'Lava' }, req: 6, theme: 'lava', grid: [
    '#############','#...........#','#..##...##..#','#...........#','#....###....#',
    '#.#.......#.#','#...........#','#.#.......#.#','#....###....#','#...........#',
    '#..##...##..#','#...........#','#############' ] },
  { name: { tr: 'Uzay', en: 'Space' }, req: 7, theme: 'space', grid: [
    '#############','#...........#','#.#.#.#.#.#.#','#...........#','#..#.....#..#',
    '#...#...#...#','#...........#','#...#...#...#','#..#.....#..#','#...........#',
    '#.#.#.#.#.#.#','#...........#','#############' ] },
  { name: { tr: 'Açık Alan', en: 'Open Field' }, req: 9, grid: [
    '#############','#...........#','#...##.##...#','#...........#','#.##.....##.#',
    '#...........#','#....###....#','#...........#','#.##.....##.#','#...........#',
    '#...##.##...#','#...........#','#############' ] },
  { name: { tr: 'Zikzak', en: 'Zigzag' }, req: 11, grid: [
    '#############','#...........#','#.#####.....#','#.....#####.#','#.#####.....#',
    '#.....#####.#','#.#####.....#','#.....#####.#','#.#####.....#','#.....#####.#',
    '#.......###.#','#...........#','#############' ] },
];
const mapUnlocked = i => profile.bestWave >= MAPS[i].req;

// ---------------------------------------------------------------- sabitler
const CELL = 4.5;
let MAP = MAPS[0].grid;
let ROWS = MAP.length, COLS = MAP[0].length;
const WALL_H = 3.0;
const TANK_R = 1.25;
const ENEMY_SPEED = 4.6, ENEMY_TURN = 1.9, ENEMY_BSPEED = 17;
const KILL_TARGET = 5;
const KILL_COINS = 15;
const BALL_R = 1.7;
const BALL_TARGET = 3;
const BULLET_IMPULSE = 11;
const BALL_MAX_SPEED = 34;
const PITCH = { PW: 36, PH: 48, BASE: 9 };
PITCH.baseZ1 = PITCH.PH / 2 - PITCH.BASE;   // güney base sınırı (+15)
PITCH.baseZ2 = -(PITCH.PH / 2 - PITCH.BASE); // kuzey base sınırı (-15)

const cellX = c => (c - (COLS - 1) / 2) * CELL;
const cellZ = r => (r - (ROWS - 1) / 2) * CELL;
let arenaHalf = 30; // mini harita için arena yarı-boyutu

// ---------------------------------------------------------------- sahne
const IS_TOUCH = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const canvas = document.getElementById('game');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.enabled = settings.quality !== 'low';
renderer.setPixelRatio(settings.quality === 'low' ? 1 : Math.min(devicePixelRatio, IS_TOUCH ? 1.7 : 2));
function applyQuality() {
  const low = settings.quality === 'low';
  renderer.setPixelRatio(low ? 1 : Math.min(devicePixelRatio, IS_TOUCH ? 1.7 : 2));
  renderer.shadowMap.enabled = !low;
  renderer.shadowMap.needsUpdate = true;
  scene.traverse(o => {
    if (o.material) { (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { m.needsUpdate = true; }); }
  });
}
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xc9b795, 70, 160);

const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 400);
camera.position.set(0, 12, 20);

const sun = new THREE.DirectionalLight(0xfff1d6, 3.2);
sun.position.set(35, 45, 20);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -42; sun.shadow.camera.right = 42;
sun.shadow.camera.top = 42; sun.shadow.camera.bottom = -42;
sun.shadow.camera.far = 140;
sun.shadow.bias = -0.0006;
scene.add(sun);
const hemi = new THREE.HemisphereLight(0xbfd7ff, 0x6b5a3e, 0.5);
scene.add(hemi);

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// ---------------------------------------------------------------- varlık yükleme
const texLoader = new THREE.TextureLoader();
function tex(url, srgb = false, repeat = 1) {
  const t = texLoader.load(url);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const [tankGltf, envTex] = await Promise.all([
  new GLTFLoader().loadAsync('assets/tank.glb'),
  new RGBELoader().loadAsync('assets/env.hdr'),
]);
envTex.mapping = THREE.EquirectangularReflectionMapping;
scene.background = envTex;
scene.environment = envTex;

const groundMat = new THREE.MeshStandardMaterial({
  map: tex('assets/textures/ground_diff.jpg', true, 12),
  normalMap: tex('assets/textures/ground_nor.jpg', false, 12),
  roughnessMap: tex('assets/textures/ground_rough.jpg', false, 12),
  aoMap: tex('assets/textures/ground_ao.jpg', false, 12),
});
groundMat.aoMap.channel = 0;
const grassMat = new THREE.MeshStandardMaterial({
  map: tex('assets/textures/grass_diff.jpg', true, 16),
  normalMap: tex('assets/textures/grass_nor.jpg', false, 16),
  roughnessMap: tex('assets/textures/grass_rough.jpg', false, 16),
  aoMap: tex('assets/textures/grass_ao.jpg', false, 16),
});
grassMat.aoMap.channel = 0;
const ground = new THREE.Mesh(new THREE.PlaneGeometry(220, 220), groundMat);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const wallMat = new THREE.MeshStandardMaterial({
  map: tex('assets/textures/wall_diff.jpg', true),
  normalMap: tex('assets/textures/wall_nor.jpg'),
  roughnessMap: tex('assets/textures/wall_rough.jpg'),
  aoMap: tex('assets/textures/wall_ao.jpg'),
});
wallMat.aoMap.channel = 0;

// ---------------------------------------------------------------- temalar (zemin/duvar/atmosfer/dekor)
// temaya göre değişen mermi/namlu renkleri
const playerBulletMat = new THREE.MeshBasicMaterial({ color: 0xffe08a });
const enemyBulletMat = new THREE.MeshBasicMaterial({ color: 0xff7a5a });
let flashColor = 0xffc070;
// yıldız alanı (gece/uzay temaları için)
const starGeo = new THREE.BufferGeometry();
{
  const N = 600, p = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const a = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1), R = 170;
    p[i * 3] = R * Math.sin(ph) * Math.cos(a);
    p[i * 3 + 1] = Math.abs(R * Math.cos(ph)) * 0.9 + 15;
    p[i * 3 + 2] = R * Math.sin(ph) * Math.sin(a);
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(p, 3));
}
const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 1.2, sizeAttenuation: true, fog: false }));
stars.visible = false;
scene.add(stars);

const sandMat = new THREE.MeshStandardMaterial({
  map: tex('assets/textures/sand_diff.jpg', true, 14),
  normalMap: tex('assets/textures/sand_nor.jpg', false, 14),
  roughnessMap: tex('assets/textures/sand_rough.jpg', false, 14),
  aoMap: tex('assets/textures/sand_ao.jpg', false, 14),
});
sandMat.aoMap.channel = 0;
const snowMat = new THREE.MeshStandardMaterial({
  map: tex('assets/textures/snow_diff.jpg', true, 14),
  normalMap: tex('assets/textures/snow_nor.jpg', false, 14),
  roughnessMap: tex('assets/textures/snow_rough.jpg', false, 14),
  aoMap: tex('assets/textures/snow_ao.jpg', false, 14),
});
snowMat.aoMap.channel = 0;
const hedgeMat = new THREE.MeshStandardMaterial({
  map: tex('assets/textures/grass_diff.jpg', true, 2),
  normalMap: tex('assets/textures/grass_nor.jpg', false, 2),
  color: 0x8fbf6a, roughness: 0.95,
});
const sandWallMat = new THREE.MeshStandardMaterial({
  map: tex('assets/textures/wall_diff.jpg', true),
  normalMap: tex('assets/textures/wall_nor.jpg'),
  color: 0xd8b483, roughness: 0.95,
});
const iceWallMat = new THREE.MeshStandardMaterial({
  map: tex('assets/textures/wall_diff.jpg', true),
  normalMap: tex('assets/textures/wall_nor.jpg'),
  color: 0xbcdcea, roughness: 0.3, metalness: 0.3,
});
// gece: koyu tonlu zemin/duvar
const nightGroundMat = groundMat.clone(); nightGroundMat.color.setHex(0x8288a0);
const nightWallMat = wallMat.clone(); nightWallMat.color.setHex(0x9098ac);
// lav: koyu kızıl + akkor (emissive) parıltı
const lavaGroundMat = groundMat.clone(); lavaGroundMat.color.setHex(0x8a3a24); lavaGroundMat.emissive.setHex(0x5a1400); lavaGroundMat.emissiveIntensity = 0.75;
const lavaWallMat = wallMat.clone(); lavaWallMat.color.setHex(0x5a342a); lavaWallMat.emissive.setHex(0x3a0e00); lavaWallMat.emissiveIntensity = 0.5;
// uzay: metalik koyu paneller
const spaceGroundMat = groundMat.clone(); spaceGroundMat.color.setHex(0x424a60); spaceGroundMat.metalness = 0.6; spaceGroundMat.roughness = 0.45;
const spaceWallMat = wallMat.clone(); spaceWallMat.color.setHex(0x5a6478); spaceWallMat.metalness = 0.7; spaceWallMat.roughness = 0.4; spaceWallMat.emissive.setHex(0x101830); spaceWallMat.emissiveIntensity = 0.5;

// dekoratif obje malzeme + geometrileri (paylaşımlı, bir kez oluşturulur)
const dMat = {
  trunk: new THREE.MeshStandardMaterial({ color: 0x6b4a2b, roughness: 0.9 }),
  leaf: new THREE.MeshStandardMaterial({ color: 0x2f7d32, roughness: 0.85 }),
  pine: new THREE.MeshStandardMaterial({ color: 0x2b6b3a, roughness: 0.85 }),
  cactus: new THREE.MeshStandardMaterial({ color: 0x3f8a4a, roughness: 0.7 }),
  rock: new THREE.MeshStandardMaterial({ color: 0x8f8f8f, roughness: 0.95 }),
  white: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 }),
  snowcap: new THREE.MeshStandardMaterial({ color: 0xeef4ff, roughness: 0.7 }),
};
const dGeo = {
  trunk: new THREE.CylinderGeometry(0.25, 0.32, 2.2, 7),
  blob: new THREE.IcosahedronGeometry(1.5, 0),
  cone: new THREE.ConeGeometry(1.5, 2.4, 8),
  rock: new THREE.IcosahedronGeometry(1.1, 0),
  cbody: new THREE.CylinderGeometry(0.45, 0.55, 3, 8),
  carm: new THREE.CylinderGeometry(0.28, 0.3, 1.4, 7),
};
function makeTree() {
  const g = new THREE.Group();
  const t = new THREE.Mesh(dGeo.trunk, dMat.trunk); t.position.y = 1.1; g.add(t);
  const f = new THREE.Mesh(dGeo.blob, dMat.leaf); f.position.y = 3.0; f.scale.set(1, 1.2, 1); g.add(f);
  const f2 = new THREE.Mesh(dGeo.blob, dMat.leaf); f2.position.set(0.6, 2.4, 0.3); f2.scale.setScalar(0.7); g.add(f2);
  g.scale.setScalar(0.8 + Math.random() * 0.7);
  return g;
}
function makePine() {
  const g = new THREE.Group();
  const t = new THREE.Mesh(dGeo.trunk, dMat.trunk); t.position.y = 0.9; t.scale.set(0.7, 0.8, 0.7); g.add(t);
  for (let i = 0; i < 3; i++) {
    const c = new THREE.Mesh(dGeo.cone, dMat.pine); c.position.y = 2.0 + i * 1.1; c.scale.setScalar(1 - i * 0.24); g.add(c);
    const s = new THREE.Mesh(dGeo.cone, dMat.snowcap); s.position.y = 2.28 + i * 1.1; s.scale.setScalar((1 - i * 0.24) * 0.5); g.add(s);
  }
  g.scale.setScalar(0.9 + Math.random() * 0.6);
  return g;
}
function makeCactus() {
  const g = new THREE.Group();
  const b = new THREE.Mesh(dGeo.cbody, dMat.cactus); b.position.y = 1.5; g.add(b);
  const a1 = new THREE.Mesh(dGeo.carm, dMat.cactus); a1.position.set(0.55, 1.8, 0); a1.rotation.z = -0.9; g.add(a1);
  const a2 = new THREE.Mesh(dGeo.carm, dMat.cactus); a2.position.set(-0.55, 2.1, 0); a2.rotation.z = 0.9; g.add(a2);
  g.scale.setScalar(0.8 + Math.random() * 0.6);
  return g;
}
function makeRock() {
  const r = new THREE.Mesh(dGeo.rock, dMat.rock);
  r.scale.set(1 + Math.random(), 0.7 + Math.random() * 0.6, 1 + Math.random());
  r.position.y = 0.4; r.rotation.set(Math.random(), Math.random(), Math.random());
  return r;
}
let decorGroup = null;
function buildDecor(type) {
  if (decorGroup) { scene.remove(decorGroup); decorGroup = null; }
  if (!type) return;
  decorGroup = new THREE.Group();
  const ring = (n, make) => {
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * Math.PI * 2 + Math.random() * 0.4;
      const r = 34 + Math.random() * 20;
      const m = make();
      m.position.set(Math.cos(ang) * r, 0, Math.sin(ang) * r);
      m.rotation.y = Math.random() * 6;
      m.traverse(o => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; } });
      decorGroup.add(m);
    }
  };
  if (type === 'stadium') ring(18, makeTree);
  else if (type === 'desert') ring(15, () => Math.random() < 0.5 ? makeCactus() : makeRock());
  else if (type === 'snow') ring(20, () => Math.random() < 0.6 ? makePine() : makeRock());
  else if (type === 'night') ring(14, makeTree);
  else if (type === 'lava') ring(16, makeRock);
  else if (type === 'space') {
    for (let i = 0; i < 16; i++) {
      const ang = (i / 16) * Math.PI * 2 + Math.random() * 0.5, r = 34 + Math.random() * 22;
      const m = makeRock(); m.scale.multiplyScalar(1.3 + Math.random());
      m.position.set(Math.cos(ang) * r, 3 + Math.random() * 12, Math.sin(ang) * r);
      m.traverse(o => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; } });
      decorGroup.add(m);
    }
  }
  scene.add(decorGroup);
}
const B_DAY = [0xffe08a, 0xff7a5a, 0xffc070]; // varsayılan mermi/mermi2/namlu renkleri
const THEMES = {
  default: { ground: groundMat, wall: wallMat, fog: [0xc9b795, 70, 160], sun: [0xfff1d6, 3.2], hemi: [0xbfd7ff, 0x6b5a3e, 0.5], decor: null, bullet: B_DAY },
  stadium: { ground: grassMat, wall: hedgeMat, fog: [0xbfe4ff, 85, 190], sun: [0xffffff, 3.4], hemi: [0xcfe8ff, 0x5a7a3a, 0.7], decor: 'stadium', bullet: B_DAY },
  desert: { ground: sandMat, wall: sandWallMat, fog: [0xe6cf9a, 55, 150], sun: [0xffe6b0, 3.7], hemi: [0xffe8c0, 0x9c7a48, 0.6], decor: 'desert', bullet: B_DAY },
  snow: { ground: snowMat, wall: iceWallMat, fog: [0xdce8f2, 60, 170], sun: [0xe2ecff, 2.7], hemi: [0xcfe0ff, 0x8a99aa, 0.75], decor: 'snow', bullet: [0xbfe8ff, 0x9fbcff, 0xcfeeff] },
  night: { ground: nightGroundMat, wall: nightWallMat, fog: [0x0a0e1a, 42, 135], sun: [0x9fb4ff, 1.1], hemi: [0x2a3350, 0x101522, 0.5], decor: 'night', bg: 0x0a0e1a, env: false, stars: true, bullet: [0xaef0ff, 0xff7ad0, 0xaef0ff] },
  lava: { ground: lavaGroundMat, wall: lavaWallMat, fog: [0x2a0a04, 40, 120], sun: [0xff7a2e, 2.2], hemi: [0x5a1e10, 0x2a0a04, 0.7], decor: 'lava', bg: 0x1a0805, env: false, bullet: [0xff8a2a, 0xffd23a, 0xff7a1e] },
  space: { ground: spaceGroundMat, wall: spaceWallMat, fog: [0x05060f, 70, 220], sun: [0xcfe0ff, 2.4], hemi: [0x3a2a5a, 0x101020, 0.5], decor: 'space', bg: 0x05060f, env: false, stars: true, bullet: [0x6be7ff, 0xc07bff, 0x8be8ff] },
};
function applyTheme(name) {
  const th = THEMES[name] || THEMES.default;
  ground.material = th.ground;
  scene.fog.color.setHex(th.fog[0]); scene.fog.near = th.fog[1]; scene.fog.far = th.fog[2];
  sun.color.setHex(th.sun[0]); sun.intensity = th.sun[1];
  hemi.color.setHex(th.hemi[0]); hemi.groundColor.setHex(th.hemi[1]); hemi.intensity = th.hemi[2];
  if (th.bg != null) { scene.background = new THREE.Color(th.bg); scene.environment = th.env === false ? null : envTex; }
  else { scene.background = envTex; scene.environment = envTex; }
  stars.visible = !!th.stars;
  playerBulletMat.color.setHex(th.bullet[0]); enemyBulletMat.color.setHex(th.bullet[1]); flashColor = th.bullet[2];
  buildDecor(th.decor);
  return th.wall;
}

// ---------------------------------------------------------------- arena (harita) kurulumu
const walls = [];
let openCells = [];
let wallInst = null;
const wallGeo = new THREE.BoxGeometry(CELL, WALL_H, CELL);

function buildArena(mapIdx) {
  const wallMaterial = applyTheme(MAPS[mapIdx].theme);
  MAP = MAPS[mapIdx].grid;
  ROWS = MAP.length; COLS = MAP[0].length;
  arenaHalf = (Math.max(ROWS, COLS) / 2) * CELL;
  walls.length = 0; openCells = [];
  if (wallInst) { scene.remove(wallInst); wallInst.dispose(); wallInst = null; }
  let count = 0;
  for (const row of MAP) for (const ch of row) if (ch === '#') count++;
  wallInst = new THREE.InstancedMesh(wallGeo, wallMaterial, count);
  wallInst.castShadow = wallInst.receiveShadow = true;
  const m = new THREE.Matrix4();
  let i = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = cellX(c), z = cellZ(r);
      if (MAP[r][c] === '#') {
        m.makeTranslation(x, WALL_H / 2, z);
        wallInst.setMatrixAt(i++, m);
        walls.push({ minX: x - CELL / 2, maxX: x + CELL / 2, minZ: z - CELL / 2, maxZ: z + CELL / 2 });
      } else {
        openCells.push({ r, c, x, z });
      }
    }
  }
  wallInst.instanceMatrix.needsUpdate = true;
  scene.add(wallInst);
}
buildArena(0);

// ---------------------------------------------------------------- tank fabrikası
function buildTank(def) {
  const g = tankGltf.scene.clone(true);
  g.traverse(o => {
    if (o.isMesh) {
      o.castShadow = o.receiveShadow = true;
      if (o.material && o.material.name === 'TankPaint') {
        o.material = o.material.clone();
        o.material.color.set(def.color);
        if (def.metal) o.material.metalness = 0.7;
        if (def.glow) { o.material.emissive.set(def.color); o.material.emissiveIntensity = 0.35; }
      }
    }
  });
  if (def.scale && def.scale !== 1) g.scale.setScalar(def.scale);
  return g;
}

// ---------------------------------------------------------------- yardımcılar
function circleVsWalls(pos, radius) {
  for (const w of walls) {
    const cx = Math.max(w.minX, Math.min(pos.x, w.maxX));
    const cz = Math.max(w.minZ, Math.min(pos.z, w.maxZ));
    const dx = pos.x - cx, dz = pos.z - cz;
    const d2 = dx * dx + dz * dz;
    if (d2 < radius * radius) {
      const d = Math.sqrt(d2) || 0.001;
      pos.x += (dx / d) * (radius - d);
      pos.z += (dz / d) * (radius - d);
    }
  }
}
function pointInWall(x, z) {
  for (const w of walls) if (x > w.minX && x < w.maxX && z > w.minZ && z < w.maxZ) return w;
  return null;
}
function losClear(ax, az, bx, bz) {
  const dx = bx - ax, dz = bz - az;
  const steps = Math.ceil(Math.hypot(dx, dz) / 0.6);
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    if (pointInWall(ax + dx * t, az + dz * t)) return false;
  }
  return true;
}
function randOpenCell(awayX, awayZ, dist) {
  let cell, tries = 0;
  do {
    cell = openCells[Math.floor(Math.random() * openCells.length)];
    tries++;
  } while (tries < 90 && awayX !== undefined && Math.hypot(cell.x - awayX, cell.z - awayZ) < dist);
  return cell;
}
const angNorm = a => Math.atan2(Math.sin(a), Math.cos(a));
const fwdX = a => -Math.sin(a), fwdZ = a => -Math.cos(a);
const headingTo = (fx, fz, tx, tz) => Math.atan2(-(tx - fx), -(tz - fz));

// ---------------------------------------------------------------- ses
let AC = null;
function audio() {
  if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
  if (AC.state === 'suspended') AC.resume();
  return AC;
}
function noiseBuf(ac, dur) {
  const b = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return b;
}
function sfxFire() {
  if (settings.muted) return;
  const ac = audio(), t = ac.currentTime;
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = 'square'; o.frequency.setValueAtTime(240, t);
  o.frequency.exponentialRampToValueAtTime(50, t + 0.16);
  g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
  o.connect(g).connect(ac.destination); o.start(t); o.stop(t + 0.2);
  const n = ac.createBufferSource(), ng = ac.createGain(), f = ac.createBiquadFilter();
  n.buffer = noiseBuf(ac, 0.12); f.type = 'lowpass'; f.frequency.value = 2400;
  ng.gain.setValueAtTime(0.1, t); ng.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  n.connect(f).connect(ng).connect(ac.destination); n.start(t);
}
function sfxBounce() {
  if (settings.muted) return;
  const ac = audio(), t = ac.currentTime;
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = 'triangle'; o.frequency.setValueAtTime(900, t);
  o.frequency.exponentialRampToValueAtTime(300, t + 0.08);
  g.gain.setValueAtTime(0.07, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
  o.connect(g).connect(ac.destination); o.start(t); o.stop(t + 0.1);
}
let lastBoom = 0;
function sfxBoom(big = false) {
  if (settings.muted) return;
  const now = performance.now();
  if (!big && now - lastBoom < 55) return; // küçük patlama seslerini kısıtla (üst üste binmesin)
  lastBoom = now;
  const ac = audio(), t = ac.currentTime;
  const n = ac.createBufferSource(), g = ac.createGain(), f = ac.createBiquadFilter();
  n.buffer = noiseBuf(ac, big ? 0.9 : 0.5);
  f.type = 'lowpass'; f.frequency.setValueAtTime(big ? 900 : 700, t);
  f.frequency.exponentialRampToValueAtTime(60, t + (big ? 0.8 : 0.45));
  g.gain.setValueAtTime(big ? 0.5 : 0.3, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + (big ? 0.9 : 0.5));
  n.connect(f).connect(g).connect(ac.destination); n.start(t);
}
function sfxCoin() {
  if (settings.muted) return;
  const ac = audio(), t = ac.currentTime;
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(880, t);
  o.frequency.setValueAtTime(1320, t + 0.06);
  g.gain.setValueAtTime(0.08, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
  o.connect(g).connect(ac.destination); o.start(t); o.stop(t + 0.2);
}
// motor sesi (sürüşe göre uğultu)
let engineOsc = null, engineGain = null, engineFreq = null;
function startEngine() {
  const ac = audio();
  if (engineOsc) return;
  engineOsc = ac.createOscillator();
  const filter = ac.createBiquadFilter();
  engineGain = ac.createGain();
  engineOsc.type = 'sawtooth'; engineOsc.frequency.value = 55;
  filter.type = 'lowpass'; filter.frequency.value = 380;
  engineGain.gain.value = 0;
  engineOsc.connect(filter).connect(engineGain).connect(ac.destination);
  engineOsc.start();
  engineFreq = engineOsc.frequency;
}
function updateEngine() {
  if (!engineGain || !AC) return;
  const spd = Math.min(1, Math.abs(player.speed) / 10);
  const on = state === 'play' && !paused && player.alive && !settings.muted;
  engineGain.gain.setTargetAtTime(on ? 0.012 + spd * 0.05 : 0, AC.currentTime, 0.1);
  engineFreq.setTargetAtTime(52 + spd * 48, AC.currentTime, 0.1);
}
function sfxPower() {
  if (settings.muted) return;
  const ac = audio(), t = ac.currentTime;
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = 'triangle';
  o.frequency.setValueAtTime(440, t);
  o.frequency.exponentialRampToValueAtTime(1200, t + 0.18);
  g.gain.setValueAtTime(0.11, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
  o.connect(g).connect(ac.destination); o.start(t); o.stop(t + 0.34);
}

// ---------------------------------------------------------------- efektler
// SABİT ışık havuzu: ışıklar sahnede hep durur (kullanılmıyorken şiddet 0),
// asla eklenip çıkarılmaz -> Three.js shader'ları yeniden derlemez -> takılma olmaz.
const FLASH_POOL = [];
for (let i = 0; i < 6; i++) {
  const l = new THREE.PointLight(0xffffff, 0, 12, 2);
  l.position.set(0, -50, 0);
  scene.add(l);
  FLASH_POOL.push({ light: l, life: 0, max: 1, base: 0 });
}
function popFlash(x, y, z, color, intensity, dist, dur) {
  let slot = null;
  for (const s of FLASH_POOL) { if (s.life <= 0) { slot = s; break; } }
  if (!slot) { slot = FLASH_POOL[0]; for (const s of FLASH_POOL) if (s.life < slot.life) slot = s; }
  slot.light.color.setHex(color);
  slot.light.position.set(x, y, z);
  slot.light.distance = dist;
  slot.light.intensity = intensity;
  slot.base = intensity; slot.life = dur; slot.max = dur;
}
function updateFlashes(dt) {
  for (const s of FLASH_POOL) {
    if (s.life > 0) { s.life -= dt; s.light.intensity = Math.max(0, s.base * (s.life / s.max)); }
    else if (s.light.intensity !== 0) s.light.intensity = 0;
  }
}

const particles = [];
const partGeo = new THREE.BoxGeometry(0.22, 0.22, 0.22);
let shake = 0;
function explode(x, y, z, big = false) {
  const heavy = particles.length > 130; // çok parçacık varsa yenilerini üretme (aşırı yüklenmeyi önler)
  const n = heavy ? 0 : (big ? 18 : 8);
  for (let i = 0; i < n; i++) {
    const hot = Math.random() < 0.6;
    const mat = new THREE.MeshBasicMaterial({
      color: hot ? (Math.random() < 0.5 ? 0xffa028 : 0xff5a1e) : 0x2a2a2a, transparent: true,
    });
    const p = new THREE.Mesh(partGeo, mat);
    p.position.set(x, y, z);
    const a = Math.random() * Math.PI * 2, up = 2 + Math.random() * (big ? 8 : 5);
    const sp = 2 + Math.random() * (big ? 7 : 4);
    p.userData = { vx: Math.cos(a) * sp, vy: up, vz: Math.sin(a) * sp, life: 0.9 + Math.random() * 0.5 };
    p.scale.setScalar((big ? 1.4 : 1) * (0.6 + Math.random()));
    scene.add(p); particles.push(p);
  }
  if (!heavy) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.3, 0.55, 24),
      new THREE.MeshBasicMaterial({ color: 0xffc060, transparent: true, side: THREE.DoubleSide }));
    ring.rotation.x = -Math.PI / 2; ring.position.set(x, 0.15, z);
    ring.userData = { ring: true, life: 0.5, vy: 0, vx: 0, vz: 0 };
    scene.add(ring); particles.push(ring);
  }
  popFlash(x, y + 0.5, z, 0xffa040, big ? 55 : 24, big ? 22 : 12, big ? 0.32 : 0.22);
  if (big) shake = Math.min(1.2, shake + 0.5); // sadece tank patlamaları ekranı sarssın
  sfxBoom(big);
}
function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.userData.life -= dt;
    if (p.userData.life <= 0) {
      scene.remove(p); if (p.material) p.material.dispose();
      particles.splice(i, 1); continue;
    }
    if (p.userData.ring) { p.scale.addScalar(dt * 14); p.material.opacity = p.userData.life * 2; }
    else {
      p.userData.vy -= 14 * dt;
      p.position.x += p.userData.vx * dt;
      p.position.y = Math.max(0.1, p.position.y + p.userData.vy * dt);
      p.position.z += p.userData.vz * dt;
      p.rotation.x += dt * 6; p.rotation.z += dt * 5;
      p.material.opacity = Math.min(1, p.userData.life);
    }
  }
}
function muzzleFlash(x, y, z) {
  popFlash(x, y, z, flashColor, 26, 9, 0.09);
}

// ---------------------------------------------------------------- oyun durumu
const bullets = [];
const bulletGeo = new THREE.SphereGeometry(0.14, 10, 10);

const player = {
  mesh: null, a: 0, x: 0, z: 0,
  health: 5, maxHealth: 5, cool: 0, alive: true, speed: 0, inv: 0,
  stat: tankById(profile.selected),
  speedT: 0, tripleT: 0, shieldT: 0,
};
let playerTurret = null, turretBaseZ = 0;

function setPlayerTank() {
  const def = effTank(profile.selected);
  if (player.mesh) scene.remove(player.mesh);
  player.mesh = buildTank(def);
  player.mesh.position.set(player.x, 0, player.z);
  scene.add(player.mesh);
  playerTurret = player.mesh.getObjectByName('TankTurret');
  turretBaseZ = playerTurret ? playerTurret.position.z : 0;
  player.stat = def;
  player.maxHealth = def.health;
}
setPlayerTank();

let enemies = [];
let wave = 1, score = 0, roundCoins = 0;
let state = 'menu'; // menu | play | over
let mode = 'solo';  // solo | duel | ball
const keys = {};
let recoil = 0;

// top maçı (1v1) durumu
let ball = null;
const ballMeshes = [];
let isAuthority = false;
let pendingMode = 'duel';
let netYou = null, netMode = null, netBegun = false, netMapIdx = null;
let matchOverMode = null, myReady = false, peerReady = false;
let duelMap = 0;
// kooperatif (2-4 kişi vs dalgalar)
let coop = null;
let coopCode = null, coopYou = 1, coopIsHost = false;
const coopEnemies = new Map();
const PLAYER_COLORS = { 1: 0x4a8d3a, 2: 0x2f7db0, 3: 0xd08a2a, 4: 0x9c4fd0 };
const COOP_SPAWNS = [[1, 11], [11, 11], [1, 1], [11, 1]];

function fire(owner, angOff = 0, playerShot = null) {
  const isPlayer = owner === player;
  const a = owner.a + angOff;
  const mesh = new THREE.Mesh(bulletGeo, isPlayer ? playerBulletMat : enemyBulletMat);
  const bx = owner.x + fwdX(a) * 2.6;
  const bz = owner.z + fwdZ(a) * 2.6;
  mesh.position.set(bx, 1.13, bz);
  scene.add(mesh);
  let sp;
  if (isPlayer) sp = player.stat.bspeed;
  else if (mode === 'duel' || mode === 'ball') sp = owner.bspeed || 24;
  else sp = owner.bspeed || ENEMY_BSPEED;
  bullets.push({ mesh, fromPlayer: isPlayer, playerShot: playerShot == null ? isPlayer : playerShot, vx: fwdX(a) * sp, vz: fwdZ(a) * sp, life: 2.6, bounces: 1 });
  muzzleFlash(bx, 1.3, bz);
  sfxFire();
  if (isPlayer && playerTurret) recoil = 0.14;
}
function clearBullets() { for (const b of bullets) scene.remove(b.mesh); bullets.length = 0; }
function clearEnemies() { for (const e of enemies) scene.remove(e.mesh); enemies = []; }

// ---------------------------------------------------------------- güç-yükseltmeleri
const POWERUPS = [
  { type: 'speed', color: 0xffd11a, dur: 8 },
  { type: 'triple', color: 0xff5a2a, dur: 10 },
  { type: 'shield', color: 0x2ad0ff, dur: 8 },
];
function iconTexture(type, color) {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = '#fff'; g.strokeStyle = '#fff'; g.lineWidth = 12; g.lineJoin = 'round'; g.lineCap = 'round';
  if (type === 'speed') {
    g.beginPath(); g.moveTo(78, 16); g.lineTo(38, 72); g.lineTo(60, 72); g.lineTo(50, 112); g.lineTo(94, 52); g.lineTo(70, 52); g.closePath(); g.fill();
  } else if (type === 'triple') {
    for (const x of [38, 64, 90]) { g.beginPath(); g.arc(x, 42, 11, 0, 7); g.fill(); g.fillRect(x - 5, 42, 10, 52); }
  } else if (type === 'shield') {
    g.beginPath(); g.moveTo(64, 14); g.lineTo(106, 32); g.lineTo(106, 66);
    g.quadraticCurveTo(106, 102, 64, 116); g.quadraticCurveTo(22, 102, 22, 66); g.lineTo(22, 32); g.closePath(); g.fill();
    g.fillStyle = '#' + color.toString(16).padStart(6, '0');
    g.beginPath(); g.moveTo(64, 30); g.lineTo(92, 42); g.lineTo(92, 66);
    g.quadraticCurveTo(92, 90, 64, 100); g.quadraticCurveTo(36, 90, 36, 66); g.lineTo(36, 42); g.closePath(); g.fill();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function makePowerup(def) {
  const grp = new THREE.Group();
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.05, 22, 16),
    new THREE.MeshStandardMaterial({ color: def.color, transparent: true, opacity: 0.32, emissive: def.color, emissiveIntensity: 0.7, roughness: 0.15, metalness: 0.1, depthWrite: false }));
  grp.add(sphere);
  const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: iconTexture(def.type, def.color), depthTest: false, transparent: true }));
  spr.scale.set(1.15, 1.15, 1.15);
  grp.add(spr);
  return grp;
}
const powerups = [];
let powerupT = 6, puIdCounter = 0;
function addPowerup(type, x, z, id) {
  const def = POWERUPS.find(p => p.type === type) || POWERUPS[0];
  const mesh = makePowerup(def);
  mesh.position.set(x, 1.25, z);
  scene.add(mesh);
  powerups.push({ type, dur: def.dur, x, z, mesh, bob: Math.random() * 6, id });
}
function clearPowerups() { for (const p of powerups) scene.remove(p.mesh); powerups.length = 0; }
function updatePowerups(dt) {
  // üretim: tek oyunculuda hep, düelloda sadece otorite (P1) yapar ve rakibe bildirir
  if (mode === 'solo' || ((mode === 'duel' || mode === 'coop') && isAuthority)) {
    powerupT -= dt;
    if (powerupT <= 0 && powerups.length < 3) {
      const def = POWERUPS[Math.floor(Math.random() * POWERUPS.length)];
      const cell = randOpenCell(player.x, player.z, 10);
      const id = ++puIdCounter;
      addPowerup(def.type, cell.x, cell.z, id);
      if (mode === 'duel' || mode === 'coop') netSend({ t: 'pu_spawn', id, type: def.type, x: cell.x, z: cell.z });
      powerupT = 9 + Math.random() * 6;
    }
  }
  for (let i = powerups.length - 1; i >= 0; i--) {
    const p = powerups[i];
    p.bob += dt * 3; p.mesh.rotation.y += dt * 1.6;
    p.mesh.position.y = 1.25 + Math.sin(p.bob) * 0.25;
    if (player.alive && Math.hypot(player.x - p.x, player.z - p.z) < TANK_R + 1.05) {
      applyPowerup(p.type); explode(p.x, 1.2, p.z, false);
      if (mode === 'duel' || mode === 'coop') netSend({ t: 'pu_take', id: p.id });
      scene.remove(p.mesh); powerups.splice(i, 1);
    }
  }
}
function applyPowerup(type) {
  sfxPower();
  const t = T();
  if (type === 'speed') { player.speedT = 8; banner(t.puSpeed); }
  else if (type === 'triple') { player.tripleT = 10; banner(t.puTriple); }
  else if (type === 'shield') { player.shieldT = 8; banner(t.puShield); }
}
const shieldBubble = new THREE.Mesh(new THREE.SphereGeometry(2.0, 20, 16),
  new THREE.MeshStandardMaterial({ color: 0x2ad0ff, transparent: true, opacity: 0.22, emissive: 0x2ad0ff, emissiveIntensity: 0.6, side: THREE.DoubleSide, depthWrite: false }));
shieldBubble.visible = false;
scene.add(shieldBubble);

// düşman tipleri: normal / keşif (hızlı-zayıf) / ağır (yavaş-zırhlı) / nişancı (uzaktan) / boss
const ENEMY_TYPES = {
  normal: { hp: 1, speed: 4.6, turn: 1.9, cool: [2.2, 3.8], bspeed: 17, keep: 11, sight: 55, scale: 1.0, color: 0xa03428, coins: 15, score: 100 },
  scout:  { hp: 1, speed: 7.8, turn: 2.9, cool: [2.6, 4.2], bspeed: 16, keep: 6, sight: 50, scale: 0.82, color: 0xc9902f, coins: 12, score: 80 },
  heavy:  { hp: 3, speed: 3.0, turn: 1.3, cool: [2.4, 3.8], bspeed: 20, keep: 9, sight: 52, scale: 1.35, color: 0x5a6b55, coins: 35, score: 250 },
  sniper: { hp: 1, speed: 3.6, turn: 1.6, cool: [2.0, 3.2], bspeed: 34, keep: 24, sight: 75, scale: 0.95, color: 0x8a3a8a, coins: 25, score: 180 },
  boss:   { hp: 14, speed: 2.8, turn: 1.1, cool: [1.3, 2.0], bspeed: 22, keep: 12, sight: 80, scale: 2.1, color: 0x8f1414, coins: 200, score: 2000, triple: true, glow: true },
};
let enemyIdC = 0;
function waveComposition(w, extra = 0) {
  if (w % 5 === 0) {
    const list = ['boss'];
    const n = 1 + Math.floor(w / 10) + extra;
    for (let i = 0; i < n; i++) list.push(Math.random() < 0.5 ? 'scout' : 'normal');
    return list;
  }
  const count = Math.min(2 + w, 6) + extra;
  const list = [];
  for (let i = 0; i < count; i++) {
    const r = Math.random();
    if (w >= 6 && r < 0.18) list.push('sniper');
    else if (w >= 4 && r < 0.38) list.push('heavy');
    else if (w >= 3 && r < 0.62) list.push('scout');
    else list.push('normal');
  }
  return list;
}
function spawnEnemies(types) {
  for (const type of types) {
    const d = ENEMY_TYPES[type] || ENEMY_TYPES.normal;
    const cell = randOpenCell(player.x, player.z, type === 'boss' ? 22 : 18);
    const e = {
      id: ++enemyIdC, type, color: d.color, hp: d.hp, maxHp: d.hp,
      speed: d.speed, turn: d.turn, bspeed: d.bspeed, keep: d.keep, sight: d.sight,
      triple: !!d.triple, coins: d.coins, score: d.score,
      mesh: buildTank({ color: d.color, scale: d.scale, glow: d.glow }),
      x: cell.x, z: cell.z, a: Math.random() * Math.PI * 2,
      cool: d.cool[0] + Math.random() * (d.cool[1] - d.cool[0]),
      alive: true, turnDir: 1, thinkT: 0,
    };
    e.mesh.position.set(e.x, 0, e.z);
    scene.add(e.mesh); enemies.push(e);
  }
}

// ---------------------------------------------------------------- HUD + menü
const $ = id => document.getElementById(id);
const healthEl = $('health'), scoreEl = $('score'), waveEl = $('wave');
const msgEl = $('msg'), flashEl = $('flash'), bannerEl = $('wavebanner');
const duelStatusEl = $('duelstatus'), coinsEl = $('coins');

function updateCoinBar() { coinsEl.textContent = profile.coins; }
function updateStats() {
  $('statsline').innerHTML = `🏆 D.${profile.bestWave} &nbsp;·&nbsp; ⚔️ ${profile.kills} &nbsp;·&nbsp; 🥇 ${profile.wins}`;
}
function updateBossBar(boss) {
  const el = $('bossbar');
  if (boss) {
    el.style.display = 'flex';
    $('bosslabel').textContent = T().bossLbl;
    $('bosshp').style.width = Math.max(0, (boss.hp / boss.maxHp) * 100) + '%';
  } else if (el.style.display !== 'none') el.style.display = 'none';
}
let buffSig = '';
function updateBuffs() {
  const items = [];
  if (player.speedT > 0) items.push(`⚡${Math.ceil(player.speedT)}`);
  if (player.tripleT > 0) items.push(`3×${Math.ceil(player.tripleT)}`);
  if (player.shieldT > 0) items.push(`🛡${Math.ceil(player.shieldT)}`);
  const s = (state === 'play' ? items.join('|') : '');
  if (s === buffSig) return;
  buffSig = s;
  $('buffs').innerHTML = state === 'play' ? items.map(x => `<span class="buff">${x}</span>`).join('') : '';
}
const miniCanvas = $('minimap'), miniCtx = miniCanvas.getContext('2d');
function drawMinimap() {
  if (state !== 'play') { if (miniCanvas.style.display !== 'none') miniCanvas.style.display = 'none'; return; }
  if (miniCanvas.style.display !== 'block') miniCanvas.style.display = 'block';
  const S = miniCanvas.width, half = arenaHalf, c = miniCtx;
  const px = x => (x / (half * 2) + 0.5) * S, pz = z => (z / (half * 2) + 0.5) * S;
  const dot = (x, z, r) => { c.beginPath(); c.arc(px(x), pz(z), r, 0, 7); c.fill(); };
  c.clearRect(0, 0, S, S);
  c.fillStyle = 'rgba(0,0,0,0.35)'; c.fillRect(0, 0, S, S);
  c.fillStyle = 'rgba(190,160,120,0.6)';
  for (const w of walls) c.fillRect(px(w.minX), pz(w.minZ), Math.max(1, px(w.maxX) - px(w.minX)), Math.max(1, pz(w.maxZ) - pz(w.minZ)));
  c.fillStyle = '#ff4030';
  if (enemies.length) { for (const e of enemies) if (e.alive) dot(e.x, e.z, e.type === 'boss' ? 4.5 : 2.5); }
  else for (const m of coopEnemies.values()) dot(m.position.x, m.position.z, 2.5);
  if (mode === 'ball' && ball) { c.fillStyle = '#ffffff'; dot(ball.x, ball.z, 3); }
  if (mode === 'duel' && duel && duel.remoteAlive) { c.fillStyle = '#ff7a5a'; dot(duel.x, duel.z, 3); }
  if (mode === 'coop' && coop) for (const [pid, rm] of coop.remotes) if (rm.alive) { c.fillStyle = '#' + (PLAYER_COLORS[pid] || 0x8888aa).toString(16).padStart(6, '0'); dot(rm.x, rm.z, 3); }
  c.fillStyle = '#ffe86a';
  for (const p of powerups) dot(p.x, p.z, 2);
  if (player.alive) {
    const ax = px(player.x), az = pz(player.z);
    c.fillStyle = '#3aff5d'; c.beginPath(); c.arc(ax, az, 3.5, 0, 7); c.fill();
    c.strokeStyle = '#3aff5d'; c.lineWidth = 1.5;
    c.beginPath(); c.moveTo(ax, az); c.lineTo(ax + fwdX(player.a) * 7, az + fwdZ(player.a) * 7); c.stroke();
  }
}
function renderHealth() {
  healthEl.innerHTML = '';
  for (let i = 0; i < player.maxHealth; i++) {
    const d = document.createElement('span');
    d.className = 'hp' + (i < player.health ? '' : ' off');
    d.style.display = 'inline-block'; d.style.marginLeft = '4px';
    healthEl.appendChild(d);
  }
}
function banner(text) {
  bannerEl.textContent = text;
  bannerEl.style.transition = 'none'; bannerEl.style.opacity = 1;
  setTimeout(() => { bannerEl.style.transition = 'opacity 1.2s'; bannerEl.style.opacity = 0; }, 1400);
}
function hitFlash() {
  flashEl.style.transition = 'none'; flashEl.style.opacity = 1;
  requestAnimationFrame(() => { flashEl.style.transition = 'opacity .5s'; flashEl.style.opacity = 0; });
}
function updateHUD() {
  const t = T();
  if (mode === 'ball' && ball && duel) {
    waveEl.textContent = duel.code ? `${t.roomLbl} ${duel.code}` : '';
    const me = duel.you === 1 ? ball.g1 : ball.g2;
    const op = duel.you === 1 ? ball.g2 : ball.g1;
    scoreEl.textContent = `${t.you} ${me} — ${op} ${t.opp}`;
  } else if (mode === 'duel' && duel) {
    waveEl.textContent = duel.code ? `${t.roomLbl} ${duel.code}` : '';
    scoreEl.textContent = `${t.you} ${duel.myKills} — ${duel.myDeaths} ${t.opp}`;
  } else {
    waveEl.textContent = `${t.wave} ${wave}`;
    scoreEl.textContent = `${t.score} ${score}`;
  }
}

// panel yönetimi
function showPanel(id) {
  for (const p of ['panel-main', 'panel-maps', 'panel-garage', 'panel-duel', 'panel-coop', 'panel-rematch'])
    $(p).classList.toggle('show', p === id);
}
function openMenu() {
  state = 'menu';
  mode = 'solo';
  clearBallMode(); clearCoop(); clearPowerups();
  shieldBubble.visible = false;
  if (!wallInst) buildArena(0);
  const t = T();
  $('title').textContent = t.title;
  $('submsg').textContent = t.sub;
  showPanel('panel-main');
  msgEl.classList.remove('hidden');
  $('topbar').style.visibility = 'hidden';
  updateCoinBar();
  updateStats();
}

function applyLang() {
  localStorage.setItem('tanklang', lang);
  const t = T();
  document.title = t.title;
  $('keys').innerHTML = IS_TOUCH ? t.keysTouch : t.keysDesk;
  $('btn-single').textContent = t.single;
  $('btn-duel').textContent = t.duel;
  $('btn-ball').textContent = t.ballBtn;
  $('btn-coop').textContent = t.coopBtn;
  $('btn-garage').textContent = t.garage;
  $('btn-coop-create').textContent = t.create;
  $('btn-coop-join').textContent = t.join;
  $('btn-coop-start').textContent = t.startW;
  $('btn-back-coop').textContent = t.back;
  $('coopcode').placeholder = t.codePh;
  $('btn-create').textContent = t.create;
  $('btn-join').textContent = t.join;
  $('joincode').placeholder = t.codePh;
  $('hlabel').textContent = t.health;
  $('firebtn').textContent = t.fire;
  $('btn-back-maps').textContent = t.back;
  $('btn-back-garage').textContent = t.back;
  $('btn-back-duel').textContent = t.back;
  $('btn-rematch').textContent = t.rematchBtn;
  $('btn-leave').textContent = t.leaveBtn;
  $('lang-tr').classList.toggle('on', lang === 'tr');
  $('lang-en').classList.toggle('on', lang === 'en');
  if (state === 'menu' && $('panel-main').classList.contains('show')) $('submsg').textContent = t.sub;
  updateHUD();
}

// ---------------------------------------------------------------- garaj UI
function barHTML(frac) {
  return `<span class="bar bg"><i style="width:${Math.round(Math.max(0.08, Math.min(1, frac)) * 100)}%"></i></span>`;
}
function renderGarage() {
  const t = T();
  const wrap = $('cardwrap-garage');
  wrap.className = 'card-list';
  wrap.style.cssText = 'display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin:12px 8px';
  wrap.innerHTML = '';
  for (const base of TANKS) {
    const owned = profile.owned.includes(base.id);
    const sel = profile.selected === base.id;
    const def = effTank(base.id);
    const card = document.createElement('div');
    card.className = 'card' + (sel ? ' sel' : '');
    const hex = '#' + base.color.toString(16).padStart(6, '0');
    const fireRate = 1 / def.cool;
    card.innerHTML =
      `<div class="cname">${base.name[lang]}</div>` +
      `<div class="cswatch" style="background:linear-gradient(135deg,${hex},#1a1a1a)"></div>` +
      `<div class="cstat">${t.sHealth}${barHTML(def.health / STAT_MAX.health)}</div>` +
      `<div class="cstat">${t.sSpeed}${barHTML(def.speed / STAT_MAX.speed)}</div>` +
      `<div class="cstat">${t.sFire}${barHTML(fireRate / STAT_MAX.fire)}</div>`;
    const btn = document.createElement('button');
    btn.className = 'mbtn small' + (base.glow ? ' gold' : '');
    if (sel) { btn.textContent = t.selected; btn.disabled = true; }
    else if (owned) { btn.textContent = t.owned; btn.onclick = () => { profile.selected = base.id; saveProfile(); setPlayerTank(); renderGarage(); }; }
    else {
      btn.innerHTML = `${t.buy} · 🪙${base.price}`;
      btn.disabled = profile.coins < base.price;
      btn.onclick = () => {
        if (profile.coins < base.price) return;
        profile.coins -= base.price; profile.owned.push(base.id); profile.selected = base.id;
        saveProfile(); sfxCoin(); setPlayerTank(); updateCoinBar(); renderGarage();
      };
    }
    card.appendChild(btn);
    // yükseltmeler (sahip olunan tanklar için)
    if (owned) {
      const up = document.createElement('div');
      up.style.cssText = 'margin-top:7px;border-top:1px solid rgba(255,255,255,.15);padding-top:6px';
      for (const u of UPGRADES) {
        const lvl = (profile.upgrades[base.id] && profile.upgrades[base.id][u.key]) || 0;
        const row = document.createElement('button');
        row.className = 'mbtn small';
        row.style.cssText = 'display:block;width:100%;margin:3px 0;font-size:11px;padding:6px 4px;letter-spacing:0';
        const dots = '●'.repeat(lvl) + '○'.repeat(UP_MAX - lvl);
        if (lvl >= UP_MAX) { row.textContent = `${u.name[lang]} ${dots} ${t.maxLevel}`; row.disabled = true; }
        else {
          const cost = upCost(lvl);
          row.innerHTML = `${u.name[lang]} ${dots} · 🪙${cost}`;
          row.disabled = profile.coins < cost;
          row.onclick = () => {
            if (profile.coins < cost) return;
            profile.coins -= cost;
            profile.upgrades[base.id] = profile.upgrades[base.id] || {};
            profile.upgrades[base.id][u.key] = lvl + 1;
            saveProfile(); sfxPower(); updateCoinBar();
            if (profile.selected === base.id) setPlayerTank();
            renderGarage();
          };
        }
        up.appendChild(row);
      }
      card.appendChild(up);
    }
    wrap.appendChild(card);
  }
}

// ---------------------------------------------------------------- harita seçimi UI
function renderMaps() {
  const t = T();
  const wrap = $('cardwrap-maps');
  wrap.style.cssText = 'display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin:12px 8px';
  wrap.innerHTML = '';
  MAPS.forEach((mp, idx) => {
    const unlocked = mapUnlocked(idx);
    const card = document.createElement('div');
    card.className = 'card' + (unlocked ? '' : ' locked');
    // mini önizleme (ızgara)
    let mini = '<div style="display:inline-block;line-height:0;margin:6px 0">';
    for (let r = 0; r < mp.grid.length; r += 1) {
      for (let c = 0; c < mp.grid[r].length; c += 1) {
        const on = mp.grid[r][c] === '#';
        mini += `<span style="display:inline-block;width:9px;height:9px;background:${on ? '#6b5535' : '#2c3a1e'}"></span>`;
      }
      mini += '<br>';
    }
    mini += '</div>';
    card.innerHTML = `<div class="cname">${mp.name[lang]}</div>${mini}`;
    const btn = document.createElement('button');
    btn.className = 'mbtn small';
    if (unlocked) { btn.textContent = t.single; btn.onclick = () => startSolo(idx); }
    else { btn.textContent = t.locked(mp.req); btn.disabled = true; }
    card.appendChild(btn);
    wrap.appendChild(card);
  });
}

// ---------------------------------------------------------------- tek oyunculu
function startSolo(mapIdx) {
  mode = 'solo'; state = 'play';
  profile.games++; saveProfile();
  closeNet();
  buildArena(mapIdx);
  msgEl.classList.add('hidden');
  $('topbar').style.visibility = 'visible';
  $('healthwrap').style.visibility = 'visible';
  clearEnemies(); clearBullets(); clearPowerups();
  wave = 1; score = 0; roundCoins = 0; powerupT = 6;
  setPlayerTank();
  player.health = player.maxHealth; player.alive = true; player.inv = 0;
  player.speedT = 0; player.tripleT = 0; player.shieldT = 0;
  shieldBubble.visible = false;
  const c = randOpenCell();
  player.x = c.x; player.z = c.z; player.a = 0;
  player.mesh.position.set(player.x, 0, player.z);
  player.mesh.visible = true;
  spawnEnemies(waveComposition(1));
  renderHealth(); updateHUD();
  banner(`${T().wave} 1`);
  audio(); startEngine();
}
function gameOver() {
  state = 'over';
  clearPowerups();
  shieldBubble.visible = false;
  const t = T();
  $('title').textContent = t.over;
  $('submsg').textContent = t.overSub(score, wave, roundCoins);
  showPanel('panel-main');
  msgEl.classList.remove('hidden');
  updateCoinBar();
}

// ---------------------------------------------------------------- düello
let ws = null, duel = null;
function closeNet() {
  if (ws) { ws.onclose = null; ws.close(); ws = null; }
  if (duel && duel.remoteMesh) scene.remove(duel.remoteMesh);
  duel = null;
  netYou = null; netMode = null; netBegun = false; netMapIdx = null;
  matchOverMode = null; myReady = false; peerReady = false;
}
function netSend(obj) { if (ws && ws.readyState === 1) ws.send(JSON.stringify(obj)); }
function connectNet(onOpen) {
  netYou = null; netMode = null; netBegun = false; netMapIdx = null;
  const proto = location.protocol === 'https:' ? 'wss://' : 'ws://';
  try { ws = new WebSocket(proto + location.host); }
  catch { duelStatusEl.textContent = T().connFail; return; }
  ws.onopen = onOpen;
  ws.onerror = () => { duelStatusEl.textContent = T().connFail; };
  ws.onclose = () => {
    if (state === 'play' && (mode === 'duel' || mode === 'ball')) peerLeft();
    else if (matchOverMode) onPeerGone();
  };
  ws.onmessage = ev => { let m; try { m = JSON.parse(ev.data); } catch { return; } handleNet(m); };
}
function tryBegin() {
  if (netBegun) return;
  if (netYou === 1) netMode = pendingMode;
  if (netYou != null && netMode != null) {
    netBegun = true;
    if (netMode === 'ball') beginBall(netYou);
    else { if (netYou === 2 && netMapIdx != null) duelMap = netMapIdx; beginDuel(netYou); }
  }
}
function handleNet(m) {
  const t = T();
  if (m.t === 'room') {
    if (pendingMode === 'coop') { coopCode = m.code; coopYou = m.you; updateLobby(1, [m.you]); }
    else { if (duel) duel.code = m.code; duelStatusEl.innerHTML = `${t.roomLbl} <span class="code">${m.code}</span><br>${t.waiting}`; }
  }
  else if (m.t === 'err') { (pendingMode === 'coop' ? $('coopstatus') : duelStatusEl).textContent = t.joinFail; }
  else if (m.t === 'lobby') { updateLobby(m.count, m.players); }
  else if (m.t === 'start') {
    if (m.coop) beginCoop(m.you, m.players, m.map || 0);
    else { netYou = m.you; if (netYou === 1) netSend({ t: 'gamemode', mode: pendingMode, map: duelMap }); tryBegin(); }
  }
  else if (m.t === 'gamemode') { netMode = m.mode; netMapIdx = (m.map != null ? m.map : 0); tryBegin(); }
  else if (mode === 'coop') { handleCoopNet(m); }
  else if (!duel) { return; }
  else if (m.t === 'skin') { applyRemoteSkin(m.color, m.scale); }
  else if (m.t === 'ball') { if (ball && !isAuthority) { ball.tx = m.x; ball.tz = m.z; ball.mesh.rotation.x = m.rx; ball.mesh.rotation.z = m.rz; } }
  else if (m.t === 'goal') { if (ball) { applyGoal(m.g1, m.g2, m.scorer); if (m.done) { ball.over = true; endBall(); } } }
  else if (m.t === 'state') {
    duel.tx = m.x; duel.tz = m.z; duel.ta = m.a;
    if (m.alive && !duel.remoteAlive) { duel.remoteAlive = true; duel.remoteMesh.visible = true; }
  }
  else if (m.t === 'fire') {
    if (m.trip) { fire({ x: m.x, z: m.z, a: m.a, bspeed: m.bs }, -0.17); fire({ x: m.x, z: m.z, a: m.a, bspeed: m.bs }, 0); fire({ x: m.x, z: m.z, a: m.a, bspeed: m.bs }, 0.17); }
    else fire({ x: m.x, z: m.z, a: m.a, bspeed: m.bs });
  }
  else if (m.t === 'pu_spawn') { addPowerup(m.type, m.x, m.z, m.id); }
  else if (m.t === 'pu_take') { const i = powerups.findIndex(p => p.id === m.id); if (i >= 0) { scene.remove(powerups[i].mesh); powerups.splice(i, 1); } }
  else if (m.t === 'die') {
    duel.remoteAlive = false; duel.remoteMesh.visible = false;
    explode(duel.tx, 1.2, duel.tz, true);
    duel.myKills++; profile.kills++; saveProfile(); updateHUD();
    if (duel.myKills >= KILL_TARGET) { netSend({ t: 'win' }); duelEnd(true); }
  }
  else if (m.t === 'win') { duelEnd(false); }
  else if (m.t === 'rematch') {
    peerReady = true;
    if (matchOverMode && !myReady) $('rematchstatus').textContent = T().rematchPeerReady;
    tryRematch();
  }
  else if (m.t === 'peerleft') { if (matchOverMode) onPeerGone(); else peerLeft(); }
}
function applyRemoteSkin(color, scale) {
  if (!duel) return;
  scene.remove(duel.remoteMesh);
  duel.remoteMesh = buildTank({ color, scale: scale || 1 });
  duel.remoteMesh.position.set(duel.x, 0, duel.z);
  duel.remoteMesh.rotation.y = duel.a;
  duel.remoteMesh.visible = duel.remoteAlive;
  scene.add(duel.remoteMesh);
}
function beginDuel(you) {
  mode = 'duel'; state = 'play';
  isAuthority = (you === 1);
  profile.games++; saveProfile();
  buildArena(duelMap);
  msgEl.classList.add('hidden');
  $('topbar').style.visibility = 'visible';
  clearEnemies(); clearBullets(); clearPowerups();
  powerupT = 6; puIdCounter = 0;
  player.speedT = 0; player.tripleT = 0; player.shieldT = 0;
  shieldBubble.visible = false;
  $('healthwrap').style.visibility = 'hidden';
  setPlayerTank();
  const code = duel && duel.code;
  const SX = cellX(4), SZ = cellZ(11);
  duel = { you, code, myKills: 0, myDeaths: 0, over: false, sendT: 0,
           tx: 0, tz: 0, ta: 0, remoteAlive: true, remoteMesh: buildTank({ color: 0xa03428, scale: 1 }) };
  scene.add(duel.remoteMesh);
  if (you === 1) { player.x = SX; player.z = SZ; player.a = 0; duel.tx = -SX; duel.tz = -SZ; duel.ta = Math.PI; }
  else { player.x = -SX; player.z = -SZ; player.a = Math.PI; duel.tx = SX; duel.tz = SZ; duel.ta = 0; }
  duel.x = duel.tx; duel.z = duel.tz; duel.a = duel.ta;
  duel.remoteMesh.position.set(duel.tx, 0, duel.tz);
  duel.remoteMesh.rotation.y = duel.ta;
  player.alive = true; player.inv = 1.0;
  player.mesh.position.set(player.x, 0, player.z);
  player.mesh.visible = true;
  updateHUD();
  banner(T().duelStart);
  const st = player.stat;
  netSend({ t: 'skin', color: st.color, scale: st.scale });
  audio(); startEngine();
}
function duelPlayerDie() {
  player.alive = false; player.mesh.visible = false;
  explode(player.x, 1.2, player.z, true); hitFlash();
  duel.myDeaths++; netSend({ t: 'die' }); updateHUD();
  if (duel.over) return;
  setTimeout(() => {
    if (!duel || duel.over || mode !== 'duel') return;
    const cell = randOpenCell(duel.tx, duel.tz, 16);
    player.x = cell.x; player.z = cell.z;
    player.a = headingTo(cell.x, cell.z, duel.tx, duel.tz);
    player.alive = true; player.inv = 1.5; player.mesh.visible = true;
  }, 2000);
}
function duelEnd(won) {
  if (!duel || duel.over) return;
  duel.over = true;
  if (won) { profile.wins++; saveProfile(); }
  const t = T(), a = duel.myKills, b = duel.myDeaths;
  banner(won ? t.youWin : t.youLose);
  setTimeout(() => showRematch('duel', won ? t.youWin : t.youLose, t.duelOverSub(a, b)), 1800);
}
function peerLeft() {
  if (!duel || duel.over) return;
  duel.over = true;
  const t = T();
  banner(t.peerLeft);
  setTimeout(() => {
    $('title').textContent = t.title; $('submsg').textContent = t.peerLeft;
    showPanel('panel-main'); msgEl.classList.remove('hidden'); $('topbar').style.visibility = 'hidden';
    closeNet(); clearBallMode(); buildArena(0);
  }, 1500);
}

// maç sonu: aynı odada tekrar oynama ekranı
function showRematch(m, title, sub) {
  if (!ws || ws.readyState !== 1) { closeNet(); clearBallMode(); buildArena(0); openMenu(); return; }
  matchOverMode = m; myReady = false; peerReady = false;
  state = 'over';
  $('title').textContent = title;
  $('submsg').textContent = sub;
  $('rematchstatus').textContent = '';
  $('btn-rematch').disabled = false;
  showPanel('panel-rematch');
  msgEl.classList.remove('hidden');
  $('topbar').style.visibility = 'hidden';
}
function tryRematch() {
  if (myReady && peerReady && matchOverMode && duel) {
    const m = matchOverMode, you = duel.you;
    matchOverMode = null; myReady = false; peerReady = false;
    if (m === 'ball') beginBall(you); else beginDuel(you);
  }
}
function onPeerGone() {
  if (!matchOverMode) return;
  matchOverMode = null;
  const t = T();
  $('title').textContent = t.title; $('submsg').textContent = t.peerLeft;
  showPanel('panel-main'); msgEl.classList.remove('hidden'); $('topbar').style.visibility = 'hidden';
  closeNet(); clearBallMode(); buildArena(0);
}

// ---------------------------------------------------------------- top maçı (1v1)
function clearBallMode() {
  for (const m of ballMeshes) {
    scene.remove(m);
    if (m.geometry && m.geometry.dispose) m.geometry.dispose();
    if (m.material && m.material.dispose) m.material.dispose();
  }
  ballMeshes.length = 0;
  if (ball && ball.mesh) scene.remove(ball.mesh);
  ball = null;
}
function buildBallArena() {
  const wallMaterial = applyTheme('stadium');
  arenaHalf = Math.max(PITCH.PW, PITCH.PH) / 2 + 2;
  walls.length = 0; openCells = [];
  if (wallInst) { scene.remove(wallInst); wallInst.dispose(); wallInst = null; }
  clearBallMode();
  const { PW, PH, BASE } = PITCH;
  const TH = 2, H = 3;
  const addBorder = (cx, cz, sx, sz) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, H, sz), wallMaterial);
    mesh.position.set(cx, H / 2, cz); mesh.castShadow = mesh.receiveShadow = true;
    scene.add(mesh); ballMeshes.push(mesh);
    walls.push({ minX: cx - sx / 2, maxX: cx + sx / 2, minZ: cz - sz / 2, maxZ: cz + sz / 2 });
  };
  addBorder(0, -PH / 2, PW + TH * 2, TH);
  addBorder(0, PH / 2, PW + TH * 2, TH);
  addBorder(-PW / 2, 0, TH, PH);
  addBorder(PW / 2, 0, TH, PH);
  const mkBase = (z, color) => {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(PW, BASE),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.30, side: THREE.DoubleSide }));
    p.rotation.x = -Math.PI / 2; p.position.set(0, 0.05, z);
    scene.add(p); ballMeshes.push(p);
    const line = new THREE.Mesh(new THREE.BoxGeometry(PW, 0.12, 0.35), new THREE.MeshBasicMaterial({ color }));
    line.position.set(0, 0.1, z + (z > 0 ? -BASE / 2 : BASE / 2));
    scene.add(line); ballMeshes.push(line);
  };
  mkBase(PH / 2 - BASE / 2, 0x3aa0ff);
  mkBase(-(PH / 2 - BASE / 2), 0xff4a3a);
  // beyaz saha çizgileri (orta yuvarlak + orta çizgi)
  const circle = new THREE.Mesh(new THREE.RingGeometry(4.6, 5.0, 40),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55, side: THREE.DoubleSide }));
  circle.rotation.x = -Math.PI / 2; circle.position.set(0, 0.06, 0);
  scene.add(circle); ballMeshes.push(circle);
  const midline = new THREE.Mesh(new THREE.BoxGeometry(PW, 0.02, 0.3),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 }));
  midline.position.set(0, 0.06, 0); scene.add(midline); ballMeshes.push(midline);
  // beyaz kale direkleri
  const goalW = 12, goalH = 4;
  const postGeo = new THREE.BoxGeometry(0.32, goalH, 0.32);
  const barGeo = new THREE.BoxGeometry(goalW + 0.32, 0.32, 0.32);
  const mkGoal = (z) => {
    for (const sx of [-goalW / 2, goalW / 2]) {
      const p = new THREE.Mesh(postGeo, dMat.white); p.position.set(sx, goalH / 2, z);
      p.castShadow = true; scene.add(p); ballMeshes.push(p);
    }
    const bar = new THREE.Mesh(barGeo, dMat.white); bar.position.set(0, goalH, z);
    scene.add(bar); ballMeshes.push(bar);
  };
  mkGoal(PH / 2 - 0.7); mkGoal(-(PH / 2 - 0.7));
}
function makeBall() {
  const geo = new THREE.SphereGeometry(BALL_R, 26, 18);
  const mat = new THREE.MeshStandardMaterial({ color: 0xfff2d0, metalness: 0.2, roughness: 0.3, emissive: 0x332200, emissiveIntensity: 0.5 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.add(new THREE.PointLight(0xffddaa, 10, 12, 2));
  scene.add(mesh);
  return mesh;
}
function resetBallPositions() {
  const zc = PITCH.PH / 2 - 6;
  const mine = duel.you === 1 ? { x: 0, z: zc, a: 0 } : { x: 0, z: -zc, a: Math.PI };
  const theirs = duel.you === 1 ? { x: 0, z: -zc, a: Math.PI } : { x: 0, z: zc, a: 0 };
  player.x = mine.x; player.z = mine.z; player.a = mine.a;
  player.mesh.position.set(player.x, 0, player.z); player.mesh.rotation.y = player.a;
  duel.tx = theirs.x; duel.tz = theirs.z; duel.ta = theirs.a;
  duel.x = theirs.x; duel.z = theirs.z; duel.a = theirs.a;
  duel.remoteMesh.position.set(duel.x, 0, duel.z); duel.remoteMesh.rotation.y = duel.a;
  if (ball) { ball.x = 0; ball.z = 0; ball.vx = 0; ball.vz = 0; ball.tx = 0; ball.tz = 0; ball.scored = false; ball.mesh.position.set(0, BALL_R, 0); }
}
function beginBall(you) {
  mode = 'ball'; state = 'play';
  isAuthority = (you === 1);
  profile.games++; saveProfile();
  buildBallArena();
  msgEl.classList.add('hidden');
  $('topbar').style.visibility = 'visible';
  $('healthwrap').style.visibility = 'hidden';
  clearEnemies(); clearBullets();
  setPlayerTank();
  const code = duel && duel.code;
  duel = { you, code, over: false, sendT: 0, tx: 0, tz: 0, ta: 0, x: 0, z: 0, a: 0,
           remoteAlive: true, remoteMesh: buildTank({ color: 0xa03428, scale: 1 }) };
  scene.add(duel.remoteMesh);
  ball = { x: 0, z: 0, vx: 0, vz: 0, tx: 0, tz: 0, g1: 0, g2: 0, over: false, sendT: 0, mesh: makeBall() };
  resetBallPositions();
  player.alive = true; player.mesh.visible = true;
  updateHUD();
  banner(T().ballBtn);
  const st = player.stat;
  netSend({ t: 'skin', color: st.color, scale: st.scale });
  audio(); startEngine();
}
function clampBall() {
  const sp = Math.hypot(ball.vx, ball.vz);
  if (sp > BALL_MAX_SPEED) { ball.vx = ball.vx / sp * BALL_MAX_SPEED; ball.vz = ball.vz / sp * BALL_MAX_SPEED; }
}
function pushBallByTank(tx, tz) {
  const dx = ball.x - tx, dz = ball.z - tz, d = Math.hypot(dx, dz), rad = BALL_R + TANK_R;
  if (d < rad && d > 0.01) {
    const nx = dx / d, nz = dz / d;
    ball.x = tx + nx * rad; ball.z = tz + nz * rad;
    ball.vx = ball.vx * 0.4 + nx * 9; ball.vz = ball.vz * 0.4 + nz * 9;
    clampBall();
  }
}
function updateBall(dt) {
  if (ball.over || ball.scored) return;
  ball.x += ball.vx * dt; ball.z += ball.vz * dt;
  const fr = Math.pow(0.45, dt);
  ball.vx *= fr; ball.vz *= fr;
  for (const w of walls) {
    const cx = Math.max(w.minX, Math.min(ball.x, w.maxX));
    const cz = Math.max(w.minZ, Math.min(ball.z, w.maxZ));
    const dx = ball.x - cx, dz = ball.z - cz, d2 = dx * dx + dz * dz;
    if (d2 < BALL_R * BALL_R) {
      const d = Math.sqrt(d2) || 0.001, nx = dx / d, nz = dz / d;
      ball.x = cx + nx * BALL_R; ball.z = cz + nz * BALL_R;
      const dot = ball.vx * nx + ball.vz * nz;
      ball.vx -= 1.6 * dot * nx; ball.vz -= 1.6 * dot * nz;
    }
  }
  pushBallByTank(player.x, player.z);
  if (duel) pushBallByTank(duel.x, duel.z);
  ball.mesh.position.set(ball.x, BALL_R, ball.z);
  ball.mesh.rotation.x += ball.vz * dt * 0.6;
  ball.mesh.rotation.z -= ball.vx * dt * 0.6;
  if (!ball.scored) {
    if (ball.z > PITCH.baseZ1) doGoal(2);
    else if (ball.z < PITCH.baseZ2) doGoal(1);
  }
  ball.sendT -= dt;
  if (ball.sendT <= 0) {
    ball.sendT = 0.045;
    netSend({ t: 'ball', x: ball.x, z: ball.z, rx: ball.mesh.rotation.x, rz: ball.mesh.rotation.z });
  }
}
function doGoal(scorer) {
  if (ball.over || ball.scored) return;
  ball.scored = true; ball.vx = 0; ball.vz = 0;
  if (scorer === 1) ball.g1++; else ball.g2++;
  const done = ball.g1 >= BALL_TARGET || ball.g2 >= BALL_TARGET;
  if (done) ball.over = true;
  netSend({ t: 'goal', g1: ball.g1, g2: ball.g2, scorer, done });
  applyGoal(ball.g1, ball.g2, scorer);
  if (done) endBall();
  else setTimeout(() => { if (ball && !ball.over) resetBallPositions(); }, 900);
}
function applyGoal(g1, g2, scorer) {
  if (!ball) return;
  ball.g1 = g1; ball.g2 = g2;
  updateHUD();
  banner(scorer === duel.you ? T().golYou : T().golOpp);
  explode(ball.x, 1.2, ball.z, true);
  if (!isAuthority) { ball.vx = 0; ball.vz = 0; setTimeout(() => { if (ball && !ball.over) resetBallPositions(); }, 900); }
}
function endBall() {
  const t = T();
  const winner = ball.g1 > ball.g2 ? 1 : 2;
  const won = winner === duel.you;
  ball.over = true;
  if (won) { profile.wins++; saveProfile(); }
  banner(won ? t.youWin : t.youLose);
  const a = duel.you === 1 ? ball.g1 : ball.g2;
  const b = duel.you === 1 ? ball.g2 : ball.g1;
  setTimeout(() => showRematch('ball', won ? t.youWin : t.youLose, t.duelOverSub(a, b)), 1900);
}

// ---------------------------------------------------------------- kooperatif
function clearCoop() {
  if (coop) for (const rm of coop.remotes.values()) scene.remove(rm.mesh);
  for (const ce of coopEnemies.values()) scene.remove(ce);
  coopEnemies.clear();
  clearEnemies(); clearPowerups();
  coop = null;
}
function placeCoopSpawns() {
  const posOf = pid => { const [c, r] = COOP_SPAWNS[(pid - 1) % 4]; return { x: cellX(c), z: cellZ(r) }; };
  const me = posOf(coop.you);
  player.x = me.x; player.z = me.z; player.a = 0; player.inv = 1.5;
  player.mesh.position.set(player.x, 0, player.z); player.mesh.visible = true;
  for (const [pid, rm] of coop.remotes) {
    const p = posOf(pid);
    rm.x = rm.tx = p.x; rm.z = rm.tz = p.z; rm.a = rm.ta = 0; rm.inv = 1.5;
    rm.mesh.position.set(rm.x, 0, rm.z); rm.mesh.visible = true;
  }
}
function beginCoop(you, players, mapIdx) {
  mode = 'coop'; state = 'play';
  const host = you === players[0];
  isAuthority = host;
  buildArena(mapIdx);
  msgEl.classList.add('hidden');
  $('topbar').style.visibility = 'visible';
  $('healthwrap').style.visibility = 'visible';
  clearEnemies(); clearBullets(); clearPowerups();
  for (const ce of coopEnemies.values()) scene.remove(ce);
  coopEnemies.clear();
  setPlayerTank();
  player.speedT = 0; player.tripleT = 0; player.shieldT = 0; shieldBubble.visible = false;
  player.health = player.maxHealth; player.alive = true;
  coop = { you, players: players.slice(), hostPid: players[0], isHost: host, remotes: new Map(), sendT: 0, enemT: 0, over: false };
  for (const pid of players) if (pid !== you) {
    const rmMesh = buildTank({ color: PLAYER_COLORS[pid] || 0x888888, scale: 1 });
    scene.add(rmMesh);
    coop.remotes.set(pid, { mesh: rmMesh, x: 0, z: 0, tx: 0, tz: 0, a: 0, ta: 0, alive: true, hp: player.maxHealth, inv: 0 });
  }
  placeCoopSpawns();
  wave = 1; score = 0; roundCoins = 0; powerupT = 6; puIdCounter = 0; enemyIdC = 0;
  profile.games++; saveProfile();
  renderHealth(); updateHUD();
  banner(`${T().wave} 1`);
  if (host) spawnEnemies(waveComposition(1, players.length));
  audio(); startEngine();
}
function coopNearestPlayer(e) {
  let best = null, bd = 1e9;
  const cand = [];
  if (player.alive) cand.push({ x: player.x, z: player.z, alive: true });
  for (const rm of coop.remotes.values()) if (rm.alive) cand.push({ x: rm.x, z: rm.z, alive: true });
  for (const c of cand) { const d = Math.hypot(c.x - e.x, c.z - e.z); if (d < bd) { bd = d; best = c; } }
  return best;
}
function coopHitPlayer(pid) {
  if (pid === coop.you) {
    if (player.shieldT > 0) { player.inv = 0.3; explode(player.x, 1, player.z, false); sfxBounce(); return; }
    player.inv = 1.0; player.health--; renderHealth(); hitFlash(); explode(player.x, 1, player.z, false);
    if (player.health <= 0) { player.alive = false; player.mesh.visible = false; explode(player.x, 1.2, player.z, true); }
    netSend({ t: 'phealth', pid, hp: player.health, alive: player.alive });
  } else {
    const rm = coop.remotes.get(pid); if (!rm) return;
    rm.inv = 1.0; rm.hp--; explode(rm.x, 1, rm.z, false);
    if (rm.hp <= 0) { rm.alive = false; rm.mesh.visible = false; explode(rm.x, 1.2, rm.z, true); }
    netSend({ t: 'phealth', pid, hp: rm.hp, alive: rm.alive });
  }
  coopCheckOver();
}
function coopCheckOver() {
  if (!isAuthority || coop.over) return;
  const anyAlive = player.alive || [...coop.remotes.values()].some(r => r.alive);
  if (!anyAlive) { coop.over = true; netSend({ t: 'coopover' }); coopGameOver(); }
}
function coopNextWave() {
  wave++;
  if (wave > profile.bestWave) { profile.bestWave = wave; saveProfile(); }
  player.alive = true; player.health = Math.min(player.maxHealth, player.health + 2);
  for (const rm of coop.remotes.values()) { rm.alive = true; rm.hp = player.maxHealth; }
  placeCoopSpawns();
  renderHealth(); updateHUD();
  const bonus = wave * 25; roundCoins += bonus; addCoins(bonus);
  netSend({ t: 'wave', n: wave });
  netSend({ t: 'phealth', pid: coop.you, hp: player.health, alive: true });
  for (const [pid, rm] of coop.remotes) netSend({ t: 'phealth', pid, hp: rm.hp, alive: true });
  banner(wave % 5 === 0 ? T().bossW : `${T().wave} ${wave}  +🪙${bonus}`);
  spawnEnemies(waveComposition(wave, coop.players.length));
}
function coopGameOver() {
  if (coop) coop.over = true;
  state = 'over';
  const t = T();
  $('title').textContent = t.over;
  $('submsg').textContent = t.overSub(score, wave, roundCoins);
  showPanel('panel-main'); msgEl.classList.remove('hidden'); $('topbar').style.visibility = 'hidden';
  clearCoop(); closeNet();
  updateCoinBar(); updateStats();
}
function coopPeerLeft(who) {
  if (!coop) return;
  const rm = coop.remotes.get(who);
  if (rm) { scene.remove(rm.mesh); coop.remotes.delete(who); }
  coop.players = coop.players.filter(p => p !== who);
  banner(T().peerLeft);
  if (who === coop.hostPid && !isAuthority) setTimeout(() => { if (mode === 'coop') coopGameOver(); }, 900);
  else coopCheckOver();
}
function handleCoopNet(m) {
  if (!coop) return;
  if (m.t === 'state') {
    const rm = coop.remotes.get(m.from);
    if (rm) { rm.tx = m.x; rm.tz = m.z; rm.ta = m.a; if (!isAuthority) rm.alive = m.alive; rm.mesh.visible = rm.alive; }
  } else if (m.t === 'fire') {
    if (m.trip) { fire({ x: m.x, z: m.z, a: m.a, bspeed: m.bs }, -0.17, true); fire({ x: m.x, z: m.z, a: m.a, bspeed: m.bs }, 0, true); fire({ x: m.x, z: m.z, a: m.a, bspeed: m.bs }, 0.17, true); }
    else fire({ x: m.x, z: m.z, a: m.a, bspeed: m.bs }, 0, true);
  } else if (m.t === 'efire') {
    if (m.trip) { fire({ x: m.x, z: m.z, a: m.a }, -0.2, false); fire({ x: m.x, z: m.z, a: m.a }, 0, false); fire({ x: m.x, z: m.z, a: m.a }, 0.2, false); }
    else fire({ x: m.x, z: m.z, a: m.a }, 0, false);
  } else if (m.t === 'enemies') {
    for (const it of m.list) {
      let ce = coopEnemies.get(it.id);
      if (!ce) { ce = buildTank({ color: it.c || 0xa03428, scale: 1 }); scene.add(ce); coopEnemies.set(it.id, ce); }
      ce.userData.tx = it.x; ce.userData.tz = it.z; ce.userData.ta = it.a;
    }
  } else if (m.t === 'ekill') {
    const ce = coopEnemies.get(m.id);
    if (ce) { explode(ce.position.x, 1, ce.position.z, true); scene.remove(ce); coopEnemies.delete(m.id); }
  } else if (m.t === 'wave') {
    wave = m.n; updateHUD(); banner(`${T().wave} ${wave}`);
    for (const ce of coopEnemies.values()) scene.remove(ce);
    coopEnemies.clear();
    player.alive = true; player.mesh.visible = true;
  } else if (m.t === 'phealth') {
    if (m.pid === coop.you) {
      player.health = m.hp; player.alive = m.alive; renderHealth();
      if (!m.alive) { player.mesh.visible = false; } else { player.mesh.visible = true; }
      if (m.hp >= 0 && m.alive) hitFlash();
    }
  } else if (m.t === 'pu_spawn') { addPowerup(m.type, m.x, m.z, m.id); }
  else if (m.t === 'pu_take') { const i = powerups.findIndex(p => p.id === m.id); if (i >= 0) { scene.remove(powerups[i].mesh); powerups.splice(i, 1); } }
  else if (m.t === 'coopover') { coopGameOver(); }
  else if (m.t === 'peerleft') { coopPeerLeft(m.who); }
}
function updateCoop(dt) {
  coop.sendT -= dt;
  if (coop.sendT <= 0) { coop.sendT = 0.05; netSend({ t: 'state', x: player.x, z: player.z, a: player.a, alive: player.alive }); }
  const k = 1 - Math.exp(-12 * dt);
  for (const rm of coop.remotes.values()) {
    rm.x += (rm.tx - rm.x) * k; rm.z += (rm.tz - rm.z) * k; rm.a += angNorm(rm.ta - rm.a) * k;
    rm.mesh.position.set(rm.x, 0, rm.z); rm.mesh.rotation.y = rm.a; rm.mesh.visible = rm.alive;
    if (rm.inv > 0) rm.inv -= dt;
  }
  if (isAuthority) {
    for (const e of enemies) updateEnemy(e, dt, coopNearestPlayer(e));
    coop.enemT -= dt;
    if (coop.enemT <= 0) {
      coop.enemT = 0.06;
      netSend({ t: 'enemies', list: enemies.map(e => ({ id: e.id, x: +e.x.toFixed(2), z: +e.z.toFixed(2), a: +e.a.toFixed(2), c: e.color })) });
    }
    enemies = enemies.filter(e => e.alive);
    if (enemies.length === 0 && !coop.over) coopNextWave();
  } else {
    for (const ce of coopEnemies.values()) {
      const u = ce.userData;
      if (u.tx !== undefined) { ce.position.x += (u.tx - ce.position.x) * k; ce.position.z += (u.tz - ce.position.z) * k; ce.rotation.y += angNorm(u.ta - ce.rotation.y) * k; }
    }
  }
}

// ---------------------------------------------------------------- menü olayları
$('lang-tr').addEventListener('click', () => { lang = 'tr'; applyLang(); if ($('panel-garage').classList.contains('show')) renderGarage(); if ($('panel-maps').classList.contains('show')) renderMaps(); });
$('lang-en').addEventListener('click', () => { lang = 'en'; applyLang(); if ($('panel-garage').classList.contains('show')) renderGarage(); if ($('panel-maps').classList.contains('show')) renderMaps(); });
$('btn-single').addEventListener('click', () => { $('title').textContent = T().chooseMap; $('submsg').textContent = T().bestWave(profile.bestWave); renderMaps(); showPanel('panel-maps'); });
function renderMapPicker(containerId, rerender) {
  const wrap = $(containerId);
  wrap.style.cssText = 'display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin:4px 8px 12px;max-width:640px';
  wrap.innerHTML = '';
  MAPS.forEach((mp, idx) => {
    const b = document.createElement('button');
    b.className = 'mbtn small' + (idx === duelMap ? ' on' : '');
    b.textContent = mp.name[lang];
    b.onclick = () => { duelMap = idx; rerender(); };
    wrap.appendChild(b);
  });
}
function renderDuelMaps() { renderMapPicker('duelmapsrow', renderDuelMaps); }
function renderCoopMaps() { renderMapPicker('coopmapsrow', renderCoopMaps); }
$('btn-duel').addEventListener('click', () => { pendingMode = 'duel'; duelStatusEl.textContent = ''; $('title').textContent = T().duel; $('submsg').textContent = T().duelSub(KILL_TARGET); $('duelmapsrow').style.display = 'flex'; renderDuelMaps(); showPanel('panel-duel'); });
$('btn-ball').addEventListener('click', () => { pendingMode = 'ball'; duelStatusEl.textContent = ''; $('title').textContent = T().ballBtn; $('submsg').textContent = T().ballSub(BALL_TARGET); $('duelmapsrow').style.display = 'none'; showPanel('panel-duel'); });
$('btn-garage').addEventListener('click', () => { $('title').textContent = T().garage; $('submsg').textContent = '🪙 ' + profile.coins; renderGarage(); showPanel('panel-garage'); });
$('btn-back-maps').addEventListener('click', openMenu);
$('btn-back-garage').addEventListener('click', openMenu);
$('btn-back-duel').addEventListener('click', () => { closeNet(); openMenu(); });

// kooperatif menü
function updateLobby(count, players) {
  const t = T();
  const code = coopCode || '';
  $('coopstatus').innerHTML = `${t.roomLbl} <span class="code">${code}</span><br>${count}/4 ${t.playersW}` +
    (coopIsHost ? '' : `<br>${t.waitHost}`);
  $('btn-coop-start').style.display = (coopIsHost && count >= 2) ? 'inline-block' : 'none';
}
$('btn-coop').addEventListener('click', () => {
  pendingMode = 'coop'; coopCode = null; coopIsHost = false;
  $('title').textContent = T().coopBtn; $('submsg').textContent = T().coopSub;
  $('coopstatus').textContent = ''; $('btn-coop-start').style.display = 'none';
  renderCoopMaps(); showPanel('panel-coop');
});
$('btn-coop-create').addEventListener('click', () => {
  pendingMode = 'coop'; coopIsHost = true;
  $('coopstatus').textContent = '...';
  connectNet(() => netSend({ t: 'create', cap: 4 }));
});
$('btn-coop-join').addEventListener('click', () => {
  const code = $('coopcode').value.trim().toUpperCase();
  if (code.length !== 4) { $('coopstatus').textContent = T().joinFail; return; }
  pendingMode = 'coop'; coopIsHost = false; coopCode = code;
  $('coopstatus').textContent = '...';
  connectNet(() => netSend({ t: 'join', code }));
});
$('btn-coop-start').addEventListener('click', () => { netSend({ t: 'startgame', map: duelMap }); });
$('btn-back-coop').addEventListener('click', () => { closeNet(); openMenu(); });
$('btn-rematch').addEventListener('click', () => {
  if (myReady || !matchOverMode) return;
  myReady = true;
  $('btn-rematch').disabled = true;
  $('rematchstatus').textContent = T().rematchWait;
  netSend({ t: 'rematch' });
  tryRematch();
});
$('btn-leave').addEventListener('click', () => { closeNet(); clearBallMode(); buildArena(0); openMenu(); });

// ---------------------------------------------------------------- ayarlar
function updateSettingsLabels() {
  const t = T();
  $('set-title').textContent = paused ? t.pausedW : t.setTitle;
  $('set-sound').textContent = `${t.setSound}: ${settings.muted ? t.offW : t.onW}`;
  $('set-quality').textContent = `${t.setQuality}: ${settings.quality === 'low' ? t.qLow : t.qHigh}`;
  $('set-resume').textContent = t.resumeW;
  $('set-quit').textContent = t.toMenuW;
  $('set-close').textContent = t.closeW;
}
function openSettings() {
  const inGame = state === 'play';
  if (inGame && mode === 'solo') paused = true;
  $('set-ingame').style.display = inGame ? 'flex' : 'none';
  updateSettingsLabels();
  $('settings').classList.remove('hidden');
}
function closeSettings() { paused = false; $('settings').classList.add('hidden'); }
$('btn-settings').addEventListener('click', openSettings);
$('btn-settings-menu').addEventListener('click', openSettings);
$('set-sound').addEventListener('click', () => { settings.muted = !settings.muted; saveSettings(); updateSettingsLabels(); if (!settings.muted) sfxCoin(); });
$('set-quality').addEventListener('click', () => { settings.quality = settings.quality === 'low' ? 'high' : 'low'; saveSettings(); applyQuality(); updateSettingsLabels(); });
$('set-resume').addEventListener('click', closeSettings);
$('set-close').addEventListener('click', closeSettings);
$('set-quit').addEventListener('click', () => { paused = false; $('settings').classList.add('hidden'); closeNet(); clearBallMode(); clearCoop(); buildArena(0); openMenu(); });
$('btn-create').addEventListener('click', () => { duel = { code: null }; duelStatusEl.textContent = '...'; connectNet(() => netSend({ t: 'create' })); });
$('btn-join').addEventListener('click', () => {
  const code = $('joincode').value.trim().toUpperCase();
  if (code.length !== 4) { duelStatusEl.textContent = T().joinFail; return; }
  duel = { code }; duelStatusEl.textContent = '...';
  connectNet(() => netSend({ t: 'join', code }));
});

// ---------------------------------------------------------------- girdi
addEventListener('keydown', e => {
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
  if (e.target && e.target.tagName === 'INPUT') { keys[e.code] = false; return; }
  if (e.code === 'Escape' || e.code === 'KeyP') {
    if ($('settings').classList.contains('hidden')) openSettings(); else closeSettings();
    return;
  }
  keys[e.code] = true;
});
addEventListener('keyup', e => { keys[e.code] = false; });

const touchCtl = { turn: 0, move: 0, fire: false };
if (IS_TOUCH) {
  document.body.classList.add('touch');
  const stick = $('stick'), knob = $('knob'), fireBtn = $('firebtn');
  let sid = null;
  const setKnob = (dx, dy) => { knob.style.transform = `translate(${dx}px, ${dy}px)`; };
  const applyStick = t => {
    const r = stick.getBoundingClientRect();
    let dx = t.clientX - (r.left + r.width / 2), dy = t.clientY - (r.top + r.height / 2);
    const max = r.width / 2 - 18, d = Math.hypot(dx, dy);
    if (d > max) { dx = dx / d * max; dy = dy / d * max; }
    setKnob(dx, dy);
    const nx = dx / max, ny = dy / max;
    touchCtl.turn = Math.abs(nx) > 0.2 ? -nx : 0;
    touchCtl.move = Math.abs(ny) > 0.2 ? -ny : 0;
  };
  stick.addEventListener('touchstart', e => { e.preventDefault(); const t = e.changedTouches[0]; sid = t.identifier; applyStick(t); }, { passive: false });
  stick.addEventListener('touchmove', e => { for (const t of e.changedTouches) { if (t.identifier !== sid) continue; e.preventDefault(); applyStick(t); } }, { passive: false });
  const stickEnd = e => { for (const t of e.changedTouches) if (t.identifier === sid) { sid = null; setKnob(0, 0); touchCtl.turn = 0; touchCtl.move = 0; } };
  stick.addEventListener('touchend', stickEnd);
  stick.addEventListener('touchcancel', stickEnd);
  fireBtn.addEventListener('touchstart', e => { e.preventDefault(); touchCtl.fire = true; }, { passive: false });
  fireBtn.addEventListener('touchend', () => { touchCtl.fire = false; });
  fireBtn.addEventListener('touchcancel', () => { touchCtl.fire = false; });
}

// ---------------------------------------------------------------- düşman AI
function updateEnemy(e, dt, tgt) {
  e.cool -= dt; e.thinkT -= dt;
  const tp = tgt || player;
  const alive = tgt ? true : player.alive;
  const et = e.turn || ENEMY_TURN, es = e.speed || ENEMY_SPEED, keep = e.keep || 11;
  const distP = Math.hypot(tp.x - e.x, tp.z - e.z);
  const seen = alive && distP < (e.sight || 55) && losClear(e.x, e.z, tp.x, tp.z);
  let wantMove = 0;
  if (seen) {
    const target = headingTo(e.x, e.z, tp.x, tp.z);
    const diff = angNorm(target - e.a);
    e.a += Math.max(-et * dt, Math.min(et * dt, diff));
    if (Math.abs(diff) < 0.09 && e.cool <= 0) {
      if (e.triple) { fire(e, -0.2); fire(e, 0); fire(e, 0.2); } else fire(e);
      if (mode === 'coop') netSend({ t: 'efire', x: e.x, z: e.z, a: e.a, trip: e.triple });
      const c = ENEMY_TYPES[e.type] ? ENEMY_TYPES[e.type].cool : [2.2, 3.8];
      e.cool = c[0] + Math.random() * (c[1] - c[0]);
    }
    if (Math.abs(diff) < 0.5) { if (distP > keep + 3) wantMove = 1; else if (distP < keep - 3) wantMove = -1; }
  } else {
    if (e.thinkT <= 0) {
      e.thinkT = 1.2 + Math.random() * 1.8;
      e.turnDir = Math.random() < 0.5 ? -1 : 1;
      if (Math.random() < 0.45) { const target = headingTo(e.x, e.z, tp.x, tp.z); e.turnDir = angNorm(target - e.a) > 0 ? 1 : -1; }
    }
    const px = e.x + fwdX(e.a) * 3.0, pz = e.z + fwdZ(e.a) * 3.0;
    if (pointInWall(px, pz)) e.a += e.turnDir * et * dt;
    else {
      wantMove = 1;
      const target = headingTo(e.x, e.z, tp.x, tp.z);
      const diff = angNorm(target - e.a);
      e.a += Math.max(-0.5 * et * dt, Math.min(0.5 * et * dt, diff));
    }
  }
  if (wantMove !== 0) { e.x += fwdX(e.a) * es * wantMove * dt; e.z += fwdZ(e.a) * es * wantMove * dt; }
  const pos = { x: e.x, z: e.z };
  circleVsWalls(pos, TANK_R);
  e.x = pos.x; e.z = pos.z;
  e.mesh.position.set(e.x, 0, e.z);
  e.mesh.rotation.y = e.a;
}

// ---------------------------------------------------------------- ana döngü
const clock = new THREE.Clock();
applyLang();
openMenu();

function tick() {
  requestAnimationFrame(tick);
  const dt = Math.min(clock.getDelta(), 0.05);

  if (state === 'play' && !paused) {
    if (player.alive) {
      player.cool -= dt; player.inv -= dt;
      if (player.speedT > 0) player.speedT -= dt;
      if (player.tripleT > 0) player.tripleT -= dt;
      if (player.shieldT > 0) player.shieldT -= dt;
      let turn = (keys.KeyA || keys.ArrowLeft ? 1 : 0) - (keys.KeyD || keys.ArrowRight ? 1 : 0) + touchCtl.turn;
      let move = (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0) + touchCtl.move;
      turn = Math.max(-1, Math.min(1, turn)); move = Math.max(-1, Math.min(1, move));
      player.a += turn * player.stat.turn * dt;
      player.speed = move * player.stat.speed * (player.speedT > 0 ? 1.6 : 1);
      player.x += fwdX(player.a) * player.speed * dt;
      player.z += fwdZ(player.a) * player.speed * dt;
      const pos = { x: player.x, z: player.z };
      circleVsWalls(pos, TANK_R);
      player.x = pos.x; player.z = pos.z;

      let others;
      if (mode === 'duel') others = (duel && duel.remoteAlive ? [{ x: duel.x, z: duel.z, solid: false }] : []);
      else if (mode === 'coop') others = [...coop.remotes.values()].filter(r => r.alive).map(r => ({ x: r.x, z: r.z, solid: false })).concat(isAuthority ? enemies : []);
      else others = enemies;
      for (const e of others) {
        const dx = player.x - e.x, dz = player.z - e.z, d = Math.hypot(dx, dz);
        if (d < TANK_R * 2 && d > 0.01) {
          const push = (TANK_R * 2 - d) / (e.solid === false ? 1 : 2);
          player.x += (dx / d) * push; player.z += (dz / d) * push;
          if (e.solid !== false) { e.x -= (dx / d) * push; e.z -= (dz / d) * push; }
        }
      }
      if ((keys.Space || touchCtl.fire) && player.cool <= 0) {
        if (player.tripleT > 0) { fire(player, -0.17); fire(player, 0); fire(player, 0.17); }
        else fire(player);
        player.cool = player.stat.cool;
        if (mode === 'duel' || mode === 'ball' || mode === 'coop') netSend({ t: 'fire', x: player.x, z: player.z, a: player.a, bs: player.stat.bspeed, trip: player.tripleT > 0 });
      }
      player.mesh.position.set(player.x, 0, player.z);
      player.mesh.rotation.y = player.a;
      if (playerTurret) { recoil = Math.max(0, recoil - dt * 0.8); playerTurret.position.z = turretBaseZ + recoil; }
    }

    if (mode === 'solo' || mode === 'duel' || mode === 'coop') updatePowerups(dt);

    if (mode === 'coop' && coop) updateCoop(dt);

    if (mode === 'solo') {
      for (const e of enemies) updateEnemy(e, dt);
    } else if (duel) {
      const k = 1 - Math.exp(-12 * dt);
      duel.x += (duel.tx - duel.x) * k;
      duel.z += (duel.tz - duel.z) * k;
      duel.a += angNorm(duel.ta - duel.a) * k;
      duel.remoteMesh.position.set(duel.x, 0, duel.z);
      duel.remoteMesh.rotation.y = duel.a;
      duel.sendT -= dt;
      if (duel.sendT <= 0) { duel.sendT = 0.05; netSend({ t: 'state', x: player.x, z: player.z, a: player.a, alive: player.alive }); }
    }
    if (mode === 'ball' && ball) {
      if (isAuthority) updateBall(dt);
      else {
        const k = 1 - Math.exp(-14 * dt);
        ball.x += (ball.tx - ball.x) * k;
        ball.z += (ball.tz - ball.z) * k;
        ball.mesh.position.set(ball.x, BALL_R, ball.z);
      }
    }

    for (let i = bullets.length - 1; i >= 0; i--) {
      const b = bullets[i];
      b.life -= dt;
      const nx = b.mesh.position.x + b.vx * dt, nz = b.mesh.position.z + b.vz * dt;
      const w = pointInWall(nx, nz);
      let dead = b.life <= 0;
      if (w && !dead) {
        if (b.bounces > 0) {
          const inX = b.mesh.position.x > w.minX && b.mesh.position.x < w.maxX;
          if (inX) b.vz = -b.vz; else b.vx = -b.vx;
          b.bounces--; sfxBounce();
        } else { explode(b.mesh.position.x, 1.0, b.mesh.position.z, false); dead = true; }
      } else { b.mesh.position.x = nx; b.mesh.position.z = nz; }

      if (!dead && mode === 'ball' && ball) {
        const dbx = b.mesh.position.x - ball.x, dbz = b.mesh.position.z - ball.z;
        if (dbx * dbx + dbz * dbz < (BALL_R + 0.35) * (BALL_R + 0.35)) {
          if (isAuthority) {
            const len = Math.hypot(b.vx, b.vz) || 1;
            ball.vx += b.vx / len * BULLET_IMPULSE; ball.vz += b.vz / len * BULLET_IMPULSE;
            clampBall();
          }
          explode(b.mesh.position.x, 1.0, b.mesh.position.z, false); dead = true;
        }
      }
      if (!dead && mode === 'coop') {
        if (b.playerShot) {
          if (isAuthority) {
            for (const e of enemies) {
              const hr = 1.4 * (e.type === 'boss' ? 1.7 : 1);
              if (e.alive && Math.hypot(b.mesh.position.x - e.x, b.mesh.position.z - e.z) < hr) {
                e.hp--;
                if (e.hp <= 0) {
                  e.alive = false; explode(e.x, 1.0, e.z, true); scene.remove(e.mesh);
                  netSend({ t: 'ekill', id: e.id });
                  score += e.score; roundCoins += e.coins; profile.kills++; addCoins(e.coins); updateHUD();
                } else { explode(b.mesh.position.x, 1.0, b.mesh.position.z, false); }
                dead = true; break;
              }
            }
          }
        } else if (isAuthority) {
          if (player.alive && player.inv <= 0 && Math.hypot(b.mesh.position.x - player.x, b.mesh.position.z - player.z) < 1.5) {
            coopHitPlayer(coop.you); dead = true;
          } else {
            for (const [pid, rm] of coop.remotes) {
              if (rm.alive && rm.inv <= 0 && Math.hypot(b.mesh.position.x - rm.x, b.mesh.position.z - rm.z) < 1.5) {
                coopHitPlayer(pid); dead = true; break;
              }
            }
          }
        }
      }
      if (!dead && mode !== 'coop' && b.fromPlayer) {
        if (mode === 'solo') {
          for (const e of enemies) {
            const hr = 1.4 * (e.type === 'boss' ? 1.7 : 1);
            if (e.alive && Math.hypot(b.mesh.position.x - e.x, b.mesh.position.z - e.z) < hr) {
              e.hp--;
              if (e.hp <= 0) {
                e.alive = false; explode(e.x, 1.0, e.z, true); scene.remove(e.mesh);
                score += e.score; roundCoins += e.coins; profile.kills++; addCoins(e.coins); updateHUD();
              } else { explode(b.mesh.position.x, 1.0, b.mesh.position.z, false); }
              dead = true; break;
            }
          }
        } else if (mode === 'duel' && duel && duel.remoteAlive && Math.hypot(b.mesh.position.x - duel.x, b.mesh.position.z - duel.z) < 1.5) {
          explode(b.mesh.position.x, 1.0, b.mesh.position.z, false); dead = true;
        }
      } else if (!dead && mode !== 'coop' && !b.fromPlayer && player.alive && player.inv <= 0 && mode !== 'ball') {
        if (Math.hypot(b.mesh.position.x - player.x, b.mesh.position.z - player.z) < 1.5) {
          dead = true;
          if (player.shieldT > 0) {
            player.inv = 0.3;
            explode(b.mesh.position.x, 1.0, b.mesh.position.z, false);
            sfxBounce();
          }
          else if (mode === 'duel') duelPlayerDie();
          else {
            player.inv = 1.0; player.health--; renderHealth(); hitFlash();
            explode(b.mesh.position.x, 1.0, b.mesh.position.z, false);
            if (player.health <= 0) {
              player.alive = false; player.mesh.visible = false;
              explode(player.x, 1.2, player.z, true);
              setTimeout(gameOver, 1600);
            }
          }
        }
      }
      if (dead) { scene.remove(b.mesh); bullets.splice(i, 1); }
    }

    if (mode === 'solo') {
      enemies = enemies.filter(e => e.alive);
      if (enemies.length === 0 && player.alive) {
        wave++;
        if (wave > profile.bestWave) { profile.bestWave = wave; saveProfile(); }
        const bonus = wave * 25; roundCoins += bonus; addCoins(bonus);
        updateHUD();
        banner(wave % 5 === 0 ? T().bossW : `${T().wave} ${wave}  +🪙${bonus}`);
        player.health = Math.min(player.maxHealth, player.health + 1);
        renderHealth();
        spawnEnemies(waveComposition(wave));
      }
    }
  }

  updateParticles(dt);
  updateFlashes(dt);

  const bossE = (state === 'play' && (mode === 'solo' || (mode === 'coop' && isAuthority))) ? enemies.find(e => e.type === 'boss' && e.alive) : null;
  updateBossBar(bossE);
  updateBuffs();
  drawMinimap();
  updateEngine();

  // kalkan baloncuğu
  const sh = state === 'play' && player.alive && player.shieldT > 0;
  shieldBubble.visible = sh;
  if (sh) {
    shieldBubble.position.set(player.x, 1.0, player.z);
    const pulse = 0.18 + Math.abs(Math.sin(clock.elapsedTime * 5)) * 0.12;
    shieldBubble.material.opacity = player.shieldT < 2 ? pulse * (0.4 + 0.6 * Math.abs(Math.sin(clock.elapsedTime * 12))) : pulse;
  }

  const portrait = camera.aspect < 1;
  const camBack = portrait ? 10 : 11.5;
  const camTarget = new THREE.Vector3(
    player.x - fwdX(player.a) * camBack, portrait ? 15 : 9.0, player.z - fwdZ(player.a) * camBack);
  camera.position.lerp(camTarget, 1 - Math.exp(-4 * dt));
  shake = Math.max(0, shake - dt * 1.2);
  if (shake > 0) {
    camera.position.x += (Math.random() - 0.5) * shake;
    camera.position.y += (Math.random() - 0.5) * shake * 0.6;
    camera.position.z += (Math.random() - 0.5) * shake;
  }
  const ahead = portrait ? 7 : 6;
  camera.lookAt(player.x + fwdX(player.a) * ahead, 1.0, player.z + fwdZ(player.a) * ahead);

  renderer.render(scene, camera);
}
tick();
window.__gameLoaded = true;
