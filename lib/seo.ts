import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://apm-portal.id';

// SEO Configuration untuk masing-masing halaman
export const seoConfig = {
  siteName: 'APM Portal',
  siteUrl: baseUrl,
  locale: 'id_ID',

  pages: {
    home: {
      title: 'APM Portal - Ajang Prestasi Mahasiswa Polinema',
      description: 'Portal informasi lomba, kompetisi, prestasi, dan expo untuk mahasiswa Politeknik Negeri Malang. Temukan peluang emas, berkompetisi di tingkat nasional, dan raih prestasi kampus!',
      keywords: ['lomba mahasiswa', 'kompetisi nasional', 'prestasi kampus', 'expo teknologi', 'hackathon', 'polinema'],
    },
    lomba: {
      title: 'Daftar Lomba & Kompetisi',
      description: 'Temukan berbagai lomba dan kompetisi untuk mahasiswa - hackathon, business plan, desain, akademik, dan banyak lagi. Filter berdasarkan kategori, tingkat, dan deadline.',
      keywords: ['lomba mahasiswa', 'kompetisi', 'hackathon', 'business plan', 'lomba desain', 'lomba akademik'],
    },
    prestasi: {
      title: 'Galeri Prestasi Mahasiswa',
      description: 'Lihat daftar prestasi mahasiswa yang telah berhasil meraih juara di berbagai lomba dan kompetisi tingkat nasional maupun internasional.',
      keywords: ['prestasi mahasiswa', 'juara lomba', 'pencapaian', 'achievement', 'winner'],
    },
    expo: {
      title: 'Event & Expo Teknologi',
      description: 'Informasi event, expo, dan pameran teknologi untuk mahasiswa. Dapatkan kesempatan networking, showcase project, dan pengalaman berharga.',
      keywords: ['expo teknologi', 'pameran', 'event kampus', 'tech event', 'career fair'],
    },
    resources: {
      title: 'Resources & Panduan',
      description: 'Akses berbagai tips, template proposal, dan panduan untuk membantu persiapan lomba dan kompetisi kamu.',
      keywords: ['tips lomba', 'template proposal', 'panduan', 'resources', 'belajar'],
    },
    about: {
      title: 'Tentang APM Portal',
      description: 'Kenali lebih dekat APM Portal - visi misi, tim, dan komitmen kami untuk mendukung prestasi mahasiswa.',
      keywords: ['tentang apm', 'visi misi', 'tim', 'about us'],
    },
    kalender: {
      title: 'Kalender Event',
      description: 'Lihat semua jadwal lomba, expo, dan event penting dalam satu kalender interaktif. Jangan lewatkan deadline penting!',
      keywords: ['kalender lomba', 'jadwal event', 'deadline', 'schedule'],
    },
    search: {
      title: 'Pencarian',
      description: 'Cari lomba, prestasi, expo, dan resources di APM Portal.',
      keywords: ['cari lomba', 'search', 'pencarian'],
    },
    submission: {
      title: 'Submit Prestasi',
      description: 'Laporkan prestasi dan pencapaian kamu untuk ditampilkan di APM Portal.',
      keywords: ['submit prestasi', 'lapor prestasi', 'form submission'],
    },
  },
} as const;

// Helper function untuk generate metadata
export function generatePageMetadata(
  page: keyof typeof seoConfig.pages,
  overrides?: Partial<Metadata>
): Metadata {
  const config = seoConfig.pages[page];

  return {
    title: config.title,
    description: config.description,
    keywords: [...config.keywords],
    openGraph: {
      title: config.title,
      description: config.description,
      url: `${seoConfig.siteUrl}/${page === 'home' ? '' : page}`,
      siteName: seoConfig.siteName,
      locale: seoConfig.locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
    },
    alternates: {
      canonical: `${seoConfig.siteUrl}/${page === 'home' ? '' : page}`,
    },
    ...overrides,
  };
}

// Helper untuk generate metadata halaman detail (lomba, prestasi, expo, resources)
export function generateDetailMetadata(
  type: 'lomba' | 'prestasi' | 'expo' | 'resources',
  data: {
    title: string;
    description?: string;
    image?: string;
    slug: string;
  }
): Metadata {
  const typeLabels = {
    lomba: 'Lomba',
    prestasi: 'Prestasi',
    expo: 'Expo',
    resources: 'Resource',
  };

  return {
    title: data.title,
    description: data.description || `${typeLabels[type]}: ${data.title} - APM Portal`,
    openGraph: {
      title: data.title,
      description: data.description || `${typeLabels[type]}: ${data.title}`,
      url: `${seoConfig.siteUrl}/${type}/${data.slug}`,
      siteName: seoConfig.siteName,
      locale: seoConfig.locale,
      type: 'article',
      images: data.image ? [{ url: data.image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.description,
      images: data.image ? [data.image] : undefined,
    },
    alternates: {
      canonical: `${seoConfig.siteUrl}/${type}/${data.slug}`,
    },
  };
}

// JSON-LD Schema Generators
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'APM Portal',
    url: seoConfig.siteUrl,
    logo: `${seoConfig.siteUrl}/logo.png`,
    description: seoConfig.pages.home.description,
    sameAs: [
      'https://instagram.com/apmportal',
      'https://twitter.com/apmportal',
    ],
  };
}

export function generateEventSchema(event: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  url: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate || event.startDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: event.location?.toLowerCase().includes('online')
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
    location: event.location?.toLowerCase().includes('online')
      ? {
        '@type': 'VirtualLocation',
        url: event.url,
      }
      : {
        '@type': 'Place',
        name: event.location,
      },
    organizer: {
      '@type': 'Organization',
      name: 'APM Portal',
      url: seoConfig.siteUrl,
    },
    image: event.image,
    url: event.url,
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${seoConfig.siteUrl}${item.url}`,
    })),
  };
}
