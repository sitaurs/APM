import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://apm-portal.id';
const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';

async function fetchDynamicRoutes() {
  try {
    // Fetch all lomba slugs
    const lombaRes = await fetch(`${DIRECTUS_URL}/items/apm_lomba?fields=slug,date_updated&filter[status][_neq]=closed&limit=-1`, {
      next: { revalidate: 3600 },
    });
    const lombaData = await lombaRes.json();
    const lombaPages = (lombaData.data || []).map((item: any) => ({
      url: `${baseUrl}/lomba/${item.slug}`,
      lastModified: item.date_updated ? new Date(item.date_updated) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Fetch all prestasi slugs
    const prestasiRes = await fetch(`${DIRECTUS_URL}/items/apm_prestasi?fields=slug,date_updated&filter[status][_eq]=verified&limit=-1`, {
      next: { revalidate: 3600 },
    });
    const prestasiData = await prestasiRes.json();
    const prestasiPages = (prestasiData.data || []).map((item: any) => ({
      url: `${baseUrl}/prestasi/${item.slug}`,
      lastModified: item.date_updated ? new Date(item.date_updated) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    // Fetch all expo slugs
    const expoRes = await fetch(`${DIRECTUS_URL}/items/apm_expo?fields=slug,date_updated&limit=-1`, {
      next: { revalidate: 3600 },
    });
    const expoData = await expoRes.json();
    const expoPages = (expoData.data || []).map((item: any) => ({
      url: `${baseUrl}/expo/${item.slug}`,
      lastModified: item.date_updated ? new Date(item.date_updated) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Fetch all resources slugs
    const resourcesRes = await fetch(`${DIRECTUS_URL}/items/apm_resources?fields=slug,date_updated&filter[is_published][_eq]=true&limit=-1`, {
      next: { revalidate: 3600 },
    });
    const resourcesData = await resourcesRes.json();
    const resourcePages = (resourcesData.data || []).map((item: any) => ({
      url: `${baseUrl}/resources/${item.slug}`,
      lastModified: item.date_updated ? new Date(item.date_updated) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }));

    return [...lombaPages, ...prestasiPages, ...expoPages, ...resourcePages];
  } catch (error) {
    console.error('Error fetching dynamic routes for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/lomba`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/prestasi`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/expo`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/kalender`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/submission`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ];

  // Fetch dynamic pages
  const dynamicPages = await fetchDynamicRoutes();

  return [...staticPages, ...dynamicPages];
}

