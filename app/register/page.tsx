'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  UserPlus,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (pass: string) => {
    if (pass.length < 6) {
      return 'Password must be at least 6 characters long.';
    }

    if (!/[A-Z]/.test(pass)) {
      return 'Password must contain at least one uppercase letter.';
    }

    if (!/[a-z]/.test(pass)) {
      return 'Password must contain at least one lowercase letter.';
    }

    return '';
  };

  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    const passwordError = validatePassword(password);

    if (passwordError) {
      setErrorMessage(passwordError);
      return;
    }

    setIsLoading(true);

    try {
      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        image: photoUrl.trim() || undefined,
        callbackURL: '/login',
      });

      if (result.error) {
        setErrorMessage(
          result.error.message || 'Registration failed. Please try again.'
        );
        setIsLoading(false);
        return;
      }

      window.location.href = '/login';
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/',
      });

      if (result.error) {
        setErrorMessage(
          result.error.message || 'Google signup failed.'
        );
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Google signup error:', error);

      setErrorMessage(
        'Unable to sign up with Google. Please try again.'
      );

      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 shadow-xl">

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#c85a32] text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#c85a32]/25">
            <BookOpen className="w-7 h-7" />
          </div>

          <h1 className="font-['Cinzel',serif] text-3xl font-bold text-stone-900 tracking-tight">
            Create Account
          </h1>

          <p className="text-stone-500 text-sm mt-1">
            Join BookNook to borrow and share books
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 font-semibold text-stone-700 text-sm flex items-center justify-center gap-3 transition-colors mb-6 cursor-pointer shadow-sm disabled:opacity-60"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>

          <span>Sign up with Google</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-stone-200" />
          <span className="text-xs text-stone-400 uppercase font-semibold">
            Or with email
          </span>
          <div className="flex-1 h-px bg-stone-200" />
        </div>

        <form onSubmit={handleRegister} className="space-y-4">

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Full Name
            </label>

            <input
              type="text"
              required
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c85a32]/20 focus:border-[#c85a32]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>

            <input
              type="email"
              required
              placeholder="reader@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c85a32]/20 focus:border-[#c85a32]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Photo URL
            </label>

            <input
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c85a32]/20 focus:border-[#c85a32]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c85a32]/20 focus:border-[#c85a32]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="mt-2 space-y-1 text-[11px] text-stone-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    password.length >= 6
                      ? 'text-emerald-600'
                      : 'text-stone-300'
                  }`}
                />
                <span>At least 6 characters</span>
              </div>

              <div className="flex items-center gap-1.5">
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    /[A-Z]/.test(password)
                      ? 'text-emerald-600'
                      : 'text-stone-300'
                  }`}
                />
                <span>At least one uppercase letter (A-Z)</span>
              </div>

              <div className="flex items-center gap-1.5">
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    /[a-z]/.test(password)
                      ? 'text-emerald-600'
                      : 'text-stone-300'
                  }`}
                />
                <span>At least one lowercase letter (a-z)</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-[#c85a32] hover:bg-[#b34c26] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
          >
            <UserPlus className="w-4 h-4" />
            <span>
              {isLoading ? 'Creating account...' : 'Register'}
            </span>
          </button>

        </form>

        <p className="mt-8 text-center text-xs text-stone-500">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-[#c85a32] hover:underline cursor-pointer"
          >
            Sign In Here
          </Link>
        </p>

      </div>
    </div>
  );
}