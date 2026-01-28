/**
 * API Route: Get Expo List
 * GET /api/expo
 */

import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured') === 'true';
    const search = searchParams.get('search');
    const slug = searchParams.get('slug');
    const customFields = searchParams.get('fields');

    // Build filter
    const filter: Record<string, unknown> = {
      is_deleted: { _eq: false },
    };
    
    if (slug) filter.slug = { _eq: slug };
    if (status) filter.status = { _eq: status };
    if (featured) filter.is_featured = { _eq: true };
    if (search) {
      filter._or = [
        { nama_event: { _icontains: search } },
        { tema: { _icontains: search } },
      ];
    }

    // Build URL params
    const params = new URLSearchParams();
    params.set('limit', limit.toString());
    params.set('offset', ((page - 1) * limit).toString());
    params.set('sort', '-tanggal_mulai');
    params.set('fields', customFields || 'id,nama_event,slug,tema,tanggal_mulai,tanggal_selesai,lokasi,poster,biaya_partisipasi,is_featured,status,deskripsi,registration_open,registration_deadline,max_participants');
    
    if (Object.keys(filter).length > 0) {
      params.set('filter', JSON.stringify(filter));
    }

    const response = await fetch(`${DIRECTUS_URL}/items/apm_expo?${params.toString()}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Directus error: ${response.status}`);
    }

    const result = await response.json();
    
    // Helper function for date formatting
    const formatTanggal = (start: string, end?: string) => {
      const startDate = new Date(start);
      const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
      
      if (end && end !== start) {
        const endDate = new Date(end);
        return `${startDate.toLocaleDateString('id-ID', { day: 'numeric' })}-${endDate.toLocaleDateString('id-ID', opts)}`;
      }
      return startDate.toLocaleDateString('id-ID', opts);
    };
    
    // Transform data for frontend
    const data = result.data.map((item: Record<string, unknown>) => ({
      id: item.id,
      slug: item.slug,
      title: item.nama_event,
      tema: item.tema,
      tanggal: formatTanggal(item.tanggal_mulai as string, item.tanggal_selesai as string | undefined),
      tanggalMulai: item.tanggal_mulai,
      tanggalSelesai: item.tanggal_selesai,
      lokasi: item.lokasi,
      deskripsi: item.deskripsi,
      isFree: item.biaya_partisipasi === 0,
      isFeatured: item.is_featured,
      status: item.status,
      posterUrl: item.poster ? `${DIRECTUS_URL}/assets/${item.poster}?width=400` : null,
      registrationOpen: item.registration_open ?? false,
      registrationDeadline: item.registration_deadline,
      maxParticipants: item.max_participants,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching expo:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expo' },
      { status: 500 }
    );
  }
}

