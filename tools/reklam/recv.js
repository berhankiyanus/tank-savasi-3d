// Kayıt alıcısı: POST /<ad> gövdesini /tmp/ad-<ad>.webm|wav olarak yazar (CORS açık)
const http = require('http'), fs = require('fs');
http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  const m = /^\/([A-Za-z0-9_.-]+)$/.exec(req.url);
  if (req.method !== 'POST' || !m) { res.writeHead(404); return res.end('yok'); }
  const chunks = [];
  req.on('data', c => chunks.push(c));
  req.on('end', () => {
    const buf = Buffer.concat(chunks), out = '/tmp/ad-' + m[1];
    fs.writeFileSync(out, buf);
    console.log('ALINDI', out, buf.length);
    res.writeHead(200); res.end(String(buf.length));
  });
}).listen(9799, () => console.log('alici 9799 hazir'));
