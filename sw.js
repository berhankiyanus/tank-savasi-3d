// Service worker — uygulama kabuğu + boot'u bloklayan varlıklar önbellekte (kurulabilirlik, hızlı ve OFFLINE açılış).
// SÜRÜM: her yayında el ile artır (web bu dosyayı repodan sunar); native pakette build-www.js
// __BUILDSTAMP__ damgasını gerçek zamanla değiştirir → her native sürüm otomatik taze önbellek.
const CACHE = 'tank3d-v1.0.0-premium4-map-surfaces-__BUILDSTAMP__'; // web: sürüm adı her yayında değişir; native: build-www damgalar
// Denetim fix'i: eski CORE tank.glb+env.hdr'ı içermiyordu → offline ilk açılış HEP retry ekranına düşüyordu.
const CORE = [
  './',
  'index.html',
  'assets/outpost-lobby.jpg',
  'main.js',
  'game-progress.mjs', 'garage-content.mjs', 'garage-visuals.mjs',
  'polish.css', 'game/arenas.mjs', 'game/arena-catalog.mjs', 'game/combat.mjs', 'game/controls.mjs','game/camera.mjs','game/map-finish.mjs','game/practice.mjs', 'game/presentation.mjs', 'game/premium-profile.mjs', 'game/ranked-view.mjs', 'net/client.mjs','net/session.mjs',
  'libs/three.module.js',
  'manifest.json',
  'assets/tank_recruit_mk2.glb',
  'assets/env.hdr',
  'assets/sky.jpg',
  'assets/fonts/BarlowSemiCondensed-SemiBold.ttf',
  'assets/fonts/field-symbols.ttf',
  'licenses.html',
];
// değişmez varlıklar (glb/doku/font): önbellek-önce + arkaplanda tazele (SWR) — her açılışta yeniden inmesinler
const ASSET_RE = /\/(assets|libs)\/.+\.(glb|hdr|jpg|png|woff2|ttf|js)$/;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.protocol.startsWith('ws') || url.origin !== location.origin) return;
  if (/^\/(api\/|ev|lb|stats|events)/.test(url.pathname)) return;
  if (ASSET_RE.test(url.pathname)) {
    // stale-while-revalidate: önbellekten anında yanıt, arka planda güncelle
    e.respondWith(
      caches.match(e.request).then(hit => {
        const refresh = fetch(e.request).then(res => {
          if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {}); }
          return res;
        }).catch(() => hit);
        return hit || refresh;
      })
    );
    return;
  }
  // kod/navigasyon: ağ-önce, başarısızsa önbellek; o da yoksa gezinmelerde index.html kabuğu
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {}); }
      return res;
    }).catch(() =>
      caches.match(e.request).then(hit =>
        hit || (e.request.mode === 'navigate'
          ? caches.match('index.html')
          : new Response('', { status: 504, statusText: 'offline' }))
      )
    )
  );
});
