---
version: alpha
name: Arya SPD Portfolio
description: Portofolio cinematic dengan foto pribadi, komposisi poster, kedalaman CSS 3D, dan karya yang mudah dijelajahi.
colors:
  background: "#080d10"
  surface: "#10191c"
  surfaceRaised: "#19262b"
  text: "#f3f1e9"
  muted: "#a8b8bb"
  border: "#2b3e43"
  primary: "#a7e7dd"
  onPrimary: "#08231f"
  secondary: "#dfba7c"
  gold: "#dfba7c"
typography:
  display:
    fontFamily: '"Space Grotesk", system-ui, sans-serif'
  body:
    fontFamily: '"DM Sans", system-ui, sans-serif'
  utility:
    fontFamily: '"IBM Plex Mono", ui-monospace, monospace'
rounded:
  card: "0.75rem"
  control: "0.5rem"
spacing:
  section: "7.5rem"
  pageMax: "84rem"
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
    rounded: "0.75rem"
---

# Arya SPD Design System

## Overview

Portofolio pribadi untuk perekrut dan calon rekan kerja yang ingin mengenali pengalaman Arya, melihat karya, lalu menghubunginya. Sumber fakta adalah profil, kontak, pengalaman, dan aset dari proyek asli; tidak menambahkan metrik hasil kerja, klien, status ketersediaan, atau penghargaan yang tidak tercantum.

Register: brand/portofolio, satu halaman HTML berbahasa Indonesia. Arah cinematic disetujui melalui permintaan pengguna: sebuah poster pembuka dengan tipografi besar, gambar bergradasi, garis viewfinder, contact sheet dokumentasi, dan bingkai berlapis dalam ruang 3D. Subjek tetap seorang lulusan Informatika dan kreator digital, bukan klaim sebagai sutradara film. Gambar dan data berasal dari proyek asli.

North Star: poster pembuka dalam ruang editing yang gelap, diteruskan menjadi katalog karya, catatan perjalanan, keahlian, contact sheet, dan penutup kontak. Teal memberi arah teknis; emas menandai kategori dan detail editorial. Gunakan kedalaman terutama di hero dan karya. Hindari model 3D berat yang menghalangi baca, autoplay audio/video, kursor buatan, scroll yang dibajak, loader panjang, serta dokumentasi atau klaim klien yang tidak terbukti.

Pemilik token adalah `src/styles.css`. File ini mencerminkan nilainya. Alur: variabel CSS → Tailwind/daisyUI → `assets/css/styles.css` → HTML. Perbarui dokumentasi dan sumber CSS bersama-sama; hasil build tidak diedit manual.

## Colors

Hitam kehijauan menjadi latar; teal digunakan untuk tindakan utama dan fokus. Emas memberi aksen editorial. Teks utama putih hangat, teks sekunder abu teal. Warna tidak menjadi satu-satunya penanda pemilihan filter: filter juga memiliki `aria-pressed` dan latar berbeda.

Tema terang mengubah peran yang sama: background `#f5f8fc`, surface `#ffffff`, surfaceRaised `#e8eff7`, text `#14243a`, muted `#52647b`, border `#ced9e5`, primary `#086a86`, onPrimary `#ffffff`, secondary/gold `#8a5c25`. Pilihan tema disimpan jika penyimpanan browser tersedia. Mode awal mengikuti identitas gelap proyek; pilihan tersimpan diterapkan sebelum stylesheet dimuat.

Ilustrasi kartu video menggunakan bidang teal, zaitun, dan cokelat gelap pada kedua tema, dengan teks terang. Ilustrasi berupa diagram konseptual dan judul video, bukan tangkapan layar atau bukti hasil proyek.

## Typography

Space Grotesk untuk judul dan identitas, DM Sans untuk bacaan, IBM Plex Mono untuk kategori dan tanggal. Font tersedia secara lokal. Nama profil menjadi judul poster dengan huruf kapital dan baris kedua ber-outline. Judul bagian menggunakan ukuran besar yang responsif; satu kata aksen menandai akhir frasa. Isi tidak diratakan kanan-kiri. Tidak menggunakan teks kecil sebagai satu-satunya penjelasan tindakan.

## Layout

Lebar maksimum 84rem. Hero dua kolom dengan portrait stage ber-perspective; karya tiga kolom, keahlian empat kolom, dokumentasi tiga kolom. Pada 1100px karya dan keahlian menjadi dua kolom; pada 800px navigasi berubah menjadi menu, dan pengalaman satu kolom. Pada 600px hero/karya/keahlian satu kolom; dokumentasi dua kolom. Padding halaman turun dari 3rem ke 1.125rem. Gambar memiliki rasio yang dipesan dan font utama dipreload. Bingkai hero dibatasi oleh overflow clip di hero; area baca lain tetap memakai scroll dokumen yang biasa.

