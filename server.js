// Tank Savaşı 3D — statik dosya + düello odası (WebSocket) sunucusu
const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const ROOT = __dirname;
const PORT = process.env.PORT || 8734;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.glb': 'model/gltf-binary',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.hdr': 'application/octet-stream',
  '.woff2': 'font/woff2',
  '.md': 'text/plain; charset=utf-8',
};
// yalnızca yayın dosyaları sunulur (kod/.git/konfig sızıntısına karşı allowlist)
const ALLOW_FILES = new Set(['/index.html', '/main.js', '/sw.js', '/manifest.json', '/privacy.html', '/CREDITS.md', '/playable.html']); // playable.html: oynanabilir reklam demosu (tools/playable/dist kopyası)
const ALLOW_DIRS = ['/assets/', '/libs/'];

// ---- LANSMAN P0-12: koruma katmanı ----
// /stats yalnız STATS_KEY ile (env yoksa kapalı) — KPI panosu herkese açık olmasın
const STATS_KEY = process.env.STATS_KEY || '';
if (!STATS_KEY) console.warn('[server] STATS_KEY yok: /stats kapalı (Render ortam değişkeni ekle)');
// IP başına dakikalık istek sınırı (bellek içi; /ev 60, /lb 10) — lider tablosu/KPI kirletmesine karşı basit kapı
const rl = new Map();
function clientIp(req) { return String((req.headers['x-forwarded-for'] || '').split(',')[0].trim() || (req.socket && req.socket.remoteAddress) || '?'); }
function rateOk(req, key, limit) {
  const k = key + ':' + clientIp(req), now = Date.now(); let e = rl.get(k);
  if (!e || now - e.t > 60000) { e = { t: now, n: 0 }; rl.set(k, e); }
  return ++e.n <= limit;
}
setInterval(() => { const now = Date.now(); for (const [k, e] of rl) if (now - e.t > 120000) rl.delete(k); }, 300000).unref();
// takma ad: tek temizleyici (kontrol karakteri/HTML işareti yok, boşluklar tek, 14 karakter) + küçük küfür listesi → 'Oyuncu'
const BAD_ROOTS = ['amk', 'amq', 'aq', 'sik', 'got', 'pic', 'orospu', 'oruspu', 'yarrak', 'yarak', 'ibne', 'pezevenk', 'kahpe', 'serefsiz', 'gavat', 'tasak', 'sikik', 'sikim', 'sikt', 'fuck', 'shit', 'bitch', 'cunt', 'dick', 'pussy', 'nigg', 'faggot', 'whore', 'slut', 'asshole', 'cock', 'porn', 'sex'];
const normName = n => String(n).toLowerCase().replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/0/g, 'o').replace(/1/g, 'i').replace(/3/g, 'e').replace(/4/g, 'a').replace(/5/g, 's').replace(/7/g, 't').replace(/[^a-z]+/g, ' ').trim();
function isBadName(n) { const t = normName(n), toks = t.split(' '); return BAD_ROOTS.some(r => r.length <= 3 ? toks.includes(r) : t.includes(r)); }
function cleanName(name, fallback = 'Oyuncu') {
  const n = String(name || '').normalize('NFKC').replace(/[\x00-\x1f<>&"']/g, '').replace(/\s+/g, ' ').trim().slice(0, 14);
  return (!n || isBadName(n)) ? fallback : n;
}

// ---- opsiyonel KALICI depo (P1): Render'da PostgreSQL oluşturup DATABASE_URL bağlanırsa
// lider tablosu + günlük tekil oyuncular (D1/D7) restart'a dayanıklı olur; yoksa in-memory sürer ----
let pgPool = null;
if (process.env.DATABASE_URL) {
  try {
    const { Pool } = require('pg');
    pgPool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }, max: 3 });
    pgPool.query('CREATE TABLE IF NOT EXISTS lb (period text, cid text, name text, score int, PRIMARY KEY (period, cid))').then(() => pgPool.query('ALTER TABLE lb ADD COLUMN IF NOT EXISTS av text, ADD COLUMN IF NOT EXISTS ti text')).catch(() => {})
      .then(() => pgPool.query('CREATE TABLE IF NOT EXISTS days (day text, pid text, PRIMARY KEY (day, pid))'))
      .then(() => console.log('[PG] kalıcı depo hazır'))
      .catch(e => { console.error('[PG] init hatası:', e.message); pgPool = null; });
    setInterval(() => { // 30 günden eski kayıtları buda
      if (!pgPool) return;
      const cut = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
      pgPool.query("DELETE FROM lb WHERE period LIKE 'd:%' AND period < $1", ['d:' + cut]).catch(() => {});
      pgPool.query('DELETE FROM days WHERE day < $1', [cut]).catch(() => {});
    }, 6 * 3600e3);
  } catch (e) { console.error('[PG] pg modülü yok:', e.message); }
}

