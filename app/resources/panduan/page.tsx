import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb, Button } from '@/components/ui';
import { BookOpen, ArrowLeft, CheckCircle, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Panduan Pendaftaran | APM Polinema',
    description: 'Panduan lengkap cara mendaftar lomba melalui APM',
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

interface Step {
    step: number;
    title: string;
    description: string;
}

async function getPanduan(): Promise<Step[]> {
    try {
        const res = await fetch(`${BASE_URL}/api/panduan?type=pendaftaran`, {
            next: { revalidate: 60 },
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.data || [];
    } catch {
        return [];
    }
}

export default async function PanduanPage() {
    const steps = await getPanduan();

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Header - APM Style */}
            <section className="bg-gradient-to-br from-primary via-primary-600 to-primary-700 text-white">
                <div className="container-apm py-12">
                    <Breadcrumb
                        items={[
                            { label: 'Resources', href: '/resources' },
                            { label: 'Panduan Pendaftaran' },
                        ]}
                        className="text-white/70 [&_a]:text-white/70 [&_a:hover]:text-white mb-6"
                    />
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                            <BookOpen className="w-8 h-8 text-accent" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold font-heading">Panduan Pendaftaran</h1>
                            <p className="text-white/80 mt-1">Langkah-langkah mendaftar lomba via APM</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-10">
                <div className="container-apm">
                    <div className="max-w-3xl mx-auto">
                        {/* Steps */}
                        <div className="space-y-4">
                            {steps.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all flex items-start gap-4"
                                >
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                                        <span className="text-white font-bold text-lg">{item.step}</span>
                                    </div>
                                    <div className="pt-2">
                                        <h3 className="font-semibold text-text-main text-lg mb-1">{item.title}</h3>
                                        <p className="text-text-muted">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Help Section */}
                        <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-xl">
                            <div className="flex items-start gap-3">
                                <HelpCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-primary">Butuh Bantuan?</h4>
                                    <p className="text-text-muted text-sm mt-1">
                                        Hubungi tim APM jika ada pertanyaan tentang proses pendaftaran atau kunjungi halaman{' '}
                                        <Link href="/resources/faq" className="text-primary hover:underline">
                                            FAQ
                                        </Link>
                                        .
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Back Button */}
                        <div className="mt-8 text-center">
                            <Link href="/resources">
                                <Button variant="outline">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Kembali ke Resources
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
