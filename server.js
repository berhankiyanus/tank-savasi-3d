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

// ---- düello odaları ----
const wss = new WebSocket.Server({ server });
const rooms = new Map(); // kod -> [ws, ws]

function newCode() {
  const chars = 'ABCDEFGHJKLMNPRSTUVYZ23456789';
  let c = '';
  for (let i = 0; i < 4; i++) c += chars[Math.floor(Math.random() * chars.length)];
  return rooms.has(c) ? newCode() : c;
}

wss.on('connection', ws => {
  ws.on('message', raw => {
    let m;
    try { m = JSON.parse(raw); } catch { return; }
    if (m.t === 'create') {
      const code = newCode();
      rooms.set(code, [ws]);
      ws.room = code;
      ws.send(JSON.stringify({ t: 'room', code }));
    } else if (m.t === 'join') {
      const code = String(m.code || '').trim().toUpperCase();
      const r = rooms.get(code);
      if (!r || r.length >= 2 || r[0].readyState !== WebSocket.OPEN) {
        ws.send(JSON.stringify({ t: 'err' }));
        return;
      }
      r.push(ws);
      ws.room = code;
      r[0].send(JSON.stringify({ t: 'start', you: 1 }));
      r[1].send(JSON.stringify({ t: 'start', you: 2 }));
    } else if (ws.room) {
      const r = rooms.get(ws.room);
      if (!r) return;
      for (const c of r) {
        if (c !== ws && c.readyState === WebSocket.OPEN) c.send(JSON.stringify(m));
      }
    }
  });
  ws.on('close', () => {
    if (!ws.room) return;
    const r = rooms.get(ws.room);
    if (!r) return;
    for (const c of r) {
      if (c !== ws && c.readyState === WebSocket.OPEN) c.send(JSON.stringify({ t: 'peerleft' }));
    }
    rooms.delete(ws.room);
  });
});

server.listen(PORT, () => console.log(`Tank sunucusu ${PORT} portunda dinliyor`));
