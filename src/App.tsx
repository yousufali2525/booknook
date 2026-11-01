import React, { useState } from 'react';
import { HeroSlider } from './components/HeroSlider';
import { INITIAL_SLIDES, INITIAL_BOOKS } from './data/mockBooks';
import { Book } from './types/book';
import { 
  BookMarked, 
  Search, 
  Plus, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  Filter,
  X
} from 'lucide-react';

export default function App() {
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCategory, setNewCategory] = useState('Fiction');
  const [newCondition, setNewCondition] = useState<'Like New' | 'Gently Used' | 'Well Read'>('Like New');
  const [newDescription, setNewDescription] = useState('');

  const triggerToast = (msg: string) => {
    setActiveToast(msg);
    setTimeout(() => setActiveToast(null), 3500);
  };

  const handleBrowseClick = () => {
    const el = document.getElementById('books-catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleShareClick = () => {
    setShowAddModal(true);
  };

  const handleBorrowBook = (bookId: string, title: string) => {
    setBooks(prev =>
      prev.map(b => {
        if (b.id === bookId || (b as any)._id === bookId) {
          const currentCopies = b.availableCopies !== undefined ? b.availableCopies : 1;
          const remaining = Math.max(0, currentCopies - 1);
          return {
            ...b,
            availableCopies: remaining,
            status: remaining === 0 ? ('borrowed' as const) : b.status,
          };
        }
        return b;
      })
    );
    triggerToast(`"${title}" has been borrowed! Enjoy your reading.`);
  };

  const handleAddBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthor.trim()) return;

    const newBook: Book = {
      id: `book-${Date.now()}`,
      _id: `book-${Date.now()}`,
      title: newTitle.trim(),
      author: newAuthor.trim(),
      category: newCategory,
      coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
      totalCopies: 1,
      availableCopies: 1,
      status: 'available',
      ownerName: 'You (Current User)',
      userName: 'You (Current User)',
      userEmail: 'user@booknook.com',
      ownerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      rating: 5.0,
      condition: newCondition,
      description: newDescription || 'Shared directly from my home bookshelf for fellow readers.',
      sharedAt: 'Just now',
    };

    setBooks([newBook, ...books]);
    setShowAddModal(false);
    setNewTitle('');
    setNewAuthor('');
    setNewDescription('');
    triggerToast(`Added "${newBook.title}" to the community bookshelf!`);
    handleBrowseClick();
  };

  const categories = ['All', 'Fiction', 'Science', 'History', 'Kids', 'Others', 'Business & Tech', 'Design & Product', 'Psychology'];

  const filteredBooks = books.filter(b => {
    const matchesCategory = selectedCategory === 'All' || b.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0e1015] text-[#ededef] font-sans antialiased selection:bg-[#7da887]/30 selection:text-white">
      {activeToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 bg-[#1b2a20] text-[#a4e2b4] border border-[#2e5439] px-4 py-3 rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#67c282] shrink-0" />
          <span className="text-sm font-medium">{activeToast}</span>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-[#0e1015]/85 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#d97746] to-[#b35322] flex items-center justify-center shadow-md">
              <BookMarked className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">BookNook</span>
              <span className="hidden sm:inline-block ml-2 text-xs uppercase tracking-widest text-[#d97746] font-semibold">Community</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleBrowseClick}
              className="text-xs sm:text-sm font-medium text-gray-300 hover:text-white px-3 py-1.5 transition-colors cursor-pointer"
            >
              Browse
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-[#7da887] hover:bg-[#8eb898] text-[#0f2115] font-semibold text-xs sm:text-sm transition-all duration-150 cursor-pointer shadow-sm hover:shadow-[#7da887]/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Share Book</span>
            </button>
          </div>
        </div>
      </header>

      <main>
        <HeroSlider
          onBrowseClick={handleBrowseClick}
          onBrowseBooks={handleBrowseClick}
          onShareClick={handleShareClick}
        />

        <section id="books-catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-white/5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-[#d97746]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#d97746]">Community Shelf</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal">
                Available Books on the Shelf
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Pick a book to borrow or view reader reviews from fellow community members.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by title or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 bg-[#181b22] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#7da887] focus:ring-1 focus:ring-[#7da887] transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
            <Filter className="w-4 h-4 text-gray-400 shrink-0 mr-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#7da887] text-[#0f2115] font-semibold shadow-sm'
                    : 'bg-[#181b22] text-gray-300 hover:bg-[#232731] border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredBooks.length === 0 ? (
            <div className="text-center py-16 bg-[#161820] rounded-2xl border border-white/5 p-8">
              <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-white mb-1">No books found</h3>
              <p className="text-sm text-gray-400 max-w-sm mx-auto mb-4">
                We couldn't find any books matching your search. Be the first to share one!
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-lg bg-[#7da887] text-[#0f2115] font-semibold text-sm cursor-pointer"
              >
                Add This Book
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => {
                const bookCover = book.coverUrl || (book as any).image;
                const isAvailable = (book.availableCopies !== undefined ? book.availableCopies > 0 : book.status === 'available');

                return (
                  <div
                    key={book.id || (book as any)._id}
                    className="group bg-[#15171e] hover:bg-[#1a1d26] border border-white/8 hover:border-white/15 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col justify-between shadow-lg"
                  >
                    <div className="p-5">
                      <div className="flex gap-4">
                        <div className="w-24 h-32 shrink-0 rounded-lg overflow-hidden bg-gray-800 shadow-md border border-white/10 relative">
                          <img
                            src={bookCover}
                            alt={book.title}
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (target.src.endsWith('.png')) {
                                target.src = target.src.replace(/\.png$/, '');
                              } else if (!target.src.includes('unsplash.com')) {
                                target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600';
                              }
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <span className="inline-block text-[11px] font-semibold tracking-wide text-[#d97746] uppercase mb-1">
                            {book.category}
                          </span>
                          <h3 className="font-serif text-lg text-white font-semibold line-clamp-2 leading-snug">
                            {book.title}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1">
                            by <span className="text-gray-300">{book.author}</span>
                          </p>

                          <div className="mt-3 flex items-center gap-2">
                            <span
                              className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                                isAvailable
                                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                                  : 'bg-rose-950/60 text-rose-300 border border-rose-800/40'
                              }`}
                            >
                              {book.availableCopies !== undefined 
                                ? (book.availableCopies > 0 ? `${book.availableCopies} Copies Available` : 'Out of Stock')
                                : (isAvailable ? 'Available' : 'Borrowed')}
                            </span>
                            <span className="text-[11px] text-gray-400 bg-white/5 px-2 py-0.5 rounded-md">
                              {book.condition || 'Gently Used'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-gray-400 mt-4 line-clamp-2 leading-relaxed">
                        {book.description}
                      </p>
                    </div>

                    <div className="px-5 py-3.5 bg-black/20 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={book.ownerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                          alt={book.ownerName || 'Contributor'}
                          className="w-6 h-6 rounded-full object-cover ring-1 ring-white/20"
                        />
                        <span className="text-xs text-gray-300 truncate max-w-[120px]">{book.ownerName || 'Curator'}</span>
                      </div>

                      <button
                        onClick={() => handleBorrowBook(book.id || (book as any)._id, book.title)}
                        disabled={!isAvailable}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                          isAvailable
                            ? 'bg-[#7da887] hover:bg-[#8eb898] text-[#0f2115] active:scale-95'
                            : 'bg-white/5 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {isAvailable ? 'Borrow Book' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#181b22] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#d97746] font-bold">Community Shelf</span>
                <h3 className="font-serif text-2xl text-white font-normal">Share a Book from Your Shelf</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddBookSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Book Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Exponential Organizations"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#111318] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#7da887]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Author *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Salim Ismail"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full bg-[#111318] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#7da887]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Genre / Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#111318] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#7da887]"
                  >
                    <option value="Fiction">Fiction</option>
                    <option value="Science">Science</option>
                    <option value="History">History</option>
                    <option value="Kids">Kids</option>
                    <option value="Business & Tech">Business & Tech</option>
                    <option value="Design & Product">Design & Product</option>
                    <option value="Psychology">Psychology</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Condition</label>
                  <select
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value as any)}
                    className="w-full bg-[#111318] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#7da887]"
                  >
                    <option value="Like New">Like New</option>
                    <option value="Gently Used">Gently Used</option>
                    <option value="Well Read">Well Read</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Brief Note / Why You Loved It</label>
                <textarea
                  rows={3}
                  placeholder="Tell other readers what this book meant to you..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-[#111318] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#7da887] resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#7da887] hover:bg-[#8eb898] text-[#0f2115] text-sm font-semibold cursor-pointer transition-all shadow-md active:scale-95"
                >
                  Publish to Shelf
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="mt-16 border-t border-white/5 py-8 text-center text-xs text-gray-500">
        <p>BookNook Community Bookshelf — Built with warmth for passionate readers.</p>
      </footer>
    </div>
  );
}