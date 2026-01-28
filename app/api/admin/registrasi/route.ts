import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Pool } from 'pg';

interface RegistrationRow {
  id: number;
  team_name: string;
  email: string;
  phone: string;
  institution: string;
  status: string;
  reviewer_notes: string;
  date_created: string;
  verified_at: string;
  expo_id: number;
  expo_nama: string;
  member_count: string;
}

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'apm_portal',
  user: process.env.DB_USER || 'apm_user',
  password: process.env.DB_PASSWORD || 'apm_password_2026',
});

// GET - List all registrations with filters
export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_token');

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const expoId = searchParams.get('expo_id') || '';
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE er.is_deleted = false';
    const params: (string | number)[] = [];
    let paramIndex = 1;

    if (search) {
      whereClause += ` AND (
        er.team_name ILIKE $${paramIndex} OR 
        er.email ILIKE $${paramIndex} OR 
        er.phone ILIKE $${paramIndex}
      )`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (status) {
      whereClause += ` AND er.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (expoId) {
      whereClause += ` AND er.expo_id = $${paramIndex}`;
      params.push(parseInt(expoId));
      paramIndex++;
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) 
      FROM expo_registrations er
      ${whereClause}
    `;
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    // Get data with expo info
    const dataQuery = `
      SELECT 
        er.id,
        er.team_name,
        er.email,
        er.phone,
        er.institution,
        er.status,
        er.reviewer_notes,
        er.date_created,
        er.verified_at,
        e.id as expo_id,
        e.nama_event as expo_nama,
        (SELECT COUNT(*) FROM expo_registration_members erm WHERE erm.registration_id = er.id) as member_count
      FROM expo_registrations er
      LEFT JOIN expo e ON e.id = er.expo_id
      ${whereClause}
      ORDER BY 
        CASE er.status WHEN 'pending' THEN 0 ELSE 1 END,
        er.date_created DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);

    const dataResult = await pool.query(dataQuery, params);

    const data = dataResult.rows.map((row: RegistrationRow) => ({
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
      memberCount: parseInt(row.member_count),
    }));

    return NextResponse.json({
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

