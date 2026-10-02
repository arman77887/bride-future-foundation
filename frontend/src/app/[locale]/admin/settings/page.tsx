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
  const [contactAddressBn, setContactAddressBn] = useState('');
  const [contactAddressEn, setContactAddressEn] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactOfficeHoursBn, setContactOfficeHoursBn] = useState('');
  const [contactOfficeHoursEn, setContactOfficeHoursEn] = useState('');
  const [contactMapUrl, setContactMapUrl] = useState('');

  const [socialFacebook, setSocialFacebook] = useState(
    'https://www.facebook.com/profile.php?id=61551777602468',
  );
  const [socialX, setSocialX] = useState('');
  const [socialTiktok, setSocialTiktok] = useState('');
  const [socialYoutube, setSocialYoutube] = useState('');

  const [socialFacebookSettingId, setSocialFacebookSettingId] = useState<string | null>(null);
  const [socialXSettingId, setSocialXSettingId] = useState<string | null>(null);
  const [socialTiktokSettingId, setSocialTiktokSettingId] = useState<string | null>(null);
  const [socialYoutubeSettingId, setSocialYoutubeSettingId] = useState<string | null>(null);

  const [contactAddressBnSettingId, setContactAddressBnSettingId] = useState<string | null>(null);
  const [contactAddressEnSettingId, setContactAddressEnSettingId] = useState<string | null>(null);
  const [contactPhoneSettingId, setContactPhoneSettingId] = useState<string | null>(null);
  const [contactEmailSettingId, setContactEmailSettingId] = useState<string | null>(null);
  const [contactOfficeHoursBnSettingId, setContactOfficeHoursBnSettingId] = useState<string | null>(null);
  const [contactOfficeHoursEnSettingId, setContactOfficeHoursEnSettingId] = useState<string | null>(null);
  const [contactMapUrlSettingId, setContactMapUrlSettingId] = useState<string | null>(null);

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

      const contactAddressBnSetting = settings.find(
        (item) => item.key === 'contact.address_bn',
      );
      const contactAddressEnSetting = settings.find(
        (item) => item.key === 'contact.address_en',
      );
      const contactPhoneSetting = settings.find(
        (item) => item.key === 'contact.phone',
      );
      const contactEmailSetting = settings.find(
        (item) => item.key === 'contact_email',
      );
      const contactOfficeHoursBnSetting = settings.find(
        (item) => item.key === 'contact.office_hours_bn',
      );
      const contactOfficeHoursEnSetting = settings.find(
        (item) => item.key === 'contact.office_hours_en',
      );
      const contactMapUrlSetting = settings.find(
        (item) => item.key === 'contact.google_maps_url',
      );

      const socialFacebookSetting = settings.find(
        (item) => item.key === 'social.facebook',
      );
      const socialXSetting = settings.find(
        (item) => item.key === 'social.x',
      );
      const socialTiktokSetting = settings.find(
        (item) => item.key === 'social.tiktok',
      );
      const socialYoutubeSetting = settings.find(
        (item) => item.key === 'social.youtube',
      );

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

      setContactAddressBn(contactAddressBnSetting?.value || '');
      setContactAddressEn(contactAddressEnSetting?.value || '');
      setContactPhone(contactPhoneSetting?.value || '');
      setContactEmail(contactEmailSetting?.value || '');
      setContactOfficeHoursBn(contactOfficeHoursBnSetting?.value || '');
      setContactOfficeHoursEn(contactOfficeHoursEnSetting?.value || '');
      setContactMapUrl(contactMapUrlSetting?.value || '');

      setSocialFacebook(
        socialFacebookSetting?.value ||
          'https://www.facebook.com/profile.php?id=61551777602468',
      );
      setSocialX(socialXSetting?.value || '');
      setSocialTiktok(socialTiktokSetting?.value || '');
      setSocialYoutube(socialYoutubeSetting?.value || '');

      setSocialFacebookSettingId(socialFacebookSetting?.id ?? null);
      setSocialXSettingId(socialXSetting?.id ?? null);
      setSocialTiktokSettingId(socialTiktokSetting?.id ?? null);
      setSocialYoutubeSettingId(socialYoutubeSetting?.id ?? null);

      setContactAddressBnSettingId(contactAddressBnSetting?.id ?? null);
      setContactAddressEnSettingId(contactAddressEnSetting?.id ?? null);
      setContactPhoneSettingId(contactPhoneSetting?.id ?? null);
      setContactEmailSettingId(contactEmailSetting?.id ?? null);
      setContactOfficeHoursBnSettingId(contactOfficeHoursBnSetting?.id ?? null);
      setContactOfficeHoursEnSettingId(contactOfficeHoursEnSetting?.id ?? null);
      setContactMapUrlSettingId(contactMapUrlSetting?.id ?? null);

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

      await saveSetting(
        'contact.address_bn',
        contactAddressBn.trim(),
        contactAddressBnSettingId,
        'string',
        'contact',
        'Public contact address in Bengali.',
      );
      await saveSetting(
        'contact.address_en',
        contactAddressEn.trim(),
        contactAddressEnSettingId,
        'string',
        'contact',
        'Public contact address in English.',
      );
      await saveSetting(
        'contact.phone',
        contactPhone.trim(),
        contactPhoneSettingId,
        'string',
        'contact',
        'Public contact phone number.',
      );
      await saveSetting(
        'contact_email',
        contactEmail.trim(),
        contactEmailSettingId,
        'string',
        'contact',
        'Email address that receives Contact Form submissions.',
      );
      await saveSetting(
        'contact.office_hours_bn',
        contactOfficeHoursBn.trim(),
        contactOfficeHoursBnSettingId,
        'string',
        'contact',
        'Office hours in Bengali.',
      );
      await saveSetting(
        'contact.office_hours_en',
        contactOfficeHoursEn.trim(),
        contactOfficeHoursEnSettingId,
        'string',
        'contact',
        'Office hours in English.',
      );
      await saveSetting(
        'contact.google_maps_url',
        contactMapUrl.trim(),
        contactMapUrlSettingId,
        'string',
        'contact',
        'Google Maps URL for the public Contact page.',
      );

      await saveSetting(
        'social.facebook',
        socialFacebook.trim(),
        socialFacebookSettingId,
        'string',
        'social',
        'Official Facebook page URL.',
      );
      await saveSetting(
        'social.x',
        socialX.trim(),
        socialXSettingId,
        'string',
        'social',
        'Official X (Twitter) profile URL.',
      );
      await saveSetting(
        'social.tiktok',
        socialTiktok.trim(),
        socialTiktokSettingId,
        'string',
        'social',
        'Official TikTok profile URL.',
      );
      await saveSetting(
        'social.youtube',
        socialYoutube.trim(),
        socialYoutubeSettingId,
        'string',
        'social',
        'Official YouTube channel URL.',
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
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="p-6 sm:p-7">
          <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
            System Configuration
          </span>

          <h1 className="mt-3 text-2xl font-black text-gray-950 sm:text-3xl">
            Website Settings
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            ওয়েবসাইটের নাম, branding, contact information এবং social media
            পরিচালনা করুন।
          </p>
        </div>
      </section>

      {message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white p-12 text-sm text-gray-500 shadow-sm">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-emerald-600" />
          Loading settings...
        </div>
      ) : (
        <>
          {/* GENERAL */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5 sm:px-7">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-lg">
                  ⚙
                </div>

                <div>
                  <h2 className="text-xl font-black text-gray-950">
                    General Information
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    ওয়েবসাইটের English ও বাংলা নাম পরিচালনা করুন।
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-6 sm:p-7 md:grid-cols-2">
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

          {/* BRANDING */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5 sm:px-7">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg">
                  ◈
                </div>

                <div>
                  <h2 className="text-xl font-black text-gray-950">
                    Branding & Media
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Website Logo এবং Homepage Cover Photo পরিচালনা করুন।
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 p-6 sm:p-7 xl:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-5">
                <div className="mb-5">
                  <h3 className="font-black text-gray-900">
                    Website Logo
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
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
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-5">
                <div className="mb-5">
                  <h3 className="font-black text-gray-900">
                    Homepage Cover Photo
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
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
              </div>
            </div>
          </section>

          {/* CONTACT */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5 sm:px-7">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-lg">
                  ☎
                </div>

                <div>
                  <h2 className="text-xl font-black text-gray-950">
                    Contact Settings
                  </h2>

                  <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-500">
                    Contact page-এর ঠিকানা, ফোন, email, office hours, Google
                    Maps এবং Contact Form receiving email পরিচালনা করুন।
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-6 sm:p-7 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Address (বাংলা)
                </label>

                <textarea
                  value={contactAddressBn}
                  onChange={(e) => setContactAddressBn(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  placeholder="বাংলায় ঠিকানা"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Address (English)
                </label>

                <textarea
                  value={contactAddressEn}
                  onChange={(e) => setContactAddressEn(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  placeholder="Address in English"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Phone
                </label>

                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  placeholder="+880..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Contact Form Receiving Email
                </label>

                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  placeholder="example@gmail.com"
                />

                <p className="mt-1.5 text-xs leading-5 text-gray-500">
                  Contact Form-এর message এই email address-এ যাবে।
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Office Hours (বাংলা)
                </label>

                <input
                  type="text"
                  value={contactOfficeHoursBn}
                  onChange={(e) => setContactOfficeHoursBn(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  placeholder="রবি–বৃহস্পতি: সকাল ৯টা – বিকেল ৫টা"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Office Hours (English)
                </label>

                <input
                  type="text"
                  value={contactOfficeHoursEn}
                  onChange={(e) => setContactOfficeHoursEn(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  placeholder="Sunday–Thursday: 9:00 AM – 5:00 PM"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Google Maps URL
                </label>

                <input
                  type="url"
                  value={contactMapUrl}
                  onChange={(e) => setContactMapUrl(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  placeholder="https://maps.google.com/..."
                />
              </div>
            </div>
          </section>

          {/* SOCIAL */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5 sm:px-7">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-lg">
                  ↗
                </div>

                <div>
                  <h2 className="text-xl font-black text-gray-950">
                    Social Media
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Foundation-এর official social media profile এবং channel
                    URL পরিচালনা করুন।
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-6 sm:p-7 md:grid-cols-2">
              <div>
                <label
                  htmlFor="social-facebook"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  Facebook
                </label>

                <input
                  id="social-facebook"
                  type="url"
                  value={socialFacebook}
                  onChange={(e) => setSocialFacebook(e.target.value)}
                  placeholder="https://www.facebook.com/..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label
                  htmlFor="social-x"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  X (Twitter)
                </label>

                <input
                  id="social-x"
                  type="url"
                  value={socialX}
                  onChange={(e) => setSocialX(e.target.value)}
                  placeholder="https://x.com/..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label
                  htmlFor="social-tiktok"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  TikTok
                </label>

                <input
                  id="social-tiktok"
                  type="url"
                  value={socialTiktok}
                  onChange={(e) => setSocialTiktok(e.target.value)}
                  placeholder="https://www.tiktok.com/@..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label
                  htmlFor="social-youtube"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  YouTube
                </label>

                <input
                  id="social-youtube"
                  type="url"
                  value={socialYoutube}
                  onChange={(e) => setSocialYoutube(e.target.value)}
                  placeholder="https://www.youtube.com/@..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </section>

          {/* SAVE */}
          <section className="sticky bottom-4 z-10 rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-gray-900">
                  Save website configuration
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  পরিবর্তনগুলো public website-এ প্রয়োগ করতে Save Settings চাপুন।
                </p>
              </div>

              <button
                type="button"
                onClick={saveAllSettings}
                disabled={saving}
                className="inline-flex min-w-[150px] items-center justify-center gap-2 rounded-xl bg-emerald-700 px-7 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}

                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
