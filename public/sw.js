// Skyer Service Worker — Offline Resilience, Fast Shell Cache & Web Notifications
// Cache name follows the build id passed at registration (/sw.js?v=<build>) so every deploy evicts old shells.
const BUILD_ID = new URL(self.location.href).searchParams.get('v') || '1.0.8';
const CACHE_NAME = 'skyer-' + BUILD_ID;
const STATIC_ASSETS = [
  '/',
  '/app',
  '/favicon.svg',
  '/logo.svg',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Listen for background notifications and message dispatches
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'NOTIFY_TASK_COMPLETE') {
    const { title, body, icon, tag, url } = event.data;
    if (self.registration && typeof self.registration.showNotification === 'function') {
      self.registration.showNotification(title || 'Skyer — Task Completed', {
        body: body || 'Autonomous agent finished executing task.',
        icon: icon || '/favicon.svg',
        badge: '/favicon.svg',
        tag: tag || 'skyer-task',
        renotify: true,
        data: { url: url || '/app' }
      });
    }
  }
});

// Notification click behavior: focus window or open URL
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/app';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Bypass API calls and live SSE streams (network-first, never stale streaming)
  if (url.pathname.startsWith('/api') || url.pathname.includes('/console/chat')) {
    return;
  }

  // Cache Google Fonts (Inter, Newsreader, JetBrains Mono)
  if (url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open('skyer-fonts-v1').then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        }).catch(() => cachedResponse);
      })
    );
    return;
  }


  // Network-first for HTML navigations (/app, /, /docs, etc.) to guarantee fresh release shell
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      }).catch(() => caches.match(event.request) || caches.match('/app') || caches.match('/'))
    );
    return;
  }

  // Stale-while-revalidate for static assets, navigation fallback to cache
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch fresh copy in background
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // If offline and request is an HTML page navigation, return cached root/app
        if (event.request.mode === 'navigate') {
          return caches.match('/app') || caches.match('/');
        }
      });
    })
  );
});
