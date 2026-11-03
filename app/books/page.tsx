'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
export interface Book {
  _id?: string;
  id?: string;
  title: string;
  author: string;
  category: string;
  image: string;
  totalCopies?: number;
  availableCopies?: number;
  quantity?: number;
  description?: string;
  rating?: number;
}
const CATEGORIES = ['All','Fiction','Science','History','Kids','Others',];
const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');
export default function AllBooksPage() {
  const router = useRouter();
  const { user: currentUser, loading: authLoading } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const handleViewDetails = (bookId: string) => {
    if (authLoading) return;
    if (!currentUser) {
      router.push('/login');
      return;
    }
    router.push(`/books/${bookId}`);
  };
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/books`, {
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error('Failed to fetch books from server.');
      }
      const data = await res.json();
      let bookList: Book[] = [];
      if (Array.isArray(data)) {
        bookList = data;
      } else if (Array.isArray(data.books)) {
        bookList = data.books;
      } else if (Array.isArray(data.data)) {
        bookList = data.data;
      } else if (Array.isArray(data.data?.books)) {
        bookList = data.data.books;
      }
      const validBooks = bookList.filter(
        (book) =>
          book &&
          typeof book.title === 'string' &&
          typeof book.category === 'string'
      );
      console.log('Total books received:', validBooks.length);
      console.log(
        'Quantum Resonance:',
        validBooks.filter((book) =>
          book.title.toLowerCase().includes('quantum resonance')
        )
      );
      setBooks(validBooks);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError( err instanceof Error ? err.message  : 'Could not connect to the backend server.'
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    if (category) {
      const matchedCategory = CATEGORIES.find(
        (item) => item.toLowerCase() === category.trim().toLowerCase()
      );
      if (matchedCategory) {
        setSelectedCategory(matchedCategory);
      }
    }
  }, []);
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);
  const getCopiesCount = (book: Book): number => {
    if (book.availableCopies != null) {
      return Number(book.availableCopies);
    }
    if (book.quantity != null) {
      return Number(book.quantity);
    }
    if (book.totalCopies != null) {
      return Number(book.totalCopies);
    }
    return 0;
  };
  const filteredBooks = books.filter((book) => {
      const title = (book.title || '').toLowerCase();
      const author = (book.author || '').toLowerCase();
      const category = (book.category || '').trim().toLowerCase();
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = query === '' || title.includes(query) ||  author.includes(query);
      const matchesCategory = selectedCategory === 'All' || category === selectedCategory.trim().toLowerCase();
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const titleA = a.title || '';
      const titleB = b.title || '';
      const copiesA = getCopiesCount(a);
      const copiesB = getCopiesCount(b);
      if (sortBy === 'title-asc') {
        return titleA.localeCompare(titleB);
      }
      if (sortBy === 'title-desc') {
        return titleB.localeCompare(titleA);
      }
      if (sortBy === 'quantity-desc') {
        return copiesB - copiesA;
      }
      if (sortBy === 'quantity-asc') {
        return copiesA - copiesB;
      }
      return 0;
    });
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2c2420] pb-16 sm:pb-20 lg:pb-24 overflow-x-hidden">
      <div className="relative py-12 sm:py-14 md:py-16 bg-[#1f1917] text-white overflow-hidden border-b border-[#3b322e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block text-[#d97746] text-[10px] sm:text-xs font-semibold tracking-widest uppercase mb-3 px-3 py-1 bg-[#d97746]/10 rounded-full border border-[#d97746]/20">
            Archival Collection
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight">
            Explore All Books
          </h1>
          <p className="mt-3 sm:mt-4 text-stone-300 max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed">
            Discover timeless literature, scientific research, and fascinating
            narratives available in our sanctuary.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 relative z-20">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl shadow-stone-200/60 p-4 sm:p-5 md:p-6 border border-stone-200 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-center">
            <div className="sm:col-span-2 lg:col-span-6 relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                placeholder="Search by title or author name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#faf8f5] border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c85a32] text-sm text-[#2c2420]"/>
            </div>
            <div className="lg:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-[#faf8f5] border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c85a32] text-sm text-[#2c2420] font-medium cursor-pointer">
                <option value="default">Sort by: Default</option>
                <option value="title-asc">Title: A to Z</option>
                <option value="title-desc">Title: Z to A</option>
                <option value="quantity-desc">Highest Copies First</option>
                <option value="quantity-asc">Lowest Copies First</option>
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-3 flex items-center justify-between lg:justify-end gap-3">
              <button
                onClick={fetchBooks}
                disabled={loading}
                className="p-3 bg-[#faf8f5] hover:bg-stone-100 border border-stone-200 text-stone-600 rounded-xl transition disabled:opacity-50"
                title="Refresh books list">
                <svg
                  className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor" >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <div className="flex items-center bg-[#faf8f5] border border-stone-200 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg text-sm transition ${
                    viewMode === 'grid' ? 'bg-[#c85a32] text-white shadow-sm'  : 'text-stone-500 hover:text-stone-900'}`}
                  title="Grid View">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2v-2zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg text-sm transition ${
                    viewMode === 'table'  ? 'bg-[#c85a32] text-white shadow-sm'  : 'text-stone-500 hover:text-stone-900'
                  }`}
                  title="Table View">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor" >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-2 scrollbar-hide">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
              Filter:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition border shrink-0 ${
                  selectedCategory === cat ? 'bg-[#2c2420] text-white border-[#2c2420]' : 'bg-[#faf8f5] text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-7 sm:mt-10">
        {loading ? (
          <div className="py-20 sm:py-24 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 border-4 border-[#c85a32]/20 border-t-[#c85a32] rounded-full animate-spin mb-4"></div>
            <p className="text-stone-500 font-medium font-serif text-sm sm:text-base">
              Accessing library records...
            </p>
          </div>
        ) : error ? (
          <div className="max-w-xl mx-auto bg-red-50 border border-red-200 rounded-2xl p-5 sm:p-6 text-center space-y-3">
            <h3 className="text-lg font-serif font-bold text-red-900">
              Backend Connection Notice
            </h3>
            <p className="text-xs sm:text-sm text-red-700">{error}</p>
            <button
              onClick={fetchBooks}
              className="mt-2 px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition">
              Try Reconnecting
            </button>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="py-16 sm:py-20 text-center bg-white rounded-2xl border border-stone-200 p-5 sm:p-8 shadow-sm">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400 font-serif text-2xl font-bold">
              BN
            </div>
            <h3 className="text-xl font-serif font-bold text-stone-800">
              No Volumes Found
            </h3>
            <p className="text-sm text-stone-500 mt-2 max-w-md mx-auto">
              No matching books found under this query or category filter. Try
              clearing your search parameters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-4 px-4 py-2 bg-[#c85a32] text-white text-xs font-medium rounded-lg hover:bg-[#a6431f] transition">
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {filteredBooks.map((book) => {
              const bookId = book._id || book.id || '';
              const copies = getCopiesCount(book);
              const isAvailable = copies > 0;
              return (
                <div
                  key={bookId}
                  className="bg-white rounded-xl sm:rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group min-w-0">
                  <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                    {book.image && (
                      <img
                        src={book.image}
                        alt={book.title || 'Book cover'}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                    )}
                    <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                      <span className="px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold rounded-md bg-[#1f1917]/80 backdrop-blur-sm text-white">
                        {book.category || 'General'}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span
                        className={`px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold rounded-md flex items-center gap-1 backdrop-blur-sm ${
                          isAvailable ? 'bg-emerald-900/80 text-emerald-100 border border-emerald-500/30'  : 'bg-rose-900/80 text-rose-100 border border-rose-500/30'
                        }`}>
                        {isAvailable ? `${copies} Available` : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 line-clamp-1 group-hover:text-[#c85a32] transition">
                        {book.title}
                      </h3>
                      <p className="text-xs text-stone-500 font-medium mt-1">
                        By {book.author || 'Unknown Author'}
                      </p>
                      {book.description && (
                        <p className="text-xs text-stone-600 mt-3 line-clamp-2 leading-relaxed">
                          {book.description}
                        </p>
                      )}
                    </div>
                    <div className="mt-4 sm:mt-5 pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                      <span className="text-[10px] sm:text-xs text-stone-400 truncate">
                        {book.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleViewDetails(bookId)}
                        disabled={authLoading}
                        className="shrink-0 inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-2 rounded-lg bg-[#faf8f5] hover:bg-[#c85a32] text-[#2c2420] hover:text-white border border-stone-200 hover:border-[#c85a32] transition disabled:opacity-50">
                        <span>View Details</span>
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl sm:rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#faf8f5] text-stone-500 text-xs uppercase tracking-wider border-b border-stone-200">
                    <th className="py-4 px-6 font-semibold">Book Info</th>
                    <th className="py-4 px-6 font-semibold">Category</th>
                    <th className="py-4 px-6 font-semibold">Stock Status</th>
                    <th className="py-4 px-6 font-semibold text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredBooks.map((book) => {
                    const bookId = book._id || book.id || '';
                    const copies = getCopiesCount(book);
                    const isAvailable = copies > 0;
                    return (
                      <tr
                        key={bookId}
                        className="hover:bg-stone-50/70 transition">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            {book.image && (
                              <img
                                src={book.image}
                                alt={book.title || 'Book cover'}
                                onError={(e) => { e.currentTarget.style.display = 'none';
                                }}
                                className="w-12 h-16 object-cover rounded-md border border-stone-200 shadow-sm shrink-0"/>
                            )}
                            <div>
                              <p className="font-serif font-bold text-stone-900 hover:text-[#c85a32] transition"> {book.title}
                              </p>
                              <p className="text-xs text-stone-500 mt-0.5"> By {book.author}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-stone-100 text-stone-700"> {book.category}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
                              isAvailable ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${ isAvailable ? 'bg-emerald-500' : 'bg-rose-500'  }`}></span>
                            {isAvailable ? `${copies} in stock` : 'Out of stock'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            type="button"
                            onClick={() => handleViewDetails(bookId)}
                            disabled={authLoading}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#faf8f5] hover:bg-[#c85a32] text-[#2c2420] hover:text-white border border-stone-200 transition disabled:opacity-50">
                            <span>Details</span>
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
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