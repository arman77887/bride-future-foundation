import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export const DonationMethodsAdmin: React.FC = () => {
  const [methods, setMethods] = useState<any[]>([]);
  const [nameEn, setNameEn] = useState('');
  const [paymentType, setPaymentType] = useState('bkash');
  const [accountIdentifier, setAccountIdentifier] = useState('');

  const fetchMethods = () => {
    api.get('/donation-methods').then((res) => setMethods(res.data.data)).catch(() => {});
  };

  useEffect(() => { fetchMethods(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/donation-methods', {
      name_en: nameEn,
      name_bn: nameEn,
      payment_type: paymentType,
      account_identifier: accountIdentifier,
      is_active: true,
      display_order: methods.length + 1,
    });
    setNameEn('');
    setAccountIdentifier('');
    fetchMethods();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-brand-green">Manage Donation Methods</h1>
      <form onSubmit={handleCreate} className="bg-white p-6 rounded shadow space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium">Method Name</label>
          <input type="text" value={nameEn} onChange={e => setNameEn(e.target.value)} required className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Payment Type</label>
          <input type="text" value={paymentType} onChange={e => setPaymentType(e.target.value)} required className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Account Identifier (Number/IBAN)</label>
          <input type="text" value={accountIdentifier} onChange={e => setAccountIdentifier(e.target.value)} required className="w-full border rounded p-2" />
        </div>
        <button type="submit" className="bg-brand-green text-white px-4 py-2 rounded">Add Method</button>
      </form>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3">Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Identifier</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {methods.map(m => (
              <tr key={m.id} className="border-b">
                <td className="p-3">{m.name_en}</td>
                <td className="p-3">{m.payment_type}</td>
                <td className="p-3">{m.account_identifier}</td>
                <td className="p-3">{m.is_active ? 'Active' : 'Inactive'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
