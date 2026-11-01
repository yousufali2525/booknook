import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Book',
  description: 'Add a new book to BookNook.',
};

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}