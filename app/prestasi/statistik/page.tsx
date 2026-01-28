'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Breadcrumb, Badge, Button } from '@/components/ui';
import {
    Trophy,
    Medal,
    Award,
    Star,
    TrendingUp,
    BarChart3,
    Globe,
    ArrowUp,
    ArrowDown,
    Calendar,
    Users,
    Target,
    Building2,
    GraduationCap,
    ExternalLink,
    Filter,
    ChevronDown,
    Sparkles
} from 'lucide-react';

// Animated Counter Component
function AnimatedCounter({ target, suffix = '', duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number;
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }, [target, duration]);

    return <span>{count.toLocaleString()}{suffix}</span>;
}

// Progress Bar with Animation
function AnimatedProgressBar({ value, max, color, delay = 0 }: { value: number; max: number; color: string; delay?: number }) {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setWidth((value / max) * 100);
        }, delay);
        return () => clearTimeout(timer);
    }, [value, max, delay]);

    return (
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
                style={{ width: `${width}%` }}
            />
        </div>
    );
}

// Data Statistik
const overviewStats = [
    {
        label: 'Total Prestasi',
        value: 1245,
        change: '+12%',
        changeLabel: 'vs 2025',
        isPositive: true,
        icon: Trophy,
        iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    },
    {
        label: 'Juara 1',
        value: 320,
        change: '+8%',
        changeLabel: 'vs 2025',
        isPositive: true,
        icon: Medal,
        iconBg: 'bg-gradient-to-br from-amber-400 to-amber-500',
    },
    {
        label: 'Internasional',
        value: 150,
        change: '+15%',
        changeLabel: 'vs 2025',
        isPositive: true,
        icon: Globe,
        iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    },
    {
        label: 'Tahun Berjalan (2026 YTD)',
        value: 450,
        change: 'Target: 1,500',
        changeLabel: '',
        isPositive: true,
        icon: Target,
        iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
        showProgress: true,
        progressValue: 30,
    },
];

// Data Prestasi Per Tahun
const prestasiPerTahun = [
    { tahun: '2020', total: 450, juara1: 120, juara2: 150, juara3: 100, lainnya: 80 },
    { tahun: '2021', total: 250, juara1: 80, juara2: 90, juara3: 50, lainnya: 30 },
    { tahun: '2022', total: 350, juara1: 100, juara2: 120, juara3: 80, lainnya: 50 },
    { tahun: '2023', total: 300, juara1: 90, juara2: 100, juara3: 70, lainnya: 40 },
    { tahun: '2024', total: 250, juara1: 70, juara2: 80, juara3: 60, lainnya: 40 },
    { tahun: '2025', total: 400, juara1: 110, juara2: 130, juara3: 100, lainnya: 60 },
    { tahun: '2026', total: 450, juara1: 130, juara2: 140, juara3: 110, lainnya: 70 },
];

// Data Tingkat
const prestasiPerTingkat = [
    { tingkat: 'Nasional', total: 850, persentase: 68, color: '#0B4F94' },
    { tingkat: 'Internasional', total: 395, persentase: 32, color: '#00A8E8' },
];

// Data Kategori
const prestasiPerKategori = [
    { kategori: 'Teknologi & IT', total: 66, progress: 37, color: 'bg-blue-500' },
    { kategori: 'Bisnis & Manajemen', total: 80, progress: 36, color: 'bg-amber-500' },
    { kategori: 'Seni & Desain', total: 66, progress: 79, color: 'bg-purple-500' },
    { kategori: 'Bisnis & Manajemen', total: 18, progress: 15, color: 'bg-emerald-500' },
    { kategori: 'Bisnis & Manajemen', total: 39, progress: 25, color: 'bg-rose-500' },
    { kategori: 'Teknis & Desain', total: 30, progress: 20, color: 'bg-cyan-500' },
];

// Data Per Jurusan
const prestasiPerJurusan = [
    { jurusan: 'Teknologi & IT', kode: 'JTI', total: 450, juara1: 21, rasio: 11 },
    { jurusan: 'Bisnis & Manajemen', kode: 'JBM', total: 395, juara1: 16, rasio: 2 },
    { jurusan: 'Departemen Selatan', kode: 'JDS', total: 350, juara1: 16, rasio: 14 },
    { jurusan: 'Pertanian daratan', kode: 'JPD', total: 169, juara1: 11, rasio: 4 },
    { jurusan: 'Prestasi', kode: 'JPS', total: 78, juara1: 8, rasio: 14 },
    { jurusan: 'Jurusan', kode: 'JRS', total: 75, juara1: 7, rasio: 1 },
];

