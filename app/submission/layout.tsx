import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata('submission');

export default function SubmissionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

