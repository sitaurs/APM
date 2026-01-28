import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';

function getAuthToken(request: NextRequest): string | null {
  return request.cookies.get('admin_token')?.value || null;
}

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

    const response = await fetch(`${DIRECTUS_URL}/items/apm_lomba/${params.id}`, {
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'Lomba tidak ditemukan' }, { status: 404 });
      }
      throw new Error(`Directus error: ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error('Error fetching lomba:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lomba' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getAuthToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const response = await fetch(`${DIRECTUS_URL}/items/apm_lomba/${params.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.[0]?.message || 'Failed to update lomba');
    }

    const result = await response.json();
    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error('Error updating lomba:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update lomba' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getAuthToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const permanent = searchParams.get('permanent') === 'true';

    if (permanent) {
      // Hard delete
      const response = await fetch(`${DIRECTUS_URL}/items/apm_lomba/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete lomba');
      }
    } else {
      // Soft delete
      const response = await fetch(`${DIRECTUS_URL}/items/apm_lomba/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ is_deleted: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete lomba');
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting lomba:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete lomba' },
      { status: 500 }
    );
  }
}
