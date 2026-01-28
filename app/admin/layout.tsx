'use client';

import { Header } from '@/components/admin/Header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-16 min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
