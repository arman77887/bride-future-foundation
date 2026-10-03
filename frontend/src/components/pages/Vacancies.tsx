'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import api from '@/services/api';

interface Department {
  id: string;
  name_bn: string;
  name_en: string;
}

interface Position {
  id: string;
  title_bn: string;
  title_en: string;
}

interface Vacancy {
  id: string;
  department_id: string;
  position_id: string;
  required_count: number;
  title_bn: string;
  title_en: string;
  description_bn?: string | null;
  description_en?: string | null;
  requirements?: string | null;
  deadline: string;
  status: string;
  is_active: boolean;
  application_limit?: number | null;
  application_count?: number;
  department?: Department | null;
  position?: Position | null;
}

export const Vacancies: React.FC = () => {
  const params = useParams();
  const locale = params?.locale === 'bn' ? 'bn' : 'en';
  const isBn = locale === 'bn';

  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadVacancies = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await api.get('/vacancies');
        const data = response?.data?.data;

        if (mounted) {
          setVacancies(Array.isArray(data) ? data : []);
        }
      } catch (err: any) {
        if (mounted) {
          setError(
            err?.response?.data?.message ||
              (isBn
                ? 'চাকরির বিজ্ঞপ্তি লোড করা যায়নি।'
                : 'Failed to load vacancies.'),
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadVacancies();

    return () => {
      mounted = false;
    };
  }, [isBn]);

  const formatDeadline = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat(isBn ? 'bn-BD' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-gray-500">
        {isBn ? 'নিয়োগ বিজ্ঞপ্তি লোড হচ্ছে...' : 'Loading career opportunities...'}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-green">
          {isBn ? 'ক্যারিয়ার ও নিয়োগ' : 'Career Opportunities'}
        </h1>

        <p className="mt-2 max-w-3xl text-gray-600">
          {isBn
            ? 'ব্রাইট ফিউচার ফাউন্ডেশনের চলমান নিয়োগ বিজ্ঞপ্তি দেখুন এবং আপনার উপযুক্ত পদে আবেদন করুন।'
            : 'Explore current opportunities at Bright Future Foundation and apply for a suitable position.'}
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!error && vacancies.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">
            {isBn
              ? 'বর্তমানে কোনো নিয়োগ বিজ্ঞপ্তি নেই'
              : 'No vacancies are currently available'}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {isBn
              ? 'নতুন সুযোগের জন্য পরবর্তীতে আবার দেখুন।'
              : 'Please check again later for new opportunities.'}
          </p>
        </div>
      )}

      <div className="space-y-5">
        {vacancies.map((vacancy) => {
          const title = isBn
            ? vacancy.title_bn || vacancy.title_en
            : vacancy.title_en || vacancy.title_bn;

          const description = isBn
            ? vacancy.description_bn || vacancy.description_en
            : vacancy.description_en || vacancy.description_bn;

          const department = isBn
            ? vacancy.department?.name_bn || vacancy.department?.name_en
            : vacancy.department?.name_en || vacancy.department?.name_bn;

          const position = isBn
            ? vacancy.position?.title_bn || vacancy.position?.title_en
            : vacancy.position?.title_en || vacancy.position?.title_bn;

          return (
            <article
              key={vacancy.id}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                    {title}
                  </h2>

                  {description && (
                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600">
                      {description}
                    </p>
                  )}

                  <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-wide text-gray-400">
                        {isBn ? 'বিভাগ' : 'Department'}
                      </span>
                      <span className="mt-1 block font-semibold text-gray-800">
                        {department || '—'}
                      </span>
                    </div>

                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-wide text-gray-400">
                        {isBn ? 'পদ' : 'Position'}
                      </span>
                      <span className="mt-1 block font-semibold text-gray-800">
                        {position || '—'}
                      </span>
                    </div>

                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-wide text-gray-400">
                        {isBn ? 'প্রয়োজনীয় সদস্য' : 'Openings'}
                      </span>
                      <span className="mt-1 block font-semibold text-gray-800">
                        {vacancy.required_count}
                      </span>
                    </div>
                  </div>

                  {vacancy.requirements && (
                    <div className="mt-5 rounded-lg bg-gray-50 p-4">
                      <h3 className="text-sm font-semibold text-gray-800">
                        {isBn ? 'যোগ্যতা / প্রয়োজনীয়তা' : 'Requirements'}
                      </h3>
                      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600">
                        {vacancy.requirements}
                      </p>
                    </div>
                  )}
                </div>

                <div className="shrink-0 rounded-xl border border-emerald-100 bg-emerald-50 p-4 lg:w-64">
                  <span className="block text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    {isBn ? 'আবেদনের শেষ সময়' : 'Application Deadline'}
                  </span>

                  <span className="mt-1 block text-sm font-semibold text-gray-900">
                    {formatDeadline(vacancy.deadline)}
                  </span>

                  <Link
                    href={`/${locale}/apply?vacancy=${encodeURIComponent(
                      vacancy.id,
                    )}`}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                  >
                    {isBn ? 'এখনই আবেদন করুন' : 'Apply Now'}
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