// ---- basit anonim analitik (huni ölçümü; in-memory + konsol; Render loglarında görünür) ----
const stats = { started: Date.now(), events: {}, modes: {}, reasons: {}, sessions: {}, days: {}, byPlace: {}, coinSpend: {}, gemSpend: {} };
const pick = (o, keys) => Object.fromEntries(keys.map(k => [k, o[k] || 0]));
function trackEvent(m) {
  if (!m || !m.ev) return;
  stats.events[m.ev] = (stats.events[m.ev] || 0) + 1;
  // FAZ1 KPI: yerleşim/lavabo kırılımları (küçük, sınırlı anahtar kümeleri)
  if (/^(rewarded_offer|rewarded_done|rewarded_fail)$/.test(m.ev) && typeof m.place === 'string') { const k = m.ev + ':' + m.place.slice(0, 12); stats.byPlace[k] = (stats.byPlace[k] || 0) + 1; }
  if (m.ev === 'coin_spend' && typeof m.sink === 'string' && Number.isFinite(+m.n)) { const k = m.sink.slice(0, 12); stats.coinSpend[k] = (stats.coinSpend[k] || 0) + Math.min(1e6, Math.max(0, +m.n)); }
  if (m.ev === 'gem_spend' && typeof m.sink === 'string' && Number.isFinite(+m.n)) { const k = m.sink.slice(0, 12); stats.gemSpend[k] = (stats.gemSpend[k] || 0) + Math.min(1e5, Math.max(0, +m.n)); }
  if (m.mode) stats.modes[m.mode] = (stats.modes[m.mode] || 0) + 1;
  if (m.ev === 'match_end' && typeof m.reason === 'string') { const r = m.reason.slice(0, 16); stats.reasons[r] = (stats.reasons[r] || 0) + 1; }
  if (m.sid) stats.sessions[m.sid] = Date.now();
  // kalıcı oyuncu kimliği (pid) → günlük tekil oyuncu kümeleri: D1/D7 retention bu sayımlardan okunur
  if (m.pid && typeof m.pid === 'string') {
    const day = new Date().toISOString().slice(0, 10);
    (stats.days[day] || (stats.days[day] = new Set())).add(m.pid.slice(0, 40));
    if (pgPool) pgPool.query('INSERT INTO days(day, pid) VALUES($1, $2) ON CONFLICT DO NOTHING', [day, m.pid.slice(0, 40)]).catch(() => {});
    const dk = Object.keys(stats.days);
    if (dk.length > 45) for (const k of dk.sort().slice(0, dk.length - 45)) delete stats.days[k]; // en eski günleri buda
  }
  // eski oturumları buda (bellek sızıntısı önle)
  const keys = Object.keys(stats.sessions);
  if (keys.length > 5000) for (const k of keys.slice(0, 1000)) delete stats.sessions[k];
  console.log('[EV]', m.ev, m.mode || '', (m.sid || '').slice(0, 6), m.dur != null ? m.dur + 's' : '');
}

