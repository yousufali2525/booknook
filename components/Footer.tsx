
import Link from 'next/link';
import {
  BookOpen,
  Mail,
  Phone,
  MapPin,
  Heart,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-white">
                <BookOpen className="w-5 h-5" />
              </div>

              <span className="font-serif text-xl font-bold tracking-tight text-white">
                Book<span className="text-amber-500">Nook</span>
              </span>
            </Link>

            <p className="text-sm text-stone-400 leading-relaxed">
              A community-driven digital catalog for discovering, reading,
              and sharing favorite books with ease. Simple idea: Add a book,
              borrow a book, return a book.
            </p>

            <div className="flex items-center gap-3 pt-2">

              <a
                href="https://github.com/yousufali2525"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-stone-800 text-stone-400 hover:bg-amber-600 hover:text-white transition-all"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.07c-3.1.67-3.76-1.32-3.76-1.32-.5-1.29-1.24-1.63-1.24-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 1.71 2.63 1.22 3.27.93.1-.72.39-1.22.71-1.5-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.11-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.29-2.62 5.23-5.11 5.51.4.35.76 1.03.76 2.08V22c0 .29.2.64.77.53A11.1 11.1 0 0 0 12 .9Z" />
                </svg>
              </a>

              <a
                href="https://x.com/yousufali2525"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-stone-800 text-[#1DA1F2] hover:bg-amber-600 hover:text-white transition-all"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M23.953 4.57a10 10 0 0 1-2.825.775 4.932 4.932 0 0 0 2.163-2.723 9.99 9.99 0 0 1-3.127 1.195 4.916 4.916 0 0 0-8.384 4.482A13.95 13.95 0 0 1 1.64 3.162a4.916 4.916 0 0 0 1.523 6.557 4.9 4.9 0 0 1-2.229-.616v.062a4.918 4.918 0 0 0 3.946 4.817 4.935 4.935 0 0 1-2.224.084 4.926 4.926 0 0 0 4.6 3.417A9.87 9.87 0 0 1 0 19.54a13.93 13.93 0 0 0 7.548 2.213c9.057 0 14.01-7.503 14.01-14.01 0-.213-.005-.425-.014-.636a10.012 10.012 0 0 0 2.46-2.548z" />
                </svg>
              </a>

              <a
                href="https://www.linkedin.com/in/yousufali2525/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-stone-800 text-stone-400 hover:bg-amber-600 hover:text-white transition-all"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.26 2.37 4.26 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.21 0 22.23 0Z" />
                </svg>
              </a>

            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Quick Navigation
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">
                  Home
                </Link>
              </li>

              <li>
                <Link href="/books" className="hover:text-amber-400 transition-colors">
                  Browse Catalog
                </Link>
              </li>

              <li>
                <Link href="/add-book" className="hover:text-amber-400 transition-colors">
                  Contribute a Book
                </Link>
              </li>

              <li>
                <Link href="/my-books" className="hover:text-amber-400 transition-colors">
                  My Books
                </Link>
              </li>

              <li>
                <Link href="/my-borrows" className="hover:text-amber-400 transition-colors">
                  Borrowed Shelf
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Supported Genres
            </h3>

            <ul className="space-y-3 text-sm text-stone-400">
              <li>Fiction & Literature</li>
              <li>Science & Technology</li>
              <li>World History & Biographies</li>
              <li>Young Readers & Fantasy</li>
              <li>Educational Books</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Get in Touch
            </h3>

            <ul className="space-y-3 text-sm text-stone-400">

              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 text-amber-500 shrink-0" />
                <span>Rajshahi, Bangladesh</span>
              </li>

              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 mt-0.5 text-amber-500 shrink-0" />
                <a
                  href="mailto:yousufali025250@gmail.com"
                  className="hover:text-amber-400 transition-colors break-all"
                >
                  yousufali025250@gmail.com
                </a>
              </li>

              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 mt-0.5 text-amber-500 shrink-0" />
                <a
                  href="tel:+8801521748537"
                  className="hover:text-amber-400 transition-colors"
                >
                  +880 1521748537
                </a>
              </li>

            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} BookNook Library. All rights reserved.
          </p>

          <p className="flex items-center gap-1">
            Built for book lovers with
            <Heart className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
          </p>
        </div>

      </div>
    </footer>
  );
}

