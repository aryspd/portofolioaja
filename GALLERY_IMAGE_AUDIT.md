# Audit dan perbaikan layout galeri

## Kondisi arsip yang diperiksa
- Galeri terbaru berisi 12 foto dan seluruh 12 file tersedia di `assets/images/`.
- Indeks lightbox sebelumnya tidak berurutan dan digunakan sebagai syarat visibilitas (`x-show`). Ini membuat hanya sebagian kartu muncul saat awal dibuka.
- Markup anchor tidak konsisten sehingga browser dapat memperbaiki struktur DOM dengan cara yang tidak diinginkan.

## Perbaikan
- Menata ulang 12 kartu yang sudah ada, tanpa menambah, mengganti, atau mengedit foto.
- Mengurutkan `data-photo-index`, `x-show`, dan `openPhoto()` dari 0 sampai 11.
- Menampilkan enam foto pertama saat awal; enam foto lain melalui tombol “Lihat semua 12 foto”.
- Menyamakan `href` dan `img src` pada setiap kartu.
- Merapikan tag anchor menjadi sibling yang valid di CSS Grid.
- Menata layout 3 kolom desktop, 2 kolom tablet, dan 1 kolom layar kecil.
- Menyinkronkan CSS sumber dan stylesheet hasil build.

## Perlindungan foto
Tidak ada file gambar yang diedit, dikompres, dikonversi, diganti nama, dipindahkan, atau dihapus. Semua file foto dipertahankan byte-for-byte.

## Validasi
- 12 kartu galeri terdeteksi.
- 12 path foto tersedia dan dapat dibaca.
- 12 anchor pembuka dan penutup seimbang.
- Indeks lightbox berurutan 0–11.
- Enam kartu pertama menjadi visible pada pemuatan awal.
- Hash SHA-256 foto tetap sama sebelum dan sesudah perubahan.
- Pemeriksaan sintaks JavaScript melalui `npm run check` lulus.
- Pengujian browser visual belum dilakukan.
- Tidak dilakukan deployment.
