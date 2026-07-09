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
    quickPlay: '⚡ HIZLI OYNA', quickPlaySub: 'Tek tıkla bota karşı 1v1 — bekleme yok!',
    againBtn: '↻ TEKRAR OYNA', rewardedBtn: '📺 Reklam izle → x2 ödül', rewardedGot: '🎉 x2 ödül alındı!', adLoading: '📺 Yükleniyor...',
    questsBtn: '🎯 GÖREVLER', questsTitle: 'GÜNLÜK GÖREVLER', questsSub: 'Her gece yenilenir',
    lbBtn: '🏆 LİDER', lbTitle: 'LİDER TABLOSU', lbDaily: 'BUGÜN', lbWeekly: 'BU HAFTA', lbEmpty: 'Henüz skor yok — ilk sen ol!', lbLoad: 'Yükleniyor...', lbScore: 'Dalga',
    seasonBtn: '🎟️ SEZON', seasonWord: 'Sezon', seasonTier: 'Kademe', seasonTierUp: (n, r) => `🎟️ Sezon ${n}. kademe: ${r}`,
    chestMsg: '📦 Günlük sandık açıldı! +🪙120 +🎰2', streakLabel: n => `🔥 ${n} günlük seri`, chestReady: '📦 Tüm görevleri bitir → günlük sandık', chestDone: '📦 Günlük sandık alındı ✓',
    tmTitle: '🎰 Jeton Makinesi', tmCount: 'Jetonların', tmSpin: '🎲 ÇEVİR · 1 🎰', tmNeed: 'Jeton kazanmak için görev tamamla / seviye atla',
    buildTitle: 'YÜKSELTME SEÇ',
    gachaNew: s => `🎁 YENİ KAPLAMA! ${s}`, gachaDup: (s, c) => `🔁 ${s} zaten var → +🪙${c}`, tokenGot: n => `🎰 +${n} jeton!`,
    ftueGift: s => `🎁 İlk düşmanını yok ettin! "${s}" kaplaması hediye!`,
    ftueHintDesk: 'W/↑ ilerle · S/↓ geri · A/D dön · BOŞLUK ateş 🔫',
    ftueHintTouch: 'Sol joystick: sür & dön · Sağ buton: ateş 🔫',
    ftueWelcome: 'Hoş geldin! Sür ve ateş et 🔫',
    single: 'TEK OYUNCU', duel: 'ARKADAŞLA DÜELLO', garage: 'GARAJ', back: '‹ GERİ',
    create: 'ODA KUR', join: 'KATIL', codePh: 'KOD',
    shareBtn: '🔗 DAVET LİNKİ', linkCopied: '🔗 Davet linki kopyalandı!', shareText: 'Tank Savaşı 3D — bana katıl!',
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
    accTab: 'AKSESUAR', accEquip: 'TAK', accRemove: '✓ ÇIKAR', accNone: 'Aksesuar yok',
    noMoney: 'Yetersiz 🪙!', sHealth: 'Can', sSpeed: 'Hız', sFire: 'Ateş',
    reward: '🪙', bestWave: w => `En iyi: Dalga ${w}`, maxLevel: 'MAKS',
    ballBtn: '1v1 TOP MAÇI', ballSub: t => `Topu ateşle karşı base'e sok! İlk ${t} gol kazanır.`,
    golYou: 'GOL! 🎉', golOpp: 'Gol yediniz!', ballScore: 'GOL',
    rematchBtn: 'TEKRAR OYNA', leaveBtn: 'ÇIKIŞ',
    rematchWait: 'Rakip bekleniyor...', rematchPeerReady: 'Rakip tekrar oynamak istiyor!',
    puSpeed: 'HIZ! ⚡', puTriple: "3'LÜ ATIŞ!", puShield: 'KALKAN! 🛡',
    setTitle: 'AYARLAR', setSound: 'Ses', setMusic: 'Müzik', setQuality: 'Kalite', onW: 'AÇIK', offW: 'KAPALI',
    qHigh: 'YÜKSEK', qLow: 'DÜŞÜK', resumeW: 'DEVAM ET', toMenuW: 'ANA MENÜ', closeW: 'KAPAT', pausedW: 'DURAKLADI',
    autoLow: '⚙️ Akıcılık için kalite otomatik düşürüldü',
    coopBtn: 'KOOPERATİF', coopSub: '2-4 kişi birlikte dalgalara karşı! Oda kur veya kod ile katıl.',
    startW: 'BAŞLAT', playersW: 'oyuncu', waitHost: 'Host başlatmasını bekle...',
    teamBtn: '2v2 TAKIM', teamSub: '2v2 takım savaşı — tam 4 oyuncu! Oda kur (3 kişi daha) ya da kod ile katıl.',
    teamStart: 'TAKIM SAVAŞI!', teamSubB: k => `İlk ${k} vuruşa ulaşan takım kazanır — tek atış öldürür!`,
    teamNeed: '4 oyuncu gerekli', teamRed: 'KIRMIZI', teamBlue: 'MAVİ',
    teamWin: 'TAKIMIN KAZANDI! 🏆', teamLose: 'TAKIMIN KAYBETTİ', teamMate: 'Takım arkadaşın', teamFell: 'düştü',
    bossW: 'BOSS DALGASI! ☠️', bossLbl: 'BOSS',
    tabTanks: 'TANKLAR', tabSkins: 'KAPLAMALAR', profileTitle: 'PROFİL & BAŞARIMLAR', dailyW: 'Günlük Ödül · Gün',
  },
  en: {
    title: 'TANK BATTLE 3D',
    sub: 'Destroy the enemy tanks hiding behind the walls!',
    keysDesk: 'W / ↑ &nbsp;→&nbsp; forward &nbsp;|&nbsp; S / ↓ &nbsp;→&nbsp; back &nbsp;|&nbsp; A / D &nbsp;→&nbsp; turn &nbsp;|&nbsp; SPACE &nbsp;→&nbsp; fire',
    keysTouch: 'Left joystick &nbsp;→&nbsp; drive & turn &nbsp;|&nbsp; Right button &nbsp;→&nbsp; fire',
    quickPlay: '⚡ QUICK PLAY', quickPlaySub: 'One tap 1v1 vs a bot — no waiting!',
    againBtn: '↻ PLAY AGAIN', rewardedBtn: '📺 Watch ad → 2x reward', rewardedGot: '🎉 2x reward claimed!', adLoading: '📺 Loading...',
    questsBtn: '🎯 QUESTS', questsTitle: 'DAILY QUESTS', questsSub: 'Refreshes every night',
    lbBtn: '🏆 RANKS', lbTitle: 'LEADERBOARD', lbDaily: 'TODAY', lbWeekly: 'THIS WEEK', lbEmpty: 'No scores yet — be the first!', lbLoad: 'Loading...', lbScore: 'Wave',
    seasonBtn: '🎟️ SEASON', seasonWord: 'Season', seasonTier: 'Tier', seasonTierUp: (n, r) => `🎟️ Season tier ${n}: ${r}`,
    chestMsg: '📦 Daily chest opened! +🪙120 +🎰2', streakLabel: n => `🔥 ${n}-day streak`, chestReady: '📦 Finish all quests → daily chest', chestDone: '📦 Daily chest claimed ✓',
    tmTitle: '🎰 Token Machine', tmCount: 'Your tokens', tmSpin: '🎲 SPIN · 1 🎰', tmNeed: 'Complete quests / level up to earn tokens',
    buildTitle: 'CHOOSE UPGRADE',
    gachaNew: s => `🎁 NEW SKIN! ${s}`, gachaDup: (s, c) => `🔁 ${s} already owned → +🪙${c}`, tokenGot: n => `🎰 +${n} tokens!`,
    ftueGift: s => `🎁 First enemy down! "${s}" skin unlocked!`,
    ftueHintDesk: 'W/↑ move · S/↓ back · A/D turn · SPACE fire 🔫',
    ftueHintTouch: 'Left stick: drive & turn · Right button: fire 🔫',
    ftueWelcome: 'Welcome! Drive and shoot 🔫',
    single: 'SINGLE PLAYER', duel: 'DUEL WITH A FRIEND', garage: 'GARAGE', back: '‹ BACK',
    create: 'CREATE ROOM', join: 'JOIN', codePh: 'CODE',
    shareBtn: '🔗 INVITE LINK', linkCopied: '🔗 Invite link copied!', shareText: 'Tank Battle 3D — join me!',
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
    accTab: 'ACCESSORY', accEquip: 'EQUIP', accRemove: '✓ REMOVE', accNone: 'No accessory',
    noMoney: 'Not enough 🪙!', sHealth: 'HP', sSpeed: 'Speed', sFire: 'Fire',
    reward: '🪙', bestWave: w => `Best: Wave ${w}`, maxLevel: 'MAX',
    ballBtn: '1v1 BALL MATCH', ballSub: t => `Shoot the ball into the rival base! First to ${t} goals wins.`,
    golYou: 'GOAL! 🎉', golOpp: 'They scored!', ballScore: 'GOAL',
    rematchBtn: 'PLAY AGAIN', leaveBtn: 'LEAVE',
    rematchWait: 'Waiting for opponent...', rematchPeerReady: 'Opponent wants a rematch!',
    puSpeed: 'SPEED! ⚡', puTriple: 'TRIPLE SHOT!', puShield: 'SHIELD! 🛡',
    setTitle: 'SETTINGS', setSound: 'Sound', setMusic: 'Music', setQuality: 'Quality', onW: 'ON', offW: 'OFF',
    qHigh: 'HIGH', qLow: 'LOW', resumeW: 'RESUME', toMenuW: 'MAIN MENU', closeW: 'CLOSE', pausedW: 'PAUSED',
    autoLow: '⚙️ Quality auto-lowered for smoother play',
    coopBtn: 'CO-OP', coopSub: '2-4 players together vs waves! Create a room or join with a code.',
    startW: 'START', playersW: 'players', waitHost: 'Waiting for host to start...',
    teamBtn: '2v2 TEAM', teamSub: '2v2 team battle — exactly 4 players! Create a room (3 more) or join with a code.',
    teamStart: 'TEAM BATTLE!', teamSubB: k => `First team to ${k} kills wins — one hit destroys!`,
    teamNeed: '4 players required', teamRed: 'RED', teamBlue: 'BLUE',
    teamWin: 'YOUR TEAM WINS! 🏆', teamLose: 'YOUR TEAM LOST', teamMate: 'Your teammate', teamFell: 'fell',
    bossW: 'BOSS WAVE! ☠️', bossLbl: 'BOSS',
    tabTanks: 'TANKS', tabSkins: 'SKINS', profileTitle: 'PROFILE & ACHIEVEMENTS', dailyW: 'Daily Reward · Day',
  },
};
let lang = localStorage.getItem('tanklang') || ((navigator.language || 'tr').startsWith('tr') ? 'tr' : 'en');
const T = () => L[lang];

// ---------------------------------------------------------------- kalıcı profil
const DEFAULT_PROFILE = { coins: 0, owned: ['recruit'], selected: 'recruit', bestWave: 1, upgrades: {}, kills: 0, wins: 0, games: 0, skins: ['default'], skin: 'default', achieved: [], lastDaily: '', streak: 0, name: '', gift1: false, level: 1, xp: 0, tokens: 0, gems: 0, accessories: [], accessory: '' };
let profile;
try {
  profile = Object.assign({}, DEFAULT_PROFILE, JSON.parse(localStorage.getItem('tankprofile') || '{}'));
  if (!Array.isArray(profile.owned) || !profile.owned.length) profile.owned = ['recruit'];
  if (!profile.upgrades || typeof profile.upgrades !== 'object') profile.upgrades = {};
  profile.kills = profile.kills || 0; profile.wins = profile.wins || 0; profile.games = profile.games || 0;
  if (!Array.isArray(profile.skins) || !profile.skins.length) profile.skins = ['default'];
  if (!profile.skin) profile.skin = 'default';
  if (!Array.isArray(profile.achieved)) profile.achieved = [];
  profile.streak = profile.streak || 0;
  if (typeof profile.lastDaily !== 'string') profile.lastDaily = '';
  if (!profile.name) profile.name = 'Oyuncu' + Math.floor(Math.random() * 900 + 100);
} catch { profile = Object.assign({}, DEFAULT_PROFILE); }
function saveProfile() { localStorage.setItem('tankprofile', JSON.stringify(profile)); }
function addCoins(n) { profile.coins += n; saveProfile(); updateCoinBar(); }
function addGems(n) { profile.gems = (profile.gems || 0) + n; saveProfile(); updateGemBar(); }

// ayarlar (ses / kalite)
let settings;
try { settings = Object.assign({ muted: false, quality: 'high', music: true }, JSON.parse(localStorage.getItem('tanksettings') || '{}')); }
catch { settings = { muted: false, quality: 'high', music: true }; }
if (typeof settings.music !== 'boolean') settings.music = true;
function saveSettings() { localStorage.setItem('tanksettings', JSON.stringify(settings)); }

