import type { Metadata } from 'next';
export const metadata: Metadata = {
title: 'All Books',
description: 'Explore all available books on BookNook.',
};
export default function BooksLayout({
children,
}: {
children: React.ReactNode;
}) {
return <>{children}</>;
}
