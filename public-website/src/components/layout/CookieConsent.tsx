'use client';

import { useEffect, useState } from 'react';
import { Cookie, X } from 'lucide-react';

const STORAGE_KEY = 'synergy-cookie-consent';
const ONE_YEAR = 60 * 60 * 24 * 365;

function hasConsent(): boolean {
  try {
    if (localStorage.getItem(STORAGE_KEY)) return true;
  } catch {
    /* ignore */
  }
  // Cookie fallback — survives even if localStorage is cleared/blocked.
  return document.cookie.split('; ').some((c) => c.startsWith(`${STORAGE_KEY}=`));
}

function persistConsent(choice: 'accepted' | 'declined') {
  try {
    localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    /* ignore */
  }
  // Long-lived, so the notice is shown only once per browser going forward.
  document.cookie = `${STORAGE_KEY}=${choice}; max-age=${ONE_YEAR}; path=/; SameSite=Lax`;
}

export default function CookieConsent() {
  // Start hidden so server and first client render match (avoids hydration mismatch).
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasConsent()) {
      // Small delay so it slides in after the page settles.
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const decide = (choice: 'accepted' | 'declined') => {
    persistConsent(choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="اطلاعیه کوکی‌ها"
      className="cookie-rise fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-xl rounded-hero border border-line-soft bg-surface/95 p-5 shadow-[var(--shadow-pop)] backdrop-blur-xl sm:inset-x-auto sm:left-6 sm:mx-0"
    >
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-primary-soft text-primary-deep">
          <Cookie size={22} strokeWidth={1.9} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-ink">ما از کوکی‌ها استفاده می‌کنیم</h3>
          <p className="mt-1.5 text-[13px] leading-[1.9] text-muted">
            برای بهبود تجربه شما و تحلیل استفاده از سایت از کوکی‌ها بهره می‌بریم. با ادامه، استفاده ما
            از کوکی‌ها را می‌پذیرید.{' '}
            <a href="/privacy#cookies" className="font-medium text-primary hover:underline">
              اطلاعات بیشتر
            </a>
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => decide('accepted')}
              className="inline-flex h-10 items-center justify-center rounded-pill bg-primary px-6 text-sm font-medium text-white transition-[transform,background-color] duration-200 ease-out hover:bg-primary-deep active:scale-[0.97]"
            >
              پذیرفتن
            </button>
            <button
              type="button"
              onClick={() => decide('declined')}
              className="inline-flex h-10 items-center justify-center rounded-pill border border-line px-6 text-sm font-medium text-ink-2 transition-colors duration-200 hover:bg-surface-2"
            >
              فقط ضروری‌ها
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={() => decide('declined')}
          aria-label="بستن"
          className="shrink-0 text-subtle transition-colors hover:text-ink"
        >
          <X size={18} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
