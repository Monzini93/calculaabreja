// Define um nome e versão para o nosso cache. Mudar a versão força a atualização.
const CACHE_NAME = 'calcula-breja-v3';

// Lista de arquivos essenciais que o Service Worker deve armazenar em cache.
const urlsToCache = [
  '/',
  '/index.html',
  '/Packs.html',
  '/script.js',
  '/fundo.jpg',
  '/img/icon-192.png',
  '/img/icon-512.png',
  '/favicon.ico',
  '/apple-touch-icon.png'
];

// Evento 'install': é disparado quando o Service Worker é instalado.
self.addEventListener('install', function(event) {
  // O Service Worker só será instalado se todo o código dentro de waitUntil for bem-sucedido.
  event.waitUntil(
    // Abre o cache com o nome que definimos.
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache aberto e arquivos sendo adicionados.');
        // Adiciona todos os nossos arquivos ao cache. Se um falhar, a instalação inteira falha.
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento 'activate': é disparado quando o Service Worker é ativado.
// Usamos isso para limpar caches antigos.
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          // Se o nome do cache não for o nosso cache atual, ele será deletado.
          if (cacheName !== CACHE_NAME) {
            console.log('Limpando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Evento 'fetch': é disparado para cada solicitação de rede feita pela página.
self.addEventListener('fetch', function(event) {
  event.respondWith(
    // Procura a solicitação no cache primeiro.
    caches.match(event.request)
      .then(function(response) {
        // Se a resposta for encontrada no cache, a retorna.
        if (response) {
          return response;
        }
        // Se não, faz a solicitação à rede.
        return fetch(event.request);
      }
    )
  );
});