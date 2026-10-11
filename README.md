# Portofolio Arya Sukma Putra Dwika

Website HTML statis untuk profil, pengalaman, keahlian, karya video, dan dokumentasi. Revisi menggunakan Tailwind CSS 4, daisyUI 5, Alpine.js 3, dan GSAP 3. Semua font, script, ikon, dan foto tersedia secara lokal.

## Membuka website

Ekstrak ZIP, lalu buka `index.html` di browser. Tidak perlu menginstal Node.js untuk melihat hasilnya. Untuk pengembangan melalui server lokal:

```bash
python3 -m http.server 8000
```

Kunjungi `http://localhost:8000`. Pada Windows, perintah Python dapat berupa `python -m http.server 8000`.

## Mengubah tampilan

1. Ubah isi halaman di `index.html`.
2. Ubah style dan token warna di `src/styles.css`.
3. Ubah interaksi di `assets/js/app.js`.
4. Jika HTML menggunakan class Tailwind baru atau CSS sumber berubah, jalankan:

```bash
npm ci
npm run build
npm run check
```

Gunakan Node.js 22 atau lebih baru untuk build. `npm run dev` memantau perubahan CSS. CSS dan vendor hasil build sudah disertakan; jangan mengedit `assets/css/styles.css` secara langsung. `DESIGN.md` menjelaskan arah desain dan pemetaan token.

## Fitur

- Navigasi responsif dan penanda bagian aktif.
- Tema terang/gelap dengan preferensi tersimpan.
- Filter 9 karya video: teknologi dan video kreatif.
- Pemutar video dimuat hanya ketika karya dipilih, dengan tautan sumber sebagai alternatif.
- 18 foto dokumentasi, load more, dan pratinjau dengan kontrol keyboard.
- Kontak email/WhatsApp serta salin email dengan feedback.
- Animasi pembukaan bertahap sekitar 1 detik: judul, tombol, foto, dan kategori muncul halus menggunakan opacity/transform tanpa pustaka tambahan. Animasi selesai langsung saat scroll atau fokus keyboard dan menghormati pengaturan reduced motion.
- Tanpa JavaScript, semua karya dan foto dapat dibuka melalui tautan biasa.

## Publikasi ke GitHub Pages

Unggah `index.html`, folder `assets`, dan `CNAME` ke akar repository seperti pada proyek sebelumnya. Folder `images` berisi foto asli dan tetap disertakan untuk pengarsipan serta gambar berbagi sosial. Tidak perlu mengunggah `node_modules`. Domain dalam `CNAME` dipertahankan: `aryaspd.my.id`.

Belum ada perubahan ke website online/repository asli melalui revisi ZIP ini. Video YouTube/Google Drive dan tautan kontak memerlukan internet; video dapat tidak tersedia jika sumbernya dihapus, dibatasi, atau melarang embed. Tautan sumber asli selalu tersedia.

## Struktur

```text
index.html
CNAME
DESIGN.md
src/styles.css
assets/css/styles.css
assets/js/app.js
assets/vendor/
assets/fonts/
assets/images/
images/
scripts/sync-vendor.mjs
package.json
package-lock.json
THIRD_PARTY_NOTICES.md
licenses/
```

Informasi profil, pengalaman, kontak, dan sumber video berasal dari proyek unggahan. Ilustrasi pada kartu video merupakan visualisasi konsep, bukan screenshot proyek.

## Validasi revisi

Build Tailwind, pemeriksaan sintaks JavaScript, formatter, dan audit statis selesai. Pengujian Chromium mencakup filter/expand karya, dialog video, navigasi foto dengan keyboard, fokus dialog, tema tersimpan, clipboard, menu mobile, reduced motion, fallback tanpa JavaScript, dan pembukaan langsung melalui `index.html`.

Tidak ditemukan horizontal overflow pada viewport 320, 390, 600, 768, 1024, dan 1440px. Scan aksesibilitas otomatis tidak menemukan pelanggaran pada tema gelap/terang, dialog foto, dan menu mobile terbuka. Ini merupakan pemeriksaan otomatis, bukan sertifikasi aksesibilitas penuh.

Seluruh foto asli dan `CNAME` dipertahankan byte-for-byte; 19 turunan WebP diverifikasi dapat dibaca. Perilaku UI video serta tautan alternatif diuji dengan sumber eksternal diblokir; ketersediaan dan pemutaran video asli tetap mengikuti penyedia sumber.
