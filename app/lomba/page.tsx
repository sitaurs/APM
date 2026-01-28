import { Metadata } from 'next';
import LombaPageClient from './LombaPageClient';

export const metadata: Metadata = {
  title: 'Lomba & Kompetisi | APM Polinema',
  description: 'Temukan berbagai lomba dan kompetisi untuk mengasah kemampuanmu',
};

async function getLombaData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/lomba?limit=100`, {
      next: { revalidate: 60 },
    });
    
    if (!response.ok) {
      console.error('Failed to fetch lomba:', response.status);
      return [];
    }
    
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching lomba:', error);
    return [];
  }
}

export default async function LombaPage() {
  const lombaData = await getLombaData();

  return <LombaPageClient initialData={lombaData} />;
}