// ---------------------------------------------------------------- sunucu adresi (web vs native app)
// Capacitor (App Store/Play) paketinde sayfa localhost'tan servis edilir → çok-oyunculu + analitik
// canlı Render sunucusuna gitmeli. Web'de (Render/dev) göreli/location.host kullanılır.
const REMOTE_HOST = 'tank-savasi-3d.onrender.com';
function isNativeApp() { return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()); }
function apiBase() { return isNativeApp() ? 'https://' + REMOTE_HOST : ''; }
function wsBase() { return isNativeApp() ? 'wss://' + REMOTE_HOST : (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host; }
function capPlugins() { return (window.Capacitor && window.Capacitor.Plugins) || {}; }
function haptic(style) { try { const H = capPlugins().Haptics; if (isNativeApp() && H) H.impact({ style: style || 'MEDIUM' }); } catch {} }
function nativeInit() {
  if (!isNativeApp()) return;
  const P = capPlugins();
  try { P.SplashScreen && P.SplashScreen.hide(); } catch {}
  try { P.StatusBar && P.StatusBar.hide(); } catch {}          // tam ekran
  try {
    P.App && P.App.addListener('backButton', () => {           // Android geri tuşu → menüye dön (uygulamadan çıkma)
      if (state !== 'menu') { closeNet(); clearBallMode(); clearCoop(); clearTeam(); buildArena(0); openMenu(); }
      else if (P.App.minimizeApp) P.App.minimizeApp();
    });
  } catch {}
}

// ---------------------------------------------------------------- PlatformAdapter (GDD kuralı: oyun kodu platform API'sini
// DOĞRUDAN çağırmaz; yalnızca bu soyut arayüzü kullanır. Web'de stub, native'de AdMob/StoreKit'e bağlanır — hesap sonrası).
const Platform = {
  // ödüllü reklam izlet → Promise<bool> (izlendi=ödül ver). Web/dev: reklam yok, kısa gecikmeyle true.
  rewarded(placement) {
    return new Promise(resolve => {
      const P = capPlugins();
      if (isNativeApp() && P.AdMob) {
        // TODO(native): AdMob rewarded göster; kullanıcı tamamlarsa resolve(true), atlarsa resolve(false).
        // SDK/hesap gelene kadar stub:
        resolve(true);
      } else {
        setTimeout(() => resolve(true), 400); // web: simüle
      }
    });
  },
  // maç aralarında interstitial (asla maç İÇİNDE değil). Web: no-op. Native: AdMob interstitial (TODO).
  interstitial() { /* native TODO: AdMob interstitial */ },
  // IAP satın alma → Promise<bool>. Native: StoreKit/Play Billing (TODO). Web: yok.
  purchase(sku) { return Promise.resolve(false); },
};
// ödüllü reklam sıklık sınırı (GDD: saatte ≤4, FTUE'nin ilk 3 maçında hiç)
let rewardedTimes = [];
function canOfferRewarded() {
  if ((profile.games || 0) <= 3) return false;
  const now = Date.now();
  rewardedTimes = rewardedTimes.filter(t => now - t < 3600000);
  return rewardedTimes.length < 4;
}
// maç aralarında interstitial (FTUE'den sonra, 3 maçta 1'den seyrek). Web'de no-op.
let interstitialCount = 0;
function maybeInterstitial() {
  if ((profile.games || 0) <= 3) return;
  if (++interstitialCount % 3 === 0) Platform.interstitial();
}

// ---------------------------------------------------------------- analitik (anonim huni ölçümü)
const SESSION_ID = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
function track(ev, data) {
  try {
    const payload = JSON.stringify(Object.assign({ ev, sid: SESSION_ID, t: Date.now() }, data || {}));
    const url = apiBase() + '/ev';
    if (navigator.sendBeacon) navigator.sendBeacon(url, payload);
    else fetch(url, { method: 'POST', body: payload, keepalive: true }).catch(() => {});
  } catch {}
}
// lider tablosu: kalıcı istemci kimliği (aynı oyuncunun günlük en iyisi tekilleşsin)
const CLIENT_ID = (() => { let c = localStorage.getItem('tankcid'); if (!c) { c = Math.random().toString(36).slice(2, 12); localStorage.setItem('tankcid', c); } return c; })();
function submitScore(score) {
  if (!score || score < 1) return;
  try {
    const payload = JSON.stringify({ cid: CLIENT_ID, name: profile.name || 'Oyuncu', score: score | 0 });
    const url = apiBase() + '/lb';
    if (navigator.sendBeacon) navigator.sendBeacon(url, payload);
    else fetch(url, { method: 'POST', body: payload, keepalive: true }).catch(() => {});
  } catch {}
}
async function fetchLeaderboard(period) {
  try { const r = await fetch(apiBase() + '/lb?p=' + period, { cache: 'no-store' }); return await r.json(); }
  catch { return []; }
}
let paused = false;

// ---------------------------------------------------------------- tanklar
const TANKS = [
  { id: 'recruit',  name: { tr: 'Acemi',      en: 'Recruit'  }, price: 0,    color: 0x4a5d26, scale: 1.00, health: 5, speed: 8.0,  turn: 2.6, cool: 0.45, bspeed: 24 },
  { id: 'scout',    name: { tr: 'Kaşif',      en: 'Scout'    }, price: 150,  color: 0x2f7db0, scale: 0.90, health: 4, speed: 10.6, turn: 3.3, cool: 0.40, bspeed: 28 },
  { id: 'guardian', name: { tr: 'Muhafız',    en: 'Guardian' }, price: 300,  color: 0x707070, scale: 1.15, health: 8, speed: 6.4,  turn: 2.0, cool: 0.50, bspeed: 22 },
  { id: 'sniper',   name: { tr: 'Nişancı',    en: 'Sniper'   }, price: 500,  color: 0x7a3aa0, scale: 1.00, health: 5, speed: 8.6,  turn: 2.8, cool: 0.30, bspeed: 42 },
  { id: 'phantom',  name: { tr: 'Hayalet',    en: 'Phantom'  }, price: 800,  color: 0x1aa37a, scale: 1.00, health: 6, speed: 9.6,  turn: 3.0, cool: 0.33, bspeed: 32, glow: true },
  { id: 'goldking', name: { tr: 'Altın Kral', en: 'Gold King'}, price: 1500, color: 0xffcc33, scale: 1.08, health: 9, speed: 9.2,  turn: 2.9, cool: 0.30, bspeed: 36, glow: true, metal: true },
  { id: 'heavy',    name: { tr: 'Ağır Tank',   en: 'Heavy Tank'}, price: 2500, color: 0x6b6f4a, scale: 0.95, health: 12, speed: 5.6, turn: 1.8, cool: 0.50, bspeed: 30, model: 'heavy', metal: true, turretTop: 1.8 },
  { id: 'twin',     name: { tr: 'İkiz Namlu',  en: 'Twin Cannon'}, price: 3000, color: 0x556047, scale: 0.95, health: 7,  speed: 8.4, turn: 2.8, cool: 0.26, bspeed: 30, model: 'twin', turretTop: 1.62 },
  { id: 'arty',     name: { tr: 'Obüs',        en: 'Howitzer'  }, price: 3500, color: 0x6a6248, scale: 0.95, health: 6,  speed: 5.4, turn: 1.7, cool: 0.60, bspeed: 46, model: 'arty', turretTop: 1.55 },
  { id: 'hover',    name: { tr: 'Hover Tank',  en: 'Hover Tank'}, gem: 40, color: 0x3a4450, scale: 1.00, health: 5, speed: 12.0, turn: 3.5, cool: 0.34, bspeed: 34, model: 'hover', metal: true, glow: true, turretTop: 1.5 },
  { id: 'titan',    name: { tr: 'Titan',       en: 'Titan'     }, gem: 60, color: 0x40444a, scale: 1.05, health: 14, speed: 5.2, turn: 1.6, cool: 0.44, bspeed: 32, model: 'titan', metal: true, glow: true, turretTop: 2.05 },
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
// kozmetik kaplamalar (oyuncunun kendi tankına uygulanır)
// r: nadirlik (c=yaygın, r=nadir, e=efsanevi) — jeton makinesi ağırlığı + fiyat için
const SKINS = [
  { id: 'default', name: { tr: 'Varsayılan', en: 'Default' }, price: 0 },
  // yaygın (renk varyasyonları)
  { id: 'camo', name: { tr: 'Kamuflaj', en: 'Camo' }, price: 150, color: 0x4b5320, rough: 0.9, r: 'c' },
  { id: 'crimson', name: { tr: 'Kızıl', en: 'Crimson' }, price: 150, color: 0xb01818, r: 'c' },
  { id: 'ocean', name: { tr: 'Okyanus', en: 'Ocean' }, price: 150, color: 0x1b6fa8, r: 'c' },
  { id: 'forest', name: { tr: 'Orman', en: 'Forest' }, price: 150, color: 0x2f5d34, r: 'c' },
  { id: 'sand', name: { tr: 'Kum', en: 'Sand' }, price: 150, color: 0xc2a76a, r: 'c' },
  { id: 'navy', name: { tr: 'Lacivert', en: 'Navy' }, price: 150, color: 0x24304f, r: 'c' },
  { id: 'plum', name: { tr: 'Erik', en: 'Plum' }, price: 150, color: 0x6a2d5a, r: 'c' },
  { id: 'rose', name: { tr: 'Gül', en: 'Rose' }, price: 150, color: 0xd85a7a, r: 'c' },
  { id: 'teal', name: { tr: 'Ördek Başı', en: 'Teal' }, price: 150, color: 0x1f8a7a, r: 'c' },
  { id: 'orange', name: { tr: 'Turuncu', en: 'Orange' }, price: 150, color: 0xe07a1e, r: 'c' },
  { id: 'slate', name: { tr: 'Arduvaz', en: 'Slate' }, price: 150, color: 0x556070, rough: 0.7, r: 'c' },
  { id: 'wine', name: { tr: 'Şarap', en: 'Wine' }, price: 150, color: 0x7a1f2b, r: 'c' },
  { id: 'olive', name: { tr: 'Zeytin', en: 'Olive' }, price: 150, color: 0x7a7a2a, r: 'c' },
  // nadir (metal)
  { id: 'gold', name: { tr: 'Altın', en: 'Gold' }, price: 400, color: 0xffcc33, metal: 0.85, rough: 0.25, r: 'r' },
  { id: 'chrome', name: { tr: 'Krom', en: 'Chrome' }, price: 400, color: 0xcfd6e0, metal: 0.95, rough: 0.12, r: 'r' },
  { id: 'bronze', name: { tr: 'Bronz', en: 'Bronze' }, price: 400, color: 0xa9702e, metal: 0.8, rough: 0.3, r: 'r' },
  { id: 'copper', name: { tr: 'Bakır', en: 'Copper' }, price: 400, color: 0xc0642a, metal: 0.85, rough: 0.28, r: 'r' },
  { id: 'gunmetal', name: { tr: 'Silah Çeliği', en: 'Gunmetal' }, price: 400, color: 0x3a4048, metal: 0.9, rough: 0.35, r: 'r' },
  { id: 'silver', name: { tr: 'Gümüş', en: 'Silver' }, price: 400, color: 0xb8c0c8, metal: 0.9, rough: 0.2, r: 'r' },
  { id: 'rosegold', name: { tr: 'Roz Altın', en: 'Rose Gold' }, price: 400, color: 0xe6a58a, metal: 0.85, rough: 0.24, r: 'r' },
  { id: 'obsidian', name: { tr: 'Obsidyen', en: 'Obsidian' }, price: 400, color: 0x1a1a22, metal: 0.7, rough: 0.15, r: 'r' },
  // efsanevi (parlayan)
  { id: 'neon', name: { tr: 'Neon', en: 'Neon' }, price: 700, color: 0x18e0ff, glow: 0.6, r: 'e' },
  { id: 'inferno', name: { tr: 'Ateş', en: 'Inferno' }, price: 700, color: 0xff5a1e, glow: 0.6, r: 'e' },
  { id: 'phantom', name: { tr: 'Hayalet', en: 'Phantom' }, price: 700, color: 0xa040ff, glow: 0.5, metal: 0.4, r: 'e' },
  { id: 'toxic', name: { tr: 'Zehir', en: 'Toxic' }, price: 700, color: 0x8aff2a, glow: 0.5, r: 'e' },
  { id: 'frost', name: { tr: 'Ayaz', en: 'Frost' }, price: 700, color: 0x7fe8ff, glow: 0.55, r: 'e' },
  { id: 'void', name: { tr: 'Boşluk', en: 'Void' }, price: 700, color: 0x7a2dff, glow: 0.5, metal: 0.5, r: 'e' },
  { id: 'plasma', name: { tr: 'Plazma', en: 'Plasma' }, price: 700, color: 0xff3aa0, glow: 0.6, r: 'e' },
  { id: 'ember', name: { tr: 'Kor', en: 'Ember' }, price: 700, color: 0xffb02a, glow: 0.6, r: 'e' },
  { id: 'venom', name: { tr: 'Panzehir', en: 'Venom' }, price: 700, color: 0x2affa0, glow: 0.55, r: 'e' },
  { id: 'royal', name: { tr: 'Kraliyet', en: 'Royal' }, price: 900, color: 0x3a4dff, glow: 0.5, metal: 0.6, r: 'e' },
];
const skinById = id => SKINS.find(s => s.id === id) || SKINS[0];
const RARITY = { c: { w: 100, coin: 40, tr: 'Yaygın', en: 'Common', col: '#c8d0d8' }, r: { w: 34, coin: 120, tr: 'Nadir', en: 'Rare', col: '#5ad0ff' }, e: { w: 10, coin: 260, tr: 'Efsanevi', en: 'Epic', col: '#ffcc33' } };
// başarımlar (koşul sağlanınca coin ödülü)
const ACHIEVEMENTS = [
  { id: 'kill50', name: { tr: 'Acemi Avcı', en: 'Rookie' }, desc: { tr: '50 düşman yok et', en: 'Destroy 50 enemies' }, stat: 'kills', goal: 50, reward: 100 },
  { id: 'kill250', name: { tr: 'Usta Avcı', en: 'Veteran' }, desc: { tr: '250 düşman yok et', en: 'Destroy 250 enemies' }, stat: 'kills', goal: 250, reward: 300 },
  { id: 'kill1000', name: { tr: 'Efsane', en: 'Legend' }, desc: { tr: '1000 düşman yok et', en: 'Destroy 1000 enemies' }, stat: 'kills', goal: 1000, reward: 800 },
  { id: 'wave5', name: { tr: 'Dayanıklı', en: 'Survivor' }, desc: { tr: 'Dalga 5\'e ulaş', en: 'Reach wave 5' }, stat: 'bestWave', goal: 5, reward: 150 },
  { id: 'wave10', name: { tr: 'Kale', en: 'Fortress' }, desc: { tr: 'Dalga 10\'a ulaş', en: 'Reach wave 10' }, stat: 'bestWave', goal: 10, reward: 400 },
  { id: 'wave15', name: { tr: 'Aşılmaz', en: 'Unstoppable' }, desc: { tr: 'Dalga 15\'e ulaş', en: 'Reach wave 15' }, stat: 'bestWave', goal: 15, reward: 700 },
  { id: 'win3', name: { tr: 'Rakip', en: 'Challenger' }, desc: { tr: '3 maç kazan', en: 'Win 3 matches' }, stat: 'wins', goal: 3, reward: 200 },
  { id: 'win15', name: { tr: 'Şampiyon', en: 'Champion' }, desc: { tr: '15 maç kazan', en: 'Win 15 matches' }, stat: 'wins', goal: 15, reward: 600 },
  { id: 'games25', name: { tr: 'Bağımlı', en: 'Hooked' }, desc: { tr: '25 maç oyna', en: 'Play 25 matches' }, stat: 'games', goal: 25, reward: 300 },
];
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
// Düşük preset: yarı-çözünürlük render + upscale + gölgesiz (zayıf cihazlarda akıcılık)
const LOW_PR = 0.7;
renderer.shadowMap.enabled = settings.quality !== 'low';
renderer.setPixelRatio(settings.quality === 'low' ? LOW_PR : Math.min(devicePixelRatio, IS_TOUCH ? 1.7 : 2));
function applyQuality() {
  const low = settings.quality === 'low';
  renderer.setPixelRatio(low ? LOW_PR : Math.min(devicePixelRatio, IS_TOUCH ? 1.7 : 2));
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

// ---------------------------------------------------------------- tank modelleri (tembel-yükleme)
// farklı GLB gövde modelleri; ilk pakete girmez, seçilince/önizlenince yüklenir (performans bütçesi)
const MODEL_PATHS = { heavy: 'assets/tank_heavy.glb', hover: 'assets/tank_hover.glb', twin: 'assets/tank_twin.glb', arty: 'assets/tank_arty.glb', titan: 'assets/tank_titan.glb' };
const loadedModels = {}; // modelId -> gltf.scene
const _modelLoader = new GLTFLoader();
async function ensureModel(modelId) {
  if (!modelId || loadedModels[modelId] || !MODEL_PATHS[modelId]) return;
  try { const g = await _modelLoader.loadAsync(MODEL_PATHS[modelId]); loadedModels[modelId] = g.scene; }
  catch (e) { console.warn('tank modeli yüklenemedi:', modelId, e); }
}

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
const playerTailMat = new THREE.MeshBasicMaterial({ color: 0xffe08a, transparent: true, opacity: 0.32, depthWrite: false });
const enemyTailMat = new THREE.MeshBasicMaterial({ color: 0xff7a5a, transparent: true, opacity: 0.32, depthWrite: false });
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
  playerTailMat.color.setHex(th.bullet[0]); enemyTailMat.color.setHex(th.bullet[1]);
  buildDecor(th.decor);
  return th.wall;
}

// ---------------------------------------------------------------- arena (harita) kurulumu
const walls = [];
let openCells = [];
let wallInst = null;
const wallGeo = new THREE.BoxGeometry(CELL, WALL_H, CELL);

// ---------------------------------------------------------------- yıkılabilir siper + tema tehlikeleri
// deterministik yerleşim: tüm kooperatif istemcileri (ve tekrar oynanışlar) aynı düzeni kursun
function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// varil (patlayan siper) görselleri
const barrelGeo = new THREE.CylinderGeometry(0.82, 0.9, 2.0, 14);
const barrelBandGeo = new THREE.TorusGeometry(0.9, 0.075, 8, 18);
const barrelMat = new THREE.MeshStandardMaterial({ color: 0xc2401e, roughness: 0.42, metalness: 0.45, emissive: 0x3a0d00, emissiveIntensity: 0.4 });
const barrelBandMat = new THREE.MeshStandardMaterial({ color: 0x2c2c2c, roughness: 0.55, metalness: 0.55 });
const barrelCapMat = new THREE.MeshStandardMaterial({ color: 0xffcf3a, roughness: 0.5, metalness: 0.3, emissive: 0x3a2a00, emissiveIntensity: 0.4 });
// tehlike zemin görselleri
const hazDiscGeo = new THREE.CircleGeometry(1, 30);
const teleRingGeo = new THREE.TorusGeometry(1.0, 0.13, 10, 26);
const lavaHazMat = () => new THREE.MeshBasicMaterial({ color: 0xff6a1e, transparent: true, opacity: 0.92, toneMapped: false, fog: false });
const iceHazMat = new THREE.MeshStandardMaterial({ color: 0xcdeeff, transparent: true, opacity: 0.6, roughness: 0.04, metalness: 0.1, emissive: 0x2a6a92, emissiveIntensity: 0.5 });
const teleHazMat = () => new THREE.MeshBasicMaterial({ color: 0xb46aff, toneMapped: false, fog: false });

const covers = [];   // {mesh, x, z, r, hp, id}
const hazards = [];  // {type, x, z, r, mesh, ...}
function clearCovers() { for (const c of covers) scene.remove(c.mesh); covers.length = 0; }
function clearHazards() { for (const h of hazards) if (h.mesh) scene.remove(h.mesh); hazards.length = 0; }

// tehlike sayıları (tema başına)
const HAZARD_SPEC = {
  default: { barrel: 3 },
  stadium: { barrel: 3 },
  desert: { barrel: 4 },
  snow: { ice: 4, barrel: 2 },
  night: { barrel: 3 },
  lava: { lava: 4, barrel: 2 },
  space: { teleport: 4, barrel: 2 },
};

function addCover(cell, id) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(barrelGeo, barrelMat); body.castShadow = true; g.add(body);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.82, 0.14, 14), barrelCapMat); cap.position.y = 1.02; g.add(cap);
  const b1 = new THREE.Mesh(barrelBandGeo, barrelBandMat); b1.rotation.x = Math.PI / 2; b1.position.y = 0.55; g.add(b1);
  const b2 = new THREE.Mesh(barrelBandGeo, barrelBandMat); b2.rotation.x = Math.PI / 2; b2.position.y = -0.55; g.add(b2);
  g.position.set(cell.x, 1.0, cell.z);
  scene.add(g);
  covers.push({ mesh: g, x: cell.x, z: cell.z, r: 0.95, hp: 2, id });
}
function addLavaPool(cell) {
  const m = new THREE.Mesh(hazDiscGeo, lavaHazMat()); m.rotation.x = -Math.PI / 2; m.position.set(cell.x, 0.06, cell.z); m.scale.setScalar(1.8);
  scene.add(m);
  const h = { type: 'lava', x: cell.x, z: cell.z, r: 1.9, mesh: m }; hazards.push(h); return h;
}
function addIcePatch(cell) {
  const m = new THREE.Mesh(hazDiscGeo, iceHazMat); m.rotation.x = -Math.PI / 2; m.position.set(cell.x, 0.05, cell.z); m.scale.setScalar(2.0);
  scene.add(m);
  const h = { type: 'ice', x: cell.x, z: cell.z, r: 2.0, mesh: m }; hazards.push(h); return h;
}
function addTeleport(cell) {
  const m = new THREE.Mesh(teleRingGeo, teleHazMat()); m.rotation.x = -Math.PI / 2; m.position.set(cell.x, 0.55, cell.z);
  scene.add(m);
  const h = { type: 'teleport', x: cell.x, z: cell.z, r: 1.1, mesh: m, link: null }; hazards.push(h); return h;
}
function buildEnvironment(mapIdx) {
  clearCovers(); clearHazards();
  const theme = MAPS[mapIdx].theme || 'default';
  const spec = HAZARD_SPEC[theme] || HAZARD_SPEC.default;
  const rng = makeRng((mapIdx + 1) * 0x9e3779b1);
  // kullanılabilir hücreler: kenar ve köşe (doğuş) hücrelerinden uzak
  const pool = openCells.filter(c => c.r > 1 && c.r < ROWS - 2 && c.c > 1 && c.c < COLS - 2);
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); const t = pool[i]; pool[i] = pool[j]; pool[j] = t; }
  let pi = 0;
  const take = () => {
    const c = pool[pi++]; if (!c) return null;
    const oi = openCells.indexOf(c); if (oi >= 0) openCells.splice(oi, 1); // doğuş bu hücrede olmasın
    return c;
  };
  const barrels = (mode === 'solo' || mode === 'coop') ? (spec.barrel || 0) : 0;
  for (let i = 0; i < barrels; i++) { const c = take(); if (c) addCover(c, i); }
  for (let i = 0; i < (spec.lava || 0); i++) { const c = take(); if (c) addLavaPool(c); }
  for (let i = 0; i < (spec.ice || 0); i++) { const c = take(); if (c) addIcePatch(c); }
  const pads = [];
  for (let i = 0; i < (spec.teleport || 0); i++) { const c = take(); if (c) pads.push(addTeleport(c)); }
  for (let i = 0; i + 1 < pads.length; i += 2) { pads[i].link = pads[i + 1]; pads[i + 1].link = pads[i]; }
}
// varil hasarı / yıkımı
function damageCover(cv) { cv.hp--; if (cv.hp <= 0) destroyCover(cv); }
function destroyCover(cv, fromNet) {
  const i = covers.indexOf(cv); if (i < 0) return;
  covers.splice(i, 1); scene.remove(cv.mesh);
  explode(cv.x, 1.0, cv.z, true);
  const R = 4.2;
  if (mode === 'solo' || (mode === 'coop' && isAuthority)) {
    for (const e of enemies) if (e.alive && Math.hypot(e.x - cv.x, e.z - cv.z) < R) damageEnemy(e, 2);
  }
  barrelHurtLocalPlayer(cv, R);
  if (mode === 'coop' && isAuthority && !fromNet) netSend({ t: 'barrel', id: cv.id });
}
function damageEnemy(e, dmg) {
  e.hp -= dmg;
  if (e.hp <= 0) {
    e.alive = false; explode(e.x, 1.0, e.z, true); scene.remove(e.mesh);
    popFloater(e.x, 2.2, e.z, '+' + e.score, e.type === 'boss' ? '#ff7a3a' : '#ffe86a');
    if (mode === 'coop') netSend({ t: 'ekill', id: e.id });
    score += e.score; roundCoins += e.coins; profile.kills++; addCoins(e.coins); updateHUD();
  } else { e.hitT = 0.14; }
}
function barrelHurtLocalPlayer(cv, R) {
  if (!player.alive || player.inv > 0) return;
  if (Math.hypot(player.x - cv.x, player.z - cv.z) > R) return;
  if (player.shieldT > 0) { player.inv = 0.3; return; }
  if (mode === 'coop') { coopHitPlayer(coop.you); return; }
  if (mode !== 'solo') return;
  player.inv = 1.0; player.health--; renderHealth(); hitFlash();
  if (player.health <= 0) { player.alive = false; player.mesh.visible = false; explode(player.x, 1.2, player.z, true); setTimeout(gameOver, 1600); }
}
// tehlike güncellemesi (yerel oyuncuya etkir)
let lavaBurnT = 0.35, teleCool = 0;
function hazardAt(x, z, type) {
  for (const h of hazards) if (h.type === type && Math.hypot(x - h.x, z - h.z) < h.r) return h;
  return null;
}
function updateHazards(dt) {
  if (!hazards.length) return;
  const pulse = 0.5 + 0.5 * Math.sin(clock.elapsedTime * 4);
  for (const h of hazards) {
    if (h.type === 'lava') h.mesh.material.color.setRGB(1, 0.32 + 0.26 * pulse, 0.05);
    else if (h.type === 'teleport') { h.mesh.rotation.z += dt * 2.4; h.mesh.material.color.setRGB(0.62 + 0.18 * pulse, 0.34, 1); }
  }
  if (teleCool > 0) teleCool -= dt;
  if (!player.alive) return;
  // lav yanığı
  let onLava = false;
  for (const h of hazards) if (h.type === 'lava' && Math.hypot(player.x - h.x, player.z - h.z) < h.r) { onLava = true; break; }
  if (onLava) {
    emberT -= dt; if (emberT <= 0) { emberT = 0.09; spawnPuff(player.x + (Math.random() - 0.5), 0.6, player.z + (Math.random() - 0.5), 0xff6a1e, 0.7, 1.4, 0.5); }
    lavaBurnT -= dt; if (lavaBurnT <= 0) { lavaBurnT = 1.0; lavaDamagePlayer(); }
  } else lavaBurnT = 0.35;
  // ışınlanma
  if (teleCool <= 0) for (const h of hazards) if (h.type === 'teleport' && h.link && Math.hypot(player.x - h.x, player.z - h.z) < h.r) { doTeleport(h); break; }
}
let emberT = 0;
function lavaDamagePlayer() {
  if (player.inv > 0 || player.shieldT > 0) return;
  if (mode === 'coop') { coopHitPlayer(coop.you); return; }
  player.inv = 0.6; player.health--; renderHealth(); hitFlash();
  if (player.health <= 0) { player.alive = false; player.mesh.visible = false; explode(player.x, 1.2, player.z, true); setTimeout(gameOver, 1600); }
}
function doTeleport(h) {
  teleCool = 1.3;
  explode(player.x, 1.0, player.z, false);
  player.x = h.link.x; player.z = h.link.z;
  player.vx = 0; player.vz = 0;
  explode(player.x, 1.0, player.z, false);
  sfxPower();
}

function buildArena(mapIdx) {
  clearCovers(); clearHazards();
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
  const src = (def.model && loadedModels[def.model]) ? loadedModels[def.model] : tankGltf.scene;
  const g = src.clone(true);
  g.traverse(o => {
    if (o.isMesh) {
      o.castShadow = o.receiveShadow = true;
      if (o.material && o.material.name === 'TankPaint') {
        o.material = o.material.clone();
        o.material.color.set(def.color);
        if (def.metal) o.material.metalness = 0.7;
        if (def.glow) { o.material.emissive.set(def.color); o.material.emissiveIntensity = 0.35; }
      } else if (o.material && (o.material.name === 'EnergyGlow' || o.material.name === 'CoreGlow')) {
        // enerji/çekirdek parçaları: oyunda parlamayı zorla (glTF emissive'e güvenme)
        const col = o.material.name === 'EnergyGlow' ? 0x1ae0ff : 0xff2a1a;
        o.material.color.set(col); o.material.emissive.set(col);
        o.material.emissiveIntensity = 1.0; o.material.toneMapped = false;
      }
    }
  });
  if (def.scale && def.scale !== 1) g.scale.setScalar(def.scale);
  return g;
}

