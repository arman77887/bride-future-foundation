'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';

export default function DonatePage() {
  const params = useParams();
  const locale = params?.locale || 'bn';
  const isBn = locale === 'bn';

  const [formData, setFormData] = useState({
    donor_name: '',
    donor_email: '',
    donor_phone: '',
    amount: '',
    currency: 'BDT',
    payment_method: 'bkash',
    transaction_id: '',
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
      const response = await fetch('/api/v1/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Locale': Array.isArray(locale) ? locale[0] : locale,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setSuccessMessage(
        isBn
          ? 'অনুদান সফলভাবে জমা হয়েছে! যাচাই সাপেক্ষে আপডেট জানানো হবে।'
          : 'Donation submitted successfully! It will be verified shortly.'
      );
      setFormData({
        donor_name: '',
        donor_email: '',
        donor_phone: '',
        amount: '',
        currency: 'BDT',
        payment_method: 'bkash',
        transaction_id: '',
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-emerald-800 mb-6">
          {isBn ? 'অনুদান ফর্ম' : 'Donation Form'}
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
              {isBn ? 'নাম' : 'Name'}
            </label>
            <input
              type="text"
              required
              value={formData.donor_name}
              onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {isBn ? 'ইমেইল' : 'Email'}
            </label>
            <input
              type="email"
              required
              value={formData.donor_email}
              onChange={(e) => setFormData({ ...formData, donor_email: e.target.value })}
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
              value={formData.donor_phone}
              onChange={(e) => setFormData({ ...formData, donor_phone: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {isBn ? 'পরিমাণ (টাকা)' : 'Amount'}
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {isBn ? 'পেমেন্ট মাধ্যম' : 'Payment Method'}
            </label>
            <select
              value={formData.payment_method}
              onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            >
              <option value="bkash">bKash</option>
              <option value="nagad">Nagad</option>
              <option value="rocket">Rocket</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {isBn ? 'ট্রানজাকশন আইডি' : 'Transaction ID'}
            </label>
            <input
              type="text"
              required
              value={formData.transaction_id}
              onChange={(e) => setFormData({ ...formData, transaction_id: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
          >
            {loading ? (isBn ? 'প্রক্রিয়াধীন...' : 'Processing...') : (isBn ? 'অনুদান জমা দিন' : 'Submit Donation')}
          </button>
        </form>
      </div>
    </div>
  );
}
