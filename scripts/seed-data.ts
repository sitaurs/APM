/**
 * Directus Sample Data Import Script
 * 
 * Usage: npx tsx scripts/seed-data.ts
 */

export { }; // Make this a module

const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'admin@apm-portal.id';
const ADMIN_PASSWORD = 'Admin@APM2026!';

// Sample data
const sampleLomba = [
  {
    nama_lomba: 'Hackathon Nasional Inovasi 2026',
    slug: 'hackathon-nasional-inovasi-2026',
    deskripsi: '<p>Hackathon terbesar di Indonesia untuk mahasiswa. Ciptakan solusi inovatif untuk masalah nyata dalam 48 jam!</p><p>Tema tahun ini: <strong>AI for Social Good</strong></p>',
    deadline: '2026-02-08T23:59:59',
    kategori: 'teknologi',
    tingkat: 'nasional',
    status: 'open',
    link_pendaftaran: 'https://hackathon-nasional.id/register',
    syarat_ketentuan: '1. Mahasiswa aktif S1/D4\n2. Tim terdiri dari 3-5 orang\n3. Belum pernah juara di hackathon serupa',
    hadiah: JSON.stringify([
      { peringkat: 'Juara 1', nominal: 50000000, keterangan: 'Trophy + Sertifikat + Internship opportunity' },
      { peringkat: 'Juara 2', nominal: 30000000, keterangan: 'Trophy + Sertifikat' },
      { peringkat: 'Juara 3', nominal: 15000000, keterangan: 'Trophy + Sertifikat' },
    ]),
    kontak_panitia: JSON.stringify({ nama: 'Panitia Hackathon', email: 'info@hackathon-nasional.id', phone: '081234567890', whatsapp: '081234567890' }),
    biaya: 0,
    lokasi: 'Online',
    tanggal_pelaksanaan: '2026-02-15T08:00:00',
    penyelenggara: 'Kementerian Komunikasi dan Informatika',
    website: 'https://hackathon-nasional.id',
    tags: JSON.stringify(['hackathon', 'teknologi', 'AI', 'startup']),
    is_featured: true,
    is_urgent: true,
  },
  {
    nama_lomba: 'UI/UX Design Challenge 2026',
    slug: 'ui-ux-design-challenge-2026',
    deskripsi: '<p>Kompetisi desain UI/UX untuk aplikasi mobile dan web. Tunjukkan kreativitasmu!</p>',
    deadline: '2026-02-15T17:00:00',
    kategori: 'desain',
    tingkat: 'nasional',
    status: 'open',
    link_pendaftaran: 'https://designchallenge.id',
    syarat_ketentuan: '1. Mahasiswa aktif\n2. Individu atau tim (max 2 orang)\n3. Submit portfolio',
    hadiah: JSON.stringify([
      { peringkat: 'Juara 1', nominal: 25000000, keterangan: 'Trophy + Sertifikat' },
      { peringkat: 'Juara 2', nominal: 15000000, keterangan: 'Sertifikat' },
    ]),
    biaya: 50000,
    lokasi: 'Online',
    is_featured: true,
  },
  {
    nama_lomba: 'Business Plan Competition 2026',
    slug: 'business-plan-competition-2026',
    deskripsi: '<p>Kompetisi rencana bisnis tingkat nasional. Wujudkan ide bisnismu!</p>',
    deadline: '2026-02-20T23:59:59',
    kategori: 'bisnis',
    tingkat: 'nasional',
    status: 'coming-soon',
    biaya: 100000,
    lokasi: 'Jakarta',
    is_featured: false,
  },
  {
    nama_lomba: 'Lomba Karya Tulis Ilmiah 2026',
    slug: 'lkti-nasional-2026',
    deskripsi: '<p>Lomba penulisan karya ilmiah tingkat nasional dengan tema Inovasi Berkelanjutan.</p>',
    deadline: '2026-03-01T23:59:59',
    kategori: 'akademik',
    tingkat: 'nasional',
    status: 'open',
    biaya: 0,
    lokasi: 'Online',
  },
  {
    nama_lomba: 'Data Science Competition',
    slug: 'data-science-competition-2026',
    deskripsi: '<p>Kompetisi data science dengan dataset real dari industri.</p>',
    deadline: '2026-03-10T23:59:59',
    kategori: 'teknologi',
    tingkat: 'nasional',
    status: 'open',
    biaya: 0,
    lokasi: 'Online',
  },
];

