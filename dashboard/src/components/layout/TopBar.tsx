'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { SearchField } from '@/components/ui/SearchField'
import { useNotifications, useUnreadCount } from '@/lib/hooks/useNotifications'
import { useMe } from '@/lib/hooks/useAuth'

// Mobile page title per route segment
type Crumb = { label: string }

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':    'داشبورد',
  '/marketplace':  'فرصت‌های سرمایه‌گذاری',
  '/portfolio':    'سبد دارایی',
  '/income':       'درآمدها و پرداخت‌ها',
  '/reports':      'گزارش‌ها',
  '/settings':     'تنظیمات',
  '/notifications':'اعلان‌ها',
  '/profile':      'پروفایل',
  '/verification': 'تأیید هویت',
  '/project-details': 'جزئیات پروژه',
  '/invest':       'سرمایه‌گذاری',
  '/sell':         'فروش',
}

function usePageTitle(): string {
  const pathname = usePathname()
  const segment = '/' + (pathname.split('/')[1] ?? '')
  return PAGE_TITLES[segment] ?? 'پنل مدیریت'
}

export function TopBar() {
  const [notifOpen, setNotifOpen]     = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchOpen, setSearchOpen]   = useState(false)

  const { data: notifications = [] } = useNotifications()
  const unreadCount = useUnreadCount()
  const { data: user = null } = useMe()

  const initials = (user?.name ?? 'م').charAt(0)

  return (
    <>
      {/* ── Mobile compact header (<lg) ─────────────────────────────────────────── */}
      <header className="mobile-header lg:hidden flex flex-col shrink-0 sticky top-0 z-30">
        {/* Row 1 — brand + actions (nav lives in the bottom «بیشتر») */}
        <div className="flex items-center h-14 px-3 gap-2">
        <Image
          src="/Images/synergyfundlogotransparent.png"
          alt="سینرژی"
          width={737}
          height={258}
          className="h-8 w-auto object-contain shrink-0"
          priority
        />

        <span className="flex-1" />

        <button
          onClick={() => setSearchOpen(true)}
          aria-label="جستجو"
          className="flex items-center justify-center w-10 h-10 rounded-md text-text-muted hover:bg-hover min-h-[44px] transition-colors duration-[120ms]"
        >
          <Search size={20} strokeWidth={1.5} />
        </button>

        <button
          onClick={() => setNotifOpen(true)}
          aria-label="اعلان‌ها"
          className="relative flex items-center justify-center w-10 h-10 rounded-md text-text-muted hover:bg-hover min-h-[44px] transition-colors duration-[120ms]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute top-1 start-0.5 min-w-[16px] h-4 px-1 rounded-pill bg-red-base text-white text-[10px] font-bold leading-4 text-center tabular-nums pointer-events-none">
              {unreadCount > 99 ? '۹۹+' : String(unreadCount)}
            </span>
          )}
        </button>

        <button
          onClick={() => setProfileOpen(true)}
          aria-label="پروفایل"
          className="flex items-center justify-center w-10 h-10 min-h-[44px]"
        >
          <span className="w-8 h-8 rounded-pill bg-green-tint text-green-deep text-sm font-bold flex items-center justify-center">
            {initials}
          </span>
        </button>
        </div>
      </header>

      {/* ── Search overlay (mobile) ──────────────────────────────────────────────── */}
      {searchOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-surface flex flex-col">
          <div className="flex items-center gap-2 px-4 h-14 border-b border-border">
            <SearchField className="flex-1" autoFocus />
            <button
              onClick={() => setSearchOpen(false)}
              className="flex items-center justify-center w-10 h-10 text-text-muted hover:bg-hover rounded-md"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* ── Mobile notification bottom sheet ────────────────────────────────────── */}
      {notifOpen && (
        <MobileSheet title="اعلان‌ها" onClose={() => setNotifOpen(false)}>
          {notifications.length === 0 ? (
            <p className="text-center text-text-muted text-sm py-12">هیچ اعلانی وجود ندارد</p>
          ) : (
            <div className="overflow-y-auto max-h-[60vh]">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    'flex gap-3 px-4 py-3 border-b border-border last:border-0',
                    !n.read && 'bg-surface-2',
                  )}
                >
                  <div
                    className={cn(
                      'w-9 h-9 rounded-chip flex items-center justify-center shrink-0',
                      n.type === 'payout' ? 'bg-gold-tint text-gold-deep' : 'bg-green-tint text-green-deep',
                    )}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {n.type === 'payout'
                        ? <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>
                        : <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>
                      }
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text">{n.title}</p>
                    <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{n.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="px-4 py-3 border-t border-border">
            <a
              href="/notifications"
              onClick={() => setNotifOpen(false)}
              className="block text-center text-sm text-info py-2"
            >
              مشاهده همه اعلان‌ها
            </a>
          </div>
        </MobileSheet>
      )}

      {/* ── Mobile profile bottom sheet ──────────────────────────────────────────── */}
      {profileOpen && (
        <MobileSheet title="حساب کاربری" onClose={() => setProfileOpen(false)}>
          <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
            <span className="w-12 h-12 rounded-pill bg-green-tint text-green-deep text-xl font-bold flex items-center justify-center shrink-0">
              {initials}
            </span>
            <div>
              <p className="font-semibold text-text">{user?.name ?? 'کاربر'}</p>
              <p className="text-sm text-text-muted">{user?.role ?? 'مدیر'}</p>
            </div>
          </div>
          {[
            { href: '/profile',       label: 'پروفایل'     },
            { href: '/notifications', label: 'اعلان‌ها'    },
            { href: '/verification',  label: 'تأیید هویت' },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setProfileOpen(false)}
              className="flex items-center px-4 py-4 text-[15px] text-text border-b border-border hover:bg-hover min-h-[56px]"
            >
              {label}
            </a>
          ))}
          <button
            onClick={() => {
              setProfileOpen(false)
              window.location.href = '/login'
            }}
            className="w-full flex items-center px-4 py-4 text-[15px] text-red-base min-h-[56px]"
          >
            خروج از دمو
          </button>
        </MobileSheet>
      )}
    </>
  )
}

// ─── Mobile page title ────────────────────────────────────────────────────────
// Rendered at the top of each page's scrollable content (not in the pinned header),
// so it scrolls away with the page and sits on the page's own background color.
export function MobilePageTitle() {
  const pageTitle = usePageTitle()
  return (
    <div className="lg:hidden px-4 pt-4 pb-1">
      <h1 className="text-[18px] font-bold text-text truncate">{pageTitle}</h1>
    </div>
  )
}

// ─── Reusable bottom sheet primitive [M §7.4] ─────────────────────────────────

function MobileSheet({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative bg-surface rounded-t-[var(--r-card)] shadow-[var(--shadow-pop)] w-full max-h-[80dvh] flex flex-col"
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-pill bg-border-strong" />
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <span className="font-semibold text-[15px] text-text">{title}</span>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-md text-text-muted hover:bg-hover"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
