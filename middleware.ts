import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if it's an admin route (but not login page)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const adminToken = request.cookies.get('admin_token');
    
    // If not authenticated, redirect to login
    // Reject if token is empty, missing, or is a dev token (dev_token_*)
    if (!adminToken || !adminToken.value || adminToken.value.startsWith('dev_token_')) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Validate token with Directus /users/me endpoint (PRODUCTION SECURITY)
    try {
      const validateResponse = await fetch(`${DIRECTUS_URL}/users/me`, {
        headers: { 
          'Authorization': `Bearer ${adminToken.value}`,
          'Cache-Control': 'no-cache'
        },
        cache: 'no-store',
      });

      if (!validateResponse.ok) {
        // Token invalid, clear cookie and redirect to login
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        loginUrl.searchParams.set('error', 'session_expired');
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete('admin_token');
        response.cookies.delete('admin_refresh_token');
        return response;
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      // On network error, allow request but log (avoid blocking if Directus temporarily down)
      // In strict mode, you could redirect here too
    }
  }

  // If authenticated and trying to access login page, redirect to dashboard
  if (pathname === '/admin/login') {
    const adminToken = request.cookies.get('admin_token');
    
    if (adminToken && adminToken.value && !adminToken.value.startsWith('dev_token_')) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