// ---------------------------------------------------------------- aksesuarlar (prosedürel; tanka takılır)
// tank modeli yerel ölçüleri: genişlik x=±1.11, turret tepe ~y1.5 z0.12, arka +z~1.35, ön(namlu) -z
function accMat(color, o) { o = o || {}; return new THREE.MeshStandardMaterial({ color, roughness: o.rough != null ? o.rough : 0.55, metalness: o.metal || 0, emissive: o.glow ? color : 0x000000, emissiveIntensity: o.glow || 0 }); }
function aMesh(geo, mat, x, y, z, o) { const m = new THREE.Mesh(geo, mat); m.position.set(x || 0, y || 0, z || 0); m.castShadow = true; if (o) { if (o.rx) m.rotation.x = o.rx; if (o.ry) m.rotation.y = o.ry; if (o.rz) m.rotation.z = o.rz; if (o.sx || o.sy || o.sz) m.scale.set(o.sx || 1, o.sy || 1, o.sz || 1); } return m; }
function buildSurf() {
  const g = new THREE.Group();
  const board = aMesh(new THREE.SphereGeometry(1, 18, 12), accMat(0xff7a2e, { rough: 0.35 }), 0, 0, 0, { sx: 0.30, sy: 0.10, sz: 1.05 });
  g.add(board);
  g.add(aMesh(new THREE.BoxGeometry(0.05, 0.03, 1.7), accMat(0xfff2e0, { rough: 0.4 }), 0, 0.11, 0));
  g.add(aMesh(new THREE.ConeGeometry(0.12, 0.26, 4), accMat(0x1a2530), 0, -0.16, -0.7, { rx: Math.PI }));
  return g;
}
function buildFlag() {
  const g = new THREE.Group();
  g.add(aMesh(new THREE.CylinderGeometry(0.035, 0.035, 1.35, 8), accMat(0xcfd6dd, { metal: 0.6, rough: 0.4 }), 0, 0.68, 0));
  const cloth = aMesh(new THREE.BoxGeometry(0.62, 0.4, 0.03), accMat(0xe23b3b, { rough: 0.6 }), 0.33, 1.15, 0);
  g.add(cloth);
  g.add(aMesh(new THREE.BoxGeometry(0.62, 0.4, 0.02), accMat(0xffffff, { rough: 0.6 }), 0.33, 1.15, 0.02, { sx: 0.4, sy: 0.4 }));
  return g;
}
function buildCone() {
  const g = new THREE.Group();
  g.add(aMesh(new THREE.ConeGeometry(0.34, 0.72, 20), accMat(0xff3d8b, { rough: 0.5 }), 0, 0.36, 0));
  // çizgiler
  g.add(aMesh(new THREE.TorusGeometry(0.22, 0.03, 8, 20), accMat(0xffe14d, { glow: 0.2 }), 0, 0.26, 0, { rx: Math.PI / 2 }));
  g.add(aMesh(new THREE.SphereGeometry(0.1, 12, 10), accMat(0xffe14d, { glow: 0.25 }), 0, 0.76, 0));
  return g;
}
function buildTophat() {
  const g = new THREE.Group();
  g.add(aMesh(new THREE.CylinderGeometry(0.42, 0.42, 0.06, 20), accMat(0x14161c, { rough: 0.35 }), 0, 0.03, 0)); // kenar
  g.add(aMesh(new THREE.CylinderGeometry(0.28, 0.28, 0.6, 20), accMat(0x14161c, { rough: 0.3 }), 0, 0.33, 0)); // gövde
  g.add(aMesh(new THREE.TorusGeometry(0.285, 0.045, 8, 22), accMat(0xd23b3b, { rough: 0.5 }), 0, 0.16, 0, { rx: Math.PI / 2 })); // bant
  return g;
}
function buildSpoiler() {
  const g = new THREE.Group();
  g.add(aMesh(new THREE.BoxGeometry(1.5, 0.08, 0.34), accMat(0x1b1e24, { rough: 0.3, metal: 0.3 }), 0, 0.5, 0));
  g.add(aMesh(new THREE.BoxGeometry(0.12, 0.5, 0.16), accMat(0x2a2f38, { metal: 0.4 }), -0.5, 0.25, 0));
  g.add(aMesh(new THREE.BoxGeometry(0.12, 0.5, 0.16), accMat(0x2a2f38, { metal: 0.4 }), 0.5, 0.25, 0));
  return g;
}
function buildDuck() {
  const g = new THREE.Group();
  g.add(aMesh(new THREE.SphereGeometry(0.32, 16, 12), accMat(0xffd21e, { rough: 0.4 }), 0, 0.28, 0, { sy: 0.85 })); // gövde
  g.add(aMesh(new THREE.SphereGeometry(0.2, 14, 12), accMat(0xffd21e, { rough: 0.4 }), 0, 0.62, 0.12)); // baş
  g.add(aMesh(new THREE.ConeGeometry(0.09, 0.2, 10), accMat(0xff7a1e), 0, 0.62, 0.32, { rx: Math.PI / 2 })); // gaga
  g.add(aMesh(new THREE.SphereGeometry(0.03, 8, 8), accMat(0x101010), 0.08, 0.68, 0.26));
  g.add(aMesh(new THREE.SphereGeometry(0.03, 8, 8), accMat(0x101010), -0.08, 0.68, 0.26));
  return g;
}
function buildCrown() {
  const g = new THREE.Group();
  const gold = accMat(0xffcf3a, { metal: 0.9, rough: 0.2 });
  g.add(aMesh(new THREE.CylinderGeometry(0.34, 0.36, 0.22, 20, 1, true), gold, 0, 0.11, 0));
  for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; g.add(aMesh(new THREE.ConeGeometry(0.09, 0.28, 5), gold, Math.cos(a) * 0.34, 0.33, Math.sin(a) * 0.34)); }
  const jewels = [0xff3b5b, 0x3ba0ff, 0x54e07a];
  for (let i = 0; i < 3; i++) { const a = i / 3 * Math.PI * 2 + 0.5; g.add(aMesh(new THREE.SphereGeometry(0.07, 12, 10), accMat(jewels[i], { glow: 0.35 }), Math.cos(a) * 0.35, 0.12, Math.sin(a) * 0.35)); }
  return g;
}
function buildWings() {
  const g = new THREE.Group();
  const wm = accMat(0xf2f6ff, { glow: 0.12, rough: 0.5 });
  for (const s of [-1, 1]) {
    const w = new THREE.Group();
    for (let i = 0; i < 3; i++) w.add(aMesh(new THREE.SphereGeometry(0.34 - i * 0.07, 12, 10), wm, s * (0.3 + i * 0.34), i * 0.16, -i * 0.12, { sx: 1.3, sy: 0.35, sz: 0.7 }));
    w.rotation.z = s * -0.25; g.add(w);
  }
  return g;
}
function buildJetpack() {
  const g = new THREE.Group();
  const body = accMat(0xb8c0cc, { metal: 0.7, rough: 0.35 });
  for (const s of [-1, 1]) {
    g.add(aMesh(new THREE.CylinderGeometry(0.2, 0.2, 0.7, 14), body, s * 0.34, 0.55, 0));
    g.add(aMesh(new THREE.ConeGeometry(0.16, 0.22, 12), body, s * 0.34, 0.15, 0, { rx: Math.PI }));
    g.add(aMesh(new THREE.SphereGeometry(0.12, 12, 10), accMat(0x38c6ff, { glow: 0.7 }), s * 0.34, 0.05, 0)); // alev
  }
  return g;
}
const ACCESSORIES = [
  { id: 'surf', name: { tr: 'Sörf Tahtası', en: 'Surfboard' }, icon: '🏄', price: 800, r: 'c', build: buildSurf, mount: { x: 0, y: 1.6, z: 0.12, rz: 0.1 } },
  { id: 'flag', name: { tr: 'Bayrak', en: 'Flag' }, icon: '🚩', price: 500, r: 'c', build: buildFlag, mount: { x: -0.5, y: 0.86, z: 1.15 } },
  { id: 'cone', name: { tr: 'Parti Şapkası', en: 'Party Hat' }, icon: '🎉', price: 450, r: 'c', build: buildCone, mount: { x: 0, y: 1.48, z: 0.12 } },
  { id: 'tophat', name: { tr: 'Silindir Şapka', en: 'Top Hat' }, icon: '🎩', price: 750, r: 'c', build: buildTophat, mount: { x: 0, y: 1.48, z: 0.12 } },
  { id: 'spoiler', name: { tr: 'Spoiler', en: 'Spoiler' }, icon: '🏁', price: 1000, r: 'r', build: buildSpoiler, mount: { x: 0, y: 0.72, z: 1.28 } },
  { id: 'duck', name: { tr: 'Lastik Ördek', en: 'Rubber Duck' }, icon: '🦆', price: 600, r: 'r', build: buildDuck, mount: { x: 0, y: 1.46, z: 0.12 } },
  { id: 'crown', name: { tr: 'Altın Taç', en: 'Golden Crown' }, icon: '👑', gem: 20, r: 'e', build: buildCrown, mount: { x: 0, y: 1.5, z: 0.12 } },
  { id: 'wings', name: { tr: 'Melek Kanatları', en: 'Angel Wings' }, icon: '🪽', gem: 30, r: 'e', build: buildWings, mount: { x: 0, y: 0.75, z: 0.35 } },
  { id: 'jetpack', name: { tr: 'Jetpack', en: 'Jetpack' }, icon: '🚀', gem: 25, r: 'e', build: buildJetpack, mount: { x: 0, y: 0.7, z: 1.15 } },
];
const accById = id => ACCESSORIES.find(a => a.id === id);
// kule-üstü oturan aksesuarlar (tank kule yüksekliğine göre kaydırılır); diğerleri gövdeye sabit
const ACC_TURRET_SLOT = new Set(['surf', 'cone', 'tophat', 'duck', 'crown']);
function disposeSubtree(o) { o.traverse(n => { if (n.isMesh) { if (n.geometry) n.geometry.dispose(); if (n.material) (Array.isArray(n.material) ? n.material : [n.material]).forEach(m => m.dispose()); } }); }
function applyAccessory(root, accId, tankDef) {
  if (root.userData.accMesh) { root.remove(root.userData.accMesh); disposeSubtree(root.userData.accMesh); root.userData.accMesh = null; }
  const a = accById(accId); if (!a) return;
  const g = a.build(), mt = a.mount;
  let y = mt.y || 0;
  // kule-üstü aksesuar → tankın kule yüksekliğine göre kaydır (büyük tanklarda hizalı)
  if (ACC_TURRET_SLOT.has(a.id)) y += (((tankDef && tankDef.turretTop) || 1.5) - 1.5);
  g.position.set(mt.x || 0, y, mt.z || 0);
  if (mt.rx) g.rotation.x = mt.rx; if (mt.ry) g.rotation.y = mt.ry; if (mt.rz) g.rotation.z = mt.rz;
  if (mt.s) g.scale.setScalar(mt.s);
  root.add(g); root.userData.accMesh = g;
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
  for (const cv of covers) {
    const dx = pos.x - cv.x, dz = pos.z - cv.z, rr = radius + cv.r;
    const d2 = dx * dx + dz * dz;
    if (d2 < rr * rr) {
      const d = Math.sqrt(d2) || 0.001;
      pos.x += (dx / d) * (rr - d);
      pos.z += (dz / d) * (rr - d);
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
// ---- prosedürel arka plan müziği (özgün, WebAudio ile üretilir) ----
let musicGain = null, musicPlaying = false, musicTimer = null, musicNext = 0, musicChord = 0;
const CHORDS = [
  [110.00, [220.00, 261.63, 329.63]], // Am
  [87.31, [174.61, 220.00, 261.63]],  // F
  [130.81, [261.63, 329.63, 392.00]], // C
  [98.00, [196.00, 246.94, 293.66]],  // G
];
function playChordAt(bass, triad, t, dur) {
  const ac = AC, v = 0.045;
  const bo = ac.createOscillator(), bg = ac.createGain();
  bo.type = 'triangle'; bo.frequency.value = bass;
  bg.gain.setValueAtTime(0.0001, t); bg.gain.linearRampToValueAtTime(v * 1.3, t + 0.06); bg.gain.linearRampToValueAtTime(0.0001, t + dur);
  bo.connect(bg).connect(musicGain); bo.start(t); bo.stop(t + dur + 0.1);
  for (const f of triad) {
    const o = ac.createOscillator(), g = ac.createGain(), fl = ac.createBiquadFilter();
    o.type = 'sawtooth'; o.frequency.value = f; fl.type = 'lowpass'; fl.frequency.value = 850;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v * 0.35, t + 0.35); g.gain.linearRampToValueAtTime(0.0001, t + dur);
    o.connect(fl).connect(g).connect(musicGain); o.start(t); o.stop(t + dur + 0.1);
  }
}
function scheduleMusic() {
  if (!musicPlaying || !AC) return;
  if (settings.muted || !settings.music) { musicNext = AC.currentTime + 0.1; return; }
  const now = AC.currentTime, beat = state === 'play' ? 1.7 : 2.1;
  while (musicNext < now + 0.35) {
    const [bass, triad] = CHORDS[musicChord % 4];
    playChordAt(bass, triad, musicNext, beat);
    musicNext += beat; musicChord++;
  }
}
function updateMusicGain() {
  if (!musicGain || !AC) return;
  musicGain.gain.setTargetAtTime((settings.muted || !settings.music) ? 0 : 1, AC.currentTime, 0.3);
}
function startMusic() {
  audio();
  if (!musicGain) { musicGain = AC.createGain(); musicGain.gain.value = 0; musicGain.connect(AC.destination); }
  if (!musicPlaying) { musicPlaying = true; musicNext = AC.currentTime + 0.15; musicChord = 0; musicTimer = setInterval(scheduleMusic, 130); }
  updateMusicGain();
}
// olay müzikleri (kısa flöriler)
function sting(notes, dur = 0.14, type = 'square', vol = 0.12) {
  if (settings.muted) return;
  const ac = audio(); let t = ac.currentTime;
  for (const f of notes) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(ac.destination); o.start(t); o.stop(t + dur + 0.03);
    t += dur;
  }
}
const stingWave = () => sting([523, 659, 784], 0.12);
const stingBoss = () => sting([146, 123, 98, 82], 0.26, 'sawtooth', 0.14);
const stingWin = () => sting([523, 659, 784, 1047], 0.13);
const stingLose = () => sting([392, 330, 262, 196], 0.2, 'triangle', 0.12);
const stingGoal = () => sting([659, 880], 0.1);

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
    else if (p.userData.dust) {
      p.position.y += p.userData.vy * dt; p.userData.vy *= 0.95;
      p.scale.addScalar(dt * 1.6);
      p.material.opacity = Math.max(0, p.userData.life * (p.userData.op0 || 0.5));
      p.rotation.y += dt * 1.5;
    }
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
// yükselen skor yazıları
const floaters = [];
const floaterTexCache = {};
function floaterTexture(text, color) {
  const key = text + '|' + color;
  if (floaterTexCache[key]) return floaterTexCache[key];
  const cv = document.createElement('canvas'); cv.width = 160; cv.height = 72;
  const g = cv.getContext('2d');
  g.font = 'bold 46px "Courier New", monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.lineWidth = 7; g.strokeStyle = 'rgba(0,0,0,0.85)'; g.strokeText(text, 80, 38);
  g.fillStyle = color; g.fillText(text, 80, 38);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  floaterTexCache[key] = t; return t;
}
function popFloater(x, y, z, text, color = '#ffe86a') {
  if (floaters.length > 18) return;
  const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: floaterTexture(text, color), transparent: true, depthTest: false }));
  spr.scale.set(3.4, 1.5, 1); spr.position.set(x, y, z);
  spr.userData = { life: 1.0 };
  scene.add(spr); floaters.push(spr);
}
function updateFloaters(dt) {
  for (let i = floaters.length - 1; i >= 0; i--) {
    const f = floaters[i]; f.userData.life -= dt;
    if (f.userData.life <= 0) { scene.remove(f); f.material.dispose(); floaters.splice(i, 1); continue; }
    f.position.y += dt * 2.6;
    f.material.opacity = Math.min(1, f.userData.life * 1.6);
  }
}
// toz / duman (dust bayraklı parçacıklar updateParticles içinde yükselir + genişler)
function spawnPuff(x, y, z, color, op, vy, life) {
  if (particles.length > 120) return;
  const p = new THREE.Mesh(partGeo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: op }));
  p.position.set(x + (Math.random() - 0.5) * 0.7, y, z + (Math.random() - 0.5) * 0.7);
  p.scale.setScalar(0.6 + Math.random() * 0.6);
  p.userData = { dust: true, vy, life, op0: op };
  scene.add(p); particles.push(p);
}
function spawnDust(x, z) { spawnPuff(x, 0.3, z, 0xcab89a, 0.4, 0.6 + Math.random() * 0.4, 0.6); }
function spawnSmoke(x, z) { spawnPuff(x, 1.1, z, 0x2a2a2a, 0.55, 1.3 + Math.random() * 0.6, 0.9); }
let dustT = 0, smokeT = 0;
// tank üstü isim etiketleri
const nameTexCache = {};
function nameTexture(text) {
  if (nameTexCache[text]) return nameTexCache[text];
  const cv = document.createElement('canvas'); cv.width = 256; cv.height = 64;
  const g = cv.getContext('2d');
  g.font = 'bold 34px "Courier New", monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.lineWidth = 6; g.strokeStyle = 'rgba(0,0,0,0.9)'; g.strokeText(text, 128, 34);
  g.fillStyle = '#ffffff'; g.fillText(text, 128, 34);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  nameTexCache[text] = t; return t;
}
function makeNameLabel(text) {
  const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: nameTexture(text || '...'), transparent: true, depthTest: false }));
  spr.scale.set(4.2, 1.05, 1); spr.visible = false;
  scene.add(spr); return spr;
}
function setLabelText(label, text) { if (label) { label.material.map = nameTexture(text || '...'); label.material.needsUpdate = true; } }
// kill feed / olay akışı
function killFeed(html) {
  const el = $('killfeed');
  const row = document.createElement('div'); row.className = 'kfrow'; row.innerHTML = html;
  el.appendChild(row);
  while (el.children.length > 4) el.removeChild(el.firstChild);
  setTimeout(() => { row.style.opacity = '0'; setTimeout(() => row.remove(), 500); }, 3500);
}

// ---------------------------------------------------------------- oyun durumu
const bullets = [];
const bulletGeo = new THREE.SphereGeometry(0.14, 10, 10);
const bulletTailGeo = new THREE.BoxGeometry(0.09, 0.09, 1.3);

const player = {
  mesh: null, a: 0, x: 0, z: 0,
  health: 5, maxHealth: 5, cool: 0, alive: true, speed: 0, inv: 0,
  stat: tankById(profile.selected),
  speedT: 0, tripleT: 0, shieldT: 0,
  vx: 0, vz: 0,
};
let playerTurret = null, turretBaseZ = 0;

function applySkin(mesh, skinId) {
  const s = skinById(skinId);
  if (s.id === 'default') return; // tankın kendi rengi kalsın
  mesh.traverse(o => {
    if (o.isMesh && o.material && o.material.name === 'TankPaint') {
      o.material = o.material.clone();
      o.material.color.setHex(s.color);
      o.material.metalness = s.metal != null ? s.metal : 0.15;
      o.material.roughness = s.rough != null ? s.rough : 0.55;
      if (s.glow) { o.material.emissive.setHex(s.color); o.material.emissiveIntensity = s.glow; }
      else o.material.emissiveIntensity = 0;
    }
  });
}
// 1v1'de (düello + top maçı) herkes bu standart tankı kullanır → adil + tutarlı vuruş algılama.
// (Garaj seçimi/yükseltmeler sadece tek oyunculu + kooperatifte geçerli. İleride "rekabetçi" mod seçime açılabilir.)
const DUEL_TANK = { ...TANKS[0] };
function setPlayerTank(overrideDef) {
  const def = overrideDef || effTank(profile.selected);
  if (player.mesh) scene.remove(player.mesh);
  player.mesh = buildTank(def);
  applySkin(player.mesh, profile.skin);
  applyAccessory(player.mesh, profile.accessory, def);
  player.mesh.position.set(player.x, 0, player.z);
  scene.add(player.mesh);
  playerTurret = player.mesh.getObjectByName('TankTurret');
  turretBaseZ = playerTurret ? playerTurret.position.z : 0;
  player.stat = def;
  player.maxHealth = def.health;
}
await ensureModel(tankById(profile.selected).model); // seçili tank özel modelliyse açılışta yükle
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
// 2v2 takım savaşı
let team = null;
let matchBuild = null, buildChoosing = false, buildOnDone = null; // maç-içi build durumu (openMenu top-level'da erişir → burada bildir)
const TEAM_TARGET = 15;
const TEAM_COLORS = [0xd8382a, 0x2f7db0];       // 0 = kırmızı (sol), 1 = mavi (sağ)
const TEAM_COLOR_HEX = ['#e8503a', '#3a9de0'];
const TEAM_SPAWNS = [[[1, 11], [1, 1]], [[11, 11], [11, 1]]]; // takım0 sol kenar, takım1 sağ kenar

