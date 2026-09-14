# RENCANA WEB MIN 2 KULON PROGO

> Dokumen garis besar. Dibuat 2026-08-24. Semua keputusan penting dicatat di sini biar tidak salah paham.

---

## 1. TUJUAN & CAKUPAN

Web profil + kurikulum madrasah. **Bukan** toko, **bukan** aplikasi PPDB, **bukan** sistem nilai.

**Sumber konten:** `Draf Kurikulum MIN 2 KP 26-27 Revisi.docx` (KSP — Kurikulum Satuan Pendidikan, 228rb karakter, 62 tabel, 17 gambar, 5 bab).

**Yang disertakan:**
- Profil madrasah: sejarah, identitas (NSM/NPSN/Lokasi), visi & misi, tujuan
- Data madrasah: murid, guru & tenaga kependidikan (dari tabel docx)
- Keunggulan & program: Adiwiyata, Tahfidz, Digitalisasi, Madrasah Ramah Anak, SPAB, Gerakan Literasi, dll
- Kurikulum: struktur, intrakurikuler/kokurikuler/ekstrakurikuler, jadwal, kalender pendidikan, perencanaan pembelajaran, kenaikan kelas & kelulusan
- Berita (dikelola admin nanti)
- Galeri kegiatan (dikelola admin nanti)
- FAQ
- Kontak

**Yang TIDAK disertakan:** PPDB, login siswa, pembayaran, fitur apa pun yang butuh simpan data pengguna.

---

## 2. ARSITEKTUR: STATIS + CMS BERBASIS GIT

**Prinsip:** web = HTML statis. Konten = file (`.md` + gambar). Admin awam tidak pernah menyentuh kode.

```
+---------------+      +------------------+      +-----------------+
|  Admin sekolah  | --> |  Decap CMS       | --> |  Repo GitHub    |
|  (browser)      |     |  (bayangkan      |     |  (konten +      |
|  buka /admin    |     |  dashboard WP)   |     |  gambar sebagai |
+---------------+      |  di domain-mu    |      |  file)          |
                        +------------------+      +-----------------+
                                                          |
                                                          v
+----------------+      +------------------+      +-----------------+
| Pengunjung     | <--  |  Cloudflare Pages |  <-- | build otomatis  |
| (browser)      |      |  (gratis,         |      | tiap admin      |
| datang         |      |  bandwidth        |      | simpan = push)  |
+----------------+      |  unlimited)       |      +-----------------+
                        +------------------+
```

**Alur kerja (sudah disepakati):**
1. Admin buka `https://web-kita.pages.dev/admin`
2. Login pakai akun GitHub **milik developer** (bukan akun admin sekolah)
3. Admin isi form: berita baru / upload foto galeri / edit halaman / edit FAQ → klik Publish
4. Decap CMS menyimpan file + gambar + commit ke repo GitHub developer
5. Cloudflare Pages mendeteksi push → build ulang → web ter-update otomatis
6. Admin selesai. Tidak lihat kode, tidak lihat git, tidak buka terminal.

**Konsekuensi yang disepakati:**
- Satu akun GitHub = milik developer (repo, login admin, build). Tanpa biaya.
- Admin hanya tahu URL `/admin` + cara isi form + klik Publish.
- Perlu internet pada saat admin menyimpan (bukan saat pengunjung membaca).

---

## 3. TECH STACK (FINAL — TIDAK BERUBAH LAGI)

| Layer | Pilihan | Catatan |
|---|---|---|
| Bahasa | TypeScript | type-check konten & konfigurasi |
| Framework | **Astro** | output statis murni, tanpa JS di browser |
| Styling | **Tailwind CSS** | class utility, custom tema madrasah |
| CMS | **Decap CMS** | panel form untuk admin awam, tanpa koding |
| Data | File `.md` + folder `public/images/` | pengganti database |
| Version control | **GitHub** (akun developer) | repo + login admin + trigger build |
| Hosting | **Cloudflare Pages** (gratis) | bandwidth unlimited, 500 build/bulan, 20rb file, no kartu kredit |
| Form kontak | Web3Forms | tanpa server, email masuk ke inbox sekolah |
| SEO | Sitemap + meta tag per halaman | cloudflare otomatis |
| Analitik | Google Analytics / Plausible | snippet kecil |

