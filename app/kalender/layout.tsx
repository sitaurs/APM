import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata('kalender');

export default function KalenderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

