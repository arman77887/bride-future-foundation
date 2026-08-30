'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';

type Vacancy = {
  id: string;
  title_bn?: string;
  title_en?: string;
};

type Application = {
  id: string;
  vacancy_id: string;
  application_reference: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  resume_path: string;
  cover_letter?: string | null;
  status: string;
  created_at: string;
  vacancy?: Vacancy;
};

const STATUSES = [
  'ALL',
  'PENDING',
  'UNDER_REVIEW',
  'SHORTLISTED',
  'INTERVIEW',
  'SELECTED',
  'REJECTED',
  'WITHDRAWN',
];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError('');

      const params: Record<string, string | number> = {
        page,
        per_page: 15,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (status !== 'ALL') {
        params.status = status;
      }

      const response = await api.get('/admin/applications', { params });

      const payload = response.data?.data;

      setApplications(payload?.data ?? []);
      setLastPage(payload?.last_page ?? 1);
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          'Failed to load applications.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [page, status]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadApplications();
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      setUpdatingId(id);

      await api.patch(`/admin/applications/${id}/status`, {
        status: newStatus,
      });

      setApplications((current) =>
        current.map((application) =>
          application.id === id
            ? { ...application, status: newStatus }
            : application
        )
      );
    } catch (err: any) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
          'Failed to update application status.'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const statusClass = (value: string) => {
    switch (value) {
      case 'SELECTED':
        return 'bg-green-100 text-green-700';
      case 'REJECTED':
        return 'bg-red-100 text-red-700';
      case 'SHORTLISTED':
        return 'bg-blue-100 text-blue-700';
      case 'INTERVIEW':
        return 'bg-purple-100 text-purple-700';
      case 'UNDER_REVIEW':
        return 'bg-yellow-100 text-yellow-700';
      case 'WITHDRAWN':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-orange-100 text-orange-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Applications
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage and review job applications.
        </p>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 md:flex-row"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone or reference..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
          >
            {STATUSES.map((item) => (
              <option key={item} value={item}>
                {item === 'ALL' ? 'All Statuses' : item.replaceAll('_', ' ')}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            Search
          </button>
        </form>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading applications...
          </div>
        ) : applications.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No applications found.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                      Applicant
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                      Reference
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                      Vacancy
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                      Applied
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {applications.map((application) => (
                    <tr
                      key={application.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900">
                          {application.applicant_name}
                        </div>

                        <div className="text-sm text-gray-500">
                          {application.applicant_email}
                        </div>

                        <div className="text-sm text-gray-500">
                          {application.applicant_phone}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="font-mono text-sm text-gray-700">
                          {application.application_reference}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="max-w-xs text-sm text-gray-700">
                          {application.vacancy?.title_en ||
                            application.vacancy?.title_bn ||
                            '—'}
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                        {new Date(
                          application.created_at
                        ).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-4">
                        <select
                          value={application.status}
                          disabled={updatingId === application.id}
                          onChange={(e) =>
                            updateStatus(
                              application.id,
                              e.target.value
                            )
                          }
                          className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none ${statusClass(
                            application.status
                          )}`}
                        >
                          {STATUSES
                            .filter((item) => item !== 'ALL')
                            .map((item) => (
                              <option key={item} value={item}>
                                {item.replaceAll('_', ' ')}
                              </option>
                            ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t px-4 py-4">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-sm text-gray-500">
                Page {page} of {lastPage}
              </span>

              <button
                type="button"
                disabled={page >= lastPage}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
