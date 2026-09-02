import Link from 'next/link';

export default function AboutPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale === 'bn' ? 'bn' : 'en';
  const isBn = locale === 'bn';

  const values = [
    {
      icon: '❤️',
      bn: 'মানবিকতা',
      en: 'Humanity',
      textBn: 'প্রতিটি মানুষের মর্যাদা ও কল্যাণকে গুরুত্ব দেওয়া।',
      textEn: 'Respecting the dignity and welfare of every person.',
    },
    {
      icon: '🔎',
      bn: 'স্বচ্ছতা',
      en: 'Transparency',
      textBn: 'দায়িত্বশীল ও স্বচ্ছভাবে কার্যক্রম পরিচালনা করা।',
      textEn: 'Operating responsibly and maintaining transparency.',
    },
    {
      icon: '🌱',
      bn: 'উন্নয়ন',
      en: 'Development',
      textBn: 'দীর্ঘমেয়াদি ইতিবাচক পরিবর্তনের জন্য কাজ করা।',
      textEn: 'Working toward meaningful and sustainable positive change.',
    },
  ];

  const commitments = [
    {
      bn: 'মানুষের মর্যাদা ও কল্যাণকে গুরুত্ব দেওয়া',
      en: 'Prioritizing dignity and human welfare',
    },
    {
      bn: 'সামাজিক উন্নয়নে ইতিবাচক ভূমিকা রাখা',
      en: 'Contributing positively to social development',
    },
    {
      bn: 'দায়িত্বশীল ও স্বচ্ছ কার্যক্রম পরিচালনা',
      en: 'Maintaining responsible and transparent operations',
    },
    {
      bn: 'কমিউনিটিকে সঙ্গে নিয়ে এগিয়ে যাওয়া',
      en: 'Moving forward together with the community',
    },
  ];

  return (
    <main className="bg-white text-gray-900">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white" />
          <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-emerald-300" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="max-w-4xl">
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
              <span className="mr-2 h-2 w-2 rounded-full bg-emerald-300" />
              {isBn ? 'আমাদের সম্পর্কে' : 'About Us'}
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              {isBn
                ? 'ব্রাইড ফিউচার ফাউন্ডেশন'
                : 'Bright Further Foundation'}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-emerald-50 sm:text-xl">
              {isBn
                ? 'মানুষের কল্যাণ, সামাজিক উন্নয়ন এবং একটি সুন্দর ভবিষ্যৎ গড়ে তোলার প্রত্যয়ে আমাদের যাত্রা।'
                : 'Our journey is dedicated to human welfare, social development and building a better future.'}
            </p>
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">
                {isBn ? 'আমরা কারা' : 'Who We Are'}
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                {isBn
                  ? 'মানুষের পাশে থাকার একটি অঙ্গীকার'
                  : 'A Commitment to Stand With People'}
              </h2>

              <p className="mt-6 text-lg leading-8 text-gray-600">
                {isBn
                  ? 'ব্রাইট ফিউচার ফাউন্ডেশন একটি মানবিক ও সামাজিক কল্যাণমূলক প্রতিষ্ঠান। মানুষের প্রয়োজনের সময়ে পাশে দাঁড়ানো, সামাজিক উন্নয়নে অবদান রাখা এবং মানুষের সম্ভাবনাকে এগিয়ে নিতে সহযোগিতা করাই আমাদের মূল উদ্দেশ্য।'
                  : 'Bright Future Foundation is a humanitarian and social welfare organization. Our purpose is to support people in times of need, contribute to social development and help communities move toward greater opportunities.'}
              </p>

              <p className="mt-5 leading-8 text-gray-600">
                {isBn
                  ? 'আমরা বিশ্বাস করি, দায়িত্বশীলতা, স্বচ্ছতা এবং মানুষের সম্মিলিত সহযোগিতার মাধ্যমে দীর্ঘমেয়াদি ইতিবাচক পরিবর্তন সম্ভব।'
                  : 'We believe that responsible action, transparency and collective support can create meaningful and lasting positive change.'}
              </p>
            </div>

            {/* COMMITMENT CARD */}
            <div className="relative overflow-hidden rounded-3xl bg-gray-950 p-8 text-white shadow-2xl sm:p-10">
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-700/30 blur-3xl" />

              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-700 text-3xl shadow-lg">
                  🤝
                </div>

                <h3 className="mt-6 text-2xl font-black">
                  {isBn ? 'আমাদের অঙ্গীকার' : 'Our Commitment'}
                </h3>

                <ul className="mt-7 space-y-5">
                  {commitments.map((item) => (
                    <li
                      key={item.en}
                      className="flex items-start gap-3 text-gray-300"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-black text-white">
                        ✓
                      </span>

                      <span className="leading-7">
                        {isBn ? item.bn : item.en}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-24">

          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">
              {isBn ? 'আমাদের মূল্যবোধ' : 'Our Values'}
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
              {isBn
                ? 'যে মূল্যবোধ আমাদের পরিচালনা করে'
                : 'Values That Guide Us'}
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {values.map((item) => (
              <div
                key={item.en}
                className="group rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-3xl transition group-hover:bg-emerald-100">
                  {item.icon}
                </div>

                <h3 className="mt-6 text-xl font-black text-gray-900">
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

      {/* PRINCIPLES */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="grid gap-8 md:grid-cols-2">

            <div className="rounded-3xl bg-emerald-800 p-8 text-white shadow-xl sm:p-10">
              <div className="text-4xl">🎯</div>

              <h2 className="mt-5 text-2xl font-black">
                {isBn ? 'আমাদের উদ্দেশ্য' : 'Our Purpose'}
              </h2>

              <p className="mt-4 leading-8 text-emerald-50">
                {isBn
                  ? 'মানুষের প্রয়োজনের সময়ে পাশে দাঁড়ানো এবং সামাজিক কল্যাণে দায়িত্বশীল ভূমিকা রাখা।'
                  : 'To stand beside people when they need support and play a responsible role in social welfare.'}
              </p>
            </div>

            <div className="rounded-3xl bg-gray-900 p-8 text-white shadow-xl sm:p-10">
              <div className="text-4xl">🌍</div>

              <h2 className="mt-5 text-2xl font-black">
                {isBn ? 'আমাদের ভবিষ্যৎ ভাবনা' : 'Our Future Vision'}
              </h2>

              <p className="mt-4 leading-8 text-gray-300">
                {isBn
                  ? 'এমন একটি ভবিষ্যৎ গড়ে তুলতে কাজ করা যেখানে মানুষ মর্যাদা, নিরাপত্তা ও সম্ভাবনার সঙ্গে এগিয়ে যেতে পারে।'
                  : 'To help create a future where people can move forward with dignity, security and opportunity.'}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center sm:px-8 lg:py-24">
          <div className="rounded-3xl bg-gradient-to-br from-emerald-800 to-teal-700 p-10 text-white shadow-2xl sm:p-14">

            <div className="text-5xl">❤️</div>

            <h2 className="mt-6 text-3xl font-black sm:text-4xl">
              {isBn
                ? 'আমাদের সঙ্গে এগিয়ে চলুন'
                : 'Move Forward With Us'}
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-emerald-50">
              {isBn
                ? 'মানুষের জন্য আরও ভালো কিছু করার যাত্রায় আপনার সহযোগিতা আমাদের অনুপ্রেরণা।'
                : 'Your support inspires us in our journey to do more for people and communities.'}
            </p>

            <Link
              href={`/${locale}/donate`}
              className="mt-8 inline-flex rounded-xl bg-white px-8 py-3.5 font-bold text-emerald-800 shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-50"
            >
              {isBn ? 'সহযোগিতা করুন' : 'Support Us'}
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
