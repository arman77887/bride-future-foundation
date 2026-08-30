'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '../../store/useAuthStore';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const router = useRouter();
  const params = useParams();

  const locale = params?.locale === 'en' ? 'en' : 'bn';
  const isBn = locale === 'bn';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      await login(email, password);

      // Login successful → Admin Dashboard
      router.push(`/${locale}/admin/dashboard`);
    } catch (err) {
      setError(
        isBn
          ? 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়। আবার চেষ্টা করুন।'
          : 'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 mb-16">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-emerald-700">
            {isBn ? 'সাইন ইন' : 'Sign In'}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {isBn
              ? 'আপনার পোর্টাল অ্যাকাউন্টে প্রবেশ করুন'
              : 'Sign in to your portal account'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              {isBn ? 'ইমেইল ঠিকানা' : 'Email Address'}
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              autoComplete="email"
              required
              disabled={loading}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-gray-100"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              {isBn ? 'পাসওয়ার্ড' : 'Password'}
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                required
                disabled={loading}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-20 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-gray-100"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-emerald-700 hover:text-emerald-900"
              >
                {showPassword
                  ? (isBn ? 'লুকান' : 'Hide')
                  : (isBn ? 'দেখুন' : 'Show')}
              </button>
            </div>
          </div>

          {/* Sign In */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-bold text-base hover:bg-emerald-700 active:bg-emerald-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? (isBn ? 'সাইন ইন হচ্ছে...' : 'Signing In...')
              : (isBn ? 'সাইন ইন করুন' : 'Sign In')}
          </button>

        </form>



      </div>
    </div>
  );
};
