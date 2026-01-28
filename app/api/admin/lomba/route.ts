import { NextRequest, NextResponse } from 'next/server';
import { validateAdminAuth, getAuthToken } from '@/lib/auth';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';

export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const kategori = searchParams.get('kategori');
    const includeDeleted = searchParams.get('includeDeleted') === 'true';

    // Build filter
    const filter: Record<string, unknown> = {};
    if (!includeDeleted) {
      filter.is_deleted = { _eq: false };
    }
    if (status) filter.status = { _eq: status };
    if (kategori) filter.kategori = { _eq: kategori };
    if (search) {
      filter._or = [
        { nama_lomba: { _icontains: search } },
        { penyelenggara: { _icontains: search } },
      ];
    }

    // Build params
    const params = new URLSearchParams();
    params.set('limit', limit.toString());
    params.set('offset', ((page - 1) * limit).toString());
    params.set('sort', '-date_created');
    params.set('meta', 'total_count,filter_count');
    params.set('fields', 'id,nama_lomba,slug,kategori,tingkat,penyelenggara,deadline_pendaftaran,tanggal_pelaksanaan,status,is_featured,date_created,poster,is_deleted');

    if (Object.keys(filter).length > 0) {
      params.set('filter', JSON.stringify(filter));
    }

    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${DIRECTUS_URL}/items/apm_lomba?${params.toString()}`, {
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Failed to fetch lomba';
      let errorDetails = null;

      try {
        const errorData = JSON.parse(errorText);
        if (errorData.errors?.[0]?.message?.includes('not exist')) {
          errorMessage = 'Collection apm_lomba belum tersedia. Jalankan: npx ts-node scripts/setup-directus.ts';
          errorDetails = 'directus_collection_missing';
        } else if (errorData.errors?.[0]?.message?.includes('permission')) {
          errorMessage = 'Tidak memiliki izin untuk mengakses data lomba. Cek permission di Directus Admin.';
          errorDetails = 'directus_permission_denied';
        }
      } catch {
        // Keep original error message
      }

      return NextResponse.json(
        { error: errorMessage, details: errorDetails },
        { status: response.status }
      );
    }

    const result = await response.json();

    // Transform data
    const data = result.data.map((item: Record<string, unknown>) => ({
      id: item.id,
      namaLomba: item.nama_lomba,
      slug: item.slug,
      kategori: item.kategori,
      tingkat: item.tingkat,
      penyelenggara: item.penyelenggara,
      deadline: item.deadline_pendaftaran,
      tanggalPelaksanaan: item.tanggal_pelaksanaan,
      status: item.status,
      isFeatured: item.is_featured,
      isDeleted: item.is_deleted,
      dateCreated: item.date_created,
      posterUrl: item.poster ? `${DIRECTUS_URL}/assets/${item.poster}?width=100` : null,
    }));

    return NextResponse.json({
      data,
      meta: {
        total: result.meta?.filter_count || result.meta?.total_count || 0,
        page,
        limit,
        totalPages: Math.ceil((result.meta?.filter_count || result.meta?.total_count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching lomba:', error);
    return NextResponse.json(
      {
        error: 'Gagal mengambil data lomba. Pastikan Directus berjalan di http://localhost:8055',
        details: 'connection_error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await validateAdminAuth(request);
    if (!authResult.valid) {
      return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 });
    }
    const token = authResult.token;

    const body = await request.json();

    // Generate slug if not provided
    if (!body.slug) {
      body.slug = body.nama_lomba
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }

    const response = await fetch(`${DIRECTUS_URL}/items/apm_lomba`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.[0]?.message || 'Failed to create lomba');
    }

    const result = await response.json();
    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error('Error creating lomba:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create lomba' },
      { status: 500 }
    );
  }
}

