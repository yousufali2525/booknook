'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BookOpen, LogOut, BookmarkCheck, Library, Menu, X, User, Home, PlusCircle, ChevronRight,
} from'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const handleLogout = async () => {
    try {
      await logout();
      setDropdownOpen(false);
      setMenuOpen(false);
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  const navLinks = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'All Books', href: '/books', icon: BookOpen }, ...(user  ? [
          { label: 'Add Book', href: '/add-book', icon: PlusCircle },
          { label: 'My Books', href: '/my-books', icon: Library },
          { label: 'My Borrows', href: '/my-borrows', icon: BookmarkCheck },  ]
      : []),
  ];
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-3">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 shrink-0" >
            <div className="w-10 h-10 rounded-xl bg-amber-700 flex items-center justify-center text-white shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-stone-900">  Book<span className="text-amber-700">Nook</span>
              </span>
              <span className="block text-[9px] uppercase tracking-widest font-semibold text-amber-700 -mt-1">  Library  </span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-1"> {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2 lg:px-3.5 py-2 rounded-lg text-xs lg:text-sm font-medium whitespace-nowrap transition ${
                  pathname === link.href  ? 'text-amber-800 bg-amber-50'  : 'text-stone-600 hover:text-amber-800 hover:bg-stone-100'  }`}  >  {link.label}
              </Link> ))}
          </div>
          <div className="hidden md:flex items-center gap-2 shrink-0">  {loading ? (
              <div className="w-9 h-9 rounded-full bg-stone-100 animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="p-1 rounded-full border border-stone-200 hover:ring-2 hover:ring-amber-500/20 transition"
                  aria-label="Open profile menu"
                  aria-expanded={dropdownOpen} >
                  {user.image || user.photoURL || user.photo ? (
                    <img
                      src={user.image || user.photoURL || user.photo || ''}
                      alt={user.name || 'Profile'}
                      className="w-9 h-9 rounded-full object-cover"  />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-semibold">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-3 w-56 rounded-2xl bg-white shadow-xl border border-stone-200 p-2 z-50">
                    <div className="px-3 py-2 border-b border-stone-100 mb-1">
                      <p className="text-sm font-semibold text-stone-900 truncate">  {user.name}
                      </p>
                      <p className="text-xs text-stone-500 truncate">  {user.email}  </p>
                    </div>
                    <Link
                      href="/my-profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-700 hover:bg-amber-50" >
                      <User className="w-4 h-4" /> My Profile
                    </Link>
                    <Link
                      href="/my-books"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-700 hover:bg-amber-50">
                      <Library className="w-4 h-4" />  My Books
                    </Link>
                    <Link
                      href="/my-borrows"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-700 hover:bg-amber-50" >
                      <BookmarkCheck className="w-4 h-4" /> My Borrows  </Link>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full justify-start gap-3 px-3 py-2.5 h-auto rounded-lg text-sm text-red-600 hover:bg-red-50" >
                      <LogOut className="w-4 h-4" />  Logout
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <> <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100 transition" >  Login  </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-amber-700 hover:bg-amber-800 transition">  Register
                </Link> </>
            )}
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl border border-stone-200 bg-stone-50 text-stone-700 hover:bg-amber-50 hover:text-amber-800 transition"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}>
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 z-50 px-3 sm:px-4 pt-2">
          <div className="max-w-lg mx-auto bg-white rounded-2xl border border-stone-200 shadow-2xl shadow-stone-900/15 p-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-3 py-2 mb-2">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-amber-700">  BookNook Library </p>
              <p className="text-sm font-semibold text-stone-900 mt-1">  Explore your library  </p>
            </div>
            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center justify-between p-2.5 rounded-xl transition ${  active ? 'bg-amber-50 text-amber-800'   : 'text-stone-700 hover:bg-stone-50' }`} >
                    <span className="flex items-center gap-3">
                      <span
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${  active  ? 'bg-amber-100'  : 'bg-stone-100 text-stone-500'  }`}  >
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="text-sm font-semibold">  {link.label}
                      </span>
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-40" />
                  </Link>
                );
              })}
            </div>
            <div className="border-t border-stone-100 mt-3 pt-3">
              {loading ? (
                <div className="h-10 bg-stone-100 rounded-xl animate-pulse" />
              ) : user ? (
                <div className="space-y-2">
                  <Link
                    href="/my-profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 hover:bg-amber-50 transition"> {user.image || user.photoURL || user.photo ? (
                      <img
                        src={user.image || user.photoURL || user.photo || ''}
                        alt={user.name || 'Profile'}
                        className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold">  {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-stone-900 truncate"> {user.name}
                      </p>
                      <p className="text-xs text-stone-500 truncate">  {user.email}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </Link>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start gap-3 px-3 py-2.5 h-auto rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50">
                    <LogOut className="w-4 h-4" />  Logout  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-center py-3 rounded-xl border border-stone-300 text-stone-700 text-sm font-semibold hover:bg-stone-50 transition">  Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="text-center py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-sm font-semibold transition shadow-sm" >  Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}