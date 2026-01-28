/**
 * API Route: Register for Expo
 * POST /api/expo/[id]/register
 */

import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const expoId = parseInt(params.id);
    
    if (isNaN(expoId)) {
      return NextResponse.json(
        { error: 'ID expo tidak valid' },
        { status: 400 }
      );
    }

    // Check if expo exists and registration is open
    const expoResponse = await fetch(
      `${DIRECTUS_URL}/items/apm_expo/${expoId}?fields=id,nama_event,registration_open,registration_deadline,max_participants`
    );

    if (!expoResponse.ok) {
      return NextResponse.json(
        { error: 'Expo tidak ditemukan' },
        { status: 404 }
      );
    }

    const expoData = await expoResponse.json();
    const expo = expoData.data;

    if (!expo.registration_open) {
      return NextResponse.json(
        { error: 'Pendaftaran untuk expo ini belum dibuka' },
        { status: 400 }
      );
    }

    if (expo.registration_deadline) {
      const deadline = new Date(expo.registration_deadline);
      if (new Date() > deadline) {
        return NextResponse.json(
          { error: 'Pendaftaran untuk expo ini sudah ditutup' },
          { status: 400 }
        );
      }
    }

    // Check current registration count (with buffer for race condition)
    if (expo.max_participants) {
      const countResponse = await fetch(
        `${DIRECTUS_URL}/items/apm_expo_registrations?filter[expo_id][_eq]=${expoId}&filter[status][_neq]=rejected&aggregate[count]=id`
      );
      const countData = await countResponse.json();
      const currentCount = countData.data?.[0]?.count?.id || 0;

      // Add 10% buffer to account for race conditions
      if (currentCount >= expo.max_participants * 0.9) {
        return NextResponse.json(
          { error: 'Kuota pendaftaran hampir penuh atau sudah penuh' },
          { status: 400 }
        );
      }
    }

    // Parse request body
    const body = await request.json();
    
    // Validation
    const errors: Record<string, string> = {};
    
    if (!body.nama_project?.trim()) errors.nama_project = 'Nama project wajib diisi';
    if (!body.ketua_nama?.trim()) errors.ketua_nama = 'Nama ketua wajib diisi';
    if (!body.ketua_nim?.trim()) errors.ketua_nim = 'NIM ketua wajib diisi';
    if (!body.ketua_email?.trim()) errors.ketua_email = 'Email ketua wajib diisi';
    if (!body.ketua_phone?.trim()) errors.ketua_phone = 'No. telepon ketua wajib diisi';

    // Email validation
    if (body.ketua_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.ketua_email)) {
      errors.ketua_email = 'Format email tidak valid';
    }

    // NIM validation
    if (body.ketua_nim && !/^\d+$/.test(body.ketua_nim)) {
      errors.ketua_nim = 'NIM harus berupa angka';
    }

    // Phone validation
    if (body.ketua_phone && !/^[0-9+\-\s()]+$/.test(body.ketua_phone)) {
      errors.ketua_phone = 'Format nomor telepon tidak valid';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Check for duplicate NIM
    const nimToCheck = [body.ketua_nim];
    if (body.anggota_1_nim) nimToCheck.push(body.anggota_1_nim);
    if (body.anggota_2_nim) nimToCheck.push(body.anggota_2_nim);
    if (body.anggota_3_nim) nimToCheck.push(body.anggota_3_nim);

    // Check for duplicate NIM (improved with aggregation)
    for (const nim of nimToCheck) {
      const checkResponse = await fetch(
        `${DIRECTUS_URL}/items/apm_expo_registrations?filter[expo_id][_eq]=${expoId}&filter[_or][0][ketua_nim][_eq]=${nim}&filter[_or][1][anggota_1_nim][_eq]=${nim}&filter[_or][2][anggota_2_nim][_eq]=${nim}&filter[_or][3][anggota_3_nim][_eq]=${nim}&filter[status][_neq]=rejected&limit=1`
      );
      const checkData = await checkResponse.json();
      
      if (checkData.data && checkData.data.length > 0) {
        return NextResponse.json(
          { error: `NIM ${nim} sudah terdaftar pada expo ini` },
          { status: 409 } // Use 409 Conflict instead of 400
        );
      }
    }

    // Add timestamp to catch near-simultaneous submissions
    const submissionTimestamp = new Date().toISOString();

    // Create registration
    const registrationData = {
      expo_id: expoId,
      nama_project: body.nama_project,
      deskripsi_project: body.deskripsi_project || null,
      link_demo: body.link_demo || null,
      ketua_nama: body.ketua_nama,
      ketua_nim: body.ketua_nim,
      ketua_email: body.ketua_email,
      ketua_phone: body.ketua_phone,
      anggota_1_nama: body.anggota_1_nama || null,
      anggota_1_nim: body.anggota_1_nim || null,
      anggota_2_nama: body.anggota_2_nama || null,
      anggota_2_nim: body.anggota_2_nim || null,
      anggota_3_nama: body.anggota_3_nama || null,
      anggota_3_nim: body.anggota_3_nim || null,
      status: 'pending',
      is_deleted: false,
      submission_timestamp: submissionTimestamp, // Track submission time
    };

    const createResponse = await fetch(`${DIRECTUS_URL}/items/apm_expo_registrations`, {
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

    return NextResponse.json({
      success: true,
      message: 'Pendaftaran berhasil! Tim kami akan menghubungi Anda untuk konfirmasi.',
      data: { id: createResult.data.id },
    });

  } catch (error) {
    console.error('Error registering for expo:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
