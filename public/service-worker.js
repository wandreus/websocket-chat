(function () {

  importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.1.0/workbox-sw.js');

  const textPush = function (event, index) {
    return event.data.text().split(',')[index];
  };

  ServiceWorkerGlobalScope.onpush = function (event) {

    const title = `O Pedido ${textPush(event, 0)} mudou de status`;

    const options = {
      body: `Olá ${textPush(event, 2)}, o pedido ${textPush(event, 0)} mudou para ${textPush(event, 1)}`,
      image: textPush(event, 3),
      icon: 'https://electrolux.vteximg.com.br/arquivos/electrolux-favicon.ico',
      badge: 'https://electrolux.vteximg.com.br/arquivos/electrolux-favicon.ico'
    };

    const notificationPromise = self.registration.showNotification(title, options);
    event.waitUntil(notificationPromise);

  }

  self.addEventListener('push', function (event) {

    const title = `O Pedido ${textPush(event, 0)} mudou de status`;

    const options = {
      body: `Olá ${textPush(event, 2)}, o pedido ${textPush(event, 0)} mudou para ${textPush(event, 1)}`,
      image: textPush(event, 3),
      icon: 'https://electrolux.vteximg.com.br/arquivos/electrolux-favicon.ico',
      badge: 'https://electrolux.vteximg.com.br/arquivos/electrolux-favicon.ico'
    };

    const notificationPromise = self.registration.showNotification(title, options);
    event.waitUntil(notificationPromise);

  });

  self.addEventListener('notificationclick', function (event) {

    event.notification.close();

    event.waitUntil(
      clients.openWindow(`https://eluxhomolog.vtexcommercestable.com.br/_secure/account/orders#/orders/${textPush}`)
    );

  });
  
  // Default cache Details
  const dateExpired = 3 * 24 * 60 * 60;
  workbox.setConfig({ debug: false });
  workbox.core.setCacheNameDetails({
    prefix: 'my_app',
    precache: 'precache',
    runtime: 'run-time',
    googleAnalytics: 'ga',
  });

  // Cache Principais arquivos
  workbox.routing.registerRoute(
    new RegExp('.+style.css'),
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'css-core-files',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 10,
          maxAgeSeconds: dateExpired,
          purgeOnQuotaError: true
        }),
      ]
    })
  );


  workbox.skipWaiting();
  workbox.clientsClaim();

  if (workbox) {
    console.log(`Yay! Workbox is loaded 🎉`);
  } else {
    console.log(`Boo! Workbox didn't load 😬`);
  }
})()
