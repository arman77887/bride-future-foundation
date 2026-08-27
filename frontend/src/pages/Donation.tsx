import React, { useState } from 'react';
import { api } from '../services/api';

export const Donation: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [success, setSuccess] = useState(false);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/donations', {
        amount: parseFloat(amount),
        currency: 'BDT',
        payment_gateway: 'sslcommerz',
        transaction_id: 'TXN-' + Math.random().toString(36.substring(2, 9)).toUpperCase(),
        donor_name: donorName,
      });
      setSuccess(true);
    } catch (err) {}
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow border border-gray-100 mt-12">
      <h2 className="text-2xl font-bold text-center mb-6 text-brand-green">Make a Donation</h2>
      {success ? (
        <div className="bg-green-50 text-brand-green p-4 rounded text-center font-medium">
          Thank you for your generous contribution!
        </div>
      ) : (
        <form onSubmit={handleDonate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input type="text" value={donorName} onChange={(e) => setDonorName(e.target.value)} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (BDT)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required min="1" className="w-full border rounded p-2" />
          </div>
          <button type="submit" className="w-full bg-brand-gold text-gray-900 py-2 rounded font-semibold hover:opacity-90">
            Proceed to Payment
          </button>
        </form>
      )}
    </div>
  );
};
