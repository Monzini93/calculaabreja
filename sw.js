// Define um nome e versão para o nosso cache
const CACHE_NAME = 'calcula-breja-v1';

// Lista de arquivos que o Service Worker deve armazenar em cache
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/img/icon-192.png',
  '/img/icon-512.png'
];

// Evento 'install': é disparado quando o Service Worker é instalado
self.addEventListener('install', function(event) {
  // Espera até que a promessa dentro de waitUntil seja resolvida
  event.waitUntil(
    // Abre o cache com o nome que definimos
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache aberto!');
        // Adiciona todos os nossos arquivos ao cache
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento 'fetch': é disparado para cada solicitação de rede feita pela página
self.addEventListener('fetch', function(event) {
  event.respondWith(
    // Procura a solicitação no cache primeiro
    caches.match(event.request)
      .then(function(response) {
        // Se a resposta for encontrada no cache, a retorna
        if (response) {
          return response;
        }
        // Se não, faz a solicitação à rede
        return fetch(event.request);
      }
    )
  );
});
