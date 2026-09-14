# Web MIN 2 Kulon Progo

Website statis profil + kurikulum MIN 2 Kulon Progo. Astro + Tailwind + Decap CMS + Cloudflare Pages.

## Perintah

```bash
npm install        # install dependencies
npm run dev        # jalankan lokal (http://localhost:4321)
npm run build      # build produksi ke dist/
npm run preview    # pratinjau hasil build
```

## Struktur

```
src/
  content/         # konten (berita, galeri, halaman, faq, kurikulum)
  components/      # komponen UI
  layouts/         # template layout
  pages/           # rute/halaman
  lib/             # util
public/
  admin/           # Decap CMS (login di /admin)
  images/          # upload gambar
```

## Konten

- `src/content/berita/` — berita baru, format `.md` dengan frontmatter `title`, `date`, `cover`, `excerpt`
- `src/content/galeri/` — album galeri, frontmatter `photos` (daftar path gambar)
- `src/content/halaman/` — halaman statis (profil, visi-misi, program, kontak)
- `src/content/faq/` — pertanyaan/jawaban
- `src/content/kurikulum/` — isi dokumen kurikulum per bagian

Tambah konten = buat file markdown (atau lewat Decap CMS di `/admin`), lalu `npm run build`.

## Deploy

Push repo ke GitHub → hubungkan ke Cloudflare Pages (build: `npm run build`, output: `dist`) → web live di `min2kp.pages.dev`.

Admin: buka `/admin`, login GitHub, isi form, klik Publish → otomatis commit + build + deploy oleh Cloudflare Pages.
