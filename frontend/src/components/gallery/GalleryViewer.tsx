'use client';

import { useEffect, useState } from 'react';

export type GalleryPhoto = {
  id: string;
  src: string;
  alt: string;
  title?: string;
};

type Props = {
  photos: GalleryPhoto[];
  locale: 'bn' | 'en';
};

export default function GalleryViewer({ photos, locale }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = () => setActiveIndex(null);

  const previous = () => {
    setActiveIndex((current) => {
      if (current === null) return null;
      return current === 0 ? photos.length - 1 : current - 1;
    });
  };

  const next = () => {
    setActiveIndex((current) => {
      if (current === null) return null;
      return current === photos.length - 1 ? 0 : current + 1;
    });
  };

  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') previous();
      if (event.key === 'ArrowRight') next();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, photos.length]);

  if (photos.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center text-gray-500">
        {locale === 'bn'
          ? 'এই অ্যালবামে এখনও কোনো ছবি নেই।'
          : 'No images in this album yet.'}
      </div>
    );
  }

  const activePhoto =
    activeIndex !== null ? photos[activeIndex] : null;

  return (
    <>
      <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`${locale === 'bn' ? 'ছবি দেখুন' : 'View image'}: ${photo.alt}`}
            className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100 text-left shadow-sm outline-none transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:ring-4 focus-visible:ring-emerald-200"
          >
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent opacity-60 transition duration-300 group-hover:opacity-100" />

            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
              {photo.title && (
                <p className="line-clamp-2 text-sm font-semibold text-white drop-shadow sm:text-base">
                  {photo.title}
                </p>
              )}

              <p className="mt-1 text-xs font-medium text-white/80 opacity-0 transition group-hover:opacity-100">
                {locale === 'bn'
                  ? 'বড় করে দেখতে চাপুন'
                  : 'Click to view'}
              </p>
            </div>
          </button>
        ))}
      </div>

      {activePhoto && activeIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-3 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.alt}
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label={locale === 'bn' ? 'বন্ধ করুন' : 'Close'}
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white backdrop-blur transition hover:bg-white/20 sm:right-6 sm:top-6"
          >
            ×
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  previous();
                }}
                aria-label={locale === 'bn' ? 'আগের ছবি' : 'Previous image'}
                className="absolute left-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-3xl text-white backdrop-blur transition hover:bg-white/20 sm:left-6"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  next();
                }}
                aria-label={locale === 'bn' ? 'পরের ছবি' : 'Next image'}
                className="absolute right-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-3xl text-white backdrop-blur transition hover:bg-white/20 sm:right-6"
              >
                ›
              </button>
            </>
          )}

          <div
            className="flex max-h-[92vh] max-w-6xl flex-col items-center"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={activePhoto.src}
              alt={activePhoto.alt}
              className="max-h-[80vh] max-w-full rounded-xl object-contain shadow-2xl"
            />

            <div className="mt-4 text-center text-white">
              {activePhoto.title && (
                <p className="text-base font-semibold sm:text-lg">
                  {activePhoto.title}
                </p>
              )}

              <p className="mt-1 text-sm text-white/60">
                {activeIndex + 1} / {photos.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
