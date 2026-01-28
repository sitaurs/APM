/**
 * API Route: Daftar Lomba
 * POST /api/lomba/[id]/daftar
 * 
 * Registers a user for a lomba competition and auto-adds deadline to calendar
 */

import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const lombaId = parseInt(params.id);
    
    if (isNaN(lombaId)) {
      return NextResponse.json(
        { error: 'ID lomba tidak valid' },
        { status: 400 }
      );
    }

    // Check if lomba exists and registration is open
    const lombaResponse = await fetch(
      `${DIRECTUS_URL}/items/apm_lomba/${lombaId}?fields=id,nama_lomba,slug,status,deadline,tanggal_pelaksanaan,link_pendaftaran,penyelenggara,lokasi`
    );

    if (!lombaResponse.ok) {
      return NextResponse.json(
        { error: 'Lomba tidak ditemukan' },
        { status: 404 }
      );
    }

    const lombaData = await lombaResponse.json();
    const lomba = lombaData.data;

    // Check if lomba is still open
    if (lomba.status === 'closed') {
      return NextResponse.json(
        { error: 'Pendaftaran lomba ini sudah ditutup' },
        { status: 400 }
      );
    }

    // Check deadline
    if (lomba.deadline) {
      const deadline = new Date(lomba.deadline);
      if (new Date() > deadline) {
        return NextResponse.json(
          { error: 'Deadline pendaftaran sudah lewat' },
          { status: 400 }
        );
      }
    }

    // Parse request body
    const body = await request.json();
    
    // Validation
    const errors: Record<string, string> = {};
    
    if (!body.nama?.trim()) errors.nama = 'Nama lengkap wajib diisi';
    if (!body.nim?.trim()) errors.nim = 'NIM wajib diisi';
    if (!body.email?.trim()) errors.email = 'Email wajib diisi';
    if (!body.phone?.trim()) errors.phone = 'No. telepon wajib diisi';
    if (!body.fakultas?.trim()) errors.fakultas = 'Fakultas wajib dipilih';
    if (!body.prodi?.trim()) errors.prodi = 'Program studi wajib diisi';

    // Email validation
    if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      errors.email = 'Format email tidak valid';
    }

    // NIM validation
    if (body.nim && !/^\d+$/.test(body.nim)) {
      errors.nim = 'NIM harus berupa angka';
    }

    // Phone validation
    if (body.phone && !/^[0-9+\-\s()]+$/.test(body.phone)) {
      errors.phone = 'Format nomor telepon tidak valid';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Check for duplicate NIM registration
    const checkResponse = await fetch(
      `${DIRECTUS_URL}/items/apm_lomba_registrations?filter[lomba_id][_eq]=${lombaId}&filter[nim][_eq]=${body.nim}&filter[status][_neq]=rejected`
    );
    const checkData = await checkResponse.json();
    
    if (checkData.data && checkData.data.length > 0) {
      return NextResponse.json(
        { error: 'NIM ini sudah terdaftar pada lomba ini' },
        { status: 400 }
      );
    }

    // Create registration
    const registrationData = {
      lomba_id: lombaId,
      nama: body.nama,
      nim: body.nim,
      email: body.email,
      phone: body.phone,
      fakultas: body.fakultas,
      prodi: body.prodi,
      motivasi: body.motivasi || null,
      pengalaman: body.pengalaman || null,
      status: 'pending',
      is_deleted: false,
    };

    const createResponse = await fetch(`${DIRECTUS_URL}/items/apm_lomba_registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registrationData),
    });

    if (!createResponse.ok) {
      console.error('Create registration failed:', await createResponse.text());
      return NextResponse.json(
        { error: 'Gagal menyimpan pendaftaran' },
        { status: 500 }
      );
    }

    const createResult = await createResponse.json();
    const registrationId = createResult.data.id;

    // AUTO-ADD TO CALENDAR: Create calendar entry for this user's deadline
    if (lomba.deadline) {
      try {
        const calendarData = {
          title: `Deadline: ${lomba.nama_lomba}`,
          event_type: 'deadline',
          tanggal: lomba.deadline,
          lokasi: lomba.lokasi || 'Online',
          deskripsi: `Deadline pendaftaran ${lomba.nama_lomba} oleh ${lomba.penyelenggara}`,
          link: `/lomba/${lomba.slug}`,
          user_nim: body.nim,
          registration_id: registrationId,
          is_personal: true, // Personal calendar entry for this user
          is_deleted: false,
        };

        await fetch(`${DIRECTUS_URL}/items/apm_calendar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(calendarData),
        });
      } catch (calendarError) {
        // Log but don't fail - calendar is secondary
        console.error('Failed to add calendar entry:', calendarError);
      }
    }

    // If lomba has external registration link, include it in response
    const responseData: Record<string, unknown> = {
      success: true,
      message: 'Pendaftaran berhasil! Anda akan dihubungi untuk informasi lebih lanjut.',
      data: { id: registrationId },
    };

    if (lomba.link_pendaftaran) {
      responseData.externalLink = lomba.link_pendaftaran;
      responseData.message = 'Pendaftaran berhasil tercatat! Silakan lanjutkan pendaftaran di website penyelenggara.';
    }

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Error registering for lomba:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/lomba/[id]/daftar
 * Get list of registrations for a specific lomba (admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const lombaId = parseInt(params.id);
    
    if (isNaN(lombaId)) {
      return NextResponse.json(
        { error: 'ID lomba tidak valid' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${DIRECTUS_URL}/items/apm_lomba_registrations?filter[lomba_id][_eq]=${lombaId}&filter[is_deleted][_eq]=false&sort=-date_created`
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Gagal mengambil data pendaftaran' },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: data.data,
      total: data.data?.length || 0,
    });

  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
