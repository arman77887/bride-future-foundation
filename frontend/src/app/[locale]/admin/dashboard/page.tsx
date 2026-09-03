'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../../services/api';

interface DashboardStats {
  overview: {
    donations: number;
    applications: number;
    officers: number;
    news: number;
    notices: number;
    events: number;
    projects: number;
    vacancies: number;
    documents: number;
    users: number;
    subscribers: number;
    active_subscribers: number;
  };
  recent: {
    donations: unknown[];
    applications: unknown[];
    officers: unknown[];
  };
}

export default function AdminDashboardPage() {
  const params = useParams();
  const router = useRouter();

  const locale = params?.locale === 'en' ? 'en' : 'bn';
  const isBn = locale === 'bn';

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError('');

        const token = localStorage.getItem('auth_token');

        if (!token) {
          router.push(`/${locale}/login`);
          return;
        }

        const response = await api.get('/admin/dashboard/stats');

        setStats(response.data.data);
      } catch (err: any) {
        console.error('Dashboard API error:', err);

        if (err?.response?.status === 401) {
          localStorage.removeItem('auth_token');
          router.push(`/${locale}/login`);
          return;
        }

        setError(
          isBn
            ? 'ড্যাশবোর্ডের তথ্য লোড করা যায়নি।'
            : 'Unable to load dashboard statistics.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [locale, router, isBn]);

  const cards = stats
    ? [
        {
          title: isBn ? 'মোট অনুদান' : 'Total Donations',
          value: stats.overview.donations,
        },
        {
          title: isBn ? 'মোট আবেদন' : 'Total Applications',
          value: stats.overview.applications,
        },
        {
          title: isBn ? 'মোট অফিসার' : 'Total Officers',
          value: stats.overview.officers,
        },
        {
          title: isBn ? 'মোট সংবাদ' : 'Total News',
          value: stats.overview.news,
        },
        {
          title: isBn ? 'মোট নোটিশ' : 'Total Notices',
          value: stats.overview.notices,
        },
        {
          title: isBn ? 'মোট ইভেন্ট' : 'Total Events',
          value: stats.overview.events,
        },
        {
          title: isBn ? 'মোট প্রজেক্ট' : 'Total Projects',
          value: stats.overview.projects,
        },
        {
          title: isBn ? 'মোট চাকরি' : 'Total Vacancies',
          value: stats.overview.vacancies,
        },
        {
          title: isBn ? 'মোট ডকুমেন্ট' : 'Total Documents',
          value: stats.overview.documents,
        },
        {
          title: isBn ? 'মোট ইউজার' : 'Total Users',
          value: stats.overview.users,
        },
        {
          title: isBn ? 'মোট সাবস্ক্রাইবার' : 'Total Subscribers',
          value: stats.overview.subscribers,
        },
        {
          title: isBn ? 'সক্রিয় সাবস্ক্রাইবার' : 'Active Subscribers',
          value: stats.overview.active_subscribers,
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isBn ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin Dashboard'}
          </h1>

          <p className="mt-2 text-gray-500">
            {isBn
              ? 'সিস্টেমের বর্তমান পরিসংখ্যান ও তথ্য'
              : 'Current system statistics and information'}
          </p>
        </div>

        {loading && (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <div className="text-gray-500">
              {isBn ? 'ডেটা লোড হচ্ছে...' : 'Loading dashboard...'}
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {!loading && stats && (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => (
                <div
                  key={card.title}
                  className="bg-white overflow-hidden shadow-sm rounded-xl p-6 border border-gray-100"
                >
                  <dt className="text-sm font-medium text-gray-500">
                    {card.title}
                  </dt>

                  <dd className="mt-2 text-3xl font-bold text-emerald-600">
                    {card.value}
                  </dd>
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  {isBn ? 'সাম্প্রতিক অনুদান' : 'Recent Donations'}
                </h2>

                {stats.recent.donations.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    {isBn ? 'কোনো অনুদান নেই' : 'No donations yet'}
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">
                    {stats.recent.donations.length}{' '}
                    {isBn ? 'টি সাম্প্রতিক অনুদান' : 'recent donations'}
                  </p>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  {isBn ? 'সাম্প্রতিক আবেদন' : 'Recent Applications'}
                </h2>

                {stats.recent.applications.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    {isBn ? 'কোনো আবেদন নেই' : 'No applications yet'}
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">
                    {stats.recent.applications.length}{' '}
                    {isBn ? 'টি সাম্প্রতিক আবেদন' : 'recent applications'}
                  </p>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  {isBn ? 'সাম্প্রতিক অফিসার' : 'Recent Officers'}
                </h2>

                {stats.recent.officers.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    {isBn ? 'কোনো অফিসার নেই' : 'No officers yet'}
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">
                    {stats.recent.officers.length}{' '}
                    {isBn ? 'জন সাম্প্রতিক অফিসার' : 'recent officers'}
                  </p>
                )}
              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
}
