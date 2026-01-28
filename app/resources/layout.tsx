import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata('resources');

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

