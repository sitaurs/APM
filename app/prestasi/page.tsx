import { Metadata } from 'next';
import PrestasiPageClient from './PrestasiPageClient';
import type { PrestasiItem } from '@/hooks/useData';

export const metadata: Metadata = {
  title: 'Prestasi & Pencapaian | APM Portal',
  description: 'Daftar prestasi membanggakan dari mahasiswa Politeknik Negeri Malang yang telah berhasil meraih juara di berbagai lomba dan kompetisi.',
};

async function getPrestasiData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/prestasi?limit=100`, {
      cache: 'no-store', // Always get fresh data
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!res.ok) {
      console.error('Failed to fetch prestasi:', res.status);
      return [];
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching prestasi:', error);
    return [];
  }
}

export default async function PrestasiPage() {
  const prestasiData = await getPrestasiData();

  return <PrestasiPageClient initialData={prestasiData} />;
}

