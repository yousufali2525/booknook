'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('BookNook Error:', error);
  }, [error]);
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#faf8f5] px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600">
          <AlertCircle size={40} />
        </div>
        <h1 className="mb-3 text-3xl font-bold font-serif text-stone-900"> Something Went Wrong! </h1>
        <p className="mb-8 text-stone-600 leading-relaxed"> Sorry, something unexpected happened. Please try again or return to  the homepage. </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#c85a32] px-6 py-3 font-semibold text-white transition hover:bg-[#a94726]" >
            <RefreshCw size={18} /> Try Again  </button>
          <Link  href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-stone-300 px-6 py-3 font-semibold text-stone-700 transition hover:bg-stone-100" >
            <Home size={18} /> Back to Home </Link>
        </div>
      </div>
    </div>
  );
}