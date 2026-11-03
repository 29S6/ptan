importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDDoeCYCxvKuAQ9CnYKPoE1_6s6htBYY04",
  authDomain: "ptan2009-92b5a.firebaseapp.com",
  databaseURL: "https://ptan2009-92b5a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ptan2009-92b5a",
  storageBucket: "ptan2009-92b5a.firebasestorage.app",
  messagingSenderId: "745340137438",
  appId: "1:745340137438:web:ce45b0ed2d7bc22137774f"
});

var messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  var d = payload.data || {};
  var n = payload.notification || {};
  var title = d.title || n.title || 'Love Story';
  var body = d.body || n.body || '';
  return self.registration.showNotification(title, {
    body: body,
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    tag: d.tag || 'lovestory',
    data: { url: d.url || './' }
  });
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list) {
    for (var i = 0; i < list.length; i++) {
      if ('focus' in list[i]) { list[i].focus(); return; }
    }
    if (clients.openWindow) return clients.openWindow(url);
  }));
});
