# Audit Pengadaan IT — Kabupaten Aceh Tengah

Dashboard audit dan klasifikasi risiko paket pengadaan IT di lingkungan SKPK Kabupaten Aceh Tengah, didukung AI untuk mendeteksi potensi pemborosan dan pengadaan yang tidak wajar.

## Fitur

- **Dashboard Ikhtisar** — Total paket, total pagu, estimasi potensi pemborosan, dan distribusi risiko
- **Data Paket** — Tabel lengkap seluruh paket pengadaan IT dengan filter risiko dan SKPK
- **Audit AI** — Analisis otomatis tiap paket menggunakan Claude AI untuk mendeteksi:
  - Spesifikasi yang berlebihan (over-spec)
  - Pemborosan anggaran
  - Pengadaan yang tidak pantas untuk instansi pemerintah
- **Tambah Paket** — Input paket baru untuk diaudit

## Risiko

| Level | Keterangan |
|-------|-----------|
| 🟢 Rendah | Pengadaan wajar, sesuai kebutuhan |
| 🟡 Sedang | Perlu dicermati |
| 🔴 Tinggi | Spesifikasi berlebihan atau nilai tidak wajar |
| 🟣 Absurd | Pemborosan atau tidak pantas untuk instansi pemerintah |
| ⚪ Belum Diaudit | Menunggu analisis AI |

## Stack

- **React 19** + **Vite 8** — Frontend
- **Claude AI (Anthropic)** — Engine klasifikasi risiko
- **GitHub Pages** — Hosting

## Deploy

Push ke branch `main` → GitHub Actions build + deploy otomatis ke:
https://niumination.github.io/AuditTI-AT/

## Pengembangan

```bash
npm install
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview build
```

> **Catatan:** Data di dashboard adalah data simulasi untuk keperluan demonstrasi. Analisis AI bersifat alat bantu awal, bukan keputusan final.
