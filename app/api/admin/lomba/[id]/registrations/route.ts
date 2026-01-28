/**
 * API Route: Lomba Registrations Admin
 * GET /api/admin/lomba/[id]/registrations
 * 
 * Get all registrations for a specific lomba
 */

import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const params = await context.params;
  const lombaId = params.id;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;
    const status = searchParams.get('status');

    // Fetch registrations
    const regParams = new URLSearchParams();
    regParams.set('fields', 'id,nama_lengkap,nim,email,phone,fakultas,jurusan,status,motivasi,date_created');
    regParams.set('sort', '-date_created');
    regParams.set('limit', limit.toString());
    regParams.set('offset', offset.toString());

    // Build filter
    const filter: Record<string, unknown> = { 
      lomba_id: { _eq: parseInt(lombaId) },
      is_deleted: { _eq: false }
    };
    if (status) {
      filter.status = { _eq: status };
    }
    regParams.set('filter', JSON.stringify(filter));

    const response = await fetch(`${DIRECTUS_URL}/items/apm_lomba_registrations?${regParams.toString()}`);

    if (!response.ok) {
      console.error('Failed to fetch registrations:', await response.text());
      return NextResponse.json(
        { error: 'Gagal mengambil data registrasi' },
        { status: 500 }
      );
    }

    const data = await response.json();

    // Get lomba details
    const lombaRes = await fetch(`${DIRECTUS_URL}/items/apm_lomba/${lombaId}?fields=id,nama_lomba,slug,deadline`);
    const lombaData = await lombaRes.json();

    // Get total count
    const countParams = new URLSearchParams();
    countParams.set('filter', JSON.stringify(filter));
    countParams.set('aggregate[count]', 'id');
    const countRes = await fetch(`${DIRECTUS_URL}/items/apm_lomba_registrations?${countParams.toString()}`);
    const countData = await countRes.json();
    const total = countData.data?.[0]?.count?.id || 0;

    return NextResponse.json({
      success: true,
      lomba: lombaData.data,
      data: data.data || [],
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/lomba/[id]/registrations
 * Update registration status (batch)
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const body = await request.json();
    const { registrationIds, status } = body;

    if (!registrationIds || !Array.isArray(registrationIds) || registrationIds.length === 0) {
      return NextResponse.json(
        { error: 'ID registrasi tidak valid' },
        { status: 400 }
      );
    }

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Status tidak valid' },
        { status: 400 }
      );
    }

    // Update each registration
    const updatePromises = registrationIds.map((id: number) =>
      fetch(`${DIRECTUS_URL}/items/apm_lomba_registrations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: `${registrationIds.length} registrasi berhasil diupdate`,
    });

  } catch (error) {
    console.error('Error updating registrations:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
