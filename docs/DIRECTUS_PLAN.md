# 📋 Rencana Lengkap APM Portal

> **Status:** Frontend selesai dengan mock data, siap integrasi Directus CMS
> **Last Updated:** 26 Januari 2026

---

## 📊 Progress Overview

| Phase | Status | Progress |
|-------|--------|----------|
| 1. Frontend Development | ✅ Done | 100% |
| 2. Infrastructure Setup | 🔄 In Progress | 30% |
| 3. Directus Configuration | ⏳ Pending | 0% |
| 4. API Integration | ⏳ Pending | 0% |
| 5. Testing & Deployment | ⏳ Pending | 0% |

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│    Directus     │────▶│   PostgreSQL    │
│   (Frontend)    │ API │  (Headless CMS) │ SQL │   (Database)    │
│   Port: 3000    │     │   Port: 8055    │     │   Port: 5432    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              │
                              ▼
                        ┌─────────────────┐
                        │  File Storage   │
                        │ (Local/S3/etc)  │
                        └─────────────────┘
```

---

## 📦 Collections (Tabel Database)

### 1. `apm_lomba` - Informasi Lomba/Kompetisi
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| nama_lomba | string | Nama lomba |
| slug | string | URL slug (unique) |
| deskripsi | text (WYSIWYG) | Deskripsi lengkap |
| deadline | datetime | Deadline pendaftaran |
| kategori | string | Kategori (Teknologi, Bisnis, Desain, dll) |
| tingkat | enum | regional / nasional / internasional |
| status | enum | open / closed / coming-soon |
| link_pendaftaran | string | URL pendaftaran |
| syarat_ketentuan | text | Syarat & ketentuan |
| hadiah | json | Array hadiah [{peringkat, nominal, keterangan}] |
| kontak_panitia | json | {nama, email, phone, whatsapp} |
| poster | file (image) | Poster lomba |
| biaya | integer | Biaya pendaftaran (0 = gratis) |
| lokasi | string | Lokasi (atau "Online") |
| tanggal_pelaksanaan | datetime | Tanggal event |
| penyelenggara | string | Nama penyelenggara |
| website | string | Website resmi |
| tags | json | Array tags |
| is_featured | boolean | Tampil di homepage |
| is_urgent | boolean | Deadline < 7 hari |
| date_created | timestamp | Auto |
| date_updated | timestamp | Auto |
| user_created | m2o → users | Auto |

### 2. `apm_prestasi` - Data Prestasi Mahasiswa
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| judul | string | Judul/nama prestasi |
| slug | string | URL slug |
| nama_lomba | string | Nama lomba yang diikuti |
| peringkat | string | Juara 1, 2, 3, Best Paper, dll |
| tingkat | enum | regional / nasional / internasional |
| kategori | string | Kategori prestasi |
| tanggal | date | Tanggal pencapaian |
| tahun | integer | Tahun pencapaian |
| deskripsi | text | Deskripsi prestasi |
| foto_dokumentasi | files (images) | Foto-foto dokumentasi |
| sertifikat | file (image) | Scan sertifikat |
| link_berita | string | Link berita terkait |
| status_verifikasi | enum | pending / verified / rejected |
| catatan_reviewer | text | Catatan dari reviewer |
| date_created | timestamp | Auto |
| date_updated | timestamp | Auto |

### 3. `apm_prestasi_tim` - Anggota Tim Prestasi (M2M)
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| prestasi_id | m2o → apm_prestasi | Relasi ke prestasi |
| nama | string | Nama anggota |
| nim | string | NIM |
| fakultas | string | Fakultas |
| prodi | string | Program Studi |
| is_ketua | boolean | Apakah ketua tim |

### 4. `apm_prestasi_pembimbing` - Dosen Pembimbing (M2M)
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| prestasi_id | m2o → apm_prestasi | Relasi ke prestasi |
| nama | string | Nama dosen |
| nip | string | NIP |
| fakultas | string | Fakultas |

### 5. `apm_expo` - Event & Expo
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| nama_event | string | Nama event |
| slug | string | URL slug |
| tema | string | Tema event |
| tanggal_mulai | date | Tanggal mulai |
| tanggal_selesai | date | Tanggal selesai |
| lokasi | string | Lokasi |
| alamat_lengkap | text | Alamat lengkap |
| google_maps_embed | string | Embed URL Google Maps |
| deskripsi | text (WYSIWYG) | Deskripsi event |
| highlights | json | Array highlight [{icon, title, desc}] |
| rundown | json | Array rundown [{waktu, kegiatan}] |
| biaya_partisipasi | integer | Biaya (0 = gratis) |
| benefit | text | Benefit ikut |
| website_resmi | string | Website event |
| poster | file (image) | Poster event |
| foto_dokumentasi | files (images) | Dokumentasi |
| is_featured | boolean | Tampil di homepage |
| status | enum | upcoming / ongoing / completed |
| date_created | timestamp | Auto |

### 6. `apm_resources` - Tips, Template, Panduan
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| judul | string | Judul resource |
| slug | string | URL slug |
| kategori | enum | tips / template / panduan / faq |
| deskripsi | string | Deskripsi singkat |
| konten | text (WYSIWYG) | Konten lengkap |
| file_attachment | file | File download (PDF, DOCX, dll) |
| thumbnail | file (image) | Thumbnail |
| tags | json | Array tags |
| download_count | integer | Counter download |
| is_featured | boolean | Featured resource |
| is_published | boolean | Status publish |
| urutan | integer | Urutan tampilan |
| date_created | timestamp | Auto |

### 7. `apm_submissions` - Pengajuan dari User
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| tipe | enum | lomba / prestasi |
| status | enum | pending / approved / rejected |
| data | json | Data form submission |
| files | files | File pendukung |
| submitted_by | string | Nama pengirim |
| email | string | Email pengirim |
| phone | string | No. HP |
| reviewer_notes | text | Catatan reviewer |
| reviewed_by | m2o → users | User yang review |
| reviewed_at | datetime | Waktu review |
| date_created | timestamp | Auto |

### 8. `apm_about` - Informasi About (Singleton)
| Field | Type | Description |
|-------|------|-------------|
| id | integer | Primary key (1 only) |
| visi | text | Visi |
| misi | text (WYSIWYG) | Misi |
| sejarah | text (WYSIWYG) | Sejarah |
| hero_image | file (image) | Hero image |
| kontak | json | {email, phone, address} |
| social_media | json | {instagram, twitter, youtube, telegram} |

### 9. `apm_tim` - Anggota Tim APM
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| nama | string | Nama |
| jabatan | string | Jabatan |
| foto | file (image) | Foto |
| divisi | string | Divisi |
| periode | string | Periode (2025-2026) |
| is_active | boolean | Masih aktif |
| urutan | integer | Urutan tampilan |
| social | json | {linkedin, instagram} |

### 10. `apm_faq` - FAQ
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| pertanyaan | string | Pertanyaan |
| jawaban | text | Jawaban |
| kategori | string | Kategori FAQ |
| urutan | integer | Urutan |
| is_published | boolean | Status publish |

---

## 👥 Roles & Permissions

### 1. **Administrator**
- Full access ke semua collections
- Manage users & roles
- System settings

### 2. **Editor**
- CRUD apm_lomba, apm_prestasi, apm_expo, apm_resources
- View submissions
- Update submission status
- Upload files

### 3. **Reviewer**
- Read all content
- Update submission status (approve/reject)
- Add reviewer notes

### 4. **Public (Unauthenticated)**
- Read: lomba, prestasi, expo, resources, about, tim, faq
- Create: submissions (untuk form submit)
- No access: users, draft content, rejected items

---

## 🚀 Setup Steps

### Phase 1: Infrastructure
```bash
# 1. Install Docker (if not installed)
# 2. Create docker-compose.yml
# 3. Start PostgreSQL + Directus containers
```

### Phase 2: Directus Configuration
1. Access Directus Admin (http://localhost:8055)
2. Login dengan admin credentials
3. Create collections sesuai schema di atas
4. Setup relations (M2O, M2M)
5. Configure field validations
6. Setup file storage

### Phase 3: Roles & Permissions
1. Create roles: Editor, Reviewer
2. Configure permissions per role
3. Setup public access untuk read-only

### Phase 4: Initial Data
1. Import sample data
2. Upload sample images
3. Test API endpoints

### Phase 5: Connect Frontend
1. Update lib/directus.ts dengan real URL
2. Create API service functions
3. Replace mock data dengan real API calls
4. Test all pages

---

## 🐳 Docker Compose (Production-Ready)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: apm_postgres
    environment:
      POSTGRES_USER: apm_user
      POSTGRES_PASSWORD: apm_secure_password_2026
      POSTGRES_DB: apm_portal
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

  directus:
    image: directus/directus:10.10
    container_name: apm_directus
    ports:
      - "8055:8055"
    environment:
      KEY: "apm-random-key-12345"
      SECRET: "apm-random-secret-67890"
      
      DB_CLIENT: pg
      DB_HOST: postgres
      DB_PORT: 5432
      DB_DATABASE: apm_portal
      DB_USER: apm_user
      DB_PASSWORD: apm_secure_password_2026

      ADMIN_EMAIL: admin@apm-portal.id
      ADMIN_PASSWORD: Admin@APM2026!
      
      PUBLIC_URL: http://localhost:8055
      
      # Rate limiting
      RATE_LIMITER_ENABLED: "true"
      RATE_LIMITER_STORE: memory
      RATE_LIMITER_POINTS: 50
      RATE_LIMITER_DURATION: 1
      
      # Cache
      CACHE_ENABLED: "true"
      CACHE_STORE: memory
      
      # File storage
      STORAGE_LOCATIONS: local
      STORAGE_LOCAL_ROOT: ./uploads
    volumes:
      - directus_uploads:/directus/uploads
      - directus_extensions:/directus/extensions
    depends_on:
      - postgres
    restart: unless-stopped

volumes:
  postgres_data:
  directus_uploads:
  directus_extensions:
```

