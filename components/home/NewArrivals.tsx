'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  User,
  Tag,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function NewArrivals() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(
          `${API_URL}/books?sort=newest&limit=6`,
          {
            cache: 'no-store',
          }
        );

        if (!response.ok) {
          throw new Error('Failed to load books from database.');
        }

        const data = await response.json();

        const bookList = Array.isArray(data)
          ? data
          : Array.isArray(data.books)
            ? data.books
            : Array.isArray(data.data)
              ? data.data
              : Array.isArray(data.data?.books)
                ? data.data.books
                : [];

        setBooks(bookList.slice(0, 6));
      } catch (error) {
        console.error('Failed to fetch books:', error);

        setError(
          error instanceof Error
            ? error.message
            : 'Could not connect to backend server.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <section className="w-full space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Latest Catalog Additions</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            New Arrivals
          </h2>

          <p className="text-stone-500 text-sm mt-1">
            Discover the latest books added to our library.
          </p>
        </div>

        <Link
          href="/books"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:text-amber-800 transition-colors group self-start sm:self-auto"
        >
          <span>See All Books</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-amber-700 animate-spin" />

          <p className="text-sm text-stone-500 font-medium">
            Loading latest books...
          </p>
        </div>
      ) : error ? (
        <div className="py-16 text-center bg-rose-50 rounded-2xl border border-rose-200 p-6 sm:p-8">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />

          <h3 className="text-base font-semibold text-stone-800">
            Unable to Load Books
          </h3>

          <p className="text-sm text-stone-600 mt-2 break-words">
            {error}
          </p>
        </div>
      ) : books.length === 0 ? (
        <div className="py-16 text-center bg-stone-100/70 rounded-2xl border border-dashed border-stone-300 p-6 sm:p-8">
          <BookOpen className="w-12 h-12 text-stone-400 mx-auto mb-3" />

          <h3 className="text-base font-semibold text-stone-800">
            No Books Available
          </h3>

          <p className="text-sm text-stone-500 max-w-sm mx-auto mt-1 mb-4">
            There are currently no books in our library.
          </p>

          <Link
            href="/add-book"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-700 text-white text-xs font-semibold hover:bg-amber-800 transition-colors"
          >
            Add a Book
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {books.map((book) => (
            <div
              key={book._id}
              className="group bg-white rounded-xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col min-w-0"
            >
              <div className="relative h-52 sm:h-56 lg:h-60 w-full overflow-hidden bg-stone-100">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium bg-stone-900/80 text-white backdrop-blur-md">
                  {book.category}
                </span>
              </div>

              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1">
                    {book.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-stone-500 min-w-0">
                    <User className="w-3.5 h-3.5 text-amber-700 shrink-0" />

                    <span className="font-medium text-stone-700 truncate">
                      {book.author}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {book.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-xs text-stone-500 min-w-0">
                    <Tag className="w-3.5 h-3.5 shrink-0" />

                    <span className="truncate">{book.category}</span>
                  </span>

                  <Link
                    href={`/books/${book._id}`}
                    className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-700 hover:text-white transition-colors shrink-0"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {books.length > 0 && !loading && (
        <div className="pt-4 sm:pt-6 text-center">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-sm font-semibold shadow-sm transition-all hover:scale-105"
          >
            <span>See All Books</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </section>
  );
}