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

interface Project {
  id: string;
  title_bn: string;
  title_en: string;
  slug: string;
  description_bn?: string | null;
  description_en?: string | null;
  status: string;
  cover_image_url?: string | null;
}

interface DonationForm {
  donor_name: string;
  donor_email: string;
  donor_phone: string;
  sender_phone: string;
  amount: string;
  currency: 'BDT' | 'USD';
  donation_method_id: string;
  transaction_id: string;
  project_id: string;
}

const BDT_PRESETS = ['500', '1000', '2000', '5000'];
const USD_PRESETS = ['5', '10', '25', '50'];

export default function DonatePage() {
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'bn';
  const isBn = locale === 'bn';

  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'https://bff.crxhub.org/api/v1';

  const [methods, setMethods] = useState<DonationMethod[]>([]);
  const [methodsLoading, setMethodsLoading] = useState(true);
  const [methodsError, setMethodsError] = useState('');

  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState('');

  const [formData, setFormData] = useState<DonationForm>({
    donor_name: '',
    donor_email: '',
    donor_phone: '',
    sender_phone: '',
    amount: '',
    currency: 'BDT',
    donation_method_id: '',
    transaction_id: '',
    project_id: '',
  });

  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
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
          throw new Error(
            data.message ||
              (isBn
                ? 'অনুদান মাধ্যম লোড করা যায়নি।'
                : 'Unable to load donation methods.')
          );
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
              ? 'অনুদান মাধ্যম লোড করা যায়নি।'
              : 'Unable to load donation methods.')
        );
      } finally {
        setMethodsLoading(false);
      }
    };

    fetchMethods();
  }, [apiBase, locale, isBn]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setProjectsLoading(true);
        setProjectsError('');

        const allProjects: Project[] = [];
        let page = 1;
        let lastPage = 1;

        do {
          const response = await fetch(
            `${apiBase}/projects?page=${page}`,
            {
              headers: {
                Accept: 'application/json',
                'X-Locale': locale,
              },
              cache: 'no-store',
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                (isBn
                  ? 'প্রকল্পসমূহ লোড করা যায়নি।'
                  : 'Unable to load projects.')
            );
          }

          const pageProjects: Project[] = Array.isArray(data.data)
            ? data.data
            : [];

          allProjects.push(...pageProjects);

          const parsedLastPage = Number(data?.meta?.last_page ?? 1);
          lastPage =
            Number.isFinite(parsedLastPage) && parsedLastPage > 0
              ? parsedLastPage
              : 1;

          page += 1;
        } while (page <= lastPage);

        const activeProjects = allProjects.filter(
          (project) => project.status === 'ACTIVE'
        );

        setProjects(activeProjects);
      } catch (error: any) {
        console.error('Projects error:', error);
        setProjectsError(
          error?.message ||
            (isBn
              ? 'প্রকল্পসমূহ লোড করা যায়নি।'
              : 'Unable to load projects.')
        );
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchProjects();
  }, [apiBase, locale, isBn]);

  const selectedMethod = methods.find(
    (method) => method.id === formData.donation_method_id
  );

  const selectedProject = projects.find(
    (project) => project.id === formData.project_id
  );

  const presets =
    formData.currency === 'BDT' ? BDT_PRESETS : USD_PRESETS;

  const currencySymbol = formData.currency === 'BDT' ? '৳' : '$';

  const selectFund = (projectId: string) => {
    setFormData((prev) => ({
      ...prev,
      project_id: projectId,
    }));

    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    if (!formData.donation_method_id) {
      setErrorMessage(
        isBn
          ? 'অনুগ্রহ করে একটি অনুদান মাধ্যম নির্বাচন করুন।'
          : 'Please select a donation method.'
      );
      setLoading(false);
      return;
    }

    if (!formData.amount || Number(formData.amount) < 1) {
      setErrorMessage(
        isBn
          ? 'অনুগ্রহ করে সঠিক অনুদানের পরিমাণ লিখুন।'
          : 'Please enter a valid donation amount.'
      );
      setLoading(false);
      return;
    }

    if (!formData.sender_phone.trim()) {
      setErrorMessage(
        isBn
          ? 'যে নম্বর/অ্যাকাউন্ট থেকে টাকা পাঠিয়েছেন সেটি লিখুন।'
          : 'Please enter the sender number/account.'
      );
      setLoading(false);
      return;
    }

    try {
      const payload = new FormData();

      payload.append('donor_name', formData.donor_name);
      payload.append('donor_email', formData.donor_email);
      payload.append('donor_phone', formData.donor_phone);
      payload.append('sender_phone', formData.sender_phone);
      payload.append('amount', formData.amount);
      payload.append('currency', formData.currency);
      payload.append(
        'donation_method_id',
        formData.donation_method_id
      );
      payload.append('transaction_id', formData.transaction_id);

      if (formData.project_id) {
        payload.append('project_id', formData.project_id);
      }

      if (evidenceFile) {
        payload.append('evidence', evidenceFile);
      }

      const response = await fetch(`${apiBase}/donations`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'X-Locale': locale,
        },
        body: payload,
      });

      const data = await response.json();

      if (!response.ok) {
        const validationMessage =
          data?.errors &&
          Object.values(data.errors)
            .flat()
            .filter(Boolean)
            .join(' ');

        throw new Error(
          validationMessage ||
            data.message ||
            (isBn
              ? 'অনুদান জমা দেওয়া যায়নি।'
              : 'Donation submission failed.')
        );
      }

      const donatedTo = selectedProject
        ? isBn
          ? selectedProject.title_bn
          : selectedProject.title_en
        : isBn
          ? 'ব্রাইট ফিউচার ফাউন্ডেশন সাধারণ তহবিল'
          : 'Bright Future Foundation General Fund';

      setSuccessMessage(
        isBn
          ? `${donatedTo}-এ আপনার অনুদান সফলভাবে জমা হয়েছে। অ্যাডমিন যাচাইয়ের পর এটি অনুমোদিত হবে।`
          : `Your donation to ${donatedTo} has been submitted successfully. It will be approved after admin verification.`
      );

      setFormData({
        donor_name: '',
        donor_email: '',
        donor_phone: '',
        sender_phone: '',
        amount: '',
        currency: 'BDT',
        donation_method_id: methods[0]?.id || '',
        transaction_id: '',
        project_id: '',
      });

      setEvidenceFile(null);

      const fileInput = document.getElementById(
        'donation-evidence'
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error: any) {
      console.error('Donation submission error:', error);

      setErrorMessage(
        error?.message ||
          (isBn
            ? 'অনুদান জমা দেওয়া যায়নি।'
            : 'Donation submission failed.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-emerald-200">
              {isBn
                ? 'ব্রাইট ফিউচার ফাউন্ডেশন'
                : 'Bright Future Foundation'}
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              {isBn
                ? 'আপনার অনুদান পরিবর্তনের অংশ হতে পারে'
                : 'Your Donation Can Make a Difference'}
            </h1>

            <p className="mt-4 max-w-2xl text-emerald-50">
              {isBn
                ? 'সাধারণ তহবিল অথবা আপনার পছন্দের কোনো সক্রিয় প্রকল্প নির্বাচন করে অনুদান দিন।'
                : 'Support our general fund or choose an active project you would like your donation to support.'}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isBn
                ? 'কোথায় অনুদান দিতে চান?'
                : 'Where would you like to donate?'}
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              {isBn
                ? 'সাধারণ অনুদান অথবা একটি নির্দিষ্ট প্রকল্প নির্বাচন করুন।'
                : 'Choose the general fund or a specific project.'}
            </p>
          </div>

          {projectsError && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {projectsError}
            </div>
          )}

          <div className="max-w-2xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <label
              htmlFor="donation-fund"
              className="mb-2 block text-sm font-semibold text-gray-800"
            >
              {isBn ? 'অনুদানের খাত' : 'Donation For'}
            </label>

            {projectsLoading ? (
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                {isBn
                  ? 'প্রকল্পসমূহ লোড হচ্ছে...'
                  : 'Loading projects...'}
              </div>
            ) : (
              <select
                id="donation-fund"
                value={formData.project_id}
                onChange={(e) => selectFund(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">
                  {isBn
                    ? 'ব্রাইট ফিউচার ফাউন্ডেশন — সাধারণ অনুদান'
                    : 'Bright Future Foundation — General Donation'}
                </option>

                {projects.map((project) => (
                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {isBn
                      ? project.title_bn
                      : project.title_en}
                  </option>
                ))}
              </select>
            )}

            <div className="mt-4 rounded-lg bg-emerald-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                {isBn ? 'নির্বাচিত তহবিল' : 'Selected Fund'}
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {selectedProject
                  ? isBn
                    ? selectedProject.title_bn
                    : selectedProject.title_en
                  : isBn
                    ? 'ব্রাইট ফিউচার ফাউন্ডেশন — সাধারণ অনুদান'
                    : 'Bright Future Foundation — General Donation'}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7 border-b border-gray-100 pb-5">
              <p className="text-sm font-semibold text-emerald-700">
                {isBn ? 'নির্বাচিত তহবিল' : 'Selected Fund'}
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-900">
                {selectedProject
                  ? isBn
                    ? selectedProject.title_bn
                    : selectedProject.title_en
                  : isBn
                    ? 'ব্রাইট ফিউচার ফাউন্ডেশন — সাধারণ অনুদান'
                    : 'Bright Future Foundation — General Donation'}
              </h2>
            </div>

            {successMessage && (
              <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            {methodsError && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {methodsError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {isBn ? 'আপনার নাম' : 'Your Name'}
                  </label>

                  <input
                    type="text"
                    value={formData.donor_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        donor_name: e.target.value,
                      })
                    }
                    className="mt-1.5 block w-full rounded-lg border border-gray-300 p-3 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {isBn ? 'যোগাযোগের ফোন' : 'Contact Phone'}
                  </label>

                  <input
                    type="text"
                    value={formData.donor_phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        donor_phone: e.target.value,
                      })
                    }
                    className="mt-1.5 block w-full rounded-lg border border-gray-300 p-3 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {isBn ? 'ইমেইল (ঐচ্ছিক)' : 'Email (Optional)'}
                </label>

                <input
                  type="email"
                  value={formData.donor_email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      donor_email: e.target.value,
                    })
                  }
                  className="mt-1.5 block w-full rounded-lg border border-gray-300 p-3 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {isBn ? 'মুদ্রা' : 'Currency'}
                </label>

                <select
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currency: e.target.value as 'BDT' | 'USD',
                      amount: '',
                    })
                  }
                  className="mt-1.5 block w-full rounded-lg border border-gray-300 p-3 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="BDT">
                    {isBn
                      ? 'বাংলাদেশি টাকা (BDT)'
                      : 'Bangladeshi Taka (BDT)'}
                  </option>

                  <option value="USD">
                    {isBn
                      ? 'মার্কিন ডলার (USD)'
                      : 'US Dollar (USD)'}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {isBn
                    ? 'অনুদানের পরিমাণ'
                    : 'Donation Amount'}
                </label>

                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {presets.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          amount,
                        })
                      }
                      className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                        formData.amount === amount
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-emerald-400'
                      }`}
                    >
                      {currencySymbol}
                      {amount}
                    </button>
                  ))}
                </div>

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
                  placeholder={
                    isBn
                      ? 'অথবা নিজের পরিমাণ লিখুন'
                      : 'Or enter a custom amount'
                  }
                  className="mt-3 block w-full rounded-lg border border-gray-300 p-3 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {isBn
                    ? 'অনুদান মাধ্যম'
                    : 'Donation Method'}
                </label>

                {methodsLoading ? (
                  <div className="mt-2 rounded-lg border bg-gray-50 p-3 text-sm text-gray-500">
                    {isBn
                      ? 'অনুদান মাধ্যম লোড হচ্ছে...'
                      : 'Loading donation methods...'}
                  </div>
                ) : methods.length === 0 ? (
                  <div className="mt-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-700">
                    {isBn
                      ? 'কোনো অনুদান মাধ্যম বর্তমানে সক্রিয় নেই।'
                      : 'No donation methods are currently active.'}
                  </div>
                ) : (
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {methods.map((method) => {
                      const selected =
                        method.id === formData.donation_method_id;

                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              donation_method_id: method.id,
                              transaction_id: '',
                              sender_phone: '',
                            })
                          }
                          className={`rounded-lg border p-3 text-left text-sm font-semibold transition ${
                            selected
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                              : 'border-gray-300 text-gray-700 hover:border-emerald-400'
                          }`}
                        >
                          {isBn
                            ? method.name_bn
                            : method.name_en}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {selectedMethod && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="font-bold text-emerald-900">
                    {isBn
                      ? 'পেমেন্টের তথ্য'
                      : 'Payment Information'}
                  </h3>

                  <div className="mt-4 space-y-4 text-sm">
                    <div>
                      <span className="text-gray-600">
                        {isBn
                          ? 'পেমেন্ট মাধ্যম'
                          : 'Payment Method'}
                      </span>

                      <div className="mt-1 font-semibold text-gray-900">
                        {isBn
                          ? selectedMethod.name_bn
                          : selectedMethod.name_en}
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-600">
                        {isBn
                          ? 'অ্যাকাউন্ট / নম্বর'
                          : 'Account / Number'}
                      </span>

                      <div className="mt-1 break-all rounded-lg border border-emerald-200 bg-white p-3 font-mono font-semibold text-gray-900">
                        {selectedMethod.account_identifier}
                      </div>
                    </div>

                    {(isBn
                      ? selectedMethod.instructions_bn
                      : selectedMethod.instructions_en) && (
                      <div>
                        <span className="text-gray-600">
                          {isBn ? 'নির্দেশনা' : 'Instructions'}
                        </span>

                        <p className="mt-1 whitespace-pre-line leading-6 text-gray-700">
                          {isBn
                            ? selectedMethod.instructions_bn
                            : selectedMethod.instructions_en}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {isBn
                    ? 'যে নম্বর/অ্যাকাউন্ট থেকে টাকা পাঠিয়েছেন'
                    : 'Sender Number / Account'}
                </label>

                <input
                  type="text"
                  value={formData.sender_phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sender_phone: e.target.value,
                    })
                  }
                  required
                  placeholder={
                    isBn
                      ? 'যেমন: 01XXXXXXXXX'
                      : 'Example: 01XXXXXXXXX'
                  }
                  className="mt-1.5 block w-full rounded-lg border border-gray-300 p-3 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {isBn
                    ? 'ট্রানজাকশন আইডি'
                    : 'Transaction ID'}
                  <span className="ml-1 text-red-500">*</span>
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
                      ? 'পেমেন্ট করার পর Transaction ID লিখুন'
                      : 'Enter the Transaction ID after payment'
                  }
                  className="mt-1.5 block w-full rounded-lg border border-gray-300 p-3 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label
                  htmlFor="donation-evidence"
                  className="block text-sm font-medium text-gray-700"
                >
                  {isBn
                    ? 'পেমেন্টের প্রমাণ (ঐচ্ছিক)'
                    : 'Payment Evidence (Optional)'}
                </label>

                <input
                  id="donation-evidence"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                  onChange={(e) =>
                    setEvidenceFile(e.target.files?.[0] || null)
                  }
                  className="mt-1.5 block w-full rounded-lg border border-gray-300 p-3 text-sm"
                />

                <p className="mt-1.5 text-xs text-gray-500">
                  {isBn
                    ? 'JPG, PNG অথবা PDF • সর্বোচ্চ 5 MB'
                    : 'JPG, PNG or PDF • Maximum 5 MB'}
                </p>
              </div>

              <button
                type="submit"
                disabled={
                  loading ||
                  methodsLoading ||
                  methods.length === 0
                }
                className="w-full rounded-lg bg-emerald-600 px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? isBn
                    ? 'জমা হচ্ছে...'
                    : 'Submitting...'
                  : isBn
                    ? 'অনুদান জমা দিন'
                    : 'Submit Donation'}
              </button>

              <p className="text-center text-xs leading-5 text-gray-500">
                {isBn
                  ? 'আপনার অনুদান প্রথমে Pending অবস্থায় থাকবে। অ্যাডমিন যাচাই করার পর এটি Verified হবে।'
                  : 'Your donation will initially remain Pending and will become Verified after admin review.'}
              </p>
            </form>
          </div>

          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900">
              {isBn
                ? 'অনুদান দেওয়ার নিয়ম'
                : 'How to Donate'}
            </h3>

            <ol className="mt-5 space-y-4 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                  1
                </span>
                <span>
                  {isBn
                    ? 'সাধারণ তহবিল অথবা একটি প্রকল্প নির্বাচন করুন।'
                    : 'Select the general fund or a project.'}
                </span>
              </li>

              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                  2
                </span>
                <span>
                  {isBn
                    ? 'অনুদানের পরিমাণ ও পেমেন্ট মাধ্যম নির্বাচন করুন।'
                    : 'Choose the amount and payment method.'}
                </span>
              </li>

              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                  3
                </span>
                <span>
                  {isBn
                    ? 'দেখানো নম্বর/অ্যাকাউন্টে টাকা পাঠান।'
                    : 'Send the payment to the displayed account.'}
                </span>
              </li>

              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                  4
                </span>
                <span>
                  {isBn
                    ? 'Sender Number ও Transaction ID দিয়ে ফর্ম জমা দিন।'
                    : 'Submit the Sender Number and Transaction ID.'}
                </span>
              </li>
            </ol>

            <div className="mt-6 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">
              {isBn
                ? 'Transaction ID সঠিকভাবে লিখুন। ভুল বা ইতোমধ্যে ব্যবহৃত Transaction ID যাচাই করা যাবে না।'
                : 'Enter the Transaction ID carefully. Incorrect or previously used transaction IDs cannot be verified.'}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