const samplePrestasi = [
  {
    judul: 'Hackathon Nasional Inovasi 2025',
    slug: 'hackathon-nasional-2025-juara1',
    nama_lomba: 'Hackathon Nasional Inovasi',
    peringkat: 'Juara 1',
    tingkat: 'nasional',
    kategori: 'Teknologi',
    tanggal: '2025-12-15',
    tahun: 2025,
    deskripsi: '<p>Tim berhasil meraih juara 1 dengan mengembangkan aplikasi AI untuk membantu petani.</p>',
    link_berita: 'https://news.example.com/hackathon-2025',
    status_verifikasi: 'verified',
  },
  {
    judul: 'International Conference on AI - Best Paper',
    slug: 'icai-2025-best-paper',
    nama_lomba: 'ICAI 2025',
    peringkat: 'Best Paper Award',
    tingkat: 'internasional',
    kategori: 'Akademik',
    tanggal: '2025-11-20',
    tahun: 2025,
    deskripsi: '<p>Paper tentang Machine Learning untuk prediksi cuaca mendapat penghargaan Best Paper.</p>',
    status_verifikasi: 'verified',
  },
  {
    judul: 'National Startup Pitch Competition',
    slug: 'startup-pitch-2025',
    nama_lomba: 'Startup Pitch Competition',
    peringkat: 'Winner',
    tingkat: 'nasional',
    kategori: 'Bisnis',
    tanggal: '2025-10-10',
    tahun: 2025,
    status_verifikasi: 'verified',
  },
  {
    judul: 'Gemastik XVI - Mobile Development',
    slug: 'gemastik-xvi-mobile',
    nama_lomba: 'Gemastik XVI',
    peringkat: 'Juara 2',
    tingkat: 'nasional',
    kategori: 'Teknologi',
    tanggal: '2025-09-25',
    tahun: 2025,
    status_verifikasi: 'verified',
  },
  {
    judul: 'Design Thinking Competition',
    slug: 'design-thinking-2025',
    nama_lomba: 'Design Thinking Competition',
    peringkat: 'Juara 3',
    tingkat: 'nasional',
    kategori: 'Desain',
    tanggal: '2025-08-15',
    tahun: 2025,
    status_verifikasi: 'pending',
  },
];

const sampleExpo = [
  {
    nama_event: 'Tech Expo Indonesia 2026',
    slug: 'tech-expo-indonesia-2026',
    tema: 'Future of Technology',
    tanggal_mulai: '2026-02-15',
    tanggal_selesai: '2026-02-17',
    lokasi: 'Jakarta',
    alamat_lengkap: 'Jakarta Convention Center, Jl. Gatot Subroto, Jakarta Selatan',
    deskripsi: '<p>Pameran teknologi terbesar di Indonesia dengan 200+ exhibitor dan 50+ speaker.</p>',
    highlights: JSON.stringify([
      { icon: 'users', title: '200+ Exhibitor', desc: 'Perusahaan teknologi terkemuka' },
      { icon: 'mic', title: '50+ Speaker', desc: 'Industry leaders & experts' },
      { icon: 'briefcase', title: 'Job Fair', desc: '1000+ lowongan kerja' },
    ]),
    rundown: JSON.stringify([
      { waktu: '08:00 - 09:00', kegiatan: 'Registrasi' },
      { waktu: '09:00 - 10:30', kegiatan: 'Opening Ceremony' },
      { waktu: '10:30 - 12:00', kegiatan: 'Keynote Speech' },
      { waktu: '13:00 - 17:00', kegiatan: 'Exhibition & Networking' },
    ]),
    biaya_partisipasi: 0,
    benefit: 'Free entry, goodie bag, networking opportunity',
    website_resmi: 'https://techexpo.id',
    is_featured: true,
    status: 'upcoming',
  },
  {
    nama_event: 'Career Fair 2026',
    slug: 'career-fair-2026',
    tema: 'Your Future Starts Here',
    tanggal_mulai: '2026-02-20',
    tanggal_selesai: '2026-02-22',
    lokasi: 'Bandung',
    alamat_lengkap: 'Gedung Sasana Budaya Ganesha ITB',
    deskripsi: '<p>Bursa kerja terbesar untuk mahasiswa dan fresh graduate.</p>',
    biaya_partisipasi: 0,
    is_featured: true,
    status: 'upcoming',
  },
  {
    nama_event: 'Workshop Inovasi Digital',
    slug: 'workshop-inovasi-digital',
    tema: 'Digital Transformation',
    tanggal_mulai: '2026-02-25',
    tanggal_selesai: '2026-02-25',
    lokasi: 'Online',
    deskripsi: '<p>Workshop intensif tentang inovasi digital dan startup.</p>',
    biaya_partisipasi: 50000,
    status: 'upcoming',
  },
];

