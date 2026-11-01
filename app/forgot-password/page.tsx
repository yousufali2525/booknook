'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage('');
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setMessage(
      'Password recovery is currently a demo feature. Please contact support for assistance.'
    );
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 shadow-xl">

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#c85a32] text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#c85a32]/25">
            <BookOpen className="w-7 h-7" />
          </div>

          <h1 className="font-['Cinzel',serif] text-3xl font-bold text-stone-900 tracking-tight">
            Forgot Password?
          </h1>

          <p className="text-stone-500 text-sm mt-2">
            Enter your email address to continue.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />

              <input
                type="email"
                required
                placeholder="reader@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c85a32]/20 focus:border-[#c85a32]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#c85a32] hover:bg-[#b34c26] text-white font-semibold text-sm shadow-md transition-all"
          >
            Continue
          </button>

        </form>

        <button
          type="button"
          onClick={() => router.push('/login')}
          className="w-full mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-stone-600 hover:text-[#c85a32] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>

        <p className="mt-6 text-center text-xs text-stone-500">
          Remember your password?{' '}
          <Link
            href="/login"
            className="font-semibold text-[#c85a32] hover:underline"
          >
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}