// ---- lider tablosu (günlük + haftalık, in-memory; gece/hafta sonu sıfırlanır) ----
// Not: Render restart'ta sıfırlanır (kalıcı için Postgres — GDD sonrası). Günlük tablo zaten her gece sıfırlanır.
const lb = { day: { key: '', m: {} }, week: { key: '', m: {} }, speed: { key: '', m: {} } }; // speed: haftalık en hızlı zafer (sn, küçük iyi)
function lbKeys() {
  const d = new Date();
  const day = d.toISOString().slice(0, 10);
  const oneJan = new Date(d.getFullYear(), 0, 1);
  const week = d.getFullYear() + '-W' + Math.ceil(((d - oneJan) / 86400000 + oneJan.getDay() + 1) / 7);
  return { day, week };
}
function lbRoll() {
  const k = lbKeys();
  if (lb.day.key !== k.day) { lb.day.key = k.day; lb.day.m = {}; }
  if (lb.week.key !== k.week) { lb.week.key = k.week; lb.week.m = {}; }
  if (lb.speed.key !== k.week) { lb.speed.key = k.week; lb.speed.m = {}; }
}
// FAZ1 (plan B-5): hız tablosu — zafer süresi (60..3600 sn), cid başına en iyi (küçük)
// KOZMETİK 2.0 (sunucu): lider tablosunda avatar + unvan — yalnız allowlist'teki değerler saklanır (metin enjeksiyonu yok)
const AV_OK = new Set(['🪖', '🦊', '🐺', '🦅', '🤖', '💀', '🐉', '🏆', '🌟']);
const TI_OK = new Set(['dragonlord', 'fleetlord', 'collector', 'veteran', 'painter']);
const vanity = m => ({ av: AV_OK.has(m && m.av) ? m.av : '', ti: TI_OK.has(m && m.ti) ? m.ti : '' });
function lbSubmitSpeed(cid, name, time, v) {
  if (!cid || typeof cid !== 'string' || cid.length > 40) return;
  lbRoll();
  time = time | 0; if (time < 60 || time > 3600) return;
  name = cleanName(name);
  v = v || { av: '', ti: '' };
  const e = lb.speed.m[cid]; if (!e || time < e.score) lb.speed.m[cid] = { name, score: time, av: v.av, ti: v.ti };
  if (pgPool) {
    const k = lbKeys();
    pgPool.query('INSERT INTO lb(period, cid, name, score, av, ti) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT (period, cid) DO UPDATE SET score = LEAST(lb.score, EXCLUDED.score), name = EXCLUDED.name, av = EXCLUDED.av, ti = EXCLUDED.ti', ['s:' + k.week, cid, name, time, v.av, v.ti]).catch(() => {});
  }
}
function lbSubmit(cid, name, score, v) {
  if (!cid || typeof cid !== 'string' || cid.length > 40) return;
  lbRoll();
  // makul üst sınır: dalga skoru gerçekçi aralıkta kalsın (istemci doğrulaması yok — tam çözüm sunucu-otoriteli koşu)
  score = Math.max(0, Math.min(200, score | 0));
  name = cleanName(name);
  v = v || { av: '', ti: '' };
  for (const b of [lb.day, lb.week]) { const e = b.m[cid]; if (!e || score > e.score) b.m[cid] = { name, score, av: v.av, ti: v.ti }; }
  if (pgPool) {
    const k = lbKeys();
    for (const p of ['d:' + k.day, 'w:' + k.week])
      pgPool.query('INSERT INTO lb(period, cid, name, score, av, ti) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT (period, cid) DO UPDATE SET score = GREATEST(lb.score, EXCLUDED.score), name = EXCLUDED.name, av = EXCLUDED.av, ti = EXCLUDED.ti', [p, cid, name, score, v.av, v.ti]).catch(() => {});
  }
}
// pg varsa kalıcı tablodan oku (restart'a dayanıklı), yoksa bellekten
async function lbTopAny(period) {
  if (pgPool) {
    const k = lbKeys(), key = period === 'speed' ? 's:' + k.week : period === 'week' ? 'w:' + k.week : 'd:' + k.day;
    try { const r = await pgPool.query(`SELECT name, score, av, ti FROM lb WHERE period = $1 ORDER BY score ${period === 'speed' ? 'ASC' : 'DESC'} LIMIT 20`, [key]); return r.rows; }
    catch (e) { /* pg sorunuysa belleğe düş */ }
  }
  return lbTop(period);
}
function lbTop(period) {
  lbRoll();
  const b = period === 'speed' ? lb.speed : period === 'week' ? lb.week : lb.day;
  return Object.values(b.m).sort((a, c) => period === 'speed' ? a.score - c.score : c.score - a.score).slice(0, 20);
}

