import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'My Books',
  description: 'Manage and update your added books on BookNook.',
};
export default function MyBooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}