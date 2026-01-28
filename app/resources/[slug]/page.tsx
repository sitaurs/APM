import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Button, 
  Badge, 
  Breadcrumb,
} from '@/components/ui';
import { 
  FileText, 
  Download,
  Star,
  Eye,
  Clock,
  ArrowRight,
  Share2,
  Bookmark,
  CheckCircle,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Video,
  FileCode,
  Presentation,
} from 'lucide-react';

interface ResourceDetail {
  id: string;
  slug: string;
  judul: string;
  deskripsi: string;
  konten?: string;
  kategori: string;
  thumbnail?: string;
  tags?: string[];
  file?: string;
  file_url?: string;
  file_size?: string;
}

async function getResourceBySlug(slug: string): Promise<ResourceDetail | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/resources?slug=${slug}`, {
      next: { revalidate: 60 },
    });
    
    if (!res.ok) return null;
    
    const data = await res.json();
    return data.data?.[0] || null;
  } catch (error) {
    console.error('Error fetching resource:', error);
    return null;
  }
}

const getIconForCategory = (kategori: string) => {
  switch (kategori.toLowerCase()) {
    case 'template':
      return FileText;
    case 'panduan':
      return BookOpen;
    case 'tips & trik':
      return Presentation;
    case 'video tutorial':
      return Video;
    default:
      return FileCode;
  }
};


export default async function ResourceDetailPage({ params }: { params: { slug: string } }) {
  const resource = await getResourceBySlug(params.slug);
  
  if (!resource) {
    notFound();
  }

  const Icon = getIconForCategory(resource.kategori);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-apm py-6">
          <Breadcrumb 
            items={[
              { label: 'Resources', href: '/resources' },
              { label: resource.judul }
            ]} 
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container-apm py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Card */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-8 h-8 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant="accent">{resource.kategori}</Badge>
                  </div>
                  <h1 className="text-2xl font-bold text-text-main mb-2">
                    {resource.judul}
                  </h1>
                  <p className="text-text-muted">{resource.deskripsi}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            {resource.konten && (
              <div className="bg-white rounded-xl shadow-card p-6">
                <div className="prose prose-sm max-w-none">
                  {resource.konten.split('\n').map((paragraph: string, idx: number) => (
                    <p key={idx} className="text-text-muted mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Download Card */}
            <div className="bg-white rounded-xl shadow-card p-6 sticky top-24">
              {/* Preview */}
              {resource.thumbnail && (
                <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-6 overflow-hidden">
                  <img 
                    src={resource.thumbnail} 
                    alt={resource.judul}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* File Info */}
              {(resource.file_size) && (
                <div className="space-y-3 mb-6">
                  {resource.file_size && (
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Ukuran</span>
                      <span className="font-medium text-text-main">{resource.file_size}</span>
                    </div>
                  )}
                </div>
              )}

              {resource.file_url && (
                <>
                  <Button 
                    variant="primary" 
                    size="lg" 
                    fullWidth
                    leftIcon={<Download className="w-5 h-5" />}
                    onClick={() => window.open(resource.file_url, '_blank')}
                  >
                    Download Gratis
                  </Button>

                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" fullWidth leftIcon={<Share2 className="w-4 h-4" />}>
                      Share
                    </Button>
                  </div>
                </>
              )}

              {/* Tags */}
              {resource.tags && resource.tags.length > 0 && (
                <>
                  <hr className="my-6" />
                  <div>
                    <p className="text-sm text-text-muted mb-3">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {resource.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline" size="sm">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
