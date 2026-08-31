import Link from 'next/link';

export default function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale === 'bn' ? 'bn' : 'en';
  const isBn = locale === 'bn';

  return (
    <main className="bg-white text-gray-900">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white" />
          <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-emerald-300" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
          <div className="max-w-4xl">

            <div className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
              <span className="mr-2 h-2 w-2 rounded-full bg-emerald-300" />
              {isBn
                ? 'মানবসেবা • সামাজিক উন্নয়ন • ভবিষ্যৎ নির্মাণ'
                : 'Humanity • Social Development • Building the Future'}
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-7xl">
              {isBn
                ? 'ব্রাইট ফিউচার ফাউন্ডেশন'
                : 'Bright Future Foundation'}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-emerald-50 sm:text-xl">
              {isBn
                ? 'মানুষের পাশে দাঁড়িয়ে একটি সুন্দর, নিরাপদ ও সম্ভাবনাময় ভবিষ্যৎ গড়ে তোলাই আমাদের লক্ষ্য।'
                : 'Our mission is to stand beside people and help build a better, safer and more promising future.'}
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href={`/${locale}/donate`}
                className="rounded-xl bg-white px-7 py-3.5 font-bold text-emerald-800 shadow-xl transition hover:-translate-y-1 hover:bg-emerald-50"
              >
                {isBn ? 'সহযোগিতা করুন' : 'Support Us'}
              </Link>

              <Link
                href={`/${locale}/officers`}
                className="rounded-xl border border-white/40 bg-white/5 px-7 py-3.5 font-bold text-white backdrop-blur transition hover:bg-white/10"
              >
                {isBn ? 'আমাদের সম্পর্কে' : 'Learn About Us'}
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">
                {isBn ? 'ব্রাইট ফিউচার ফাউন্ডেশন' : 'Bright Future Foundation'}
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                {isBn
                  ? 'মানুষের জন্য কাজ, ভবিষ্যতের জন্য অঙ্গীকার'
                  : 'Working for People, Committed to the Future'}
              </h2>

              <p className="mt-6 text-lg leading-8 text-gray-600">
                {isBn
                  ? 'ব্রাইট ফিউচার ফাউন্ডেশন একটি মানবিক ও সামাজিক কল্যাণমূলক উদ্যোগ। মানুষের প্রয়োজনের সময়ে পাশে থাকা, সামাজিক উন্নয়নে ভূমিকা রাখা এবং ইতিবাচক পরিবর্তনে সহযোগিতা করাই আমাদের অঙ্গীকার।'
                  : 'Bright Future Foundation is a humanitarian and social welfare initiative focused on supporting people, contributing to community development and creating positive change.'}
              </p>

              <Link
                href={`/${locale}/officers`}
                className="mt-7 inline-flex font-bold text-emerald-700 hover:text-emerald-900"
              >
                {isBn ? 'আরও জানুন →' : 'Learn More →'}
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-5">

              <div className="rounded-3xl bg-emerald-50 p-7">
                <div className="text-3xl">🤝</div>
                <h3 className="mt-4 font-bold">
                  {isBn ? 'মানবসেবা' : 'Humanitarian Service'}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {isBn
                    ? 'মানুষের প্রয়োজনের সময়ে সহযোগিতা।'
                    : 'Supporting people when they need it.'}
                </p>
              </div>

              <div className="mt-8 rounded-3xl bg-teal-50 p-7">
                <div className="text-3xl">🌱</div>
                <h3 className="mt-4 font-bold">
                  {isBn ? 'উন্নয়ন' : 'Development'}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {isBn
                    ? 'সমাজের ইতিবাচক পরিবর্তনে ভূমিকা।'
                    : 'Contributing to positive community change.'}
                </p>
              </div>

              <div className="rounded-3xl bg-amber-50 p-7">
                <div className="text-3xl">❤️</div>
                <h3 className="mt-4 font-bold">
                  {isBn ? 'সহযোগিতা' : 'Community'}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {isBn
                    ? 'একসঙ্গে এগিয়ে যাওয়ার অঙ্গীকার।'
                    : 'A commitment to moving forward together.'}
                </p>
              </div>

              <div className="mt-8 rounded-3xl bg-blue-50 p-7">
                <div className="text-3xl">🌍</div>
                <h3 className="mt-4 font-bold">
                  {isBn ? 'ভবিষ্যৎ' : 'Future'}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {isBn
                    ? 'একটি সুন্দর ভবিষ্যৎ গড়ার প্রত্যয়।'
                    : 'Building toward a better future.'}
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">

          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">
              {isBn ? 'আমাদের উদ্দেশ্য' : 'Our Purpose'}
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              {isBn ? 'লক্ষ্য ও ভিশন' : 'Mission & Vision'}
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">

            <div className="rounded-3xl bg-emerald-800 p-8 text-white shadow-xl sm:p-10">
              <div className="text-4xl">🎯</div>

              <h3 className="mt-6 text-2xl font-black">
                {isBn ? 'আমাদের লক্ষ্য' : 'Our Mission'}
              </h3>

              <p className="mt-4 leading-8 text-emerald-50">
                {isBn
                  ? 'মানবিক সহায়তা, সামাজিক দায়িত্ব ও মানুষের ক্ষমতায়নের মাধ্যমে একটি দায়িত্বশীল ও কল্যাণমুখী সমাজ গড়ে তোলা।'
                  : 'To contribute to a responsible and caring society through humanitarian support, social responsibility and community empowerment.'}
              </p>
            </div>

            <div className="rounded-3xl bg-gray-900 p-8 text-white shadow-xl sm:p-10">
              <div className="text-4xl">🌍</div>

              <h3 className="mt-6 text-2xl font-black">
                {isBn ? 'আমাদের ভিশন' : 'Our Vision'}
              </h3>

              <p className="mt-4 leading-8 text-gray-300">
                {isBn
                  ? 'এমন একটি ভবিষ্যৎ তৈরি করা যেখানে মানুষ মর্যাদা, নিরাপত্তা ও সম্ভাবনার সঙ্গে এগিয়ে যেতে পারে।'
                  : 'To help create a future where people can move forward with dignity, security and opportunity.'}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ACTIVITIES */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">

          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">
              {isBn ? 'আমাদের কার্যক্রম' : 'What We Do'}
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              {isBn ? 'আমাদের উদ্যোগ' : 'Our Initiatives'}
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
              {isBn
                ? 'মানবিক সহায়তা, সামাজিক উন্নয়ন ও জনকল্যাণমূলক বিভিন্ন কার্যক্রমের মাধ্যমে আমরা কাজ করতে চাই।'
                : 'We aim to work through humanitarian support, social development and community-focused initiatives.'}
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            {[
              {
                icon: '❤️',
                bn: 'মানবিক সহায়তা',
                en: 'Humanitarian Support',
                textBn: 'প্রয়োজনে মানুষের পাশে দাঁড়ানো এবং সহযোগিতার হাত বাড়িয়ে দেওয়া।',
                textEn: 'Standing beside people in need and providing meaningful support.',
              },
              {
                icon: '🌱',
                bn: 'সামাজিক উন্নয়ন',
                en: 'Social Development',
                textBn: 'সমাজের ইতিবাচক পরিবর্তন ও উন্নয়নে ভূমিকা রাখা।',
                textEn: 'Contributing to positive change and sustainable community development.',
              },
              {
                icon: '🤝',
                bn: 'কমিউনিটি সহযোগিতা',
                en: 'Community Support',
                textBn: 'মানুষকে একসঙ্গে নিয়ে একটি শক্তিশালী ও সহায়ক সমাজ গড়ে তোলা।',
                textEn: 'Bringing people together to build a stronger and supportive community.',
              },
            ].map((item) => (
              <div
                key={item.en}
                className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
                  {item.icon}
                </div>

                <h3 className="mt-6 text-xl font-bold">
                  {isBn ? item.bn : item.en}
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {isBn ? item.textBn : item.textEn}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* DONATION CTA */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center sm:px-8">

          <div className="rounded-3xl bg-gradient-to-br from-emerald-800 to-teal-700 p-10 text-white shadow-2xl sm:p-14">

            <div className="text-5xl">❤️</div>

            <h2 className="mt-6 text-3xl font-black sm:text-4xl">
              {isBn
                ? 'আপনার সহযোগিতা একটি পরিবর্তনের অংশ হতে পারে'
                : 'Your Support Can Be Part of Positive Change'}
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-emerald-50">
              {isBn
                ? 'ব্রাইট ফিউচার ফাউন্ডেশনের কার্যক্রমে আপনার সহযোগিতা আমাদের আরও মানুষের পাশে দাঁড়াতে সাহায্য করবে।'
                : 'Your support can help Bright Future Foundation reach and support more people through our initiatives.'}
            </p>

            <Link
              href={`/${locale}/donate`}
              className="mt-8 inline-flex rounded-xl bg-white px-8 py-3.5 font-bold text-emerald-800 shadow-lg hover:bg-emerald-50"
            >
              {isBn ? 'অনুদান / সহযোগিতা করুন' : 'Donate / Support'}
            </Link>

          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">

          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">
              {isBn ? 'যোগাযোগ' : 'Contact'}
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              {isBn
                ? 'আমাদের সঙ্গে যোগাযোগ করুন'
                : 'Get In Touch'}
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
              {isBn
                ? 'প্রতিষ্ঠানের কার্যক্রম বা সহযোগিতা সম্পর্কে জানতে আমাদের সঙ্গে যোগাযোগ করুন।'
                : 'Contact us to learn more about our activities or ways to support the foundation.'}
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">

            <a
              href="mailto:contact@brightfuturefoundation.org"
              className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              <div className="text-3xl">📧</div>
              <h3 className="mt-3 font-bold">Email</h3>
              <p className="mt-2 text-sm text-gray-600">
                contact@brightfuturefoundation.org
              </p>
            </a>

            <a
              href="https://wa.me/"
              className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              <div className="text-3xl">💬</div>
              <h3 className="mt-3 font-bold">WhatsApp</h3>
              <p className="mt-2 text-sm text-gray-600">
                {isBn ? 'WhatsApp-এ যোগাযোগ করুন' : 'Contact us on WhatsApp'}
              </p>
            </a>

          </div>
        </div>
      </section>

    </main>
  );
}
