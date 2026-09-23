'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { GoArrowUpLeft } from 'react-icons/go';
import { cn } from '@/lib/utils';

type CardNavLink = {
  label: string;
  href: string;
  ariaLabel: string;
};

export type CardNavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
};

export interface CardNavProps {
  logo: string;
  logoAlt?: string;
  items: CardNavItem[];
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

const CardNav: React.FC<CardNavProps> = ({
  logo,
  logoAlt = 'Logo',
  items,
  ctaLabel = 'ورود به پلتفرم',
  ctaHref = '#',
  className = '',
  ease = 'power3.out',
  baseColor = '#ffffff',
  menuColor = '#23272e',
  buttonBgColor = '#6d7f9f',
  buttonTextColor = '#ffffff',
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      const contentEl = navEl.querySelector('.card-nav-content') as HTMLElement | null;
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = 'visible';
        contentEl.style.pointerEvents = 'auto';
        contentEl.style.position = 'static';
        contentEl.style.height = 'auto';

        contentEl.offsetHeight;

        const topBar = 64;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 280;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 64, overflow: 'hidden' });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });
    tl.to(navEl, { height: calculateHeight, duration: 0.4, ease });
    tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 }, '-=0.1');
    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;
    return () => {
      tl?.kill();
      tlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ease, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;
      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) tlRef.current = newTl;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  const openMenu = () => {
    const tl = tlRef.current;
    if (!tl || isExpanded) return;
    setIsHamburgerOpen(true);
    setIsExpanded(true);
    tl.play(0);
  };

  const closeMenu = () => {
    const tl = tlRef.current;
    if (!tl || !isExpanded) return;
    setIsHamburgerOpen(false);
    tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
    tl.reverse();
  };

  const toggleMenu = () => {
    if (isExpanded) closeMenu();
    else openMenu();
  };

  // Close the open menu when clicking/tapping outside it, or pressing Escape.
  useEffect(() => {
    if (!isExpanded) return;
    const onPointerDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) closeMenu();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    <div className={cn('card-nav-container relative w-full z-[99]', className)}>
      <nav
        ref={navRef}
        className={cn(
          'card-nav block h-16 p-0 rounded-xl relative overflow-hidden will-change-[height]',
          isExpanded && 'open',
        )}
        style={{ backgroundColor: baseColor, boxShadow: 'var(--shadow-nav)' }}
      >
        <div className="card-nav-top absolute inset-x-0 top-0 h-16 flex items-center justify-between gap-2 px-3 sm:px-4 z-[2]">
          {/* Logo — start (right in RTL); links to home */}
          <Link href="/" aria-label="سینرژی — صفحه اصلی" className="logo-container flex shrink-0 items-center transition-opacity duration-200 hover:opacity-80">
            <Image
              src={logo}
              alt={logoAlt}
              width={132}
              height={30}
              priority
              className="h-[26px] w-auto sm:h-[30px]"
              style={{ width: 'auto' }}
            />
          </Link>

          {/* End cluster (left in RTL): CTA + hamburger.
              On desktop the hamburger is pulled out of flow and centered in the bar. */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <a
              href={ctaHref}
              className="card-nav-cta-button inline-flex items-center h-9 md:h-10 rounded-pill px-3.5 md:px-5 text-[13px] md:text-sm font-medium whitespace-nowrap transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:brightness-95 active:scale-[0.97]"
              style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
            >
              {ctaLabel}
            </a>

            <div
              className={cn(
                // Larger 44px hit target (-m-1 lets clicks land a bit outside the visible icon).
                'hamburger-menu group -m-1 flex h-12 w-12 flex-col items-center justify-center cursor-pointer gap-[7px] rounded-xl',
                'md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2',
                isHamburgerOpen && 'open',
              )}
              onClick={toggleMenu}
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleMenu();
                }
              }}
              role="button"
              aria-label={isExpanded ? 'بستن منو' : 'باز کردن منو'}
              aria-expanded={isExpanded}
              tabIndex={0}
              style={{ color: menuColor }}
            >
              <div
                className={cn(
                  'hamburger-line w-[30px] h-[2.5px] rounded-full bg-current transition-[transform,opacity] duration-300 ease-linear [transform-origin:50%_50%] group-hover:opacity-75',
                  isHamburgerOpen && 'translate-y-[9px] rotate-45',
                )}
              />
              <div
                className={cn(
                  'hamburger-line w-[30px] h-[2.5px] rounded-full bg-current transition-[transform,opacity] duration-300 ease-linear [transform-origin:50%_50%] group-hover:opacity-75',
                  isHamburgerOpen && 'opacity-0',
                )}
              />
              <div
                className={cn(
                  'hamburger-line w-[30px] h-[2.5px] rounded-full bg-current transition-[transform,opacity] duration-300 ease-linear [transform-origin:50%_50%] group-hover:opacity-75',
                  isHamburgerOpen && '-translate-y-[9px] -rotate-45',
                )}
              />
            </div>
          </div>
        </div>

        <div
          className={cn(
            'card-nav-content absolute left-0 right-0 top-16 bottom-0 p-2 flex flex-col items-stretch gap-2 justify-start z-[1]',
            'md:flex-row md:items-end md:gap-3',
            isExpanded ? 'visible pointer-events-auto' : 'invisible pointer-events-none',
          )}
          aria-hidden={!isExpanded}
        >
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              ref={setCardRef(idx)}
              className="nav-card select-none relative flex flex-col gap-2 px-4 py-3 rounded-[16px] min-w-0 flex-[1_1_auto] min-h-[70px] md:h-full md:min-h-0 md:flex-[1_1_0%]"
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div className="nav-card-label font-medium text-[18px] md:text-[20px]">{item.label}</div>
              <div className="nav-card-links mt-auto flex flex-col gap-[4px]">
                {item.links?.map((lnk, i) => (
                  <a
                    key={`${lnk.label}-${i}`}
                    href={lnk.href}
                    aria-label={lnk.ariaLabel}
                    className="nav-card-link inline-flex items-center gap-[6px] no-underline cursor-pointer transition-opacity duration-300 hover:opacity-75 text-[14px] md:text-[15px]"
                  >
                    <GoArrowUpLeft className="nav-card-link-icon shrink-0" aria-hidden="true" />
                    {lnk.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
