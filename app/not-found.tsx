import Link from 'next/link';
import { Button } from '@/components/ui';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full mx-4 text-center">
        <div className="bg-white rounded-2xl shadow-card p-8">
          {/* 404 Text */}
          <div className="text-9xl font-bold text-primary/10 mb-4">404</div>
          
          <h1 className="text-2xl font-bold text-text-main mb-2">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-text-muted mb-6">
            Maaf, halaman yang kamu cari tidak dapat ditemukan. Mungkin halaman telah dipindahkan atau dihapus.
          </p>
          
          <div className="space-y-3">
            <Link href="/">
              <Button variant="primary" fullWidth>
                <Home className="w-4 h-4 mr-2" />
                Kembali ke Beranda
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="outline" fullWidth>
                <Search className="w-4 h-4 mr-2" />
                Cari Sesuatu
              </Button>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-text-muted mb-3">Atau kunjungi halaman populer:</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link href="/lomba" className="text-sm text-primary hover:underline">Lomba</Link>
              <span className="text-gray-300">â€¢</span>
              <Link href="/prestasi" className="text-sm text-primary hover:underline">Prestasi</Link>
              <span className="text-gray-300">â€¢</span>
              <Link href="/expo" className="text-sm text-primary hover:underline">Expo</Link>
              <span className="text-gray-300">â€¢</span>
              <Link href="/resources" className="text-sm text-primary hover:underline">Resources</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

