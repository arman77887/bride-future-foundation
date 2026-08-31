'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';

export default function ApplyPage() {
  const params = useParams();
  const locale = params?.locale || 'bn';
  const isBn = locale === 'bn';

  const [formData, setFormData] = useState({
    vacancy_id: '',
    applicant_name: '',
    applicant_email: '',
    applicant_phone: '',
    cover_letter: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bridefuturefoundation.duckdns.org/api/v1';
      const response = await fetch(`${apiBase}/job-applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Locale': Array.isArray(locale) ? locale[0] : locale,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Application failed');
      }

      setSuccessMessage(
        isBn
          ? 'আপনার আবেদন সফলভাবে জমা হয়েছে!'
          : 'Your application has been submitted successfully!'
      );
      setFormData({
        vacancy_id: '',
        applicant_name: '',
        applicant_email: '',
        applicant_phone: '',
        cover_letter: '',
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-emerald-800 mb-6">
          {isBn ? 'চাকরি বা পদের জন্য আবেদন' : 'Job Application Form'}
        </h2>

        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-100 text-emerald-700 rounded text-sm">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {isBn ? 'ভ্যাকেন্সি আইডি' : 'Vacancy ID'}
            </label>
            <input
              type="text"
              required
              value={formData.vacancy_id}
              onChange={(e) => setFormData({ ...formData, vacancy_id: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {isBn ? 'পূর্ণ নাম' : 'Full Name'}
            </label>
            <input
              type="text"
              required
              value={formData.applicant_name}
              onChange={(e) => setFormData({ ...formData, applicant_name: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {isBn ? 'ইমেইল ঠিকানা' : 'Email Address'}
            </label>
            <input
              type="email"
              required
              value={formData.applicant_email}
              onChange={(e) => setFormData({ ...formData, applicant_email: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {isBn ? 'ফোন নম্বর' : 'Phone Number'}
            </label>
            <input
              type="text"
              required
              value={formData.applicant_phone}
              onChange={(e) => setFormData({ ...formData, applicant_phone: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {isBn ? 'কভার লেটার' : 'Cover Letter'}
            </label>
            <textarea
              rows={4}
              value={formData.cover_letter}
              onChange={(e) => setFormData({ ...formData, cover_letter: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
          >
            {loading ? (isBn ? 'প্রক্রিয়াধীন...' : 'Submitting...') : (isBn ? 'আবেদন জমা দিন' : 'Submit Application')}
          </button>
        </form>
      </div>
    </div>
  );
}
