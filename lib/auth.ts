/**
 * Authentication helper utilities for API routes
 */

import { NextRequest } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';

export interface AuthValidationResult {
  valid: boolean;
  token?: string;
  error?: string;
}

/**
 * Validate admin token from request cookies
 * @param request - NextRequest object
 * @returns Validation result with token if valid
 */
export async function validateAdminAuth(request: NextRequest): Promise<AuthValidationResult> {
  const token = request.cookies.get('admin_token')?.value;

  if (!token) {
    return { valid: false, error: 'No authentication token provided' };
  }

  if (token.startsWith('dev_token_')) {
    return { valid: false, error: 'Development tokens not allowed in production' };
  }

  // Validate token with Directus
  try {
    const response = await fetch(`${DIRECTUS_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache'
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return { valid: false, error: 'Invalid or expired token' };
    }

    return { valid: true, token };
  } catch (error) {
    console.error('Auth validation error:', error);
    return { valid: false, error: 'Failed to validate token' };
  }
}

/**
 * Get auth token from request (without validation)
 * Use validateAdminAuth for secure endpoints
 */
export function getAuthToken(request: NextRequest): string | null {
  return request.cookies.get('admin_token')?.value || null;
}
