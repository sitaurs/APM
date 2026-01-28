import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb, Button, Badge } from '@/components/ui';
import { FileText, ArrowLeft, Download, File, FileArchive, Presentation } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Template Proposal | APM Polinema',
    description: 'Download template proposal untuk berbagai jenis lomba',
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

interface Template {
    id: string;
    title: string;
    description: string;
    format: string;
    category: string;
    downloadUrl: string;
}

const formatIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    DOCX: FileText,
    DOC: FileText,
    PDF: File,
    PPTX: Presentation,
    PPT: Presentation,
    ZIP: FileArchive,
    default: FileText,
};

const formatColors: Record<string, string> = {
    DOCX: 'bg-blue-100 text-blue-700',
    PDF: 'bg-red-100 text-red-700',
    PPTX: 'bg-orange-100 text-orange-700',
    ZIP: 'bg-purple-100 text-purple-700',
    default: 'bg-gray-100 text-gray-700',
};

async function getTemplates(): Promise<Template[]> {
    try {
        const res = await fetch(`${BASE_URL}/api/templates`, {
            next: { revalidate: 60 },
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.data || [];
    } catch {
        return [];
    }
}

export default async function TemplatePage() {
    const templates = await getTemplates();

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Header - APM Style */}
            <section className="bg-gradient-to-br from-secondary via-secondary to-primary text-white">
                <div className="container-apm py-12">
                    <Breadcrumb
                        items={[
                            { label: 'Resources', href: '/resources' },
                            { label: 'Template Proposal' },
                        ]}
                        className="text-white/70 [&_a]:text-white/70 [&_a:hover]:text-white mb-6"
                    />
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold font-heading">Template Proposal</h1>
                            <p className="text-white/80 mt-1">Template siap pakai untuk berbagai jenis lomba</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-10">
                <div className="container-apm">
                    <div className="grid gap-4 md:grid-cols-2">
                        {templates.map((template) => {
                            const IconComponent = formatIcons[template.format] || formatIcons.default;
                            const colorClass = formatColors[template.format] || formatColors.default;

                            return (
                                <div
                                    key={template.id}
                                    className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-lg hover:border-secondary/20 transition-all flex items-start justify-between gap-4"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                                            <IconComponent className="w-6 h-6 text-secondary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-text-main mb-1">{template.title}</h3>
                                            <p className="text-sm text-text-muted mb-3">{template.description}</p>
                                            <Badge className={colorClass}>{template.format}</Badge>
                                        </div>
                                    </div>
                                    <a href={template.downloadUrl} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="sm" className="flex-shrink-0">
                                            <Download className="w-4 h-4" />
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
