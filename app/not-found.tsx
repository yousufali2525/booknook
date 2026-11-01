import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2c2420] flex flex-col justify-center items-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-xl shadow-stone-200/60 text-center relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#c85a32]/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#c85a32]/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="w-20 h-20 rounded-2xl bg-[#c85a32]/10 text-[#c85a32] flex items-center justify-center mx-auto mb-6 border border-[#c85a32]/20 shadow-inner">
          <svg
            className="w-10 h-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.75"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9.5 11.5 5 5m0-5-5 5"
            />
          </svg>
        </div>

        <span className="inline-block px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-xs font-semibold uppercase tracking-widest mb-3 border border-stone-200">
          Error 404
        </span>

        <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">
          Page Not Found
        </h1>

        <p className="text-stone-500 text-sm leading-relaxed mb-8">
          The literary manuscript or archive bookshelf you are looking for has been moved, borrowed, or never existed in this sanctuary.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 py-3 px-4 rounded-xl bg-[#c85a32] hover:bg-[#a6431f] text-white font-medium text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>Back to Home</span>
          </Link>

          <Link
            href="/books"
            className="flex-1 py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-sm transition-all flex items-center justify-center gap-2 border border-stone-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span>Browse Catalog</span>
          </Link>
        </div>
      </div>
    </div>
  );
}