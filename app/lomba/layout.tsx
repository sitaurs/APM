import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata('lomba');

export default function LombaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

