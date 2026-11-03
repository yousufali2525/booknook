import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your BookNook account.',
};
export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}