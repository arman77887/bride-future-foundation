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
  const [formOpen, setFormOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

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
    setFormOpen(true);
    setOpenMenuId(null);

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
      setFormOpen(false);
      setOpenMenuId(null);
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
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
              Content Management
            </span>

            <h1 className="mt-3 text-2xl font-black text-gray-950 sm:text-3xl">
              Project Management
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Create and manage foundation projects and cover images.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              resetForm();
              setFormOpen(true);
              setOpenMenuId(null);
              setMessage('');
              setError('');
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800"
          >
            <span className="text-xl leading-none">+</span>
            Add New Project
          </button>
        </div>
      </section>

      {(message || error) && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm font-medium ${
            error
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          {error || message}
        </div>
      )}

      {formOpen && (
        <form
          onSubmit={saveProject}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7"
        >
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-gray-900">
                {editingId ? 'Edit Project' : 'Add New Project'}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {editingId
                  ? 'Update the selected project.'
                  : 'Enter the project information below.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                resetForm();
                setFormOpen(false);
                setOpenMenuId(null);
              }}
              className="self-start rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              Close
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Title (Bangla)
              </label>

              <input
                value={form.title_bn}
                onChange={(e) => updateField('title_bn', e.target.value)}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="প্রকল্পের শিরোনাম"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Title (English)
              </label>

              <input
                value={form.title_en}
                onChange={(e) => updateField('title_en', e.target.value)}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="Project title"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Slug
              </label>

              <input
                value={form.slug}
                onChange={(e) => updateField('slug', e.target.value)}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="project-slug"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Status
              </label>

              <select
                value={form.status}
                onChange={(e) => updateField('status', e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Description (Bangla)
              </label>

              <textarea
                value={form.description_bn}
                onChange={(e) =>
                  updateField('description_bn', e.target.value)
                }
                rows={7}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="প্রকল্পের বিস্তারিত বিবরণ"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Description (English)
              </label>

              <textarea
                value={form.description_en}
                onChange={(e) =>
                  updateField('description_en', e.target.value)
                }
                rows={7}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="Full project description"
              />
            </div>

            <div className="md:col-span-2">
              <MediaPicker
                value={form.cover_media_id}
                existingUrl={
                  editingId
                    ? items.find((item) => item.id === editingId)
                        ?.cover_image_url || null
                    : null
                }
                onChange={(mediaId) =>
                  updateField('cover_media_id', mediaId)
                }
                label="Project Cover Image"
                mediaType="cover"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? 'Saving...'
                : editingId
                  ? 'Update Project'
                  : 'Create Project'}
            </button>

            <button
              type="button"
              onClick={() => {
                resetForm();
                setFormOpen(false);
                setOpenMenuId(null);
              }}
              disabled={saving}
              className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <section className="overflow-visible rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-5">
          <h2 className="text-lg font-bold text-gray-900">
            Existing Projects
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            {items.length} project{items.length === 1 ? '' : 's'}
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-sm text-gray-500">
            Loading projects...
          </div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-semibold text-gray-700">
              No projects found.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Use Add New Project to create the first project.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="w-20 px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                    #
                  </th>

                  <th className="w-28 px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                    Image
                  </th>

                  <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                    Project
                  </th>

                  <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                    Status
                  </th>

                  <th className="w-20 px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-gray-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {items.map((item, index) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-gray-50/80"
                  >
                    <td className="px-6 py-4">
                      <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-gray-100 px-2 text-xs font-bold text-gray-500">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      {item.cover_image_url ? (
                        <img
                          src={item.cover_image_url}
                          alt={item.title_en || item.title_bn}
                          className="h-14 w-20 rounded-xl border border-gray-100 object-cover shadow-sm"
                        />
                      ) : (
                        <div className="flex h-14 w-20 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 text-[10px] font-medium text-gray-400">
                          No image
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <div className="max-w-xl">
                        <p className="font-bold text-gray-900">
                          {item.title_en || 'Untitled'}
                        </p>

                        <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                          {item.title_bn || '—'}
                        </p>

                        <p className="mt-1 font-mono text-[11px] text-gray-400">
                          /{item.slug}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                          item.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700'
                            : item.status === 'COMPLETED'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            item.status === 'ACTIVE'
                              ? 'bg-emerald-500'
                              : item.status === 'COMPLETED'
                                ? 'bg-blue-500'
                                : 'bg-gray-400'
                          }`}
                        />

                        {item.status || 'ACTIVE'}
                      </span>
                    </td>

                    <td className="relative px-6 py-4 text-right">
                      <button
                        type="button"
                        aria-label="Project actions"
                        onClick={() =>
                          setOpenMenuId((current) =>
                            current === item.id ? null : item.id
                          )
                        }
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-xl font-bold leading-none text-gray-500 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
                      >
                        ⋮
                      </button>

                      {openMenuId === item.id && (
                        <>
                          <button
                            type="button"
                            aria-label="Close project actions"
                            onClick={() => setOpenMenuId(null)}
                            className="fixed inset-0 z-20 cursor-default"
                          />

                          <div className="absolute right-6 top-14 z-30 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 text-left shadow-xl">
                            <button
                              type="button"
                              onClick={() => editProject(item)}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                            >
                              <span>✎</span>
                              Edit
                            </button>

                            <div className="my-1 border-t border-gray-100" />

                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                deleteProject(item.id);
                              }}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                            >
                              <span>⌫</span>
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
