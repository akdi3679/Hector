// app/rate-limited/layout.tsx
import type { Metadata } from 'next';
import { rateLimitData } from '@/data/rate-limit';

export const metadata: Metadata = {
  title: rateLimitData.metadata.title,
  description: rateLimitData.metadata.description,
  robots: { index: false, follow: false },
};

export default function RateLimitedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}