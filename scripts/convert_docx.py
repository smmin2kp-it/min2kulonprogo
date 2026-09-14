#!/usr/bin/env python3
"""Konversi docx KSP MIN 2 Kulon Progo -> beberapa file markdown kurikulum."""
import re, os
import docx

SRC = 'Draf Kurikulum MIN 2 KP 26-27  Revisi.docx'
OUT = 'src/content/kurikulum'

# peta bagian: (nama file, judul, start_par_idx, end_par_idx)
# index paragraph = posisi di daftar paras (filter teks non-kosong)
SECTIONS = [
    ('01-pendahuluan', 'Pendahuluan & Pengesahan',
     ['LEMBAR PENETAPAN'], ['DAFTAR LAMPIRAN']),
    ('02-bab1-karakteristik', 'Bab I — Analisis Karakteristik Madrasah',
     ['BAB I'], ['BAB II']),
    ('03-bab2-visi-misi', 'Bab II — Visi, Misi, dan Tujuan',
     ['BAB II'], ['PENGATURAN BEBAN BELAJAR']),
    ('04-bab3-1-beban-belajar', 'Beban Belajar & Jadwal Pelajaran',
     ['PENGATURAN BEBAN BELAJAR'], ['INTRAKURIKULER']),
    ('05-bab3-2-intrakurikuler', 'Intrakurikuler',
     ['INTRAKURIKULER'], ['KOKURIKULER']),
    ('06-bab3-3-kokurikuler-ekstra', 'Kokurikuler & Ekstrakurikuler',
     ['KOKURIKULER '], ['KEGIATAN PEMBIASAAN']),
    ('07-bab3-4-pembiasaan-program', 'Kegiatan Pembiasaan & Program Khusus',
     ['KEGIATAN PEMBIASAAN'], ['INTEGRASI KURIKULUM']),
    ('08-bab3-5-integrasi', 'Integrasi Kurikulum (Tahfidz, Digitalisasi, dsb)',
     ['INTEGRASI KURIKULUM'], ['KALENDER PENDIDIKAN']),
    ('09-bab3-6-kalender', 'Kalender Pendidikan',
     ['KALENDER PENDIDIKAN'], ['BAB IV PERENCANAAN PEMBELAJARAN']),
    ('10-bab4-perencanaan', 'Bab IV — Perencanaan Pembelajaran, Kenaikan Kelas & Kelulusan',
     ['BAB IV PERENCANAAN PEMBELAJARAN'], ['PERENCANAAN PEMBELAJARAN RUANG LINGKUP KELAS']),
    ('11-bab4-ruang-lingkup', 'Perencanaan Pembelajaran Ruang Lingkup Kelas',
     ['PERENCANAAN PEMBELAJARAN RUANG LINGKUP KELAS'], ['BAB IV']),
    ('12-bab4-evaluasi', 'Pendampingan, Evaluasi & Pengembangan Profesional',
     ['BAB IV'], ['BAB V PENUTUP']),
    ('13-bab5-penutup', 'Bab V — Penutup',
     ['BAB V PENUTUP'], ['LAMPIRAN']),
]

d = docx.Document(SRC)
paras = [p for p in d.paragraphs if p.text.strip()]

def find_start(markers):
    for i, p in enumerate(paras):
        if any(m in p.text.upper() for m in markers):
            return i
    return 0

def find_end(markers):
    for i, p in enumerate(paras):
        if any(m in p.text.upper() for m in markers):
            return i
    return len(paras)

def md_escape(s):
    return s

def table_to_md(t):
    rows = [[c.text.strip().replace('\n', ' ') for c in r.cells] for r in t.rows]
    if not rows:
        return ''
    # cari header unik (duplikat merged di tabel 9 -> gabung)
    header = rows[0]
    # kolom minimal
    maxc = max(len(r) for r in rows)
    while len(header) < maxc:
        header += ['']
    out = '| ' + ' | '.join(header) + ' |\n'
    out += '|' + '---|' * maxc + '\n'
    for r in rows[1:]:
        while len(r) < maxc:
            r += ['']
        out += '| ' + ' | '.join(r) + ' |\n'
    return out

# mapping: urutkan tabel sesuai posisinya dalam alur dokumen
# kita render markdown per section: gabung paragraph + tabel sesuai urutan asli dokumen
# karena python-docx bedakan body elements, kita gunakan pendekatan: setiap tabel
# muncul setelah paragraph tertentu. Simpan index tabel via body order.

body = d.element.body
from docx.table import Table
from docx.text.paragraph import Paragraph

items = []  # (type, obj)
for child in body.iterchildren():
    if child.tag.endswith('}p'):
        items.append(('p', Paragraph(child, d)))
    elif child.tag.endswith('}tbl'):
        items.append(('t', Table(child, d)))