**Biaya:** Rp 0 selamanya (GitHub gratis + Cloudflare Pages gratis).

**Struktur konten:**
```
content/
  berita/       # *.md berita (judul, tanggal, gambar cover, isi)
  galeri/       # *.md album (judul, deskripsi, daftar foto)
  halaman/      # *.md halaman statis (profil, visi-misi, dll)
  faq/          # *.md tanya-jawab
  kurikulum/    # *.md per bab
public/images/  # semua file gambar (upload admin/developer)
```

---

## 4. STRUKTUR HALAMAN

```
/                       Beranda (hero, ringkasan profil, program, berita, galeri, FAQ singkat, kontak)
/profil                Sejarah, identitas madrasah, alamat, kepala
/visi-misi             Visi, misi, indikator, tujuan
/guru-staf             Data pendidik & tenaga kependidikan
/data-madrasah         Tabel statistik: murid, orang tua, jarak, dll
/kurikulum             Ringkasan kurikulum + unduh dokumen PDF
  /kurikulum/struktur  Intrakurikuler, kokurikuler, ekstrakurikuler
  /kurikulum/program   Adiwiyata, Tahfidz, Digitalisasi, dll
  /kurikulum/kalender  Kalender pendidikan & jadwal
/berita                Listing berita (pagination)
/berita/[slug]         Detail berita
/galeri                Album kegiatan
/galeri/[album]        Foto per album
/faq                   Pertanyaan umum
/kontak                Alamat, telepon, email, map, form kontak
/admin                 Decap CMS (login admin)
```

---

## 5. DATA DARI CLIENT (BELUM LENGKAP — PERLU DIMINTA)

Tidak menghambat pembangunan (pakai placeholder dulu), tapi wajib dikumpulkan:

| Butuh | Status |
|---|---|
| Foto gedung & kegiatan (10–20) | ❌ belum ada (docx hanya 17 gambar internal: logo/diagram) |
| Logo madrasah + logo Kemenag (PNG transparan) | ❌ belum ada file terpisah |
| Kontak: telepon, email, sosial media, alamat lengkap | ⚠️ alamat ada, kontak lain belum |
| Keputusan: kurikulum full di web atau ringkas + PDF | ⚠️ perlu konfirmasi |

---

## 6. LANGKAH PENGERJAAN

1. Scaffold project Astro + Tailwind (di direktori kerja ini)
2. Setup struktur konten + Decap CMS
3. Konversi isi docx → file konten (markdown per bab/bagian)
4. Bangun halaman (beranda, profil, kurikulum, berita, galeri, faq, kontak)
5. Uji lokal sampai jalan penuh
6. Siapkan repo GitHub + hubungkan ke Cloudflare Pages + domain
7. Upload konten awal + gambar
8. Kasih panduan singkat ke admin (cara buka /admin + isi form)
9. Serahkan. Pembayaran developer tidak ada beban server (Rp 0).

---

## 7. PENGINGAT / KEPUTUSAN YANG SUDAH DIAMBIL (AGAR TIDAK KEMBALI LAGI)

- ❌ Bukan PHP, bukan Laravel, bukan WordPress, bukan Oracle, bukan VPS berbayar, bukan server & DB sendiri.
- ✅ Statis + Astro + Decap CMS + GitHub + Cloudflare Pages. Semua gratis, tanpa server yang dipelihara.
- ✅ Admin awam: hanya lewat form di `/admin`, login pakai akun GitHub developer.
- ⚠️ Data belum lengkap (foto, logo, kontak) — kerjakan dengan placeholder, lengkapi nanti.
- ⚠️ Keputusan tergantung client: isi kurikulum full atau ringkas + PDF.

---

## 8. BATASAN HOSTING CLOUDFLARE (GRATIS)

| Batas | Nilai |
|---|---|
| Build per bulan | 500 |
| File per situs | 20.000 |
| Max 1 file | 25 MiB |
| Bandwidth statis | Unlimited |
| Build timeout | 20 menit |
