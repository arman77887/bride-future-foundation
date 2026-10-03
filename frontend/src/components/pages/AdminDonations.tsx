'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';

interface DonationMethod {
  id: string;
  name_bn: string;
  name_en: string;
  type: string;
  account_identifier: string;
}

interface Project {
  id: string;
  title_bn: string;
  title_en: string;
  slug: string;
  status: string;
}

interface Donation {
  id: string;
  donor_name: string | null;
  amount: string;
  currency: string;
  transaction_id: string;
  sender_info: string | null;
  screenshot_path: string | null;
  status: string;
  created_at: string;
  donation_method?: DonationMethod | null;
  project?: Project | null;
}

interface DonationStats {
  total_donations?: number;
  pending?: number;
  verified?: number;
  verified_amounts?: {
    BDT?: string | number;
    USD?: string | number;
  };
}

export const AdminDonations: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<DonationStats>({});
  const [loading, setLoading] = useState(true);
  const [fundFilter, setFundFilter] = useState('ALL');
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const params: Record<string, string> = {};

      if (fundFilter === 'GENERAL') {
        params.fund = 'general';
      } else if (fundFilter !== 'ALL') {
        params.project_id = fundFilter;
      }

      const [donationsResponse, statsResponse] = await Promise.all([
        api.get('/admin/donations', { params }),
        api.get('/admin/donations/stats', { params }),
      ]);

      setDonations(donationsResponse.data.data || []);
      setStats(statsResponse.data || {});
    } catch (error) {
      console.error('Failed to load donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      let page = 1;
      let lastPage = 1;
      const allProjects: Project[] = [];

      do {
        const response = await api.get('/projects', {
          params: { page },
        });

        const data = response.data;
        const pageProjects = Array.isArray(data?.data)
          ? data.data
          : [];

        allProjects.push(
          ...pageProjects.filter(
            (project: Project) => project.status === 'ACTIVE'
          )
        );

        lastPage = Number(data?.meta?.last_page || 1);
        page += 1;
      } while (page <= lastPage);

      setProjects(allProjects);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchData();
  }, [fundFilter]);

  const handleExport = async () => {
    try {
      const params: Record<string, string> = {};

      if (fundFilter === 'GENERAL') {
        params.fund = 'general';
      } else if (fundFilter !== 'ALL') {
        params.project_id = fundFilter;
      }

      const response = await api.get('/admin/donations/export', {
        params,
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: 'text/csv;charset=utf-8',
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = `donations-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export donations:', error);
      alert('Failed to export donations.');
    }
  };

  const handleTransition = async (
    id: string,
    status: string
  ) => {
    try {
      await api.post(`/admin/donations/${id}/transition`, {
        status,
        notes: 'Admin status update',
      });

      await fetchData();
    } catch (error) {
      console.error('Failed to update donation status:', error);
      alert('Failed to update donation status.');
    }
  };

  const handleViewEvidence = async (donation: Donation) => {
    try {
      const response = await api.get(
        `/admin/donations/${donation.id}/evidence`
      );

      const signedUrl =
        response.data?.signed_url ||
        response.data?.data?.signed_url;

      if (!signedUrl) {
        alert('Evidence URL was not returned by the server.');
        return;
      }

      window.open(signedUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Failed to load donation evidence:', error);
      alert('Failed to load donation evidence.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-green">
          Donation Financial Audit Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Review General Fund and project-specific donations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">
            Total Donations
          </p>
          <p className="text-2xl font-bold">
            {stats.total_donations || 0}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold">
            {stats.pending || 0}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Verified</p>
          <p className="text-2xl font-bold">
            {stats.verified || 0}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">
            Verified Amount
          </p>

          <div className="mt-1 space-y-1">
            <p className="text-xl font-bold">
              ৳{stats.verified_amounts?.BDT || 0} BDT
            </p>
            <p className="text-xl font-bold">
              ${stats.verified_amounts?.USD || 0} USD
            </p>
          </div>

          <p className="text-xs text-gray-500 mt-1">
            Verified donations by currency
          </p>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="w-full max-w-md">
            <label
              htmlFor="fund-filter"
              className="block text-sm font-medium text-gray-700"
            >
              Fund / Project
            </label>

            <select
              id="fund-filter"
              value={fundFilter}
              onChange={(e) => setFundFilter(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2"
            >
              <option value="ALL">
                All Donations
              </option>

              <option value="GENERAL">
                Bright Future Foundation — General Donation
              </option>

              {projects.map((project) => (
                <option
                  key={project.id}
                  value={project.id}
                >
                  {project.title_en || project.title_bn}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="rounded-md bg-brand-green px-5 py-2 text-white font-medium hover:opacity-90"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-gray-500">
            Loading donations...
          </div>
        ) : donations.length === 0 ? (
          <div className="p-6 text-gray-500">
            No donations found for this fund/project.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-3">Donor</th>
                  <th className="p-3">Fund / Project</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Donation Method</th>
                  <th className="p-3">Sender Number</th>
                  <th className="p-3">Transaction ID</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {donations.map((donation) => (
                  <tr
                    key={donation.id}
                    className="border-b"
                  >
                    <td className="p-3">
                      {donation.donor_name || 'Anonymous'}
                    </td>

                    <td className="p-3">
                      {donation.project ? (
                        <div>
                          <div className="font-medium text-gray-900">
                            {donation.project.title_en ||
                              donation.project.title_bn}
                          </div>

                          <div className="text-xs text-gray-500">
                            Project Donation
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium text-brand-green">
                            General Donation
                          </div>

                          <div className="text-xs text-gray-500">
                            Bright Future Foundation
                          </div>
                        </div>
                      )}
                    </td>

                    <td className="p-3 font-medium">
                      {donation.amount} {donation.currency}
                    </td>

                    <td className="p-3">
                      {donation.donation_method?.name_en ||
                        donation.donation_method?.name_bn ||
                        '-'}
                    </td>

                    <td className="p-3 font-mono text-sm">
                      {donation.sender_info || '-'}
                    </td>

                    <td className="p-3 font-mono text-sm">
                      {donation.transaction_id}
                    </td>

                    <td className="p-3 font-semibold">
                      {donation.status}
                    </td>

                    <td className="p-3 text-sm text-gray-600">
                      {new Date(
                        donation.created_at
                      ).toLocaleString()}
                    </td>

                    <td className="p-3 space-x-2 whitespace-nowrap">
                      {donation.screenshot_path &&
                        donation.screenshot_path !== 'none' && (
                          <button
                            type="button"
                            onClick={() =>
                              handleViewEvidence(donation)
                            }
                            className="bg-gray-700 hover:bg-gray-800 text-white px-2 py-1 rounded text-xs"
                          >
                            View Evidence
                          </button>
                        )}

                      {donation.status === 'PENDING' && (
                        <button
                          type="button"
                          onClick={() =>
                            handleTransition(
                              donation.id,
                              'UNDER_REVIEW'
                            )
                          }
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Review
                        </button>
                      )}

                      {donation.status === 'UNDER_REVIEW' && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              handleTransition(
                                donation.id,
                                'VERIFIED'
                              )
                            }
                            className="bg-brand-green hover:opacity-90 text-white px-2 py-1 rounded text-xs"
                          >
                            Verify
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleTransition(
                                donation.id,
                                'REJECTED'
                              )
                            }
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {donation.status === 'VERIFIED' && (
                        <button
                          type="button"
                          onClick={() =>
                            handleTransition(
                              donation.id,
                              'REVERSED'
                            )
                          }
                          className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Reverse
                        </button>
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
};
