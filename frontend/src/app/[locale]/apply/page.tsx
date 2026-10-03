'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';

type Vacancy = {
  id: string;
  title_bn?: string | null;
  title_en?: string | null;
  deadline?: string | null;
  required_count?: number | null;
  department?: {
    id?: string;
    name_bn?: string | null;
    name_en?: string | null;
  } | null;
  position?: {
    id?: string;
    title_bn?: string | null;
    title_en?: string | null;
  } | null;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://bff.crxhub.org/api/v1';

export default function ApplyPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const locale = Array.isArray(params?.locale)
    ? params.locale[0]
    : params?.locale || 'bn';

  const isBn = locale === 'bn';

  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [vacanciesLoading, setVacanciesLoading] = useState(true);

  const [formData, setFormData] = useState({
    vacancy_id: '',
    applicant_uid: '',
    applicant_name: '',
    applicant_email: '',
    applicant_phone: '',
    applicant_address: '',
    applicant_nid: '',
    applicant_passport: '',
    cover_letter: '',
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadVacancies() {
      try {
        const response = await fetch(`${API_BASE}/vacancies`, {
          headers: {
            Accept: 'application/json',
            'X-Locale': locale,
          },
        });

        if (!response.ok) {
          throw new Error('Unable to load vacancies');
        }

        const payload = await response.json();

        const rows = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];

        if (!cancelled) {
          setVacancies(rows);

          const requestedVacancy = searchParams.get('vacancy');

          if (
            requestedVacancy &&
            rows.some((item: Vacancy) => item.id === requestedVacancy)
          ) {
            setFormData((current) => ({
              ...current,
              vacancy_id: requestedVacancy,
            }));
          }
        }
      } catch {
        if (!cancelled) {
          setErrorMessage(
            isBn
              ? 'ভ্যাকেন্সির তালিকা লোড করা যায়নি। পরে আবার চেষ্টা করুন।'
              : 'Unable to load vacancies. Please try again later.',
          );
        }
      } finally {
        if (!cancelled) {
          setVacanciesLoading(false);
        }
      }
    }

    loadVacancies();

    return () => {
      cancelled = true;
    };
  }, [isBn, locale, searchParams]);

  useEffect(() => {
    if (!photo) {
      setPhotoPreview('');
      return;
    }

    const url = URL.createObjectURL(photo);
    setPhotoPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [photo]);

  const selectedVacancy = useMemo(
    () => vacancies.find((item) => item.id === formData.vacancy_id) || null,
    [formData.vacancy_id, vacancies],
  );

  const vacancyTitle = (vacancy: Vacancy) =>
    isBn
      ? vacancy.title_bn || vacancy.title_en || 'ভ্যাকেন্সি'
      : vacancy.title_en || vacancy.title_bn || 'Vacancy';

  const departmentName = selectedVacancy
    ? isBn
      ? selectedVacancy.department?.name_bn ||
        selectedVacancy.department?.name_en ||
        '—'
      : selectedVacancy.department?.name_en ||
        selectedVacancy.department?.name_bn ||
        '—'
    : '—';

  const positionName = selectedVacancy
    ? isBn
      ? selectedVacancy.position?.title_bn ||
        selectedVacancy.position?.title_en ||
        '—'
      : selectedVacancy.position?.title_en ||
        selectedVacancy.position?.title_bn ||
        '—'
    : '—';

  const updateField = (
    field: keyof typeof formData,
    value: string,
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handlePhoto = (file: File | null) => {
    setErrorMessage('');

    if (!file) {
      setPhoto(null);
      return;
    }

    const allowed = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowed.includes(file.type)) {
      setErrorMessage(
        isBn
          ? 'ছবি JPG, PNG অথবা WEBP ফরম্যাটে দিন।'
          : 'Please upload a JPG, PNG, or WEBP image.',
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage(
        isBn
          ? 'ছবির সর্বোচ্চ সাইজ 5 MB।'
          : 'Maximum photo size is 5 MB.',
      );
      return;
    }

    setPhoto(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSuccessMessage('');
    setErrorMessage('');

    if (!photo) {
      setErrorMessage(
        isBn
          ? 'আপনার প্রোফাইল ছবি নির্বাচন করুন।'
          : 'Please select your profile photo.',
      );
      return;
    }

    if (!formData.vacancy_id) {
      setErrorMessage(
        isBn
          ? 'যে পদের জন্য আবেদন করবেন সেটি নির্বাচন করুন।'
          : 'Please select a vacancy.',
      );
      return;
    }

    setLoading(true);

    try {
      const body = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value.trim() !== '') {
          body.append(key, value.trim());
        }
      });

      body.append('photo', photo);

      const response = await fetch(`${API_BASE}/job-applications`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'X-Locale': locale,
        },
        body,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const validationErrors = data?.errors
          ? Object.values(data.errors).flat().join(' ')
          : '';

        throw new Error(
          validationErrors ||
            data?.message ||
            (isBn ? 'আবেদন জমা দেওয়া যায়নি।' : 'Application failed.'),
        );
      }

      const reference =
        data?.data?.application_reference || '';

      setSuccessMessage(
        isBn
          ? `আপনার আবেদন সফলভাবে জমা হয়েছে।${
              reference ? ` রেফারেন্স: ${reference}` : ''
            }`
          : `Your application has been submitted successfully.${
              reference ? ` Reference: ${reference}` : ''
            }`,
      );

      setFormData({
        vacancy_id: '',
        applicant_uid: '',
        applicant_name: '',
        applicant_email: '',
        applicant_phone: '',
        applicant_address: '',
        applicant_nid: '',
        applicant_passport: '',
        cover_letter: '',
      });

      setPhoto(null);

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : isBn
            ? 'আবেদন জমা দেওয়া যায়নি।'
            : 'Application failed.',
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'mt-1.5 block w-full rounded-xl border border-gray-300 bg-white px-3.5 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100';

  const labelClass =
    'block text-sm font-semibold text-gray-800';

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="mb-7 text-center">
          <span className="inline-flex rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-emerald-800">
            Bright Future Foundation
          </span>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            {isBn ? 'ফাউন্ডেশন সদস্যপদের আবেদন' : 'Foundation Membership Application'}
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
            {isBn
              ? 'প্রকাশিত ভ্যাকেন্সি থেকে আপনার পছন্দের পদ নির্বাচন করে সঠিক তথ্য দিয়ে আবেদন সম্পন্ন করুন।'
              : 'Select an available position and complete your application with accurate information.'}
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {errorMessage}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
        >
          <section className="border-b border-gray-100 p-5 sm:p-7">
            <h2 className="text-lg font-bold text-gray-950">
              {isBn ? 'পদ নির্বাচন' : 'Position Selection'}
            </h2>

            <div className="mt-5">
              <label className={labelClass}>
                {isBn ? 'ভ্যাকেন্সি / পদ' : 'Vacancy / Position'}
                <span className="ml-1 text-red-600">*</span>
              </label>

              <select
                required
                disabled={vacanciesLoading}
                value={formData.vacancy_id}
                onChange={(e) => updateField('vacancy_id', e.target.value)}
                className={inputClass}
              >
                <option value="">
                  {vacanciesLoading
                    ? isBn
                      ? 'লোড হচ্ছে...'
                      : 'Loading...'
                    : isBn
                      ? 'পদ নির্বাচন করুন'
                      : 'Select a position'}
                </option>

                {vacancies.map((vacancy) => (
                  <option key={vacancy.id} value={vacancy.id}>
                    {vacancyTitle(vacancy)}
                  </option>
                ))}
              </select>
            </div>

            {selectedVacancy && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    {isBn ? 'ডিপার্টমেন্ট' : 'Department'}
                  </p>
                  <p className="mt-1 font-bold text-gray-950">
                    {departmentName}
                  </p>
                </div>

                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    {isBn ? 'পজিশন' : 'Position'}
                  </p>
                  <p className="mt-1 font-bold text-gray-950">
                    {positionName}
                  </p>
                </div>
              </div>
            )}
          </section>

          <section className="border-b border-gray-100 p-5 sm:p-7">
            <h2 className="text-lg font-bold text-gray-950">
              {isBn ? 'ব্যক্তিগত তথ্য' : 'Personal Information'}
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  UID <span className="text-red-600">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={formData.applicant_uid}
                  onChange={(e) => updateField('applicant_uid', e.target.value)}
                  className={inputClass}
                  placeholder={isBn ? 'ওয়েবসাইট অ্যাকাউন্ট UID' : 'Website account UID'}
                />
                <p className="mt-1.5 text-xs text-gray-500">
                  {isBn
                    ? 'আপনার রেজিস্টার্ড BFF ওয়েবসাইট অ্যাকাউন্টের UID দিন।'
                    : 'Enter the UID of your registered BFF website account.'}
                </p>
              </div>

              <div>
                <label className={labelClass}>
                  {isBn ? 'পূর্ণ নাম' : 'Full Name'}
                  <span className="ml-1 text-red-600">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={formData.applicant_name}
                  onChange={(e) => updateField('applicant_name', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  {isBn ? 'ফোন নম্বর' : 'Phone Number'}
                  <span className="ml-1 text-red-600">*</span>
                </label>
                <input
                  required
                  type="tel"
                  value={formData.applicant_phone}
                  onChange={(e) => updateField('applicant_phone', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  {isBn ? 'ইমেইল ঠিকানা (ঐচ্ছিক)' : 'Email Address (Optional)'}
                </label>
                <input
                  type="email"
                  value={formData.applicant_email}
                  onChange={(e) => updateField('applicant_email', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  {isBn ? 'NID নম্বর (ঐচ্ছিক)' : 'NID Number (Optional)'}
                </label>
                <input
                  type="text"
                  value={formData.applicant_nid}
                  onChange={(e) => updateField('applicant_nid', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  {isBn ? 'পাসপোর্ট নম্বর (ঐচ্ছিক)' : 'Passport Number (Optional)'}
                </label>
                <input
                  type="text"
                  value={formData.applicant_passport}
                  onChange={(e) =>
                    updateField('applicant_passport', e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>
                  {isBn ? 'ঠিকানা' : 'Address'}
                  <span className="ml-1 text-red-600">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.applicant_address}
                  onChange={(e) =>
                    updateField('applicant_address', e.target.value)
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <section className="border-b border-gray-100 p-5 sm:p-7">
            <h2 className="text-lg font-bold text-gray-950">
              {isBn ? 'প্রোফাইল ছবি' : 'Profile Photo'}
              <span className="ml-1 text-red-600">*</span>
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isBn
                ? 'পরিষ্কার, সামনে থেকে তোলা JPG, PNG অথবা WEBP ছবি দিন। সর্বোচ্চ 5 MB।'
                : 'Upload a clear front-facing JPG, PNG, or WEBP photo. Maximum 5 MB.'}
            </p>

            <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-gray-50">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="px-3 text-center text-xs text-gray-400">
                    {isBn ? 'ছবির প্রিভিউ' : 'Photo preview'}
                  </span>
                )}
              </div>

              <div className="flex-1">
                <input
                  required
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => handlePhoto(e.target.files?.[0] || null)}
                  className="block w-full cursor-pointer rounded-xl border border-gray-300 bg-white text-sm text-gray-600 file:mr-4 file:border-0 file:bg-emerald-700 file:px-4 file:py-3 file:font-semibold file:text-white hover:file:bg-emerald-800"
                />
              </div>
            </div>
          </section>

          <section className="p-5 sm:p-7">
            <label className={labelClass}>
              {isBn ? 'অতিরিক্ত তথ্য (ঐচ্ছিক)' : 'Additional Information (Optional)'}
            </label>

            <textarea
              rows={4}
              value={formData.cover_letter}
              onChange={(e) => updateField('cover_letter', e.target.value)}
              className={inputClass}
              placeholder={
                isBn
                  ? 'আপনার সম্পর্কে প্রয়োজনীয় অতিরিক্ত তথ্য লিখতে পারেন...'
                  : 'You may provide any additional information...'
              }
            />

            <button
              type="submit"
              disabled={loading || vacanciesLoading || vacancies.length === 0}
              className="mt-6 w-full rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? isBn
                  ? 'আবেদন জমা হচ্ছে...'
                  : 'Submitting...'
                : isBn
                  ? 'আবেদন জমা দিন'
                  : 'Submit Application'}
            </button>

            <p className="mt-3 text-center text-xs leading-5 text-gray-500">
              {isBn
                ? 'আবেদন অনুমোদিত হলে আপনার Foundation Member প্রোফাইল স্বয়ংক্রিয়ভাবে তৈরি হবে। ইমেইল দিলে অনুমোদনের নোটিফিকেশন ইমেইলেও পাবেন।'
                : 'If approved, your Foundation Member profile will be created automatically. If you provide an email address, you will also receive an approval notification by email.'}
            </p>
          </section>
        </form>
      </div>
    </main>
  );
}
