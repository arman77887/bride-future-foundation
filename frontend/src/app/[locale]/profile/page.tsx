'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const restore = useAuthStore((state) => state.restore);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const changePassword = useAuthStore((state) => state.changePassword);
  const logout = useAuthStore((state) => state.logout);

  const locale = params?.locale === 'en' ? 'en' : 'bn';
  const isBn = locale === 'bn';

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [error, setError] = useState('');

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    restore();
  }, [restore]);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/${locale}/login`);
    }
  }, [isLoading, isAuthenticated, router, locale]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setProfileMessage('');
    setProfileLoading(true);

    try {
      await updateProfile(
        profile.name.trim(),
        profile.email.trim(),
        profile.phone.trim(),
        profile.address.trim()
      );

      setProfileMessage(
        isBn
          ? 'প্রোফাইল সফলভাবে আপডেট হয়েছে।'
          : 'Profile updated successfully.'
      );
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
              ? 'প্রোফাইল আপডেট করা যায়নি।'
              : 'Profile could not be updated.'
        );
      } else {
        setError(
          isBn
            ? 'প্রোফাইল আপডেট করা যায়নি। আবার চেষ্টা করুন।'
            : 'Profile could not be updated. Please try again.'
        );
      }
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPasswordMessage('');

    if (newPassword.length < 8) {
      setError(
        isBn
          ? 'নতুন পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।'
          : 'New password must be at least 8 characters.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        isBn
          ? 'নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড একই হতে হবে।'
          : 'New password and confirmation must match.'
      );
      return;
    }

    setPasswordLoading(true);

    try {
      await changePassword(
        currentPassword,
        newPassword,
        confirmPassword
      );

      setPasswordMessage(
        isBn
          ? 'পাসওয়ার্ড পরিবর্তন হয়েছে। আপনাকে আবার লগইন করতে হবে।'
          : 'Password changed. Please login again.'
      );

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        router.replace(`/${locale}/login`);
      }, 1200);
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
              ? 'বর্তমান পাসওয়ার্ড সঠিক নয়।'
              : 'The current password is incorrect.'
        );
      } else {
        setError(
          isBn
            ? 'পাসওয়ার্ড পরিবর্তন করা যায়নি।'
            : 'Password could not be changed.'
        );
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  if (isLoading || (!isAuthenticated && !user)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-sm font-medium text-emerald-700">
          {isBn ? 'লোড হচ্ছে...' : 'Loading...'}
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100';

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-950">
          {isBn ? 'আমার প্রোফাইল' : 'My Profile'}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          {isBn
            ? 'আপনার BFF সদস্য প্রোফাইল পরিচালনা করুন।'
            : 'Manage your BFF member profile.'}
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* PROFILE */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm bff-fade">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-950">
              {isBn ? 'প্রোফাইল তথ্য' : 'Profile Information'}
            </h2>
          </div>

          <div className="mb-5 rounded-xl bg-emerald-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              UID
            </div>
            <div className="mt-1 text-lg font-black tracking-wide text-emerald-900">
              {user.uid}
            </div>
            <div className="mt-1 text-xs text-emerald-700">
              {isBn
                ? 'UID পরিবর্তন করা যাবে না।'
                : 'Your UID cannot be changed.'}
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {isBn ? 'পূর্ণ নাম' : 'Full Name'}
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className={inputClass}
                required
                minLength={2}
                maxLength={150}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {isBn ? 'ইমেইল' : 'Email'}
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className={inputClass}
                required
                maxLength={255}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {isBn ? 'ফোন নম্বর' : 'Phone Number'}
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                className={inputClass}
                required
                minLength={7}
                maxLength={30}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {isBn ? 'ঠিকানা' : 'Address'}
              </label>
              <textarea
                value={profile.address}
                onChange={(e) =>
                  setProfile({ ...profile, address: e.target.value })
                }
                className={`${inputClass} min-h-28 resize-y`}
                required
                minLength={3}
                maxLength={1000}
              />
            </div>

            {profileMessage && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {profileMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={profileLoading}
              className="w-full rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 bff-button"
            >
              {profileLoading
                ? isBn
                  ? 'আপডেট হচ্ছে...'
                  : 'Updating...'
                : isBn
                  ? 'প্রোফাইল আপডেট করুন'
                  : 'Update Profile'}
            </button>
          </form>
        </section>

        {/* PASSWORD */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm bff-fade">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-950">
              {isBn ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password'}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {isBn
                ? 'পাসওয়ার্ড পরিবর্তনের জন্য বর্তমান পাসওয়ার্ড যাচাই করা হবে। কোনো OTP লাগবে না।'
                : 'Your current password is required. No OTP verification is used.'}
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {isBn ? 'বর্তমান পাসওয়ার্ড' : 'Current Password'}
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={`${inputClass} pr-20`}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowCurrentPassword((value) => !value)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-emerald-700"
                >
                  {showCurrentPassword
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
                {isBn ? 'নতুন পাসওয়ার্ড' : 'New Password'}
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`${inputClass} pr-20`}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword((value) => !value)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-emerald-700"
                >
                  {showNewPassword
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
                {isBn ? 'নতুন পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm New Password'}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`${inputClass} pr-20`}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((value) => !value)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-emerald-700"
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

            {passwordMessage && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {passwordMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full rounded-lg border border-emerald-700 px-4 py-3 font-semibold text-emerald-800 transition hover:bg-emerald-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 bff-button"
            >
              {passwordLoading
                ? isBn
                  ? 'পরিবর্তন হচ্ছে...'
                  : 'Changing...'
                : isBn
                  ? 'পাসওয়ার্ড পরিবর্তন করুন'
                  : 'Change Password'}
            </button>
          </form>
        </section>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={async () => {
            await logout();
            router.replace(`/${locale}/login`);
          }}
          className="rounded-lg border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 active:scale-95"
        >
          {isBn ? 'লগআউট' : 'Logout'}
        </button>
      </div>
    </div>
  );
}
