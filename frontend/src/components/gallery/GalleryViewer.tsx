'use client';

import { useCallback, useEffect, useState } from 'react';

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
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setFeaturedIndex(0);
  }, [photos.length]);

  useEffect(() => {
    if (photos.length <= 1 || paused || lightboxIndex !== null) return;

    const timer = window.setInterval(() => {
      setFeaturedIndex((current) => (current + 1) % photos.length);
    }, 2000);

    return () => window.clearInterval(timer);
  }, [photos.length, paused, lightboxIndex]);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const previousLightbox = useCallback(() => {
    setLightboxIndex((current) => {
      if (current === null) return null;
      return current === 0 ? photos.length - 1 : current - 1;
    });
  }, [photos.length]);

  const nextLightbox = useCallback(() => {
    setLightboxIndex((current) => {
      if (current === null) return null;
      return current === photos.length - 1 ? 0 : current + 1;
    });
  }, [photos.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') previousLightbox();
      if (event.key === 'ArrowRight') nextLightbox();
    };

    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    lightboxIndex,
    closeLightbox,
    previousLightbox,
    nextLightbox,
  ]);

  if (photos.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 px-6 py-14 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
          ◫
        </div>
        <p className="mt-4 font-medium text-gray-500">
          {locale === 'bn'
            ? 'এই অ্যালবামে এখনও কোনো ছবি নেই।'
            : 'No images in this album yet.'}
        </p>
      </div>
    );
  }

  const featuredPhoto = photos[featuredIndex];
  const lightboxPhoto =
    lightboxIndex !== null ? photos[lightboxIndex] : null;

  return (
    <>
      <div
        className="space-y-5"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="group relative overflow-hidden rounded-3xl bg-gray-950 shadow-xl">
          <button
            type="button"
            onClick={() => setLightboxIndex(featuredIndex)}
            className="relative block w-full overflow-hidden text-left outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
            aria-label={
              locale === 'bn'
                ? 'বড় করে ছবি দেখুন'
                : 'View image fullscreen'
            }
          >
            <div className="relative aspect-[16/9] w-full sm:aspect-[16/8] lg:aspect-[16/7]">
              {photos.map((photo, index) => (
                <img
                  key={photo.id}
                  src={photo.src}
                  alt={photo.alt}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
                    index === featuredIndex
                      ? 'scale-100 opacity-100'
                      : 'scale-[1.02] opacity-0'
                  }`}
                />
              ))}

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/10" />

              <div className="absolute left-4 top-4 flex items-center gap-2 sm:left-6 sm:top-6">
                <span className="rounded-full border border-white/20 bg-black/35 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md sm:text-sm">
                  {featuredIndex + 1} / {photos.length}
                </span>

                {photos.length > 1 && (
                  <span className="rounded-full border border-white/20 bg-black/35 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md">
                    {locale === 'bn'
                      ? 'স্বয়ংক্রিয় স্লাইড'
                      : 'Auto slideshow'}
                  </span>
                )}
              </div>

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-9">
                {featuredPhoto.title && (
                  <h3 className="max-w-3xl text-lg font-bold text-white drop-shadow-lg sm:text-2xl">
                    {featuredPhoto.title}
                  </h3>
                )}

                <div className="mt-2 flex items-center gap-2 text-xs font-medium text-white/80 sm:text-sm">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                    ⛶
                  </span>
                  <span>
                    {locale === 'bn'
                      ? 'পূর্ণ আকারে দেখতে ছবিতে চাপুন'
                      : 'Click image to view fullscreen'}
                  </span>
                </div>
              </div>
            </div>
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  setFeaturedIndex((featuredIndex - 1 + photos.length) % photos.length)
                }
                aria-label={locale === 'bn' ? 'আগের ছবি' : 'Previous image'}
                className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-3xl text-white opacity-100 backdrop-blur-md transition hover:bg-black/50 sm:left-5 lg:opacity-0 lg:group-hover:opacity-100"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={() =>
                  setFeaturedIndex((featuredIndex + 1) % photos.length)
                }
                aria-label={locale === 'bn' ? 'পরের ছবি' : 'Next image'}
                className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-3xl text-white opacity-100 backdrop-blur-md transition hover:bg-black/50 sm:right-5 lg:opacity-0 lg:group-hover:opacity-100"
              >
                ›
              </button>
            </>
          )}

          {photos.length > 1 && (
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 sm:bottom-4">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setFeaturedIndex(index)}
                  aria-label={`${locale === 'bn' ? 'ছবি' : 'Image'} ${index + 1}`}
                  className={`h-1.5 rounded-full shadow transition-all duration-300 ${
                    index === featuredIndex
                      ? 'w-7 bg-white'
                      : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => {
                setFeaturedIndex(index);
                setPaused(true);
              }}
              onDoubleClick={() => setLightboxIndex(index)}
              className={`relative h-20 min-w-[104px] overflow-hidden rounded-2xl bg-gray-100 transition sm:h-24 sm:min-w-[132px] ${
                index === featuredIndex
                  ? 'ring-3 ring-emerald-500 ring-offset-2'
                  : 'opacity-75 hover:opacity-100'
              }`}
              aria-label={`${locale === 'bn' ? 'ছবি নির্বাচন করুন' : 'Select image'} ${index + 1}`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-1.5 right-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {index + 1}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-gray-500 sm:text-sm">
            {locale === 'bn'
              ? `${photos.length}টি ছবি • প্রতি ২ সেকেন্ডে পরিবর্তন`
              : `${photos.length} photos • changes every 2 seconds`}
          </p>

          <button
            type="button"
            onClick={() => setLightboxIndex(featuredIndex)}
            className="rounded-full bg-emerald-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-800 sm:text-sm"
          >
            {locale === 'bn' ? 'পূর্ণ ছবি দেখুন' : 'View full image'}
          </button>
        </div>
      </div>

      {lightboxPhoto && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-3 backdrop-blur-md sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={lightboxPhoto.alt}
          onClick={closeLightbox}
        >
          <div className="absolute left-4 top-4 z-30 rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur sm:left-6 sm:top-6">
            {lightboxIndex + 1} / {photos.length}
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              closeLightbox();
            }}
            aria-label={locale === 'bn' ? 'বন্ধ করুন' : 'Close'}
            className="absolute right-4 top-4 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-3xl text-white backdrop-blur transition hover:bg-white/20 sm:right-6 sm:top-6"
          >
            ×
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  previousLightbox();
                }}
                aria-label={locale === 'bn' ? 'আগের ছবি' : 'Previous image'}
                className="absolute left-2 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-4xl text-white backdrop-blur transition hover:bg-white/20 sm:left-6"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  nextLightbox();
                }}
                aria-label={locale === 'bn' ? 'পরের ছবি' : 'Next image'}
                className="absolute right-2 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-4xl text-white backdrop-blur transition hover:bg-white/20 sm:right-6"
              >
                ›
              </button>
            </>
          )}

          <div
            className="flex max-h-[94vh] w-full max-w-7xl flex-col items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={lightboxPhoto.src}
              alt={lightboxPhoto.alt}
              className="max-h-[82vh] max-w-full select-none rounded-xl object-contain shadow-2xl"
            />

            {(lightboxPhoto.title || photos.length > 1) && (
              <div className="mt-4 max-w-3xl text-center text-white">
                {lightboxPhoto.title && (
                  <p className="text-base font-semibold sm:text-lg">
                    {lightboxPhoto.title}
                  </p>
                )}
                <p className="mt-1 text-xs text-white/55">
                  {locale === 'bn'
                    ? '← → দিয়ে ছবি পরিবর্তন করুন • ESC দিয়ে বন্ধ করুন'
                    : 'Use ← → to navigate • ESC to close'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
