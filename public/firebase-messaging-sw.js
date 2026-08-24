// Firebase Messaging Service Worker — handles BACKGROUND push notifications.
// This file must be at the root of the public directory (served at /firebase-messaging-sw.js).

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey:            'AIzaSyD7wqFHS9h-p6iahhWouxEextcm3OPdInY',
  authDomain:        'korpabee-web.firebaseapp.com',
  projectId:         'korpabee-web',
  storageBucket:     'korpabee-web.firebasestorage.app',
  messagingSenderId: '905651309945',
  appId:             '1:905651309945:web:b0e8c63d5a60f4865373a8',
})

const messaging = firebase.messaging()

// Handle background messages — show a native notification
messaging.onBackgroundMessage((payload) => {
  console.log('[FCM SW] Background message received:', payload)

  const title = payload.notification?.title || payload.data?.title || 'KorpaBee'
  const options = {
    body:    payload.notification?.body  || payload.data?.body  || '',
    icon:    '/icon.png',
    badge:   '/badge.png',
    data:    payload.data || {},
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  }

  self.registration.showNotification(title, options)
})

// Handle notification click — open or focus the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'dismiss') return

  const targetUrl = event.notification.data?.action
    ? self.location.origin + event.notification.data.action
    : self.location.origin

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl)
      }
    })
  )
})
