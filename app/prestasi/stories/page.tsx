'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumb, Badge, Button } from '@/components/ui';
import {
    Trophy,
    Star,
    Quote,
    ChevronRight,
    ChevronLeft,
    Award,
    Users,
    Calendar,
    MapPin,
    ExternalLink,
    Play,
    Heart,
    Share2,
    Bookmark,
    GraduationCap,
    Briefcase,
    TrendingUp,
    Sparkles,
    Globe,
    Medal
} from 'lucide-react';

// Featured Success Story
const featuredStory = {
    id: 1,
    slug: 'tim-innovate-gemastik-xvii',
    title: 'Perjalanan Tim Innovate Meraih Juara 1 Gemastik XVII',
    subtitle: 'Dari ide sederhana hingga menjadi juara nasional',
    kategori: 'Teknologi',
    tingkat: 'Nasional',
    prestasi: 'Juara 1',
    lomba: 'Gemastik XVII - Kategori Pengembangan Perangkat Lunak',
    tanggal: '15 November 2025',
    lokasi: 'Jakarta',
    tim: [
        { nama: 'Ahmad Rizky Pratama', role: 'Team Leader', nim: '2141720001', jurusan: 'D4 Teknik Informatika', angkatan: '2021', foto: null, linkedin: '#' },
        { nama: 'Siti Nurhaliza', role: 'UI/UX Designer', nim: '2141720045', jurusan: 'D4 Teknik Informatika', angkatan: '2021', foto: null, linkedin: '#' },
        { nama: 'Budi Santoso', role: 'Backend Developer', nim: '2141720089', jurusan: 'D4 Teknik Informatika', angkatan: '2021', foto: null, linkedin: '#' },
    ],
    pembimbing: { nama: 'Dr. Eng. Awan Setiawan, S.T., M.T.', foto: null },
    ringkasan: 'Tim Innovate dari Jurusan Teknologi Informasi berhasil membawa pulang medali emas dari Gemastik XVII dengan aplikasi "SmartFarm" - solusi pertanian cerdas berbasis IoT dan AI yang membantu petani lokal meningkatkan hasil panen hingga 40%.',
    cerita: [
        {
            fase: 'Ideasi',
            bulan: 'Mei 2025',
            judul: 'Bermula dari Keresahan',
            konten: 'Semuanya bermula saat kami melakukan KKN di desa pertanian di Malang Selatan. Kami melihat bagaimana petani kesulitan memprediksi cuaca dan menentukan waktu tanam yang tepat. Dari situlah ide SmartFarm lahir.',
            highlight: 'Riset lapangan 3 minggu'
        },
        {
            fase: 'Pengembangan',
            bulan: 'Juni - Agustus 2025',
            judul: 'Kerja Keras Tanpa Henti',
            konten: 'Selama 3 bulan, kami menghabiskan waktu di lab JTI, bahkan sampai menginap. Banyak tantangan teknis yang kami hadapi, mulai dari integrasi sensor IoT hingga training model AI untuk prediksi cuaca.',
            highlight: '200+ jam coding'
        },
        {
            fase: 'Seleksi',
            bulan: 'September 2025',
            judul: 'Lolos dari 500+ Tim',
            konten: 'Dari lebih dari 500 tim yang mendaftar, kami berhasil lolos ke babak final. Presentasi proposal menjadi momen paling menegangkan, tapi dukungan dari dosen pembimbing dan teman-teman sangat membantu.',
            highlight: 'Top 10 Nasional'
        },
        {
            fase: 'Final',
            bulan: 'November 2025',
            judul: 'Momen Bersejarah',
            konten: 'Di Jakarta, kami mempresentasikan SmartFarm di depan juri dari Kemendikbud dan praktisi industri. Demo live sistem kami berjalan lancar dan mendapat apresiasi tinggi dari para juri.',
            highlight: 'Juara 1 Nasional 🏆'
        },
    ],
    quotes: [
        {
            text: 'Perjalanan ini mengajarkan kami bahwa teknologi harus punya dampak nyata bagi masyarakat. Kami bangga bisa membawa nama Polinema di kancah nasional.',
            author: 'Ahmad Rizky Pratama',
            role: 'Team Leader'
        }
    ],
    dampak: [
        { label: 'Petani Terbantu', value: '250+', icon: Users },
        { label: 'Peningkatan Hasil', value: '40%', icon: TrendingUp },
        { label: 'Desa Mitra', value: '5', icon: MapPin },
    ],
    penghargaan: [
        'Juara 1 Gemastik XVII',
        'Best Innovation Award',
        'Beasiswa Lanjut Studi'
    ],
    tags: ['IoT', 'AI', 'Agriculture', 'Social Impact'],
};

