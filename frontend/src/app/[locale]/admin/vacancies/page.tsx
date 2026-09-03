'use client';

import React, { useEffect, useState } from 'react';
import api from '@/services/api';

interface Department {
  id: string;
  name_bn: string;
  name_en: string;
}

interface Position {
  id: string;
  title_bn: string;
  title_en: string;
}

interface Vacancy {
  id: string;
  department_id: string;
  position_id: string;
  required_count: number;
  title_bn: string;
  title_en: string;
  description_bn?: string | null;
  description_en?: string | null;
  requirements?: string | null;
  deadline: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'CANCELLED';
  is_active: boolean;
  application_limit: number | null;
  application_count: number;
  department?: Department;
  position?: Position;
}

interface VacancyForm {
  department_id: string;
  position_id: string;
  required_count: string;
  title_bn: string;
  title_en: string;
  description_bn: string;
  description_en: string;
  requirements: string;
  deadline: string;
  status: Vacancy['status'];
  is_active: boolean;
  application_limit: string;
}

const emptyForm: VacancyForm = {
  department_id: '',
  position_id: '',
  required_count: '1',
  title_bn: '',
  title_en: '',
  description_bn: '',
  description_en: '',
  requirements: '',
  deadline: '',
  status: 'DRAFT',
  is_active: true,
  application_limit: '',
};

