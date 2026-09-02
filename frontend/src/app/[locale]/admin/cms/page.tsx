'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/services/api';

type Locale = 'bn' | 'en';
type Status = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

interface CmsPage {
  id: string;
  slug: string;
  title_bn: string;
  title_en: string;
  content_bn: string | null;
  content_en: string | null;
  status: Status;
  seo_title_bn: string | null;
  seo_title_en: string | null;
  seo_description_bn: string | null;
  seo_description_en: string | null;
  metadata: Record<string, any> | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface HomepageEditor {
  announcement: {
    enabled: boolean;
    bn: string;
    en: string;
  };
  hero: {
    badge_bn: string;
    badge_en: string;
    title_bn: string;
    title_en: string;
    description_bn: string;
    description_en: string;
    primary_text_bn: string;
    primary_text_en: string;
    primary_link: string;
    secondary_text_bn: string;
    secondary_text_en: string;
    secondary_link: string;
  };
  commitment: {
    label_bn: string;
    label_en: string;
    title_bn: string;
    title_en: string;
    items: Array<{ bn: string; en: string }>;
  };
  intro: {
    label_bn: string;
    label_en: string;
    title_bn: string;
    title_en: string;
    content_bn: string;
    content_en: string;
  };
  impact: {
    items: Array<{ number: string; bn: string; en: string }>;
  };
  activities: Array<{
    number: string;
    title_bn: string;
    title_en: string;
    text_bn: string;
    text_en: string;
    enabled: boolean;
  }>;
  mission: {
    label_bn: string;
    label_en: string;
    title_bn: string;
    title_en: string;
    content_bn: string;
    content_en: string;
  };
  vision: {
    label_bn: string;
    label_en: string;
    title_bn: string;
    title_en: string;
    content_bn: string;
    content_en: string;
  };
  projects: {
    label_bn: string;
    label_en: string;
    title_bn: string;
    title_en: string;
    limit: number;
  };
  news: {
    label_bn: string;
    label_en: string;
    title_bn: string;
    title_en: string;
    limit: number;
  };
  notices: {
    label_bn: string;
    label_en: string;
    title_bn: string;
    title_en: string;
    limit: number;
  };
  gallery: {
    label_bn: string;
    label_en: string;
    title_bn: string;
    title_en: string;
    button_bn: string;
    button_en: string;
  };
  donation: {
    label_bn: string;
    label_en: string;
    title_bn: string;
    title_en: string;
    content_bn: string;
    content_en: string;
    button_bn: string;
    button_en: string;
    button_link: string;
  };
}

const blankHomepage: HomepageEditor = {
  announcement: {
    enabled: true,
    bn: '',
    en: '',
  },
  hero: {
    badge_bn: '',
    badge_en: '',
    title_bn: '',
    title_en: '',
    description_bn: '',
    description_en: '',
    primary_text_bn: '',
    primary_text_en: '',
    primary_link: '/donate',
    secondary_text_bn: '',
    secondary_text_en: '',
    secondary_link: '/about',
  },
  commitment: {
    label_bn: '',
    label_en: '',
    title_bn: '',
    title_en: '',
    items: [],
  },
  intro: {
    label_bn: '',
    label_en: '',
    title_bn: '',
    title_en: '',
    content_bn: '',
    content_en: '',
  },
  impact: {
    items: [],
  },
  activities: [],
  mission: {
    label_bn: '',
    label_en: '',
    title_bn: '',
    title_en: '',
    content_bn: '',
    content_en: '',
  },
  vision: {
    label_bn: '',
    label_en: '',
    title_bn: '',
    title_en: '',
    content_bn: '',
    content_en: '',
  },
  projects: {
    label_bn: '',
    label_en: '',
    title_bn: '',
    title_en: '',
    limit: 3,
  },
  news: {
    label_bn: '',
    label_en: '',
    title_bn: '',
    title_en: '',
    limit: 3,
  },
  notices: {
    label_bn: '',
    label_en: '',
    title_bn: '',
    title_en: '',
    limit: 3,
  },
  gallery: {
    label_bn: '',
    label_en: '',
    title_bn: '',
    title_en: '',
    button_bn: '',
    button_en: '',
  },
  donation: {
    label_bn: '',
    label_en: '',
    title_bn: '',
    title_en: '',
    content_bn: '',
    content_en: '',
    button_bn: '',
    button_en: '',
    button_link: '/donate',
  },
};

function cloneHomepage(value: HomepageEditor): HomepageEditor {
  return JSON.parse(JSON.stringify(value));
}

function mergeHomepage(metadata: Record<string, any> | null): HomepageEditor {
  const source = metadata || {};
  const base = cloneHomepage(blankHomepage);

  return {
    ...base,
    ...source,
    announcement: {
      ...base.announcement,
      ...(source.announcement || {}),
    },
    hero: {
      ...base.hero,
      ...(source.hero || {}),
    },
    commitment: {
      ...base.commitment,
      ...(source.commitment || {}),
      items: Array.isArray(source.commitment?.items)
        ? source.commitment.items
        : [],
    },
    intro: {
      ...base.intro,
      ...(source.intro || {}),
    },
    impact: {
      ...base.impact,
      ...(source.impact || {}),
      items: Array.isArray(source.impact?.items)
        ? source.impact.items
        : [],
    },
    activities: Array.isArray(source.activities)
      ? source.activities.map((item: any) => ({
          number: item?.number || '',
          title_bn: item?.title_bn || '',
          title_en: item?.title_en || '',
          text_bn: item?.text_bn || '',
          text_en: item?.text_en || '',
          enabled: item?.enabled !== false,
        }))
      : [],
    mission: {
      ...base.mission,
      ...(source.mission || {}),
    },
    vision: {
      ...base.vision,
      ...(source.vision || {}),
    },
    projects: {
      ...base.projects,
      ...(source.projects || {}),
    },
    news: {
      ...base.news,
      ...(source.news || {}),
    },
    notices: {
      ...base.notices,
      ...(source.notices || {}),
    },
    gallery: {
      ...base.gallery,
      ...(source.gallery || {}),
    },
    donation: {
      ...base.donation,
      ...(source.donation || {}),
    },
  };
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 5,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />
    </div>
  );
}

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-5 border-b border-gray-100 pb-4">
      <h2 className="text-xl font-black text-gray-900">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
}

