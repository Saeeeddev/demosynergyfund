'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { UserRoundCheck, SunMedium, ShoppingCart, Wallet, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = {
  id: string;
  label: string;
  Icon: LucideIcon;
  image: string;
  caption: string;
  bg: string;
};

const TABS: Tab[] = [
  {
    id: 'easyfilter',
    label:  '  ثبت‌نام  ',
    Icon: UserRoundCheck,
    image: '/Images/how-works/Register-Auth.webp',
    caption:
      'اول تو چند دقیقه ثبت‌نام کن و احراز هویتت رو کاملاً آنلاین انجام بده؛ نه کاغذبازی، نه رفت‌وآمد.',
    bg: 'linear-gradient(160deg, #dbe4f1 0%, #eef1f6 52%, #f7f9fc 100%)',
  },
  {
    id: 'market-view',
    label: 'انتخاب نیروگاه',
    Icon: SunMedium,
    image: '/Images/how-works/Select-project.webp',
    caption:
      'بعدش بین نیروگاه‌های خورشیدی فعال بگرد و بر اساس بازده و ظرفیت، همونی که دوست داری رو انتخاب کن.',
    bg: 'linear-gradient(160deg, #cfe2e4 0%, #e4eef0 52%, #f7f9fa 100%)',
  },
  {
    id: 'marketmap',
    label: 'خرید سهم',
    Icon: ShoppingCart,
    image: '/Images/how-works/Buy-share.webp',
    caption:
      'حالا به هر اندازه که بخوای سهم نیروگاه رو بخر؛ مالکیتت همون لحظه ثبت می‌شه، بدون هیچ پیچیدگی.',
    bg: 'linear-gradient(160deg, #d7e8c4 0%, #e8f1dd 52%, #f8faf4 100%)',
  },
  {
    id: 'easychart',
    label: 'سود و فروش',
    Icon: Wallet,
    image: '/Images/how-works/Profit-sell.webp',
    caption:
      'از درآمد فروش برق سود بگیر و هر وقت خواستی، سهمت رو تو بازار بفروش؛ به همین سادگی!',
    bg: 'linear-gradient(160deg, #f3e6c6 0%, #f7efdb 52%, #fbf8f1 100%)',
  },
];

const AUTO_MS = 8000;

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tab = TABS[active];

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timerRef.current = setInterval(() => {
      setActive((a) => (a + 1) % TABS.length);
    }, AUTO_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [active]);

  return (
    <section id="how" className="py-16 md:py-24">
      <div className="wrap">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-teal-deep">خیلی راحت شروع کن</p>
          <h2 className="mt-2 text-3xl font-black text-ink md:text-[38px]"> مراحل سرمایه گذاری </h2>
          <p className="mt-3 text-[15px] leading-[2] text-muted">
            تو چند قدم ساده صاحب سهم یه نیروگاه خورشیدی شو؛ روی هر مرحله بزن تا ببینی چه خبره.
          </p>
        </div>

        {/* Tab bar — active button fills right→left as a countdown timer */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {TABS.map((t, i) => {
            const isActive = i === active;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={isActive}
                className={cn(
                  'group relative w-[104px] overflow-hidden rounded-2xl transition-[background-color,color,box-shadow,transform] duration-200 ease-out active:scale-[0.97] sm:w-[122px]',
                  isActive
                    ? 'bg-primary text-white shadow-[var(--shadow-card)]'
                    : 'bg-surface text-primary-deep border border-line-soft hover:border-primary/40 hover:bg-primary-soft',
                )}
              >
                {isActive && (
                  <span
                    key={active}
                    className="hero-timer-fill pointer-events-none absolute inset-y-0 right-0 block w-full bg-primary-deep"
                    style={{ animationDuration: `${AUTO_MS}ms` }}
                  />
                )}
                <span className="relative z-10 flex flex-col items-center gap-2 px-4 py-3.5">
                  <t.Icon size={24} strokeWidth={1.9} />
                  <span className="text-[13px] font-medium sm:text-sm">{t.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Showcase — outer gradient box (1025×595); inner box holds the image, stuck to bottom-left.
            Only the top-right corner is rounded; top-left & bottom-right stay square. */}
        <div className="mx-auto mt-10 w-full max-w-[1175px]">
          <div
            className="flex flex-col justify-end aspect-[1175/595] overflow-hidden rounded-hero border border-line-soft pr-10 md:pr-14 shadow-[var(--shadow-pop)]"
            style={{ background: tab.bg, transition: 'background 500ms var(--ease-out-strong)' }}
          >
            <div key={tab.id} className="rise overflow-hidden rounded-tr-[20px]">
              <Image
                src={tab.image}
                alt={tab.label}
                width={1920}
                height={889}
                className="block h-auto w-full"
                sizes="(max-width: 1024px) 100vw, 985px"
              />
            </div>
          </div>

          <p
            key={`${tab.id}-cap`}
            className="rise mx-auto mt-7 max-w-3xl text-center text-[15px] leading-[2] text-muted"
          >
            {tab.caption}
          </p>
        </div>
      </div>
    </section>
  );
}