// ---- hafta sonu etkinlikleri (FAZ1 plan B-1): Cuma 18:00 → Pazar 24:00 TR (UTC+3); şablon = ISO hafta % 2 (doubleGold / bossRush)
const EVENT_TYPES = ['doubleGold', 'bossRush', 'speedRace', 'collect']; // 4 haftalık rotasyon (istemci eventSpec ile aynı)
function activeEvent() {
  if (process.env.EVENT_OFF === '1') return { active: false };
  const now = Date.now(), tr = new Date(now + 3 * 3600e3); // TR duvar saati
  const dow = tr.getUTCDay(), h = tr.getUTCHours();
  const inWindow = (dow === 5 && h >= 18) || dow === 6 || dow === 0;
  const force = process.env.EVENT_FORCE && EVENT_TYPES.includes(process.env.EVENT_FORCE) ? process.env.EVENT_FORCE : null;
  if (!inWindow && !force) return { active: false, next: nextFriday(tr) };
  // haftanın Cuma'sı → hafta numarası (Pazar da aynı etkinliğe ait)
  const fri = new Date(tr); fri.setUTCDate(tr.getUTCDate() - ((dow + 2) % 7)); fri.setUTCHours(18, 0, 0, 0);
  const wk = Math.floor(fri.getTime() / (7 * 86400000));
  const end = new Date(fri); end.setUTCDate(fri.getUTCDate() + 3); end.setUTCHours(0, 0, 0, 0); // Pazartesi 00:00 TR
  return { active: true, type: force || EVENT_TYPES[wk % EVENT_TYPES.length], endsAt: end.getTime() - 3 * 3600e3, forced: !!force };
}
function nextFriday(tr) { const d = new Date(tr); d.setUTCDate(tr.getUTCDate() + ((5 - tr.getUTCDay() + 7) % 7 || 7)); d.setUTCHours(18, 0, 0, 0); return d.getTime() - 3 * 3600e3; }

