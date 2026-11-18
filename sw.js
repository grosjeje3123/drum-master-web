// Service worker : l'appli reste utilisable hors connexion (métro) après une première visite.
// Fichiers à empreinte (assets/) : servis depuis le cache. Le reste (page, données, sons) :
// servi depuis le cache s'il y est, et rafraîchi en arrière-plan.
const CACHE = 'drum-master-1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (e) => {
	const req = e.request;
	const url = new URL(req.url);
	if (req.method !== 'GET' || url.origin !== location.origin) return;
	const put = (res) => {
		if (res && res.ok) {
			const copy = res.clone();
			caches.open(CACHE).then((c) => c.put(req, copy));
		}
		return res;
	};
	if (url.pathname.includes('/assets/')) {
		e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then(put)));
		return;
	}
	if (req.mode === 'navigate') {
		e.respondWith(fetch(req).then(put).catch(() => caches.match(req).then((hit) => hit || caches.match('./'))));
		return;
	}
	e.respondWith(caches.match(req).then((hit) => {
		const net = fetch(req).then(put).catch(() => hit);
		return hit || net;
	}));
});
