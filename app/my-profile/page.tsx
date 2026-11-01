'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  User,
  Mail,
  ArrowLeft,
  BookOpen,
  ShieldCheck,
} from 'lucide-react';

export default function MyProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    document.title = 'BookNook | My Profile';

    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const profileImage = user.image || user.photoURL || user.photo;

  return (
    <main className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-stone-600 hover:text-amber-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">

          <div className="bg-amber-800 px-6 py-10 text-center">
            <div className="w-28 h-28 mx-auto rounded-full border-4 border-white shadow-lg overflow-hidden bg-amber-100 flex items-center justify-center">

              {profileImage ? (
                <img
                  src={profileImage}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-amber-800">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}

            </div>

            <h1 className="text-2xl font-bold text-white mt-4">
              {user.name}
            </h1>

            <p className="text-amber-100 text-sm mt-1">
              BookNook Member
            </p>
          </div>

          <div className="p-6 sm:p-8">

            <h2 className="text-xl font-bold text-stone-900 mb-6">
              Profile Information
            </h2>

            <div className="space-y-5">

              <div className="flex items-center gap-4 p-4 rounded-xl bg-stone-50 border border-stone-100">
                <div className="w-11 h-11 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-stone-500 font-medium">
                    Full Name
                  </p>

                  <p className="text-stone-900 font-semibold break-words">
                    {user.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-stone-50 border border-stone-100">
                <div className="w-11 h-11 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-stone-500 font-medium">
                    Email Address
                  </p>

                  <p className="text-stone-900 font-semibold break-all">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-stone-50 border border-stone-100">
                <div className="w-11 h-11 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>

                <div>
                  <p className="text-xs text-stone-500 font-medium">
                    Account Status
                  </p>

                  <p className="text-green-700 font-semibold">
                    Active Member
                  </p>
                </div>
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">

              <Link
                href="/my-books"
                className="flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                My Books
              </Link>

              <Link
                href="/my-borrows"
                className="flex items-center justify-center gap-2 border border-stone-300 hover:bg-stone-100 text-stone-800 font-semibold py-3 rounded-xl transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                My Borrows
              </Link>

            </div>

          </div>
        </div>
      </div>
    </main>
  );
}