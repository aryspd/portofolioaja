---
version: alpha
name: Arya SPD Portfolio
description: Portofolio Informatika dan karya digital dengan identitas biru, foto pribadi, dan kartu karya yang mudah dijelajahi.
colors:
  background: "#0b1321"
  surface: "#111e30"
  surfaceRaised: "#18273b"
  text: "#f2f5fa"
  muted: "#a6b5c9"
  border: "#2a3b50"
  primary: "#65d9ed"
  onPrimary: "#08202b"
  secondary: "#2977e6"
typography:
  display:
    fontFamily: '"Space Grotesk", system-ui, sans-serif'
  body:
    fontFamily: '"DM Sans", system-ui, sans-serif'
  utility:
    fontFamily: '"IBM Plex Mono", ui-monospace, monospace'
rounded:
  card: "1.5rem"
  control: "0.875rem"
spacing:
  section: "6.5rem"
  pageMax: "76rem"
components:
  button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.onPrimary}"
    rounded: "{rounded.control}"
    height: "48px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
  dialog:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "1.4rem"
---

# Arya SPD Design System

## Overview

Portofolio pribadi untuk perekrut dan calon rekan kerja yang ingin mengenali pengalaman Arya, melihat karya, lalu menghubunginya. Sumber fakta adalah profil, kontak, pengalaman, dan aset dari proyek asli; tidak menambahkan metrik hasil kerja, klien, status ketersediaan, atau penghargaan yang tidak tercantum.

Register: brand/portofolio, satu halaman HTML berbahasa Indonesia. Istilah teknis dan nama jabatan mengikuti sumber. Pengunjung dapat memakai ponsel maupun desktop. Identitas biru dari proyek asli dipertahankan. Foto dengan langit biru dalam bingkai profil miring menjadi ciri utama; halaman lainnya menggunakan komposisi kartu dan timeline yang tenang.

Hindari terminal dekoratif yang mengalahkan isi, grafik persentase keahlian tanpa bukti, gambar stok sebagai dokumentasi pribadi, dan efek 3D yang memperlambat penjelajahan.

Pemilik token adalah `src/styles.css`. File ini mencerminkan nilainya. Alur: variabel CSS → Tailwind/daisyUI → `assets/css/styles.css` → HTML. Perbarui dokumentasi dan sumber CSS bersama-sama; hasil build tidak diedit manual.

## Colors

Biru gelap menjadi latar; cyan digunakan untuk tindakan utama, fokus, dan penanda bagian. Teks utama terang, teks sekunder abu biru. Warna tidak menjadi satu-satunya penanda pemilihan filter: filter juga memiliki `aria-pressed` dan latar berbeda.

Tema terang mengubah peran yang sama: background `#f5f8fc`, surface `#ffffff`, surfaceRaised `#e8eff7`, text `#14243a`, muted `#52647b`, border `#ced9e5`, primary `#086a86`, onPrimary `#ffffff`, secondary `#1658b8`. Pilihan tema disimpan jika penyimpanan browser tersedia. Mode awal mengikuti identitas gelap proyek; pilihan tersimpan diterapkan sebelum stylesheet dimuat.

Ilustrasi kartu video menggunakan biru yang tetap gelap pada kedua tema, dengan teks terang. Ilustrasi berupa diagram konseptual dan judul video, bukan tangkapan layar atau bukti hasil proyek.

## Typography

Space Grotesk untuk judul dan identitas, DM Sans untuk bacaan, IBM Plex Mono untuk kategori dan tanggal. Font tersedia secara lokal. Nama profil menjadi hierarki utama; judul bagian menggunakan ukuran responsif. Isi tidak diratakan kanan-kiri. Tidak menggunakan teks kecil sebagai satu-satunya penjelasan tindakan.

## Layout

Lebar maksimum 76rem. Hero dua kolom, karya tiga kolom, keahlian empat kolom, dokumentasi tiga kolom. Pada 800px navigasi berubah menjadi menu, karya dua kolom, dan pengalaman satu kolom. Pada 600px hero/karya/keahlian satu kolom; dokumentasi dua kolom. Padding halaman turun dari 3rem ke 1.125rem. Gambar memiliki rasio yang dipesan dan font utama dipreload.

## Elevation & Depth

Perbedaan warna permukaan dan border membangun hierarki. Blur hanya untuk header dan backdrop dialog. Bayangan digunakan pada feedback singkat. Tidak ada glow atau animasi latar yang berjalan terus-menerus.

## Shapes

Kartu 1.5rem, kontrol 0.875rem, foto 1.15rem. Ikon menggunakan garis 1.7px. Bingkai foto hero memakai radius lebih besar untuk menandai fokus personal.

## Components

Tombol utama cyan, tombol sekunder berbingkai. Tautan untuk navigasi; tombol untuk tindakan. Semua interaksi memiliki hover, fokus terlihat, dan keadaan ditekan. Tombol salin menampilkan status nyata dari operasi clipboard.

Menu mobile adalah disclosure navigasi nonmodal: tombol memiliki aria-expanded/controls, Escape mengembalikan fokus, tautan menutup menu, dan lebar desktop mereset menu. Filter adalah kelompok tombol ber-aria-pressed, bukan tab. Kategori tersedia tetap; tidak ada pencarian atau keadaan hasil kosong buatan.

Pratinjau memakai satu dialog native dengan judul, tombol tutup, Escape, latar inert, penguncian scroll, dan pengembalian fokus. Galeri memiliki kontrol sebelumnya/berikutnya dan tombol panah keyboard. Video dibuat di dalam dialog hanya setelah dipilih, dihentikan dengan menghapus iframe ketika ditutup, dan selalu memiliki tautan ke sumber asli.

Tanpa JavaScript, semua kartu/foto tersedia sebagai tautan, navigasi tetap terlihat, dan disclosure prestasi tetap bekerja. Kontrol yang memerlukan JavaScript disembunyikan. Tanpa koneksi internet, UI/font/foto tetap tersedia; pemutar video eksternal dan kontak online memerlukan koneksi.

GSAP hanya mengatur masuknya hero dan judul bagian. Konten tidak bergantung pada keberhasilan animasi. Perubahan prefers-reduced-motion membatalkan animasi; transisi dan smooth scroll dinonaktifkan.

| Dokumentasi                         | Token runtime                              | Konsumen                       |
| ----------------------------------- | ------------------------------------------ | ------------------------------ |
| colors.background                   | --canvas                                   | body, scrollbar, tautan kontak |
| colors.surface / surfaceRaised      | --surface / --surface-2                    | kartu, tombol, dialog          |
| colors.text / muted / border        | --text / --muted / --border                | isi dan batas komponen         |
| colors.primary / onPrimary          | --accent / --on-accent                     | tombol utama, filter, fokus    |
| typography.display / body / utility | --font-display / --font-body / --font-code | judul, bacaan, metadata        |
| rounded.card / control              | --radius-card / --radius-control           | kartu dan kontrol              |
| spacing.section / pageMax           | --section-space / --page-width             | bagian dan shell halaman       |

## Do's and Don'ts

- Gunakan konten dan foto pemilik yang tersedia.
- Pertahankan tautan sumber video dan semua informasi kontak.
- Gunakan satu pola tombol, status, dan pratinjau.
- Jangan menambahkan klaim hasil, jumlah klien, CV kosong, atau form pengiriman palsu.
- Jangan menyembunyikan isi penting di balik hover saja.
- Jangan mengganti aset lokal dengan ketergantungan CDN untuk fungsi dasar.