// More Success Stories
const moreStories = [
    {
        id: 2,
        slug: 'aura-fintech-hackathon',
        title: 'Tim Aura Raih Best Innovation di Fintech Hackathon Asia',
        kategori: 'Bisnis',
        tingkat: 'Internasional',
        prestasi: 'Best Innovation',
        tanggal: 'Oktober 2025',
        tim: [
            { nama: 'Diana Putri', role: 'Leader', foto: null },
            { nama: 'Eko Prasetyo', role: 'Developer', foto: null },
        ],
        ringkasan: 'Solusi pembayaran mikro untuk UMKM berbasis blockchain berhasil menyabet penghargaan Best Innovation di ajang internasional.',
        tags: ['Fintech', 'Blockchain'],
        warna: 'from-purple-500 to-pink-600',
    },
    {
        id: 3,
        slug: 'paper-ieee-conference',
        title: 'Mahasiswa JTE Raih Best Paper di IEEE Conference',
        kategori: 'Akademik',
        tingkat: 'Internasional',
        prestasi: 'Best Paper Award',
        tanggal: 'September 2025',
        tim: [
            { nama: 'Fajar Nugroho', role: 'Researcher', foto: null },
        ],
        ringkasan: 'Penelitian tentang optimasi energi terbarukan menggunakan machine learning mendapat pengakuan dunia.',
        tags: ['Research', 'IEEE', 'ML'],
        warna: 'from-blue-500 to-cyan-600',
    },
    {
        id: 4,
        slug: 'desain-poster-nasional',
        title: 'Karya Anak JAN Juarai Kompetisi Desain Nasional',
        kategori: 'Seni & Desain',
        tingkat: 'Nasional',
        prestasi: 'Juara 1',
        tanggal: 'Agustus 2025',
        tim: [
            { nama: 'Galuh Permata', role: 'Designer', foto: null },
        ],
        ringkasan: 'Poster kampanye lingkungan "Bumi Kita" terpilih sebagai karya terbaik dari 1000+ peserta.',
        tags: ['Design', 'Social Campaign'],
        warna: 'from-amber-500 to-orange-600',
    },
    {
        id: 5,
        slug: 'robotika-kontes-robot',
        title: 'Tim Robotika Polinema Dominasi KRTI 2025',
        kategori: 'Teknologi',
        tingkat: 'Nasional',
        prestasi: 'Juara Umum',
        tanggal: 'Juli 2025',
        tim: [
            { nama: 'Hendra Wijaya', role: 'Leader', foto: null },
            { nama: 'Irfan Maulana', role: 'Mechanic', foto: null },
            { nama: 'Jasmine Putri', role: 'Programmer', foto: null },
        ],
        ringkasan: 'Tim robotika berhasil meraih juara umum dengan membawa pulang 3 emas dan 2 perak di berbagai kategori.',
        tags: ['Robotics', 'Engineering'],
        warna: 'from-emerald-500 to-teal-600',
    },
];

// Testimonials from Alumni
const testimonials = [
    {
        nama: 'Raka Wijaya, S.Tr.Kom.',
        angkatan: '2018',
        prestasi: 'Juara 1 Gemastik XV',
        sekarang: 'Software Engineer di Google',
        foto: null,
        quote: 'Pengalaman berkompetisi di APM membentuk mental juara dan kemampuan problem-solving yang sangat berguna di dunia kerja.',
    },
    {
        nama: 'Anisa Rahma, S.Tr.Akt.',
        angkatan: '2019',
        prestasi: 'Finalis Deloitte Tax Challenge',
        sekarang: 'Tax Consultant di Big 4',
        foto: null,
        quote: 'Kompetisi mengajarkan saya untuk bekerja di bawah tekanan dan menghasilkan kualitas terbaik dalam waktu terbatas.',
    },
    {
        nama: 'Kevin Pratama, S.Tr.T.',
        angkatan: '2019',
        prestasi: 'Gold Medal ICPC Asia',
        sekarang: 'ML Engineer di Tokopedia',
        foto: null,
        quote: 'Semua dimulai dari keberanian mendaftar lomba pertama. Jangan takut gagal, karena setiap lomba adalah pembelajaran.',
    },
];

// Stats
const overallStats = [
    { label: 'Success Stories', value: '150+', icon: Trophy },
    { label: 'Alumni Sukses', value: '500+', icon: GraduationCap },
    { label: 'Perusahaan Partner', value: '50+', icon: Briefcase },
    { label: 'Total Hadiah', value: '2M+', icon: Award },
];

