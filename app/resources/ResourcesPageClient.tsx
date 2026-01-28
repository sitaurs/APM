'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Button,
  Badge,
  SearchInput,
  Breadcrumb,
} from '@/components/ui';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import {
  FileText,
  Download,
  BookOpen,
  Video,
  FileCode,
  Presentation,
  ChevronRight,
  Star,
  Eye,
  Clock,
  FolderOpen,
  ExternalLink,
  Search
} from 'lucide-react';

interface Resource {
  id: string;
  slug: string;
  judul: string;
  deskripsi: string;
  kategori: string;
  thumbnail?: string;
  tags?: string[];
  is_featured?: boolean;
}

interface ResourcesPageClientProps {
  initialResources: Resource[];
}

const kategoriOptions = [
  { id: 'all', name: 'Semua' },
  { id: 'Template', name: 'Template' },
  { id: 'Panduan', name: 'Panduan' },
  { id: 'Tips & Trik', name: 'Tips & Trik' },
  { id: 'Video Tutorial', name: 'Video Tutorial' },
];

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

export default function ResourcesPageClient({ initialResources }: ResourcesPageClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeKategori, setActiveKategori] = useState('all');

  // Filter resources
  const filteredResources = initialResources.filter((resource) => {
    const matchesSearch =
      resource.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesKategori =
      activeKategori === 'all' ||
      resource.kategori === activeKategori;

    return matchesSearch && matchesKategori;
  });

  // Separate featured and regular resources
  const featuredResources = filteredResources.filter((r) => r.is_featured);
  const regularResources = filteredResources.filter((r) => !r.is_featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-apm py-6">
          <Breadcrumb items={[{ label: 'Resources' }]} />
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-text-main mb-2">
              Resources & Downloads
            </h1>
            <p className="text-text-muted">
              Template, panduan, dan materi pendukung untuk lomba dan kegiatan mahasiswa
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-apm py-8">
        {/* Search & Filter */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <SearchInput
                  placeholder="Cari resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Category Tabs */}
            <div className="mt-4">
              <Tabs defaultValue={activeKategori} onChange={setActiveKategori}>
                <TabsList>
                  {kategoriOptions.map((kategori) => (
                    <TabsTrigger key={kategori.id} value={kategori.id}>
                      {kategori.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Featured Resources */}
        {featuredResources.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-500" />
              <h2 className="text-xl font-bold text-text-main">
                Featured Resources
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredResources.map((resource) => {
                const Icon = getIconForCategory(resource.kategori);
                return (
                  <Link
                    key={resource.id}
                    href={`/resources/${resource.slug}`}
                    className="group bg-gradient-to-br from-accent to-accent-dark rounded-xl shadow-card hover:shadow-hover transition-all p-6 text-white"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Badge variant="secondary" className="mb-2">
                          {resource.kategori}
                        </Badge>
                        <h3 className="font-bold text-lg mb-2 group-hover:underline">
                          {resource.judul}
                        </h3>
                        <p className="text-sm text-white/80 line-clamp-2">
                          {resource.deskripsi}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-white/80">
                      <span className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        Download
                      </span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Regular Resources */}
        {regularResources.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-text-main mb-4">
              All Resources
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularResources.map((resource) => {
                const Icon = getIconForCategory(resource.kategori);
                return (
                  <Link
                    key={resource.id}
                    href={`/resources/${resource.slug}`}
                    className="group bg-white rounded-xl shadow-card hover:shadow-hover transition-all p-6"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Badge variant="accent" className="mb-2">
                          {resource.kategori}
                        </Badge>
                        <h3 className="font-bold text-text-main mb-2 group-hover:text-accent transition-colors">
                          {resource.judul}
                        </h3>
                        <p className="text-sm text-text-muted line-clamp-2">
                          {resource.deskripsi}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-text-muted">
                      <span className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        Download
                      </span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-main mb-2">
              Tidak ada resources ditemukan
            </h3>
            <p className="text-text-muted">
              Coba ubah filter atau kata kunci pencarian Anda
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
