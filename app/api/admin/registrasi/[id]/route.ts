import { NextRequest, NextResponse } from 'next/server';
import { validateAdminAuth } from '@/lib/auth';
import { cookies } from 'next/headers';
import { Pool } from 'pg';

interface MemberRow {
  id: number;
  name: string;
  nim: string;
  email: string;
  phone: string;
  role: string;
}

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'apm_portal',
  user: process.env.DB_USER || 'apm_user',
  password: process.env.DB_PASSWORD || 'apm_password_2026',
});

// GET - Get single registration with members
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_token');

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = parseInt(params.id);

    // Get registration
    const regQuery = `
      SELECT 
        er.*,
        e.nama_event as expo_nama,
        e.tanggal_mulai as expo_tanggal
      FROM expo_registrations er
      LEFT JOIN expo e ON e.id = er.expo_id
      WHERE er.id = $1
    `;
    const regResult = await pool.query(regQuery, [id]);

    if (regResult.rows.length === 0) {
      return NextResponse.json({ error: 'Registrasi tidak ditemukan' }, { status: 404 });
    }

    const row = regResult.rows[0];

    // Get members
    const membersQuery = `
      SELECT id, name, nim, email, phone, role
      FROM expo_registration_members
      WHERE registration_id = $1
      ORDER BY id
    `;
    const membersResult = await pool.query(membersQuery, [id]);

    const data = {
      id: row.id,
      teamName: row.team_name,
      email: row.email,
      phone: row.phone,
      institution: row.institution,
      status: row.status,
      reviewerNotes: row.reviewer_notes,
      dateCreated: row.date_created,
      verifiedAt: row.verified_at,
      expoId: row.expo_id,
      expoNama: row.expo_nama,
      expoTanggal: row.expo_tanggal,
      members: membersResult.rows.map((m: MemberRow) => ({
        id: m.id,
        name: m.name,
        nim: m.nim,
        email: m.email,
        phone: m.phone,
        role: m.role,
      })),
    };

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching registration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update registration (verify/reject)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await validateAdminAuth(request);
  if (!authResult.valid) {
    return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = parseInt(params.id);
    const body = await request.json();
    
    // Check if registration exists
    const checkQuery = 'SELECT id, status FROM expo_registrations WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: 'Registrasi tidak ditemukan' }, { status: 404 });
    }

    // Build update query
    const updates: string[] = [];
    const values: (string | number | boolean | null)[] = [];
    let paramIndex = 1;

    if (body.status !== undefined) {
      updates.push(`status = $${paramIndex}`);
      values.push(body.status);
      paramIndex++;

      // Set verified_at if status is verified or rejected
      if (body.status === 'verified' || body.status === 'rejected') {
        updates.push(`verified_at = NOW()`);
      }
    }

    if (body.reviewer_notes !== undefined) {
      updates.push(`reviewer_notes = $${paramIndex}`);
      values.push(body.reviewer_notes);
      paramIndex++;
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No data to update' }, { status: 400 });
    }

    updates.push('date_updated = NOW()');
    values.push(id);

    const updateQuery = `
      UPDATE expo_registrations
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(updateQuery, values);
    const updated = result.rows[0];

    return NextResponse.json({
      data: {
        id: updated.id,
        teamName: updated.team_name,
        status: updated.status,
        reviewerNotes: updated.reviewer_notes,
        verifiedAt: updated.verified_at,
      },
    });
  } catch (error) {
    console.error('Error updating registration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete registration
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_token');

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = parseInt(params.id);

    const query = `
      UPDATE expo_registrations
      SET is_deleted = true, date_updated = NOW()
      WHERE id = $1
      RETURNING id
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Registrasi tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting registration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
