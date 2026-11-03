
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/lib/auth-context';
const inter = Inter({
  subsets: ['latin'],
});
export const metadata: Metadata = {
  title: {
    default: 'BookNook | Online Library',
    template: 'BookNook | %s',
  },
  description:
    'Discover books, share your bookshelf, borrow books and manage your reading history with BookNook Community Library.',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-stone-50 text-stone-900 antialiased`} >
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

