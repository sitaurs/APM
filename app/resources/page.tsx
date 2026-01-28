import ResourcesPageClient from './ResourcesPageClient';

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

async function getResourcesData(): Promise<Resource[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/resources?limit=100`, {
      next: { revalidate: 60 },
    });
    
    if (!res.ok) {
      console.error('Failed to fetch resources');
      return [];
    }
    
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching resources:', error);
    return [];
  }
}

export default async function ResourcesPage() {
  const resources = await getResourcesData();
  
  return <ResourcesPageClient initialResources={resources} />;
}
