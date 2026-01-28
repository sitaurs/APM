import { Metadata } from 'next';
import ExpoPageClient from './ExpoPageClient';

export const metadata: Metadata = {
  title: 'Expo & Pameran | APM Polinema',
  description: 'Ikuti berbagai event expo dan pameran karya mahasiswa',
};

async function getExpoData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/expo?limit=100`, {
      next: { revalidate: 60 },
    });
    
    if (!response.ok) {
      console.error('Failed to fetch expo:', response.status);
      return [];
    }
    
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching expo:', error);
    return [];
  }
}

export default async function ExpoPage() {
  const expoData = await getExpoData();

  return <ExpoPageClient initialData={expoData} />;
}

