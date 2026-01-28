import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb, Button, Badge } from '@/components/ui';
import { Download, ArrowLeft, FileText, FileArchive, Video, File } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Download Materi | APM Polinema',
    description: 'Download materi persiapan lomba dari APM',
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

interface DownloadItem {
    id: string;
    title: string;
    description: string;
    format: string;
    size: string;
    category: string;
    downloadUrl: string;
}

const formatIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    PDF: File,
    PPTX: FileText,
    ZIP: FileArchive,
    MP4: Video,
    default: FileText,
};

const formatColors: Record<string, string> = {
    PDF: 'bg-red-100 text-red-700',
    PPTX: 'bg-orange-100 text-orange-700',
    ZIP: 'bg-purple-100 text-purple-700',
    MP4: 'bg-pink-100 text-pink-700',
    default: 'bg-gray-100 text-gray-700',
};

async function getDownloads(): Promise<DownloadItem[]> {
    try {
        const res = await fetch(`${BASE_URL}/api/downloads`, {
            next: { revalidate: 60 },
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.data || [];
    } catch {
        return [];
    }
}

export default async function DownloadPage() {
    const downloads = await getDownloads();

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Header - APM Style */}
            <section className="bg-gradient-to-br from-primary via-primary-600 to-secondary text-white">
                <div className="container-apm py-12">
                    <Breadcrumb
                        items={[
                            { label: 'Resources', href: '/resources' },
                            { label: 'Download Materi' },
                        ]}
                        className="text-white/70 [&_a]:text-white/70 [&_a:hover]:text-white mb-6"
                    />
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                            <Download className="w-8 h-8 text-accent" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold font-heading">Download Materi</h1>
                            <p className="text-white/80 mt-1">Materi persiapan lomba siap unduh</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-10">
                <div className="container-apm">
                    <div className="space-y-4">
                        {downloads.map((item) => {
                            const IconComponent = formatIcons[item.format] || formatIcons.default;
                            const colorClass = formatColors[item.format] || formatColors.default;

                            return (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all flex items-center justify-between gap-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <IconComponent className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-text-main">{item.title}</h3>
                                            <p className="text-sm text-text-muted">{item.description}</p>
                                            <div className="flex gap-2 mt-2">
                                                <Badge className={colorClass}>{item.format}</Badge>
                                                <span className="text-xs text-text-muted">{item.size}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <a href={item.downloadUrl} target="_blank" rel="noopener noreferrer">
                                        <Button variant="primary" className="flex-shrink-0">
                                            <Download className="w-4 h-4 mr-2" />
                                            Download
                                        </Button>
                                    </a>
                                </div>
                            );
                        })}
                    </div>

                    {/* Back Button */}
                    <div className="mt-12 text-center">
                        <Link href="/resources">
                            <Button variant="outline">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Kembali ke Resources
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