// API uçları CORS açık: native uygulama (capacitor://localhost / https://localhost kökeni) lider tablosunu ve
// analitiği canlı sunucudan çekebilsin. Statik dosyalarda CORS gerekmez.
function cors(extra) {
  return Object.assign({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }, extra || {});
}
function handleReq(req, res) {
  // CORS preflight (fetch JSON gövdesi bazı istemcilerde preflight tetikler)
  if (req.method === 'OPTIONS' && /^\/(lb|ev|stats|events)([/?]|$)/.test(req.url || '')) {
    res.writeHead(204, cors()); return res.end();
  }
  // lider tablosu gönderimi
  if (req.method === 'POST' && (req.url || '').startsWith('/lb')) {
    if (!rateOk(req, 'lb', 10)) { res.writeHead(429, cors()); return res.end(); }
    let body = '';
    req.on('data', c => { body += c; if (body.length > 2000) req.destroy(); });
    req.on('end', () => { try { const m = JSON.parse(body); if (typeof m.cid !== 'string' || !/^[A-Za-z0-9_-]{6,40}$/.test(m.cid)) throw 0; if (m.time) lbSubmitSpeed(m.cid, m.name, m.time, vanity(m)); else lbSubmit(m.cid, m.name, m.score, vanity(m)); } catch {} res.writeHead(204, cors()); res.end(); });
    return;
  }
  // lider tablosu okuma (?p=day|week)
  if (req.method === 'GET' && (req.url || '').startsWith('/lb')) {
    const period = /p=speed/.test(req.url || '') ? 'speed' : /p=week/.test(req.url || '') ? 'week' : 'day';
    lbTopAny(period).then(rows => {
      res.writeHead(200, cors({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }));
      res.end(JSON.stringify(rows));
    }).catch(() => { try { res.writeHead(500, cors()); res.end('[]'); } catch (e) {} });
    return;
  }
  // analitik olay alımı (sendBeacon POST)
  if (req.method === 'POST' && (req.url || '').startsWith('/ev')) {
    if (!rateOk(req, 'ev', 60)) { res.writeHead(429, cors()); return res.end(); }
    let body = '';
    req.on('data', c => { body += c; if (body.length > 8000) req.destroy(); });
    req.on('end', () => { try { const m = JSON.parse(body); if (m && typeof m.ev === 'string' && m.ev.length <= 40) trackEvent(m); } catch {} res.writeHead(204, cors()); res.end(); });
    return;
  }
  // aktif etkinlik (istemci fetch edemezse aynı formülü yerelde uygular) — sunucu bayrağı = sürümsüz canlı-ops
  if (req.method === 'GET' && (req.url || '').startsWith('/events')) {
    res.writeHead(200, cors({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }));
    return res.end(JSON.stringify(activeEvent()));
  }
  // basit dashboard (JSON huni)
  if (req.method === 'GET' && (req.url || '').startsWith('/stats')) {
    { const k = ((req.url || '').match(/[?&]k=([^&]+)/) || [])[1]; if (!STATS_KEY || decodeURIComponent(k || '') !== STATS_KEY) { res.writeHead(404); return res.end('not found'); } }
    const now = Date.now();
    const active5m = Object.values(stats.sessions).filter(t => now - t < 300000).length;
    const base = {
      uptimeMin: Math.round((now - stats.started) / 60000),
      persistent: !!pgPool,
      totalSessions: Object.keys(stats.sessions).length,
      activeLast5min: active5m,
      events: stats.events,
      modes: stats.modes,
      endReasons: stats.reasons,
      dailyPlayers: Object.fromEntries(Object.entries(stats.days).sort((a, b) => a[0] < b[0] ? -1 : 1).map(([d, s]) => [d, s.size])),
      // FAZ1 KPI panosu (plan §4): huni, reklam, ekonomi hızı, canlı-ops — olay sayaçlarından türetilir
      funnel: pick(stats.events, ['load_end', 'tutorial_start', 'tutorial_done', 'first_kill', 'gameplay_start', 'run_victory', 'endless_continue', 'level_up']),
      ads: Object.assign(pick(stats.events, ['ad_offer', 'ad_watch', 'rewarded_offer', 'rewarded_done', 'rewarded_fail', 'revive_offer', 'revive_used', 'revive_declined']), { byPlace: stats.byPlace }),
      economy: Object.assign(pick(stats.events, ['soft_purchase', 'consumable_buy', 'gem_spend', 'season_premium', 'iap', 'gacha', 'quest_claim', 'daily_chest', 'patrol_claim', 'mega_bounce']), { coinSpend: stats.coinSpend, gemSpend: stats.gemSpend }),
      liveops: pick(stats.events, ['weekly_start', 'weekly_win', 'event_join', 'event_complete', 'chapter_complete', 'share_card', 'notif_open', 'return_flow', 'build_pick', 'boss_kill', 'season_tier']),
    };
    const send = obj => { res.writeHead(200, cors({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })); res.end(JSON.stringify(obj, null, 2)); };
    if (pgPool) {
      // kalıcı gün→tekil-oyuncu + basit D1: dün gelenlerin bugün DÖNME oranı (retention'ın hammaddesi)
      pgPool.query("SELECT day, COUNT(*)::int AS n FROM days WHERE day >= $1 GROUP BY day ORDER BY day", [new Date(now - 15 * 864e5).toISOString().slice(0, 10)])
        .then(async r => {
          base.dailyPlayersPersistent = Object.fromEntries(r.rows.map(x => [x.day, x.n]));
          try {
            const today = new Date(now).toISOString().slice(0, 10), yest = new Date(now - 864e5).toISOString().slice(0, 10);
            const d1 = await pgPool.query('SELECT COUNT(*)::int AS r FROM days a JOIN days b ON a.pid = b.pid WHERE a.day = $1 AND b.day = $2', [yest, today]);
            const dy = await pgPool.query('SELECT COUNT(*)::int AS n FROM days WHERE day = $1', [yest]);
            base.d1 = { yesterday: dy.rows[0].n, returnedToday: d1.rows[0].r, pct: dy.rows[0].n ? Math.round(d1.rows[0].r / dy.rows[0].n * 100) : null };
            // FAZ1 KPI: D7 — 7 gün önce gelenlerin bugün dönme oranı (aynı self-join)
            const d7ago = new Date(now - 7 * 864e5).toISOString().slice(0, 10);
            const d7 = await pgPool.query('SELECT COUNT(*)::int AS r FROM days a JOIN days b ON a.pid = b.pid WHERE a.day = $1 AND b.day = $2', [d7ago, today]);
            const d7n = await pgPool.query('SELECT COUNT(*)::int AS n FROM days WHERE day = $1', [d7ago]);
            base.d7 = { sevenDaysAgo: d7n.rows[0].n, returnedToday: d7.rows[0].r, pct: d7n.rows[0].n ? Math.round(d7.rows[0].r / d7n.rows[0].n * 100) : null };
          } catch (e) {}
          send(base);
        }).catch(() => send(base));
    } else send(base);
    return;
  }

  // statik dosyalar — bozuk URL kodlaması süreci düşürmesin
  let p;
  try { p = decodeURIComponent((req.url || '/').split('?')[0]); }
  catch { res.writeHead(400); return res.end(); }
  if (p === '/') p = '/index.html';
  if (p === '/privacy' || p === '/privacy/') p = '/privacy.html';
  const norm = path.normalize(p).replace(/\\/g, '/');
  const allowed = ALLOW_FILES.has(norm) || ALLOW_DIRS.some(d => norm.startsWith(d));
  if (!allowed || norm.includes('..')) { res.writeHead(404); return res.end('not found'); }
  const file = path.join(ROOT, norm);
  const rel = path.relative(ROOT, file);
  if (rel.startsWith('..') || path.isAbsolute(rel)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  });
}
// tek isteğin beklenmedik hatası süreci ve diğer odaları düşürmesin
const server = http.createServer((req, res) => {
  try { handleReq(req, res); }
  catch (e) { console.error('[HTTP]', e && e.message); try { res.writeHead(500); res.end(); } catch {} }
});

