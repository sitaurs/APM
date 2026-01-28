import { NextRequest, NextResponse } from 'next/server';
import { validateAdminAuth, getAuthToken } from '@/lib/auth';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getAuthToken(request);
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Get prestasi with team members
    const response = await fetch(`${DIRECTUS_URL}/items/apm_prestasi/${params.id}?fields=*,tim_anggota.*`, {
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'Prestasi tidak ditemukan' }, { status: 404 });
      }
      throw new Error(`Directus error: ${response.status}`);
    }

    const result = await response.json();
    const item = result.data;

    // Transform response
    const data = {
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
      timAnggota: item.tim_anggota || [],
    };

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching prestasi:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prestasi' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await validateAdminAuth(request);
    if (!authResult.valid) {
      return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 });
    }
    const token = authResult.token;

    const body = await request.json();

    // If status is changing to verified, add verified_at timestamp
    if (body.status === 'verified') {
      body.verified_at = new Date().toISOString();
    }

    const response = await fetch(`${DIRECTUS_URL}/items/apm_prestasi/${params.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.[0]?.message || 'Failed to update prestasi');
    }

    const result = await response.json();
    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error('Error updating prestasi:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update prestasi' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await validateAdminAuth(request);
    if (!authResult.valid) {
      return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 });
    }
    const token = authResult.token;

    // Soft delete
    const response = await fetch(`${DIRECTUS_URL}/items/apm_prestasi/${params.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ is_deleted: true }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete prestasi');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting prestasi:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete prestasi' },
      { status: 500 }
    );
  }
}
