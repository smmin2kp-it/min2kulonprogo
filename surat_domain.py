from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.pdfgen import canvas
import os

OUTPUT = os.path.join(os.path.dirname(__file__), "Surat_Permohonan_Domain_MIN2KP.pdf")

def draw_field(c, x, y, label, value, col_x, bold_val=False):
    """Label bold di x, titik dua + value di col_x."""
    c.setFont("Helvetica-Bold", 10)
    c.drawString(x, y, label)
    c.setFont("Helvetica-Bold" if bold_val else "Helvetica", 10)
    c.drawString(col_x, y, ":   " + value)

def build():
    c = canvas.Canvas(OUTPUT, pagesize=A4)
    w, h = A4
    LM = 3 * cm
    RM = 2.5 * cm
    COL = LM + 75       # posisi titik dua — semua field pakai ini
    COL_IN = LM + 30    # indent untuk identitas & data domain
    COL_IN2 = COL_IN + 75  # titik dua untuk section indented
    y = h - 2 * cm

    # ===== KOP =====
    c.setFont("Helvetica", 8.5)
    c.drawCentredString(w/2, y, "KEMENTERIAN AGAMA REPUBLIK INDONESIA"); y -= 12
    c.drawCentredString(w/2, y, "KANTOR KEMENTERIAN AGAMA KABUPATEN KULON PROGO"); y -= 16

    c.setFillColor(colors.HexColor("#1b5e20"))
    c.setFont("Helvetica-Bold", 13)
    c.drawCentredString(w/2, y, "MADRASAH IBTIDAIYAH NEGERI 2 KULON PROGO"); y -= 13

    c.setFillColor(colors.HexColor("#666666"))
    c.setFont("Helvetica-Oblique", 8)
    c.drawCentredString(w/2, y, "Terakreditasi A (Unggul)"); y -= 12

    c.setFillColor(colors.HexColor("#1a1a1a"))
    c.setFont("Helvetica", 8.5)
    c.drawCentredString(w/2, y, "Dusun Dukuh, Kalurahan Ngestiharjo, Kapanewon Wates, Kabupaten Kulon Progo, DIY 55651"); y -= 11
    c.drawCentredString(w/2, y, "NSM: 111134010002   |   NPSN: 60714005"); y -= 7

    c.setStrokeColor(colors.HexColor("#1b5e20"))
    c.setLineWidth(2.5); c.line(LM, y, w - RM, y); y -= 3
    c.setLineWidth(0.5); c.line(LM, y, w - RM, y); y -= 18

    # ===== NOMOR / HAL =====
    c.setFillColor(colors.HexColor("#1a1a1a"))
    draw_field(c, LM, y, "Nomor", "B-     /Mi.34.01.02/TL.00/08/2026", COL); y -= 15
    draw_field(c, LM, y, "Lampiran", "1 (satu) lembar", COL); y -= 15
    draw_field(c, LM, y, "Hal", "Permohonan Pendaftaran Domain min2kulonprogo.sch.id", COL, bold_val=True); y -= 20

    # ===== KEPADA =====
    c.setFont("Helvetica", 10)
    c.drawString(LM, y, "Kepada Yth."); y -= 14
    c.setFont("Helvetica-Bold", 10)
    c.drawString(LM, y, "Pengelola Nama Domain Internet Indonesia (PANDI)"); y -= 14
    c.setFont("Helvetica", 10)
    c.drawString(LM, y, "di Tempat"); y -= 20

    # ===== SALAM =====
    c.setFont("Helvetica-Oblique", 10)
    c.drawString(LM, y, "Assalamu'alaikum Warahmatullahi Wabarakatuh."); y -= 16

    c.setFont("Helvetica", 10)
    c.drawString(LM, y, "Yang bertanda tangan di bawah ini:"); y -= 16

    # ===== IDENTITAS (indented, titik dua sejajar) =====
    draw_field(c, COL_IN, y, "Nama", "Hartati, S.Pd.I., M.Pd.", COL_IN2); y -= 15
    draw_field(c, COL_IN, y, "NIP", "............................................................", COL_IN2); y -= 15
    draw_field(c, COL_IN, y, "Jabatan", "Kepala Madrasah", COL_IN2); y -= 15
    draw_field(c, COL_IN, y, "Instansi", "Madrasah Ibtidaiyah Negeri (MIN) 2 Kulon Progo", COL_IN2); y -= 15
    draw_field(c, COL_IN, y, "Alamat", "Dusun Dukuh, Kel. Ngestiharjo, Kap. Wates, Kulon Progo, DIY", COL_IN2); y -= 18

    # ===== ISI =====
    c.setFont("Helvetica", 10)
    c.drawString(LM, y, "dengan ini mengajukan permohonan pendaftaran nama domain internet untuk keperluan"); y -= 14
    c.drawString(LM, y, "website resmi madrasah kami, dengan data sebagai berikut:"); y -= 16

    # ===== DATA DOMAIN (indented, titik dua sejajar dengan identitas) =====
    draw_field(c, COL_IN, y, "Nama Domain", "min2kulonprogo.sch.id", COL_IN2, bold_val=True); y -= 15
    draw_field(c, COL_IN, y, "Instansi", "MIN 2 Kulon Progo", COL_IN2); y -= 15
    draw_field(c, COL_IN, y, "Jenis", "Lembaga Pendidikan Dasar (Madrasah Ibtidaiyah Negeri)", COL_IN2); y -= 15
    draw_field(c, COL_IN, y, "Kementerian", "Kementerian Agama Republik Indonesia", COL_IN2); y -= 18

    # ===== PENUTUP =====
    c.setFont("Helvetica", 10)
    c.drawString(LM, y, "Domain tersebut akan digunakan sebagai alamat website resmi madrasah untuk menyampaikan"); y -= 14
    c.drawString(LM, y, "informasi profil, kegiatan, berita, dan layanan pendidikan kepada masyarakat."); y -= 16

    c.drawString(LM, y, "Demikian surat permohonan ini kami sampaikan. Atas perhatian dan kerja samanya, kami"); y -= 14
    c.drawString(LM, y, "ucapkan terima kasih."); y -= 16

    c.setFont("Helvetica-Oblique", 10)
    c.drawString(LM, y, "Wassalamu'alaikum Warahmatullahi Wabarakatuh."); y -= 26

    # ===== TTD — rata kanan =====
    tx = w - RM - 7 * cm
    c.setFont("Helvetica", 10)
    c.drawString(tx, y, "Wates, .................. Agustus 2026"); y -= 14
    c.drawString(tx, y, "Kepala Madrasah,"); y -= 55

    nama = "Hartati, S.Pd.I., M.Pd."
    c.setFont("Helvetica-Bold", 10)
    nw = c.stringWidth(nama, "Helvetica-Bold", 10)
    c.drawString(tx, y, nama)
    c.setStrokeColor(colors.HexColor("#1a1a1a"))
    c.setLineWidth(0.5)
    c.line(tx, y - 1.5, tx + nw, y - 1.5); y -= 14

    c.setFont("Helvetica", 10)
    c.drawString(tx, y, "NIP. ........................................")

    c.save()
    print(f"PDF: {OUTPUT}")

if __name__ == '__main__':
    build()
