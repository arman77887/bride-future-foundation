'use client';

import React, { useEffect, useState } from 'react';
import MediaPicker from '@/components/admin/MediaPicker';
import api from '@/services/api';

interface ProjectItem {
  id: string;
  title_bn: string;
  title_en: string;
  slug: string;
  description_bn: string;
  description_en: string;
  status: string;
  cover_media_id?: string | null;
  cover_image_url?: string | null;
}

interface ProjectForm {
  title_bn: string;
  title_en: string;
  slug: string;
  description_bn: string;
  description_en: string;
  status: string;
  cover_media_id: string | null;
}

const emptyForm: ProjectForm = {
  title_bn: '',
  title_en: '',
  slug: '',
  description_bn: '',
  description_en: '',
  status: 'ACTIVE',
  cover_media_id: null,
};

export default function ProjectsPage() {
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/projects');
      const payload = response?.data?.data;

      if (Array.isArray(payload)) {
        setItems(payload);
      } else if (Array.isArray(payload?.data)) {
        setItems(payload.data);
      } else {
        setItems([]);
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to load projects.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const updateField = (
    field: keyof ProjectForm,
    value: string | null
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const editProject = (item: ProjectItem) => {
    setEditingId(item.id);

    setForm({
      title_bn: item.title_bn || '',
      title_en: item.title_en || '',
      slug: item.slug || '',
      description_bn: item.description_bn || '',
      description_en: item.description_en || '',
      status: item.status || 'ACTIVE',
      cover_media_id: item.cover_media_id || null,
    });

    setMessage('');
    setError('');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage('');
      setError('');

      const payload = {
        ...form,
        cover_media_id: form.cover_media_id || null,
      };

      if (editingId) {
        await api.put(`/projects/${editingId}`, payload);
        setMessage('Project updated successfully.');
      } else {
        await api.post('/projects', payload);
        setMessage('Project created successfully.');
      }

      resetForm();
      await loadProjects();
    } catch (err: any) {
      const validation = err?.response?.data?.errors;

      if (validation) {
        const first = Object.values(validation)
          .flat()
          .find(Boolean);

        setError(String(first || 'Validation failed.'));
      } else {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            'Failed to save project.'
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this project?'
      )
    ) {
      return;
    }

    try {
      setError('');
      setMessage('');

      await api.delete(`/projects/${id}`);

      setMessage('Project deleted successfully.');

      if (editingId === id) {
        resetForm();
      }

      await loadProjects();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to delete project.'
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Project Management
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Create, edit, delete and manage project cover images.
        </p>
      </div>

      {(message || error) && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            error
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-green-200 bg-green-50 text-green-700'
          }`}
        >
          {error || message}
        </div>
      )}

      <form
        onSubmit={saveProject}
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {editingId ? 'Edit Project' : 'Create Project'}
            </h2>

            <p className="text-sm text-gray-500">
              {editingId
                ? 'Update the selected project.'
                : 'Add a new project.'}
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Title (Bangla)
            </label>

            <input
              value={form.title_bn}
              onChange={(e) =>
                updateField('title_bn', e.target.value)
              }
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-emerald-500"
              placeholder="প্রকল্পের শিরোনাম"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Title (English)
            </label>

            <input
              value={form.title_en}
              onChange={(e) =>
                updateField('title_en', e.target.value)
              }
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-emerald-500"
              placeholder="Project title"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Slug
            </label>

            <input
              value={form.slug}
              onChange={(e) =>
                updateField('slug', e.target.value)
              }
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-emerald-500"
              placeholder="project-slug"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Status
            </label>

            <select
              value={form.status}
              onChange={(e) =>
                updateField('status', e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-emerald-500"
            >
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description (Bangla)
            </label>

            <textarea
              value={form.description_bn}
              onChange={(e) =>
                updateField(
                  'description_bn',
                  e.target.value
                )
              }
              rows={8}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-emerald-500"
              placeholder="প্রকল্পের বিস্তারিত বিবরণ"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description (English)
            </label>

            <textarea
              value={form.description_en}
              onChange={(e) =>
                updateField(
                  'description_en',
                  e.target.value
                )
              }
              rows={8}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-emerald-500"
              placeholder="Full project description"
            />
          </div>

          <MediaPicker
            value={form.cover_media_id}
            onChange={(mediaId) =>
              updateField('cover_media_id', mediaId)
            }
            label="Project Cover Image"
          />
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? 'Saving...'
              : editingId
                ? 'Update Project'
                : 'Create Project'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Existing Projects
          </h2>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-gray-500">
            Loading projects...
          </div>
        ) : items.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">
            No projects found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Image
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Project
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4">
                      {item.cover_image_url ? (
                        <img
                          src={item.cover_image_url}
                          alt={item.title_en}
                          className="h-16 w-24 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-24 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                          No image
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {item.title_en}
                      </div>

                      <div className="mt-1 text-sm text-gray-500">
                        {item.title_bn}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                        {item.status || 'ACTIVE'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => editProject(item)}
                          className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteProject(item.id)
                          }
                          className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
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
}
