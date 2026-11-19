// Service worker : l'appli entière (pages, code, sons, données, lecteur de tablatures) est gardée
// sur l'appareil dès la première visite, pour jouer hors connexion (métro).
// À la construction, la liste des fichiers et le numéro de version sont écrits ci-dessous.
const VERSION = '381d2368bd';
const PRECACHE = ["./assets/Archivo-latin-DY7AcnAa.woff2","./assets/Archivo-latin-ext-7khWdh9v.woff2","./assets/alphaTab.core-DycQ949C.js","./assets/index-CEBSUtA7.css","./assets/index-Dg4p--Ou.js","./data/grooves.json","./data/morceaux.json","./data/parcours.json","./data/theorie.json","./icon-192.png","./icon-512.png","./icon-maskable-512.png","./icon.svg","./index.html","./manifest.webmanifest","./sons/crash.pcm","./sons/hat_closed.pcm","./sons/hat_foot.pcm","./sons/hat_open.pcm","./sons/kick.pcm","./sons/ride.pcm","./sons/snare.pcm","./sons/tom1.pcm","./sons/tom2.pcm","./sons/tom3.pcm"];
const CACHE = `drum-master-${VERSION}`;

self.addEventListener('install', (e) => {
	e.waitUntil(
		caches.open(CACHE)
			.then((c) => c.addAll(['./', ...PRECACHE].map((u) => new Request(u, { cache: 'reload' }))))
			.then(() => self.skipWaiting()),
	);
});

// Les anciennes versions sont effacées : le cache ne grossit pas d'une mise à jour à l'autre.
self.addEventListener('activate', (e) => {
	e.waitUntil(
		caches.keys()
			.then((keys) => Promise.all(keys.filter((k) => k.startsWith('drum-master-') && k !== CACHE).map((k) => caches.delete(k))))
			.then(() => self.clients.claim()),
	);
});

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
	// Page et données : le réseau d'abord (toujours la dernière version), le cache sans connexion.
	if (req.mode === 'navigate' || url.pathname.includes('/data/')) {
		e.respondWith(fetch(req).then(put).catch(() => caches.match(req, { ignoreSearch: true })
			.then((hit) => hit || (req.mode === 'navigate' ? caches.match('./') : undefined))));
		return;
	}
	// Code, sons, polices, icônes : le cache d'abord (ces fichiers ne changent pas sans changer de nom).
	e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then(put)));
});
