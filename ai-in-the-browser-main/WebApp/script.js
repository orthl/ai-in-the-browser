// Ruft ServiceWorker + Log
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(() => {
        console.log('Service Worker erfolgreich registriert.');
      })
      .catch((error) => {
        console.error('Fehler bei der Registrierung des Service Workers:', error);
      });
  }