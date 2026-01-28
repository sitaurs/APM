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

    const response = await fetch(`${DIRECTUS_URL}/items/apm_expo/${params.id}`, {
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'Expo tidak ditemukan' }, { status: 404 });
      }
      throw new Error(`Directus error: ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error('Error fetching expo:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expo' },
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

    const response = await fetch(`${DIRECTUS_URL}/items/apm_expo/${params.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.[0]?.message || 'Failed to update expo');
    }

    const result = await response.json();
    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error('Error updating expo:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update expo' },
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

    const { searchParams } = new URL(request.url);
    const permanent = searchParams.get('permanent') === 'true';

    if (permanent) {
      const response = await fetch(`${DIRECTUS_URL}/items/apm_expo/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete expo');
      }
    } else {
      const response = await fetch(`${DIRECTUS_URL}/items/apm_expo/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ is_deleted: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete expo');
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting expo:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete expo' },
      { status: 500 }
    );
  }
}
