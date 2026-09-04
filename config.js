/* ============================================================
   TaniPintar — konfigurasi PWA
   ------------------------------------------------------------
   HANYA berkas ini yang perlu Anda ubah setelah menyalin folder
   github/ ke repositori Anda.

   Isi gasUrl dengan URL Web App hasil penerapan (deploy) Apps
   Script Anda. Bentuknya seperti:
     https://script.google.com/macros/s/AKfycb..../exec

   Catatan penting:
   - Berkas ini SENGAJA tidak ikut di-cache oleh service worker.
     Kalau ikut di-cache, mengganti URL Web App tidak akan pernah
     berlaku sampai pengguna menghapus data peramban.
   - Nilai di sini bukan rahasia. Perizinan tetap dijaga oleh
     sesi login di sisi Apps Script, bukan oleh berkas ini.
   ============================================================ */

window.TANIPINTAR_CONFIG = {
  gasUrl: 'https://script.google.com/macros/s/AKfycbwSbDs7R-Z2FS38FMsDCD96Q9fgwFUBXXu1UePNF7BGPqopL5VBDpcklPviXMxjVvdp/exec'
};
