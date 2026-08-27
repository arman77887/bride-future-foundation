import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export const AdminDonations: React.FC = () => {
  const [donations, setDonations] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});

  const fetchData = () => {
    api.get('/admin/donations').then(res => setDonations(res.data.data)).catch(() => {});
    api.get('/admin/donations/stats').then(res => setStats(res.data)).catch(() => {});
  };

  useEffect(() => { fetchData(); }, []);

  const handleTransition = async (id: string, status: string) => {
    await api.post(`/admin/donations/${id}/transition`, { status, notes: 'Admin status update' });
    fetchData();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-brand-green">Donation Financial Audit Dashboard</h1>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Total Donations</p>
          <p className="text-2xl font-bold">{stats.total_donations || 0}</p>
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
          <p className="text-2xl font-bold">BDT {stats.total_verified_amount || 0}</p>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3">Donor</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Gateway</th>
              <th className="p-3">Transaction ID</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {donations.map(d => (
              <tr key={d.id} className="border-b">
                <td className="p-3">{d.donor_name || 'Anonymous'}</td>
                <td className="p-3">{d.amount} {d.currency}</td>
                <td className="p-3">{d.payment_gateway}</td>
                <td className="p-3">{d.transaction_id}</td>
                <td className="p-3 font-semibold">{d.status}</td>
                <td className="p-3 space-x-2">
                  {d.status === 'PENDING' && (
                    <button onClick={() => handleTransition(d.id, 'UNDER_REVIEW')} className="bg-blue-500 text-white px-2 py-1 rounded text-xs">Review</button>
                  )}
                  {d.status === 'UNDER_REVIEW' && (
                    <button onClick={() => handleTransition(d.id, 'VERIFIED')} className="bg-brand-green text-white px-2 py-1 rounded text-xs">Verify</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
