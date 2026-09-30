'use client';

import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import MediaPicker from '@/components/admin/MediaPicker';

interface Department {
  id: string;
  name_bn?: string;
  name_en?: string;
}

interface Position {
  id: string;
  title_bn?: string;
  title_en?: string;
}

interface Officer {
  id: string;
  official_id: string;
  name: string;
  avatar_media_id?: string | null;
  avatar_url?: string | null;
  status: string;
  is_public: boolean;
  department?: Department;
  position?: Position;
}

interface MemberForm {
  name: string;
  official_id: string;
  department_id: string;
  position_id: string;
  avatar_media_id: string | null;
}

const emptyForm: MemberForm = {
  name: '',
  official_id: '',
  department_id: '',
  position_id: '',
  avatar_media_id: null,
};

export default function OfficersPage() {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [form, setForm] = useState<MemberForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const [remarks, setRemarks] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showDepartmentCreator, setShowDepartmentCreator] = useState(false);
  const [showPositionCreator, setShowPositionCreator] = useState(false);
  const [newDepartmentBn, setNewDepartmentBn] = useState('');
  const [newDepartmentEn, setNewDepartmentEn] = useState('');
  const [newPositionBn, setNewPositionBn] = useState('');
  const [newPositionEn, setNewPositionEn] = useState('');
  const [creatingOption, setCreatingOption] = useState(false);

  const loadOfficers = async () => {
    const response = await api.get('/admin/officers');
    const payload = response?.data?.data;

    if (Array.isArray(payload)) {
      setOfficers(payload);
    } else if (Array.isArray(payload?.data)) {
      setOfficers(payload.data);
    } else {
      setOfficers([]);
    }
  };

  const loadOptions = async () => {
    const response = await api.get('/admin/vacancies/options');
    setDepartments(
      Array.isArray(response?.data?.departments)
        ? response.data.departments
        : []
    );
    setPositions(
      Array.isArray(response?.data?.positions)
        ? response.data.positions
        : []
    );
  };

  const loadAll = async () => {
    try {
      setLoading(true);
      setError('');
      await Promise.all([loadOfficers(), loadOptions()]);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to load members.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMessage('');
    setError('');
    setShowForm(true);
  };

  const openEdit = (officer: Officer) => {
    setEditingId(officer.id);
    setForm({
      name: officer.name || '',
      official_id: officer.official_id || '',
      department_id: officer.department?.id || '',
      position_id: officer.position?.id || '',
      avatar_media_id: officer.avatar_media_id || null,
    });
    setMessage('');
    setError('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const createDepartment = async () => {
    if (!newDepartmentBn.trim() || !newDepartmentEn.trim()) {
      setError('Department-এর বাংলা ও English নাম দিন।');
      return;
    }

    try {
      setCreatingOption(true);
      setError('');

      const response = await api.post('/admin/officers/departments', {
        name_bn: newDepartmentBn.trim(),
        name_en: newDepartmentEn.trim(),
      });

      const created = response?.data?.data as Department;

      setDepartments((current) => [...current, created]);
      setForm((current) => ({
        ...current,
        department_id: created.id,
      }));

      setNewDepartmentBn('');
      setNewDepartmentEn('');
      setShowDepartmentCreator(false);
      setMessage('New department added successfully.');
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Unable to create department.'
      );
    } finally {
      setCreatingOption(false);
    }
  };

  const createPosition = async () => {
    if (!newPositionBn.trim() || !newPositionEn.trim()) {
      setError('Designation-এর বাংলা ও English নাম দিন।');
      return;
    }

    try {
      setCreatingOption(true);
      setError('');

      const response = await api.post('/admin/officers/positions', {
        title_bn: newPositionBn.trim(),
        title_en: newPositionEn.trim(),
      });

      const created = response?.data?.data as Position;

      setPositions((current) => [...current, created]);
      setForm((current) => ({
        ...current,
        position_id: created.id,
      }));

      setNewPositionBn('');
      setNewPositionEn('');
      setShowPositionCreator(false);
      setMessage('New designation added successfully.');
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Unable to create designation.'
      );
    } finally {
      setCreatingOption(false);
    }
  };

  const saveMember = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError('');
      setMessage('');

      const payload = {
        name: form.name.trim(),
        official_id: form.official_id.trim(),
        department_id: form.department_id,
        position_id: form.position_id,
        avatar_media_id: form.avatar_media_id || null,
      };

      if (editingId) {
        await api.put(`/officers/${editingId}`, payload);
        setMessage('Member updated successfully.');
      } else {
        await api.post('/officers', payload);
        setMessage('Member added successfully. Approve it to publish.');
      }

      closeForm();
      await loadOfficers();
    } catch (err: any) {
      const validation = err?.response?.data?.errors;
      const firstValidation = validation
        ? Object.values(validation).flat().find(Boolean)
        : null;

      setError(
        String(
          firstValidation ||
            err?.response?.data?.message ||
            err?.message ||
            'Unable to save member.'
        )
      );
    } finally {
      setSaving(false);
    }
  };

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
          ? 'Member approved and published.'
          : 'Member rejected.'
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Foundation Members
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            সদস্যের ছবি, নাম, বিভাগ ও পদবী পরিচালনা করুন
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-600"
        >
          + Add Member
        </button>
      </div>

      {message && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={saveMember}
          className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {editingId ? 'Edit Member' : 'Add Member'}
            </h2>

            <button
              type="button"
              onClick={closeForm}
              className="text-sm font-semibold text-gray-500 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Member Name
              </label>
              <input
                required
                value={form.name}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    name: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="Member name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Member / Official ID
              </label>
              <input
                required
                value={form.official_id}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    official_id: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="BFF-001"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Department
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setShowDepartmentCreator((current) => !current)
                  }
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-600"
                >
                  {showDepartmentCreator ? 'Cancel' : '+ Add New'}
                </button>
              </div>

              <select
                required
                value={form.department_id}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    department_id: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">Select department</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name_bn ||
                      department.name_en ||
                      department.id}
                  </option>
                ))}
              </select>

              {showDepartmentCreator && (
                <div className="mt-3 space-y-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                  <input
                    value={newDepartmentBn}
                    onChange={(e) => setNewDepartmentBn(e.target.value)}
                    placeholder="বাংলা নাম — যেমন: প্রশাসন বিভাগ"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                  />
                  <input
                    value={newDepartmentEn}
                    onChange={(e) => setNewDepartmentEn(e.target.value)}
                    placeholder="English name — e.g. Administration"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    disabled={creatingOption}
                    onClick={createDepartment}
                    className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-600 disabled:opacity-50"
                  >
                    {creatingOption ? 'Adding...' : 'Add Department'}
                  </button>
                </div>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Designation / Position
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setShowPositionCreator((current) => !current)
                  }
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-600"
                >
                  {showPositionCreator ? 'Cancel' : '+ Add New'}
                </button>
              </div>

              <select
                required
                value={form.position_id}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    position_id: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">Select designation</option>
                {positions.map((position) => (
                  <option key={position.id} value={position.id}>
                    {position.title_bn ||
                      position.title_en ||
                      position.id}
                  </option>
                ))}
              </select>

              {showPositionCreator && (
                <div className="mt-3 space-y-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                  <input
                    value={newPositionBn}
                    onChange={(e) => setNewPositionBn(e.target.value)}
                    placeholder="বাংলা পদবী — যেমন: সভাপতি"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                  />
                  <input
                    value={newPositionEn}
                    onChange={(e) => setNewPositionEn(e.target.value)}
                    placeholder="English designation — e.g. President"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    disabled={creatingOption}
                    onClick={createPosition}
                    className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-600 disabled:opacity-50"
                  >
                    {creatingOption ? 'Adding...' : 'Add Designation'}
                  </button>
                </div>
              )}
            </div>

          </div>

          <MediaPicker
            value={form.avatar_media_id}
            onChange={(mediaId) =>
              setForm((current) => ({
                ...current,
                avatar_media_id: mediaId,
              }))
            }
            label="Member Photo"
            mediaType="logo"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={closeForm}
              className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-600 disabled:opacity-50"
            >
              {saving
                ? 'Saving...'
                : editingId
                  ? 'Update Member'
                  : 'Add Member'}
            </button>
          </div>
        </form>
      )}

      <div className="rounded-xl bg-white p-5 shadow-sm">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Verification remarks
        </label>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          rows={2}
          placeholder="Optional remarks..."
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading members...
          </div>
        ) : officers.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No members found. Click “Add Member” to create the first member.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Member
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    ID
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Department
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Designation
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Status
                  </th>
                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {officers.map((officer) => (
                  <tr key={officer.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {officer.avatar_url ? (
                          <img
                            src={officer.avatar_url}
                            alt={officer.name}
                            className="h-12 w-12 rounded-full object-cover ring-2 ring-emerald-100"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                            {officer.name.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div className="font-semibold text-gray-900">
                          {officer.name}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {officer.official_id}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {officer.department?.name_bn ||
                        officer.department?.name_en ||
                        '-'}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {officer.position?.title_bn ||
                        officer.position?.title_en ||
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
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(officer)}
                          className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          Edit
                        </button>

                        {officer.status !== 'APPROVED' && (
                          <>
                            <button
                              type="button"
                              disabled={processing === officer.id}
                              onClick={() =>
                                verify(officer.id, 'APPROVED')
                              }
                              className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                            >
                              Approve
                            </button>

                            <button
                              type="button"
                              disabled={processing === officer.id}
                              onClick={() =>
                                verify(officer.id, 'REJECTED')
                              }
                              className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </>
                        )}
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
}
