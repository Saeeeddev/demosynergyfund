'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';
import { PLATFORM_URL } from '@/lib/config';

type Slide = {
  id: string;
  gradient: string;
  eyebrow: string;
  title: React.ReactNode;
  body: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  image: string;
  imageAlt: string;
};

const SLIDES: Slide[] = [
  {
    id: 'marketplace',
    gradient:
      'linear-gradient(135deg, #cfe2e4 0%, #e4eef0 48%, #f7f9fa 100%)',
    eyebrow: 'بازار سهم نیروگاه‌های خورشیدی',
    title: (
      <>
       خرید و فروش
        <br />
     سهم نیروگاه خورشیدی
      </>
    ),
    body:
      'با سینرژی می‌توانید در هر زمان سهمی از نیروگاه‌های خورشیدی واقعی را آنلاین خریداری کنید یا سهم خود را در بازار به فروش برسانید؛ شفاف، سریع و بدون پیچیدگی.',
    primary: { label: 'شروع سرمایه‌گذاری', href: '#opportunities' },
    secondary: { label: 'مشاهده نیروگاه‌ها', href: '#opportunities' },
    image: '/Images/hero/hero-1-v4.webp',
    imageAlt: 'اپلیکیشن خرید و فروش سهم نیروگاه خورشیدی سینرژی',
  },
  {
    id: 'income',
    gradient:
      'linear-gradient(135deg, #d7e8c4 0%, #e8f1dd 48%, #f8faf4 100%)',
    eyebrow: 'درآمد سبز و روزشمار',
    title: (
      <>
        کسب درآمد  
        <br />
         از فروش برق نیروگاه
      </>
    ),
    body:
      'به‌ازای هر سهمی که در اختیار دارید، از درآمد فروش برق نیروگاه سهم می‌برید.سرمایه خود را در برابر تورم مقاوم می کنید, سودی پایدار از انرژی پاک که به‌صورت دوره‌ای مستقیم به کیف پول شما واریز می‌شود.',
    primary: { label: 'مشاهده دموی داشبورد', href: PLATFORM_URL },
    secondary: { label: ' از کجا شروع کنم ', href: '#how' },
    image: '/Images/hero/hero-2.webp',
    imageAlt: 'درآمد حاصل از فروش برق نیروگاه خورشیدی',
  },
];

const AUTO_MS = 9000;

export default function Hero() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((i: number) => {
    setActive(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timerRef.current = setInterval(() => {
      setActive((a) => (a + 1) % SLIDES.length);
    }, AUTO_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [active]);

  const slide = SLIDES[active];

  return (
    <section className="relative overflow-hidden" style={{ background: slide.gradient, transition: 'background 600ms var(--ease-out-strong)' }}>
      <div className="wrap">
        <div className="grid min-h-[560px] items-center gap-8 pt-28 pb-24 md:min-h-[640px] md:grid-cols-2 md:pt-32 md:pb-28">
          {/* Image — left column (visually left in RTL grid: place first, order to start=right for text) */}
          <div className="relative order-1 flex justify-center md:order-none md:justify-start">
            <div key={slide.id} className="rise w-full max-w-[520px]">
              <Image
                src={slide.image}
                alt={slide.imageAlt}
                width={794}
                height={760}
                priority
                className="h-auto w-full object-contain drop-shadow-[0_30px_60px_rgba(35,39,46,0.14)]"
              />
            </div>
          </div>

          {/* Text — right column in RTL */}
          <div key={`${slide.id}-txt`} className="rise order-2 text-center md:order-none md:text-right">
            <p className="text-base font-medium text-ink-2 md:text-lg">{slide.eyebrow}</p>
            <h1 className="mt-4 text-4xl font-black leading-[1.35] text-ink sm:text-5xl md:text-[54px] md:leading-[1.3]">
              {slide.title}
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-[15px] leading-[2] text-ink-2 md:mx-0 md:text-base">
              {slide.body}
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row md:justify-end">
              {slide.secondary && (
                <a
                  href={slide.secondary.href}
                  className="inline-flex h-12 items-center justify-center rounded-pill border border-ink/15 bg-white/70 px-7 text-[15px] font-medium text-ink-2 backdrop-blur transition-[transform,background-color] duration-200 ease-out hover:bg-white active:scale-[0.97]"
                >
                  {slide.secondary.label}
                </a>
              )}
              <a
                href={slide.primary.href}
                className="inline-flex h-12 items-center justify-center gap-1.5 rounded-pill bg-primary px-8 text-[15px] font-medium text-white shadow-[0_10px_28px_rgba(109,127,159,0.4)] transition-[transform,background-color,box-shadow] duration-200 ease-out hover:bg-primary-deep active:scale-[0.97]"
              >
                {slide.primary.label}
                <ChevronLeft size={18} strokeWidth={2.4} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* slide timers — wide progress bars, bottom center; the active bar fills over AUTO_MS like a countdown */}
      <div className="absolute inset-x-0 bottom-6 z-20 mx-auto flex w-full max-w-lg items-center gap-3 px-6 md:bottom-9">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => go(i)}
            aria-label={`اسلاید ${i + 1}`}
            className="group relative h-[7px] flex-1 overflow-hidden rounded-pill bg-ink/15 transition-colors duration-200 hover:bg-ink/25"
          >
            {i === active && (
              <span
                key={active}
                className="hero-timer-fill absolute inset-y-0 right-0 block w-full rounded-pill bg-ink/70"
                style={{ animationDuration: `${AUTO_MS}ms` }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