// Top Performers
const topPerformers = [
    { nama: 'Marse Kamar', nim: '2141720***', jurusan: 'Jurusan', prestasi: 150, ranking: 1, color: 'from-amber-400 to-amber-500' },
    { nama: 'Nama Rama', nim: '2141720***', jurusan: 'Jurusan', prestasi: 150, ranking: 2, color: 'from-gray-300 to-gray-400' },
    { nama: 'Nere Maut', nim: '2141720***', jurusan: 'Jurusan', prestasi: 150, ranking: 3, color: 'from-amber-600 to-amber-700' },
    { nama: 'Kide Nasel', nim: '2141720***', jurusan: 'Jurusan', prestasi: 150, ranking: 4, color: 'from-blue-400 to-blue-500' },
    { nama: 'Nama Samar', nim: '2141720***', jurusan: 'Jurusan', prestasi: 150, ranking: 5, color: 'from-blue-400 to-blue-500' },
];

// Prestasi Terbaru
const prestasiTerbaru = [
    { title: 'Teranotil isrinitan Sempeni Poerintodha...', tingkat: 'Nasional', tanggal: '27 Jul, 2023', verified: true },
    { title: 'Testani/olllanu oota 1', tingkat: 'Nasional', tanggal: '27 Jul, 2023', verified: true },
    { title: 'Protamer Ramenlar Nasional', tingkat: 'Internasional', tanggal: '27 Jul, 2023', verified: true },
    { title: 'Pretasi Kenorel Juluan Reseigaras Malang', tingkat: 'Internasional', tanggal: '27 Jul, 2023', verified: true },
];

