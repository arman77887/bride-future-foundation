'use client';

import { FormEvent, useState } from 'react';
import { api } from '../../services/api';

export default function NewsletterSubscribe({
  locale,
}: {
  locale?: string;
}) {
  const isBn = locale === 'bn';
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage('');
    setError('');

    if (!email.trim()) {
      setError(isBn ? 'আপনার ইমেইল দিন।' : 'Please enter your email.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/subscriptions/subscribe', {
        email: email.trim(),
      });

      setMessage(
        response.data?.message ||
          (isBn
            ? 'আপনি সফলভাবে সাবস্ক্রাইব করেছেন।'
            : 'You have successfully subscribed.')
      );
      setEmail('');
    } catch (err: any) {
      const validationMessage =
        err?.response?.data?.errors?.email?.[0] ||
        err?.response?.data?.message;

      setError(
        validationMessage ||
          (isBn
            ? 'সাবস্ক্রাইব করা যায়নি। আবার চেষ্টা করুন।'
            : 'Unable to subscribe. Please try again.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 max-w-xl">
      <h3 className="text-lg font-black">
        {isBn ? 'আপডেট পেতে সাবস্ক্রাইব করুন' : 'Subscribe for Updates'}
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray-400">
        {isBn
          ? 'নতুন নিউজ, নোটিশ, ইভেন্ট ও প্রকল্পের আপডেট সরাসরি আপনার ইমেইলে পান।'
          : 'Get news, notices, events and project updates directly in your email.'}
      </p>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={isBn ? 'আপনার ইমেইল' : 'Your email address'}
          disabled={loading}
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60"
        />

        <button
          type="submit"
          disabled={loading}
          className="bff-button rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? isBn
              ? 'সাবস্ক্রাইব হচ্ছে...'
              : 'Subscribing...'
            : isBn
              ? 'সাবস্ক্রাইব'
              : 'Subscribe'}
        </button>
      </form>

      {message && (
        <p className="mt-3 text-sm font-medium text-emerald-400">
          {message}
        </p>
      )}

      {error && (
        <p className="mt-3 text-sm font-medium text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
