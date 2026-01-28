# 🚀 APM Portal - Quick Start Guide

## Prerequisites

- [x] Node.js 18+
- [x] WSL 2 (Windows Subsystem for Linux)
- [ ] Docker Desktop

---

## 1. Frontend Development (Sudah Selesai ✅)

```bash
cd d:\web-apm\web
npm run dev
# Open http://localhost:3000
```

### Halaman yang tersedia:
- `/` - Homepage
- `/lomba` - Daftar lomba
- `/lomba/[slug]` - Detail lomba
- `/prestasi` - Galeri prestasi
- `/prestasi/[slug]` - Detail prestasi
- `/expo` - Event & expo
- `/expo/[slug]` - Detail expo
- `/resources` - Tips & template
- `/resources/[slug]` - Detail resource
- `/about` - Tentang APM
- `/kalender` - Kalender event
- `/search` - Pencarian global
- `/submission` - Form submit prestasi

---

## 2. Start Backend (Directus + PostgreSQL)

### Step 1: Start Docker Desktop
Buka Docker Desktop dari Start Menu, tunggu sampai engine running.

### Step 2: Start Containers
```bash
cd d:\web-apm\web
docker-compose up -d
```

### Step 3: Verify Running
```bash
docker-compose ps
# Harus muncul: apm_postgres (healthy), apm_directus (running)
```

### Step 4: Access Directus Admin
Buka browser: **http://localhost:8055**

Login:
- Email: `admin@apm-portal.id`
- Password: `Admin@APM2026!`

---

## 3. Create Collections di Directus

Setelah login ke Directus, buat collections berikut:

### Collections List:
1. `apm_lomba` - Informasi lomba
2. `apm_prestasi` - Prestasi mahasiswa
3. `apm_prestasi_tim` - Anggota tim (relasi)
4. `apm_prestasi_pembimbing` - Dosen pembimbing (relasi)
5. `apm_expo` - Event & expo
6. `apm_resources` - Tips, template, panduan
7. `apm_submissions` - Form submissions
8. `apm_about` - Info about (singleton)
9. `apm_tim` - Anggota tim APM
10. `apm_faq` - FAQ

Detail schema ada di [DIRECTUS_PLAN.md](./DIRECTUS_PLAN.md)

---

## 4. Useful Commands

### Docker
```bash
docker-compose up -d      # Start containers
docker-compose down       # Stop containers
docker-compose logs -f    # View logs
docker-compose restart    # Restart
docker-compose ps         # Status
```

### Next.js
```bash
npm run dev               # Development server
npm run build             # Production build
npm run start             # Start production
npm run lint              # Run ESLint
```

---

## 5. Ports Reference

| Service | Port | URL |
|---------|------|-----|
| Next.js | 3000 | http://localhost:3000 |
| Directus | 8055 | http://localhost:8055 |
| PostgreSQL | 5432 | localhost:5432 |

---

## 6. Troubleshooting

### Docker tidak jalan?
```bash
# Restart Docker Desktop
# Atau check WSL:
wsl --status
wsl --update
```

### Port sudah dipakai?
```bash
# Check port usage
netstat -ano | findstr :3000
netstat -ano | findstr :8055
```

### Reset database?
```bash
docker-compose down -v    # Remove volumes
docker-compose up -d      # Fresh start
```

---

## 📁 Project Structure

```
web-apm/web/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Homepage
│   ├── lomba/             # Lomba pages
│   ├── prestasi/          # Prestasi pages
│   ├── expo/              # Expo pages
│   ├── resources/         # Resources pages
│   ├── about/             # About page
│   ├── kalender/          # Kalender page
│   ├── search/            # Search page
│   ├── submission/        # Submission form
│   └── ...
├── components/
│   ├── layout/            # Header, Footer
│   └── ui/                # UI Components
├── lib/
│   ├── directus.ts        # Directus client
│   ├── utils.ts           # Utilities
│   ├── constants.ts       # Constants
│   └── seo.ts             # SEO helpers
├── types/                 # TypeScript types
├── docs/                  # Documentation
├── docker-compose.yml     # Docker config
└── ...
```
