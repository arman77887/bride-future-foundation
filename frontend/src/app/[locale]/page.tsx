import Link from 'next/link';

export default function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale === 'bn' ? 'bn' : 'en';
  const isBn = locale === 'bn';

  const leadership = [
    {
      roleBn: 'সভাপতি',
      roleEn: 'President',
      nameBn: 'সভাপতির নাম',
      nameEn: 'President Name',
      descriptionBn:
        'প্রতিষ্ঠানের নেতৃত্ব, নীতি নির্ধারণ এবং সামগ্রিক কার্যক্রম পরিচালনায় গুরুত্বপূর্ণ ভূমিকা পালন করছেন।',
      descriptionEn:
        'Provides leadership, strategic direction and overall guidance for the foundation.',
      featured: true,
    },
    {
      roleBn: 'সাধারণ সম্পাদক',
      roleEn: 'General Secretary',
      nameBn: 'ব্যক্তির নাম',
      nameEn: 'Person Name',
      descriptionBn:
        'প্রতিষ্ঠানের প্রশাসনিক ও সাংগঠনিক কার্যক্রম সমন্বয়ে দায়িত্ব পালন করছেন।',
      descriptionEn:
        'Coordinates administrative and organizational activities of the foundation.',
    },
    {
      roleBn: 'কোষাধ্যক্ষ',
      roleEn: 'Treasurer',
      nameBn: 'ব্যক্তির নাম',
      nameEn: 'Person Name',
      descriptionBn:
        'আর্থিক ব্যবস্থাপনা ও স্বচ্ছতা নিশ্চিত করতে গুরুত্বপূর্ণ দায়িত্ব পালন করছেন।',
      descriptionEn:
        'Helps maintain responsible financial management and transparency.',
    },
    {
      roleBn: 'নির্বাহী সদস্য',
      roleEn: 'Executive Member',
      nameBn: 'ব্যক্তির নাম',
      nameEn: 'Executive Member',
      descriptionBn:
        'প্রতিষ্ঠানের বিভিন্ন সামাজিক ও উন্নয়নমূলক কার্যক্রমে সক্রিয়ভাবে দায়িত্ব পালন করছেন।',
      descriptionEn:
        'Actively contributes to the foundation’s social and development initiatives.',
    },
  ];

  const services = [
    {
      icon: '❤️',
      titleBn: 'মানবিক সহায়তা',
      titleEn: 'Humanitarian Support',
      textBn: 'প্রয়োজনে মানুষের পাশে দাঁড়াতে আপনার সহযোগিতা আমাদের শক্তি।',
      textEn: 'Your support helps us stand beside people when they need it most.',
      href: `/${locale}/donate`,
      bg: 'bg-rose-50',
    },
    {
      icon: '💼',
      titleBn: 'কর্মসংস্থান',
      titleEn: 'Career Opportunities',
      textBn: 'বর্তমান চাকরির সুযোগ দেখুন এবং যোগ্যতা অনুযায়ী আবেদন করুন।',
      textEn:
        'Explore current opportunities and apply for positions that match your skills.',
      href: `/${locale}/vacancies`,
      bg: 'bg-blue-50',
    },
    {
      icon: '👥',
      titleBn: 'অফিসার ডিরেক্টরি',
      titleEn: 'Officer Directory',
      textBn: 'প্রতিষ্ঠানের যাচাইকৃত কর্মকর্তাদের পরিচয় ও দায়িত্ব সম্পর্কে জানুন।',
      textEn:
        'Learn about our verified officers and their institutional responsibilities.',
      href: `/${locale}/officers`,
      bg: 'bg-purple-50',
    },
  ];

  return (
    <main className="bg-white">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white" />
          <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-emerald-300" />
          <div className="absolute right-1/4 top-1/3 h-72 w-72 rounded-full bg-teal-300 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
          <div className="max-w-4xl">

            <div className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
              <span className="mr-2 h-2 w-2 rounded-full bg-emerald-300" />
              {isBn
                ? 'সামাজিক কল্যাণ ও মানবসেবায় প্রতিশ্রুতিবদ্ধ'
                : 'Committed to Social Welfare & Community Service'}
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-7xl">
              {isBn ? 'ব্রাইড ফিউচার ফাউন্ডেশন' : 'Bride Future Foundation'}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-emerald-50 sm:text-xl">
              {isBn
                ? 'মানবিক মূল্যবোধ, সামাজিক দায়িত্ব ও টেকসই উন্নয়নের মাধ্যমে মানুষের জন্য একটি সুন্দর ও সম্ভাবনাময় ভবিষ্যৎ গড়ে তোলাই আমাদের লক্ষ্য।'
                : 'Our mission is to build a better and more promising future through human values, social responsibility and sustainable development.'}
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href={`/${locale}/donate`}
                className="rounded-xl bg-white px-7 py-3.5 font-bold text-emerald-800 shadow-xl transition hover:-translate-y-1 hover:bg-emerald-50"
              >
                {isBn ? 'অনুদান দিন' : 'Donate Now'}
              </Link>

              <Link
                href={`/${locale}/officers`}
                className="rounded-xl border border-white/40 bg-white/5 px-7 py-3.5 font-bold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/10"
              >
                {isBn ? 'আমাদের কর্মকর্তারা' : 'Meet Our Officers'}
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-gray-200 sm:grid-cols-4">

          {[
            ['500+', isBn ? 'উপকারভোগী' : 'Beneficiaries'],
            ['20+', isBn ? 'প্রকল্প' : 'Projects'],
            ['50+', isBn ? 'স্বেচ্ছাসেবক' : 'Volunteers'],
            ['24/7', isBn ? 'মানবিক অঙ্গীকার' : 'Commitment'],
          ].map(([number, label], index) => (
            <div
              key={label}
              className={`px-5 py-8 text-center ${
                index > 1 ? 'border-t border-gray-200 sm:border-t-0' : ''
              }`}
            >
              <p className="text-3xl font-black text-emerald-700">{number}</p>
              <p className="mt-1 text-sm text-gray-600">{label}</p>
            </div>
          ))}

        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-emerald-700">
                {isBn ? 'আমাদের সম্পর্কে' : 'About Us'}
              </span>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                {isBn
                  ? 'মানুষের পাশে, ভবিষ্যতের পথে'
                  : 'Standing With People, Building the Future'}
              </h2>

              <p className="mt-6 text-lg leading-8 text-gray-600">
                {isBn
                  ? 'ব্রাইড ফিউচার ফাউন্ডেশন একটি মানবিক ও সামাজিক কল্যাণমূলক প্রতিষ্ঠান। আমরা মানুষের জীবনমান উন্নয়ন, সামাজিক সহযোগিতা এবং একটি দায়িত্বশীল ও স্বচ্ছ প্রতিষ্ঠান গড়ে তোলার লক্ষ্যে কাজ করি।'
                  : 'Bride Future Foundation is a humanitarian and social welfare organization working to improve lives, strengthen communities and promote responsible and transparent institutional governance.'}
              </p>

              <Link
                href={`/${locale}/officers`}
                className="mt-8 inline-flex font-bold text-emerald-700 transition hover:text-emerald-900"
              >
                {isBn ? 'আরও জানুন →' : 'Learn More →'}
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {[
                ['🤝', 'মানবসেবা', 'Humanitarian Service'],
                ['🌱', 'উন্নয়ন', 'Development'],
                ['🔎', 'স্বচ্ছতা', 'Transparency'],
                ['❤️', 'সহযোগিতা', 'Community'],
              ].map(([icon, bn, en], index) => (
                <div
                  key={index}
                  className={`rounded-2xl bg-white p-7 shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-1 hover:shadow-lg ${
                    index % 2 ? 'mt-8' : ''
                  }`}
                >
                  <div className="text-3xl">{icon}</div>

                  <h3 className="mt-4 font-bold text-gray-900">
                    {isBn ? bn : en}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {isBn
                      ? 'সামাজিক কল্যাণ ও ইতিবাচক পরিবর্তনের জন্য আমাদের অঙ্গীকার।'
                      : 'Our commitment to social welfare and positive change.'}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
          <div className="mb-12 text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-emerald-700">
              {isBn ? 'আমাদের উদ্দেশ্য' : 'Our Purpose'}
            </span>

            <h2 className="mt-3 text-3xl font-black text-gray-900 sm:text-4xl">
              {isBn ? 'লক্ষ্য ও ভিশন' : 'Mission & Vision'}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">

            <div className="rounded-3xl bg-emerald-800 p-8 text-white shadow-xl sm:p-10">
              <div className="text-4xl">🎯</div>

              <h2 className="mt-6 text-2xl font-black">
                {isBn ? 'আমাদের লক্ষ্য' : 'Our Mission'}
              </h2>

              <p className="mt-4 leading-8 text-emerald-50">
                {isBn
                  ? 'মানবিক সহায়তা, সামাজিক উন্নয়ন এবং মানুষের ক্ষমতায়নের মাধ্যমে একটি দায়িত্বশীল ও কল্যাণমুখী সমাজ গড়ে তোলা।'
                  : 'To build a responsible and caring society through humanitarian support, social development and community empowerment.'}
              </p>
            </div>

            <div className="rounded-3xl bg-gray-900 p-8 text-white shadow-xl sm:p-10">
              <div className="text-4xl">🌍</div>

              <h2 className="mt-6 text-2xl font-black">
                {isBn ? 'আমাদের ভিশন' : 'Our Vision'}
              </h2>

              <p className="mt-4 leading-8 text-gray-300">
                {isBn
                  ? 'এমন একটি ভবিষ্যৎ তৈরি করা যেখানে মানুষ নিরাপদ, মর্যাদাপূর্ণ ও সম্ভাবনাময় জীবনযাপনের সুযোগ পায়।'
                  : 'To create a future where people have the opportunity to live safe, dignified and promising lives.'}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">

          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-emerald-700">
              {isBn ? 'আমাদের কার্যক্রম' : 'What We Do'}
            </span>

            <h2 className="mt-3 text-3xl font-black text-gray-900 sm:text-4xl">
              {isBn ? 'সেবা ও উদ্যোগ' : 'Services & Initiatives'}
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              {isBn
                ? 'মানবিক সহায়তা, কর্মসংস্থান এবং সামাজিক উন্নয়নের বিভিন্ন উদ্যোগে আমরা কাজ করি।'
                : 'We work across humanitarian support, employment opportunities and community development.'}
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.titleEn}
                href={service.href}
                className="group rounded-3xl border border-gray-200 bg-white p-8 transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${service.bg}`}
                >
                  {service.icon}
                </div>

                <h3 className="mt-6 text-xl font-bold text-gray-900 group-hover:text-emerald-700">
                  {isBn ? service.titleBn : service.titleEn}
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {isBn ? service.textBn : service.textEn}
                </p>

                <span className="mt-5 inline-block text-sm font-bold text-emerald-700">
                  {isBn ? 'বিস্তারিত দেখুন →' : 'Explore →'}
                </span>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* LEADERSHIP */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">

          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-emerald-700">
              {isBn ? 'নেতৃত্ব' : 'Leadership'}
            </span>

            <h2 className="mt-3 text-3xl font-black text-gray-900 sm:text-4xl">
              {isBn ? 'প্রতিষ্ঠানের নেতৃত্ব' : 'Our Leadership'}
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              {isBn
                ? 'দক্ষতা, দায়িত্ববোধ ও সততার সঙ্গে যারা প্রতিষ্ঠানকে এগিয়ে নিয়ে যাচ্ছেন।'
                : 'The people helping guide the foundation with responsibility, integrity and dedication.'}
            </p>
          </div>

          {/* PRESIDENT */}
          <div className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-3xl bg-gray-50 shadow-xl ring-1 ring-gray-200">
            <div className="grid md:grid-cols-2">

              <div className="flex min-h-[380px] items-center justify-center bg-gradient-to-br from-emerald-800 to-teal-700 p-10">
                <div className="text-center">

                  <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-full border-8 border-white/20 bg-white/10 text-7xl shadow-2xl">
                    👤
                  </div>

                  <p className="mt-6 text-sm font-bold uppercase tracking-widest text-emerald-100">
                    {isBn ? 'প্রতিষ্ঠানের সভাপতি' : 'President'}
                  </p>

                </div>
              </div>

              <div className="flex flex-col justify-center p-8 sm:p-10">

                <span className="text-sm font-bold text-emerald-700">
                  {isBn ? leadership[0].roleBn : leadership[0].roleEn}
                </span>

                <h3 className="mt-2 text-3xl font-black text-gray-900">
                  {isBn ? leadership[0].nameBn : leadership[0].nameEn}
                </h3>

                <p className="mt-5 leading-8 text-gray-600">
                  {isBn
                    ? leadership[0].descriptionBn
                    : leadership[0].descriptionEn}
                </p>

                <div className="mt-7 h-1 w-16 rounded-full bg-emerald-600" />

              </div>

            </div>
          </div>

          {/* THREE MEMBERS */}
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {leadership.slice(1).map((person) => (
              <div
                key={person.roleEn}
                className="group overflow-hidden rounded-3xl bg-gray-50 shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-64 items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-white text-6xl shadow-lg transition group-hover:scale-105">
                    👤
                  </div>
                </div>

                <div className="p-7">
                  <span className="text-sm font-bold text-emerald-700">
                    {isBn ? person.roleBn : person.roleEn}
                  </span>

                  <h3 className="mt-2 text-xl font-black text-gray-900">
                    {isBn ? person.nameBn : person.nameEn}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    {isBn
                      ? person.descriptionBn
                      : person.descriptionEn}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* LATEST ACTIVITIES */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-emerald-700">
                {isBn ? 'সর্বশেষ কার্যক্রম' : 'Latest Activities'}
              </span>

              <h2 className="mt-3 text-3xl font-black text-gray-900">
                {isBn ? 'আমাদের আপডেট' : 'Our Updates'}
              </h2>
            </div>

            <span className="text-sm text-gray-500">
              {isBn
                ? 'নতুন কার্যক্রম শীঘ্রই প্রকাশিত হবে'
                : 'New activities will be published soon'}
            </span>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                  📰
                </div>

                <h3 className="mt-5 font-bold text-gray-900">
                  {isBn
                    ? 'নতুন কার্যক্রমের আপডেট'
                    : 'Latest Foundation Update'}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {isBn
                    ? 'প্রতিষ্ঠানের নতুন সংবাদ ও কার্যক্রম এখানে প্রকাশ করা হবে।'
                    : 'Foundation news and activities will appear here.'}
                </p>

                <span className="mt-5 inline-block text-sm font-bold text-emerald-700">
                  {isBn ? 'শীঘ্রই আসছে' : 'Coming Soon'}
                </span>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* CONTACT */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">

          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">

            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-emerald-700">
                {isBn ? 'যোগাযোগ' : 'Contact'}
              </span>

              <h2 className="mt-3 text-3xl font-black text-gray-900 sm:text-4xl">
                {isBn
                  ? 'আমাদের সঙ্গে যোগাযোগ করুন'
                  : 'Get In Touch With Us'}
              </h2>

              <p className="mt-5 max-w-xl leading-8 text-gray-600">
                {isBn
                  ? 'প্রতিষ্ঠানের কার্যক্রম, সহযোগিতা অথবা যেকোনো প্রয়োজনীয় তথ্যের জন্য আমাদের সঙ্গে যোগাযোগ করুন।'
                  : 'Contact us for information about our activities, partnerships, support or any other inquiry.'}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <div className="text-2xl">📍</div>
                <h3 className="mt-4 font-bold text-gray-900">
                  {isBn ? 'ঠিকানা' : 'Address'}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {isBn ? 'প্রতিষ্ঠানের ঠিকানা এখানে থাকবে' : 'Foundation address'}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <div className="text-2xl">📞</div>
                <h3 className="mt-4 font-bold text-gray-900">
                  {isBn ? 'ফোন' : 'Phone'}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  +966 XX XXX XXXX
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <div className="text-2xl">✉️</div>
                <h3 className="mt-4 font-bold text-gray-900">
                  {isBn ? 'ইমেইল' : 'Email'}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  info@bridefuturefoundation.org
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <div className="text-2xl">🤝</div>
                <h3 className="mt-4 font-bold text-gray-900">
                  {isBn ? 'সহযোগিতা' : 'Partnership'}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {isBn ? 'আমাদের সঙ্গে কাজ করুন' : 'Work with us'}
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center sm:px-8">

          <span className="text-sm font-bold uppercase tracking-widest text-emerald-400">
            {isBn ? 'আপনার সহযোগিতা প্রয়োজন' : 'Your Support Matters'}
          </span>

          <h2 className="mt-4 text-3xl font-black sm:text-4xl">
            {isBn
              ? 'একসাথে আমরা একটি সুন্দর ভবিষ্যৎ গড়তে পারি'
              : 'Together, We Can Build a Better Future'}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-gray-300">
            {isBn
              ? 'আপনার ছোট একটি সহযোগিতাও মানুষের জীবনে বড় পরিবর্তন আনতে পারে।'
              : 'Even a small contribution can make a meaningful difference in someone’s life.'}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">

            <Link
              href={`/${locale}/donate`}
              className="rounded-xl bg-emerald-600 px-7 py-3.5 font-bold text-white transition hover:-translate-y-1 hover:bg-emerald-500"
            >
              {isBn ? 'এখনই অনুদান দিন' : 'Donate Now'}
            </Link>

            <Link
              href={`/${locale}/apply`}
              className="rounded-xl border border-gray-600 px-7 py-3.5 font-bold text-white transition hover:-translate-y-1 hover:bg-white/10"
            >
              {isBn ? 'আবেদন করুন' : 'Apply Now'}
            </Link>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-800 bg-gray-950 text-gray-400">

        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10">

          <div className="grid gap-10 md:grid-cols-3">

            <div>
              <h3 className="text-lg font-black text-white">
                {isBn ? 'ব্রাইড ফিউচার ফাউন্ডেশন' : 'Bride Future Foundation'}
              </h3>

              <p className="mt-4 max-w-sm text-sm leading-7">
                {isBn
                  ? 'মানবিক মূল্যবোধ ও সামাজিক দায়িত্বের মাধ্যমে একটি সুন্দর ভবিষ্যৎ গড়ার প্রত্যয়ে।'
                  : 'Building a better future through human values and social responsibility.'}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-white">
                {isBn ? 'দ্রুত লিংক' : 'Quick Links'}
              </h3>

              <div className="mt-4 flex flex-col gap-3 text-sm">
                <Link
                  href={`/${locale}`}
                  className="transition hover:text-emerald-400"
                >
                  {isBn ? 'হোম' : 'Home'}
                </Link>

                <Link
                  href={`/${locale}/officers`}
                  className="transition hover:text-emerald-400"
                >
                  {isBn ? 'কর্মকর্তারা' : 'Officers'}
                </Link>

                <Link
                  href={`/${locale}/vacancies`}
                  className="transition hover:text-emerald-400"
                >
                  {isBn ? 'চাকরির সুযোগ' : 'Vacancies'}
                </Link>

                <Link
                  href={`/${locale}/donate`}
                  className="transition hover:text-emerald-400"
                >
                  {isBn ? 'অনুদান' : 'Donate'}
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-white">
                {isBn ? 'যোগাযোগ' : 'Contact'}
              </h3>

              <div className="mt-4 space-y-3 text-sm">
                <p>📞 +966 XX XXX XXXX</p>
                <p>✉️ info@bridefuturefoundation.org</p>
                <p>📍 {isBn ? 'প্রতিষ্ঠানের ঠিকানা' : 'Foundation Address'}</p>
              </div>
            </div>

          </div>

          <div className="mt-10 border-t border-gray-800 pt-7 text-center text-sm">

            <p>
              © {new Date().getFullYear()} Bride Future Foundation.{' '}
              {isBn ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All rights reserved.'}
            </p>


          </div>

        </div>
      </footer>

    </main>
  );
}