export default function StatistikPrestasiPage() {
    const [selectedPeriod, setSelectedPeriod] = useState('2026 YTD');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const maxTahun = Math.max(...prestasiPerTahun.map(d => d.total));
    const maxJurusan = Math.max(...prestasiPerJurusan.map(d => d.total));

    return (
        <div className="min-h-screen bg-[#0B4F94]">
            {/* Blue Header Section */}
            <div className="bg-[#0B4F94] text-white">
                <div className="container-apm py-6">
                    <Breadcrumb
                        items={[
                            { label: 'Prestasi', href: '/prestasi' },
                            { label: 'Statistik' }
                        ]}
                        className="text-white/50 [&_a]:text-white/50 [&_a:hover]:text-white mb-6"
                    />

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                                Statistik Prestasi
                            </h1>
                            <p className="text-white/60">
                                Data capaian prestasi mahasiswa Politeknik Negeri Malang
                            </p>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">
                                Periode: {selectedPeriod}
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">
                                Tingkat: Semua
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">
                                Kategori: Semua
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">
                                Jurusan: Semua
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mb-8">
                        <Link href="/prestasi">
                            <Button variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10">
                                Lihat Semua Prestasi
                            </Button>
                        </Link>
                        <Link href="/prestasi/submit">
                            <Button className="bg-[#FF7F11] hover:bg-[#e67310] text-white border-none">
                                Submit Prestasi
                            </Button>
                        </Link>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 -mb-16 relative z-10">
                        {overviewStats.map((stat, index) => (
                            <div
                                key={stat.label}
                                className={`bg-white rounded-xl shadow-xl p-5 transform transition-all duration-500 hover:scale-[1.02] ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                                    }`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center shadow-lg`}>
                                        <stat.icon className="w-6 h-6 text-white" />
                                    </div>
                                    {stat.showProgress ? (
                                        <span className="text-xs text-gray-500">{stat.change}</span>
                                    ) : (
                                        <div className={`flex items-center gap-1 text-sm font-medium ${stat.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {stat.isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                            {stat.change}
                                        </div>
                                    )}
                                </div>
                                <p className="text-3xl font-bold text-gray-900 mb-1">
                                    {mounted && <AnimatedCounter target={stat.value} />}
                                </p>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                                {stat.changeLabel && <p className="text-xs text-gray-400 mt-1">{stat.changeLabel}</p>}
                                {stat.showProgress && (
                                    <div className="mt-3">
                                        <AnimatedProgressBar value={stat.progressValue || 0} max={100} color="bg-purple-500" delay={500} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content - Light Background */}
            <div className="bg-gray-50 pt-24 pb-12">
                <div className="container-apm">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Left Column - 2/3 width */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Tren Prestasi per Tahun */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">
                                    Tren Prestasi per Tahun (2020–2026)
                                </h3>

                                {/* Legend */}
                                <div className="flex flex-wrap gap-4 mb-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded bg-[#0B4F94]"></div>
                                        <span className="text-xs text-gray-600">Juara 1</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded bg-[#00A8E8]"></div>
                                        <span className="text-xs text-gray-600">Juara 2</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded bg-[#FF7F11]"></div>
                                        <span className="text-xs text-gray-600">Juara 3</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded bg-gray-300"></div>
                                        <span className="text-xs text-gray-600">Finalis/Lainnya</span>
                                    </div>
                                </div>

                                {/* Bar Chart */}
                                <div className="space-y-3">
                                    {prestasiPerTahun.map((data, index) => (
                                        <div key={data.tahun} className="flex items-center gap-4">
                                            <span className="text-sm font-medium text-gray-600 w-12">{data.tahun}</span>
                                            <div className="flex-1 flex h-8 rounded-lg overflow-hidden bg-gray-100">
                                                <div
                                                    className="bg-[#0B4F94] transition-all duration-1000 ease-out flex items-center justify-center text-xs text-white font-medium"
                                                    style={{ width: mounted ? `${(data.juara1 / maxTahun) * 100}%` : '0%', transitionDelay: `${index * 100}ms` }}
                                                >
                                                    {data.juara1 > 50 && data.juara1}
                                                </div>
                                                <div
                                                    className="bg-[#00A8E8] transition-all duration-1000 ease-out"
                                                    style={{ width: mounted ? `${(data.juara2 / maxTahun) * 100}%` : '0%', transitionDelay: `${index * 100 + 50}ms` }}
                                                />
                                                <div
                                                    className="bg-[#FF7F11] transition-all duration-1000 ease-out"
                                                    style={{ width: mounted ? `${(data.juara3 / maxTahun) * 100}%` : '0%', transitionDelay: `${index * 100 + 100}ms` }}
                                                />
                                                <div
                                                    className="bg-gray-300 transition-all duration-1000 ease-out"
                                                    style={{ width: mounted ? `${(data.lainnya / maxTahun) * 100}%` : '0%', transitionDelay: `${index * 100 + 150}ms` }}
                                                />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900 w-12 text-right">{data.total}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Berdasarkan Kategori */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Berdasarkan Kategori</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {prestasiPerKategori.map((item, index) => (
                                        <div key={index} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className={`w-3 h-3 rounded ${item.color}`}></div>
                                                <span className="text-sm text-gray-600">{item.kategori}</span>
                                            </div>
                                            <p className="text-2xl font-bold text-gray-900 mb-1">{item.total}%</p>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-gray-500">{item.progress}%</span>
                                                <span className="text-xs text-gray-400">Progress</span>
                                            </div>
                                            <AnimatedProgressBar value={item.progress} max={100} color={item.color} delay={index * 100} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Performa Per Jurusan */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-gray-900">Performa Per Jurusan</h3>
                                    <div className="flex gap-4 text-xs text-gray-500">
                                        <span>Total / <span className="text-amber-500">Juara 1</span> / Rasio Juara 1</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {prestasiPerJurusan.map((item, index) => (
                                        <div key={index}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-gray-700">{item.jurusan}</span>
                                                <div className="flex items-center gap-4 text-sm">
                                                    <span className="font-bold text-gray-900">{item.total}</span>
                                                    <span className="text-amber-500">/ {item.juara1}</span>
                                                    <span className="text-gray-400">/ {item.rasio}</span>
                                                </div>
                                            </div>
                                            <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="absolute h-full bg-[#0B4F94] rounded-full transition-all duration-1000 ease-out"
                                                    style={{ width: mounted ? `${(item.total / maxJurusan) * 100}%` : '0%', transitionDelay: `${index * 100}ms` }}
                                                />
                                                <div
                                                    className="absolute h-full bg-amber-400 rounded-full transition-all duration-1000 ease-out"
                                                    style={{ width: mounted ? `${(item.juara1 / maxJurusan) * 100}%` : '0%', transitionDelay: `${index * 100 + 200}ms` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - 1/3 width */}
                        <div className="space-y-6">

                            {/* Berdasarkan Tingkat - Donut */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Berdasarkan Tingkat</h3>

                                <div className="relative w-48 h-48 mx-auto mb-6">
                                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                                        <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                                        <circle
                                            cx="50" cy="50" r="40" fill="none"
                                            stroke="#0B4F94" strokeWidth="12"
                                            strokeDasharray={`${68 * 2.51} ${100 * 2.51}`}
                                            className="transition-all duration-1000 ease-out"
                                            style={{ strokeDashoffset: mounted ? 0 : 251 }}
                                        />
                                        <circle
                                            cx="50" cy="50" r="40" fill="none"
                                            stroke="#00A8E8" strokeWidth="12"
                                            strokeDasharray={`${32 * 2.51} ${100 * 2.51}`}
                                            strokeDashoffset={`${-68 * 2.51}`}
                                            className="transition-all duration-1000 ease-out delay-300"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <p className="text-3xl font-bold text-gray-900">{mounted && <AnimatedCounter target={1245} />}</p>
                                        <p className="text-sm text-gray-500">Total</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {prestasiPerTingkat.map((item) => (
                                        <div key={item.tingkat} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                                <span className="text-sm text-gray-600">{item.tingkat}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-gray-900">{item.total}</span>
                                                <span className="text-sm text-gray-400">({item.persentase}%)</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Top Performers */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-gray-900">Top Performers</h3>
                                    <span className="text-xs text-gray-400">All time / Tahun Ini</span>
                                </div>

                                <div className="space-y-3">
                                    {topPerformers.map((person, index) => (
                                        <div
                                            key={index}
                                            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:bg-gray-50 ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                                                }`}
                                            style={{ transitionDelay: `${index * 100}ms` }}
                                        >
                                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${person.color} flex items-center justify-center text-white font-bold text-sm`}>
                                                {person.ranking}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">{person.nama}</p>
                                                <p className="text-xs text-gray-500">{person.nim}</p>
                                            </div>
                                            <div className="flex items-center gap-1 text-amber-500">
                                                <Trophy className="w-4 h-4" />
                                                <span className="font-bold">{person.prestasi}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Prestasi Terbaru */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Prestasi Terbaru Ditambahkan</h3>

                                <div className="grid grid-cols-2 gap-3">
                                    {prestasiTerbaru.map((item, index) => (
                                        <div key={index} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                            <Badge
                                                variant={item.tingkat === 'Internasional' ? 'primary' : 'secondary'}
                                                size="sm"
                                                className="mb-2"
                                            >
                                                {item.tingkat}
                                            </Badge>
                                            {item.verified && (
                                                <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-400 text-white text-[8px]">✓</span>
                                            )}
                                            <p className="text-xs text-gray-500 mb-1">{item.tanggal}</p>
                                            <p className="text-xs text-gray-700 line-clamp-2">{item.title}</p>
                                            <button className="mt-2 text-xs text-[#0B4F94] hover:underline">Lihat Detail</button>
                                        </div>
                                    ))}
                                </div>

                                <Link href="/prestasi" className="block mt-4">
                                    <Button variant="outline" fullWidth size="sm">
                                        Lihat Semua Prestasi
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="mt-8 bg-gradient-to-r from-[#0B4F94] to-[#00A8E8] rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h2 className="text-xl font-bold mb-2">Punya Prestasi yang Ingin Ditampilkan?</h2>
                            <p className="text-white/80">Submit prestasi kamu dan jadilah bagian dari statistik ini!</p>
                        </div>
                        <div className="flex gap-3">
                            <Link href="/prestasi/submit">
                                <Button className="bg-[#FF7F11] hover:bg-[#e67310] text-white border-none">
                                    Submit Prestasi
                                </Button>
                            </Link>
                            <Link href="/prestasi">
                                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                                    Lihat Galeri
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