// ---- odalar (düello/top = 2 kişi otomatik başlar; kooperatif = 2-4 kişi, host başlatır) ----
const wss = new WebSocket.Server({ server });
const rooms = new Map(); // kod -> { list:[{ws,pid}], started, pidC, auto }
const MAX_PLAYERS = 4;

function newCode() {
  const chars = 'ABCDEFGHJKLMNPRSTUVYZ23456789';
  let c = '';
  for (let i = 0; i < 4; i++) c += chars[Math.floor(Math.random() * chars.length)];
  return rooms.has(c) ? newCode() : c;
}
function roomOf(ws) { return ws.room ? rooms.get(ws.room) : null; }
function pids(room) { return room.list.map(e => e.pid); }
function bcast(room, obj, exceptWs) {
  const s = JSON.stringify(obj);
  for (const e of room.list) if (e.ws !== exceptWs && e.ws.readyState === WebSocket.OPEN) e.ws.send(s);
}
// aynı bağlantı yeni oda kurar/katılırken eskisinden temiz ayrılsın (hayalet oda sızıntısı önlenir)
function leaveRoom(ws) {
  const room = roomOf(ws);
  if (!room) { ws.room = null; return; }
  room.list = room.list.filter(e => e.ws !== ws);
  if (room.list.length === 0) rooms.delete(ws.room);
  else if (room.started) bcast(room, { t: 'peerleft', who: ws.pid });
  else bcast(room, { t: 'lobby', count: room.list.length, players: pids(room) });
  ws.room = null;
}
// yalnızca istemcinin gerçekten ürettiği oyun-içi mesaj tipleri iletilir
const RELAY_TYPES = new Set(['state', 'fire', 'skin', 'die', 'thit', 'tdie', 'ball', 'goal', 'win', 'rematch',
  'pinfo', 'phealth', 'efire', 'enemies', 'ekill', 'wave', 'pu_spawn', 'pu_take', 'down', 'barrel', 'coopover', 'gamemode']);

