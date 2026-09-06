/* ============================================================
   TaniPintar — Service Worker
   ------------------------------------------------------------
   NAIKKAN CACHE_VERSION setiap kali index.html diperbarui.
   Tanpa itu, pengguna lama akan terus membuka versi usang dari
   cache dan mengira aplikasi tidak diperbarui.
   ============================================================ */

var CACHE_VERSION = 'tanipintar-v9';

/* config.js SENGAJA tidak ada di daftar ini.
   Berkas itu berisi URL Web App yang bisa berubah kapan saja;
   kalau ikut disimpan, penggantian URL tidak akan pernah berlaku. */
var PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      // addAll gagal seluruhnya bila satu berkas meleset, jadi tiap
      // berkas ditambahkan sendiri-sendiri agar pemasangan tetap berhasil.
      return Promise.all(PRECACHE.map(function (url) {
        return cache.add(url).catch(function (err) {
          console.warn('[sw] gagal precache', url, err);
        });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (kunci) {
      return Promise.all(kunci.map(function (k) {
        if (k !== CACHE_VERSION) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  var url;
  try { url = new URL(req.url); } catch (err) { return; }

  /* Jawaban Apps Script TIDAK BOLEH di-cache.
     Data kebun berubah terus; menyajikan jawaban lama akan membuat
     petani melihat stok atau panen yang sudah tidak berlaku. */
  if (url.hostname.indexOf('script.google.com') >= 0 ||
      url.hostname.indexOf('googleusercontent.com') >= 0) {
    return;
  }

  /* Ubin peta dari penyedia pihak ketiga juga dilewatkan.
     Menyimpannya secara luring umumnya dilarang oleh ketentuan
     lisensi penyedia peta. */
  if (url.origin !== self.location.origin) return;

  /* config.js: jaringan dulu, cache hanya sebagai jaring pengaman. */
  if (url.pathname.indexOf('config.js') >= 0) {
    e.respondWith(
      fetch(req).then(function (res) {
        var salinan = res.clone();
        caches.open(CACHE_VERSION).then(function (c) { c.put(req, salinan); });
        return res;
      }).catch(function () { return caches.match(req); })
    );
    return;
  }

  /* Sisanya: cache dulu supaya aplikasi terbuka seketika di kebun,
     lalu perbarui salinan di latar belakang. */
  e.respondWith(
    caches.match(req).then(function (tersimpan) {
      var dariJaringan = fetch(req).then(function (res) {
        if (res && res.status === 200 && res.type === 'basic') {
          var salinan = res.clone();
          caches.open(CACHE_VERSION).then(function (c) { c.put(req, salinan); });
        }
        return res;
      }).catch(function () {
        return tersimpan || caches.match('./index.html');
      });
      return tersimpan || dariJaringan;
    })
  );
});

/* Memungkinkan halaman memaksa service worker baru mengambil alih
   tanpa menunggu semua tab lama ditutup. */
self.addEventListener('message', function (e) {
  if (e.data === 'LEWATI_TUNGGU') self.skipWaiting();
});