---

## 📡 API Endpoints (Auto-generated by Directus)

```
GET    /items/apm_lomba              # List semua lomba
GET    /items/apm_lomba/:id          # Detail lomba by ID
GET    /items/apm_lomba?filter[slug][_eq]=xxx  # By slug
POST   /items/apm_lomba              # Create (auth required)
PATCH  /items/apm_lomba/:id          # Update (auth required)
DELETE /items/apm_lomba/:id          # Delete (auth required)

# Same pattern for other collections:
/items/apm_prestasi
/items/apm_expo
/items/apm_resources
/items/apm_submissions
/items/apm_about
/items/apm_tim
/items/apm_faq

# Files/Assets
/assets/:file_id                      # Get file/image
/files                                 # Upload file (auth required)
```

---

## ⏱️ Timeline Estimasi

| Phase | Task | Durasi |
|-------|------|--------|
| 1 | Docker setup + run containers | 30 menit |
| 2 | Create all collections + fields | 1-2 jam |
| 3 | Setup roles & permissions | 30 menit |
| 4 | Input sample data | 1 jam |
| 5 | Connect frontend + test | 2-3 jam |

**Total: ~5-6 jam**

---

## ✅ Checklist

- [ ] Docker installed
- [ ] docker-compose.yml created
- [ ] PostgreSQL running
- [ ] Directus running
- [ ] All collections created
- [ ] Relations configured
- [ ] Permissions set
- [ ] Sample data imported
- [ ] Frontend connected
- [ ] All pages tested with real data
