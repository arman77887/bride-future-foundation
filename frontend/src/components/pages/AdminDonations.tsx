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
}

interface DonationStats {
  total_donations?: number;
  pending?: number;
  verified?: number;
  total_verified_amount?: string | number;
}

export const AdminDonations: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<DonationStats>({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [donationsResponse, statsResponse] = await Promise.all([
        api.get('/admin/donations'),
        api.get('/admin/donations/stats'),
      ]);

      setDonations(donationsResponse.data.data || []);
      setStats(statsResponse.data || {});
    } catch (error) {
      console.error('Failed to load donations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTransition = async (id: string, status: string) => {
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-brand-green">
        Donation Financial Audit Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Total Donations</p>
          <p className="text-2xl font-bold">
            {stats.total_donations || 0}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold">{stats.pending || 0}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Verified</p>
          <p className="text-2xl font-bold">{stats.verified || 0}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Verified Amount</p>
          <p className="text-2xl font-bold">
            {stats.total_verified_amount || 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Statistics returned by the server
          </p>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-gray-500">Loading donations...</div>
        ) : donations.length === 0 ? (
          <div className="p-6 text-gray-500">No donations found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-3">Donor</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Donation Method</th>
                  <th className="p-3">Transaction ID</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {donations.map((donation) => (
                  <tr key={donation.id} className="border-b">
                    <td className="p-3">
                      {donation.donor_name || 'Anonymous'}
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
                      {donation.transaction_id}
                    </td>

                    <td className="p-3 font-semibold">
                      {donation.status}
                    </td>

                    <td className="p-3 text-sm text-gray-600">
                      {new Date(donation.created_at).toLocaleString()}
                    </td>

                    <td className="p-3 space-x-2 whitespace-nowrap">
                      {donation.status === 'PENDING' && (
                        <button
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
