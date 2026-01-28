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
    const includeDeleted = searchParams.get('includeDeleted') === 'true';

    const filter: Record<string, unknown> = {};
    if (!includeDeleted) {
      filter.is_deleted = { _eq: false };
    }
    if (status) filter.status = { _eq: status };
    if (search) {
      filter._or = [
        { nama_event: { _icontains: search } },
        { tema: { _icontains: search } },
      ];
    }

    const params = new URLSearchParams();
    params.set('limit', limit.toString());
    params.set('offset', ((page - 1) * limit).toString());
    params.set('sort', '-date_created');
    params.set('meta', 'total_count,filter_count');
    params.set('fields', 'id,nama_event,slug,tema,tanggal_mulai,tanggal_selesai,lokasi,status,is_featured,date_created,poster,is_deleted,registration_open,registration_deadline,max_participants');
    
    if (Object.keys(filter).length > 0) {
      params.set('filter', JSON.stringify(filter));
    }

    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${DIRECTUS_URL}/items/apm_expo?${params.toString()}`, {
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Directus error: ${response.status}`);
    }

    const result = await response.json();
    
    const data = result.data.map((item: Record<string, unknown>) => ({
      id: item.id,
      namaEvent: item.nama_event,
      slug: item.slug,
      tema: item.tema,
      tanggalMulai: item.tanggal_mulai,
      tanggalSelesai: item.tanggal_selesai,
      lokasi: item.lokasi,
      status: item.status,
      isFeatured: item.is_featured,
      isDeleted: item.is_deleted,
      dateCreated: item.date_created,
      posterUrl: item.poster ? `${DIRECTUS_URL}/assets/${item.poster}?width=100` : null,
      registrationOpen: item.registration_open,
      registrationDeadline: item.registration_deadline,
      maxParticipants: item.max_participants,
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
    console.error('Error fetching expo:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expo' },
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
    
    if (!body.slug) {
      body.slug = body.nama_event
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }

    const response = await fetch(`${DIRECTUS_URL}/items/apm_expo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.[0]?.message || 'Failed to create expo');
    }

    const result = await response.json();
    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error('Error creating expo:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create expo' },
      { status: 500 }
    );
  }
}

