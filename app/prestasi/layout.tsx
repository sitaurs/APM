import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata('prestasi');

export default function PrestasiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

