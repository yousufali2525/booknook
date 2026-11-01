'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  userName?: string;
  userEmail?: string;
  rating?: number;
  createdAt?: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const DEFAULT_COVER =
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';

function getLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params?.id as string;

  const { user: currentUser, loading: authLoading } = useAuth();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [returnDate, setReturnDate] = useState('');
  const [borrowLoading, setBorrowLoading] = useState(false);
  const [borrowError, setBorrowError] = useState('');
  const [borrowSuccess, setBorrowSuccess] = useState('');

  useEffect(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    setReturnDate(getLocalDate(date));
  }, []);

  const fetchBookDetails = useCallback(async () => {
    if (!bookId) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/books/${bookId}`, {
        cache: 'no-store',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || 'Failed to load book details.'
        );
      }

      const bookData =
        data.book || data.data?.book || data.data || data;

      if (!bookData || !bookData._id) {
        throw new Error('Book information could not be found.');
      }

      setBook(bookData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error loading book information.'
      );
      setBook(null);
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    if (authLoading) return;

    if (!currentUser) {
      router.replace('/login');
      return;
    }

    fetchBookDetails();
  }, [authLoading, currentUser, router, fetchBookDetails]);

  const handleOpenBorrowModal = () => {
    if (authLoading) return;

    if (!currentUser) {
      router.replace('/login');
      return;
    }

    setBorrowError('');
    setBorrowSuccess('');
    setIsModalOpen(true);
  };

  const handleBorrowSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (borrowLoading || !book) return;

    if (!currentUser?.email) {
      setBorrowError('Please log in again to borrow this book.');
      return;
    }

    if (!returnDate) {
      setBorrowError('Please select a return date.');
      return;
    }

    const selectedDate = new Date(`${returnDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      setBorrowError('Return date must be after today.');
      return;
    }

    if (book.availableCopies <= 0) {
      setBorrowError('This book is currently out of stock.');
      return;
    }

    setBorrowLoading(true);
    setBorrowError('');
    setBorrowSuccess('');

    try {
      const tokenResponse = await fetch('/api/backend-token', {
        method: 'GET',
        cache: 'no-store',
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.token) {
        throw new Error(
          tokenData.message || 'Authentication failed. Please login again.'
        );
      }

      const response = await fetch(`${API_URL}/borrows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: JSON.stringify({
          bookId: book._id,
          returnDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || 'Failed to borrow this book.'
        );
      }

      setBorrowSuccess('Book borrowed successfully! Enjoy your reading.');

      await fetchBookDetails();

      setTimeout(() => {
        setIsModalOpen(false);
        setBorrowSuccess('');
      }, 1800);
    } catch (err) {
      setBorrowError(
        err instanceof Error
          ? err.message
          : 'An error occurred while borrowing the book.'
      );
    } finally {
      setBorrowLoading(false);
    }
  };

  const closeModal = () => {
    if (borrowLoading) return;

    setIsModalOpen(false);
    setBorrowError('');
    setBorrowSuccess('');
  };

  if (authLoading || !currentUser || loading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-[#c85a32]/20 border-t-[#c85a32] rounded-full animate-spin mb-4"></div>

        <p className="font-serif text-stone-600 font-medium">
          Retrieving book archival record...
        </p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">
            Book Not Found
          </h2>

          <p className="text-sm text-stone-600 mb-6 break-words">
            {error || 'The requested book is not available.'}
          </p>

          <Link
            href="/books"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#c85a32] hover:bg-[#a6431f] text-white text-sm font-medium rounded-xl transition"
          >
            Back to All Books
          </Link>
        </div>
      </div>
    );
  }

  const isAvailable = book.availableCopies > 0;

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2c2420] pb-16 sm:pb-20 lg:pb-24">
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium min-w-0">
            <Link href="/" className="hover:text-[#c85a32] transition shrink-0">
              Home
            </Link>

            <span>/</span>

            <Link
              href="/books"
              className="hover:text-[#c85a32] transition shrink-0"
            >
              Books
            </Link>

            <span>/</span>

            <span className="text-stone-900 truncate min-w-0">
              {book.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 lg:mt-10">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200 shadow-xl shadow-stone-200/50 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 p-4 sm:p-6 lg:p-10">
            <div className="lg:col-span-5 flex flex-col items-center w-full">
              <div className="relative w-full max-w-xs sm:max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-stone-100 border border-stone-200">
                <img
                  src={book.image || DEFAULT_COVER}
                  alt={book.title}
                  onError={(event) => {
                    event.currentTarget.src = DEFAULT_COVER;
                  }}
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                  <span className="px-3 py-1 bg-[#1f1917]/85 backdrop-blur-md text-white text-xs font-semibold rounded-full uppercase tracking-wider">
                    {book.category}
                  </span>
                </div>
              </div>

              <div className="w-full max-w-sm mt-5 sm:mt-6 p-3 sm:p-4 rounded-2xl bg-[#faf8f5] border border-stone-200 grid grid-cols-3 items-center text-center">
                <div className="min-w-0">
                  <span className="text-stone-500 block text-[11px] sm:text-xs">
                    Total Copies
                  </span>

                  <span className="font-bold text-stone-900 text-sm sm:text-base">
                    {book.totalCopies ?? 1}
                  </span>
                </div>

                <div className="border-x border-stone-200 min-w-0">
                  <span className="text-stone-500 block text-[11px] sm:text-xs">
                    Available Now
                  </span>

                  <span
                    className={`font-bold text-sm sm:text-base ${
                      isAvailable ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {book.availableCopies ?? 0}
                  </span>
                </div>

                <div className="min-w-0">
                  <span className="text-stone-500 block text-[11px] sm:text-xs">
                    Rating
                  </span>

                  <span className="font-bold text-amber-600 text-sm sm:text-base">
                    ★ {book.rating || '4.8'}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col justify-between space-y-5 sm:space-y-6 min-w-0">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      isAvailable
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isAvailable ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                    ></span>

                    {isAvailable
                      ? `${book.availableCopies} Copies Available`
                      : 'Currently Out of Stock'}
                  </span>

                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-700">
                    Category: {book.category}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-900 leading-tight break-words">
                  {book.title}
                </h1>

                <p className="text-sm sm:text-base text-stone-600 font-serif italic break-words">
                  Authored by{' '}
                  <span className="font-semibold text-stone-900 not-italic">
                    {book.author}
                  </span>
                </p>

                <div className="border-t border-b border-stone-100 py-5 sm:py-6 my-5 sm:my-6">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-stone-400 mb-3">
                    Overview & Description
                  </h3>

                  <p className="text-stone-700 text-sm sm:text-base leading-relaxed whitespace-pre-line font-serif break-words">
                    {book.description ||
                      'No detailed description is available.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs bg-[#faf8f5] p-3 sm:p-4 rounded-xl border border-stone-200">
                  <div className="min-w-0">
                    <span className="text-stone-400 block mb-1">
                      Archived By
                    </span>

                    <span className="font-medium text-stone-800 break-words block">
                      {book.userName || 'Library Curator'}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <span className="text-stone-400 block mb-1">
                      Curator Contact
                    </span>

                    <span className="font-medium text-stone-800 break-all block">
                      {book.userEmail || 'curator@booknook.com'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-5 sm:pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:gap-4">
                <button
                  onClick={handleOpenBorrowModal}
                  disabled={!isAvailable || authLoading}
                  className={`w-full sm:flex-1 py-3.5 sm:py-4 px-5 sm:px-8 rounded-xl font-semibold text-sm transition shadow-lg flex items-center justify-center gap-2 ${
                    isAvailable && !authLoading
                      ? 'bg-[#c85a32] hover:bg-[#a6431f] text-white shadow-[#c85a32]/25'
                      : 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
                  }`}
                >
                  <svg
                    className="w-5 h-5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>

                  <span>
                    {authLoading
                      ? 'Checking Session...'
                      : isAvailable
                        ? 'Borrow This Volume'
                        : 'Out of Stock'}
                  </span>
                </button>

                <Link
                  href="/books"
                  className="w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl font-medium text-sm border border-stone-300 hover:bg-stone-50 text-stone-700 transition text-center"
                >
                  Browse Other Titles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 lg:p-8 shadow-2xl border border-stone-200 relative animate-scale-up">
            <button
              type="button"
              onClick={closeModal}
              disabled={borrowLoading}
              className="absolute top-4 sm:top-5 right-4 sm:right-5 text-stone-400 hover:text-stone-800 transition p-1 disabled:opacity-50"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="flex items-center gap-3 mb-5 sm:mb-6 pr-8">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-[#c85a32]/10 text-[#c85a32] flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>

              <div className="min-w-0">
                <h3 className="font-serif font-bold text-lg sm:text-xl text-stone-900">
                  Borrow Volume
                </h3>

                <p className="text-xs text-stone-500">
                  Confirm your borrowing details
                </p>
              </div>
            </div>

            {borrowError && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl break-words">
                {borrowError}
              </div>
            )}

            {borrowSuccess && (
              <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium">
                {borrowSuccess}
              </div>
            )}

            <form onSubmit={handleBorrowSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1 uppercase tracking-wider">
                  Book Title
                </label>

                <input
                  type="text"
                  value={book.title}
                  disabled
                  className="w-full min-w-0 px-4 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-stone-800 text-sm font-medium cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="min-w-0">
                  <label className="block text-xs font-semibold text-stone-600 mb-1 uppercase tracking-wider">
                    Patron Name
                  </label>

                  <input
                    type="text"
                    value={currentUser?.name || 'Patron'}
                    disabled
                    className="w-full min-w-0 px-4 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-stone-800 text-sm font-medium cursor-not-allowed"
                  />
                </div>

                <div className="min-w-0">
                  <label className="block text-xs font-semibold text-stone-600 mb-1 uppercase tracking-wider">
                    Patron Email
                  </label>

                  <input
                    type="email"
                    value={currentUser?.email || ''}
                    disabled
                    className="w-full min-w-0 px-4 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-stone-800 text-sm font-medium cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1 uppercase tracking-wider">
                  Return Due Date *
                </label>

                <input
                  type="date"
                  required
                  value={returnDate}
                  min={getLocalDate(new Date())}
                  onChange={(event) => setReturnDate(event.target.value)}
                  className="w-full min-w-0 px-4 py-2.5 bg-[#faf8f5] border border-stone-200 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#c85a32]"
                />

                <p className="text-[11px] text-stone-400 mt-1">
                  Please select when you plan to return this book.
                </p>
              </div>

              <div className="pt-3 sm:pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={borrowLoading}
                  className="px-5 py-2.5 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100 transition border border-stone-200 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={borrowLoading || Boolean(borrowSuccess)}
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#c85a32] hover:bg-[#a6431f] text-white transition disabled:opacity-60 flex items-center justify-center gap-2 shadow-md shadow-[#c85a32]/20"
                >
                  {borrowLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Confirm Borrow</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}