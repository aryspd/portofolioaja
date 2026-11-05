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
- 12 foto dokumentasi yang tersedia pada galeri, load more, dan pratinjau dengan kontrol keyboard.
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

## Validasi revisi terbaru

Pemeriksaan statis galeri dan path foto dilakukan pada arsip terbaru. Seluruh 12 foto yang direferensikan galeri tersedia. Tidak ada file foto yang diubah. Pemeriksaan sintaks JavaScript melalui `npm run check` lulus. Pengujian visual browser lintas viewport belum dilakukan.

Detail perubahan tersedia pada `GALLERY_LAYOUT_FIX.md` dan `GALLERY_IMAGE_AUDIT.md`.

## Pembaruan konten portofolio 2026

### Pengalaman kerja
Entri terbaru ditambahkan pada urutan pertama timeline:
**INOVASI DIGITAL – Bootcamp 0°Latitude Academy Batch 1 (2026)**, dengan uraian analisis spasial, interpretasi citra satelit, AI/ML, analisis risiko lingkungan-sosial-legal, studi kasus lapangan, serta penggunaan QGIS, ArcGIS, Google Earth Engine, dan Python.

### Peserta & kegiatan
Entri **Peserta Bootcamp 0°Latitude Academy Batch 1 (2026)** ditambahkan pada urutan pertama daftar Prestasi & Kegiatan. Detail program empat bulan tersedia melalui elemen "Tentang kegiatan".

### Keahlian
Kategori baru **GIS, Remote Sensing & Data Analytics** ditambahkan tanpa mengganti judul bagian "Teknis, sekaligus kreatif." Kategori memuat:
- QGIS & ArcGIS
- Google Earth Engine
- Remote Sensing
- Spatial Analysis
- Python for Data Analysis
- AI & Machine Learning Fundamentals

### Dokumentasi dan aset
- Source stylesheet yang diedit adalah `src/styles.css`; `assets/css/styles.css` merupakan hasil build.
- Aset foto dalam `assets/images/` dan `images/` dipertahankan. Tidak ada aset foto profil atau galeri yang diganti nama.
- Perubahan ini tidak melakukan deployment.


## Perbaikan layout galeri
Markup galeri diperbaiki dengan menghapus elemen anchor kosong yang sebelumnya membuat satu sel grid kosong di kiri atas. Seluruh gambar, path aset, alt text, dan interaksi lightbox dipertahankan. Label tombol galeri diselaraskan menjadi 18 foto. Detail tercatat pada `GALLERY_LAYOUT_FIX.md`.


## Perbaikan layout galeri
Markup galeri diperbaiki dengan menghapus elemen anchor kosong yang sebelumnya membuat satu sel grid kosong di kiri atas. Kesembilan kartu foto, path aset, alt text, dan interaksi lightbox tetap dipertahankan. Detail tersedia pada `GALLERY_LAYOUT_FIX.md`.


## Gallery image audit and repair
Lihat `GALLERY_IMAGE_AUDIT.md` untuk daftar 25 foto, penyamaan path aset, perbaikan indeks lightbox, serta status validasi.
