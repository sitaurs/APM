'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full mx-4 text-center">
        <div className="bg-white rounded-2xl shadow-card p-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-error/10 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-error" />
          </div>
          <h1 className="text-2xl font-bold text-text-main mb-2">
            Oops! Terjadi Kesalahan
          </h1>
          <p className="text-text-muted mb-6">
            Maaf, terjadi kesalahan saat memuat halaman. Silakan coba lagi atau kembali ke beranda.
          </p>
          <div className="space-y-3">
            <Button
              variant="primary"
              fullWidth
              onClick={reset}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Coba Lagi
            </Button>
            <Link href="/">
              <Button variant="outline" fullWidth>
                <Home className="w-4 h-4 mr-2" />
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
          {error.digest && (
            <p className="mt-4 text-xs text-text-muted">
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

