import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb, Button } from '@/components/ui';
import { BookOpen, ArrowLeft, CheckCircle, AlertTriangle, FileText, Users, Presentation } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Panduan Partisipasi | APM Polinema',
    description: 'Panduan lengkap untuk berpartisipasi dalam expo',
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

interface Step {
    step: number;
    title: string;
    description: string;
}

const guidelines = {
    persyaratan: [
        'Mahasiswa aktif Polinema',
        'Memiliki karya/proyek yang siap dipamerkan',
        'Mendapat persetujuan dosen pembimbing',
        'Mengisi formulir pendaftaran',
    ],
    dokumen: [
        'Proposal singkat proyek (maks. 5 halaman)',
        'Foto/video prototype atau produk',
        'Surat rekomendasi dari dosen',
        'KTM aktif',
    ],
    booth: [
        'Ukuran booth standar: 2m x 2m',
        'Meja dan kursi disediakan panitia',
        'Poster A1 wajib disiapkan peserta',
        'Listrik tersedia (maks. 500W)',
    ],
};

async function getExpoSteps(): Promise<Step[]> {
    try {
        const res = await fetch(`${BASE_URL}/api/panduan?type=expo`, {
            next: { revalidate: 60 },
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.data || [];
    } catch {
        return [];
    }
}

export default async function PanduanExpoPage() {
    const steps = await getExpoSteps();

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Header - APM Style */}
            <section className="bg-gradient-to-br from-primary via-primary-600 to-primary-700 text-white">
                <div className="container-apm py-12">
                    <Breadcrumb
                        items={[
                            { label: 'Expo', href: '/expo' },
                            { label: 'Panduan Partisipasi' },
                        ]}
                        className="text-white/70 [&_a]:text-white/70 [&_a:hover]:text-white mb-6"
                    />
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                            <BookOpen className="w-8 h-8 text-accent" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold font-heading">Panduan Partisipasi</h1>
                            <p className="text-white/80 mt-1">Cara ikut serta dalam expo APM</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-10">
                <div className="container-apm">
                    {/* Info Cards */}
                    <div className="grid gap-6 md:grid-cols-3 mb-10">
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="font-semibold text-text-main">Persyaratan Umum</h3>
                            </div>
                            <ul className="space-y-2">
                                {guidelines.persyaratan.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-secondary" />
                                </div>
                                <h3 className="font-semibold text-text-main">Dokumen Dibutuhkan</h3>
                            </div>
                            <ul className="space-y-2">
                                {guidelines.dokumen.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                                    <Presentation className="w-5 h-5 text-accent" />
                                </div>
                                <h3 className="font-semibold text-text-main">Standar Booth</h3>
                            </div>
                            <ul className="space-y-2">
                                {guidelines.booth.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Steps */}
                    {steps.length > 0 && (
                        <>
                            <h2 className="text-xl font-bold text-text-main mb-4">Langkah Pendaftaran</h2>
                            <div className="space-y-4 mb-8">
                                {steps.map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-start gap-4"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                                            <span className="text-white font-bold">{item.step}</span>
                                        </div>
                                        <div className="pt-1">
                                            <h3 className="font-semibold text-text-main">{item.title}</h3>
                                            <p className="text-sm text-text-muted">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Warning */}
                    <div className="p-6 bg-accent/5 border border-accent/20 rounded-xl mb-8">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-accent">Penting!</h4>
                                <p className="text-text-muted text-sm mt-1">
                                    Pendaftaran harus dilakukan paling lambat 2 minggu sebelum tanggal expo.
                                    Hubungi tim APM jika ada kendala.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Back Button */}
                    <div className="text-center">
                        <Link href="/expo">
                            <Button variant="outline">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Kembali ke Expo
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
