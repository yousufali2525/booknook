import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'My Profile',
  description: 'View your BookNook profile.',
};
export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}