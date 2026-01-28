/**
 * API Route: Get Prestasi List
 * GET /api/prestasi
 */

import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const tingkat = searchParams.get('tingkat');
    const kategori = searchParams.get('kategori');
    const tahun = searchParams.get('tahun');
    const search = searchParams.get('search');
    const slug = searchParams.get('slug'); // Add slug filter for detail page

    // Build filter - only verified (unless querying by slug)
    const filter: Record<string, unknown> = slug
      ? { slug: { _eq: slug } } // Direct slug lookup (no verified filter)
      : { status: { _eq: 'verified' } };
    
    if (tingkat && !slug) filter.tingkat = { _eq: tingkat };
    if (kategori && !slug) filter.kategori = { _eq: kategori };
    if (tahun && !slug) filter.tahun = { _eq: parseInt(tahun) };
    if (search && !slug) {
      filter._or = [
        { judul: { _icontains: search } },
        { nama_lomba: { _icontains: search } },
      ];
    }

    // Build URL params
    const params = new URLSearchParams();
    params.set('limit', slug ? '1' : limit.toString());
    params.set('offset', slug ? '0' : ((page - 1) * limit).toString());
    params.set('sort', '-tanggal');
    // Include more fields for detail view when querying by slug
    const fields = slug
      ? 'id,judul,slug,nama_lomba,peringkat,tingkat,kategori,tanggal,tahun,deskripsi,sertifikat,status,penyelenggara,lokasi'
      : 'id,judul,slug,nama_lomba,peringkat,tingkat,kategori,tanggal,tahun,sertifikat,status';
    params.set('fields', fields);
    params.set('filter', JSON.stringify(filter));

    const response = await fetch(`${DIRECTUS_URL}/items/apm_prestasi?${params.toString()}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Directus error: ${response.status}`);
    }

    const result = await response.json();
    
    // Transform data for frontend
    const data = result.data.map((item: Record<string, unknown>) => ({
      id: item.id,
      slug: item.slug,
      title: item.judul,
      namaLomba: item.nama_lomba,
      peringkat: item.peringkat,
      tingkat: String(item.tingkat || '').charAt(0).toUpperCase() + String(item.tingkat || '').slice(1),
      tahun: String(item.tahun),
      kategori: String(item.kategori || ''),
      deskripsi: item.deskripsi || '',
      penyelenggara: item.penyelenggara || '',
      lokasi: item.lokasi || '',
      tanggal: item.tanggal || '',
      isVerified: item.status === 'verified',
      sertifikatUrl: item.sertifikat ? `${DIRECTUS_URL}/assets/${item.sertifikat}?width=400` : null,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching prestasi:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prestasi' },
      { status: 500 }
    );
  }
}

