'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';

type Department = {
  id?: string;
  name_bn?: string | null;
  name_en?: string | null;
};

type Position = {
  id?: string;
  title_bn?: string | null;
  title_en?: string | null;
};

type Vacancy = {
  id: string;
  title_bn?: string | null;
  title_en?: string | null;
  department?: Department | null;
  position?: Position | null;
};

type Application = {
  id: string;
  vacancy_id: string;
  user_id?: string | null;
  application_reference: string;
  applicant_uid?: string | null;
  applicant_name: string;
  applicant_email?: string | null;
  applicant_phone: string;
  applicant_address?: string | null;
  applicant_nid?: string | null;
  applicant_passport?: string | null;
  photo_path?: string | null;
  photo_url?: string | null;
  resume_path?: string | null;
  cover_letter?: string | null;
  status: string;
  created_at: string;
  vacancy?: Vacancy | null;
  user?: {
    id: string;
    uid?: string | null;
    name?: string | null;
    email?: string | null;
  } | null;
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
  const [selected, setSelected] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
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
          'Failed to load applications.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (page !== 1) {
      setPage(1);
      return;
    }

    loadApplications();
  };

  const reviewApplication = async (id: string) => {
    try {
      setDetailLoading(true);
      setError('');

      const response = await api.get(`/admin/applications/${id}`);
      setSelected(response.data?.data ?? null);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          'Failed to load application details.',
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const updateStatus = async (
    id: string,
    newStatus: string,
  ) => {
    if (newStatus === 'SELECTED') {
      const confirmed = window.confirm(
        'Approve this application? This will automatically create and publish the Foundation Member profile using the applicant UID, department and position.',
      );

      if (!confirmed) {
        return;
      }
    }

    try {
      setUpdatingId(id);

      const response = await api.patch(
        `/admin/applications/${id}/status`,
        {
          status: newStatus,
        },
      );

      const updated = response.data?.data as Application | undefined;

      setApplications((current) =>
        current.map((application) =>
          application.id === id
            ? {
                ...application,
                ...(updated || {}),
                status: updated?.status || newStatus,
              }
            : application,
        ),
      );

      if (selected?.id === id) {
        await reviewApplication(id);
      }

      if (newStatus === 'SELECTED') {
        window.alert(
          'Application approved. The Foundation Member profile has been created and published successfully.',
        );
      }
    } catch (err: any) {
      console.error(err);

      window.alert(
        err?.response?.data?.message ||
          'Failed to update application status.',
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const statusClass = (value: string) => {
    switch (value) {
      case 'SELECTED':
        return 'bg-emerald-100 text-emerald-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-700';
      case 'SHORTLISTED':
        return 'bg-blue-100 text-blue-700';
      case 'INTERVIEW':
        return 'bg-purple-100 text-purple-700';
      case 'UNDER_REVIEW':
        return 'bg-amber-100 text-amber-800';
      case 'WITHDRAWN':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-orange-100 text-orange-700';
    }
  };

  const departmentName = (application: Application) =>
    application.vacancy?.department?.name_en ||
    application.vacancy?.department?.name_bn ||
    '—';

  const positionName = (application: Application) =>
    application.vacancy?.position?.title_en ||
    application.vacancy?.position?.title_bn ||
    '—';

  const vacancyName = (application: Application) =>
    application.vacancy?.title_en ||
    application.vacancy?.title_bn ||
    '—';

  const DetailItem = ({
    label,
    value,
  }: {
    label: string;
    value?: string | null;
  }) => (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-medium text-gray-900">
        {value || '—'}
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
          Recruitment
        </p>
        <h1 className="mt-1 text-3xl font-bold text-gray-950">
          Applications
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Review applicant information and manage the complete membership approval workflow.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 md:flex-row"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search UID, name, email, phone or reference..."
            className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-gray-300 px-4 py-2.5 outline-none focus:border-emerald-600"
          >
            {STATUSES.map((item) => (
              <option key={item} value={item}>
                {item === 'ALL'
                  ? 'All Statuses'
                  : item.replaceAll('_', ' ')}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="rounded-xl bg-emerald-700 px-6 py-2.5 font-semibold text-white transition hover:bg-emerald-800"
          >
            Search
          </button>
        </form>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
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
            <div className="divide-y divide-gray-100">
              {applications.map((application, index) => (
                <div
                  key={application.id}
                  className="grid gap-4 p-5 transition hover:bg-gray-50 lg:grid-cols-[50px_1.4fr_1fr_1fr_auto] lg:items-center"
                >
                  <div className="text-sm font-bold text-gray-400">
                    {String((page - 1) * 15 + index + 1).padStart(2, '0')}
                  </div>

                  <div>
                    <p className="font-bold text-gray-950">
                      {application.applicant_name}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      UID: {application.applicant_uid || '—'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {application.applicant_phone}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-400">
                      Position
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-800">
                      {positionName(application)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {departmentName(application)}
                    </p>
                  </div>

                  <div>
                    <p className="font-mono text-xs text-gray-600">
                      {application.application_reference}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(application.created_at).toLocaleDateString()}
                    </p>
                    <span
                      className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusClass(
                        application.status,
                      )}`}
                    >
                      {application.status.replaceAll('_', ' ')}
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={detailLoading}
                    onClick={() => reviewApplication(application.id)}
                    className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-50"
                  >
                    Review
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t px-4 py-4">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((current) => current - 1)}
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
                onClick={() => setPage((current) => current + 1)}
                className="rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-6"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                  Application Review
                </p>
                <h2 className="mt-1 text-xl font-bold text-gray-950">
                  {selected.applicant_name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-600 hover:bg-gray-200"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="p-5 sm:p-7">
              <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
                <div>
                  <div className="aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
                    {selected.photo_url ? (
                      <img
                        src={selected.photo_url}
                        alt={selected.applicant_name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-400">
                        No photo
                      </div>
                    )}
                  </div>

                  <span
                    className={`mt-4 inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${statusClass(
                      selected.status,
                    )}`}
                  >
                    {selected.status.replaceAll('_', ' ')}
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <DetailItem
                    label="Application Reference"
                    value={selected.application_reference}
                  />
                  <DetailItem
                    label="Website UID"
                    value={selected.applicant_uid}
                  />
                  <DetailItem
                    label="Full Name"
                    value={selected.applicant_name}
                  />
                  <DetailItem
                    label="Phone"
                    value={selected.applicant_phone}
                  />
                  <DetailItem
                    label="Email"
                    value={selected.applicant_email}
                  />
                  <DetailItem
                    label="Address"
                    value={selected.applicant_address}
                  />
                  <DetailItem
                    label="NID"
                    value={selected.applicant_nid}
                  />
                  <DetailItem
                    label="Passport"
                    value={selected.applicant_passport}
                  />
                  <DetailItem
                    label="Vacancy"
                    value={vacancyName(selected)}
                  />
                  <DetailItem
                    label="Department"
                    value={departmentName(selected)}
                  />
                  <DetailItem
                    label="Position"
                    value={positionName(selected)}
                  />
                  <DetailItem
                    label="Applied"
                    value={
                      selected.created_at
                        ? new Date(selected.created_at).toLocaleString()
                        : null
                    }
                  />
                </div>
              </div>

              {selected.cover_letter && (
                <div className="mt-6 rounded-2xl border border-gray-200 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Additional Information
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                    {selected.cover_letter}
                  </p>
                </div>
              )}

              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <label className="block text-sm font-bold text-gray-900">
                  Update Application Status
                </label>

                <p className="mt-1 text-xs leading-5 text-gray-600">
                  Selecting SELECTED will automatically create and publish the Foundation Member profile with this vacancy&apos;s department and position.
                </p>

                <select
                  value={selected.status}
                  disabled={updatingId === selected.id}
                  onChange={(e) =>
                    updateStatus(selected.id, e.target.value)
                  }
                  className="mt-4 w-full rounded-xl border border-emerald-300 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-600 sm:max-w-sm"
                >
                  {STATUSES.filter((item) => item !== 'ALL').map(
                    (item) => (
                      <option key={item} value={item}>
                        {item.replaceAll('_', ' ')}
                      </option>
                    ),
                  )}
                </select>

                {selected.applicant_email ? (
                  <p className="mt-3 text-xs text-emerald-800">
                    Approval email will be sent to {selected.applicant_email}.
                  </p>
                ) : (
                  <p className="mt-3 text-xs text-gray-600">
                    No applicant email was provided. Approval will continue without email notification.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
