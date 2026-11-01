'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface BorrowRecord {
  _id?: string;
  id?: string;
  bookId?: string;
  bookTitle?: string;
  title?: string;
  author?: string;
  category?: string;
  image?: string;
  bookImage?: string;
  userName?: string;
  userEmail?: string;
  borrowDate?: string;
  returnDate?: string;
  status?: string;
}

export default function MyBorrowsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [returnLoadingId, setReturnLoadingId] = useState<string | null>(null);

  const fetchMyBorrows = useCallback(async () => {
    if (!user?.email) {
      setBorrows([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const tokenResponse = await fetch('/api/backend-token', {
        cache: 'no-store',
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.token) {
        throw new Error(tokenData.message || 'Authentication failed. Please login again.');
      }

      const response = await fetch(`${API_URL}/borrows`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load borrowed books.');
      }

      const records = Array.isArray(data)
        ? data
        : data.borrows || data.data || [];

      setBorrows(records);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not fetch borrowed books.'
      );
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    fetchMyBorrows();
  }, [user, authLoading, router, fetchMyBorrows]);

  const handleReturnBook = async (borrowId?: string) => {
    if (!borrowId) return;

    setReturnLoadingId(borrowId);
    setError('');
    setActionSuccess('');

    try {
      const tokenResponse = await fetch('/api/backend-token', {
        cache: 'no-store',
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.token) {
        throw new Error(tokenData.message || 'Authentication failed.');
      }

      const response = await fetch(`${API_URL}/borrows/${borrowId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to return book.');
      }

      setActionSuccess(data.message || 'Book returned successfully!');

      await fetchMyBorrows();

      setTimeout(() => {
        setActionSuccess('');
      }, 4000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error processing book return.'
      );
    } finally {
      setReturnLoadingId(null);
    }
  };

  const activeBorrows = borrows.filter(
    (record) => record.status === 'borrowed'
  );

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2c2420] pb-24">
      <div className="relative py-14 bg-[#1f1917] text-white border-b border-[#3b322e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-[#d97746] text-xs font-semibold tracking-widest uppercase mb-2 px-3 py-1 bg-[#d97746]/10 rounded-full border border-[#d97746]/20">
            Reader Circulation
          </span>

          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight">
            My Borrowed Books
          </h1>

          <p className="mt-3 text-stone-300 max-w-xl mx-auto text-sm sm:text-base">
            Track books currently in your care, return dates, and circulation history.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {actionSuccess && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium">{actionSuccess}</span>
            </div>

            <button
              onClick={() => setActionSuccess('')}
              className="text-emerald-600 hover:text-emerald-900 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between gap-4">
            <p className="text-sm font-medium">{error}</p>

            <button
              onClick={() => setError('')}
              className="text-red-600 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="font-serif font-bold text-xl text-[#2c2420]">
            Currently Borrowed ({activeBorrows.length})
          </h2>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchMyBorrows}
              disabled={loading}
              className="px-4 py-2 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 rounded-xl text-xs font-medium transition shadow-sm disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>

            <Link
              href="/books"
              className="inline-flex items-center gap-1.5 bg-[#c85a32] hover:bg-[#b34c26] text-white px-4 py-2 rounded-xl text-xs font-medium transition shadow-sm"
            >
              Browse Library
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-4 border-[#c85a32]/20 border-t-[#c85a32] rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-stone-500 font-serif text-sm">
              Checking your borrowings...
            </p>
          </div>
        ) : activeBorrows.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-12 text-center max-w-md mx-auto">
            <div className="w-14 h-14 bg-[#faf8f5] text-stone-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-200">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>

            <h3 className="font-serif font-bold text-lg text-[#2c2420]">
              No Borrowed Books
            </h3>

            <p className="text-stone-500 text-xs mt-1 mb-6">
              You haven&apos;t borrowed any books from the library yet.
            </p>

            <Link
              href="/books"
              className="inline-flex items-center gap-2 bg-[#c85a32] text-white px-5 py-2.5 rounded-xl text-xs font-medium hover:bg-[#b34c26] transition shadow-sm"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#faf8f5] border-b border-stone-200 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4 sm:px-6">Book</th>
                    <th className="py-3.5 px-4">Borrow Date</th>
                    <th className="py-3.5 px-4">Return Due Date</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100 text-sm">
                  {activeBorrows.map((record) => {
                    const recordId = record._id || record.id;
                    const bookTitle = record.bookTitle || record.title || 'Untitled Book';

                    const coverImage =
                      record.bookImage ||
                      record.image ||
                      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80';

                    return (
                      <tr key={recordId} className="hover:bg-stone-50/60 transition">
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={coverImage}
                              alt={bookTitle}
                              className="w-12 h-16 object-cover rounded-lg shadow-sm border border-stone-200 shrink-0"
                            />

                            <div>
                              <h4 className="font-serif font-bold text-[#2c2420] text-sm leading-tight">
                                {bookTitle}
                              </h4>

                              {record.author && (
                                <p className="text-stone-500 text-xs mt-0.5">
                                  {record.author}
                                </p>
                              )}

                              {record.category && (
                                <span className="inline-block mt-1 px-2 py-0.5 bg-stone-100 text-stone-600 rounded text-[10px] font-medium">
                                  {record.category}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-stone-600 text-xs">
                          {record.borrowDate
                            ? new Date(record.borrowDate).toLocaleDateString()
                            : 'N/A'}
                        </td>

                        <td className="py-4 px-4 text-stone-600 text-xs font-medium">
                          {record.returnDate ? (
                            <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
                              {new Date(record.returnDate).toLocaleDateString()}
                            </span>
                          ) : (
                            'Open'
                          )}
                        </td>

                        <td className="py-4 px-4 sm:px-6 text-right">
                          <button
                            onClick={() => handleReturnBook(recordId)}
                            disabled={!recordId || returnLoadingId === recordId}
                            className="px-3.5 py-1.5 bg-[#c85a32] hover:bg-[#b34c26] text-white rounded-lg text-xs font-medium transition disabled:opacity-50 shadow-sm"
                          >
                            {returnLoadingId === recordId
                              ? 'Returning...'
                              : 'Return Book'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}