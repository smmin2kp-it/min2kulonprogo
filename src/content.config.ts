import { defineCollection, z } from 'astro:content'
import { defineConfig, glob } from 'astro/loaders'

const berita = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/berita' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    cover: z.string().optional(),
    excerpt: z.string().optional(),
    draft: z.boolean().optional().default(false),
  }),
})

const galeri = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/galeri' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    photos: z.array(z.string()).default([]),
  }),
})

const halaman = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/halaman' }),
  schema: z.object({
    title: z.string(),
    order: z.number().optional().default(0),
  }),
})

const faq = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/faq' }),
  schema: z.object({
    question: z.string(),
    order: z.number().optional().default(0),
  }),
})

const kurikulum = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/kurikulum' }),
  schema: z.object({
    title: z.string(),
    order: z.number().optional().default(0),
    bab: z.string().optional(),
  }),
})

const keunggulan = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/keunggulan' }),
  schema: z.object({
    icon: z.string().optional(),
    title: z.string(),
    desc: z.string(),
    color: z.string().optional(),
    border: z.string().optional(),
    badge: z.string().optional(),
    order: z.number().optional().default(0),
  }),
})

const statistik = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/statistik' }),
  schema: z.object({
    label: z.string(),
    value: z.string(),
    order: z.number().optional().default(0),
  }),
})

const guruStaf = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guru-staf' }),
  schema: z.object({
    nama: z.string(),
    jabatan: z.string().optional().default(''),
    grup: z.enum(['pendidik', 'tendik']).default('pendidik'),
    foto: z.string().optional().default(''),
    order: z.number().optional().default(0),
  }),
})


const profilSingkat = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/profil-singkat' }),
  schema: z.object({
    judul: z.string(),
    subjudul: z.string().optional().default(''),
    deskripsi1: z.string(),
    deskripsi2: z.string().optional().default(''),
    foto: z.string().optional().default('/images/qngqw.jpg'),
    tahunBerdiri: z.number().optional().default(1980),
    npsn: z.string().optional().default(''),
    nsm: z.string().optional().default(''),
    akreditasi: z.string().optional().default(''),
    lokasi: z.string().optional().default(''),
    tagline: z.string().optional().default(''),
    taglineSub: z.string().optional().default(''),
    badge1Icon: z.string().optional().default(''),
    badge1Title: z.string().optional().default(''),
    badge1Desc: z.string().optional().default(''),
    badge2Icon: z.string().optional().default(''),
    badge2Title: z.string().optional().default(''),
    badge2Desc: z.string().optional().default(''),
    badge3Icon: z.string().optional().default(''),
    badge3Title: z.string().optional().default(''),
    badge3Desc: z.string().optional().default(''),
    badge4Icon: z.string().optional().default(''),
    badge4Title: z.string().optional().default(''),
    badge4Desc: z.string().optional().default(''),
  }),
})

const aplikasiLayanan = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/aplikasi-layanan' }),
  schema: z.object({
    name: z.string(),
    fullName: z.string().optional().default(''),
    desc: z.string(),
    icon: z.string().optional().default('🔗'),
    url: z.string(),
    badge: z.string().optional().default(''),
    order: z.number().optional().default(0),
  }),
})

const carousel = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/carousel' }),
  schema: z.object({
    badge: z.string().optional(),
    subtitle: z.string().optional(),
    title: z.string(),
    description: z.string(),
    image: z.string().default('/images/qngqw.jpg'),
    buttonPrimaryText: z.string().optional(),
    buttonPrimaryLink: z.string().optional(),
    buttonSecondaryText: z.string().optional(),
    buttonSecondaryLink: z.string().optional(),
    order: z.number().optional().default(0),
  }),
})

export const collections = { carousel, berita, galeri, halaman, faq, kurikulum, keunggulan, statistik, guruStaf, aplikasiLayanan, profilSingkat }
