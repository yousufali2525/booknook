import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Borrows',
  description: 'Manage your borrowed books on BookNook.',
};

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}