const sampleResources = [
  {
    judul: 'Tips Sukses Mengikuti Hackathon',
    slug: 'tips-sukses-hackathon',
    kategori: 'tips',
    deskripsi: 'Panduan lengkap untuk persiapan dan strategi memenangkan hackathon',
    konten: '<h2>1. Persiapan Sebelum Hackathon</h2><p>Pastikan kamu sudah memiliki tim yang solid...</p><h2>2. Strategi Saat Hackathon</h2><p>Fokus pada MVP dan user experience...</p>',
    tags: JSON.stringify(['hackathon', 'tips', 'kompetisi']),
    is_featured: true,
    is_published: true,
    urutan: 1,
  },
  {
    judul: 'Template Proposal Bisnis',
    slug: 'template-proposal-bisnis',
    kategori: 'template',
    deskripsi: 'Template proposal bisnis yang sudah terbukti memenangkan kompetisi',
    konten: '<p>Download template proposal bisnis lengkap dengan panduan pengisian.</p>',
    is_featured: true,
    is_published: true,
    urutan: 2,
  },
  {
    judul: 'Panduan Menulis Paper Ilmiah',
    slug: 'panduan-menulis-paper',
    kategori: 'panduan',
    deskripsi: 'Langkah-langkah menulis paper ilmiah yang baik dan benar',
    konten: '<h2>Struktur Paper</h2><p>Paper ilmiah terdiri dari: Abstract, Introduction, Methods, Results, Discussion, Conclusion...</p>',
    is_published: true,
    urutan: 3,
  },
  {
    judul: 'Template Pitch Deck Startup',
    slug: 'template-pitch-deck',
    kategori: 'template',
    deskripsi: 'Template pitch deck untuk presentasi startup competition',
    is_published: true,
    urutan: 4,
  },
  {
    judul: 'Tips Public Speaking untuk Presentasi',
    slug: 'tips-public-speaking',
    kategori: 'tips',
    deskripsi: 'Cara presentasi yang meyakinkan di depan juri',
    is_published: true,
    urutan: 5,
  },
];

const sampleTim = [
  { nama: 'Dr. Ahmad Fauzi, M.T.', jabatan: 'Pembina', divisi: 'Pimpinan', periode: '2025-2026', is_active: true, urutan: 1 },
  { nama: 'Rizky Pratama', jabatan: 'Ketua', divisi: 'Pimpinan', periode: '2025-2026', is_active: true, urutan: 2 },
  { nama: 'Siti Nurhaliza', jabatan: 'Wakil Ketua', divisi: 'Pimpinan', periode: '2025-2026', is_active: true, urutan: 3 },
  { nama: 'Budi Santoso', jabatan: 'Koordinator IT', divisi: 'Teknologi', periode: '2025-2026', is_active: true, urutan: 4 },
  { nama: 'Dewi Anggraini', jabatan: 'Koordinator Event', divisi: 'Event', periode: '2025-2026', is_active: true, urutan: 5 },
];

const sampleFaq = [
  { pertanyaan: 'Bagaimana cara mendaftar lomba?', jawaban: '<p>Kamu bisa mendaftar langsung melalui link pendaftaran yang tersedia di halaman detail lomba. Pastikan membaca syarat dan ketentuan terlebih dahulu.</p>', kategori: 'Pendaftaran', urutan: 1, is_published: true },
  { pertanyaan: 'Apakah ada biaya untuk mengikuti lomba?', jawaban: '<p>Tergantung lombanya. Beberapa lomba gratis, beberapa ada biaya pendaftaran. Informasi biaya tersedia di halaman detail masing-masing lomba.</p>', kategori: 'Biaya', urutan: 2, is_published: true },
  { pertanyaan: 'Bagaimana cara submit prestasi?', jawaban: '<p>Kamu bisa submit prestasi melalui menu "Submit Prestasi". Isi form dengan lengkap dan upload dokumen pendukung (sertifikat, foto, dll). Tim kami akan memverifikasi dalam 3-5 hari kerja.</p>', kategori: 'Prestasi', urutan: 3, is_published: true },
  { pertanyaan: 'Siapa yang bisa submit prestasi?', jawaban: '<p>Semua mahasiswa aktif Politeknik Negeri Malang dapat submit prestasi. Prestasi yang di-submit akan melalui proses verifikasi.</p>', kategori: 'Prestasi', urutan: 4, is_published: true },
];

