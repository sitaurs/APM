import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata('search');

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

