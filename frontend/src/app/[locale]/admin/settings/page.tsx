'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import MediaPicker from '@/components/admin/MediaPicker';

interface Setting {
  id: string;
  key: string;
  value: string;
  type: string;
  group: string;
  description?: string | null;
  media_url?: string | null;
  is_public: boolean;
}

export default function SettingsPage() {
  const [siteNameBn, setSiteNameBn] = useState('');
  const [siteNameEn, setSiteNameEn] = useState('');
  const [logoMediaId, setLogoMediaId] = useState<string | null>(null);
  const [coverMediaId, setCoverMediaId] = useState<string | null>(null);

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  const [siteNameBnSettingId, setSiteNameBnSettingId] = useState<string | null>(null);
  const [siteNameEnSettingId, setSiteNameEnSettingId] = useState<string | null>(null);
  const [logoSettingId, setLogoSettingId] = useState<string | null>(null);
  const [coverSettingId, setCoverSettingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/settings');
      const data = response?.data?.data;

      const settings: Setting[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : [];

      const siteNameBnSetting = settings.find(
        (item) => item.key === 'site_name_bn',
      );
      const siteNameEnSetting = settings.find(
        (item) => item.key === 'site_name_en',
      );
      const logo = settings.find(
        (item) => item.key === 'site.logo_media_id',
      );
      const cover = settings.find(
        (item) => item.key === 'homepage.cover_media_id',
      );

      setSiteNameBn(
        siteNameBnSetting?.value || 'ব্রাইট ফিউচার ফাউন্ডেশন',
      );
      setSiteNameEn(
        siteNameEnSetting?.value || 'Bright Future Foundation',
      );

      setSiteNameBnSettingId(siteNameBnSetting?.id ?? null);
      setSiteNameEnSettingId(siteNameEnSetting?.id ?? null);

      setLogoSettingId(logo?.id ?? null);
      setCoverSettingId(cover?.id ?? null);

      setLogoMediaId(logo?.value || null);
      setCoverMediaId(cover?.value || null);

      const apiBase =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        'http://127.0.0.1:8000/api/v1';

      const backendBase = apiBase.replace(/\/api\/v1\/?$/, '');

      const resolveMediaUrl = (url?: string | null) => {
        if (!url) return null;
        return url.startsWith('http') ? url : `${backendBase}${url}`;
      };

      setLogoUrl(resolveMediaUrl(logo?.media_url));
      setCoverUrl(resolveMediaUrl(cover?.media_url));
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to load settings.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const saveSetting = async (
    key: string,
    value: string,
    existingId: string | null,
    type: string,
    group: string,
    description: string,
  ) => {
    const payload = {
      key,
      value,
      type,
      group,
      description,
      is_public: true,
    };

    if (existingId) {
      await api.put(`/settings/${existingId}`, payload);
    } else {
      await api.post('/settings', payload);
    }
  };

  const saveAllSettings = async () => {
    try {
      setSaving(true);
      setError('');
      setMessage('');

      await saveSetting(
        'site_name_bn',
        siteNameBn.trim(),
        siteNameBnSettingId,
        'string',
        'general',
        'Website name in Bengali.',
      );

      await saveSetting(
        'site_name_en',
        siteNameEn.trim(),
        siteNameEnSettingId,
        'string',
        'general',
        'Website name in English.',
      );

      await saveSetting(
        'site.logo_media_id',
        logoMediaId || '',
        logoSettingId,
        'media',
        'site',
        'Website logo selected from the Media Library.',
      );

      await saveSetting(
        'homepage.cover_media_id',
        coverMediaId || '',
        coverSettingId,
        'media',
        'homepage',
        'Homepage cover photo selected from the Media Library.',
      );

      setMessage('Settings saved successfully.');
      await loadSettings();
    } catch (err: any) {
      const validation = err?.response?.data?.errors;

      if (validation) {
        const first = Object.values(validation).flat().find(Boolean);
        setError(String(first || 'Validation failed.'));
      } else {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            'Failed to save settings.',
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-950">
          Website Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          ওয়েবসাইটের নাম, Logo এবং Homepage Cover Photo পরিচালনা করুন।
        </p>
      </div>

      {message && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl bg-white p-10 text-center text-gray-500 shadow-sm">
          Loading settings...
        </div>
      ) : (
        <>
          <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-black text-gray-950">
                Website Name
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                পুরো ওয়েবসাইটে ব্যবহৃত English ও বাংলা নাম এখান থেকে পরিবর্তন করুন।
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="site-name-en"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  English Site Name
                </label>
                <input
                  id="site-name-en"
                  type="text"
                  value={siteNameEn}
                  onChange={(e) => setSiteNameEn(e.target.value)}
                  placeholder="Bright Future Foundation"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label
                  htmlFor="site-name-bn"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  বাংলা Site Name
                </label>
                <input
                  id="site-name-bn"
                  type="text"
                  value={siteNameBn}
                  onChange={(e) => setSiteNameBn(e.target.value)}
                  placeholder="ব্রাইট ফিউচার ফাউন্ডেশন"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-black text-gray-950">
                Website Logo
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Navbar এবং অন্যান্য জায়গায় ব্যবহারের জন্য Logo নির্বাচন করুন।
              </p>
            </div>

            <MediaPicker
              value={logoMediaId}
              existingUrl={logoUrl}
              onChange={setLogoMediaId}
              label="Logo"
              mediaType="logo"
            />
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-black text-gray-950">
                Homepage Cover Photo
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Homepage-এর প্রধান Cover Photo নির্বাচন করুন।
              </p>
            </div>

            <MediaPicker
              value={coverMediaId}
              existingUrl={coverUrl}
              onChange={setCoverMediaId}
              label="Homepage Cover Photo"
              mediaType="cover"
            />
          </section>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={saveAllSettings}
              disabled={saving}
              className="bff-button rounded-xl bg-emerald-700 px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
