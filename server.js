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
};

const server = http.createServer((req, res) => {
  let p = decodeURIComponent((req.url || '/').split('?')[0]);
  if (p === '/') p = '/index.html';
  const file = path.normalize(path.join(ROOT, p));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  });
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

wss.on('connection', ws => {
  ws.on('message', raw => {
    let m;
    try { m = JSON.parse(raw); } catch { return; }
    if (m.t === 'create') {
      const code = newCode();
      const room = { list: [], started: false, pidC: 0, auto: !(m.cap > 2) };
      rooms.set(code, room);
      const pid = ++room.pidC;
      room.list.push({ ws, pid }); ws.room = code; ws.pid = pid;
      ws.send(JSON.stringify({ t: 'room', code, you: pid }));
      if (!room.auto) bcast(room, { t: 'lobby', count: room.list.length, players: pids(room) });
    } else if (m.t === 'join') {
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
      room.started = true;
      const map = m.map || 0, plist = pids(room);
      for (const e of room.list) e.ws.send(JSON.stringify({ t: 'start', you: e.pid, players: plist, coop: true, map }));
    } else {
      const room = roomOf(ws);
      if (!room) return;
      m.from = ws.pid;
      bcast(room, m, ws);
    }
  });
  ws.on('close', () => {
    const room = roomOf(ws);
    if (!room) return;
    room.list = room.list.filter(e => e.ws !== ws);
    if (room.list.length === 0) { rooms.delete(ws.room); return; }
    if (room.started) bcast(room, { t: 'peerleft', who: ws.pid });
    else bcast(room, { t: 'lobby', count: room.list.length, players: pids(room) });
  });
});

server.listen(PORT, () => console.log(`Tank sunucusu ${PORT} portunda dinliyor`));
