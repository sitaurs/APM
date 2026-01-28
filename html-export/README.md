# HTML Export untuk Figma - APM Portal

Folder ini berisi file-file HTML dengan **inline styles** yang siap untuk diimport ke Figma menggunakan plugin HTML to Figma.

## 📁 Daftar File

### Halaman Utama
| File | Deskripsi |
|------|-----------|
| `index.html` | Halaman Utama (Homepage) dengan hero, countdown, daftar lomba, prestasi, expo |
| `lomba.html` | Halaman Daftar Lomba & Kompetisi dengan filter dan pagination |
| `prestasi.html` | Halaman Galeri Prestasi dengan highlights dan kategori |
| `expo.html` | Halaman Expo & Pameran dengan featured event |
| `kalender.html` | Halaman Kalender Event dengan tampilan bulanan |
| `resources.html` | Halaman Resources & Panduan dengan artikel |
| `submit.html` | Halaman Submit Prestasi (Multi-step Form) |
| `about.html` | Halaman Tentang APM dengan visi misi dan tim |
| `search.html` | Halaman Hasil Pencarian dengan filter |

### Halaman Detail
| File | Deskripsi |
|------|-----------|
| `lomba-detail.html` | Detail Lomba dengan countdown, hadiah, timeline, persyaratan |
| `prestasi-detail.html` | Detail Prestasi dengan info tim, teknologi, galeri |
| `expo-detail.html` | Detail Expo dengan rundown, booth, speaker, tiket |
| `resources-detail.html` | Artikel/Panduan dengan table of contents |

### Halaman Utility
| File | Deskripsi |
|------|-----------|
| `404.html` | Halaman Not Found (404) dengan quick links |
| `error.html` | Halaman Error dengan retry button |
| `loading.html` | Halaman Loading state dengan spinner |

## 🎨 Cara Import ke Figma

### Menggunakan Plugin "HTML to Figma"

1. **Buka Figma** dan buat file baru atau buka file yang sudah ada
2. **Buka Plugin**:
   - Klik kanan pada canvas → Plugins → HTML to Figma
   - Atau: Menu → Plugins → HTML to Figma
3. **Copy HTML**:
   - Buka file HTML yang diinginkan (misalnya `index.html`)
   - Copy seluruh isi file (Ctrl+A, Ctrl+C)
4. **Paste di Plugin**:
   - Paste kode HTML ke dalam plugin
   - Klik "Import" atau "Convert"
5. **Hasil akan muncul di canvas Figma**

### Plugin yang Direkomendasikan

- **html.to" (html.to/figma)** - Paling akurat untuk inline styles
- **HTML to Figma** by Builder.io
- **Figma HTML Embed**

## 🎯 Spesifikasi Desain

### Warna Utama (Color Palette)
```
Primary:     #0B4F94 (Biru Tua)
Secondary:   #00A8E8 (Biru Muda)
Accent:      #FF7F11 (Orange)
Background:  #F3F6F9 (Abu-abu Muda)
Surface:     #FFFFFF (Putih)
Text Main:   #0F172A (Hitam)
Text Muted:  #64748B (Abu-abu)
```

### Status Colors
```
Success:     #10B981 (Hijau)
Warning:     #F59E0B (Kuning)
Error:       #EF4444 (Merah)
Info:        #3B82F6 (Biru)
```

### Typography
- **Heading Font**: Plus Jakarta Sans (Bold/SemiBold)
- **Body Font**: Inter (Regular/Medium)

### Breakpoints
File HTML ini dioptimalkan untuk viewport desktop (1280px).
Untuk responsive design, Anda perlu membuat variasi manual di Figma.

## 📐 Komponen Utama

### Header
- Logo APM
- Navigasi utama (Lomba, Prestasi, Expo, Kalender, Resources)
- Search bar
- Notifikasi
- Button Submit Prestasi
- Button Login

### Footer
- Info brand APM Portal
- Quick Links
- Resources
- Contact Info
- Social Media Icons
- Copyright

### Cards
- **Lomba Card**: Gradient header, kategori badge, deadline, status urgent
- **Prestasi Card**: Medal icon, verified badge, team avatars
- **Expo Card**: Date badge, lokasi, deskripsi singkat

## 💡 Tips untuk Figma

1. **Setelah import**, periksa layer hierarchy dan rename sesuai kebutuhan
2. **Buat komponen** dari elemen yang berulang (cards, buttons, badges)
3. **Gunakan Auto Layout** untuk membuat elemen responsive
4. **Buat Color Styles** dari warna yang sudah didefinisikan di atas
5. **Buat Text Styles** untuk konsistensi typography

## ⚠️ Catatan Penting

- Semua styling sudah dalam format **inline CSS** sesuai kebutuhan HTML to Figma
- Font menggunakan Google Fonts (Inter & Plus Jakarta Sans) - pastikan sudah terinstall
- Gambar placeholder menggunakan gradient backgrounds
- Icon menggunakan inline SVG

## 🔧 Modifikasi

Jika ingin memodifikasi:
1. Edit file HTML langsung
2. Pastikan semua style tetap inline (dalam atribut `style=""`)
3. Jangan gunakan CSS terpisah atau `<style>` tag
4. Re-import ke Figma setelah perubahan

---

Dibuat untuk: **APM Portal - Ajang Prestasi Mahasiswa**
Tanggal: Januari 2026
