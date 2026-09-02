'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';

export default function RegisterPage() {
  const router = useRouter();
  const params = useParams();
  const register = useAuthStore((state) => state.register);

  const locale = params?.locale === 'en' ? 'en' : 'bn';
  const isBn = locale === 'bn';

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    password_confirmation: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const updateField = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.password_confirmation) {
      setError(
        isBn
          ? 'পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড একই হতে হবে।'
          : 'Password and confirm password must match.'
      );
      return;
    }

    if (form.password.length < 8) {
      setError(
        isBn
          ? 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।'
          : 'Password must be at least 8 characters.'
      );
      return;
    }

    setLoading(true);

    try {
      await register(
        form.name.trim(),
        form.email.trim(),
        form.phone.trim(),
        form.address.trim(),
        form.password,
        form.password_confirmation
      );

      router.push(`/${locale}/login?registered=1`);
    } catch (err: any) {
      const validationErrors = err?.response?.data?.errors;

      if (validationErrors) {
        const firstError = Object.values(validationErrors)
          .flat()
          .find((message) => typeof message === 'string');

        setError(
          typeof firstError === 'string'
            ? firstError
            : isBn
              ? 'রেজিস্ট্রেশন সম্পন্ন করা যায়নি। তথ্যগুলো যাচাই করুন।'
              : 'Registration failed. Please check your information.'
        );
      } else {
        setError(
          isBn
            ? 'রেজিস্ট্রেশন সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।'
            : 'Registration failed. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100';

  return (
    <div className="max-w-md mx-auto mt-10 mb-16">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 bff-scale">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-700">
            {isBn ? 'রেজিস্ট্রেশন' : 'Create Account'}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {isBn
              ? 'BFF সদস্য অ্যাকাউন্ট তৈরি করুন'
              : 'Create your BFF member account'}
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              {isBn ? 'পূর্ণ নাম' : 'Full Name'}
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              className={inputClass}
              placeholder={isBn ? 'আপনার পূর্ণ নাম' : 'Your full name'}
              required
              minLength={2}
              maxLength={150}
              autoComplete="name"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              {isBn ? 'ইমেইল' : 'Email'}
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              className={inputClass}
              placeholder="you@example.com"
              required
              maxLength={255}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              {isBn ? 'ফোন নম্বর' : 'Phone Number'}
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className={inputClass}
              placeholder={isBn ? 'ফোন নম্বর লিখুন' : 'Enter phone number'}
              required
              minLength={7}
              maxLength={30}
              autoComplete="tel"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              {isBn ? 'ঠিকানা' : 'Address'}
            </label>
            <textarea
              value={form.address}
              onChange={(e) => updateField('address', e.target.value)}
              className={`${inputClass} min-h-24 resize-y`}
              placeholder={isBn ? 'আপনার ঠিকানা' : 'Your address'}
              required
              minLength={3}
              maxLength={1000}
              autoComplete="street-address"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              {isBn ? 'পাসওয়ার্ড' : 'Password'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => updateField('password', e.target.value)}
                className={`${inputClass} pr-20`}
                placeholder={isBn ? 'কমপক্ষে ৮ অক্ষর' : 'At least 8 characters'}
                required
                minLength={8}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-emerald-700"
              >
                {showPassword
                  ? isBn
                    ? 'লুকান'
                    : 'Hide'
                  : isBn
                    ? 'দেখুন'
                    : 'Show'}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              {isBn ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'}
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={form.password_confirmation}
                onChange={(e) =>
                  updateField('password_confirmation', e.target.value)
                }
                className={`${inputClass} pr-20`}
                placeholder={
                  isBn ? 'পাসওয়ার্ড আবার লিখুন' : 'Enter password again'
                }
                required
                minLength={8}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword((value) => !value)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-emerald-700"
              >
                {showConfirmPassword
                  ? isBn
                    ? 'লুকান'
                    : 'Hide'
                  : isBn
                    ? 'দেখুন'
                    : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 bff-button"
          >
            {loading
              ? isBn
                ? 'রেজিস্ট্রেশন হচ্ছে...'
                : 'Creating account...'
              : isBn
                ? 'রেজিস্টার করুন'
                : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {isBn ? 'আগেই অ্যাকাউন্ট আছে?' : 'Already have an account?'}{' '}
          <Link
            href={`/${locale}/login`}
            className="font-semibold text-emerald-700 hover:text-emerald-900"
          >
            {isBn ? 'লগইন করুন' : 'Sign In'}
          </Link>
        </div>
      </div>
    </div>
  );
}