export default function SuccessStoriesPage() {
    const [activePhase, setActivePhase] = useState(0);
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-primary via-primary-600 to-primary-700 overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
                </div>

                {/* Content */}
                <div className="container-apm py-16 relative z-10">
                    <Breadcrumb
                        items={[
                            { label: 'Prestasi', href: '/prestasi' },
                            { label: 'Success Stories' }
                        ]}
                        className="text-white/70 [&_a]:text-white/70 [&_a:hover]:text-white mb-6"
                    />

                    <div className="max-w-4xl">
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30 mb-4">
                            <Sparkles className="w-3 h-3 mr-1" /> Cerita Inspiratif
                        </Badge>
                        <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">
                            Success Stories
                        </h1>
                        <p className="text-xl text-white/80 mb-8 max-w-2xl">
                            Kisah inspiratif mahasiswa Polinema yang berhasil mengukir prestasi gemilang di tingkat nasional dan internasional.
                        </p>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {overallStats.map((stat) => (
                                <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                    <stat.icon className="w-6 h-6 text-white/80 mb-2" />
                                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                                    <p className="text-sm text-white/70">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Story Section */}
            <section className="container-apm py-16">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                        <Star className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Featured Story</h2>
                        <p className="text-gray-500">Cerita yang menginspirasi minggu ini</p>
                    </div>
                </div>

                {/* Featured Story Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    {/* Hero Image */}
                    <div className="relative h-64 lg:h-80 bg-gradient-to-r from-primary to-secondary">
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center text-white">
                                <Trophy className="w-16 h-16 mx-auto mb-4 text-amber-400" />
                                <Badge className="bg-amber-500 text-white border-none mb-2">
                                    {featuredStory.prestasi}
                                </Badge>
                                <h3 className="text-xl lg:text-2xl font-bold max-w-2xl px-4">
                                    {featuredStory.lomba}
                                </h3>
                            </div>
                        </div>
                        {/* Floating Badges */}
                        <div className="absolute top-4 left-4 flex gap-2">
                            <Badge className="bg-white/90 text-primary">{featuredStory.kategori}</Badge>
                            <Badge className="bg-primary text-white">{featuredStory.tingkat}</Badge>
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2">
                            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                                <Heart className="w-5 h-5" />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 lg:p-8">
                        {/* Title & Meta */}
                        <div className="mb-6">
                            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                                {featuredStory.title}
                            </h3>
                            <p className="text-lg text-gray-600">{featuredStory.subtitle}</p>
                            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" /> {featuredStory.tanggal}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" /> {featuredStory.lokasi}
                                </span>
                            </div>
                        </div>

                        {/* Team */}
                        <div className="mb-8">
                            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Tim</h4>
                            <div className="flex flex-wrap gap-4">
                                {featuredStory.tim.map((member, idx) => (
                                    <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 pr-5">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                                            {member.nama.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{member.nama}</p>
                                            <p className="text-sm text-primary">{member.role}</p>
                                            <p className="text-xs text-gray-500">{member.jurusan}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 mb-8 border-l-4 border-primary">
                            <p className="text-gray-700 leading-relaxed text-lg">
                                {featuredStory.ringkasan}
                            </p>
                        </div>

                        {/* Journey Timeline */}
                        <div className="mb-8">
                            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">Perjalanan</h4>

                            {/* Timeline Navigation */}
                            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                                {featuredStory.cerita.map((phase, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActivePhase(idx)}
                                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${activePhase === idx
                                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {phase.fase}
                                    </button>
                                ))}
                            </div>

                            {/* Active Phase Content */}
                            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-primary font-bold">{activePhase + 1}</span>
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-gray-900">{featuredStory.cerita[activePhase].judul}</h5>
                                        <p className="text-sm text-gray-500">{featuredStory.cerita[activePhase].bulan}</p>
                                    </div>
                                    <Badge variant="accent" className="ml-auto">
                                        {featuredStory.cerita[activePhase].highlight}
                                    </Badge>
                                </div>
                                <p className="text-gray-600 leading-relaxed">
                                    {featuredStory.cerita[activePhase].konten}
                                </p>
                            </div>
                        </div>

                        {/* Quote */}
                        <div className="bg-gradient-to-br from-primary to-primary-700 rounded-xl p-6 lg:p-8 text-white mb-8 relative overflow-hidden">
                            <Quote className="absolute top-4 left-4 w-12 h-12 text-white/20" />
                            <div className="relative z-10">
                                <p className="text-lg lg:text-xl italic leading-relaxed mb-4">
                                    "{featuredStory.quotes[0].text}"
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                                        {featuredStory.quotes[0].author.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{featuredStory.quotes[0].author}</p>
                                        <p className="text-sm text-white/80">{featuredStory.quotes[0].role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Impact Stats */}
                        <div className="mb-8">
                            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Dampak</h4>
                            <div className="grid grid-cols-3 gap-4">
                                {featuredStory.dampak.map((item, idx) => (
                                    <div key={idx} className="text-center p-4 bg-gray-50 rounded-xl">
                                        <item.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                                        <p className="text-sm text-gray-500">{item.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tags & Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-100">
                            <div className="flex flex-wrap gap-2">
                                {featuredStory.tags.map((tag, idx) => (
                                    <Badge key={idx} variant="outline">{tag}</Badge>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline">
                                    <Share2 className="w-4 h-4 mr-2" /> Share
                                </Button>
                                <Button>
                                    <ExternalLink className="w-4 h-4 mr-2" /> Lihat Selengkapnya
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* More Stories Section */}
            <section className="bg-white py-16">
                <div className="container-apm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Cerita Lainnya</h2>
                            <p className="text-gray-500">Lebih banyak kisah inspiratif dari Polinema</p>
                        </div>
                        <Link href="/prestasi">
                            <Button variant="outline">
                                Lihat Semua <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {moreStories.map((story) => (
                            <div
                                key={story.id}
                                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
                            >
                                {/* Card Header */}
                                <div className={`h-32 bg-gradient-to-br ${story.warna} p-4 relative`}>
                                    <Badge className="bg-white/90 text-gray-800 mb-2">{story.prestasi}</Badge>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <p className="text-white/80 text-sm">{story.tingkat}</p>
                                    </div>
                                    <div className="absolute top-4 right-4 flex gap-1">
                                        {story.tim.slice(0, 3).map((member, idx) => (
                                            <div
                                                key={idx}
                                                className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-white text-xs font-medium border-2 border-white/50"
                                                style={{ marginLeft: idx > 0 ? '-8px' : '0' }}
                                            >
                                                {member.nama.split(' ')[0][0]}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-4">
                                    <Badge variant="outline" size="sm" className="mb-2">{story.kategori}</Badge>
                                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                        {story.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                                        {story.ringkasan}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-400">{story.tanggal}</span>
                                        <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Alumni Testimonials */}
            <section className="container-apm py-16">
                <div className="text-center mb-12">
                    <Badge variant="secondary" className="mb-4">
                        <GraduationCap className="w-3 h-3 mr-1" /> Alumni
                    </Badge>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                        Kata Alumni Berprestasi
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Mereka yang pernah berprestasi di APM Polinema dan kini berkarir di perusahaan ternama
                    </p>
                </div>

                {/* Testimonial Carousel */}
                <div className="relative max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 border border-gray-100">
                        <Quote className="w-12 h-12 text-primary/20 mb-6" />

                        <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed mb-8 italic">
                            "{testimonials[activeTestimonial].quote}"
                        </p>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold">
                                    {testimonials[activeTestimonial].nama.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{testimonials[activeTestimonial].nama}</h4>
                                    <p className="text-primary font-medium">{testimonials[activeTestimonial].sekarang}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline" size="sm">{testimonials[activeTestimonial].prestasi}</Badge>
                                        <span className="text-xs text-gray-400">• Angkatan {testimonials[activeTestimonial].angkatan}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setActiveTestimonial(prev => prev === 0 ? testimonials.length - 1 : prev - 1)}
                                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-primary transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setActiveTestimonial(prev => prev === testimonials.length - 1 ? 0 : prev + 1)}
                                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-primary transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Dots */}
                    <div className="flex justify-center gap-2 mt-6">
                        {testimonials.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveTestimonial(idx)}
                                className={`w-2 h-2 rounded-full transition-all ${activeTestimonial === idx ? 'w-8 bg-primary' : 'bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-primary to-secondary py-16">
                <div className="container-apm text-center text-white">
                    <Trophy className="w-16 h-16 mx-auto mb-6 text-amber-400" />
                    <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                        Ingin Ceritamu Ditampilkan?
                    </h2>
                    <p className="text-white/80 mb-8 max-w-2xl mx-auto">
                        Submit prestasi kamu sekarang dan jadilah bagian dari deretan success stories Polinema!
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/prestasi/submit">
                            <Button className="bg-white text-primary hover:bg-white/90 shadow-lg">
                                <Trophy className="w-4 h-4 mr-2" /> Submit Prestasi
                            </Button>
                        </Link>
                        <Link href="/prestasi">
                            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                                Lihat Galeri Prestasi
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