wss.on('connection', ws => {
  ws.on('error', () => {}); // soket hatası süreci düşürmesin
  ws.on('message', raw => {
    try {
      if (raw && raw.length > 8192) return; // aşırı büyük mesaj
      let m;
      try { m = JSON.parse(raw); } catch { return; }
      if (!m || typeof m !== 'object' || Array.isArray(m) || typeof m.t !== 'string' || m.t.length > 20) return; // null/JSON-olmayan gövdeler
      if (m.t === 'create') {
        leaveRoom(ws);
        const code = newCode();
        const room = { list: [], started: false, pidC: 0, auto: !(m.cap > 2), cap: Math.min(MAX_PLAYERS, Math.max(2, m.cap | 0 || 2)) };
        rooms.set(code, room);
        const pid = ++room.pidC;
        room.list.push({ ws, pid }); ws.room = code; ws.pid = pid;
        ws.send(JSON.stringify({ t: 'room', code, you: pid }));
        if (!room.auto) bcast(room, { t: 'lobby', count: room.list.length, players: pids(room) });
      } else if (m.t === 'join') {
        leaveRoom(ws);
        const code = String(m.code || '').trim().toUpperCase();
        const room = rooms.get(code);
        if (!room || room.started || room.list.length >= MAX_PLAYERS) { ws.send(JSON.stringify({ t: 'err' })); return; }
        const pid = ++room.pidC;
        room.list.push({ ws, pid }); ws.room = code; ws.pid = pid;
        if (room.auto && room.list.length === 2) {
          room.started = true;
          for (const e of room.list) e.ws.send(JSON.stringify({ t: 'start', you: e.pid }));
        } else {
          bcast(room, { t: 'lobby', count: room.list.length, players: pids(room) });
        }
      } else if (m.t === 'startgame') {
        const room = roomOf(ws);
        if (!room || room.started || room.list.length < 2 || room.list[0].ws !== ws) return;
        const gm = m.gm === 'team' ? 'team' : 'coop';
        if (gm === 'team' && room.list.length !== 4) return; // 2v2 tam 4 oyuncu ister
        room.started = true;
        const map = Math.max(0, Math.min(50, m.map | 0)), plist = pids(room);
        for (const e of room.list) e.ws.send(JSON.stringify({ t: 'start', you: e.pid, players: plist, coop: true, map, gm }));
      } else {
        const room = roomOf(ws);
        if (!room) return;
        if (!RELAY_TYPES.has(m.t)) return; // bilinmeyen tip iletilmez
        // ---- temel hile/flood önleme (yanlış-pozitif üretmeyen hafif doğrulama) ----
        const now = Date.now();
        if (now > (ws.rlReset || 0)) { ws.rlReset = now + 1000; ws.rlCount = 0; } // 1sn pencere
        if (++ws.rlCount > 90) return;                                            // mesaj-sel/DoS: sn'de 90+ → at
        if (m.t === 'fire') { if (now - (ws.lastFire || 0) < 150) return; ws.lastFire = now; } // rapid-fire hilesi (min atış ~300ms)
        if (m.t === 'state' && (Math.abs(+m.x) > 80 || Math.abs(+m.z) > 80)) return;           // arena-dışı ışınlanma/hile
        m.from = ws.pid;
        bcast(room, m, ws);
      }
    } catch (e) { console.error('[WS]', e && e.message); } // tek bağlantının hatası diğer odaları etkilemesin
  });
  ws.on('close', () => { leaveRoom(ws); });
});

server.listen(PORT, () => console.log(`Tank sunucusu ${PORT} portunda dinliyor`));
