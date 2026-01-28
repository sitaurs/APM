/**
 * API Route: Submit Prestasi
 * POST /api/prestasi/submit
 */

import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const judul = formData.get('judul') as string;
    const namaLomba = formData.get('nama_lomba') as string;
    const penyelenggara = formData.get('penyelenggara') as string;
    const tingkat = formData.get('tingkat') as string;
    const peringkat = formData.get('peringkat') as string;
    const tanggal = formData.get('tanggal') as string;
    const kategori = formData.get('kategori') as string;
    const deskripsi = formData.get('deskripsi') as string;
    const submitterName = formData.get('submitter_name') as string;
    const submitterNim = formData.get('submitter_nim') as string;
    const submitterEmail = formData.get('submitter_email') as string;
    const sertifikat = formData.get('sertifikat') as File | null;
    const timData = formData.get('tim') as string;

    // Validation
    const errors: Record<string, string> = {};

    // File validation
    if (sertifikat) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

      if (sertifikat.size > maxSize) {
        errors.sertifikat = 'Ukuran file maksimal 5MB';
      }
      if (!allowedTypes.includes(sertifikat.type)) {
        errors.sertifikat = 'Hanya file PDF, JPG, atau PNG yang diperbolehkan';
      }
    }

    if (!judul?.trim()) errors.judul = 'Nama prestasi wajib diisi';
    if (!namaLomba?.trim()) errors.nama_lomba = 'Nama lomba/kompetisi wajib diisi';
    if (!tingkat) errors.tingkat = 'Tingkat wajib dipilih';
    if (!peringkat?.trim()) errors.peringkat = 'Peringkat wajib diisi';
    if (!tanggal) errors.tanggal = 'Tanggal wajib diisi';
    if (!kategori) errors.kategori = 'Kategori wajib dipilih';
    if (!submitterName?.trim()) errors.submitter_name = 'Nama pengisi wajib diisi';
    if (!submitterNim?.trim()) errors.submitter_nim = 'NIM wajib diisi';
    if (!submitterEmail?.trim()) errors.submitter_email = 'Email wajib diisi';
    if (!sertifikat) errors.sertifikat = 'Sertifikat wajib diupload';

    // Email validation
    if (submitterEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submitterEmail)) {
      errors.submitter_email = 'Format email tidak valid';
    }

    // NIM validation (numbers only)
    if (submitterNim && !/^\d+$/.test(submitterNim)) {
      errors.submitter_nim = 'NIM harus berupa angka';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Upload sertifikat to Directus
    let sertifikatId: string | null = null;
    if (sertifikat) {
      const fileFormData = new FormData();
      fileFormData.append('file', sertifikat);

      const uploadResponse = await fetch(`${DIRECTUS_URL}/files`, {
        method: 'POST',
        body: fileFormData,
      });

      if (!uploadResponse.ok) {
        console.error('File upload failed:', await uploadResponse.text());
        return NextResponse.json(
          { error: 'Gagal mengupload sertifikat' },
          { status: 500 }
        );
      }

      const uploadResult = await uploadResponse.json();
      sertifikatId = uploadResult.data.id;
    }

    // Generate slug
    const slug = judul
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() + '-' + Date.now();

    // Create prestasi record
    const prestasiData = {
      judul,
      slug,
      nama_lomba: namaLomba,
      penyelenggara: penyelenggara || null,
      peringkat,
      tingkat,
      kategori: kategori || null,
      tanggal,
      tahun: new Date(tanggal).getFullYear(),
      deskripsi: deskripsi || null,
      sertifikat: sertifikatId,
      status: 'pending',
      submitter_name: submitterName,
      submitter_nim: submitterNim,
      submitter_email: submitterEmail,
      is_deleted: false,
    };

    const createResponse = await fetch(`${DIRECTUS_URL}/items/apm_prestasi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prestasiData),
    });

    if (!createResponse.ok) {
      console.error('Create prestasi failed:', await createResponse.text());
      return NextResponse.json(
        { error: 'Gagal menyimpan data prestasi' },
        { status: 500 }
      );
    }

    const createResult = await createResponse.json();
    const prestasiId = createResult.data.id;

    // Create tim members
    if (timData) {
      try {
        const tim = JSON.parse(timData) as Array<{
          nama: string;
          nim: string;
          role: string;
          angkatan?: string;
        }>;

        for (const member of tim) {
          if (member.nama && member.nim) {
            await fetch(`${DIRECTUS_URL}/items/apm_prestasi_tim`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                prestasi_id: prestasiId,
                nama_mahasiswa: member.nama,
                nim: member.nim,
                is_ketua: member.role === 'ketua',
              }),
            });
          }
        }
      } catch (e) {
        console.error('Failed to create tim members:', e);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Prestasi berhasil disubmit! Akan diverifikasi oleh pengurus.',
      data: { id: prestasiId },
    });

  } catch (error) {
    console.error('Error submitting prestasi:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