# kumpulkan teks paragraph + tabel secara berurutan, bangun markdown per section
# pertama bangun daftar teks per item
def item_text(it):
    if it[0] == 'p':
        return it[1].text.strip()
    # tabel -> seluruh sel digabung utk pencarian marker
    t = it[1]
    return ' '.join(c.text for r in t.rows for c in r.cells)

os.makedirs(OUT, exist_ok=True)

# hitung posisi marker dari heading (bukan semua item)
import re
marker_idx = {}
all_items = []

# bangun daftar pasangan (item, txt_upper) dulu
tmp = []
for it in items:
    tmp.append((it, item_text(it).upper().strip()))

# daftar marker dengan regex start-an (agar "BAB IV" tidak kena "BAB I")
MARKERS = [
    ('LEMBAR PENETAPAN', r'^LEMBAR PENETAPAN'),
    ('DAFTAR LAMPIRAN', r'^DAFTAR LAMPIRAN'),
    ('BAB IV PERENCANAAN PEMBELAJARAN', r'^BAB IV PERENCANAAN'),
    ('PERENCANAAN PEMBELAJARAN RUANG LINGKUP KELAS', r'^PERENCANAAN PEMBELAJARAN RUANG LINGKUP KELAS'),
    ('BAB IV', r'^BAB IV\b'),
    ('BAB III', r'^BAB III\b'),
    ('BAB II', r'^BAB II\b'),
    ('BAB I', r'^BAB I\b'),
    ('PENGATURAN BEBAN BELAJAR', r'^PENGATURAN BEBAN BELAJAR'),
    ('INTRAKURIKULER', r'^INTRAKURIKULER'),
    ('KOKURIKULER', r'^KOKURIKULER\W'),
    ('KEGIATAN PEMBIASAAN', r'^KEGIATAN PEMBIASAAN'),
    ('INTEGRASI KURIKULUM', r'^INTEGRASI KURIKULUM'),
    ('KALENDER PENDIDIKAN', r'^KALENDER PENDIDIKAN'),
    ('BAB V PENUTUP', r'^BAB V'),
    ('LAMPIRAN', r'^LAMPIRAN'),
]
# cari marker hanya pada baris Heading (paragraf dgn style Heading)
for i, (it, txt) in enumerate(tmp):
    if it[0] == 'p' and it[1].style and it[1].style.name.startswith('Heading'):
        ht = it[1].text.strip().upper()
        for name, pat in MARKERS:
            if re.match(pat, ht) and name not in marker_idx:
                marker_idx[name] = i

all_items = tmp

def sec_start_idx(markers):
    for m in markers:
        if m in marker_idx:
            return marker_idx[m]
    return 0

def sec_end_idx(markers, after=0):
    for m in markers:
        if m in marker_idx and marker_idx[m] > after:
            return marker_idx[m]
    return len(all_items)

frontmatter = '''---\ntitle: "{title}"\norder: {order}\nbab: "{bab}"\n---\n\n'''

def txt2md(txt):
    # konversi teks polos ke markdown (bold marker manual tak perlu)
    return txt

results = []
for order, (fname, title, starts, ends) in enumerate(SECTIONS, start=1):
    s = sec_start_idx(starts)
    e = sec_end_idx(ends, after=s)
    lines = []
    nested_table_buf = []  # tabel marker khusus utk tabel yang terpisah di bawah
    for i in range(s, e):
        typ, obj = all_items[i][0]
        txt = all_items[i][1] if all_items[i][0][0] == 'p' else item_text(all_items[i][0])
        if typ == 'p':
            p = obj
            st = p.style.name if p.style else ''
            t = p.text.strip()
            if not t:
                continue
            if st == 'Heading 1':
                lines.append(f'\n## {t}\n')
            elif st == 'Heading 2':
                lines.append(f'\n### {t}\n')
            elif st == 'Heading 3':
                lines.append(f'\n#### {t}\n')
            else:
                # number/bullet sederhana
                lines.append(t)
        else:
            md = table_to_md(obj)
            if md:
                lines.append('\n' + md)
    body = '\n\n'.join(lines)
    # bersihkan \n ganda
    body = re.sub(r'\n{3,}', '\n\n', body)
    fname_full = f'{fname}.md'
    with open(os.path.join(OUT, fname_full), 'w', encoding='utf-8') as f:
        f.write(frontmatter.format(title=title, order=order, bab=fname.split('-')[0].upper()))
        f.write(body)
    results.append((fname_full, len(body)))

print('TOTAL FILES', len(results))
for fn, ln in results:
    print(fn, ln)
