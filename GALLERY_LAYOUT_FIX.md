# Perbaikan layout galeri

## Masalah
Indeks lightbox pada beberapa kartu tidak berurutan (0, 19, 5, 15, 14, 16, dan seterusnya). Kondisi `x-show` menggunakan indeks tersebut untuk menentukan foto yang terlihat saat awal, sehingga hanya dua foto tampil dan sebagian besar grid kosong.

## Perbaikan
- Menyusun ulang 12 kartu foto yang sudah ada menjadi urutan visual 0–11.
- Menyamakan indeks lightbox dan indeks visibilitas.
- Menampilkan 6 foto saat halaman pertama dibuka.
- Tombol “Lihat semua 12 foto” menampilkan foto sisanya.
- Grid desktop 3 kolom, tablet 2 kolom, ponsel kecil 1 kolom.
- Thumbnail konsisten dengan rasio 4:3 dan object-fit cover.
- Merapikan HTML agar tidak ada anchor kosong/bersarang.

## File kode yang diubah
- `index.html`
- `src/styles.css`
- `assets/css/styles.css`

Dokumentasi terkait juga diperbarui.

## Foto
Tidak ada foto yang diubah. Nama, format, lokasi, dimensi, dan konten file gambar tetap persis seperti arsip pengguna.

## Validasi
Pemeriksaan statis HTML dan path gambar lulus. Pemeriksaan sintaks JavaScript dijalankan melalui `npm run check`. Pengujian browser visual lintas ukuran layar belum dilakukan.
