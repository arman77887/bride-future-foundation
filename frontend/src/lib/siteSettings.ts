import 'server-only';

export interface SiteSettings {
  site_name_bn: string;
  site_name_en: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  site_name_bn: 'ব্রাইড ফিউচার ফাউন্ডেশন',
  site_name_en: 'Bride Future Foundation',
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'https://bridefuturefoundation.duckdns.org/api/v1';

  try {
    const response = await fetch(`${baseUrl}/settings`, {
      next: {
        revalidate: 60,
      },
    });

    if (!response.ok) {
      return DEFAULT_SETTINGS;
    }

    const json = await response.json();

    const settings = Array.isArray(json?.data) ? json.data : [];

    const result: SiteSettings = {
      site_name_bn: DEFAULT_SETTINGS.site_name_bn,
      site_name_en: DEFAULT_SETTINGS.site_name_en,
    };

    for (const setting of settings) {
      if (setting?.key === 'site_name_bn' && setting?.value) {
        result.site_name_bn = String(setting.value);
      }

      if (setting?.key === 'site_name_en' && setting?.value) {
        result.site_name_en = String(setting.value);
      }
    }

    return result;
  } catch {
    return DEFAULT_SETTINGS;
  }
}
