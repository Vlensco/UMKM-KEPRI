# 📊 Batam UMKM Intelligence Center

[![Framework](https://img.shields.io/badge/Framework-React--Vite-00f2fe?style=for-the-badge&logo=react)](https://react.dev/)
[![Styling](https://img.shields.io/badge/Styling-Vanilla%20CSS-a855f7?style=for-the-badge&logo=css3)](https://www.w3.org//)
[![AI Engine](https://img.shields.io/badge/AI--Engine-Gemini--2.5--Flash-10b981?style=for-the-badge&logo=google-gemini)](https://deepmind.google/technologies/gemini/)
[![Deployment](https://img.shields.io/badge/Deployment-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

**Batam UMKM Intelligence Center** (Growth Command Center) adalah aplikasi dashboard analitik data-driven modern yang dirancang untuk memetakan, menganalisis, dan memantau perkembangan Usaha Mikro, Kecil, dan Menengah (UMKM) serta Koperasi di Kota Batam secara interaktif, responsif, dan real-time.

---

## 🌟 Fitur Utama

### 1. 📈 Dashboard Overview (Layanan Satu Layar)
* **KPI Cards**: Memantau total UMKM, YoY Growth, jumlah kecamatan aktif, skor peluang usaha, urgensi intervensi, serta koperasi aktif.
* **Peta SVG Interaktif**: Peta Kota Batam per kecamatan dengan efek hover neon bercahaya, label data yang tajam, dan filter klik langsung wilayah.
* **YoY Trend Chart**: Melihat perkembangan historis jumlah UMKM dari tahun 2020 s.d. 2024.
* **Peringkat Top 5**: Pemeringkatan kecamatan berdasarkan indikator terpilih secara dinamis.
* **Indikator Makro Ekonomi**: Integrasi data makro perkotaan (PDRB, IPM, Tingkat Kemiskinan).

### 2. 🗺️ Analisis Regional & Sektoral
* **Gauges Adopsi Digital & Formalitas**: Menampilkan tingkat persentase adopsi digital (Target 80%) dan status legalitas usaha formal (Target 90%) dengan visualisasi gauge melengkung yang elegan.
* **Scatter Bubble Chart**: Visualisasi 3D yang menghubungkan Jumlah Pekerja (Sumbu X), Unit UMKM (Sumbu Y), dan Estimasi Omset Pendapatan (Ukuran Bubble).

### 3. 💼 Analisis Detail Sektor Bisnis
* **Sektor Bisnis Teratas**: Pemetaan kontribusi unit usaha dan estimasi pendapatan sektor bisnis utama (Kuliner, Jasa, Perdagangan, Fashion, dll.).
* **Rekomendasi Program Default**: Hubungan otomatis antara sektor bisnis dengan program bantuan yang relevan.

### 4. 📋 Program & Prioritas Intervensi
* **Katalog Program**: Kartu penjelasan detil, kategori, deskripsi, dan alokasi dana per sasaran program pemerintah.
* **Pagination Table**: Tabel perankingan prioritas program per wilayah yang dilengkapi dengan kontrol jumlah tampilan baris (10, 25, 50 data per halaman) dan penomoran halaman (1-5) yang responsif.

### 5. 🏥 Kesehatan Koperasi (Cooperative Health)
* **KPI Rasio Keaktifan**: Perhitungan rasio keaktifan koperasi dari tahun ke tahun.
* **Status Koperasi per Kecamatan**: Perbandingan koperasi aktif vs total koperasi terdaftar dalam bentuk clustered columns.
* **Peringatan Dinamis**: Banner informasi khusus yang menjelaskan anomali data (misal: publikasi koperasi aktif tahun 2024).

### 6. 🎙️ AI Voice Analyst (Didukung Gemini 2.5 Flash)
* **Real-time Chat**: AI Asisten cerdas yang menganalisis database secara lokal dan memberikan penjelasan informatif dalam bahasa Indonesia yang santun.
* **Sinkronisasi Filter Dashboard**: AI secara cerdas membaca filter aktif (Tahun, Kecamatan, Sektor) yang dipasang pengguna saat itu juga.
* **Speech-to-Text (STT)**: Dukungan mikrofon browser untuk mengajukan pertanyaan lewat suara.
* **Text-to-Speech (TTS)**: AI membacakan jawabannya kembali secara verbal dengan intonasi bahasa Indonesia yang natural.
* **Layout Auto-Control**: AI dapat mengeksekusi instruksi UI (contoh: secara otomatis memindahkan tab dashboard atau menyorot/zoom-in bagan tertentu yang sedang dia bahas).

---

## 🛠️ Arsitektur Teknologi

* **Core Framework**: React (Vite)
* **Visualisasi Grafik**: Chart.js & React-Chartjs-2
* **Pemrosesan Data**: Python (Script parsing data tabular TSV dari Power BI ke JSON database bersih)
* **AI Integration**: Gemini 2.5 Flash API (Client-side fetch)
* **Speech Engine**: Web Speech API (SpeechRecognition & SpeechSynthesis dalam format `id-ID`)
* **Styling**: Modern Vanilla CSS (Aesthetics Glassmorphic, Neon Glows, Dark Mode, & Harmonious HSL colors)

---

## 📂 Struktur Proyek

```bash
├── public/
│   ├── favicon.svg          # Favicon Cadangan
│   ├── logo_batam.png       # Lambang Resmi Kota Batam (Favicon & Logo Utama)
│   └── icons.svg            # Kumpulan icon SVG
├── src/
│   ├── assets/              # Aset media (logo_batam, hero images)
│   ├── components/
│   │   ├── AIVoiceAnalyst.jsx       # Obrolan AI Analyst + Suara + Kontrol UI
│   │   ├── CooperativeHealth.jsx    # Analisis Kesehatan Koperasi
│   │   ├── DashboardOverview.jsx    # Overview Utama + Peta SVG + Tren
│   │   ├── Header.jsx               # Header Filter/Slicers (Tahun, Kecamatan, Sektor)
│   │   ├── ProgramRecommendation.jsx # Katalog Program + Tabel Terpaginasi
│   │   ├── SectorAnalysis.jsx       # Detail Sektor & Kontribusi Pendapatan
│   │   ├── Sidebar.jsx              # Navigasi Menu Samping + Data Summary
│   │   └── UMKMAnalysis.jsx         # Gauges Digitalisasi & Scatter Bubble
│   ├── data/
│   │   └── dashboard_data.json      # Database Terpadu (1.98 MB, 3,250 kelurahan records)
│   ├── App.css
│   ├── App.jsx              # State Global Dashboard & Layouting
│   ├── index.css            # Desain Sistem & Gaya CSS Global (Glassmorphism)
│   └── main.jsx
├── txt/                     # Sumber data mentah TSV dari Power BI DataMart
├── vercel.json              # Konfigurasi routing rewrite untuk deploy Vercel
├── vite.config.js
└── package.json
```

---

## 🚀 Instalasi & Menjalankan Proyek secara Lokal

### 1. Prasyarat
Pastikan Anda sudah menginstal **Node.js** (versi 18 ke atas) di perangkat Anda.

### 2. Kloning Repositori
```bash
git clone https://github.com/Vlensco/UMKM-KEPRI.git
cd UMKM-KEPRI
```

### 3. Instal Dependensi
```bash
npm install
```

### 4. Jalankan Server Dev
Jalankan dev server secara lokal:
```bash
npm run dev
```
Aplikasi akan terbuka secara otomatis di browser pada alamat `http://localhost:5173/` (atau `http://localhost:5174/`).

### 5. Bangun Versi Produksi (Build)
Untuk mengompilasi dan mengoptimalkan aset untuk siap deploy:
```bash
npm run build
```

---

## ☁️ Panduan Deploy ke Vercel

Proyek ini telah dilengkapi file `vercel.json` untuk menangani navigasi *client-side routing* React Router agar terhindar dari error 404 ketika halaman dimuat ulang.

1. Buka [Vercel Dashboard](https://vercel.com/dashboard).
2. Klik **Add New Project**, lalu hubungkan dengan GitHub Anda.
3. Impor repositori **`UMKM-KEPRI`**.
4. Biarkan konfigurasi build default (Vercel akan mendeteksi setup **Vite** secara otomatis).
5. Klik **Deploy**. Selesai! Dashboard Anda siap diakses di seluruh dunia.

---

## 📝 Sumber Data
Data yang diolah bersumber dari:
* Dinas Koperasi, Usaha Mikro, dan Menengah Kota Batam
* Badan Pusat Statistik (BPS) Kota Batam
* Portal Satu Data Batam (Data diolah kembali)