## Elevation & Depth

Foto hero adalah bidang CSS 3D dengan backplate di kedalaman -65px, contact sheet +45px, dan kartu identitas +75px. Tilt berada di pembungkus yang berbeda dari animasi masuk sehingga tidak menimpa transformasi satu sama lain. Kartu video/foto memiliki perspektif tanpa menyembunyikan isi atau membatasi tindakan pada hover. Bayangan paling kuat berada pada poster; elemen lain memakai border dan perbedaan warna. Grain statis berasal dari SVG lokal dalam CSS, tanpa jaringan. Cahaya latar hanya bergerak saat hero terlihat dan tab aktif.

## Shapes

Kartu video 0.75rem, kontrol 0.5rem, bingkai poster 0.5rem. Galeri berbentuk contact sheet dengan padding kecil dan radius 0.3rem. Ikon menggunakan garis 1.7px. Kontrol ikon berbentuk lingkaran; navigasi mobile tetap memiliki area sentuh yang memadai.

## Components

Tombol utama teal, tombol sekunder berbingkai. Tautan untuk navigasi; tombol untuk tindakan. Semua interaksi memiliki hover, fokus terlihat, dan keadaan ditekan. Tombol salin menampilkan status nyata dari operasi clipboard.

Menu mobile adalah disclosure navigasi nonmodal: tombol memiliki aria-expanded/controls, Escape mengembalikan fokus, tautan menutup menu, dan lebar desktop mereset menu. Filter adalah kelompok tombol ber-aria-pressed, bukan tab. Kategori tersedia tetap; tidak ada pencarian atau keadaan hasil kosong buatan.

Pratinjau memakai satu dialog native dengan judul, tombol tutup, Escape, latar inert, penguncian scroll, dan pengembalian fokus. Galeri memiliki kontrol sebelumnya/berikutnya dan tombol panah keyboard. Video dibuat di dalam dialog hanya setelah dipilih, dihentikan dengan menghapus iframe ketika ditutup, dan selalu memiliki tautan ke sumber asli.

Tanpa JavaScript, semua kartu/foto tersedia sebagai tautan, navigasi tetap terlihat, dan disclosure prestasi tetap bekerja. Kontrol yang memerlukan JavaScript disembunyikan. Tanpa koneksi internet, UI/font/foto tetap tersedia; pemutar video eksternal dan kontak online memerlukan koneksi.

GSAP mengatur pembukaan cinematic sekitar 1.4 detik: header dan metadata, judul dan pengantar, tombol, kemudian poster dengan rotationX/rotationY dan contact sheet pada kedalaman berbeda. Gunakan opacity/transform; tidak ada loader atau audio/video autoplay. Urutan diselesaikan langsung ketika pengunjung scroll atau memindahkan fokus, kemudian properti animasi inline dibersihkan. Judul bagian dan kartu muncul sekali saat discroll.

Di desktop, kamera hero bergerak 35px dan berputar 5 derajat mengikuti scroll; tidak ada pengambilalihan scroll. Tilt pointer dibatasi 7 derajat pada hero dan 3.5 derajat pada kartu. Interpolasi requestAnimationFrame berhenti ketika target tercapai, saat fokus keyboard, atau tab tidak aktif. Touch tidak menjalankan tilt pointer. Tombol pause/play di header menyimpan preferensi animasi; preferensi reduced motion perangkat selalu diutamakan dan menonaktifkan kontrol tersebut. Semua gerakan, reveal, dan smooth scroll berhenti bila animasi dipause. Pergantian preferensi tidak mengulang pembukaan. Jika script animasi tidak termuat, semua konten dan interaksi dasar tetap tersedia.

| Dokumentasi                         | Token runtime                              | Konsumen                       |
| ----------------------------------- | ------------------------------------------ | ------------------------------ |
| colors.background                   | --canvas                                   | body, scrollbar, tautan kontak |
| colors.surface / surfaceRaised      | --surface / --surface-2                    | kartu, tombol, dialog          |
| colors.text / muted / border        | --text / --muted / --border                | isi dan batas komponen         |
| colors.primary / onPrimary          | --accent / --on-accent                     | tombol utama, filter, fokus    |
| colors.secondary / gold             | --blue / --gold                            | kategori, metadata, aksen      |
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
