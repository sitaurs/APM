'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Breadcrumb, Badge, Button } from '@/components/ui';
import {
    Target,
    Lightbulb,
    Heart,
    Star,
    Rocket,
    Users,
    Globe,
    Award,
    TrendingUp,
    Sparkles,
    CheckCircle2,
    ArrowRight,
    Trophy,
    GraduationCap,
    Zap,
    Shield,
    Eye,
    Compass,
    Flag,
    Mountain
} from 'lucide-react';

// Nilai-nilai Inti
const coreValues = [
    {
        icon: Star,
        title: 'Keunggulan',
        subtitle: 'Excellence',
        description: 'Selalu berusaha mencapai standar tertinggi dalam setiap kegiatan dan pencapaian.',
        color: 'from-amber-400 to-orange-500',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
    },
    {
        icon: Lightbulb,
        title: 'Inovasi',
        subtitle: 'Innovation',
        description: 'Mendorong kreativitas dan pemikiran baru untuk memecahkan masalah kompleks.',
        color: 'from-blue-400 to-indigo-500',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
    },
    {
        icon: Users,
        title: 'Kolaborasi',
        subtitle: 'Collaboration',
        description: 'Membangun kerjasama yang kuat antar mahasiswa, dosen, dan mitra industri.',
        color: 'from-emerald-400 to-teal-500',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
    },
    {
        icon: Heart,
        title: 'Integritas',
        subtitle: 'Integrity',
        description: 'Menjunjung tinggi kejujuran dan etika dalam berkarya dan berkompetisi.',
        color: 'from-rose-400 to-pink-500',
        bgColor: 'bg-rose-50',
        borderColor: 'border-rose-200',
    },
    {
        icon: Rocket,
        title: 'Prestasi',
        subtitle: 'Achievement',
        description: 'Berorientasi pada hasil dan pencapaian nyata di tingkat nasional dan internasional.',
        color: 'from-purple-400 to-violet-500',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
    },
    {
        icon: Globe,
        title: 'Berdampak',
        subtitle: 'Impactful',
        description: 'Menciptakan karya yang memberikan manfaat nyata bagi masyarakat dan bangsa.',
        color: 'from-cyan-400 to-blue-500',
        bgColor: 'bg-cyan-50',
        borderColor: 'border-cyan-200',
    },
];

// Misi Points
const misiPoints = [
    {
        number: '01',
        title: 'Informasi Komprehensif',
        description: 'Menyediakan informasi lengkap dan terkini tentang lomba, kompetisi, dan peluang pengembangan diri di tingkat lokal, nasional, dan internasional.',
        icon: Compass,
    },
    {
        number: '02',
        title: 'Fasilitasi & Pembinaan',
        description: 'Memfasilitasi pendaftaran lomba dan memberikan pembinaan intensif kepada mahasiswa untuk memaksimalkan potensi dan peluang kemenangan.',
        icon: Shield,
    },
    {
        number: '03',
        title: 'Dokumentasi & Apresiasi',
        description: 'Mendokumentasikan dan mempublikasikan setiap prestasi mahasiswa sebagai bentuk apresiasi dan inspirasi bagi generasi selanjutnya.',
        icon: Award,
    },
    {
        number: '04',
        title: 'Jaringan & Kemitraan',
        description: 'Membangun jaringan kerjasama yang luas dengan industri, institusi pendidikan, dan organisasi untuk membuka lebih banyak peluang.',
        icon: Users,
    },
    {
        number: '05',
        title: 'Pengembangan Talenta',
        description: 'Mengembangkan program pelatihan dan mentorship untuk meningkatkan hard skill dan soft skill mahasiswa secara berkelanjutan.',
        icon: GraduationCap,
    },
];

// Tujuan Strategis
const strategicGoals = [
    {
        target: '500+',
        label: 'Prestasi per tahun',
        description: 'Target pencapaian prestasi tahunan',
        icon: Trophy
    },
    {
        target: '100+',
        label: 'Lomba terfasilitasi',
        description: 'Lomba yang diikuti setiap tahun',
        icon: Flag
    },
    {
        target: '50+',
        label: 'Mitra industri',
        description: 'Partner dan sponsor kegiatan',
        icon: Users
    },
    {
        target: 'Top 5',
        label: 'Politeknik terbaik',
        description: 'Ranking prestasi kemahasiswaan',
        icon: Mountain
    },
];