const sampleAbout = {
  visi: 'Menjadi portal prestasi mahasiswa terdepan yang menginspirasi dan memfasilitasi pengembangan potensi mahasiswa Indonesia.',
  misi: '<ul><li>Menyediakan informasi lomba dan kompetisi yang lengkap dan terkini</li><li>Mendokumentasikan dan mempublikasikan prestasi mahasiswa</li><li>Memfasilitasi networking dan kolaborasi antar mahasiswa berprestasi</li><li>Memberikan resources dan panduan untuk pengembangan skill</li></ul>',
  sejarah: '<p>APM Portal didirikan pada tahun 2024 sebagai wadah bagi mahasiswa untuk menemukan informasi lomba dan membagikan prestasi mereka.</p>',
  kontak: JSON.stringify({ email: 'info@apm-portal.id', phone: '0341-404424', address: 'Jl. Soekarno Hatta No.9, Malang, Jawa Timur' }),
  social_media: JSON.stringify({ instagram: '@apmportal', twitter: '@apmportal', youtube: 'APM Portal', telegram: '@apmportal' }),
};

async function main() {
  console.log('🌱 Starting Data Seeding...\n');

  // Login
  const loginRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });

  const { data: authData } = await loginRes.json();
  const token = authData.access_token;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  // Seed Lomba
  console.log('📝 Seeding apm_lomba...');
  for (const item of sampleLomba) {
    await fetch(`${DIRECTUS_URL}/items/apm_lomba`, {
      method: 'POST',
      headers,
      body: JSON.stringify(item),
    });
  }
  console.log(`   ✅ ${sampleLomba.length} lomba created\n`);

  // Seed Prestasi
  console.log('🏆 Seeding apm_prestasi...');
  for (const item of samplePrestasi) {
    await fetch(`${DIRECTUS_URL}/items/apm_prestasi`, {
      method: 'POST',
      headers,
      body: JSON.stringify(item),
    });
  }
  console.log(`   ✅ ${samplePrestasi.length} prestasi created\n`);

  // Seed Expo
  console.log('🎪 Seeding apm_expo...');
  for (const item of sampleExpo) {
    await fetch(`${DIRECTUS_URL}/items/apm_expo`, {
      method: 'POST',
      headers,
      body: JSON.stringify(item),
    });
  }
  console.log(`   ✅ ${sampleExpo.length} expo created\n`);

  // Seed Resources
  console.log('📚 Seeding apm_resources...');
  for (const item of sampleResources) {
    await fetch(`${DIRECTUS_URL}/items/apm_resources`, {
      method: 'POST',
      headers,
      body: JSON.stringify(item),
    });
  }
  console.log(`   ✅ ${sampleResources.length} resources created\n`);

  // Seed Tim
  console.log('👥 Seeding apm_tim...');
  for (const item of sampleTim) {
    await fetch(`${DIRECTUS_URL}/items/apm_tim`, {
      method: 'POST',
      headers,
      body: JSON.stringify(item),
    });
  }
  console.log(`   ✅ ${sampleTim.length} tim members created\n`);

  // Seed FAQ
  console.log('❓ Seeding apm_faq...');
  for (const item of sampleFaq) {
    await fetch(`${DIRECTUS_URL}/items/apm_faq`, {
      method: 'POST',
      headers,
      body: JSON.stringify(item),
    });
  }
  console.log(`   ✅ ${sampleFaq.length} FAQ created\n`);

  // Seed About (singleton)
  console.log('ℹ️ Seeding apm_about...');
  await fetch(`${DIRECTUS_URL}/items/apm_about`, {
    method: 'POST',
    headers,
    body: JSON.stringify(sampleAbout),
  });
  console.log('   ✅ About info created\n');

  console.log('✅ Data seeding complete!');
  console.log('\n📋 Summary:');
  console.log(`   - ${sampleLomba.length} lomba`);
  console.log(`   - ${samplePrestasi.length} prestasi`);
  console.log(`   - ${sampleExpo.length} expo`);
  console.log(`   - ${sampleResources.length} resources`);
  console.log(`   - ${sampleTim.length} tim members`);
  console.log(`   - ${sampleFaq.length} FAQ`);
  console.log(`   - 1 about (singleton)`);
}

main().catch(console.error);
