const CACHE_NAME = 'pwa-cache'; 
const OFFLINE_FILES = [ // Offlien Datenspeicherung
  './',
  './index.html', 
  './style.css', 
  './manifest.json',
  './service-worker.js',
  './image/favicon.png',
  './credits.html', 
  './datenschutz.html',
  './hassrede.html',
  './hassrede.js',
  './impressum.html',
  './objekterkennung.html',
  './objekterkennung.js',
  './objekterkennung-webgpu.html',
  './objekterkennung-webgpu.js',
  './uebersetzung.html',
  './uebersetzung.js',
];

// Bei Installation Dateien in Cache speichern
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching der Dateien...');
      return cache.addAll(OFFLINE_FILES);
    })
  );
});

// Vermittlung der Anfrage: Dateien aus Cache oder Netzwerk 
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Dateien aus Cache wenn verfügbar
      return response || fetch(event.request);
    }).catch(() => {
      // Fallback
      if (event.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});

// Bei erneutem Aufruf Cache aktualisieren
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Alter Cache wird gelöscht:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