export default function VacanciesPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);

  const [form, setForm] = useState<VacancyForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [vacancyResponse, optionsResponse] = await Promise.all([
        api.get('/admin/vacancies'),
        api.get('/admin/vacancies/options'),
      ]);

      const vacancyData = vacancyResponse?.data?.data;
      const optionsData = optionsResponse?.data;

      setVacancies(
        Array.isArray(vacancyData)
          ? vacancyData
          : Array.isArray(vacancyData?.data)
            ? vacancyData.data
            : []
      );

      setDepartments(
        Array.isArray(optionsData?.departments)
          ? optionsData.departments
          : []
      );

      setPositions(
        Array.isArray(optionsData?.positions)
          ? optionsData.positions
          : []
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load vacancies.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const updateField = (
    field: keyof VacancyForm,
    value: string | boolean
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const toDateTimeLocal = (value: string) => {
    if (!value) return '';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value.slice(0, 16);
    }

    const pad = (n: number) => String(n).padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError('');
      setMessage('');

      const payload = {
        department_id: form.department_id,
        position_id: form.position_id,
        required_count: Number(form.required_count),
        title_bn: form.title_bn,
        title_en: form.title_en,
        description_bn: form.description_bn || null,
        description_en: form.description_en || null,
        requirements: form.requirements || null,
        deadline: form.deadline,
        status: form.status,
        is_active: form.is_active,
        application_limit: form.application_limit
          ? Number(form.application_limit)
          : null,
      };

      if (editingId) {
        await api.put(`/vacancies/${editingId}`, payload);
        setMessage('Vacancy updated successfully.');
      } else {
        await api.post('/vacancies', payload);
        setMessage('Vacancy created successfully.');
      }

      resetForm();
      await loadData();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to save vacancy.'
      );
    } finally {
      setSaving(false);
    }
  };

  const editVacancy = (vacancy: Vacancy) => {
    setEditingId(vacancy.id);

    setForm({
      department_id: vacancy.department_id,
      position_id: vacancy.position_id,
      required_count: String(vacancy.required_count ?? 1),
      title_bn: vacancy.title_bn ?? '',
      title_en: vacancy.title_en ?? '',
      description_bn: vacancy.description_bn ?? '',
      description_en: vacancy.description_en ?? '',
      requirements: vacancy.requirements ?? '',
      deadline: toDateTimeLocal(vacancy.deadline),
      status: vacancy.status,
      is_active: Boolean(vacancy.is_active),
      application_limit:
        vacancy.application_limit === null
          ? ''
          : String(vacancy.application_limit),
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const toggleActive = async (vacancy: Vacancy) => {
    try {
      setProcessingId(vacancy.id);
      setError('');
      setMessage('');

      await api.put(`/vacancies/${vacancy.id}`, {
        is_active: !vacancy.is_active,
      });

      setMessage(
        !vacancy.is_active
          ? 'Vacancy activated successfully.'
          : 'Vacancy deactivated successfully.'
      );

      await loadData();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to change vacancy status.'
      );
    } finally {
      setProcessingId(null);
    }
  };

  const deleteVacancy = async (vacancy: Vacancy) => {
    const confirmed = window.confirm(
      vacancy.application_count > 0
        ? 'This vacancy already has applications and cannot be deleted. Please deactivate or close it instead.'
        : `Delete "${vacancy.title_en}" permanently?`
    );

    if (!confirmed || vacancy.application_count > 0) {
      return;
    }

    try {
      setProcessingId(vacancy.id);
      setError('');
      setMessage('');

      await api.delete(`/vacancies/${vacancy.id}`);

      setMessage('Vacancy deleted successfully.');

      if (editingId === vacancy.id) {
        resetForm();
      }

      await loadData();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to delete vacancy.'
      );
    } finally {
      setProcessingId(null);
    }
  };

  const statusClass = (status: Vacancy['status']) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-700';
      case 'CLOSED':
        return 'bg-gray-200 text-gray-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="bff-page space-y-6">
      <div className="bff-fade">
        <h1 className="text-3xl font-bold text-gray-900">
          Vacancies
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          চাকরির বিজ্ঞপ্তি তৈরি, সম্পাদনা ও আবেদন ব্যবস্থাপনা
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

      <form
        onSubmit={submit}
        className="bff-card rounded-xl bg-white p-6 shadow-sm"
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {editingId ? 'Edit Vacancy' : 'Create Vacancy'}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {editingId
                ? 'চাকরির বিজ্ঞপ্তির তথ্য পরিবর্তন করুন'
                : 'নতুন চাকরির বিজ্ঞপ্তি তৈরি করুন'}
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bff-button rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Department
            </label>

            <select
              required
              value={form.department_id}
              onChange={(e) =>
                updateField('department_id', e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">Select department</option>

              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name_en} / {department.name_bn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Position
            </label>

            <select
              required
              value={form.position_id}
              onChange={(e) =>
                updateField('position_id', e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">Select position</option>

              {positions.map((position) => (
                <option key={position.id} value={position.id}>
                  {position.title_en} / {position.title_bn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Title (বাংলা)
            </label>

            <input
              required
              value={form.title_bn}
              onChange={(e) =>
                updateField('title_bn', e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Title (English)
            </label>

            <input
              required
              value={form.title_en}
              onChange={(e) =>
                updateField('title_en', e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Required Number / প্রয়োজনীয় জনবল
            </label>

            <input
              required
              type="number"
              min="1"
              value={form.required_count}
              onChange={(e) =>
                updateField('required_count', e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Application Limit / সর্বোচ্চ আবেদন
            </label>

            <input
              type="number"
              min="1"
              value={form.application_limit}
              onChange={(e) =>
                updateField('application_limit', e.target.value)
              }
              placeholder="Blank = Unlimited"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />

            <p className="mt-1 text-xs text-gray-500">
              খালি রাখলে যতজন খুশি আবেদন করতে পারবে।
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Application Deadline / আবেদনের শেষ তারিখ
            </label>

            <input
              required
              type="datetime-local"
              value={form.deadline}
              onChange={(e) =>
                updateField('deadline', e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Status
            </label>

            <select
              value={form.status}
              onChange={(e) =>
                updateField(
                  'status',
                  e.target.value as Vacancy['status']
                )
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="CLOSED">Closed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Description (বাংলা)
            </label>

            <textarea
              rows={4}
              value={form.description_bn}
              onChange={(e) =>
                updateField('description_bn', e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Description (English)
            </label>

            <textarea
              rows={4}
              value={form.description_en}
              onChange={(e) =>
                updateField('description_en', e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Requirements / যোগ্যতা
            </label>

            <textarea
              rows={5}
              value={form.requirements}
              onChange={(e) =>
                updateField('requirements', e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="flex items-center gap-3 md:col-span-2">
            <input
              id="vacancy-active"
              type="checkbox"
              checked={form.is_active}
              onChange={(e) =>
                updateField('is_active', e.target.checked)
              }
              className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />

            <label
              htmlFor="vacancy-active"
              className="text-sm font-semibold text-gray-700"
            >
              Active / সক্রিয়
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bff-button rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {saving
              ? 'Saving...'
              : editingId
                ? 'Update Vacancy'
                : 'Create Vacancy'}
          </button>
        </div>
      </form>

      <div className="bff-card overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-xl font-bold text-gray-900">
            All Vacancies
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            সকল চাকরির বিজ্ঞপ্তি ও আবেদন সংখ্যা
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading vacancies...
          </div>
        ) : vacancies.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No vacancies found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Vacancy
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Department / Position
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Applications
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Deadline
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
                {vacancies.map((vacancy) => {
                  const hasApplications =
                    vacancy.application_count > 0;

                  return (
                    <tr
                      key={vacancy.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <div className="font-semibold text-gray-900">
                          {vacancy.title_en}
                        </div>

                        <div className="text-sm text-gray-500">
                          {vacancy.title_bn}
                        </div>

                        <div className="mt-1 text-xs text-gray-400">
                          Required: {vacancy.required_count}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        <div>
                          {vacancy.department?.name_en ||
                            vacancy.department?.name_bn ||
                            '-'}
                        </div>

                        <div className="text-xs text-gray-500">
                          {vacancy.position?.title_en ||
                            vacancy.position?.title_bn ||
                            '-'}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="text-sm font-semibold text-gray-800">
                          {vacancy.application_count}
                          {' / '}
                          {vacancy.application_limit ?? '∞'}
                        </div>

                        <div className="text-xs text-gray-500">
                          {vacancy.application_limit === null
                            ? 'Unlimited'
                            : 'Limit'}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {new Date(
                          vacancy.deadline
                        ).toLocaleString()}
                      </td>

                      <td className="px-5 py-4">
                        <div className="space-y-2">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                              vacancy.status
                            )}`}
                          >
                            {vacancy.status}
                          </span>

                          <div>
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                vacancy.is_active
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {vacancy.is_active
                                ? 'ACTIVE'
                                : 'INACTIVE'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-wrap justify-end gap-2">
                          <button
                            type="button"
                            disabled={
                              processingId === vacancy.id
                            }
                            onClick={() =>
                              toggleActive(vacancy)
                            }
                            className={`bff-button rounded-lg px-3 py-2 text-xs font-semibold text-white disabled:opacity-50 ${
                              vacancy.is_active
                                ? 'bg-orange-500 hover:bg-orange-600'
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            {vacancy.is_active
                              ? 'Deactivate'
                              : 'Activate'}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              editVacancy(vacancy)
                            }
                            className="bff-button rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            disabled={
                              processingId === vacancy.id ||
                              hasApplications
                            }
                            onClick={() =>
                              deleteVacancy(vacancy)
                            }
                            title={
                              hasApplications
                                ? 'Cannot delete a vacancy with applications'
                                : 'Delete vacancy'
                            }
                            className="bff-button rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Delete
                          </button>
                        </div>

                        {hasApplications && (
                          <div className="mt-2 text-right text-xs text-orange-600">
                            Has applications — deactivate instead
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
