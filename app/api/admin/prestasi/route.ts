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
    const tingkat = searchParams.get('tingkat');

    const filter: Record<string, unknown> = {
      is_deleted: { _eq: false },
    };
    if (status) filter.status = { _eq: status };
    if (tingkat) filter.tingkat = { _eq: tingkat };
    if (search) {
      filter._or = [
        { nama_prestasi: { _icontains: search } },
        { nama_lomba: { _icontains: search } },
        { submitter_name: { _icontains: search } },
      ];
    }

    const params = new URLSearchParams();
    params.set('limit', limit.toString());
    params.set('offset', ((page - 1) * limit).toString());
    params.set('sort', '-date_created');
    params.set('meta', 'total_count,filter_count');
    params.set('fields', 'id,judul,nama_lomba,tingkat,peringkat,tanggal,sertifikat,status,reviewer_notes,verified_at,submitter_name,submitter_nim,submitter_email,date_created');
    
    if (Object.keys(filter).length > 0) {
      params.set('filter', JSON.stringify(filter));
    }

    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${DIRECTUS_URL}/items/apm_prestasi?${params.toString()}`, {
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Directus error: ${response.status}`);
    }

    const result = await response.json();
    
    const data = result.data.map((item: Record<string, unknown>) => ({
      id: item.id,
      namaPrestasi: item.judul,
      namaLomba: item.nama_lomba,
      tingkat: item.tingkat,
      peringkat: item.peringkat,
      tanggal: item.tanggal,
      sertifikatUrl: item.sertifikat ? `${DIRECTUS_URL}/assets/${item.sertifikat}` : null,
      status: item.status,
      reviewerNotes: item.reviewer_notes,
      verifiedAt: item.verified_at,
      submitterName: item.submitter_name,
      submitterNim: item.submitter_nim,
      submitterEmail: item.submitter_email,
      dateCreated: item.date_created,
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
    console.error('Error fetching prestasi:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prestasi' },
      { status: 500 }
    );
  }
}

