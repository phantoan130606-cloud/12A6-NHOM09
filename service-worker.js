// service-worker.js - Đơn giản, dễ hiểu
const CACHE_NAME = 'eco-tour-v1';
const urlsToCache = [
  '/',
  '/index.html',
  'style.css',
  'script.js',
  'data.js'
];

// Cài đặt Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Kích hoạt Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activated');
  
  // Xóa cache cũ
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Xử lý các request
self.addEventListener('fetch', event => {
  // Chỉ xử lý request GET
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Nếu có trong cache, trả về
        if (response) {
          return response;
        }
        
        // Nếu không, fetch từ mạng
        return fetch(event.request)
          .then(response => {
            // Kiểm tra response hợp lệ
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone response để cache
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Fallback cho offline
            if (event.request.url.includes('.html')) {
              return caches.match('/index.html');
            }
          });
      })
  );
});