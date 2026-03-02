// Service Worker for DesignInn Admin Dashboard
// Provides offline support, caching, and background sync

const CACHE_NAME = 'designinn-v1'
const RUNTIME_CACHE = 'designinn-runtime'
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
]

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.log('Cache add error:', err)
        return Promise.resolve()
      })
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return
  }

  // API calls - network first, cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, response.clone())
            })
          }
          return response
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            if (cached) {
              return cached
            }
            // Return offline response
            return new Response(
              JSON.stringify({
                offline: true,
                message: 'You are offline. Showing cached data.',
              }),
              {
                status: 503,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          })
        })
    )
    return
  }

  // Assets - cache first, network fallback
  event.respondWith(
    caches.match(request).then((cached) => {
      return (
        cached ||
        fetch(request)
          .then((response) => {
            if (response.ok && !url.pathname.includes('.map')) {
              caches.open(RUNTIME_CACHE).then((cache) => {
                cache.put(request, response.clone())
              })
            }
            return response
          })
          .catch(() => {
            // Return placeholder for failed requests
            if (request.headers.get('accept')?.includes('text/html')) {
              return new Response('Page not available offline')
            }
            return new Response('Resource not available')
          })
      )
    })
  )
})

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData())
  }
})

async function syncData() {
  try {
    // Sync any pending API calls
    const cache = await caches.open(RUNTIME_CACHE)
    const keys = await cache.keys()

    for (const request of keys) {
      if (request.method === 'POST' || request.method === 'PUT') {
        try {
          const response = await fetch(request.clone())
          if (response.ok) {
            await cache.delete(request)
          }
        } catch (error) {
          console.log('Sync error:', error)
        }
      }
    }
  } catch (error) {
    console.log('Sync failed:', error)
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'New notification',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: 'designinn-notification',
    requireInteraction: false,
  }

  event.waitUntil(self.registration.showNotification('DesignInn', options))
})

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i]
        if (client.url === '/' && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/')
      }
    })
  )
})