// Animated Counter Component
function AnimatedCounter({ target, duration = 2000 }: { target: string; duration?: number }) {
    const [count, setCount] = useState(0);
    const numericTarget = parseInt(target.replace(/\D/g, '')) || 0;
    const suffix = target.replace(/[0-9]/g, '');

    useEffect(() => {
        if (numericTarget === 0) return;

        let startTime: number;
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            setCount(Math.floor(progress * numericTarget));
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }, [numericTarget, duration]);

    return <span>{numericTarget > 0 ? count : ''}{suffix}</span>;
}

export default function VisiMisiPage() {
    const [activeValue, setActiveValue] = useState(0);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Animated Hero Section */}
            <div className="relative bg-gradient-to-br from-primary via-primary-600 to-primary-700 overflow-hidden">
                {/* Animated Orbs */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-secondary/30 to-transparent rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-3xl animate-pulse delay-700" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full" />

                    {/* Floating Icons */}
                    <div className="absolute top-20 left-[10%] text-white/10 animate-bounce delay-100">
                        <Trophy className="w-12 h-12" />
                    </div>
                    <div className="absolute top-40 right-[15%] text-white/10 animate-bounce delay-300">
                        <Star className="w-8 h-8" />
                    </div>
                    <div className="absolute bottom-32 left-[20%] text-white/10 animate-bounce delay-500">
                        <Rocket className="w-10 h-10" />
                    </div>
                    <div className="absolute bottom-20 right-[25%] text-white/10 animate-bounce delay-700">
                        <Award className="w-14 h-14" />
                    </div>
                </div>

                {/* Content */}
                <div className="container-apm py-20 relative z-10">
                    <Breadcrumb
                        items={[
                            { label: 'Tentang', href: '/about' },
                            { label: 'Visi & Misi' }
                        ]}
                        className="text-white/70 [&_a]:text-white/70 [&_a:hover]:text-white mb-8"
                    />

                    <div className="text-center max-w-4xl mx-auto">
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30 mb-6">
                            <Sparkles className="w-3 h-3 mr-1" /> Our Purpose
                        </Badge>
                        <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            Visi & Misi
                        </h1>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto">
                            Membangun generasi mahasiswa berprestasi yang siap bersaing di kancah global
                        </p>
                    </div>
                </div>

                {/* Wave Divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB" />
                    </svg>
                </div>
            </div>

            {/* Visi Section */}
            <section className="container-apm py-20">
                <div className="max-w-5xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Visual */}
                        <div className="relative">
                            <div className="aspect-square max-w-md mx-auto relative">
                                {/* Rotating Ring */}
                                <div className="absolute inset-0 rounded-full border-4 border-dashed border-primary/20 animate-spin" style={{ animationDuration: '20s' }} />

                                {/* Inner Circle */}
                                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary to-secondary shadow-2xl flex items-center justify-center">
                                    <div className="text-center text-white p-8">
                                        <Eye className="w-16 h-16 mx-auto mb-4" />
                                        <h3 className="text-2xl font-bold">VISI</h3>
                                        <p className="text-sm text-white/80 mt-2">Our Vision</p>
                                    </div>
                                </div>

                                {/* Orbiting Icons */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
                                    <div className="w-14 h-14 rounded-full bg-amber-500 shadow-lg flex items-center justify-center text-white">
                                        <Trophy className="w-7 h-7" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2">
                                    <div className="w-14 h-14 rounded-full bg-emerald-500 shadow-lg flex items-center justify-center text-white">
                                        <Globe className="w-7 h-7" />
                                    </div>
                                </div>
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2">
                                    <div className="w-14 h-14 rounded-full bg-purple-500 shadow-lg flex items-center justify-center text-white">
                                        <Star className="w-7 h-7" />
                                    </div>
                                </div>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2">
                                    <div className="w-14 h-14 rounded-full bg-rose-500 shadow-lg flex items-center justify-center text-white">
                                        <Rocket className="w-7 h-7" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Content */}
                        <div>
                            <Badge variant="primary" className="mb-4">
                                <Eye className="w-3 h-3 mr-1" /> Visi Kami
                            </Badge>
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                                Menjadi Pusat Pengembangan Prestasi Mahasiswa Terkemuka di Indonesia
                            </h2>
                            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border-l-4 border-primary mb-6">
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    Mewujudkan APM Politeknik Negeri Malang sebagai <strong className="text-primary">pusat keunggulan</strong> yang menghasilkan talenta-talenta unggul berdaya saing <strong className="text-secondary">global</strong>, berkontribusi nyata bagi kemajuan bangsa melalui inovasi dan prestasi.
                                </p>
                            </div>

                            {/* Vision Pillars */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                                    <Trophy className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                                    <p className="text-sm font-semibold text-gray-700">Berprestasi</p>
                                </div>
                                <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                                    <Globe className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                    <p className="text-sm font-semibold text-gray-700">Berdaya Saing</p>
                                </div>
                                <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                                    <Heart className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                                    <p className="text-sm font-semibold text-gray-700">Berkontribusi</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Misi Section */}
            <section className="bg-white py-20">
                <div className="container-apm">
                    <div className="text-center mb-16">
                        <Badge variant="secondary" className="mb-4">
                            <Target className="w-3 h-3 mr-1" /> Misi Kami
                        </Badge>
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            5 Pilar Misi Strategis
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            Langkah-langkah konkret yang kami lakukan untuk mewujudkan visi
                        </p>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        {/* Vertical Timeline */}
                        <div className="relative">
                            {/* Vertical Line */}
                            <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-accent rounded-full hidden md:block" />

                            {misiPoints.map((misi, index) => (
                                <div
                                    key={index}
                                    className={`relative flex items-start gap-6 mb-12 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                                        }`}
                                >
                                    {/* Timeline Node */}
                                    <div className="absolute left-8 lg:left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg hidden md:flex items-center justify-center z-10">
                                        <misi.icon className="w-7 h-7 text-white" />
                                    </div>

                                    {/* Content Card */}
                                    <div className={`flex-1 ${index % 2 === 0 ? 'lg:pr-24 lg:text-right' : 'lg:pl-24'}`}>
                                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow ml-20 lg:ml-0">
                                            <div className={`flex items-center gap-3 mb-3 ${index % 2 === 0 ? 'lg:justify-end' : ''}`}>
                                                <span className="text-4xl font-bold text-primary/20">{misi.number}</span>
                                                <misi.icon className="w-6 h-6 text-primary md:hidden" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{misi.title}</h3>
                                            <p className="text-gray-600 leading-relaxed">{misi.description}</p>
                                        </div>
                                    </div>

                                    {/* Spacer for alternating layout */}
                                    <div className="flex-1 hidden lg:block" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="container-apm py-20">
                <div className="text-center mb-16">
                    <Badge variant="accent" className="mb-4">
                        <Heart className="w-3 h-3 mr-1" /> Nilai Kami
                    </Badge>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        6 Nilai Inti
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Prinsip-prinsip yang menjadi landasan setiap langkah kami
                    </p>
                </div>

                {/* Values Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coreValues.map((value, index) => (
                        <div
                            key={index}
                            className={`group cursor-pointer ${value.bgColor} ${value.borderColor} border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                            onMouseEnter={() => setActiveValue(index)}
                        >
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${value.color} shadow-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <value.icon className="w-7 h-7 text-white" />
                            </div>
                            <div className="flex items-baseline gap-2 mb-2">
                                <h3 className="text-xl font-bold text-gray-900">{value.title}</h3>
                                <span className="text-sm text-gray-400 italic">{value.subtitle}</span>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Strategic Goals Section */}
            <section className="bg-gradient-to-br from-primary via-primary-600 to-primary-700 py-20 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }} />
                </div>

                <div className="container-apm relative z-10">
                    <div className="text-center mb-12">
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30 mb-4">
                            <TrendingUp className="w-3 h-3 mr-1" /> Target Strategis
                        </Badge>
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                            Tujuan 2026
                        </h2>
                        <p className="text-white/80 max-w-2xl mx-auto">
                            Target pencapaian yang ingin kami raih bersama
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {strategicGoals.map((goal, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center hover:bg-white/20 transition-colors">
                                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                                    <goal.icon className="w-7 h-7 text-white" />
                                </div>
                                <p className="text-4xl font-bold text-white mb-2">
                                    <AnimatedCounter target={goal.target} />
                                </p>
                                <p className="text-white font-medium mb-1">{goal.label}</p>
                                <p className="text-sm text-white/60">{goal.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container-apm py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 relative overflow-hidden">
                        {/* Decorative */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/20 rounded-full blur-3xl" />

                        <div className="relative z-10">
                            <Zap className="w-12 h-12 text-amber-400 mx-auto mb-6" />
                            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                                Bergabung Bersama Kami
                            </h2>
                            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                                Jadilah bagian dari perjalanan prestasi Polinema. Mulai langkah pertamamu sekarang!
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link href="/prestasi/submit">
                                    <Button className="bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl px-8 py-3">
                                        <Trophy className="w-4 h-4 mr-2" /> Submit Prestasi
                                    </Button>
                                </Link>
                                <Link href="/lomba">
                                    <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-3">
                                        Jelajahi Lomba <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
