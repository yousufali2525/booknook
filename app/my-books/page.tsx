'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Trash2, X, AlertTriangle } from 'lucide-react';
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
  userName?: string;
  userEmail?: string;
  createdAt?: string;
}

const CATEGORIES = ['All','Fiction','Science','History','Kids','Philosophy','Technology','Mystery','Biography',];
const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');
const getToken = async (): Promise<string> => {
const response = await fetch('/api/backend-token', { method: 'GET', cache: 'no-store', });
const data = await response.json();
  if (!response.ok || !data.token) { throw new Error(data.message || 'Authentication failed. Please login again.'); }
  return data.token;
};
export default function MyBooksPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const [deleteConfirmBook, setDeleteConfirmBook] = useState<Book | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editTotalCopies, setEditTotalCopies] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const fetchMyBooks = useCallback(async () => {
    if (!user?.email) {
      setBooks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/books/my-books`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to load your books.');
      }
      const bookList = Array.isArray(data) ? data : data.books || data.data || [];
      setBooks(Array.isArray(bookList) ? bookList : []);
    } catch (error) {
      setError( error instanceof Error ? error.message : 'Could not fetch your books.' );
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
    fetchMyBooks();
  }, [user, authLoading, router, fetchMyBooks]);
  const showSuccess = (message: string) => {
    setActionSuccess(message);
    setTimeout(() => {
      setActionSuccess('');
    }, 4000);
  };
  const handleDelete = async () => {
    const bookId = deleteConfirmBook?._id || deleteConfirmBook?.id;
    if (!bookId) return;
    setDeleteLoadingId(bookId);
    setError('');
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete book.');
      }
      setBooks((previousBooks) =>
        previousBooks.filter((book) => (book._id || book.id) !== bookId)
      );
      setDeleteConfirmBook(null);
      showSuccess('Book removed successfully.');
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Error deleting book.'
      );
    } finally {
      setDeleteLoadingId(null);
    }
  };
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {e.preventDefault();
    if (!editingBook) return;
    const bookId = editingBook._id || editingBook.id;
    if (!bookId) return;
    if ( !editingBook.title.trim() ||  !editingBook.author.trim() ||  !editingBook.category.trim() ||  !editingBook.image.trim() ||  !editingBook.description?.trim()
    ) {
      setError('Please fill in all required fields.');
      return;
    }
    const totalCopies = Number(editTotalCopies);
    if ( editTotalCopies.trim() === '' ||  !Number.isInteger(totalCopies) ||  totalCopies < 1
    ) {
      setError('Total copies must be at least 1.');
      return;
    }
    setUpdateLoading(true);
    setError('');
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/books/${bookId}`, {  method: 'PATCH',
        headers: {  'Content-Type': 'application/json',  Authorization: `Bearer ${token}`, },
        body: JSON.stringify({
          title: editingBook.title.trim(),
          author: editingBook.author.trim(),
          category: editingBook.category,
          image: editingBook.image.trim(),
          description: editingBook.description.trim(),
          totalCopies,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update book.');
      }
      const updatedBook = data.book || data.data;
      if (updatedBook) {
        setBooks((previousBooks) =>  previousBooks.map((book) =>  (book._id || book.id) === bookId ? updatedBook : book  )
        );
      } else {
        await fetchMyBooks();
      }
      setEditingBook(null);
      setEditTotalCopies('');
      showSuccess('Book information updated successfully.');
    } catch (error) {
      setError( error instanceof Error ? error.message : 'Could not update book.'
      );
    } finally {
      setUpdateLoading(false);
    }
  };
  const filteredBooks = books.filter((book) => {
    const matchesSearch =  book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||  book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =  selectedCategory === 'All' ||  book.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#c85a32]/20 border-t-[#c85a32] rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#c85a32]/20 border-t-[#c85a32] rounded-full animate-spin" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2c2420] pb-24">
      <div className="relative pt-20 pb-16 bg-[#1f1917] text-white border-b border-[#3b322e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-[#d97746] text-xs font-semibold tracking-widest uppercase mb-2 px-3 py-1 bg-[#d97746]/10 rounded-full border border-[#d97746]/20">  Personal Registry </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight">  My Added Books  </h1>
          <p className="mt-3 text-stone-300 max-w-xl mx-auto text-sm sm:text-base"> Manage, update, and monitor the circulation of books you have  contributed to the archive.  </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/60 p-5 sm:p-6 border border-stone-200 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search your titles or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-4 py-2.5 bg-[#faf8f5] border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c85a32] text-sm text-[#2c2420]" />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button
                onClick={fetchMyBooks}
                disabled={loading}
                className="px-4 py-2.5 bg-[#faf8f5] hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-xl text-sm font-medium transition disabled:opacity-50" >  Refresh  </button>
              <Link
                href="/add-book"
                className="inline-flex items-center gap-2 bg-[#c85a32] hover:bg-[#b34c26] text-white px-5 py-2.5 rounded-xl text-sm font-medium transition shadow-sm" >
                <span>+</span>
                <span>Add New Book</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button  key={cat} onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition border shrink-0 ${
                  selectedCategory === cat ? 'bg-[#2c2420] text-white border-[#2c2420]' : 'bg-[#faf8f5] text-stone-600 border-stone-200 hover:bg-stone-100'  }`} >  {cat} </button>  ))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8"> {actionSuccess && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between">
            <span className="text-sm font-medium">{actionSuccess}</span>
            <button
              onClick={() => setActionSuccess('')}
              className="text-emerald-600 hover:text-emerald-900 text-sm font-bold"
              aria-label="Close success message" >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between gap-3">
            <span className="text-sm">{error}</span>
            <button
              onClick={() => setError('')}
              className="font-bold text-sm"
              aria-label="Close error message" >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-4 border-[#c85a32]/20 border-t-[#c85a32] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-stone-500 font-serif text-sm"> Loading your publications...  </p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-12 text-center max-w-md mx-auto">
            <div className="w-14 h-14 bg-[#faf8f5] text-stone-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-200">
              <BookOpenIcon />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#2c2420]">  No Books Found  </h3>
            <p className="text-stone-500 text-xs mt-1 mb-6">  You haven&apos;t added any books yet or no titles match your  search criteria.
            </p>
            <Link
              href="/add-book"
              className="inline-flex items-center gap-2 bg-[#c85a32] text-white px-4 py-2.5 rounded-xl text-xs font-medium hover:bg-[#b34c26] transition">  Add Your First Book
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#faf8f5] border-b border-stone-200 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4 sm:px-6">Book</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4 text-center">  Copies Available  </th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">  Actions </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-sm">
                  {filteredBooks.map((book) => {
                    const bookId = book._id || book.id;
                    const copies = book.availableCopies ?? book.quantity ?? 1;
                    return (
                      <tr
                        key={bookId}
                        className="hover:bg-stone-50/60 transition">
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={book.image}
                              alt={book.title}
                              className="w-12 h-16 object-cover rounded-lg shadow-sm border border-stone-200 shrink-0" />
                            <div>
                              <h4 className="font-serif font-bold text-[#2c2420] text-sm leading-tight"> {book.title}  </h4>
                              <p className="text-stone-500 text-xs mt-0.5"> {book.author} </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-block px-2.5 py-1 bg-stone-100 text-stone-700 rounded-md text-xs font-medium">  {book.category} </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              copies > 0  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'  }`} >  {copies} Copies
                          </span>
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingBook({ ...book });
                                setEditTotalCopies(
                                  String(  book.totalCopies ?? book.quantity ?? 1 )
                                );
                                setError('');
                              }}
                              className="px-3 py-1.5 bg-[#faf8f5] hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-lg text-xs font-medium transition" > Edit
                            </button>

                            <button
                              onClick={() => setDeleteConfirmBook(book)}
                              disabled={deleteLoadingId === bookId}
                              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-lg text-xs font-medium transition disabled:opacity-50" >  Delete </button>
                          </div>
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
      {editingBook && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h3 className="font-serif font-bold text-lg text-[#2c2420]"> Update Book  </h3>
              <button
                type="button"
                onClick={() => {  setEditingBook(null); setEditTotalCopies('');  setError(''); }}
                className="text-stone-400 hover:text-stone-600 font-bold text-sm"
                aria-label="Close edit form" >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1"> Book Title </label>
                <input
                  type="text"
                  required
                  value={editingBook.title}
                  onChange={(e) =>
                    setEditingBook({  ...editingBook,  title: e.target.value,  })
                  }
                  className="w-full px-3.5 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c85a32]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">  Author </label>
                <input
                  type="text"
                  required
                  value={editingBook.author}
                  onChange={(e) =>
                    setEditingBook({  ...editingBook,  author: e.target.value, })  }
                  className="w-full px-3.5 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c85a32]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">  Category </label>
                  <select
                    value={editingBook.category}
                    onChange={(e) =>
                      setEditingBook({  ...editingBook,  category: e.target.value,  })
                    }
                    className="w-full px-3.5 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c85a32]" >
                    {CATEGORIES.filter(
                      (category) => category !== 'All'
                    ).map((category) => (
                      <option key={category} value={category}>  {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Total Copies </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={editTotalCopies}
                    onChange={(e) => setEditTotalCopies(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c85a32]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">  Cover Image URL
                </label>
                <input
                  type="url"
                  required
                  value={editingBook.image}
                  onChange={(e) =>
                    setEditingBook({ ...editingBook,  image: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c85a32]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">  Description  </label>
                <textarea
                  required
                  rows={3}
                  value={editingBook.description || ''}
                  onChange={(e) =>
                    setEditingBook({  ...editingBook,  description: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c85a32]" />
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => { setEditingBook(null);  setEditTotalCopies(''); setError('');  }}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-50" >  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="px-5 py-2 bg-[#c85a32] hover:bg-[#b34c26] text-white rounded-xl text-xs font-medium transition disabled:opacity-50" > {updateLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {deleteConfirmBook && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-stone-200" >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3
                  id="delete-dialog-title"
                  className="text-lg font-bold text-stone-900"> Delete This Book? </h3>
                <p className="mt-2 text-sm text-stone-600 leading-relaxed"> Are you sure you want to remove{' '}
                  <span className="font-semibold text-stone-900">  {deleteConfirmBook.title}
                  </span>{' '} from the library? This action cannot be undone.  </p>
              </div>
              <button
                type="button"
                onClick={() => setDeleteConfirmBook(null)}
                disabled={deleteLoadingId !== null}
                className="text-stone-400 hover:text-stone-700 disabled:opacity-40"
                aria-label="Close confirmation" >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-7 flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmBook(null)}
                disabled={deleteLoadingId !== null}
                className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-sm font-semibold hover:bg-stone-50 transition disabled:opacity-50" >  Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteLoadingId !== null}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition disabled:opacity-60">
                {deleteLoadingId ? (
                  <> <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />  Deleting...  </>
                ) : ( <>  <Trash2 className="w-4 h-4" />  Delete Book </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function BookOpenIcon() {
  return <span className="text-2xl font-serif font-bold">BN</span>;
}

