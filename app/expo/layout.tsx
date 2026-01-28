import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata('expo');

export default function ExpoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

