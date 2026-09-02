'use client';

import React, { useEffect, useState } from 'react';
import api from '@/services/api';

interface Officer {
  id: string;
  official_id: string;
  name: string;
  status: string;
  is_public: boolean;
  email_personal?: string;
  phone?: string;
  department?: {
    id?: string;
    name_bn?: string;
    name_en?: string;
  };
  position?: {
    id?: string;
    title_bn?: string;
    title_en?: string;
  };
  created_at?: string;
}

export default function OfficersPage() {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);
  const [remarks, setRemarks] = useState('');

  const loadOfficers = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/admin/officers');

      const data = response?.data?.data;

      if (Array.isArray(data)) {
        setOfficers(data);
      } else if (Array.isArray(data?.data)) {
        setOfficers(data.data);
      } else {
        setOfficers([]);
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load officers.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOfficers();
  }, []);

  const verify = async (
    id: string,
    status: 'APPROVED' | 'REJECTED'
  ) => {
    try {
      setProcessing(id);
      setError('');
      setMessage('');

      await api.post(`/officers/${id}/verify`, {
        status,
        remarks: remarks || null,
      });

      setRemarks('');
      setMessage(
        status === 'APPROVED'
          ? 'Officer approved successfully.'
          : 'Officer rejected successfully.'
      );

      await loadOfficers();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Verification failed.'
      );
    } finally {
      setProcessing(null);
    }
  };

  const statusClass = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-700';

      case 'REJECTED':
        return 'bg-red-100 text-red-700';

      case 'UNDER_REVIEW':
        return 'bg-yellow-100 text-yellow-700';

      case 'SUSPENDED':
        return 'bg-gray-200 text-gray-700';

      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Officers
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          কর্মকর্তা যাচাই ও ব্যবস্থাপনা
        </p>
      </div>

      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl bg-white p-5 shadow-sm">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Verification remarks
        </label>

        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          rows={3}
          placeholder="Optional remarks..."
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading officers...
          </div>
        ) : officers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No officers found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Officer
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Official ID
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Department
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Position
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {officers.map((officer) => (
                  <tr
                    key={officer.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-900">
                        {officer.name}
                      </div>

                      <div className="text-xs text-gray-500">
                        {officer.email_personal || officer.phone || ''}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {officer.official_id}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {officer.department?.name_en ||
                        officer.department?.name_bn ||
                        '-'}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {officer.position?.title_en ||
                        officer.position?.title_bn ||
                        '-'}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                          officer.status
                        )}`}
                      >
                        {officer.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {officer.status === 'APPROVED' ? (
                        <span className="text-sm font-medium text-green-600">
                          Public
                        </span>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            disabled={processing === officer.id}
                            onClick={() =>
                              verify(
                                officer.id,
                                'APPROVED'
                              )
                            }
                            className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                          >
                            Approve
                          </button>

                          <button
                            type="button"
                            disabled={processing === officer.id}
                            onClick={() =>
                              verify(
                                officer.id,
                                'REJECTED'
                              )
                            }
                            className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
