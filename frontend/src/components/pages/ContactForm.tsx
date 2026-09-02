'use client';

import { FormEvent, useState } from 'react';
import { api } from '@/services/api';

type Props = {
  isBn: boolean;
  labels: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    submit: string;
  };
};

export default function ContactForm({ isBn, labels }: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setSuccess('');
    setError('');

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      subject: String(formData.get('subject') || '').trim(),
      message: String(formData.get('message') || '').trim(),
    };

    try {
      await api.post('contact-messages', payload);

      setSuccess(
        isBn
          ? 'আপনার বার্তা সফলভাবে পাঠানো হয়েছে। ধন্যবাদ।'
          : 'Your message has been sent successfully. Thank you.'
      );

      form.reset();
    } catch (err: any) {
      const responseMessage = err?.response?.data?.message;

      setError(
        responseMessage ||
          (isBn
            ? 'বার্তা পাঠানো যায়নি। কিছুক্ষণ পরে আবার চেষ্টা করুন।'
            : 'Unable to send your message. Please try again later.')
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-7 space-y-5">
      {success && (
        <div
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {success}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {labels.name}
        </label>
        <input
          type="text"
          name="name"
          required
          maxLength={120}
          autoComplete="name"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
          placeholder={isBn ? 'আপনার নাম' : 'Your name'}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {labels.email}
        </label>
        <input
          type="email"
          name="email"
          required
          maxLength={255}
          autoComplete="email"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
          placeholder={isBn ? 'আপনার ইমেইল' : 'Your email'}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {labels.phone}
        </label>
        <input
          type="tel"
          name="phone"
          maxLength={40}
          autoComplete="tel"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
          placeholder={isBn ? 'আপনার ফোন নম্বর' : 'Your phone number'}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {labels.subject}
        </label>
        <input
          type="text"
          name="subject"
          required
          maxLength={200}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
          placeholder={isBn ? 'বার্তার বিষয়' : 'Message subject'}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {labels.message}
        </label>
        <textarea
          name="message"
          rows={5}
          required
          maxLength={10000}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
          placeholder={isBn ? 'আপনার বার্তা লিখুন' : 'Write your message'}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? isBn
            ? 'পাঠানো হচ্ছে...'
            : 'Sending...'
          : labels.submit}
      </button>
    </form>
  );
}
