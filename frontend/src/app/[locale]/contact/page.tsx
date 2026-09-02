import Link from 'next/link';
import { api } from '@/services/api';
import ContactForm from '@/components/pages/ContactForm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type ContactData = {
  hero?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
  };
  address?: {
    title?: string;
    value?: string;
  };
  phone?: {
    title?: string;
    value?: string;
  };
  email?: {
    title?: string;
    value?: string;
  };
  office_hours?: {
    title?: string;
    value?: string;
  };
  map?: {
    title?: string;
    url?: string;
  };
  form?: {
    title?: string;
    subtitle?: string;
    name_label?: string;
    email_label?: string;
    phone_label?: string;
    subject_label?: string;
    message_label?: string;
    submit_label?: string;
  };
};

async function getContactPage() {
  try {
    const response = await api.get('cms-pages/contact', {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    return response.data?.data ?? null;
  } catch {
    return null;
  }
}

export default async function ContactPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale === 'bn' ? 'bn' : 'en';
  const isBn = locale === 'bn';

  const cms = await getContactPage();

  const metadata = cms?.metadata ?? {};
  const data: ContactData =
    metadata[locale] && typeof metadata[locale] === 'object'
      ? metadata[locale]
      : metadata;

  const hero = data.hero ?? {};
  const address = data.address ?? {};
  const phone = data.phone ?? {};
  const email = data.email ?? {};
  const officeHours = data.office_hours ?? {};
  const map = data.map ?? {};
  const form = data.form ?? {};

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-slate-900 px-6 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
            {hero.eyebrow ||
              (isBn ? 'যোগাযোগ করুন' : 'Get In Touch')}
          </p>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            {hero.title ||
              (isBn ? 'আমাদের সাথে যোগাযোগ করুন' : 'Contact Us')}
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            {hero.subtitle ||
              (isBn
                ? 'Bright Future Foundation-এর সাথে যোগাযোগ করতে নিচের তথ্য ব্যবহার করুন।'
                : 'Get in touch with Bright Future Foundation using the information below.')}
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="mb-4 text-2xl">📍</div>
            <h2 className="font-semibold text-slate-900">
              {address.title || (isBn ? 'ঠিকানা' : 'Address')}
            </h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
              {address.value ||
                (isBn ? 'ঠিকানা এখানে যুক্ত করুন' : 'Add your address here')}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="mb-4 text-2xl">📞</div>
            <h2 className="font-semibold text-slate-900">
              {phone.title || (isBn ? 'ফোন' : 'Phone')}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {phone.value || (isBn ? 'ফোন নম্বর যুক্ত করুন' : 'Add phone number')}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="mb-4 text-2xl">✉️</div>
            <h2 className="font-semibold text-slate-900">
              {email.title || (isBn ? 'ইমেইল' : 'Email')}
            </h2>
            <p className="mt-3 break-all text-sm leading-7 text-slate-600">
              {email.value || 'info@bff.org.bd'}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="mb-4 text-2xl">🕐</div>
            <h2 className="font-semibold text-slate-900">
              {officeHours.title ||
                (isBn ? 'অফিস সময়' : 'Office Hours')}
            </h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
              {officeHours.value ||
                (isBn
                  ? 'অফিস সময় এখানে যুক্ত করুন'
                  : 'Add office hours here')}
            </p>
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="bg-slate-50 px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          {/* Contact Form */}
          <div className="rounded-2xl bg-white p-7 shadow-sm md:p-9">
            <h2 className="text-2xl font-bold text-slate-900">
              {form.title || (isBn ? 'বার্তা পাঠান' : 'Send Us a Message')}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {form.subtitle ||
                (isBn
                  ? 'আপনার বার্তা আমাদের কাছে পাঠান।'
                  : 'Send your message to our team.')}
            </p>

            <ContactForm
              isBn={isBn}
              labels={{
                name: form.name_label || (isBn ? 'নাম' : 'Name'),
                email: form.email_label || (isBn ? 'ইমেইল' : 'Email'),
                phone: form.phone_label || (isBn ? 'ফোন নম্বর' : 'Phone'),
                subject: form.subject_label || (isBn ? 'বিষয়' : 'Subject'),
                message: form.message_label || (isBn ? 'বার্তা' : 'Message'),
                submit: form.submit_label || (isBn ? 'বার্তা পাঠান' : 'Send Message'),
              }}
            />
          </div>

          {/* Map */}
          <div className="rounded-2xl bg-white p-7 shadow-sm md:p-9">
            <h2 className="text-2xl font-bold text-slate-900">
              {map.title || (isBn ? 'আমাদের অবস্থান' : 'Our Location')}
            </h2>

            <div className="mt-6 flex min-h-[420px] items-center justify-center rounded-2xl bg-slate-100 text-center">
              {map.url ? (
                <a
                  href={map.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white"
                >
                  {isBn ? 'Google Maps খুলুন' : 'Open Google Maps'}
                </a>
              ) : (
                <div>
                  <div className="text-5xl">🗺️</div>
                  <p className="mt-4 text-sm text-slate-500">
                    {isBn
                      ? 'Google Maps লিংক Admin CMS থেকে যুক্ত করুন।'
                      : 'Add the Google Maps link from the Admin CMS.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Back / CTA */}
      <section className="px-6 py-14 text-center">
        <h2 className="text-2xl font-bold text-slate-900">
          {isBn
            ? 'Bright Future Foundation-এর সাথে যুক্ত থাকুন'
            : 'Stay connected with Bright Future Foundation'}
        </h2>

        <Link
          href={`/${locale}`}
          className="mt-6 inline-block rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white"
        >
          {isBn ? 'হোমপেজে ফিরে যান' : 'Back to Homepage'}
        </Link>
      </section>
    </main>
  );
}
