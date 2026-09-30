'use client';

import { useEffect, useMemo, useState } from 'react';

export interface HomeMember {
  id: string;
  name: string;
  avatar_url?: string | null;
  position?: {
    title_bn?: string | null;
    title_en?: string | null;
  } | null;
}

export default function MemberCarousel({
  members,
  locale,
}: {
  members: HomeMember[];
  locale: string;
}) {
  const isBn = locale !== 'en';
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const items = useMemo(
    () => members.filter((member) => member?.id && member?.name),
    [members]
  );

  useEffect(() => {
    if (items.length <= 1 || paused) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, 3500);

    return () => window.clearInterval(timer);
  }, [items.length, paused]);

  useEffect(() => {
    if (index >= items.length) setIndex(0);
  }, [index, items.length]);

  if (items.length === 0) return null;

  const visible = Array.from(
    { length: Math.min(4, items.length) },
    (_, offset) => items[(index + offset) % items.length]
  );

  return (
    <section
      className="border-b border-white/10 bg-gradient-to-b from-gray-900 to-gray-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10">
        <div className="mb-8 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">
            {isBn ? 'আমাদের পরিবার' : 'Our Family'}
          </p>

          <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
            {isBn
              ? 'ব্রাইট ফিউচার ফাউন্ডেশনের সদস্যবৃন্দ'
              : 'Bright Future Foundation Members'}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((member, slot) => {
            const designation =
              (isBn
                ? member.position?.title_bn || member.position?.title_en
                : member.position?.title_en || member.position?.title_bn) ||
              (isBn ? 'সদস্য' : 'Member');

            return (
              <article
                key={`${member.id}-${slot}`}
                className="group rounded-2xl border border-white/10 bg-white/[0.06] p-5 text-center shadow-xl backdrop-blur transition duration-500 hover:-translate-y-1 hover:border-emerald-500/40 hover:bg-white/[0.09]"
              >
                <div className="mx-auto h-28 w-28 overflow-hidden rounded-full border-4 border-emerald-500/20 bg-emerald-950/50 shadow-lg">
                  {member.avatar_url ? (
                    <img
                      src={member.avatar_url}
                      alt={member.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl font-black text-emerald-300">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <h3 className="mt-5 text-lg font-black text-white">
                  {member.name}
                </h3>

                <p className="mt-1 text-sm font-semibold text-emerald-400">
                  {designation}
                </p>
              </article>
            );
          })}
        </div>

        {items.length > 1 && (
          <div className="mt-7 flex justify-center gap-2">
            {items.map((member, dotIndex) => (
              <button
                key={member.id}
                type="button"
                aria-label={`Member ${dotIndex + 1}`}
                onClick={() => setIndex(dotIndex)}
                className={`h-2.5 rounded-full transition-all ${
                  dotIndex === index
                    ? 'w-8 bg-emerald-400'
                    : 'w-2.5 bg-white/25 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
