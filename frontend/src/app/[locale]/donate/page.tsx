'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface DonationMethod {
  id: string;
  name_bn: string;
  name_en: string;
  type: string;
  account_identifier: string;
  instructions_bn?: string | null;
  instructions_en?: string | null;
  is_active: boolean;
  display_order: number;
}

export default function DonatePage() {
  const params = useParams();

  const locale = params?.locale === 'en' ? 'en' : 'bn';
  const isBn = locale === 'bn';

  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'https://bridefuturefoundation.duckdns.org/api/v1';

  const [methods, setMethods] = useState<DonationMethod[]>([]);
  const [methodsLoading, setMethodsLoading] = useState(true);
  const [methodsError, setMethodsError] = useState('');

  const [formData, setFormData] = useState({
    donor_name: '',
    donor_email: '',
    donor_phone: '',
    amount: '',
    currency: 'BDT',
    donation_method_id: '',
    transaction_id: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        setMethodsLoading(true);
        setMethodsError('');

        const response = await fetch(`${apiBase}/donation-methods`, {
          headers: {
            Accept: 'application/json',
            'X-Locale': locale,
          },
          cache: 'no-store',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load payment methods');
        }

        const activeMethods = (data.data || [])
          .filter((method: DonationMethod) => method.is_active)
          .sort(
            (a: DonationMethod, b: DonationMethod) =>
              a.display_order - b.display_order
          );

        setMethods(activeMethods);

        if (activeMethods.length > 0) {
          setFormData((prev) => ({
            ...prev,
            donation_method_id: activeMethods[0].id,
          }));
        }
      } catch (error: any) {
        console.error('Donation methods error:', error);
        setMethodsError(
          error?.message ||
            (isBn
              ? 'পেমেন্ট মাধ্যম লোড করা যায়নি।'
              : 'Unable to load payment methods.')
        );
      } finally {
        setMethodsLoading(false);
      }
    };

    fetchMethods();
  }, [apiBase, locale, isBn]);

  const selectedMethod = methods.find(
    (method) => method.id === formData.donation_method_id
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    if (!formData.donation_method_id) {
      setErrorMessage(
        isBn
          ? 'অনুগ্রহ করে একটি পেমেন্ট মাধ্যম নির্বাচন করুন।'
          : 'Please select a payment method.'
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiBase}/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Locale': locale,
        },
        body: JSON.stringify({
          donor_name: formData.donor_name,
          donor_email: formData.donor_email,
          donor_phone: formData.donor_phone,
          amount: Number(formData.amount),
          currency: formData.currency,
          donation_method_id: formData.donation_method_id,
          payment_gateway: selectedMethod?.type || 'MANUAL',
          transaction_id: formData.transaction_id,
        }),
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
        donation_method_id: methods[0]?.id || '',
        transaction_id: '',
      });
    } catch (error: any) {
      console.error('Donation submission error:', error);

      setErrorMessage(
        error?.message ||
          (isBn ? 'অনুদান জমা দেওয়া যায়নি।' : 'Donation submission failed.')
      );
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

        {methodsError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {methodsError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {isBn ? 'নাম' : 'Name'}
            </label>

            <input
              type="text"
              required
              value={formData.donor_name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  donor_name: e.target.value,
                })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {isBn ? 'ইমেইল' : 'Email'}
            </label>

            <input
              type="email"
              required
              value={formData.donor_email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  donor_email: e.target.value,
                })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {isBn ? 'ফোন নম্বর' : 'Phone Number'}
            </label>

            <input
              type="text"
              required
              value={formData.donor_phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  donor_phone: e.target.value,
                })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {isBn ? 'পরিমাণ (টাকা)' : 'Amount'}
            </label>

            <input
              type="number"
              step="0.01"
              min="1"
              required
              value={formData.amount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  amount: e.target.value,
                })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {isBn ? 'পেমেন্ট মাধ্যম' : 'Payment Method'}
            </label>

            {methodsLoading ? (
              <div className="mt-1 p-3 rounded-md bg-gray-50 border text-sm text-gray-500">
                {isBn
                  ? 'পেমেন্ট মাধ্যম লোড হচ্ছে...'
                  : 'Loading payment methods...'}
              </div>
            ) : methods.length === 0 ? (
              <div className="mt-1 p-3 rounded-md bg-yellow-50 border border-yellow-200 text-sm text-yellow-700">
                {isBn
                  ? 'কোনো পেমেন্ট মাধ্যম বর্তমানে সক্রিয় নেই।'
                  : 'No payment methods are currently active.'}
              </div>
            ) : (
              <select
                required
                value={formData.donation_method_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    donation_method_id: e.target.value,
                    transaction_id: '',
                  })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              >
                {methods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {isBn ? method.name_bn : method.name_en}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Payment Information */}
          {selectedMethod && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">

              <h3 className="font-bold text-emerald-800 mb-3">
                {isBn ? 'পেমেন্ট তথ্য' : 'Payment Information'}
              </h3>

              <div className="space-y-2 text-sm">

                <div>
                  <span className="font-semibold">
                    {isBn ? 'মাধ্যম:' : 'Method:'}
                  </span>{' '}
                  {isBn
                    ? selectedMethod.name_bn
                    : selectedMethod.name_en}
                </div>

                <div>
                  <span className="font-semibold">
                    {isBn ? 'অ্যাকাউন্ট / নম্বর:' : 'Account / Number:'}
                  </span>

                  <div className="mt-1 bg-white border rounded p-2 font-mono break-all">
                    {selectedMethod.account_identifier}
                  </div>
                </div>

                {(isBn
                  ? selectedMethod.instructions_bn
                  : selectedMethod.instructions_en) && (
                  <div>
                    <span className="font-semibold">
                      {isBn ? 'নির্দেশনা:' : 'Instructions:'}
                    </span>

                    <p className="mt-1 text-gray-700">
                      {isBn
                        ? selectedMethod.instructions_bn
                        : selectedMethod.instructions_en}
                    </p>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* Transaction ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {isBn ? 'ট্রানজাকশন আইডি' : 'Transaction ID'}
            </label>

            <input
              type="text"
              required
              value={formData.transaction_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  transaction_id: e.target.value,
                })
              }
              placeholder={
                isBn
                  ? 'পেমেন্ট করার পর Transaction ID দিন'
                  : 'Enter Transaction ID after payment'
              }
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || methodsLoading || methods.length === 0}
            className="w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading
              ? isBn
                ? 'প্রক্রিয়াধীন...'
                : 'Processing...'
              : isBn
                ? 'অনুদান জমা দিন'
                : 'Submit Donation'}
          </button>

        </form>
      </div>
    </div>
  );
}
