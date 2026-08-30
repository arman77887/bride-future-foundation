'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';

interface DonationMethod {
  id: string;
  name_bn: string;
  name_en: string;
  type: string;
  account_identifier: string;
  instructions_bn: string | null;
  instructions_en: string | null;
  is_active: boolean;
  display_order: number;
}

const emptyForm = {
  name_bn: '',
  name_en: '',
  type: 'BKASH',
  account_identifier: '',
  instructions_bn: '',
  instructions_en: '',
  is_active: true,
  display_order: 0,
};

export const DonationMethodsAdmin: React.FC = () => {
  const [methods, setMethods] = useState<DonationMethod[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchMethods = async () => {
    try {
      const response = await api.get('/donation-methods');
      setMethods(response.data.data || []);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Unable to load donation methods.'
      );
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const updateField = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      ...emptyForm,
      display_order: methods.length + 1,
    });
    setEditingId(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        name_bn: form.name_bn,
        name_en: form.name_en,
        type: form.type,
        account_identifier: form.account_identifier,
        instructions_bn: form.instructions_bn || null,
        instructions_en: form.instructions_en || null,
        is_active: form.is_active,
        display_order: Number(form.display_order),
      };

      if (editingId) {
        await api.put(`/donation-methods/${editingId}`, payload);
        setSuccess('Donation method updated successfully.');
      } else {
        await api.post('/donation-methods', payload);
        setSuccess('Donation method added successfully.');
      }

      await fetchMethods();
      resetForm();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Unable to save donation method.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (method: DonationMethod) => {
    setEditingId(method.id);

    setForm({
      name_bn: method.name_bn || '',
      name_en: method.name_en || '',
      type: method.type || 'BKASH',
      account_identifier: method.account_identifier || '',
      instructions_bn: method.instructions_bn || '',
      instructions_en: method.instructions_en || '',
      is_active: method.is_active,
      display_order: method.display_order ?? 0,
    });

    setError('');
    setSuccess('');
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleToggle = async (method: DonationMethod) => {
    try {
      setError('');
      setSuccess('');

      await api.put(`/donation-methods/${method.id}`, {
        is_active: !method.is_active,
      });

      setSuccess(
        !method.is_active
          ? 'Donation method activated.'
          : 'Donation method deactivated.'
      );

      await fetchMethods();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Unable to update status.'
      );
    }
  };

  const handleDelete = async (method: DonationMethod) => {
    const confirmed = window.confirm(
      `Delete "${method.name_en}" donation method?`
    );

    if (!confirmed) return;

    try {
      setError('');
      setSuccess('');

      await api.delete(`/donation-methods/${method.id}`);

      setSuccess('Donation method deleted successfully.');

      if (editingId === method.id) {
        resetForm();
      }

      await fetchMethods();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Unable to delete donation method.'
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-green">
          Donation Methods
        </h1>

        <p className="mt-1 text-gray-500">
          Add and manage bKash, Nagad, Rocket, Bank Transfer and other
          donation methods.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {editingId ? 'Edit Donation Method' : 'Add Donation Method'}
          </h2>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name (English)
            </label>

            <input
              type="text"
              required
              value={form.name_en}
              onChange={(e) =>
                updateField('name_en', e.target.value)
              }
              placeholder="bKash"
              className="mt-1 w-full rounded-md border border-gray-300 p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name (বাংলা)
            </label>

            <input
              type="text"
              required
              value={form.name_bn}
              onChange={(e) =>
                updateField('name_bn', e.target.value)
              }
              placeholder="বিকাশ"
              className="mt-1 w-full rounded-md border border-gray-300 p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment Type
            </label>

            <select
              value={form.type}
              onChange={(e) =>
                updateField('type', e.target.value)
              }
              className="mt-1 w-full rounded-md border border-gray-300 p-2"
            >
              <option value="BKASH">bKash</option>
              <option value="NAGAD">Nagad</option>
              <option value="ROCKET">Rocket</option>
              <option value="BANK">Bank Transfer</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Account Number / IBAN
            </label>

            <input
              type="text"
              required
              value={form.account_identifier}
              onChange={(e) =>
                updateField('account_identifier', e.target.value)
              }
              placeholder="01XXXXXXXXX / IBAN"
              className="mt-1 w-full rounded-md border border-gray-300 p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Display Order
            </label>

            <input
              type="number"
              min="0"
              value={form.display_order}
              onChange={(e) =>
                updateField(
                  'display_order',
                  Number(e.target.value)
                )
              }
              className="mt-1 w-full rounded-md border border-gray-300 p-2"
            />
          </div>

          <div className="flex items-center gap-3 pt-7">
            <input
              id="donation-active"
              type="checkbox"
              checked={form.is_active}
              onChange={(e) =>
                updateField('is_active', e.target.checked)
              }
              className="h-4 w-4"
            />

            <label
              htmlFor="donation-active"
              className="text-sm font-medium text-gray-700"
            >
              Active
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Instructions (বাংলা)
          </label>

          <textarea
            rows={3}
            value={form.instructions_bn}
            onChange={(e) =>
              updateField('instructions_bn', e.target.value)
            }
            placeholder="এই নম্বরে Send Money করুন।"
            className="mt-1 w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Instructions (English)
          </label>

          <textarea
            rows={3}
            value={form.instructions_en}
            onChange={(e) =>
              updateField('instructions_en', e.target.value)
            }
            placeholder="Please send your donation to this account."
            className="mt-1 w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-green text-white px-5 py-2 rounded-md font-medium disabled:opacity-50"
          >
            {loading
              ? 'Saving...'
              : editingId
              ? 'Update Method'
              : 'Add Method'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="border border-gray-300 px-5 py-2 rounded-md"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Existing Donation Methods
          </h2>
        </div>

        {methods.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No donation methods found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Account / Number</th>
                  <th className="p-3">Order</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {methods.map((method) => (
                  <tr
                    key={method.id}
                    className="border-b last:border-b-0"
                  >
                    <td className="p-3">
                      <div className="font-medium">
                        {method.name_en}
                      </div>

                      <div className="text-sm text-gray-500">
                        {method.name_bn}
                      </div>
                    </td>

                    <td className="p-3">
                      {method.type}
                    </td>

                    <td className="p-3 font-mono">
                      {method.account_identifier}
                    </td>

                    <td className="p-3">
                      {method.display_order}
                    </td>

                    <td className="p-3">
                      <span
                        className={
                          method.is_active
                            ? 'text-green-600 font-semibold'
                            : 'text-gray-500 font-semibold'
                        }
                      >
                        {method.is_active
                          ? 'Active'
                          : 'Inactive'}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(method)}
                          className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggle(method)}
                          className="bg-gray-700 text-white px-3 py-1.5 rounded text-sm"
                        >
                          {method.is_active
                            ? 'Disable'
                            : 'Activate'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(method)}
                          className="bg-red-600 text-white px-3 py-1.5 rounded text-sm"
                        >
                          Delete
                        </button>
                      </div>
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
