'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

const CATEGORIES = [
  'Fiction',
  'Science',
  'History',
  'Kids',
  'Others',
];

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const DEFAULT_COVER =
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';

export default function AddBookPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Fiction');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [totalCopies, setTotalCopies] = useState(1);
  const [description, setDescription] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    setErrorMessage('');

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file.');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size must be less than 5 MB.');
      e.target.value = '';
      return;
    }

    setImageFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage('');
    setSuccessMessage('');

    if (!user) {
      setErrorMessage('You must be signed in to add a new book.');
      return;
    }

    if (
      !title.trim() ||
      !author.trim() ||
      !category ||
      !image ||
      !description.trim()
    ) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (!imageFile) {
      setErrorMessage('Please select a book cover image.');
      return;
    }

    if (totalCopies < 1) {
      setErrorMessage('Total copies must be at least 1.');
      return;
    }

    setSubmitting(true);

    try {
      const tokenResponse = await fetch('/api/backend-token', {
        method: 'GET',
        cache: 'no-store',
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.token) {
        throw new Error(
          tokenData.message || 'Authentication failed. Please sign in again.'
        );
      }

      const imageResponse = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image,
        }),
      });

      const imageData = await imageResponse.json();

      if (!imageResponse.ok || !imageData.success || !imageData.imageUrl) {
        throw new Error(imageData.message || 'Image upload failed.');
      }

      const response = await fetch(`${API_URL}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          author: author.trim(),
          category,
          image: imageData.imageUrl,
          totalCopies: Number(totalCopies),
          description: description.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || 'Failed to add the book.'
        );
      }

      setSuccessMessage('Book added successfully to BookNook!');

      setTitle('');
      setAuthor('');
      setCategory('Fiction');
      setImage('');
      setImageFile(null);
      setTotalCopies(1);
      setDescription('');

      const fileInput = document.getElementById(
        'book-image'
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = '';
      }

      setTimeout(() => {
        router.push('/books');
      }, 1500);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'An error occurred while communicating with the server.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-6">
        <div className="w-10 h-10 border-4 border-[#c85a32]/20 border-t-[#c85a32] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white p-8 rounded-3xl border border-stone-200 shadow-xl shadow-stone-200/50">
          <div className="w-16 h-16 bg-[#c85a32]/10 text-[#c85a32] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">
            Authentication Required
          </h2>

          <p className="text-sm text-stone-600 mb-6">
            Only authenticated members may contribute new books to our library.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login"
              className="px-6 py-2.5 bg-[#c85a32] hover:bg-[#a6431f] text-white text-xs font-semibold rounded-xl transition shadow-md shadow-[#c85a32]/20"
            >
              Sign In Now
            </Link>

            <Link
              href="/books"
              className="px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition"
            >
              Back to Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2c2420] pb-24">
      <div className="relative py-14 bg-[#1f1917] text-white overflow-hidden border-b border-[#3b322e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <span className="inline-block text-[#d97746] text-xs font-semibold tracking-widest uppercase mb-2 px-3 py-1 bg-[#d97746]/10 rounded-full border border-[#d97746]/20">
            Curator Desk
          </span>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold">
            Add a New Volume to Archives
          </h1>

          <p className="mt-2 text-stone-300 text-xs sm:text-sm max-w-xl mx-auto">
            Provide the publication details, synopsis, and volume availability
            for our shared community shelves.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6">
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl shadow-stone-200/50 p-6 sm:p-10">
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-xl font-medium">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                  Book Title *
                </label>

                <input
                  type="text"
                  required
                  placeholder="e.g. The Great Gatsby"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-[#faf8f5] border border-stone-200 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#c85a32]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                  Author Name *
                </label>

                <input
                  type="text"
                  required
                  placeholder="e.g. F. Scott Fitzgerald"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-4 py-3 bg-[#faf8f5] border border-stone-200 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#c85a32]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                  Category *
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-[#faf8f5] border border-stone-200 rounded-xl text-stone-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#c85a32]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                  Total Copies Available *
                </label>

                <input
                  type="number"
                  min="1"
                  required
                  value={totalCopies}
                  onChange={(e) =>
                    setTotalCopies(Math.max(1, Number(e.target.value) || 1))
                  }
                  className="w-full px-4 py-3 bg-[#faf8f5] border border-stone-200 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#c85a32]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="book-image"
                className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2"
              >
                Upload Book Cover Image *
              </label>

              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="flex-1 w-full">
                  <input
                    id="book-image"
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 bg-[#faf8f5] border border-stone-200 rounded-xl text-stone-600 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#c85a32] file:text-white file:font-medium file:cursor-pointer"
                  />

                  <p className="text-[11px] text-stone-400 mt-2">
                    Select a book cover image. JPG, PNG or WebP. Maximum size
                    5 MB.
                  </p>

                  {imageFile && (
                    <p className="text-xs text-emerald-700 mt-2">
                      Selected: {imageFile.name}
                    </p>
                  )}
                </div>

                <div className="w-20 h-28 rounded-xl border border-stone-200 overflow-hidden bg-stone-100 shrink-0">
                  <img
                    src={image || DEFAULT_COVER}
                    alt="Book cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                Synopsis / Book Description *
              </label>

              <textarea
                required
                rows={4}
                placeholder="A compelling overview of this book, themes, and why readers should explore it..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-[#faf8f5] border border-stone-200 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#c85a32] resize-y"
              />
            </div>

            <div className="p-4 bg-[#faf8f5] border border-stone-200 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-stone-400 block mb-1">
                  Archiving Member (You)
                </span>

                <span className="font-semibold text-stone-800 block truncate">
                  {user.name || 'Curator'}
                </span>
              </div>

              <div>
                <span className="text-stone-400 block mb-1">
                  Member Email
                </span>

                <span className="font-semibold text-stone-800 block truncate">
                  {user.email}
                </span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-4 border-t border-stone-100">
              <Link
                href="/books"
                className="px-6 py-3 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100 transition border border-stone-200"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 rounded-xl text-xs font-semibold bg-[#c85a32] hover:bg-[#a6431f] text-white transition disabled:opacity-60 flex items-center gap-2 shadow-lg shadow-[#c85a32]/25"
              >
                {submitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Uploading & Publishing...</span>
                  </>
                ) : (
                  <span>Publish to Collection</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}