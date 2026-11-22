// Cache da aplicação do cartão: depois de aberta uma vez, funciona sem internet.
const CACHE = 'cartao-2026.11.22-3';
const FICH = ['./', 'index.html', 'manifest.json', 'lib/qrcode.js', 'lib/jsQR.js', 'icon-192.png', 'icon-512.png', 'favicon.png', 'apple-touch-icon.png',
  'fonts/manrope-latin-wght-normal.woff2', 'fonts/manrope-latin-ext-wght-normal.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICH)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || u.pathname.endsWith('/agenda.json')) return; // a agenda vem sempre da rede (a última fica guardada pela aplicação)
  // rede primeiro (para receber atualizações), cache se não houver internet
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)).catch(() => { }); return r; }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('index.html'))));
});