function fire(owner, angOff = 0, playerShot = null) {
  const isPlayer = owner === player;
  const a = owner.a + angOff;
  const mesh = new THREE.Mesh(bulletGeo, isPlayer ? playerBulletMat : enemyBulletMat);
  const bx = owner.x + fwdX(a) * 2.6;
  const bz = owner.z + fwdZ(a) * 2.6;
  mesh.position.set(bx, 1.13, bz);
  mesh.rotation.y = a;
  const tail = new THREE.Mesh(bulletTailGeo, isPlayer ? playerTailMat : enemyTailMat);
  tail.position.z = 0.75; mesh.add(tail);
  scene.add(mesh);
  let sp;
  if (isPlayer) sp = player.stat.bspeed;
  else if (mode === 'duel' || mode === 'ball' || mode === 'team') sp = owner.bspeed || 24;
  else sp = owner.bspeed || ENEMY_BSPEED;
  // takım modunda mermi hangi takımdan / kimden (dost ateşi + skor için)
  const bTeam = (mode === 'team' && team) ? (isPlayer ? team.mine : owner.team) : null;
  const bOwner = (mode === 'team' && team) ? (isPlayer ? team.you : owner.pid) : null;
  bullets.push({ mesh, fromPlayer: isPlayer, playerShot: playerShot == null ? isPlayer : playerShot, vx: fwdX(a) * sp, vz: fwdZ(a) * sp, life: 2.6, bounces: 1, team: bTeam, owner: bOwner });
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
  if (mode === 'solo' || ((mode === 'duel' || mode === 'coop' || mode === 'team') && isAuthority)) {
    powerupT -= dt;
    if (powerupT <= 0 && powerups.length < 3) {
      const def = POWERUPS[Math.floor(Math.random() * POWERUPS.length)];
      const cell = randOpenCell(player.x, player.z, 10);
      const id = ++puIdCounter;
      addPowerup(def.type, cell.x, cell.z, id);
      if (mode === 'duel' || mode === 'coop' || mode === 'team') netSend({ t: 'pu_spawn', id, type: def.type, x: cell.x, z: cell.z });
      powerupT = 9 + Math.random() * 6;
    }
  }
  for (let i = powerups.length - 1; i >= 0; i--) {
    const p = powerups[i];
    p.bob += dt * 3; p.mesh.rotation.y += dt * 1.6;
    p.mesh.position.y = 1.25 + Math.sin(p.bob) * 0.25;
    if (player.alive && Math.hypot(player.x - p.x, player.z - p.z) < TANK_R + 1.05) {
      applyPowerup(p.type); explode(p.x, 1.2, p.z, false);
      if (mode === 'duel' || mode === 'coop' || mode === 'team') netSend({ t: 'pu_take', id: p.id });
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
const shieldGeo = new THREE.SphereGeometry(2.0, 20, 16);
const shieldMat = new THREE.MeshStandardMaterial({ color: 0x2ad0ff, transparent: true, opacity: 0.22, emissive: 0x2ad0ff, emissiveIntensity: 0.6, side: THREE.DoubleSide, depthWrite: false });
function makeShieldBubble() { const m = new THREE.Mesh(shieldGeo, shieldMat); m.visible = false; scene.add(m); return m; }
const shieldBubble = makeShieldBubble();

// düşman tipleri: normal / keşif (hızlı-zayıf) / ağır (yavaş-zırhlı) / nişancı (uzaktan) / boss
const ENEMY_TYPES = {
  normal: { hp: 1, speed: 4.6, turn: 1.9, cool: [2.2, 3.8], bspeed: 17, keep: 11, sight: 55, scale: 1.0, color: 0xa03428, coins: 9, score: 100 },
  scout:  { hp: 1, speed: 7.8, turn: 2.9, cool: [2.6, 4.2], bspeed: 16, keep: 6, sight: 50, scale: 0.82, color: 0xc9902f, coins: 7, score: 80 },
  heavy:  { hp: 3, speed: 3.0, turn: 1.3, cool: [2.4, 3.8], bspeed: 20, keep: 9, sight: 52, scale: 1.35, color: 0x5a6b55, coins: 21, score: 250 },
  sniper: { hp: 1, speed: 3.6, turn: 1.6, cool: [2.0, 3.2], bspeed: 34, keep: 24, sight: 75, scale: 0.95, color: 0x8a3a8a, coins: 15, score: 180 },
  boss:   { hp: 14, speed: 2.8, turn: 1.1, cool: [1.3, 2.0], bspeed: 22, keep: 12, sight: 80, scale: 2.1, color: 0x8f1414, coins: 120, score: 2000, triple: true, glow: true },
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
      id: ++enemyIdC, type, color: d.color, hp: d.hp, maxHp: d.hp, baseScale: d.scale, hitT: 0,
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

function updateCoinBar() { coinsEl.textContent = profile.coins; updateTokenBar(); updateGemBar(); }
function updateTokenBar() { const el = $('tokens'); if (el) el.textContent = profile.tokens || 0; }
function updateGemBar() { const el = $('gems'); if (el) el.textContent = profile.gems || 0; }
function grantTokens(n) {
  if (!n || n <= 0) return;
  profile.tokens = (profile.tokens || 0) + n;
  saveProfile(); updateTokenBar();
  showToast(T().tokenGot(n), 2600);
}
// jeton makinesi (gacha) — ağırlıklı rastgele kaplama; kopya çıkarsa coin'e döner (GDD kuralı)
function tokenOdds() {
  const pool = SKINS.filter(s => s.id !== 'default');
  const sum = { c: 0, r: 0, e: 0 }; let total = 0;
  for (const s of pool) { sum[s.r] += RARITY[s.r].w; total += RARITY[s.r].w; }
  return { c: sum.c / total * 100, r: sum.r / total * 100, e: sum.e / total * 100 };
}
function spinToken() {
  if ((profile.tokens || 0) < 1) return;
  profile.tokens--;
  const pool = SKINS.filter(s => s.id !== 'default');
  let total = 0; for (const s of pool) total += RARITY[s.r].w;
  let roll = Math.random() * total, pick = pool[pool.length - 1];
  for (const s of pool) { roll -= RARITY[s.r].w; if (roll <= 0) { pick = s; break; } }
  const t = T();
  if (profile.skins.includes(pick.id)) {
    const coins = RARITY[pick.r].coin;
    addCoins(coins); saveProfile();
    banner(t.gachaDup(pick.name[lang], coins)); sfxCoin();
    track('gacha', { result: 'dup', rarity: pick.r });
  } else {
    profile.skins.push(pick.id); saveProfile();
    banner(t.gachaNew(pick.name[lang])); sfxPower(); haptic('HEAVY');
    track('gacha', { result: 'new', rarity: pick.r });
  }
  updateCoinBar();
  if ($('panel-garage').classList.contains('show')) renderSkins();
}
function renderMachine() {
  const t = T(), o = tokenOdds();
  $('tokenmachine').innerHTML = `<div class="tm-box">
    <div class="tm-title">${t.tmTitle}</div>
    <div class="tm-count">${t.tmCount}: <b>${profile.tokens || 0}</b></div>
    <button id="tm-spin" class="mbtn"${(profile.tokens || 0) < 1 ? ' disabled' : ''}>${t.tmSpin}</button>
    <div class="tm-odds">${RARITY.c[lang]} %${o.c.toFixed(0)} · ${RARITY.r[lang]} %${o.r.toFixed(0)} · ${RARITY.e[lang]} %${o.e.toFixed(0)}</div>
  </div>`;
  const sp = $('tm-spin'); if (sp) sp.onclick = spinToken;
}
function updateStats() {
  $('statsline').innerHTML = `🏆 D.${profile.bestWave} &nbsp;·&nbsp; ⚔️ ${profile.kills} &nbsp;·&nbsp; 🥇 ${profile.wins} &nbsp;·&nbsp; 🏅`;
}
let toastT = 0, statsCheckT = 2;
function showToast(text, dur = 2800) {
  const el = $('toast'); el.textContent = text; el.style.opacity = '1'; toastT = dur / 1000;
}
// FTUE: ilk düşman öldürüldüğünde bedava kozmetik hediye (erken dopamin + ödül döngüsünü öğret)
function checkFtue() {
  if (!profile.gift1 && (profile.kills || 0) >= 1) {
    profile.gift1 = true;
    if (!profile.skins.includes('crimson')) profile.skins.push('crimson');
    if (profile.skin === 'default') profile.skin = 'crimson';
    saveProfile();
    showToast(T().ftueGift(skinById('crimson').name[lang]), 4500);
    sfxCoin();
  }
}
// FTUE: yeni oyuncuya kontrol ipuçları (tutorial ekranı yerine oyun içi)
let ftueHintOn = false, ftueHintT = 0;
function showFtueHint() {
  if ((profile.games || 0) > 3) return;
  const el = $('ftuehint');
  el.innerHTML = IS_TOUCH ? T().ftueHintTouch : T().ftueHintDesk;
  el.style.display = 'block'; el.style.opacity = '1';
  ftueHintOn = true; ftueHintT = 8;
}
function hideFtueHint() {
  if (!ftueHintOn) return;
  ftueHintOn = false;
  const el = $('ftuehint'); el.style.opacity = '0';
  setTimeout(() => { if (!ftueHintOn) el.style.display = 'none'; }, 500);
}
// ---------------------------------------------------------------- profil XP / seviye (retention omurgası)
function xpForLevel(n) { return Math.round(100 * Math.pow(n, 1.35)); } // n→n+1 için gereken XP
function grantXp(amount) {
  if (!amount || amount <= 0) return 0;
  profile.xp = (profile.xp || 0) + amount;
  let leveled = 0;
  while (profile.xp >= xpForLevel(profile.level || 1)) {
    profile.xp -= xpForLevel(profile.level || 1);
    profile.level = (profile.level || 1) + 1;
    leveled++;
    onLevelUp(profile.level);
  }
  saveProfile();
  updateLevelBar();
  return leveled;
}
function onLevelUp(lvl) {
  const big = lvl % 5 === 0;
  const reward = big ? (100 + lvl * 12) : (20 + lvl * 3);
  addCoins(reward);
  if (big) { grantTokens(2); addGems(2); } // her 5. seviye → 2 jeton + 2 elmas (ücretsiz premium akışı)
  banner(`⭐ ${lang === 'tr' ? 'SEVİYE' : 'LEVEL'} ${lvl}!  +🪙${reward}${big ? '  +💎2' : ''}`);
  sfxPower();
  track('level_up', { level: lvl });
}
// maç sonunda kazanılan XP (mod + performansa göre)
function computeMatchXp(kind, opts) {
  opts = opts || {};
  let xp = 12; // katılım tabanı
  if (kind === 'wave') xp += (opts.wave || 1) * 6;
  else if (kind === 'pvp') xp += (opts.kills || 0) * 8 + (opts.won ? 30 : 8);
  else if (kind === 'ball') xp += (opts.won ? 30 : 10);
  return xp;
}
function grantMatchXp(kind, opts) {
  const xp = computeMatchXp(kind, opts);
  grantXp(xp);
  grantSeasonXp(xp);
  showToast(`+${xp} XP`, 2200);
  return xp;
}
// maç-sonu "hasat" ekranı — GDD retention hub'ı: XP çubuğu dolar → seviye → ödüller → tek tuş tekrar
let harvestReplay = null, harvestReward = null;
function showHarvest(opts) {
  state = 'over';
  const t = T();
  const preLvl = profile.level || 1, prePct = ((profile.xp || 0) / xpForLevel(preLvl)) * 100;
  const gained = computeMatchXp(opts.xpKind, opts.xpOpts);
  grantXp(gained); // seviye atlarsa onLevelUp banner+coin
  grantSeasonXp(gained); // sezon rayı da oynayarak dolar
  $('res-title').textContent = opts.title;
  $('res-title').style.color = opts.won === false ? '#ff8a6a' : '#7dff9b';
  $('res-sub').innerHTML = opts.sub || '';
  $('res-rewards').innerHTML = `+${gained} XP` + (opts.coins ? ` &nbsp;·&nbsp; +🪙${opts.coins}` : '');
  $('res-lvl').textContent = (lang === 'tr' ? 'Sv ' : 'Lv ') + preLvl;
  if (opts.replay) { $('res-again').style.display = ''; $('res-again').textContent = t.againBtn; harvestReplay = opts.replay; }
  else { $('res-again').style.display = 'none'; harvestReplay = null; } // ağ modları: tekrar-oyna yok (koordinasyon gerekir), menü
  $('res-menu').textContent = '‹ ' + t.toMenuW;
  // ödüllü reklam teklifi (x2) — FTUE'den sonra + sıklık sınırı
  harvestReward = { xp: gained, coins: opts.coins || 0 };
  const rb = $('res-rewarded');
  if (canOfferRewarded()) { rb.style.display = ''; rb.disabled = false; rb.textContent = t.rewardedBtn; track('ad_offer', { placement: 'harvest' }); }
  else rb.style.display = 'none';
  showPanel('panel-result');
  msgEl.classList.remove('hidden');
  $('topbar').style.visibility = 'hidden';
  updateCoinBar(); updateLevelBar();
  animateHarvestXp(preLvl, prePct);
}
function animateHarvestXp(preLvl, prePct) {
  const fill = $('res-xpfill');
  fill.style.transition = 'none'; fill.style.width = prePct + '%';
  const finalPct = ((profile.xp || 0) / xpForLevel(profile.level || 1)) * 100;
  const leveled = (profile.level || 1) > preLvl;
  requestAnimationFrame(() => setTimeout(() => {
    fill.style.transition = 'width .7s ease';
    if (leveled) {
      fill.style.width = '100%';
      setTimeout(() => {
        fill.style.transition = 'none'; fill.style.width = '0%';
        $('res-lvl').textContent = (lang === 'tr' ? 'Sv ' : 'Lv ') + (profile.level || 1);
        requestAnimationFrame(() => { fill.style.transition = 'width .6s ease'; fill.style.width = Math.max(3, finalPct) + '%'; });
      }, 780);
    } else {
      fill.style.width = Math.max(3, finalPct) + '%';
    }
  }, 300));
}
function updateLevelBar() {
  const el = $('lvlnum'); if (!el) return;
  const need = xpForLevel(profile.level || 1);
  el.textContent = (lang === 'tr' ? 'Sv ' : 'Lv ') + (profile.level || 1);
  $('lvlfill').style.width = Math.max(2, Math.min(100, ((profile.xp || 0) / need) * 100)) + '%';
}
// ---------------------------------------------------------------- günlük görevler (3/gün, gece yenilenir)
const QUESTS = [
  { id: 'play3', type: 'match', goal: 3, reward: 50, text: { tr: '3 maç oyna', en: 'Play 3 matches' } },
  { id: 'kill15', type: 'kill', goal: 15, reward: 60, text: { tr: '15 tank patlat', en: 'Destroy 15 tanks' } },
  { id: 'win2', type: 'win', goal: 2, reward: 80, text: { tr: '2 maç kazan', en: 'Win 2 matches' } },
  { id: 'wave6', type: 'wave', goal: 6, reward: 70, text: { tr: '6 dalga temizle', en: 'Clear 6 waves' } },
  { id: 'kill30', type: 'kill', goal: 30, reward: 110, text: { tr: '30 tank patlat', en: 'Destroy 30 tanks' } },
];
const questDef = id => QUESTS.find(q => q.id === id);
function questDayKey() { return new Date().toDateString(); }
function dailyQuests() {
  const dk = questDayKey();
  if (!profile.quests || profile.quests.date !== dk) {
    const seed = [...dk].reduce((a, c) => a + c.charCodeAt(0), 0);
    const start = seed % QUESTS.length;
    const list = [0, 1, 2].map(k => ({ id: QUESTS[(start + k) % QUESTS.length].id, prog: 0, claimed: false }));
    profile.quests = { date: dk, list };
    saveProfile();
  }
  return profile.quests.list;
}
function questProgress(type, amount) {
  amount = amount || 1;
  if (amount <= 0) return;
  let changed = false;
  for (const q of dailyQuests()) {
    const def = questDef(q.id);
    if (!def || def.type !== type || q.claimed) continue;
    q.prog = Math.min(def.goal, q.prog + amount);
    changed = true;
    if (q.prog >= def.goal) {
      q.claimed = true;
      addCoins(def.reward); grantXp(25); grantTokens(1); // görev → 1 jeton
      showToast(`✅ ${def.text[lang]}  +🪙${def.reward}`, 3400);
      track('quest_complete', { id: q.id });
    }
  }
  if (changed) {
    // tüm günlük görevler bitince günlük sandık (günde bir)
    if (!profile.quests.chest && dailyQuests().every(q => q.claimed)) {
      profile.quests.chest = true;
      addCoins(120); profile.tokens = (profile.tokens || 0) + 2; updateTokenBar();
      showToast(T().chestMsg, 4200); sfxCoin(); track('daily_chest');
    }
    saveProfile();
    if ($('panel-quests').classList.contains('show')) renderQuests();
  }
}
// ---------------------------------------------------------------- sezon (30 kademe, ücretsiz ray, oynayarak dolar)
const SEASON_TIER_XP = 120, SEASON_LEN = 30;
const SEASON_THEMES = [
  { tr: 'Lav Sezonu', en: 'Lava Season' }, { tr: 'Ayaz Sezonu', en: 'Frost Season' },
  { tr: 'Uzay Sezonu', en: 'Space Season' }, { tr: 'Çöl Sezonu', en: 'Desert Season' },
];
const SEASON_SKINS = { 5: 'ember', 10: 'frost', 15: 'plasma', 20: 'void', 25: 'venom', 30: 'royal' };
const SEASON_GEMS = { 8: 3, 16: 3, 24: 4 }; // sezon rayından ücretsiz elmas
const SEASON_REWARDS = Array.from({ length: SEASON_LEN }, (_, i) => {
  const tier = i + 1;
  if (SEASON_SKINS[tier]) return { skin: SEASON_SKINS[tier] };
  if (SEASON_GEMS[tier]) return { gems: SEASON_GEMS[tier] };
  if (tier % 3 === 0) return { tokens: 1 };
  return { coins: 30 + tier * 3 };
});
function seasonId() {
  const epoch = Date.UTC(2026, 0, 1);
  const weeks = Math.floor((Date.now() - epoch) / (7 * 86400000));
  return Math.floor(weeks / 6) + 1; // 6 haftalık sezonlar
}
function seasonName(id) { const th = SEASON_THEMES[(id - 1) % SEASON_THEMES.length]; return `${T().seasonWord} ${id} · ${th[lang]}`; }
function ensureSeason() {
  const id = seasonId();
  if (!profile.season || profile.season.id !== id) { profile.season = { id, xp: 0, tier: 0 }; saveProfile(); }
  return profile.season;
}
function rewardText(r) { return r.coins ? `🪙 ${r.coins}` : r.tokens ? `🎰 ${r.tokens}` : r.gems ? `💎 ${r.gems}` : r.skin ? `🎨 ${skinById(r.skin).name[lang]}` : ''; }
function grantSeasonReward(tier) {
  const r = SEASON_REWARDS[tier - 1]; if (!r) return;
  if (r.coins) addCoins(r.coins);
  if (r.gems) addGems(r.gems);
  if (r.tokens) { profile.tokens = (profile.tokens || 0) + r.tokens; updateTokenBar(); }
  if (r.skin && !profile.skins.includes(r.skin)) profile.skins.push(r.skin);
  saveProfile();
  showToast(T().seasonTierUp(tier, rewardText(r)), 3200);
  sfxCoin(); track('season_tier', { tier });
}
function grantSeasonXp(amount) {
  if (!amount || amount <= 0) return;
  const s = ensureSeason();
  if (s.tier >= SEASON_LEN) return;
  s.xp += amount;
  while (s.tier < SEASON_LEN && s.xp >= SEASON_TIER_XP) { s.xp -= SEASON_TIER_XP; s.tier++; grantSeasonReward(s.tier); }
  saveProfile();
}
function renderSeason() {
  const s = ensureSeason(), t = T();
  const pct = s.tier >= SEASON_LEN ? 100 : (s.xp / SEASON_TIER_XP * 100);
  $('season-head').innerHTML = `<div class="sh-name">${seasonName(s.id)}</div>` +
    `<div class="sh-sub">${t.seasonTier} ${s.tier}/${SEASON_LEN}</div>` +
    `<div class="sh-bar"><div class="sh-fill" style="width:${pct}%"></div></div>`;
  $('season-track').innerHTML = SEASON_REWARDS.map((r, i) => {
    const tier = i + 1, got = tier <= s.tier, cur = tier === s.tier + 1;
    return `<div class="strow${got ? ' got' : cur ? ' cur' : ''}"><span class="st-t">${tier}</span><span class="st-r">${rewardText(r)}</span><span class="st-s">${got ? '✅' : cur ? '▶' : '🔒'}</span></div>`;
  }).join('');
}
let lbPeriod = 'day';
async function renderLeaderboard(period) {
  lbPeriod = period; const t = T();
  $('lbt-day').classList.toggle('on', period === 'day');
  $('lbt-week').classList.toggle('on', period === 'week');
  $('lblist').innerHTML = `<div class="lbempty">${t.lbLoad}</div>`;
  const rows = await fetchLeaderboard(period);
  if (lbPeriod !== period) return; // sekme değiştiyse iptal
  if (!rows.length) { $('lblist').innerHTML = `<div class="lbempty">${t.lbEmpty}</div>`; return; }
  const myName = profile.name || 'Oyuncu';
  $('lblist').innerHTML = rows.map((r, i) => {
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1) + '.';
    const me = r.name === myName ? ' me' : '';
    return `<div class="lbrow${me}"><span class="lbrank">${medal}</span><span class="lbname">${r.name}</span><span class="lbscore">🌊 ${r.score}</span></div>`;
  }).join('');
}
function renderQuests() {
  const list = dailyQuests(), t = T();
  const chest = profile.quests.chest ? t.chestDone : t.chestReady;
  const header = `<div class="qhead"><span>${t.streakLabel(profile.streak || 1)}</span><span class="${profile.quests.chest ? 'qchest-done' : ''}">${chest}</span></div>`;
  $('questlist').innerHTML = header + list.map(q => {
    const def = questDef(q.id);
    const pct = Math.min(100, (q.prog / def.goal) * 100);
    return `<div class="qrow${q.claimed ? ' done' : ''}">
      <div class="qtext"><span>${q.claimed ? '✅ ' : ''}${def.text[lang]}</span><span class="qrew">+🪙${def.reward}</span></div>
      <div class="qbar"><div class="qfill" style="width:${pct}%"></div></div>
      <div class="qprog">${q.prog}/${def.goal}</div>
    </div>`;
  }).join('');
}
function checkAchievements() {
  for (const a of ACHIEVEMENTS) {
    if (profile.achieved.includes(a.id)) continue;
    if ((profile[a.stat] || 0) >= a.goal) {
      profile.achieved.push(a.id);
      addCoins(a.reward);
      showToast(`🏅 ${a.name[lang]}  +🪙${a.reward}`);
    }
  }
}
function checkDaily() {
  const today = new Date().toDateString();
  if (profile.lastDaily === today) return;
  const yest = new Date(Date.now() - 864e5).toDateString();
  profile.streak = (profile.lastDaily === yest) ? (profile.streak || 0) + 1 : 1;
  profile.lastDaily = today;
  const day = ((profile.streak - 1) % 7) + 1; // 7 günlük döngü (artan)
  const reward = 40 + day * 20;               // gün 7 = 180
  addCoins(reward);
  let msg = `🎁 ${T().dailyW} ${profile.streak} · +🪙${reward}`;
  if (day === 7) { profile.tokens = (profile.tokens || 0) + 3; updateTokenBar(); msg += ' +🎰3'; }      // 7. gün büyük ödül
  else if (day % 3 === 0) { profile.tokens = (profile.tokens || 0) + 1; updateTokenBar(); msg += ' +🎰1'; }
  saveProfile();
  showToast(msg, 4500);
}
function updateBossBar(boss) {
  const el = $('bossbar');
  if (boss) {
    el.style.display = 'flex';
    $('bosslabel').textContent = T().bossLbl;
    $('bosshp').style.width = Math.max(0, (boss.hp / boss.maxHp) * 100) + '%';
  } else if (el.style.display !== 'none') el.style.display = 'none';
}
function updateCoopRoster() {
  const el = $('coophud');
  if (mode !== 'coop' || !coop || state !== 'play') { if (el.style.display !== 'none') { el.style.display = 'none'; el.innerHTML = ''; } return; }
  el.style.display = 'block';
  const rows = [{ name: profile.name, alive: player.alive, pid: coop.you }];
  for (const [pid, rm] of coop.remotes) rows.push({ name: rm.name || ('Oyuncu' + pid), alive: rm.alive, pid });
  rows.sort((a, b) => a.pid - b.pid);
  el.innerHTML = rows.map(r => `<div class="crow">${r.alive ? '🟢' : '⚫'} ${r.name}</div>`).join('');
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
  if (covers.length) { c.fillStyle = '#e0742a'; for (const cv of covers) dot(cv.x, cv.z, 2); }
  c.fillStyle = '#ff4030';
  if (enemies.length) { for (const e of enemies) if (e.alive) dot(e.x, e.z, e.type === 'boss' ? 4.5 : 2.5); }
  else for (const m of coopEnemies.values()) dot(m.position.x, m.position.z, 2.5);
  if (mode === 'ball' && ball) { c.fillStyle = '#ffffff'; dot(ball.x, ball.z, 3); }
  if (mode === 'duel' && duel && duel.remoteAlive) { c.fillStyle = '#ff7a5a'; dot(duel.x, duel.z, 3); }
  if (mode === 'coop' && coop) for (const [pid, rm] of coop.remotes) if (rm.alive) { c.fillStyle = '#' + (PLAYER_COLORS[pid] || 0x8888aa).toString(16).padStart(6, '0'); dot(rm.x, rm.z, 3); }
  if (mode === 'team' && team) for (const rm of team.remotes.values()) if (rm.alive) { c.fillStyle = TEAM_COLOR_HEX[rm.team]; dot(rm.x, rm.z, 3); }
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
  haptic('MEDIUM'); // native app'te titreşimli vuruş geri bildirimi
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
    scoreEl.textContent = `${profile.name} ${duel.myKills} — ${duel.myDeaths} ${duel.oppName || t.opp}`;
  } else if (mode === 'team' && team) {
    waveEl.textContent = team.code ? `${t.roomLbl} ${team.code}` : '';
    scoreEl.innerHTML = `<span style="color:${TEAM_COLOR_HEX[0]}">${t.teamRed} ${team.scores[0]}</span> — <span style="color:${TEAM_COLOR_HEX[1]}">${team.scores[1]} ${t.teamBlue}</span>`;
  } else {
    waveEl.textContent = `${t.wave} ${wave}`;
    scoreEl.textContent = `${t.score} ${score}`;
  }
}

// panel yönetimi
function showPanel(id) {
  for (const p of ['panel-main', 'panel-maps', 'panel-garage', 'panel-duel', 'panel-coop', 'panel-profile', 'panel-rematch', 'panel-result', 'panel-quests', 'panel-lb', 'panel-season', 'panel-showroom'])
    $(p).classList.toggle('show', p === id);
}
function openMenu() {
  state = 'menu';
  mode = 'solo';
  if (showroom.active) { showroom.active = false; $('title').style.display = ''; $('submsg').style.display = ''; $('keys').style.display = ''; $('coinbar').style.visibility = ''; $('langsw').style.visibility = ''; }
  clearBallMode(); clearCoop(); clearTeam(); clearPowerups();
  hideFtueHint();
  $('buildchoice').classList.add('hidden'); buildChoosing = false;
  shieldBubble.visible = false;
  if (!wallInst) buildArena(0);
  const t = T();
  $('title').textContent = t.title;
  $('submsg').textContent = t.sub;
  showPanel('panel-main');
  msgEl.classList.remove('hidden');
  $('topbar').style.visibility = 'hidden';
  updateCoinBar();
  updateLevelBar();
  updateStats();
  checkAchievements();
}

function applyLang() {
  localStorage.setItem('tanklang', lang);
  const t = T();
  document.title = t.title;
  $('keys').innerHTML = IS_TOUCH ? t.keysTouch : t.keysDesk;
  $('btn-single').textContent = t.single;
  $('btn-duel').textContent = t.duel;
  $('btn-ball').textContent = t.ballBtn;
  $('btn-quickplay').textContent = t.quickPlay;
  $('btn-quests').textContent = t.questsBtn;
  $('btn-back-quests').textContent = t.back;
  $('btn-lb').textContent = t.lbBtn;
  $('btn-back-lb').textContent = t.back;
  $('btn-season').textContent = t.seasonBtn;
  $('btn-back-season').textContent = t.back;
  $('lbt-day').textContent = t.lbDaily;
  $('lbt-week').textContent = t.lbWeekly;
  $('btn-coop-share').textContent = t.shareBtn;
  $('btn-duel-share').textContent = t.shareBtn;
  $('btn-coop').textContent = t.coopBtn;
  $('btn-team').textContent = t.teamBtn;
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
  $('gt-tanks').textContent = t.tabTanks;
  $('gt-skins').textContent = t.tabSkins;
  $('btn-back-maps').textContent = t.back;
  $('btn-back-garage').textContent = t.back;
  $('btn-back-profile').textContent = t.back;
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

// ---------------------------------------------------------------- 3B garaj vitrini (döndürülebilir inceleme)
let showroomScene = null, showroomCam = null, showroomTurn = null, showroomTankMesh = null;
const showroom = { active: false, mode: 'tank', tankId: null, accId: '', rot: 0, vel: 0, elev: 0.42, dragging: false, lastX: 0, lastY: 0, centerY: 0.9, radius: 8 };
const SHOWROOM_PIVOT_Y = 0.5; // platform üstü — tank tabanı (y=0) buraya oturur
function ensureShowroom() {
  if (showroomScene) return;
  showroomScene = new THREE.Scene();
  showroomScene.background = new THREE.Color(0x0a0f16);
  showroomScene.environment = envTex; // metal/parlak kaplamalarda yansıma
  showroomCam = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 120);
  // zemin (gölge alan koyu disk)
  const floor = new THREE.Mesh(new THREE.CircleGeometry(16, 48), new THREE.MeshStandardMaterial({ color: 0x0e131a, roughness: 0.9, metalness: 0.1 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; showroomScene.add(floor);
  // döner platform + parlayan halka
  const base = new THREE.Mesh(new THREE.CylinderGeometry(3.1, 3.4, 0.5, 56), new THREE.MeshStandardMaterial({ color: 0x1a222c, roughness: 0.45, metalness: 0.7 }));
  base.position.y = 0.25; base.castShadow = base.receiveShadow = true; showroomScene.add(base);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(3.08, 0.05, 12, 64), new THREE.MeshStandardMaterial({ color: 0x1ec8b0, emissive: 0x1ec8b0, emissiveIntensity: 1.5, toneMapped: false }));
  ring.rotation.x = Math.PI / 2; ring.position.y = 0.5; showroomScene.add(ring);
  showroomTurn = new THREE.Group(); showroomTurn.position.y = SHOWROOM_PIVOT_Y; showroomScene.add(showroomTurn);
  // stüdyo ışıkları — hero aydınlatma
  const key = new THREE.DirectionalLight(0xffffff, 3.0); key.position.set(4, 9, 6); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024); const sc = key.shadow.camera; sc.left = -6; sc.right = 6; sc.top = 6; sc.bottom = -6; sc.near = 1; sc.far = 34; key.shadow.bias = -0.0006;
  showroomScene.add(key);
  showroomScene.add(new THREE.HemisphereLight(0x9fc0ff, 0x241d2e, 0.55));
  const rim = new THREE.DirectionalLight(0x66aaff, 2.4); rim.position.set(-6, 4, -7); showroomScene.add(rim);
  const accent = new THREE.PointLight(0xff9a3c, 26, 20, 2); accent.position.set(-4, 2.6, 3.5); showroomScene.add(accent);
  // sürükle-çevir kontrolleri (yalnızca vitrin açıkken)
  renderer.domElement.addEventListener('pointerdown', e => {
    if (!showroom.active) return;
    showroom.dragging = true; showroom.vel = 0; showroom.lastX = e.clientX; showroom.lastY = e.clientY;
    const h = $('sr-hint'); if (h) h.style.opacity = '0';
  });
  addEventListener('pointermove', e => {
    if (!showroom.active || !showroom.dragging) return;
    const dx = e.clientX - showroom.lastX, dy = e.clientY - showroom.lastY;
    showroom.lastX = e.clientX; showroom.lastY = e.clientY;
    const d = dx * 0.01; showroom.rot += d; showroom.vel = d;
    showroom.elev = Math.max(0.06, Math.min(1.15, showroom.elev + dy * 0.005));
  });
  addEventListener('pointerup', () => { showroom.dragging = false; });
  addEventListener('pointercancel', () => { showroom.dragging = false; });
}
function buildShowroomTank() {
  if (showroomTankMesh) {
    showroomTurn.remove(showroomTankMesh);
    if (showroomTankMesh.userData.accMesh) disposeSubtree(showroomTankMesh.userData.accMesh);
    showroomTankMesh.traverse(o => { if (o.isMesh && o.material && o.material.name === 'TankPaint') o.material.dispose(); });
  }
  const def = effTank(showroom.tankId);
  const m = buildTank(def);
  // seçili tankta oyuncunun kaplaması, diğerlerinde varsayılan görünüm
  applySkin(m, showroom.tankId === profile.selected ? profile.skin : 'default');
  applyAccessory(m, showroom.accId, def); // önizlenen/takılı aksesuar
  showroomTankMesh = m; showroomTurn.add(m);
  // kamerayı modelin boyutuna göre çerçevele
  const box = new THREE.Box3().setFromObject(m), size = new THREE.Vector3(); box.getSize(size);
  showroom.centerY = SHOWROOM_PIVOT_Y + (box.min.y + box.max.y) / 2;
  const portrait = innerWidth < innerHeight;
  showroom.radius = Math.max(size.x, size.z, size.y) * (portrait ? 2.5 : 1.95) + 1.6;
}
function frameShowroomCam() {
  const R = showroom.radius, e = showroom.elev, ty = showroom.centerY;
  showroomCam.aspect = innerWidth / innerHeight; showroomCam.updateProjectionMatrix();
  showroomCam.position.set(0, ty + R * Math.sin(e), R * Math.cos(e));
  showroomCam.lookAt(0, ty - R * 0.06, 0); // hedefi biraz aşağı al → tank çerçevede yukarı otursun (alt boşluğu stat paneli örter)
}
function updateShowroom(dt) {
  if (!showroom.dragging) {
    showroom.rot += showroom.vel; showroom.vel *= 0.90;
    if (Math.abs(showroom.vel) < 0.002) { showroom.vel = 0; showroom.rot += dt * 0.35; } // boşta yavaş oto-dönüş
  }
  showroomTurn.rotation.y = showroom.rot;
  frameShowroomCam();
}
function renderShowroomUI() {
  const t = T();
  $('sr-wallet').innerHTML = `🪙 ${profile.coins}&nbsp; 💎 ${profile.gems || 0}`;
  $('sr-hint').textContent = lang === 'tr' ? '↔ çevirmek için sürükle' : '↔ drag to rotate';
  const act = $('sr-action');
  if (showroom.mode === 'acc') return renderShowroomAcc(t, act);
  const base = tankById(showroom.tankId), def = effTank(showroom.tankId);
  const owned = profile.owned.includes(base.id), sel = profile.selected === base.id;
  $('sr-name').textContent = base.name[lang];
  const fireRate = 1 / def.cool;
  $('sr-stats').innerHTML =
    `<div class="cstat">${t.sHealth}${barHTML(def.health / STAT_MAX.health)}</div>` +
    `<div class="cstat">${t.sSpeed}${barHTML(def.speed / STAT_MAX.speed)}</div>` +
    `<div class="cstat">${t.sFire}${barHTML(fireRate / STAT_MAX.fire)}</div>`;
  act.className = 'mbtn sr-btn' + (base.glow ? ' gold' : '');
  if (sel) { act.textContent = t.selected; act.disabled = true; act.onclick = null; }
  else if (owned) {
    act.textContent = t.owned; act.disabled = false;
    act.onclick = () => { profile.selected = base.id; saveProfile(); setPlayerTank(); showroom.accId = profile.accessory; buildShowroomTank(); renderShowroomUI(); };
  } else {
    const isGem = !!base.gem;
    act.innerHTML = `${t.buy} · ${isGem ? '💎' + base.gem : '🪙' + base.price}`;
    act.disabled = isGem ? (profile.gems || 0) < base.gem : profile.coins < base.price;
    act.className = 'mbtn sr-btn gold';
    act.onclick = () => {
      if (isGem ? (profile.gems || 0) < base.gem : profile.coins < base.price) return;
      if (isGem) profile.gems -= base.gem; else profile.coins -= base.price;
      profile.owned.push(base.id); profile.selected = base.id;
      saveProfile(); sfxCoin(); setPlayerTank(); updateCoinBar(); showroom.accId = profile.accessory; buildShowroomTank(); renderShowroomUI();
    };
  }
}
function renderShowroomAcc(t, act) {
  const a = accById(showroom.accId); if (!a) return;
  const owned = (profile.accessories || []).includes(a.id), equipped = profile.accessory === a.id;
  const rar = RARITY[a.r];
  $('sr-name').textContent = `${a.icon} ${a.name[lang]}`;
  $('sr-stats').innerHTML = `<div class="cstat" style="text-align:center;color:${rar.col};font-weight:bold">${rar[lang]}</div>`;
  act.className = 'mbtn sr-btn' + (a.gem || a.r === 'e' ? ' gold' : '');
  if (equipped) {
    act.textContent = t.accRemove; act.disabled = false;
    act.onclick = () => { profile.accessory = ''; saveProfile(); setPlayerTank(); renderShowroomUI(); };
  } else if (owned) {
    act.textContent = t.accEquip; act.disabled = false;
    act.onclick = () => { profile.accessory = a.id; saveProfile(); setPlayerTank(); renderShowroomUI(); };
  } else {
    act.innerHTML = `${t.buy} · ${a.gem ? '💎' + a.gem : '🪙' + a.price}`;
    act.disabled = a.gem ? (profile.gems || 0) < a.gem : profile.coins < a.price;
    act.onclick = () => {
      if (a.gem) { if ((profile.gems || 0) < a.gem) return; profile.gems -= a.gem; } else { if (profile.coins < a.price) return; profile.coins -= a.price; }
      profile.accessories = profile.accessories || []; profile.accessories.push(a.id); profile.accessory = a.id;
      saveProfile(); sfxCoin(); updateCoinBar(); setPlayerTank(); renderShowroomUI();
    };
  }
}
function enterShowroomView() {
  showroom.active = true; showroom.rot = -0.5; showroom.vel = 0; showroom.elev = 0.42;
  buildShowroomTank();
  $('title').style.display = 'none'; $('submsg').style.display = 'none'; $('keys').style.display = 'none';
  $('coinbar').style.visibility = 'hidden'; $('langsw').style.visibility = 'hidden';
  const h = $('sr-hint'); if (h) h.style.opacity = '';
  showPanel('panel-showroom');
  renderShowroomUI();
}
async function openShowroom(tankId) {
  ensureShowroom();
  await ensureModel(tankById(tankId).model); // özel model tembel-yükle
  showroom.mode = 'tank'; showroom.tankId = tankId;
  showroom.accId = tankId === profile.selected ? profile.accessory : '';
  enterShowroomView();
}
function openAccShowroom(accId) {
  ensureShowroom();
  showroom.mode = 'acc'; showroom.tankId = profile.selected; showroom.accId = accId;
  enterShowroomView();
}
function closeShowroom() {
  showroom.active = false;
  $('title').style.display = ''; $('submsg').style.display = ''; $('keys').style.display = '';
  $('coinbar').style.visibility = ''; $('langsw').style.visibility = '';
  openGarage();
}

function renderGarage() {
  const t = T();
  $('tokenmachine').innerHTML = ''; // makine sadece kaplama sekmesinde
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
      `<div class="cswatch cswatch-3d" style="background:linear-gradient(135deg,${hex},#1a1a1a)"><span class="cs-3d">🔍 3B</span></div>` +
      `<div class="cstat">${t.sHealth}${barHTML(def.health / STAT_MAX.health)}</div>` +
      `<div class="cstat">${t.sSpeed}${barHTML(def.speed / STAT_MAX.speed)}</div>` +
      `<div class="cstat">${t.sFire}${barHTML(fireRate / STAT_MAX.fire)}</div>`;
    card.querySelector('.cswatch').onclick = () => openShowroom(base.id); // renk örneğine dokun → 3B inceleme
    const btn = document.createElement('button');
    btn.className = 'mbtn small' + (base.glow ? ' gold' : '');
    if (sel) { btn.textContent = t.selected; btn.disabled = true; }
    else if (owned) { btn.textContent = t.owned; btn.onclick = async () => { await ensureModel(base.model); profile.selected = base.id; saveProfile(); setPlayerTank(); renderGarage(); }; }
    else {
      const isGem = !!base.gem;
      btn.innerHTML = `${t.buy} · ${isGem ? '💎' + base.gem : '🪙' + base.price}`;
      btn.disabled = isGem ? (profile.gems || 0) < base.gem : profile.coins < base.price;
      btn.onclick = async () => {
        if (isGem ? (profile.gems || 0) < base.gem : profile.coins < base.price) return;
        await ensureModel(base.model);
        if (isGem) profile.gems -= base.gem; else profile.coins -= base.price;
        profile.owned.push(base.id); profile.selected = base.id;
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
let garageTab = 'tanks';
function renderGarageTabs() {
  $('gt-tanks').classList.toggle('on', garageTab === 'tanks');
  $('gt-skins').classList.toggle('on', garageTab === 'skins');
  $('gt-acc').classList.toggle('on', garageTab === 'acc');
  if (garageTab === 'tanks') renderGarage(); else if (garageTab === 'skins') renderSkins(); else renderAccessories();
}
function openGarage() {
  $('title').textContent = T().garage;
  $('submsg').textContent = `🪙 ${profile.coins}  ·  💎 ${profile.gems || 0}`;
  renderGarageTabs();
  showPanel('panel-garage');
}
function renderSkins() {
  const t = T();
  renderMachine();
  const wrap = $('cardwrap-garage');
  wrap.style.cssText = 'display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin:12px 8px';
  wrap.innerHTML = '';
  for (const s of SKINS) {
    const owned = s.id === 'default' || profile.skins.includes(s.id);
    const equipped = profile.skin === s.id;
    const card = document.createElement('div'); card.className = 'card' + (equipped ? ' sel' : '');
    const hex = s.color != null ? '#' + s.color.toString(16).padStart(6, '0') : '#5a6b3a';
    const glow = s.glow ? `box-shadow:inset 0 0 26px ${hex};` : '';
    const grad = s.metal ? `linear-gradient(135deg,rgba(255,255,255,.5),${hex},rgba(0,0,0,.4))` : `linear-gradient(135deg,${hex},#161616)`;
    card.innerHTML = `<div class="cname">${s.name[lang]}</div><div class="cswatch" style="background:${grad};${glow}"></div>`;
    const btn = document.createElement('button'); btn.className = 'mbtn small' + (s.glow || s.metal ? ' gold' : '');
    if (equipped) { btn.textContent = t.selected; btn.disabled = true; }
    else if (owned) { btn.textContent = t.owned; btn.onclick = () => { profile.skin = s.id; saveProfile(); setPlayerTank(); renderSkins(); }; }
    else {
      btn.innerHTML = `${t.buy} · 🪙${s.price}`;
      btn.disabled = profile.coins < s.price;
      btn.onclick = () => { if (profile.coins < s.price) return; profile.coins -= s.price; profile.skins.push(s.id); profile.skin = s.id; saveProfile(); sfxCoin(); setPlayerTank(); updateCoinBar(); renderSkins(); };
    }
    card.appendChild(btn); wrap.appendChild(card);
  }
}
function renderAccessories() {
  const t = T();
  $('tokenmachine').innerHTML = '';
  $('submsg').textContent = `🪙 ${profile.coins}  ·  💎 ${profile.gems || 0}`;
  const wrap = $('cardwrap-garage');
  wrap.style.cssText = 'display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin:12px 8px';
  wrap.innerHTML = '';
  // "aksesuar yok" (çıkar) kartı
  const none = document.createElement('div'); none.className = 'card' + (!profile.accessory ? ' sel' : '');
  none.innerHTML = `<div class="cname">${t.accNone}</div><div class="cswatch" style="background:linear-gradient(135deg,#2a3038,#14181e);display:flex;align-items:center;justify-content:center;font-size:26px">🚫</div>`;
  const nb = document.createElement('button'); nb.className = 'mbtn small';
  if (!profile.accessory) { nb.textContent = t.selected; nb.disabled = true; }
  else { nb.textContent = t.accRemove; nb.onclick = () => { profile.accessory = ''; saveProfile(); setPlayerTank(); renderAccessories(); }; }
  none.appendChild(nb); wrap.appendChild(none);
  for (const a of ACCESSORIES) {
    const owned = (profile.accessories || []).includes(a.id), equipped = profile.accessory === a.id;
    const rar = RARITY[a.r];
    const card = document.createElement('div'); card.className = 'card' + (equipped ? ' sel' : '');
    card.innerHTML = `<div class="cname" style="color:${rar.col}">${a.name[lang]}</div>` +
      `<div class="cswatch cswatch-3d" style="background:radial-gradient(circle at 50% 42%,#2b3440,#12161c);display:flex;align-items:center;justify-content:center;font-size:30px"><span>${a.icon}</span><span class="cs-3d">🔍 3B</span></div>`;
    card.querySelector('.cswatch').onclick = () => openAccShowroom(a.id); // ikona dokun → 3B önizleme (tanka takılı hali)
    const btn = document.createElement('button'); btn.className = 'mbtn small' + (a.gem || a.r === 'e' ? ' gold' : '');
    if (equipped) { btn.textContent = t.accRemove; btn.onclick = () => { profile.accessory = ''; saveProfile(); setPlayerTank(); renderAccessories(); }; }
    else if (owned) { btn.textContent = t.accEquip; btn.onclick = () => { profile.accessory = a.id; saveProfile(); setPlayerTank(); renderAccessories(); }; }
    else {
      btn.innerHTML = `${t.buy} · ${a.gem ? '💎' + a.gem : '🪙' + a.price}`;
      btn.disabled = a.gem ? (profile.gems || 0) < a.gem : profile.coins < a.price;
      btn.onclick = () => {
        if (a.gem) { if ((profile.gems || 0) < a.gem) return; profile.gems -= a.gem; } else { if (profile.coins < a.price) return; profile.coins -= a.price; }
        profile.accessories = profile.accessories || []; profile.accessories.push(a.id); profile.accessory = a.id;
        saveProfile(); sfxCoin(); updateCoinBar(); setPlayerTank(); renderAccessories();
      };
    }
    card.appendChild(btn); wrap.appendChild(card);
  }
}
function renderAchievements() {
  const wrap = $('achlist'); wrap.innerHTML = '';
  for (const a of ACHIEVEMENTS) {
    const done = profile.achieved.includes(a.id);
    const cur = Math.min(profile[a.stat] || 0, a.goal);
    const row = document.createElement('div'); row.className = 'achrow' + (done ? ' done' : '');
    row.innerHTML = `<div class="achtop">${done ? '✅ ' : ''}${a.name[lang]} <span class="achr">🪙${a.reward}</span></div>` +
      `<div class="achdesc">${a.desc[lang]} — ${cur}/${a.goal}</div>` +
      `<div class="abar"><i style="width:${Math.round(cur / a.goal * 100)}%"></i></div>`;
    wrap.appendChild(row);
  }
}
function openProfile() {
  checkAchievements();
  const t = T();
  $('title').textContent = t.profileTitle;
  $('submsg').textContent = `🪙 ${profile.coins} · 🏆 D.${profile.bestWave} · ⚔️ ${profile.kills} · 🥇 ${profile.wins} · 🎮 ${profile.games}`;
  renderAchievements();
  showPanel('panel-profile');
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
let lastSoloMap = 0;
function startSolo(mapIdx) {
  mode = 'solo'; state = 'play';
  lastSoloMap = mapIdx;
  resetBuild();
  profile.games++; saveProfile();
  closeNet();
  buildArena(mapIdx);
  buildEnvironment(mapIdx);
  msgEl.classList.add('hidden');
  $('topbar').style.visibility = 'visible';
  $('healthwrap').style.visibility = 'visible';
  clearEnemies(); clearBullets(); clearPowerups();
  wave = 1; score = 0; roundCoins = 0; powerupT = 6;
  setPlayerTank();
  player.health = player.maxHealth; player.alive = true; player.inv = 0;
  player.speedT = 0; player.tripleT = 0; player.shieldT = 0;
  player.vx = 0; player.vz = 0;
  shieldBubble.visible = false;
  const c = randOpenCell();
  player.x = c.x; player.z = c.z; player.a = 0;
  player.mesh.position.set(player.x, 0, player.z);
  player.mesh.visible = true;
  spawnEnemies(waveComposition(1));
  renderHealth(); updateHUD();
  banner(`${T().wave} 1`);
  showFtueHint();
  audio(); startEngine();
}
function gameOver() {
  state = 'over';
  clearPowerups();
  shieldBubble.visible = false;
  questProgress('wave', Math.max(0, wave - 1));
  submitScore(wave);
  const t = T();
  showHarvest({
    title: t.over, won: null,
    sub: t.overSub(score, wave, roundCoins),
    xpKind: 'wave', xpOpts: { wave }, coins: roundCoins,
    replay: () => startSolo(lastSoloMap),
  });
}

// ---------------------------------------------------------------- düello
let ws = null, duel = null, myRoomCode = null;
// tıklanabilir davet linki: <origin>/?j=KOD&m=MOD → arkadaş tek tıkla lobiye düşer (kod yazmaya gerek yok)
function shareLink() {
  if (!myRoomCode) return;
  const base = isNativeApp() ? ('https://' + REMOTE_HOST) : location.origin;
  const url = `${base}/?j=${myRoomCode}&m=${pendingMode}`;
  const t = T();
  track('share_click', { mode: pendingMode });
  if (navigator.share) navigator.share({ title: 'Tank Savaşı 3D', text: t.shareText, url }).catch(() => {});
  else if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(() => showToast(t.linkCopied)).catch(() => prompt('', url));
  else prompt('', url);
}
function autoJoinFromLink(code, mode) {
  pendingMode = mode; coopIsHost = false; coopCode = code;
  msgEl.classList.remove('hidden');
  if (mode === 'coop' || mode === 'team') { $('coopstatus').textContent = '...'; renderCoopMaps(); showPanel('panel-coop'); }
  else { duelStatusEl.textContent = '...'; showPanel('panel-duel'); }
  track('link_join', { mode });
  connectNet(() => netSend({ t: 'join', code }));
}
function clearDuelMeshes() {
  if (!duel) return;
  if (duel.remoteMesh) scene.remove(duel.remoteMesh);
  if (duel.remoteShield) scene.remove(duel.remoteShield);
  if (duel.nameLabel) scene.remove(duel.nameLabel);
}
function closeNet() {
  if (ws) { ws.onclose = null; ws.close(); ws = null; }
  clearDuelMeshes();
  duel = null;
  netYou = null; netMode = null; netBegun = false; netMapIdx = null;
  matchOverMode = null; myReady = false; peerReady = false;
}
function netSend(obj) { if (ws && ws.readyState === 1) ws.send(JSON.stringify(obj)); }
function connectNet(onOpen) {
  netYou = null; netMode = null; netBegun = false; netMapIdx = null;
  try { ws = new WebSocket(wsBase()); }
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
  const lobbyMode = (pendingMode === 'coop' || pendingMode === 'team');
  if (m.t === 'room') {
    myRoomCode = m.code;
    if (lobbyMode) { coopCode = m.code; coopYou = m.you; updateLobby(1, [m.you]); $('btn-coop-share').style.display = 'block'; }
    else { if (duel) duel.code = m.code; duelStatusEl.innerHTML = `${t.roomLbl} <span class="code">${m.code}</span><br>${t.waiting}`; $('btn-duel-share').style.display = 'inline-block'; }
  }
  else if (m.t === 'err') { (lobbyMode ? $('coopstatus') : duelStatusEl).textContent = t.joinFail; }
  else if (m.t === 'lobby') { updateLobby(m.count, m.players); }
  else if (m.t === 'start') {
    if (m.coop) { if (m.gm === 'team') beginTeam(m.you, m.players, m.map || 0); else beginCoop(m.you, m.players, m.map || 0); }
    else { netYou = m.you; if (netYou === 1) netSend({ t: 'gamemode', mode: pendingMode, map: duelMap }); tryBegin(); }
  }
  else if (m.t === 'gamemode') { netMode = m.mode; netMapIdx = (m.map != null ? m.map : 0); tryBegin(); }
  else if (mode === 'coop') { handleCoopNet(m); }
  else if (mode === 'team') { handleTeamNet(m); }
  else if (!duel) { return; }
  else if (m.t === 'skin') { applyRemoteSkin(m.color, m.scale, m.name, m.acc); }
  else if (m.t === 'ball') { if (ball && !isAuthority) { ball.tx = m.x; ball.tz = m.z; ball.mesh.rotation.x = m.rx; ball.mesh.rotation.z = m.rz; } }
  else if (m.t === 'goal') { if (ball) { applyGoal(m.g1, m.g2, m.scorer); if (m.done) { ball.over = true; endBall(); } } }
  else if (m.t === 'state') {
    duel.tx = m.x; duel.tz = m.z; duel.ta = m.a; duel.shieldOn = m.sh;
    if (m.alive && !duel.remoteAlive) { duel.remoteAlive = true; duel.remoteMesh.visible = true; }
  }
  else if (m.t === 'fire') {
    if (m.trip) { fire({ x: m.x, z: m.z, a: m.a, bspeed: m.bs }, -0.17); fire({ x: m.x, z: m.z, a: m.a, bspeed: m.bs }, 0); fire({ x: m.x, z: m.z, a: m.a, bspeed: m.bs }, 0.17); }
    else fire({ x: m.x, z: m.z, a: m.a, bspeed: m.bs });
  }
  else if (m.t === 'pu_spawn') { addPowerup(m.type, m.x, m.z, m.id); }
  else if (m.t === 'pu_take') { const i = powerups.findIndex(p => p.id === m.id); if (i >= 0) { scene.remove(powerups[i].mesh); powerups.splice(i, 1); } }
  else if (m.t === 'thit') { duelReceiveHit(); }
  else if (m.t === 'die') {
    duel.remoteAlive = false; duel.remoteMesh.visible = false;
    explode(duel.tx, 1.2, duel.tz, true);
    duel.myKills++; profile.kills++; saveProfile(); updateHUD();
    killFeed(`<b>${profile.name}</b> ⚔️ ${duel.oppName || '?'}`);
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
function applyRemoteSkin(color, scale, name, acc) {
  if (!duel) return;
  scene.remove(duel.remoteMesh);
  duel.remoteMesh = buildTank({ color, scale: scale || 1 });
  applyAccessory(duel.remoteMesh, acc); // rakibin aksesuarı (base tank → turretTop 1.5)
  duel.remoteMesh.position.set(duel.x, 0, duel.z);
  duel.remoteMesh.rotation.y = duel.a;
  duel.remoteMesh.visible = duel.remoteAlive;
  scene.add(duel.remoteMesh);
  if (name) {
    duel.oppName = name;
    if (!duel.nameLabel) duel.nameLabel = makeNameLabel(name); else setLabelText(duel.nameLabel, name);
    updateHUD();
  }
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
  setPlayerTank(DUEL_TANK);
  const code = duel && duel.code;
  clearDuelMeshes(); // rematch: önceki maçın rakip mesh'lerini sil (yoksa üst üste birikir)
  const SX = cellX(4), SZ = cellZ(11);
  duel = { you, code, myKills: 0, myDeaths: 0, over: false, sendT: 0,
           tx: 0, tz: 0, ta: 0, remoteAlive: true, remoteMesh: buildTank({ color: 0xa03428, scale: 1 }), remoteShield: makeShieldBubble() };
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
  const skinCol = profile.skin !== 'default' ? skinById(profile.skin).color : st.color;
  netSend({ t: 'skin', color: skinCol, scale: st.scale, name: profile.name, acc: profile.accessory });
  audio(); startEngine();
}
// rakip "vuruldun" (thit) dediğinde: ölümü BEN onaylarım (kalkan/dokunulmazlık yerel otoriteli)
function duelReceiveHit() {
  if (!duel || !player.alive || player.inv > 0) return;
  if (player.shieldT > 0) { player.inv = 0.3; explode(player.x, 1.0, player.z, false); sfxBounce(); return; }
  player.alive = false; player.mesh.visible = false;
  explode(player.x, 1.2, player.z, true); hitFlash();
  duel.myDeaths++; netSend({ t: 'die' }); updateHUD();
  killFeed(`<b>${duel.oppName || '?'}</b> ⚔️ ${profile.name}`);
  if (duel.over) return;
  setTimeout(() => {
    if (!duel || duel.over || mode !== 'duel') return;
    const cell = randOpenCell(duel.tx, duel.tz, 16);
    player.x = cell.x; player.z = cell.z; player.vx = 0; player.vz = 0;
    player.a = headingTo(cell.x, cell.z, duel.tx, duel.tz);
    player.alive = true; player.inv = 1.5; player.mesh.visible = true;
  }, 2000);
}
// ---------------------------------------------------------------- BOTLAR: hızlı oyna (bota karşı 1v1, tamamen yerel)
const BOT_NAMES = ['Kaplan', 'Yıldırım', 'Panzer', 'Volkan', 'Şahin', 'Bora', 'Demir', 'Atlas', 'Zafer', 'Kobra', 'Tayfun', 'Ejder', 'Fırtına', 'Çelik', 'Reis', 'Alpay', 'Doruk', 'Yağız'];
function botName() { return BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)]; }
function startBotDuel() {
  mode = 'duel'; state = 'play';
  isAuthority = true;
  profile.games++; saveProfile();
  closeNet();
  buildArena(duelMap);
  msgEl.classList.add('hidden');
  $('topbar').style.visibility = 'visible';
  $('healthwrap').style.visibility = 'hidden';
  clearEnemies(); clearBullets(); clearPowerups();
  powerupT = 6; puIdCounter = 0;
  player.speedT = 0; player.tripleT = 0; player.shieldT = 0; shieldBubble.visible = false;
  setPlayerTank(DUEL_TANK);
  clearDuelMeshes();
  const SX = cellX(4), SZ = cellZ(11), nm = botName();
  const rm = buildTank({ color: 0xc23a2a, scale: 1 }); scene.add(rm);
  rm.position.set(-SX, 0, -SZ); rm.rotation.y = Math.PI;
  duel = {
    you: 1, code: null, myKills: 0, myDeaths: 0, over: false, bot: true,
    x: -SX, z: -SZ, a: Math.PI, remoteAlive: true, remoteMesh: rm, oppName: nm, nameLabel: makeNameLabel(nm),
    botE: { x: -SX, z: -SZ, a: Math.PI, cool: 1.6, thinkT: 0, turn: 2.2, speed: 7.0, keep: 10, sight: 55, type: 'normal', bspeed: 24, mesh: rm, baseScale: 1, alive: true, respawn: 0 },
  };
  player.x = SX; player.z = SZ; player.a = 0; player.vx = 0; player.vz = 0;
  player.alive = true; player.inv = 1.0;
  player.mesh.position.set(SX, 0, SZ); player.mesh.visible = true;
  updateHUD();
  banner(T().duelStart);
  showFtueHint();
  audio(); startEngine();
}
function updateDuelBot(dt) {
  const b = duel.botE;
  if (!b.alive) {
    b.respawn -= dt;
    if (b.respawn <= 0) {
      const c = randOpenCell(player.x, player.z, 16);
      b.x = c.x; b.z = c.z; b.a = headingTo(c.x, c.z, player.x, player.z); b.cool = 1.2;
      b.alive = true; duel.remoteAlive = true; duel.remoteMesh.visible = true;
      duel.remoteMesh.position.set(b.x, 0, b.z);
    }
    duel.x = b.x; duel.z = b.z;
    if (duel.nameLabel) duel.nameLabel.visible = false;
    return;
  }
  updateEnemy(b, dt, player);
  duel.x = b.x; duel.z = b.z; duel.a = b.a;
  if (duel.nameLabel) { duel.nameLabel.visible = true; duel.nameLabel.position.set(b.x, 3.4, b.z); }
}
function botDuelBotDies() {
  const b = duel.botE;
  b.alive = false; b.respawn = 1.4;
  duel.remoteAlive = false; duel.remoteMesh.visible = false;
  explode(duel.x, 1.2, duel.z, true);
  duel.myKills++; profile.kills++; saveProfile(); updateHUD();
  killFeed(`<b>${profile.name}</b> ⚔️ ${duel.oppName}`);
  if (duel.myKills >= KILL_TARGET) duelBotEnd(true);
}
function botDuelPlayerDies() {
  player.alive = false; player.mesh.visible = false;
  explode(player.x, 1.2, player.z, true); hitFlash();
  duel.myDeaths++; updateHUD();
  killFeed(`<b>${duel.oppName}</b> ⚔️ ${profile.name}`);
  if (duel.over) return;
  setTimeout(() => {
    if (!duel || duel.over || mode !== 'duel') return;
    const cell = randOpenCell(duel.x, duel.z, 16);
    player.x = cell.x; player.z = cell.z; player.vx = 0; player.vz = 0;
    player.a = headingTo(cell.x, cell.z, duel.x, duel.z);
    player.alive = true; player.inv = 1.5; player.mesh.visible = true;
  }, 2000);
}
function duelBotEnd(won) {
  if (!duel || duel.over) return;
  duel.over = true;
  if (won) { profile.wins++; saveProfile(); questProgress('win', 1); }
  const t = T();
  banner(won ? t.youWin : t.youLose);
  if (won) stingWin(); else stingLose();
  const mk = duel.myKills, md = duel.myDeaths;
  setTimeout(() => {
    clearDuelMeshes(); duel = null;
    showHarvest({
      title: won ? t.youWin : t.youLose, won,
      sub: t.duelOverSub(mk, md),
      xpKind: 'pvp', xpOpts: { kills: mk, won }, coins: 0,
      replay: () => startBotDuel(),
    });
  }, 1800);
}
function duelEnd(won) {
  if (!duel || duel.over) return;
  duel.over = true;
  if (won) { profile.wins++; saveProfile(); questProgress('win', 1); }
  grantMatchXp('pvp', { kills: duel.myKills, won });
  const t = T(), a = duel.myKills, b = duel.myDeaths;
  banner(won ? t.youWin : t.youLose);
  if (won) stingWin(); else stingLose();
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
  setPlayerTank(DUEL_TANK);
  const code = duel && duel.code;
  clearDuelMeshes(); // rematch: önceki maçın rakip mesh'lerini sil (yoksa üst üste birikir)
  duel = { you, code, over: false, sendT: 0, tx: 0, tz: 0, ta: 0, x: 0, z: 0, a: 0,
           remoteAlive: true, remoteMesh: buildTank({ color: 0xa03428, scale: 1 }) };
  scene.add(duel.remoteMesh);
  ball = { x: 0, z: 0, vx: 0, vz: 0, tx: 0, tz: 0, g1: 0, g2: 0, over: false, sendT: 0, mesh: makeBall() };
  resetBallPositions();
  player.alive = true; player.mesh.visible = true;
  updateHUD();
  banner(T().ballBtn);
  const st = player.stat;
  const skinCol = profile.skin !== 'default' ? skinById(profile.skin).color : st.color;
  netSend({ t: 'skin', color: skinCol, scale: st.scale, name: profile.name, acc: profile.accessory });
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
  stingGoal();
  explode(ball.x, 1.2, ball.z, true);
  if (!isAuthority) { ball.vx = 0; ball.vz = 0; setTimeout(() => { if (ball && !ball.over) resetBallPositions(); }, 900); }
}
function endBall() {
  const t = T();
  const winner = ball.g1 > ball.g2 ? 1 : 2;
  const won = winner === duel.you;
  ball.over = true;
  if (won) { profile.wins++; saveProfile(); questProgress('win', 1); }
  grantMatchXp('ball', { won });
  banner(won ? t.youWin : t.youLose);
  if (won) stingWin(); else stingLose();
  const a = duel.you === 1 ? ball.g1 : ball.g2;
  const b = duel.you === 1 ? ball.g2 : ball.g1;
  setTimeout(() => showRematch('ball', won ? t.youWin : t.youLose, t.duelOverSub(a, b)), 1900);
}

// ---------------------------------------------------------------- kooperatif
function clearCoop() {
  if (coop) for (const rm of coop.remotes.values()) { scene.remove(rm.mesh); if (rm.shield) scene.remove(rm.shield); if (rm.nameLabel) scene.remove(rm.nameLabel); }
  $('coophud').style.display = 'none';
  for (const ce of coopEnemies.values()) scene.remove(ce);
  coopEnemies.clear();
  clearEnemies(); clearPowerups();
  coop = null;
}
function placeCoopSpawns() {
  const posOf = pid => { const [c, r] = COOP_SPAWNS[(pid - 1) % 4]; return { x: cellX(c), z: cellZ(r) }; };
  const me = posOf(coop.you);
  player.x = me.x; player.z = me.z; player.a = 0; player.inv = 1.5;
  player.vx = 0; player.vz = 0;
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
  buildEnvironment(mapIdx);
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
    coop.remotes.set(pid, { mesh: rmMesh, shield: makeShieldBubble(), nameLabel: makeNameLabel('...'), name: '', x: 0, z: 0, tx: 0, tz: 0, a: 0, ta: 0, alive: true, hp: player.maxHealth, inv: 0, shieldOn: false });
  }
  placeCoopSpawns();
  netSend({ t: 'pinfo', name: profile.name, acc: profile.accessory });
  updateCoopRoster();
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
  let downed = false, nm = '';
  if (pid === coop.you) {
    if (player.shieldT > 0) { player.inv = 0.3; explode(player.x, 1, player.z, false); sfxBounce(); return; }
    player.inv = 1.0; player.health--; renderHealth(); hitFlash(); explode(player.x, 1, player.z, false);
    if (player.health <= 0) { player.alive = false; player.mesh.visible = false; explode(player.x, 1.2, player.z, true); downed = true; nm = profile.name; }
    netSend({ t: 'phealth', pid, hp: player.health, alive: player.alive });
  } else {
    const rm = coop.remotes.get(pid); if (!rm) return;
    rm.inv = 1.0; rm.hp--; explode(rm.x, 1, rm.z, false);
    if (rm.hp <= 0) { rm.alive = false; rm.mesh.visible = false; explode(rm.x, 1.2, rm.z, true); downed = true; nm = rm.name || ('Oyuncu' + pid); }
    netSend({ t: 'phealth', pid, hp: rm.hp, alive: rm.alive });
  }
  if (downed) { killFeed(`☠️ <b>${nm}</b>`); netSend({ t: 'down', name: nm }); updateCoopRoster(); }
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
  const bonus = wave * 15; roundCoins += bonus; addCoins(bonus);
  netSend({ t: 'wave', n: wave });
  netSend({ t: 'phealth', pid: coop.you, hp: player.health, alive: true });
  for (const [pid, rm] of coop.remotes) netSend({ t: 'phealth', pid, hp: rm.hp, alive: true });
  banner(wave % 5 === 0 ? T().bossW : `${T().wave} ${wave}  +🪙${bonus}`);
  if (wave % 5 === 0) stingBoss(); else stingWave();
  spawnEnemies(waveComposition(wave, coop.players.length));
}
function coopGameOver() {
  if (coop) coop.over = true;
  questProgress('wave', Math.max(0, wave - 1));
  submitScore(wave);
  const t = T(), cCoins = roundCoins;
  clearCoop(); closeNet(); updateStats();
  showHarvest({ title: t.over, won: null, sub: t.overSub(score, wave, cCoins), xpKind: 'wave', xpOpts: { wave }, coins: cCoins, replay: null });
}
function coopPeerLeft(who) {
  if (!coop) return;
  const rm = coop.remotes.get(who);
  if (rm) { scene.remove(rm.mesh); if (rm.shield) scene.remove(rm.shield); if (rm.nameLabel) scene.remove(rm.nameLabel); coop.remotes.delete(who); }
  coop.players = coop.players.filter(p => p !== who);
  updateCoopRoster();
  banner(T().peerLeft);
  if (who === coop.hostPid && !isAuthority) setTimeout(() => { if (mode === 'coop') coopGameOver(); }, 900);
  else coopCheckOver();
}
function handleCoopNet(m) {
  if (!coop) return;
  if (m.t === 'pinfo') {
    const rm = coop.remotes.get(m.from);
    if (rm) { rm.name = m.name || ('Oyuncu' + m.from); setLabelText(rm.nameLabel, rm.name); if (m.acc) applyAccessory(rm.mesh, m.acc); updateCoopRoster(); }
  }
  else if (m.t === 'state') {
    const rm = coop.remotes.get(m.from);
    if (rm) { rm.tx = m.x; rm.tz = m.z; rm.ta = m.a; rm.shieldOn = m.sh; if (!isAuthority) rm.alive = m.alive; rm.mesh.visible = rm.alive; }
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
  else if (m.t === 'down') { killFeed(`☠️ <b>${m.name || '?'}</b>`); updateCoopRoster(); }
  else if (m.t === 'barrel') { const cv = covers.find(c => c.id === m.id); if (cv) destroyCover(cv, true); }
  else if (m.t === 'coopover') { coopGameOver(); }
  else if (m.t === 'peerleft') { coopPeerLeft(m.who); }
}
function updateCoop(dt) {
  coop.sendT -= dt;
  if (coop.sendT <= 0) { coop.sendT = 0.05; netSend({ t: 'state', x: player.x, z: player.z, a: player.a, alive: player.alive, sh: player.shieldT > 0 }); }
  coop.rosterT = (coop.rosterT || 0) - dt;
  if (coop.rosterT <= 0) { coop.rosterT = 0.4; updateCoopRoster(); }
  const k = 1 - Math.exp(-12 * dt);
  for (const rm of coop.remotes.values()) {
    rm.x += (rm.tx - rm.x) * k; rm.z += (rm.tz - rm.z) * k; rm.a += angNorm(rm.ta - rm.a) * k;
    rm.mesh.position.set(rm.x, 0, rm.z); rm.mesh.rotation.y = rm.a; rm.mesh.visible = rm.alive;
    if (rm.nameLabel) { rm.nameLabel.visible = rm.alive; if (rm.alive) rm.nameLabel.position.set(rm.x, 3.4, rm.z); }
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

// ---------------------------------------------------------------- 2v2 takım savaşı
function paintTank(mesh, color) {
  mesh.traverse(o => {
    if (o.isMesh && o.material && o.material.name === 'TankPaint') {
      o.material = o.material.clone();
      o.material.color.setHex(color);
      o.material.emissiveIntensity = 0;
    }
  });
}
function clearTeam() {
  if (team) for (const rm of team.remotes.values()) { scene.remove(rm.mesh); if (rm.shield) scene.remove(rm.shield); if (rm.nameLabel) scene.remove(rm.nameLabel); }
  $('coophud').style.display = 'none';
  clearEnemies(); clearPowerups();
  team = null;
}
function teamSpawnOf(pid) {
  const [c, r] = TEAM_SPAWNS[team.teamOf[pid]][team.slotOf[pid]];
  return { x: cellX(c), z: cellZ(r) };
}
function placeTeamSelf(inv) {
  const p = teamSpawnOf(team.you);
  player.x = p.x; player.z = p.z; player.vx = 0; player.vz = 0;
  player.a = headingTo(p.x, p.z, 0, 0);
  player.alive = true; player.inv = inv; player.mesh.visible = true;
  player.mesh.position.set(player.x, 0, player.z);
  updateTeamRoster();
}
function beginTeam(you, players, mapIdx) {
  mode = 'team'; state = 'play';
  isAuthority = (you === players[0]);
  buildArena(mapIdx);
  msgEl.classList.add('hidden');
  $('topbar').style.visibility = 'visible';
  $('healthwrap').style.visibility = 'hidden';
  clearEnemies(); clearBullets(); clearPowerups();
  powerupT = 6; puIdCounter = 0;
  setPlayerTank(DUEL_TANK);
  player.speedT = 0; player.tripleT = 0; player.shieldT = 0; shieldBubble.visible = false;
  // takım/slot atamaları: players sırasına göre çift index=takım0 (kırmızı), tek=takım1 (mavi)
  const teamOf = {}, slotOf = {}, cnt = [0, 0];
  players.forEach((pid, i) => { const ti = i % 2; teamOf[pid] = ti; slotOf[pid] = cnt[ti]++; });
  const code = team && team.code;
  clearTeam();
  team = { you, code, players: players.slice(), hostPid: players[0], teamOf, slotOf,
           mine: teamOf[you], scores: [0, 0], over: false, sendT: 0, remotes: new Map() };
  player.team = team.mine; player.pid = you;
  paintTank(player.mesh, TEAM_COLORS[team.mine]);
  for (const pid of players) if (pid !== you) {
    const ti = teamOf[pid];
    const rmMesh = buildTank(DUEL_TANK); paintTank(rmMesh, TEAM_COLORS[ti]); scene.add(rmMesh);
    const sp = teamSpawnOf(pid);
    const rm = { mesh: rmMesh, shield: makeShieldBubble(), nameLabel: makeNameLabel('...'), name: '',
      team: ti, x: sp.x, z: sp.z, tx: sp.x, tz: sp.z, a: 0, ta: 0, alive: true, inv: 0, shieldOn: false };
    rm.mesh.position.set(sp.x, 0, sp.z);
    team.remotes.set(pid, rm);
  }
  placeTeamSelf(1.5);
  netSend({ t: 'pinfo', name: profile.name, acc: profile.accessory });
  profile.games++; saveProfile();
  updateHUD(); updateTeamRoster();
  banner(T().teamStart);
  audio(); startEngine();
}
function updateTeam(dt) {
  team.sendT -= dt;
  if (team.sendT <= 0) { team.sendT = 0.05; netSend({ t: 'state', x: player.x, z: player.z, a: player.a, alive: player.alive, sh: player.shieldT > 0 }); }
  const k = 1 - Math.exp(-12 * dt);
  for (const rm of team.remotes.values()) {
    rm.x += (rm.tx - rm.x) * k; rm.z += (rm.tz - rm.z) * k; rm.a += angNorm(rm.ta - rm.a) * k;
    rm.mesh.position.set(rm.x, 0, rm.z); rm.mesh.rotation.y = rm.a; rm.mesh.visible = rm.alive;
    if (rm.nameLabel) { rm.nameLabel.visible = rm.alive; if (rm.alive) rm.nameLabel.position.set(rm.x, 3.4, rm.z); }
    if (rm.inv > 0) rm.inv -= dt;
  }
}
function teamNameOf(pid) {
  if (pid === team.you) return profile.name;
  const rm = team.remotes.get(pid);
  return rm ? (rm.name || ('Oyuncu' + pid)) : '?';
}
// bir ölüm işlenir (skoru herkeste bir kez sayar; kurban lokalde, diğerleri 'tdie' mesajında)
function onTeamKill(byPid, diedPid) {
  const kt = team.teamOf[byPid];
  if (kt != null) team.scores[kt]++;
  if (diedPid === team.you) {
    // ben öldüm (rakip atıcı bildirdi, ben onayladım)
    if (player.alive) {
      player.alive = false; player.mesh.visible = false; explode(player.x, 1.2, player.z, true); hitFlash();
      setTimeout(() => { if (team && !team.over && mode === 'team') placeTeamSelf(2.0); }, 2000);
    }
  } else {
    const rm = team.remotes.get(diedPid);
    if (rm && rm.alive) { rm.alive = false; rm.mesh.visible = false; explode(rm.x, 1.2, rm.z, true); }
  }
  const dt = team.teamOf[diedPid];
  const col = dt != null ? TEAM_COLOR_HEX[dt] : '#fff';
  killFeed(`<b>${teamNameOf(byPid)}</b> ⚔️ <span style="color:${col}">${teamNameOf(diedPid)}</span>`);
  updateHUD(); updateTeamRoster();
  if (!team.over && kt != null && team.scores[kt] >= TEAM_TARGET) { team.over = true; teamEnd(kt === team.mine); }
}
// rakip "vuruldun" (thit) dediğinde: ölümü BEN onaylarım (kalkan/dokunulmazlık yerel otoriteli)
function teamReceiveHit(byPid) {
  if (!team || !player.alive || player.inv > 0) return;
  if (player.shieldT > 0) { player.inv = 0.3; explode(player.x, 1.0, player.z, false); sfxBounce(); return; }
  netSend({ t: 'tdie', me: team.you, by: byPid });
  onTeamKill(byPid, team.you);
}
function teamEnd(won) {
  if (won) { profile.wins++; saveProfile(); questProgress('win', 1); }
  const t = T();
  banner(won ? t.teamWin : t.teamLose);
  if (won) stingWin(); else stingLose();
  const sub = `<span style="color:${TEAM_COLOR_HEX[0]}">${t.teamRed} ${team.scores[0]}</span> — <span style="color:${TEAM_COLOR_HEX[1]}">${team.scores[1]} ${t.teamBlue}</span>`;
  const kills = team.scores[team.mine];
  setTimeout(() => {
    closeNet(); clearTeam(); updateStats();
    showHarvest({ title: won ? t.teamWin : t.teamLose, won, sub, xpKind: 'pvp', xpOpts: { kills, won }, coins: 0, replay: null });
  }, 1900);
}
function teamToMenu(title, sub) {
  state = 'over';
  $('title').textContent = title; $('submsg').innerHTML = sub;
  showPanel('panel-main'); msgEl.classList.remove('hidden'); $('topbar').style.visibility = 'hidden';
  closeNet(); clearTeam();
  updateCoinBar(); updateStats();
}
function teamPeerLeft() {
  if (!team || team.over) return;
  team.over = true;
  const t = T();
  banner(t.peerLeft);
  setTimeout(() => teamToMenu(t.title, t.peerLeft), 1400);
}
function updateTeamRoster() {
  const el = $('coophud');
  if (mode !== 'team' || !team || state !== 'play') { if (el.style.display !== 'none') { el.style.display = 'none'; el.innerHTML = ''; } return; }
  el.style.display = 'block';
  const rows = [{ name: profile.name, alive: player.alive, team: team.mine, pid: team.you }];
  for (const [pid, rm] of team.remotes) rows.push({ name: rm.name || ('Oyuncu' + pid), alive: rm.alive, team: rm.team, pid });
  rows.sort((a, b) => a.team - b.team || a.pid - b.pid);
  el.innerHTML = rows.map(r => `<div class="crow" style="color:${TEAM_COLOR_HEX[r.team]}">${r.alive ? '🟢' : '⚫'} ${r.name}${r.pid === team.you ? ' •' : ''}</div>`).join('');
}
function handleTeamNet(m) {
  if (!team) return;
  if (m.t === 'pinfo') {
    const rm = team.remotes.get(m.from);
    if (rm) { rm.name = m.name || ('Oyuncu' + m.from); setLabelText(rm.nameLabel, rm.name); updateTeamRoster(); }
  } else if (m.t === 'state') {
    const rm = team.remotes.get(m.from);
    if (rm) { const was = rm.alive; rm.tx = m.x; rm.tz = m.z; rm.ta = m.a; rm.shieldOn = m.sh; rm.alive = m.alive; if (was !== m.alive) { rm.mesh.visible = m.alive; updateTeamRoster(); } }
  } else if (m.t === 'fire') {
    const o = { x: m.x, z: m.z, a: m.a, bspeed: m.bs, team: team.teamOf[m.from], pid: m.from };
    if (m.trip) { fire(o, -0.17, true); fire(o, 0, true); fire(o, 0.17, true); }
    else fire(o, 0, true);
  } else if (m.t === 'thit') { if (m.target === team.you) teamReceiveHit(m.by); }
  else if (m.t === 'tdie') { onTeamKill(m.by, m.me); }
  else if (m.t === 'pu_spawn') { addPowerup(m.type, m.x, m.z, m.id); }
  else if (m.t === 'pu_take') { const i = powerups.findIndex(p => p.id === m.id); if (i >= 0) { scene.remove(powerups[i].mesh); powerups.splice(i, 1); } }
  else if (m.t === 'peerleft') { teamPeerLeft(); }
}

// ---------------------------------------------------------------- menü olayları
$('lang-tr').addEventListener('click', () => { lang = 'tr'; applyLang(); if ($('panel-garage').classList.contains('show')) renderGarage(); if ($('panel-maps').classList.contains('show')) renderMaps(); });
$('lang-en').addEventListener('click', () => { lang = 'en'; applyLang(); if ($('panel-garage').classList.contains('show')) renderGarage(); if ($('panel-maps').classList.contains('show')) renderMaps(); });
$('btn-quickplay').addEventListener('click', () => { track('quickplay_click'); duelMap = 0; startBotDuel(); });
$('res-again').addEventListener('click', () => { const fn = harvestReplay; harvestReplay = null; maybeInterstitial(); if (fn) { track('retry_click', { mode: matchMode }); fn(); } else openMenu(); });
$('res-menu').addEventListener('click', () => { harvestReplay = null; openMenu(); });
$('res-rewarded').addEventListener('click', async () => {
  const rb = $('res-rewarded'); if (rb.disabled || !harvestReward) return;
  rb.disabled = true; rb.textContent = T().adLoading;
  track('ad_watch', { placement: 'harvest' });
  const ok = await Platform.rewarded('harvest');
  if (ok && harvestReward) {
    rewardedTimes.push(Date.now());
    grantXp(harvestReward.xp); grantSeasonXp(harvestReward.xp);
    if (harvestReward.coins) addCoins(harvestReward.coins);
    $('res-rewards').innerHTML = `+${harvestReward.xp * 2} XP` + (harvestReward.coins ? ` &nbsp;·&nbsp; +🪙${harvestReward.coins * 2}` : '') + ` <b style="color:#7dff9b">x2</b>`;
    updateCoinBar(); updateLevelBar();
    sfxPower(); haptic('HEAVY');
    rb.textContent = T().rewardedGot;
  } else { rb.disabled = false; rb.textContent = T().rewardedBtn; }
});
$('btn-quests').addEventListener('click', () => { const t = T(); $('title').textContent = t.questsTitle; $('submsg').textContent = t.questsSub; renderQuests(); showPanel('panel-quests'); });
$('btn-back-quests').addEventListener('click', openMenu);
$('btn-lb').addEventListener('click', () => { const t = T(); $('title').textContent = t.lbTitle; $('submsg').textContent = ''; showPanel('panel-lb'); renderLeaderboard('day'); });
$('btn-season').addEventListener('click', () => { $('title').textContent = ''; $('submsg').textContent = ''; renderSeason(); showPanel('panel-season'); });
$('btn-back-season').addEventListener('click', openMenu);
$('lbt-day').addEventListener('click', () => renderLeaderboard('day'));
$('lbt-week').addEventListener('click', () => renderLeaderboard('week'));
$('btn-back-lb').addEventListener('click', openMenu);
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
$('btn-duel').addEventListener('click', () => { pendingMode = 'duel'; myRoomCode = null; $('btn-duel-share').style.display = 'none'; duelStatusEl.textContent = ''; $('title').textContent = T().duel; $('submsg').textContent = T().duelSub(KILL_TARGET); $('duelmapsrow').style.display = 'flex'; renderDuelMaps(); showPanel('panel-duel'); });
$('btn-ball').addEventListener('click', () => { pendingMode = 'ball'; myRoomCode = null; $('btn-duel-share').style.display = 'none'; duelStatusEl.textContent = ''; $('title').textContent = T().ballBtn; $('submsg').textContent = T().ballSub(BALL_TARGET); $('duelmapsrow').style.display = 'none'; showPanel('panel-duel'); });
$('btn-garage').addEventListener('click', openGarage);
$('gt-tanks').addEventListener('click', () => { garageTab = 'tanks'; renderGarageTabs(); });
$('gt-skins').addEventListener('click', () => { garageTab = 'skins'; renderGarageTabs(); });
$('gt-acc').addEventListener('click', () => { garageTab = 'acc'; renderGarageTabs(); });
$('statsline').addEventListener('click', openProfile);
$('playername').value = profile.name;
$('playername').addEventListener('input', e => {
  const v = e.target.value.trim().slice(0, 12);
  profile.name = v || ('Oyuncu' + Math.floor(Math.random() * 900 + 100));
  saveProfile();
});
$('btn-back-profile').addEventListener('click', openMenu);
$('btn-back-maps').addEventListener('click', openMenu);
$('btn-back-garage').addEventListener('click', openMenu);
$('sr-back').addEventListener('click', closeShowroom);
$('btn-back-duel').addEventListener('click', () => { closeNet(); openMenu(); });

// kooperatif menü
function updateLobby(count, players) {
  const t = T();
  const code = coopCode || '';
  const isTeam = pendingMode === 'team';
  const need = isTeam ? 4 : 2;
  $('coopstatus').innerHTML = `${t.roomLbl} <span class="code">${code}</span><br>${count}/4 ${t.playersW}` +
    (isTeam && count < 4 ? `<br>${t.teamNeed}` : '') +
    (coopIsHost ? '' : `<br>${t.waitHost}`);
  $('btn-coop-start').style.display = (coopIsHost && count >= need) ? 'inline-block' : 'none';
}
$('btn-coop').addEventListener('click', () => {
  pendingMode = 'coop'; coopCode = null; coopIsHost = false; myRoomCode = null;
  $('title').textContent = T().coopBtn; $('submsg').textContent = T().coopSub;
  $('coopstatus').textContent = ''; $('btn-coop-start').style.display = 'none'; $('btn-coop-share').style.display = 'none';
  renderCoopMaps(); showPanel('panel-coop');
});
$('btn-team').addEventListener('click', () => {
  pendingMode = 'team'; coopCode = null; coopIsHost = false; myRoomCode = null;
  $('title').textContent = T().teamBtn; $('submsg').textContent = T().teamSub;
  $('coopstatus').textContent = ''; $('btn-coop-start').style.display = 'none'; $('btn-coop-share').style.display = 'none';
  renderCoopMaps(); showPanel('panel-coop');
});
$('btn-coop-create').addEventListener('click', () => {
  coopIsHost = true;
  $('coopstatus').textContent = '...';
  connectNet(() => netSend({ t: 'create', cap: 4 }));
});
$('btn-coop-join').addEventListener('click', () => {
  const code = $('coopcode').value.trim().toUpperCase();
  if (code.length !== 4) { $('coopstatus').textContent = T().joinFail; return; }
  coopIsHost = false; coopCode = code;
  $('coopstatus').textContent = '...';
  connectNet(() => netSend({ t: 'join', code }));
});
$('btn-coop-start').addEventListener('click', () => { netSend({ t: 'startgame', map: duelMap, gm: pendingMode }); });
$('btn-coop-share').addEventListener('click', shareLink);
$('btn-duel-share').addEventListener('click', shareLink);
$('btn-back-coop').addEventListener('click', () => { closeNet(); openMenu(); });
$('btn-rematch').addEventListener('click', () => {
  if (myReady || !matchOverMode) return;
  track('retry_click', { mode: matchOverMode });
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
  $('set-music').textContent = `${t.setMusic}: ${settings.music ? t.onW : t.offW}`;
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
$('set-sound').addEventListener('click', () => { settings.muted = !settings.muted; saveSettings(); updateSettingsLabels(); updateMusicGain(); if (!settings.muted) sfxCoin(); });
$('set-music').addEventListener('click', () => { settings.music = !settings.music; saveSettings(); updateSettingsLabels(); if (settings.music) startMusic(); else updateMusicGain(); });
$('set-quality').addEventListener('click', () => { settings.quality = settings.quality === 'low' ? 'high' : 'low'; saveSettings(); applyQuality(); updateSettingsLabels(); });
$('set-resume').addEventListener('click', closeSettings);
$('set-close').addEventListener('click', closeSettings);
$('set-quit').addEventListener('click', () => { paused = false; $('settings').classList.add('hidden'); closeNet(); clearBallMode(); clearCoop(); clearTeam(); buildArena(0); openMenu(); });
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

// ilk kullanıcı etkileşiminde ses bağlamını + müziği başlat (tarayıcı kuralı)
let audioUnlocked = false;
function unlockAudio() {
  if (audioUnlocked) return; audioUnlocked = true;
  try { startMusic(); } catch (e) { }
}
addEventListener('pointerdown', unlockAudio);
addEventListener('keydown', unlockAudio);

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
  if (e.hitT > 0) { e.hitT -= dt; e.mesh.scale.setScalar((e.baseScale || 1) * (1 + Math.max(0, e.hitT) * 1.8)); }
  e.mesh.position.set(e.x, 0, e.z);
  e.mesh.rotation.y = e.a;
}

// ---------------------------------------------------------------- ana döngü
const clock = new THREE.Clock();
applyLang();
openMenu();
checkDaily();
// davet linkiyle gelindiyse (?j=KOD&m=MOD) doğrudan lobiye katıl
{
  const params = new URLSearchParams(location.search);
  const jc = (params.get('j') || '').trim().toUpperCase();
  const jm = params.get('m');
  const validMode = ['coop', 'team', 'duel', 'ball'].includes(jm) ? jm : 'coop';
  if (/^[A-Z0-9]{4}$/.test(jc)) {
    history.replaceState(null, '', location.pathname); // linki URL'den temizle (yeniden yüklemede tekrar katılmasın)
    autoJoinFromLink(jc, validMode);
  } else if ((profile.games || 0) === 0) {
    // FTUE: ilk kez gelen oyuncu menü yerine DOĞRUDAN dalga moduna düşer (GDD: ≤5sn oyna, girişsiz, kontrolleri güvenle öğren)
    setTimeout(() => { if (state === 'menu' && !ws) { startSolo(0); banner(T().ftueWelcome); } }, 600);
  }
}

// ---------------------------------------------------------------- maç-içi build (Diep tarzı, her maç sıfırlanır — solo)
// (durum değişkenleri yukarıda team/duel yanında bildirildi — TDZ için)
function resetBuild() { matchBuild = { fire: 0, armor: 0, speed: 0, dmg: 0, multi: 0 }; buildChoosing = false; }
function buildOn() { return mode === 'solo' && matchBuild; } // şimdilik sadece solo (coop maç-içi build v1.x)
function bFire() { return buildOn() ? Math.max(0.4, 1 - 0.11 * matchBuild.fire) : 1; }
function bSpeed() { return buildOn() ? (1 + 0.10 * matchBuild.speed) : 1; }
function bDmg() { return buildOn() ? matchBuild.dmg : 0; }
function bMulti() { return !!(buildOn() && matchBuild.multi > 0); }
const BUILD_OPTS = [
  { id: 'fire', icon: '🔥', name: { tr: 'Hızlı Ateş', en: 'Rapid Fire' }, desc: { tr: 'Atış hızı +%11', en: '+11% fire rate' } },
  { id: 'armor', icon: '🛡️', name: { tr: 'Zırh', en: 'Armor' }, desc: { tr: '+1 can', en: '+1 HP' } },
  { id: 'speed', icon: '💨', name: { tr: 'Hız', en: 'Speed' }, desc: { tr: 'Hareket +%10', en: '+10% move' } },
  { id: 'dmg', icon: '💥', name: { tr: 'Güç', en: 'Power' }, desc: { tr: 'Mermi hasarı +1', en: '+1 damage' } },
  { id: 'multi', icon: '🔱', name: { tr: 'Çoklu Atış', en: 'Multi Shot' }, desc: { tr: 'Üçlü atış', en: 'Triple shot' } },
];
function offerBuildChoice(onDone) {
  if (!matchBuild) resetBuild();
  buildOnDone = onDone;
  const pool = BUILD_OPTS.filter(o => !(o.id === 'multi' && matchBuild.multi > 0)).slice();
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = pool[i]; pool[i] = pool[j]; pool[j] = t; }
  const picks = pool.slice(0, 3), tt = T();
  $('build-title').textContent = tt.buildTitle;
  $('build-cards').innerHTML = picks.map(o =>
    `<button class="buildcard" data-id="${o.id}"><div class="bc-ic">${o.icon}</div><div class="bc-nm">${o.name[lang]}</div><div class="bc-ds">${o.desc[lang]}</div></button>`).join('');
  for (const b of $('build-cards').children) b.onclick = () => pickBuild(b.dataset.id);
  $('buildchoice').classList.remove('hidden');
  buildChoosing = true;
}
function pickBuild(id) {
  matchBuild[id] = (matchBuild[id] || 0) + 1;
  if (id === 'armor') { player.maxHealth++; player.health++; renderHealth(); }
  sfxPower(); haptic('LIGHT');
  $('buildchoice').classList.add('hidden');
  buildChoosing = false;
  track('build_pick', { id });
  const fn = buildOnDone; buildOnDone = null; if (fn) fn();
}

// oto-kalite: oyun sırasında FPS ölçülür; sürekli düşükse (zayıf cihaz) kalite bir kez otomatik düşürülür
let perfAccum = 0, perfFrames = 0, perfChecked = false;
function monitorPerf(dt, active) {
  if (perfChecked || settings.quality === 'low') { perfChecked = true; return; }
  if (!active) { perfAccum = 0; perfFrames = 0; return; } // sadece oyunda ölç
  perfAccum += dt; perfFrames++;
  if (perfAccum >= 3.5) {
    const fps = perfFrames / perfAccum;
    if (fps < 40) {
      settings.quality = 'low'; saveSettings(); applyQuality();
      updateSettingsLabels(); showToast(T().autoLow, 3500);
      perfChecked = true;
    } else if (fps >= 50) perfChecked = true; // yeterince akıcı, artık bakma
    perfAccum = 0; perfFrames = 0;
  }
}

// analitik: durum geçişlerinden gameplay_start / match_end üret (tek yerden tüm modlar)
let lastTrackedState = 'menu', matchMode = '', matchStartT = 0, killsBaseline = profile.kills || 0, firstKillSent = false, matchStartKills = 0;
function trackTransitions() {
  if (state !== lastTrackedState) {
    if (state === 'play') { matchMode = mode; matchStartT = clock.elapsedTime; matchStartKills = profile.kills || 0; track('gameplay_start', { mode }); }
    else if (lastTrackedState === 'play') {
      track('match_end', { mode: matchMode, dur: Math.round(clock.elapsedTime - matchStartT) });
      questProgress('match', 1);                                   // görev: maç oyna
      questProgress('kill', (profile.kills || 0) - matchStartKills); // görev: tank patlat
    }
    lastTrackedState = state;
  }
  if (!firstKillSent && state === 'play' && (profile.kills || 0) > killsBaseline) { firstKillSent = true; track('first_kill', { mode: matchMode }); }
}

function tick() {
  requestAnimationFrame(tick);
  const dt = Math.min(clock.getDelta(), 0.05);
  monitorPerf(dt, state === 'play' && !paused);
  trackTransitions();

  if (showroom.active) { updateShowroom(dt); renderer.render(showroomScene, showroomCam); return; }

  if (state === 'play' && !paused && !buildChoosing) {
    if (player.alive) {
      player.cool -= dt; player.inv -= dt;
      if (player.speedT > 0) player.speedT -= dt;
      if (player.tripleT > 0) player.tripleT -= dt;
      if (player.shieldT > 0) player.shieldT -= dt;
      let turn = (keys.KeyA || keys.ArrowLeft ? 1 : 0) - (keys.KeyD || keys.ArrowRight ? 1 : 0) + touchCtl.turn;
      let move = (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0) + touchCtl.move;
      turn = Math.max(-1, Math.min(1, turn)); move = Math.max(-1, Math.min(1, move));
      player.a += turn * player.stat.turn * dt;
      player.speed = move * player.stat.speed * (player.speedT > 0 ? 1.6 : 1) * bSpeed();
      const dvx = fwdX(player.a) * player.speed, dvz = fwdZ(player.a) * player.speed;
      const onIce = hazards.length && hazardAt(player.x, player.z, 'ice');
      if (onIce) {
        const k = 1 - Math.exp(-2.2 * dt); // buzda momentum → kayma
        player.vx += (dvx - player.vx) * k;
        player.vz += (dvz - player.vz) * k;
      } else { player.vx = dvx; player.vz = dvz; }
      player.x += player.vx * dt;
      player.z += player.vz * dt;
      const pos = { x: player.x, z: player.z };
      circleVsWalls(pos, TANK_R);
      player.x = pos.x; player.z = pos.z;

      let others;
      if (mode === 'duel') others = (duel && duel.remoteAlive ? [{ x: duel.x, z: duel.z, solid: false }] : []);
      else if (mode === 'coop') others = [...coop.remotes.values()].filter(r => r.alive).map(r => ({ x: r.x, z: r.z, solid: false })).concat(isAuthority ? enemies : []);
      else if (mode === 'team') others = [...team.remotes.values()].filter(r => r.alive).map(r => ({ x: r.x, z: r.z, solid: false }));
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
        if (player.tripleT > 0 || bMulti()) { fire(player, -0.17); fire(player, 0); fire(player, 0.17); }
        else fire(player);
        player.cool = player.stat.cool * bFire();
        if (mode === 'duel' || mode === 'ball' || mode === 'coop' || mode === 'team') netSend({ t: 'fire', x: player.x, z: player.z, a: player.a, bs: player.stat.bspeed, trip: player.tripleT > 0 });
      }
      if (Math.abs(player.speed) > 3) { dustT -= dt; if (dustT <= 0) { dustT = 0.06; spawnDust(player.x - fwdX(player.a) * 1.3, player.z - fwdZ(player.a) * 1.3); } }
      if (player.maxHealth > 2 && player.health <= 2) { smokeT -= dt; if (smokeT <= 0) { smokeT = 0.16; spawnSmoke(player.x, player.z); } }
      const bob = Math.abs(Math.sin(clock.elapsedTime * 16)) * 0.05 * Math.min(1, Math.abs(player.speed) / 6);
      player.mesh.position.set(player.x, bob, player.z);
      player.mesh.rotation.y = player.a;
      if (playerTurret) { recoil = Math.max(0, recoil - dt * 0.8); playerTurret.position.z = turretBaseZ + recoil; }
    }

    if (mode === 'solo' || mode === 'duel' || mode === 'coop') updatePowerups(dt);
    updateHazards(dt);

    if (mode === 'coop' && coop) updateCoop(dt);
    if (mode === 'team' && team) updateTeam(dt);

    if (mode === 'solo') {
      for (const e of enemies) updateEnemy(e, dt);
    } else if (duel && duel.bot) {
      updateDuelBot(dt);
    } else if (duel) {
      const k = 1 - Math.exp(-12 * dt);
      duel.x += (duel.tx - duel.x) * k;
      duel.z += (duel.tz - duel.z) * k;
      duel.a += angNorm(duel.ta - duel.a) * k;
      duel.remoteMesh.position.set(duel.x, 0, duel.z);
      duel.remoteMesh.rotation.y = duel.a;
      if (duel.nameLabel) { duel.nameLabel.visible = duel.remoteAlive; if (duel.remoteAlive) duel.nameLabel.position.set(duel.x, 3.4, duel.z); }
      duel.sendT -= dt;
      if (duel.sendT <= 0) { duel.sendT = 0.05; netSend({ t: 'state', x: player.x, z: player.z, a: player.a, alive: player.alive, sh: player.shieldT > 0 }); }
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
      if (!dead) b.mesh.rotation.y = Math.atan2(-b.vx, -b.vz);

      if (!dead && covers.length) {
        for (const cv of covers) {
          if (Math.hypot(b.mesh.position.x - cv.x, b.mesh.position.z - cv.z) < cv.r + 0.25) {
            explode(b.mesh.position.x, 1.0, b.mesh.position.z, false);
            dead = true;
            if (mode === 'solo' || (mode === 'coop' && isAuthority)) damageCover(cv);
            break;
          }
        }
      }

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
                e.hp -= 1 + bDmg();
                if (e.hp <= 0) {
                  e.alive = false; explode(e.x, 1.0, e.z, true); scene.remove(e.mesh);
                  popFloater(e.x, 2.2, e.z, '+' + e.score, e.type === 'boss' ? '#ff7a3a' : '#ffe86a');
                  netSend({ t: 'ekill', id: e.id });
                  score += e.score; roundCoins += e.coins; profile.kills++; addCoins(e.coins); updateHUD();
                } else { e.hitT = 0.14; explode(b.mesh.position.x, 1.0, b.mesh.position.z, false); }
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
      if (!dead && mode === 'team' && team && b.owner === team.you) {
        // ATICI OTORİTELİ: sadece KENDİ mermim, gördüğüm rakip konumuna göre isabet tespit eder.
        // Kurbana "vuruldun" (thit) yollarım; o kalkan/dokunulmazlık kontrolüyle ölümü onaylar.
        const bx = b.mesh.position.x, bz = b.mesh.position.z;
        for (const [pid, rm] of team.remotes) {
          if (rm.alive && rm.team !== team.mine && Math.hypot(bx - rm.x, bz - rm.z) < 1.9) {
            explode(bx, 1.0, bz, false); dead = true;
            netSend({ t: 'thit', target: pid, by: team.you });
            break;
          }
        }
      }
      // BOT DÜELLO: tamamen yerel → isabet doğrudan (interpolasyon yok, favor-the-shooter gerekmez)
      if (!dead && mode === 'duel' && duel && duel.bot) {
        const bx = b.mesh.position.x, bz = b.mesh.position.z;
        if (b.fromPlayer) {
          if (duel.remoteAlive && duel.botE.alive && Math.hypot(bx - duel.x, bz - duel.z) < 1.75) {
            explode(bx, 1.0, bz, false); dead = true; botDuelBotDies();
          }
        } else if (player.alive && player.inv <= 0 && Math.hypot(bx - player.x, bz - player.z) < 1.75) {
          dead = true;
          if (player.shieldT > 0) { player.inv = 0.3; explode(bx, 1.0, bz, false); sfxBounce(); }
          else botDuelPlayerDies();
        }
      }
      if (!dead && mode !== 'coop' && mode !== 'team' && b.fromPlayer) {
        if (mode === 'solo') {
          for (const e of enemies) {
            const hr = 1.4 * (e.type === 'boss' ? 1.7 : 1);
            if (e.alive && Math.hypot(b.mesh.position.x - e.x, b.mesh.position.z - e.z) < hr) {
              e.hp -= 1 + bDmg();
              if (e.hp <= 0) {
                e.alive = false; explode(e.x, 1.0, e.z, true); scene.remove(e.mesh);
                popFloater(e.x, 2.2, e.z, '+' + e.score, e.type === 'boss' ? '#ff7a3a' : '#ffe86a');
                score += e.score; roundCoins += e.coins; profile.kills++; addCoins(e.coins); updateHUD();
              } else { e.hitT = 0.14; explode(b.mesh.position.x, 1.0, b.mesh.position.z, false); }
              dead = true; break;
            }
          }
        } else if (mode === 'duel' && duel && !duel.bot && duel.remoteAlive && Math.hypot(b.mesh.position.x - duel.x, b.mesh.position.z - duel.z) < 1.9) {
          // ATICI OTORİTELİ: gördüğüm rakip konumuna isabet → "vuruldun" (thit) yolla; ölümü o onaylar
          explode(b.mesh.position.x, 1.0, b.mesh.position.z, false); dead = true;
          netSend({ t: 'thit' });
        }
      } else if (!dead && mode === 'solo' && !b.fromPlayer && player.alive && player.inv <= 0) {
        if (Math.hypot(b.mesh.position.x - player.x, b.mesh.position.z - player.z) < 1.5) {
          dead = true;
          if (player.shieldT > 0) {
            player.inv = 0.3;
            explode(b.mesh.position.x, 1.0, b.mesh.position.z, false);
            sfxBounce();
          }
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
        const bonus = wave * 15; roundCoins += bonus; addCoins(bonus);
        updateHUD();
        banner(wave % 5 === 0 ? T().bossW : `${T().wave} ${wave}  +🪙${bonus}`);
        if (wave % 5 === 0) stingBoss(); else stingWave();
        player.health = Math.min(player.maxHealth, player.health + 1);
        renderHealth();
        // her 5. dalga temizlendikten sonra maç-içi yükseltme seçimi (Diep tarzı)
        if ((wave - 1) % 5 === 0 && wave >= 6) offerBuildChoice(() => spawnEnemies(waveComposition(wave)));
        else spawnEnemies(waveComposition(wave));
      }
    }
  }

  updateParticles(dt);
  updateFlashes(dt);
  updateFloaters(dt);
  if (toastT > 0) { toastT -= dt; if (toastT <= 0) $('toast').style.opacity = '0'; }
  statsCheckT -= dt; if (statsCheckT <= 0) { statsCheckT = 1.2; checkAchievements(); checkFtue(); }
  if (ftueHintOn && state === 'play') {
    ftueHintT -= dt;
    const anyInput = keys.KeyW || keys.KeyS || keys.KeyA || keys.KeyD || keys.ArrowUp || keys.ArrowDown || keys.ArrowLeft || keys.ArrowRight || keys.Space || touchCtl.move || touchCtl.turn || touchCtl.fire;
    if (anyInput || ftueHintT <= 0) hideFtueHint();
  }

  const bossE = (state === 'play' && (mode === 'solo' || (mode === 'coop' && isAuthority))) ? enemies.find(e => e.type === 'boss' && e.alive) : null;
  updateBossBar(bossE);
  updateBuffs();
  drawMinimap();
  updateEngine();

  // kalkan baloncukları (yerel + uzak oyuncular)
  shieldMat.opacity = 0.18 + Math.abs(Math.sin(clock.elapsedTime * 5)) * 0.12;
  const showLocal = state === 'play' && player.alive && player.shieldT > 0;
  shieldBubble.visible = showLocal;
  if (showLocal) shieldBubble.position.set(player.x, 1.0, player.z);
  if (mode === 'duel' && duel && duel.remoteShield) {
    const on = state === 'play' && duel.remoteAlive && duel.shieldOn;
    duel.remoteShield.visible = on;
    if (on) duel.remoteShield.position.set(duel.x, 1.0, duel.z);
  }
  if (mode === 'coop' && coop) for (const rm of coop.remotes.values()) {
    if (rm.shield) {
      const on = state === 'play' && rm.alive && rm.shieldOn;
      rm.shield.visible = on;
      if (on) rm.shield.position.set(rm.x, 1.0, rm.z);
    }
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
{ const ls = document.getElementById('loading'); if (ls) { ls.classList.add('gone'); setTimeout(() => ls.remove(), 600); } }
// analitik: yükleme tamam + oturum çıkışı
track('load_end', { touch: IS_TOUCH, lang, native: isNativeApp() });
addEventListener('pagehide', () => track('quit', { atState: state, mode: matchMode }));
nativeInit(); // native app cilası (splash gizle, tam ekran, geri tuşu, haptik)
