'use client';

import { useEffect, useRef, useState } from 'react';
import CardNav, { type CardNavItem } from './CardNav';
import { PLATFORM_URL } from '@/lib/config';
import { cn } from '@/lib/utils';

const NAV_ITEMS: CardNavItem[] = [
  {
    label: 'بازار سرمایه‌گذاری',
    bgColor: '#6d7f9f',
    textColor: '#ffffff',
    links: [
      { label: 'فرصت‌های سرمایه‌گذاری', href: '/#opportunities', ariaLabel: 'فرصت‌های سرمایه‌گذاری' },
      
    ],
  },
  {
    label: ' از کجا شروع کنم ',
    bgColor: '#7f96a0',
    textColor: '#ffffff',
    links: [
      { label: 'مراحل سرمایه‌گذاری', href: '/#how', ariaLabel: 'مراحل سرمایه‌گذاری' },
      { label: 'سوالات متداول', href: '/contact#faq', ariaLabel: 'سوالات متداول' },
    ],
  },
  {
    label: 'سینرژی',
    bgColor: '#93afb1',
    textColor: '#ffffff',
    links: [
      { label: 'درباره ما', href: '/about', ariaLabel: 'درباره سینرژی' },
      { label: 'تماس با ما', href: '/contact', ariaLabel: 'تماس با ما' },
      { label: 'همکاران ما', href: '/#partners', ariaLabel: 'همکاران ما' },
      { label: 'قوانین و مقررات', href: '/terms', ariaLabel: 'قوانین و مقررات' },
    ],
  },
];

export default function SiteHeader() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      // Always reveal near the very top; otherwise hide going down, show going up.
      if (y < 80) {
        setHidden(false);
      } else if (delta > 6) {
        setHidden(true);
      } else if (delta < -6) {
        setHidden(false);
      }
      lastY.current = y;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform',
        hidden ? '-translate-y-[130%]' : 'translate-y-0',
      )}
    >
      <div className="wrap pt-5">
        <CardNav
          logo="/Images/synergyfundlogotransparent.webp"
          logoAlt="سینرژی"
          items={NAV_ITEMS}
          ctaLabel="مشاهده دمو"
          ctaHref={PLATFORM_URL}
          baseColor="#ffffff"
          menuColor="#23272e"
          buttonBgColor="#6d7f9f"
          buttonTextColor="#ffffff"
        />
      </div>
    </header>
  );
}