export default function CmsPageAdmin() {
  const params = useParams();
  const router = useRouter();

  const locale: Locale = params?.locale === 'en' ? 'en' : 'bn';
  const isBn = locale === 'bn';

  const [pages, setPages] = useState<CmsPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [homepageSaving, setHomepageSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    slug: '',
    title_bn: '',
    title_en: '',
    content_bn: '',
    content_en: '',
    status: 'DRAFT' as Status,
    seo_title_bn: '',
    seo_title_en: '',
    seo_description_bn: '',
    seo_description_en: '',
  });

  const [homepage, setHomepage] = useState<HomepageEditor>(
    cloneHomepage(blankHomepage)
  );

  const loadPages = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/cms-pages');

      if (Array.isArray(response.data?.data)) {
        setPages(response.data.data);
      } else {
        setPages([]);
      }
    } catch (err: any) {
      console.error('CMS pages error:', err);

      if (err?.response?.status === 401) {
        router.push(`/${locale}/login`);
        return;
      }

      setError(
        isBn
          ? 'CMS পেজগুলো লোড করা যায়নি।'
          : 'Unable to load CMS pages.'
      );
    } finally {
      setLoading(false);
    }
  };

  const loadHomepage = async () => {
    try {
      const response = await api.get('/cms-pages/homepage');
      const page = response.data?.data;

      if (page) {
        setHomepage(mergeHomepage(page.metadata));
      }
    } catch (err) {
      console.error('Homepage CMS error:', err);
    }
  };

  useEffect(() => {
    loadPages();
    loadHomepage();
  }, []);

  const updateHomepage = (
    section: keyof HomepageEditor,
    field: string,
    value: any
  ) => {
    setHomepage((current) => ({
      ...current,
      [section]: {
        ...(current[section] as any),
        [field]: value,
      },
    }));
  };

  const updateArrayItem = (
    section: 'commitment' | 'impact',
    index: number,
    field: string,
    value: any
  ) => {
    setHomepage((current) => {
      const currentSection: any = current[section];
      const items = [...(currentSection.items || [])];

      items[index] = {
        ...items[index],
        [field]: value,
      };

      return {
        ...current,
        [section]: {
          ...currentSection,
          items,
        },
      };
    });
  };

  const updateActivity = (
    index: number,
    field: string,
    value: any
  ) => {
    setHomepage((current) => {
      const activities = [...current.activities];

      activities[index] = {
        ...activities[index],
        [field]: value,
      };

      return {
        ...current,
        activities,
      };
    });
  };

  const addCommitment = () => {
    setHomepage((current) => ({
      ...current,
      commitment: {
        ...current.commitment,
        items: [
          ...current.commitment.items,
          { bn: '', en: '' },
        ],
      },
    }));
  };

  const removeCommitment = (index: number) => {
    setHomepage((current) => ({
      ...current,
      commitment: {
        ...current.commitment,
        items: current.commitment.items.filter((_, i) => i !== index),
      },
    }));
  };

  const addImpact = () => {
    setHomepage((current) => ({
      ...current,
      impact: {
        ...current.impact,
        items: [
          ...current.impact.items,
          {
            number: String(current.impact.items.length + 1).padStart(2, '0'),
            bn: '',
            en: '',
          },
        ],
      },
    }));
  };

  const removeImpact = (index: number) => {
    setHomepage((current) => ({
      ...current,
      impact: {
        ...current.impact,
        items: current.impact.items.filter((_, i) => i !== index),
      },
    }));
  };

  const addActivity = () => {
    setHomepage((current) => ({
      ...current,
      activities: [
        ...current.activities,
        {
          number: String(current.activities.length + 1).padStart(2, '0'),
          title_bn: '',
          title_en: '',
          text_bn: '',
          text_en: '',
          enabled: true,
        },
      ],
    }));
  };

  const removeActivity = (index: number) => {
    setHomepage((current) => ({
      ...current,
      activities: current.activities.filter((_, i) => i !== index),
    }));
  };

  const handleHomepageSave = async () => {
    const page = pages.find((item) => item.slug === 'homepage');

    if (!page) {
      setError(
        isBn
          ? 'homepage CMS পেজটি পাওয়া যায়নি।'
          : 'Homepage CMS page was not found.'
      );
      return;
    }

    try {
      setHomepageSaving(true);
      setError('');
      setMessage('');

      await api.put(`/cms-pages/${page.id}`, {
        slug: page.slug,
        title_bn: page.title_bn,
        title_en: page.title_en,
        content_bn: page.content_bn,
        content_en: page.content_en,
        status: 'PUBLISHED',
        seo_title_bn: page.seo_title_bn,
        seo_title_en: page.seo_title_en,
        seo_description_bn: page.seo_description_bn,
        seo_description_en: page.seo_description_en,
        metadata: homepage,
      });

      setMessage(
        isBn
          ? 'Homepage সফলভাবে আপডেট হয়েছে।'
          : 'Homepage updated successfully.'
      );

      await loadHomepage();
      await loadPages();
    } catch (err: any) {
      console.error('Homepage save error:', err);

      setError(
        err?.response?.data?.message ||
          (isBn
            ? 'Homepage আপডেট করা যায়নি।'
            : 'Unable to update homepage.')
      );
    } finally {
      setHomepageSaving(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({
      slug: '',
      title_bn: '',
      title_en: '',
      content_bn: '',
      content_en: '',
      status: 'DRAFT',
      seo_title_bn: '',
      seo_title_en: '',
      seo_description_bn: '',
      seo_description_en: '',
    });
  };

  const handleCreate = () => {
    setEditingId(null);
    setForm({
      slug: '',
      title_bn: '',
      title_en: '',
      content_bn: '',
      content_en: '',
      status: 'DRAFT',
      seo_title_bn: '',
      seo_title_en: '',
      seo_description_bn: '',
      seo_description_en: '',
    });
    setShowForm(true);
    setMessage('');
    setError('');
  };

  const handleEdit = (page: CmsPage) => {
    setEditingId(page.id);

    setForm({
      slug: page.slug,
      title_bn: page.title_bn,
      title_en: page.title_en,
      content_bn: page.content_bn || '',
      content_en: page.content_en || '',
      status: page.status,
      seo_title_bn: page.seo_title_bn || '',
      seo_title_en: page.seo_title_en || '',
      seo_description_bn: page.seo_description_bn || '',
      seo_description_en: page.seo_description_en || '',
    });

    setShowForm(true);
    setMessage('');
    setError('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError('');
      setMessage('');

      const payload = {
        slug: form.slug.trim(),
        title_bn: form.title_bn.trim(),
        title_en: form.title_en.trim(),
        content_bn: form.content_bn || null,
        content_en: form.content_en || null,
        status: form.status,
        seo_title_bn: form.seo_title_bn || null,
        seo_title_en: form.seo_title_en || null,
        seo_description_bn: form.seo_description_bn || null,
        seo_description_en: form.seo_description_en || null,
      };

      if (editingId) {
        await api.put(`/cms-pages/${editingId}`, payload);
      } else {
        await api.post('/cms-pages', payload);
      }

      setMessage(
        editingId
          ? isBn
            ? 'CMS পেজ সফলভাবে আপডেট হয়েছে।'
            : 'CMS page updated successfully.'
          : isBn
            ? 'CMS পেজ সফলভাবে তৈরি হয়েছে।'
            : 'CMS page created successfully.'
      );

      await loadPages();
      resetForm();
    } catch (err: any) {
      console.error('CMS save error:', err);

      const validationErrors = err?.response?.data?.errors;

      if (validationErrors) {
        const firstError = Object.values(validationErrors)
          .flat()
          .find((value) => typeof value === 'string');

        setError(
          String(
            firstError ||
              (isBn
                ? 'তথ্যগুলো সঠিকভাবে পূরণ করুন।'
                : 'Please check the form fields.')
          )
        );
      } else {
        setError(
          err?.response?.data?.message ||
            (isBn
              ? 'CMS পেজ সংরক্ষণ করা যায়নি।'
              : 'Unable to save CMS page.')
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (page: CmsPage) => {
    if (
      !window.confirm(
        isBn
          ? `"${page.title_bn}" পেজটি মুছে ফেলতে চান?`
          : `Delete "${page.title_en}"?`
      )
    ) {
      return;
    }

    try {
      await api.delete(`/cms-pages/${page.id}`);
      setMessage(
        isBn
          ? 'CMS পেজ সফলভাবে মুছে ফেলা হয়েছে।'
          : 'CMS page deleted successfully.'
      );
      await loadPages();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          (isBn
            ? 'CMS পেজ মুছে ফেলা যায়নি।'
            : 'Unable to delete CMS page.')
      );
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
        {isBn ? 'লোড হচ্ছে...' : 'Loading...'}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-950">
          {isBn ? 'CMS পেজ' : 'CMS Pages'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isBn
            ? 'ব্রাউজার থেকেই ওয়েবসাইটের কনটেন্ট পরিচালনা করুন।'
            : 'Manage website content directly from the browser.'}
        </p>
      </div>

      {message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* HOMEPAGE EDITOR */}
      {pages.some((page) => page.slug === 'homepage') && (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-black text-emerald-950">
                {isBn ? 'Homepage Editor' : 'Homepage Editor'}
              </h2>
              <p className="mt-1 text-sm text-emerald-800">
                {isBn
                  ? 'নিচের ফিল্ডগুলো পরিবর্তন করে Homepage আপডেট করুন।'
                  : 'Edit the fields below and update the public homepage.'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleHomepageSave}
              disabled={homepageSaving}
              className="rounded-xl bg-emerald-700 px-6 py-3 text-sm font-black text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {homepageSaving
                ? isBn
                  ? 'সংরক্ষণ হচ্ছে...'
                  : 'Saving...'
                : isBn
                  ? 'Homepage সংরক্ষণ করুন'
                  : 'Save Homepage'}
            </button>
          </div>

          {/* ANNOUNCEMENT */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <SectionTitle
              title={isBn ? '১. Announcement Bar' : '1. Announcement Bar'}
            />

            <label className="mb-5 flex items-center gap-3">
              <input
                type="checkbox"
                checked={homepage.announcement.enabled}
                onChange={(e) =>
                  updateHomepage(
                    'announcement',
                    'enabled',
                    e.target.checked
                  )
                }
                className="h-5 w-5 rounded border-gray-300 text-emerald-600"
              />
              <span className="font-semibold text-gray-700">
                {isBn ? 'Announcement চালু রাখুন' : 'Enable announcement'}
              </span>
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <TextArea
                label="বাংলা"
                value={homepage.announcement.bn}
                onChange={(v) =>
                  updateHomepage('announcement', 'bn', v)
                }
                rows={3}
              />
              <TextArea
                label="English"
                value={homepage.announcement.en}
                onChange={(v) =>
                  updateHomepage('announcement', 'en', v)
                }
                rows={3}
              />
            </div>
          </section>

          {/* HERO */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <SectionTitle
              title={isBn ? '২. Hero Section' : '2. Hero Section'}
              description={
                isBn
                  ? 'Homepage-এর প্রধান অংশ।'
                  : 'Main homepage hero content.'
              }
            />

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Badge বাংলা"
                value={homepage.hero.badge_bn}
                onChange={(v) => updateHomepage('hero', 'badge_bn', v)}
              />
              <Field
                label="Badge English"
                value={homepage.hero.badge_en}
                onChange={(v) => updateHomepage('hero', 'badge_en', v)}
              />

              <Field
                label="Hero Title বাংলা"
                value={homepage.hero.title_bn}
                onChange={(v) => updateHomepage('hero', 'title_bn', v)}
              />
              <Field
                label="Hero Title English"
                value={homepage.hero.title_en}
                onChange={(v) => updateHomepage('hero', 'title_en', v)}
              />

              <TextArea
                label="Hero Description বাংলা"
                value={homepage.hero.description_bn}
                onChange={(v) =>
                  updateHomepage('hero', 'description_bn', v)
                }
                rows={5}
              />
              <TextArea
                label="Hero Description English"
                value={homepage.hero.description_en}
                onChange={(v) =>
                  updateHomepage('hero', 'description_en', v)
                }
                rows={5}
              />

              <Field
                label="Primary Button বাংলা"
                value={homepage.hero.primary_text_bn}
                onChange={(v) =>
                  updateHomepage('hero', 'primary_text_bn', v)
                }
              />
              <Field
                label="Primary Button English"
                value={homepage.hero.primary_text_en}
                onChange={(v) =>
                  updateHomepage('hero', 'primary_text_en', v)
                }
              />

              <Field
                label="Primary Link"
                value={homepage.hero.primary_link}
                onChange={(v) =>
                  updateHomepage('hero', 'primary_link', v)
                }
                placeholder="/donate"
              />

              <div />

              <Field
                label="Secondary Button বাংলা"
                value={homepage.hero.secondary_text_bn}
                onChange={(v) =>
                  updateHomepage('hero', 'secondary_text_bn', v)
                }
              />
              <Field
                label="Secondary Button English"
                value={homepage.hero.secondary_text_en}
                onChange={(v) =>
                  updateHomepage('hero', 'secondary_text_en', v)
                }
              />

              <Field
                label="Secondary Link"
                value={homepage.hero.secondary_link}
                onChange={(v) =>
                  updateHomepage('hero', 'secondary_link', v)
                }
                placeholder="/about"
              />
            </div>
          </section>

          {/* COMMITMENT */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <SectionTitle
                title={isBn ? '৩. Our Commitment' : '3. Our Commitment'}
              />
              <button
                type="button"
                onClick={addCommitment}
                className="shrink-0 rounded-lg border border-emerald-300 px-4 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-50"
              >
                + {isBn ? 'যোগ করুন' : 'Add'}
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Label বাংলা"
                value={homepage.commitment.label_bn}
                onChange={(v) =>
                  updateHomepage('commitment', 'label_bn', v)
                }
              />
              <Field
                label="Label English"
                value={homepage.commitment.label_en}
                onChange={(v) =>
                  updateHomepage('commitment', 'label_en', v)
                }
              />
              <Field
                label="Title বাংলা"
                value={homepage.commitment.title_bn}
                onChange={(v) =>
                  updateHomepage('commitment', 'title_bn', v)
                }
              />
              <Field
                label="Title English"
                value={homepage.commitment.title_en}
                onChange={(v) =>
                  updateHomepage('commitment', 'title_en', v)
                }
              />
            </div>

            <div className="mt-6 space-y-4">
              {homepage.commitment.items.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-bold">
                      #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeCommitment(index)}
                      className="text-sm font-bold text-red-600"
                    >
                      {isBn ? 'মুছুন' : 'Remove'}
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field
                      label="বাংলা"
                      value={item.bn}
                      onChange={(v) =>
                        updateArrayItem(
                          'commitment',
                          index,
                          'bn',
                          v
                        )
                      }
                    />
                    <Field
                      label="English"
                      value={item.en}
                      onChange={(v) =>
                        updateArrayItem(
                          'commitment',
                          index,
                          'en',
                          v
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* INTRO */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <SectionTitle title={isBn ? '৪. Introduction' : '4. Introduction'} />

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Label বাংলা"
                value={homepage.intro.label_bn}
                onChange={(v) => updateHomepage('intro', 'label_bn', v)}
              />
              <Field
                label="Label English"
                value={homepage.intro.label_en}
                onChange={(v) => updateHomepage('intro', 'label_en', v)}
              />
              <Field
                label="Title বাংলা"
                value={homepage.intro.title_bn}
                onChange={(v) => updateHomepage('intro', 'title_bn', v)}
              />
              <Field
                label="Title English"
                value={homepage.intro.title_en}
                onChange={(v) => updateHomepage('intro', 'title_en', v)}
              />
              <TextArea
                label="Content বাংলা"
                value={homepage.intro.content_bn}
                onChange={(v) => updateHomepage('intro', 'content_bn', v)}
                rows={7}
              />
              <TextArea
                label="Content English"
                value={homepage.intro.content_en}
                onChange={(v) => updateHomepage('intro', 'content_en', v)}
                rows={7}
              />
            </div>
          </section>

          {/* IMPACT */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <SectionTitle title={isBn ? '৫. Impact' : '5. Impact'} />
              <button
                type="button"
                onClick={addImpact}
                className="shrink-0 rounded-lg border border-emerald-300 px-4 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-50"
              >
                + {isBn ? 'যোগ করুন' : 'Add'}
              </button>
            </div>

            <div className="space-y-4">
              {homepage.impact.items.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-bold">#{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeImpact(index)}
                      className="text-sm font-bold text-red-600"
                    >
                      {isBn ? 'মুছুন' : 'Remove'}
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <Field
                      label="Number"
                      value={item.number}
                      onChange={(v) =>
                        updateArrayItem(
                          'impact',
                          index,
                          'number',
                          v
                        )
                      }
                    />
                    <Field
                      label="বাংলা"
                      value={item.bn}
                      onChange={(v) =>
                        updateArrayItem(
                          'impact',
                          index,
                          'bn',
                          v
                        )
                      }
                    />
                    <Field
                      label="English"
                      value={item.en}
                      onChange={(v) =>
                        updateArrayItem(
                          'impact',
                          index,
                          'en',
                          v
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ACTIVITIES */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <SectionTitle title={isBn ? '৬. Activities' : '6. Activities'} />
              <button
                type="button"
                onClick={addActivity}
                className="shrink-0 rounded-lg border border-emerald-300 px-4 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-50"
              >
                + {isBn ? 'যোগ করুন' : 'Add'}
              </button>
            </div>

            <div className="space-y-5">
              {homepage.activities.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-bold">Activity #{index + 1}</span>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-sm font-semibold">
                        <input
                          type="checkbox"
                          checked={item.enabled}
                          onChange={(e) =>
                            updateActivity(
                              index,
                              'enabled',
                              e.target.checked
                            )
                          }
                          className="h-4 w-4 rounded text-emerald-600"
                        />
                        Active
                      </label>

                      <button
                        type="button"
                        onClick={() => removeActivity(index)}
                        className="text-sm font-bold text-red-600"
                      >
                        {isBn ? 'মুছুন' : 'Remove'}
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <Field
                      label="Number"
                      value={item.number}
                      onChange={(v) =>
                        updateActivity(index, 'number', v)
                      }
                    />
                    <Field
                      label="Title বাংলা"
                      value={item.title_bn}
                      onChange={(v) =>
                        updateActivity(index, 'title_bn', v)
                      }
                    />
                    <Field
                      label="Title English"
                      value={item.title_en}
                      onChange={(v) =>
                        updateActivity(index, 'title_en', v)
                      }
                    />
                    <TextArea
                      label="Text বাংলা"
                      value={item.text_bn}
                      onChange={(v) =>
                        updateActivity(index, 'text_bn', v)
                      }
                      rows={5}
                    />
                    <TextArea
                      label="Text English"
                      value={item.text_en}
                      onChange={(v) =>
                        updateActivity(index, 'text_en', v)
                      }
                      rows={5}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* MISSION */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <SectionTitle title={isBn ? '৭. Mission' : '7. Mission'} />

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Label বাংলা"
                value={homepage.mission.label_bn}
                onChange={(v) => updateHomepage('mission', 'label_bn', v)}
              />
              <Field
                label="Label English"
                value={homepage.mission.label_en}
                onChange={(v) => updateHomepage('mission', 'label_en', v)}
              />
              <Field
                label="Title বাংলা"
                value={homepage.mission.title_bn}
                onChange={(v) => updateHomepage('mission', 'title_bn', v)}
              />
              <Field
                label="Title English"
                value={homepage.mission.title_en}
                onChange={(v) => updateHomepage('mission', 'title_en', v)}
              />
              <TextArea
                label="Content বাংলা"
                value={homepage.mission.content_bn}
                onChange={(v) =>
                  updateHomepage('mission', 'content_bn', v)
                }
                rows={6}
              />
              <TextArea
                label="Content English"
                value={homepage.mission.content_en}
                onChange={(v) =>
                  updateHomepage('mission', 'content_en', v)
                }
                rows={6}
              />
            </div>
          </section>

          {/* VISION */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <SectionTitle title={isBn ? '৮. Vision' : '8. Vision'} />

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Label বাংলা"
                value={homepage.vision.label_bn}
                onChange={(v) => updateHomepage('vision', 'label_bn', v)}
              />
              <Field
                label="Label English"
                value={homepage.vision.label_en}
                onChange={(v) => updateHomepage('vision', 'label_en', v)}
              />
              <Field
                label="Title বাংলা"
                value={homepage.vision.title_bn}
                onChange={(v) => updateHomepage('vision', 'title_bn', v)}
              />
              <Field
                label="Title English"
                value={homepage.vision.title_en}
                onChange={(v) => updateHomepage('vision', 'title_en', v)}
              />
              <TextArea
                label="Content বাংলা"
                value={homepage.vision.content_bn}
                onChange={(v) =>
                  updateHomepage('vision', 'content_bn', v)
                }
                rows={6}
              />
              <TextArea
                label="Content English"
                value={homepage.vision.content_en}
                onChange={(v) =>
                  updateHomepage('vision', 'content_en', v)
                }
                rows={6}
              />
            </div>
          </section>

          {/* PROJECTS */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <SectionTitle title={isBn ? '৯. Projects' : '9. Projects'} />

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Label বাংলা"
                value={homepage.projects.label_bn}
                onChange={(v) => updateHomepage('projects', 'label_bn', v)}
              />
              <Field
                label="Label English"
                value={homepage.projects.label_en}
                onChange={(v) => updateHomepage('projects', 'label_en', v)}
              />
              <Field
                label="Title বাংলা"
                value={homepage.projects.title_bn}
                onChange={(v) => updateHomepage('projects', 'title_bn', v)}
              />
              <Field
                label="Title English"
                value={homepage.projects.title_en}
                onChange={(v) => updateHomepage('projects', 'title_en', v)}
              />
              <Field
                label="Number of Projects"
                value={homepage.projects.limit}
                type="number"
                onChange={(v) =>
                  updateHomepage('projects', 'limit', Number(v) || 0)
                }
              />
            </div>
          </section>

          {/* NEWS */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <SectionTitle title={isBn ? '১০. News' : '10. News'} />

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Label বাংলা"
                value={homepage.news.label_bn}
                onChange={(v) => updateHomepage('news', 'label_bn', v)}
              />
              <Field
                label="Label English"
                value={homepage.news.label_en}
                onChange={(v) => updateHomepage('news', 'label_en', v)}
              />
              <Field
                label="Title বাংলা"
                value={homepage.news.title_bn}
                onChange={(v) => updateHomepage('news', 'title_bn', v)}
              />
              <Field
                label="Title English"
                value={homepage.news.title_en}
                onChange={(v) => updateHomepage('news', 'title_en', v)}
              />
              <Field
                label="Number of News"
                value={homepage.news.limit}
                type="number"
                onChange={(v) =>
                  updateHomepage('news', 'limit', Number(v) || 0)
                }
              />
            </div>
          </section>

          {/* NOTICES */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <SectionTitle title={isBn ? '১১. Notices' : '11. Notices'} />

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Label বাংলা"
                value={homepage.notices.label_bn}
                onChange={(v) => updateHomepage('notices', 'label_bn', v)}
              />
              <Field
                label="Label English"
                value={homepage.notices.label_en}
                onChange={(v) => updateHomepage('notices', 'label_en', v)}
              />
              <Field
                label="Title বাংলা"
                value={homepage.notices.title_bn}
                onChange={(v) => updateHomepage('notices', 'title_bn', v)}
              />
              <Field
                label="Title English"
                value={homepage.notices.title_en}
                onChange={(v) => updateHomepage('notices', 'title_en', v)}
              />
              <Field
                label="Number of Notices"
                value={homepage.notices.limit}
                type="number"
                onChange={(v) =>
                  updateHomepage('notices', 'limit', Number(v) || 0)
                }
              />
            </div>
          </section>

          {/* GALLERY */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <SectionTitle title={isBn ? '১২. Gallery' : '12. Gallery'} />

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Label বাংলা"
                value={homepage.gallery.label_bn}
                onChange={(v) => updateHomepage('gallery', 'label_bn', v)}
              />
              <Field
                label="Label English"
                value={homepage.gallery.label_en}
                onChange={(v) => updateHomepage('gallery', 'label_en', v)}
              />
              <Field
                label="Title বাংলা"
                value={homepage.gallery.title_bn}
                onChange={(v) => updateHomepage('gallery', 'title_bn', v)}
              />
              <Field
                label="Title English"
                value={homepage.gallery.title_en}
                onChange={(v) => updateHomepage('gallery', 'title_en', v)}
              />
              <Field
                label="Button বাংলা"
                value={homepage.gallery.button_bn}
                onChange={(v) => updateHomepage('gallery', 'button_bn', v)}
              />
              <Field
                label="Button English"
                value={homepage.gallery.button_en}
                onChange={(v) => updateHomepage('gallery', 'button_en', v)}
              />
            </div>
          </section>

          {/* DONATION */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <SectionTitle title={isBn ? '১৩. Donation CTA' : '13. Donation CTA'} />

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Label বাংলা"
                value={homepage.donation.label_bn}
                onChange={(v) => updateHomepage('donation', 'label_bn', v)}
              />
              <Field
                label="Label English"
                value={homepage.donation.label_en}
                onChange={(v) => updateHomepage('donation', 'label_en', v)}
              />
              <Field
                label="Title বাংলা"
                value={homepage.donation.title_bn}
                onChange={(v) => updateHomepage('donation', 'title_bn', v)}
              />
              <Field
                label="Title English"
                value={homepage.donation.title_en}
                onChange={(v) => updateHomepage('donation', 'title_en', v)}
              />
              <TextArea
                label="Content বাংলা"
                value={homepage.donation.content_bn}
                onChange={(v) =>
                  updateHomepage('donation', 'content_bn', v)
                }
                rows={6}
              />
              <TextArea
                label="Content English"
                value={homepage.donation.content_en}
                onChange={(v) =>
                  updateHomepage('donation', 'content_en', v)
                }
                rows={6}
              />
              <Field
                label="Button বাংলা"
                value={homepage.donation.button_bn}
                onChange={(v) =>
                  updateHomepage('donation', 'button_bn', v)
                }
              />
              <Field
                label="Button English"
                value={homepage.donation.button_en}
                onChange={(v) =>
                  updateHomepage('donation', 'button_en', v)
                }
              />
              <Field
                label="Button Link"
                value={homepage.donation.button_link}
                onChange={(v) =>
                  updateHomepage('donation', 'button_link', v)
                }
                placeholder="/donate"
              />
            </div>
          </section>

          <div className="sticky bottom-4 z-20 flex justify-end">
            <button
              type="button"
              onClick={handleHomepageSave}
              disabled={homepageSaving}
              className="rounded-xl bg-emerald-700 px-8 py-4 text-sm font-black text-white shadow-xl transition hover:bg-emerald-800 disabled:opacity-50"
            >
              {homepageSaving
                ? isBn
                  ? 'সংরক্ষণ হচ্ছে...'
                  : 'Saving...'
                : isBn
                  ? '✓ Homepage সংরক্ষণ করুন'
                  : '✓ Save Homepage'}
            </button>
          </div>
        </div>
      )}

      {/* NORMAL CMS PAGES */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-900">
              {isBn ? 'অন্যান্য CMS পেজ' : 'Other CMS Pages'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {isBn
                ? 'About, Contact ইত্যাদি সাধারণ CMS পেজ পরিচালনা করুন।'
                : 'Manage regular CMS pages such as About and Contact.'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreate}
            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700"
          >
            + {isBn ? 'নতুন পেজ' : 'New Page'}
          </button>
        </div>

        {pages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
            {isBn ? 'কোনো CMS পেজ নেই।' : 'No CMS pages found.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {pages.map((page) => (
                  <tr
                    key={page.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="px-4 py-4 font-semibold">
                      {isBn ? page.title_bn : page.title_en}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {page.slug}
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold">
                        {page.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(page)}
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-bold hover:bg-gray-50"
                        >
                          {isBn ? 'Edit' : 'Edit'}
                        </button>

                        {page.slug !== 'homepage' && (
                          <button
                            type="button"
                            onClick={() => handleDelete(page)}
                            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
                          >
                            {isBn ? 'Delete' : 'Delete'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* NORMAL PAGE FORM */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-black">
              {editingId
                ? isBn
                  ? 'CMS পেজ সম্পাদনা'
                  : 'Edit CMS Page'
                : isBn
                  ? 'নতুন CMS পেজ'
                  : 'New CMS Page'}
            </h2>

            <button
              type="button"
              onClick={resetForm}
              className="text-sm font-semibold text-gray-500 hover:text-gray-900"
            >
              {isBn ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Slug"
              value={form.slug}
              onChange={(v) => setForm((f) => ({ ...f, slug: v }))}
            />

            <select
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  status: e.target.value as Status,
                }))
              }
              className="mt-7 w-full rounded-xl border border-gray-300 px-4 py-3"
            >
              <option value="DRAFT">DRAFT</option>
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>

            <Field
              label="বাংলা Title"
              value={form.title_bn}
              onChange={(v) => setForm((f) => ({ ...f, title_bn: v }))}
            />

            <Field
              label="English Title"
              value={form.title_en}
              onChange={(v) => setForm((f) => ({ ...f, title_en: v }))}
            />

            <TextArea
              label="বাংলা Content"
              value={form.content_bn}
              onChange={(v) => setForm((f) => ({ ...f, content_bn: v }))}
              rows={8}
            />

            <TextArea
              label="English Content"
              value={form.content_en}
              onChange={(v) => setForm((f) => ({ ...f, content_en: v }))}
              rows={8}
            />

            <Field
              label="SEO Title BN"
              value={form.seo_title_bn}
              onChange={(v) =>
                setForm((f) => ({ ...f, seo_title_bn: v }))
              }
            />

            <Field
              label="SEO Title EN"
              value={form.seo_title_en}
              onChange={(v) =>
                setForm((f) => ({ ...f, seo_title_en: v }))
              }
            />

            <TextArea
              label="SEO Description BN"
              value={form.seo_description_bn}
              onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  seo_description_bn: v,
                }))
              }
              rows={4}
            />

            <TextArea
              label="SEO Description EN"
              value={form.seo_description_en}
              onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  seo_description_en: v,
                }))
              }
              rows={4}
            />
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {saving
                ? isBn
                  ? 'সংরক্ষণ হচ্ছে...'
                  : 'Saving...'
                : editingId
                  ? isBn
                    ? 'আপডেট করুন'
                    : 'Update Page'
                  : isBn
                    ? 'তৈরি করুন'
                    : 'Create Page'}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-bold"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
