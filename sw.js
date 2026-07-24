var CACHE = 'love-story-v1';
var ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(ASSETS);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(e) {
  if (e.request.url.indexOf('firestore.googleapis.com') >= 0 ||
      e.request.url.indexOf('googleapis.com') >= 0 ||
      e.request.url.indexOf('gstatic.com') >= 0 ||
      e.request.url.indexOf('cloudflare.com') >= 0) {
    e.respondWith(fetch(e.request).catch(function() {
      return new Response('', { status: 408 });
    }));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).then(function(resp) {
        if (resp && resp.ok && resp.type === 'basic') {
          var clone = resp.clone();
          caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
        }
        return resp;
      });
    }).catch(function() {
      return caches.match('/');
    })
  );
});

// FCM push handler
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDDoeCYCxvKuAQ9CnYKPoE1_6s6htBYY04",
  authDomain: "ptan2009-92b5a.firebaseapp.com",
  projectId: "ptan2009-92b5a",
  messagingSenderId: "745340137438",
  appId: "1:745340137438:web:ce45b0ed2d7bc22137774f"
});

var messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  var data = payload.data || {};
  var title = data.title || payload.notification?.title || 'Love Story';
  var body = data.body || payload.notification?.body || 'Có tin nhắn mới';
  var tag = data.tag || 'dm-' + Date.now();
  var icon = data.icon || 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'50\' fill=\'%23ed4956\'/%3E%3Ctext x=\'50\' y=\'68\' text-anchor=\'middle\' font-size=\'50\' fill=\'white\'%3E%E2%9D%A4%3C/text%3E%3C/svg%3E';
  self.registration.showNotification(title, {
    body: body,
    icon: icon,
    tag: tag,
    data: data,
    vibrate: [200, 100, 200],
    requireInteraction: true
  });
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  var urlToOpen = '/';
  if (e.notification.data && e.notification.data.url) {
    urlToOpen = e.notification.data.url;
  }
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var c = clientList[i];
        if (c.url && c.navigate) {
          c.focus();
          if (urlToOpen !== '/') c.navigate(urlToOpen);
          return;
        }
      }
      clients.openWindow(urlToOpen);
    })
  );
});
