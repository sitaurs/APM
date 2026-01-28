/**
 * API Route: Get Homepage Data
 * GET /api/homepage
 * 
 * Returns featured lomba, recent prestasi, and upcoming expo for homepage
 */

import { NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';

export async function GET() {
  try {
    // Fetch featured lomba
    const lombaParams = new URLSearchParams();
    lombaParams.set('limit', '4');
    lombaParams.set('sort', '-is_urgent,-date_created');
    lombaParams.set('filter', JSON.stringify({ status: { _neq: 'closed' } }));
    lombaParams.set('fields', 'id,nama_lomba,slug,deadline,kategori,tingkat,status,biaya,is_urgent,is_featured');

    const lombaRes = await fetch(`${DIRECTUS_URL}/items/apm_lomba?${lombaParams.toString()}`, {
      next: { revalidate: 60 },
    });
    const lombaData = await lombaRes.json();

    // Fetch recent prestasi
    const prestasiParams = new URLSearchParams();
    prestasiParams.set('limit', '3');
    prestasiParams.set('sort', '-tanggal');
    prestasiParams.set('filter', JSON.stringify({ status_verifikasi: { _eq: 'verified' } }));
    prestasiParams.set('fields', 'id,judul,slug,nama_lomba,peringkat,tingkat,tahun,kategori');

    const prestasiRes = await fetch(`${DIRECTUS_URL}/items/apm_prestasi?${prestasiParams.toString()}`, {
      next: { revalidate: 60 },
    });
    const prestasiData = await prestasiRes.json();

    // Fetch upcoming expo
    const expoParams = new URLSearchParams();
    expoParams.set('limit', '3');
    expoParams.set('sort', 'tanggal_mulai');
    expoParams.set('filter', JSON.stringify({ status: { _eq: 'upcoming' } }));
    expoParams.set('fields', 'id,nama_event,slug,tanggal_mulai,tanggal_selesai,lokasi');

    const expoRes = await fetch(`${DIRECTUS_URL}/items/apm_expo?${expoParams.toString()}`, {
      next: { revalidate: 60 },
    });
    const expoData = await expoRes.json();

    // Transform data
    const formatTanggal = (start: string, end?: string) => {
      const startDate = new Date(start);
      const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
      
      if (end && end !== start) {
        const endDate = new Date(end);
        return `${startDate.toLocaleDateString('id-ID', { day: 'numeric' })}-${endDate.toLocaleDateString('id-ID', opts)}`;
      }
      return startDate.toLocaleDateString('id-ID', opts);
    };

    const lomba = (lombaData.data || []).map((item: Record<string, unknown>) => ({
      id: String(item.id),
      slug: item.slug,
      title: item.nama_lomba,
      deadline: item.deadline,
      deadlineDisplay: item.deadline 
        ? new Date(item.deadline as string).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) 
        : null,
      kategori: String(item.kategori || '').charAt(0).toUpperCase() + String(item.kategori || '').slice(1),
      tingkat: String(item.tingkat || '').charAt(0).toUpperCase() + String(item.tingkat || '').slice(1),
      status: item.status || 'open',
      isUrgent: item.is_urgent,
      isFree: item.biaya === 0,
    }));

    const prestasi = (prestasiData.data || []).map((item: Record<string, unknown>) => ({
      id: String(item.id),
      slug: item.slug,
      title: item.nama_lomba,
      peringkat: item.peringkat,
      tingkat: String(item.tingkat || '').charAt(0).toUpperCase() + String(item.tingkat || '').slice(1),
      tahun: String(item.tahun),
      kategori: String(item.kategori || ''),
      isVerified: true,
    }));

    const expo = (expoData.data || []).map((item: Record<string, unknown>) => ({
      id: String(item.id),
      slug: item.slug,
      title: item.nama_event,
      tanggal: formatTanggal(item.tanggal_mulai as string, item.tanggal_selesai as string | undefined),
      lokasi: item.lokasi,
    }));

    return NextResponse.json({
      lomba,
      prestasi,
      expo,
    });
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homepage data', lomba: [], prestasi: [], expo: [] },
      { status: 500 }
    );
  }
}

