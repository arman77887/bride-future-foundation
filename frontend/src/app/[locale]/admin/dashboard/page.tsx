'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function AdminDashboardPage() {
  const params = useParams();
  const locale = params?.locale || 'bn';
  const isBn = locale === 'bn';

  const [stats, setStats] = useState({
    donationsCount: 0,
    applicationsCount: 0,
    officersCount: 0,
  });

  useEffect(() => {
    // Admin dashboard initial fetch placeholder
    setStats({
      donationsCount: 15,
      applicationsCount: 8,
      officersCount: 12,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {isBn ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin Dashboard'}
        </h1>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg p-5">
            <dt className="text-sm font-medium text-gray-500 truncate">
              {isBn ? 'মোট অনুদান' : 'Total Donations'}
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-emerald-600">
              {stats.donationsCount}
            </dd>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg p-5">
            <dt className="text-sm font-medium text-gray-500 truncate">
              {isBn ? 'মোট আবেদন' : 'Total Applications'}
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-emerald-600">
              {stats.applicationsCount}
            </dd>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg p-5">
            <dt className="text-sm font-medium text-gray-500 truncate">
              {isBn ? 'মোট অফিসার' : 'Total Officers'}
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-emerald-600">
              {stats.officersCount}
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
}
