import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';

// Development bypass credentials
const DEV_ADMIN_EMAIL = 'admin@polinema.ac.id';
const DEV_ADMIN_PASSWORD = 'Admin@APM2026!';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password wajib diisi' },
        { status: 400 }
      );
    }

    // Development bypass - remove this in production!
    if (process.env.NODE_ENV !== 'production' || !process.env.DIRECTUS_URL) {
      // Simple dev authentication
      if (email === DEV_ADMIN_EMAIL && password === DEV_ADMIN_PASSWORD) {
        const res = NextResponse.json({ success: true });

        // Set auth cookie for dev
        // Dev mode: Only set admin_token
        res.cookies.set('admin_token', 'dev_token_' + Date.now(), {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24,
          path: '/',
        });

        return res;
      } else {
        return NextResponse.json(
          { error: 'Email atau password salah' },
          { status: 401 }
        );
      }
    }

    // Production: Authenticate with Directus
    const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.errors?.[0]?.message || 'Email atau password salah' },
        { status: 401 }
      );
    }

    const data = await response.json();
    const { access_token, refresh_token, expires } = data.data;

    // Create response with cookie
    const res = NextResponse.json({ success: true });

    // Set secure HTTP-only cookies
    res.cookies.set('admin_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expires / 1000,
      path: '/',
    });

    res.cookies.set('admin_refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    // No more admin_auth boolean cookie - rely on admin_token JWT only

    return res;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat login' },
      { status: 500 }
    );
  }
}
