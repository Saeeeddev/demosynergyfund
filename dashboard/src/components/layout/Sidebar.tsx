'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  LayoutDashboard,
  Store,
  Briefcase,
  Banknote,
  FileText,
  Settings,
  Bell,
  User,
  ShieldCheck,
  LogOut,
  ChevronUp,
  TrendingUp,
  Coins,
  Headset,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { NavPendingReporter } from './NavProgress'
import { SearchField } from '@/components/ui/SearchField'
import { useNotifications, useUnreadCount } from '@/lib/hooks/useNotifications'
import { useUnreadTicketCount } from '@/lib/hooks/useSupport'
import { useMe } from '@/lib/hooks/useAuth'
import { formatJalaliRelative } from '@/lib/utils/jalali'

// Shared nav definition reused by the desktop sidebar and the mobile drawer [F §1.1]
export const NAV_ITEMS = [
  { href: '/dashboard',   label: 'داشبورد',                    icon: LayoutDashboard },
  { href: '/marketplace', label: 'فرصت‌های سرمایه‌گذاری',     icon: Store           },
  { href: '/portfolio',   label: 'سبد دارایی',                 icon: Briefcase       },
  { href: '/income',      label: 'درآمدها و پرداخت‌ها',        icon: Banknote        },
  { href: '/reports',     label: 'گزارش‌ها',                   icon: FileText        },
  { href: '/support',     label: 'پشتیبانی',                   icon: Headset         },
  { href: '/settings',    label: 'تنظیمات',                    icon: Settings        },
]

// ─── Logo ─────────────────────────────────────────────────────────────────────

export function SidebarLogo() {
  return (
    <div className="flex items-center px-5 h-16 shrink-0">
      <Image
        src="/Images/synergyfundlogotransparent.png"
        alt="سینرژی"
        width={737}
        height={258}
        className="h-11 w-auto object-contain"
        priority
      />
    </div>
  )
}

// ─── Nav items — shared by sidebar + drawer ────────────────────────────────────

interface SidebarNavProps {
  pathname: string
  onNavigate?: () => void
}

export function SidebarNav({ pathname, onNavigate }: SidebarNavProps) {
  const unreadTickets = useUnreadTicketCount()

  return (
    <nav className="flex flex-col gap-0.5 px-3 py-3">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive =
          pathname === href || pathname.startsWith(href + '/')
        const badgeCount = href === '/support' ? unreadTickets : 0
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 px-3 py-3 rounded-[28px] text-[15px] font-medium',
              'transition-colors duration-[120ms] ease-out motion-reduce:transition-none',
              'min-h-[44px]',
              isActive
                ? 'bg-sidebar-active text-sidebar-active-fg'
                : 'text-text-muted hover:bg-hover hover:text-text',
            )}
          >
            <span className="relative shrink-0">
              <Icon size={22} strokeWidth={1.5} />
              {badgeCount > 0 && (
                <span className="absolute -top-1 -end-1 w-2.5 h-2.5 rounded-pill bg-red-base pointer-events-none" />
              )}
            </span>
            <span>{label}</span>
            {badgeCount > 0 && (
              <span className="ms-auto min-w-[16px] h-4 px-1 rounded-pill bg-red-base text-white text-[10px] font-bold leading-4 text-center tabular-nums">
                {badgeCount > 99 ? '۹۹+' : String(badgeCount)}
              </span>
            )}
            <NavPendingReporter />
          </Link>
        )
      })}
    </nav>
  )
}

// ─── Fixed flyout helpers ──────────────────────────────────────────────────────
// The sidebar has overflow-y:auto which browsers also apply to overflow-x, clipping
// any absolutely-positioned child that overflows sideways.  position:fixed escapes
// that constraint entirely — fixed elements are only clipped by viewport, not by
// overflow on DOM ancestors (unless an ancestor uses transform/filter/perspective,
// which none do here).

interface FlyoutPos {
  bottom: number
  right: number
}

function getFlyoutPos(btn: HTMLElement): FlyoutPos {
  const rect = btn.getBoundingClientRect()
  return {
    // flyout bottom edge anchors to the button's top edge
    bottom: window.innerHeight - rect.top,
    // flyout right edge sits flush with the sidebar's left edge + 8px gap
    right: window.innerWidth - rect.left + 8,
  }
}

// ─── Notification flyout ───────────────────────────────────────────────────────

function NotificationFlyout({
  pos,
  flyoutRef,
  onClose,
}: {
  pos: FlyoutPos
  flyoutRef: React.RefObject<HTMLDivElement | null>
  onClose: () => void
}) {
  const { data: notifications = [] } = useNotifications()
  const unreadCount = useUnreadCount()

  return (
    <div
      ref={flyoutRef}
      role="dialog"
      aria-label="اعلان‌ها"
      style={{ position: 'fixed', bottom: pos.bottom, right: pos.right }}
      className="z-[200] w-80 bg-surface border border-border rounded-md shadow-[var(--shadow-md)] overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-sm font-semibold text-text">اعلان‌ها</span>
        {unreadCount > 0 && (
          <span className="text-xs text-text-muted tabular-nums">{unreadCount} خوانده‌نشده</span>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-center text-text-muted text-sm py-8">هیچ اعلانی وجود ندارد</p>
        ) : (
          notifications.slice(0, 6).map((n) => {
            const Icon = n.type === 'payout' ? Coins : TrendingUp
            return (
              <div
                key={n.id}
                className={cn(
                  'flex items-start gap-3 px-4 py-3 border-b border-border last:border-0',
                  !n.read && 'bg-surface-2',
                )}
              >
                <div className={cn(
                  'w-8 h-8 rounded-chip flex items-center justify-center shrink-0 mt-0.5',
                  n.type === 'payout' ? 'bg-gold-tint text-gold-deep' : 'bg-green-tint text-green-deep',
                )}>
                  <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text truncate">{n.title}</p>
                  <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{n.body}</p>
                  <p className="text-[11px] text-text-subtle mt-1 tabular-nums">
                    {formatJalaliRelative(n.timestamp)}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="px-4 py-2 border-t border-border">
        <Link
          href="/notifications"
          onClick={onClose}
          className="text-xs text-info hover:underline"
        >
          مشاهده همه اعلان‌ها
        </Link>
      </div>
    </div>
  )
}

// ─── Profile flyout ────────────────────────────────────────────────────────────

function ProfileFlyout({
  pos,
  flyoutRef,
  user,
  onClose,
}: {
  pos: FlyoutPos
  flyoutRef: React.RefObject<HTMLDivElement | null>
  user: { name: string; role: string } | null
  onClose: () => void
}) {
  const router = useRouter()
  const displayName = user?.name ?? 'کاربر'
  const displayRole = user?.role ?? 'مدیر'
  const initials = displayName.charAt(0)

  const menuItems = [
    { href: '/profile',       label: 'پروفایل',     icon: User       },
    { href: '/notifications', label: 'اعلان‌ها',    icon: Bell       },
    { href: '/verification',  label: 'تأیید هویت', icon: ShieldCheck },
  ]

  function handleLogout() {
    onClose()
    router.push('/login')
  }

  return (
    <div
      ref={flyoutRef}
      role="menu"
      aria-label="منوی پروفایل"
      style={{ position: 'fixed', bottom: pos.bottom, right: pos.right }}
      className="z-[200] w-52 bg-surface border border-border rounded-md shadow-[var(--shadow-md)] overflow-hidden py-1"
    >
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border mb-1">
        <span className="w-9 h-9 rounded-pill bg-green-tint text-green-deep text-sm font-bold flex items-center justify-center shrink-0">
          {initials}
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-text truncate">{displayName}</p>
          <p className="text-[11px] text-text-muted truncate">{displayRole}</p>
        </div>
      </div>

      {menuItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          role="menuitem"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-text hover:bg-hover transition-colors duration-[120ms] min-h-[40px]"
        >
          <Icon size={16} strokeWidth={1.5} className="text-text-muted shrink-0" />
          <span>{label}</span>
        </Link>
      ))}

      <div className="my-1 border-t border-border" />

      <button
        role="menuitem"
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-base hover:bg-red-tint transition-colors duration-[120ms] min-h-[40px]"
      >
        <LogOut size={16} strokeWidth={1.5} className="shrink-0" />
        <span>خروج از دمو</span>
      </button>
    </div>
  )
}

// ─── Sidebar bottom: notification + profile ────────────────────────────────────

function SidebarBottom() {
  const [notifOpen, setNotifOpen]     = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifPos, setNotifPos]       = useState<FlyoutPos | null>(null)
  const [profilePos, setProfilePos]   = useState<FlyoutPos | null>(null)

  const notifBtnRef    = useRef<HTMLButtonElement>(null)
  const profileBtnRef  = useRef<HTMLButtonElement>(null)
  const notifFlyoutRef = useRef<HTMLDivElement>(null)
  const profileFlyoutRef = useRef<HTMLDivElement>(null)

  const unreadCount = useUnreadCount()
  const { data: user = null } = useMe()
  const displayName = (user as { name?: string } | null)?.name ?? 'کاربر'
  const displayRole = (user as { role?: string } | null)?.role ?? 'مدیر'
  const initials = displayName.charAt(0)

  function toggleNotif() {
    if (notifOpen) { setNotifOpen(false); return }
    if (notifBtnRef.current) setNotifPos(getFlyoutPos(notifBtnRef.current))
    setNotifOpen(true)
    setProfileOpen(false)
  }

  function toggleProfile() {
    if (profileOpen) { setProfileOpen(false); return }
    if (profileBtnRef.current) setProfilePos(getFlyoutPos(profileBtnRef.current))
    setProfileOpen(true)
    setNotifOpen(false)
  }

  // Close on outside click / Escape
  useEffect(() => {
    if (!notifOpen && !profileOpen) return
    function handleClick(e: MouseEvent) {
      const t = e.target as Node
      if (notifOpen && !notifBtnRef.current?.contains(t) && !notifFlyoutRef.current?.contains(t))
        setNotifOpen(false)
      if (profileOpen && !profileBtnRef.current?.contains(t) && !profileFlyoutRef.current?.contains(t))
        setProfileOpen(false)
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { setNotifOpen(false); setProfileOpen(false) }
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [notifOpen, profileOpen])

  return (
    <div className="mt-auto border-t border-border shrink-0">
      {/* Notification row */}
      <div className="px-3 pt-2">
        <button
          ref={notifBtnRef}
          onClick={toggleNotif}
          aria-label="اعلان‌ها"
          aria-expanded={notifOpen}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-3 rounded-[28px] text-[13px] font-medium',
            'transition-colors duration-[120ms] ease-out min-h-[44px]',
            notifOpen
              ? 'bg-blue-tint text-text'
              : 'bg-[var(--sidebar-hover)] text-text-2 hover:bg-blue-tint hover:text-text',
          )}
        >
          <span className="relative shrink-0">
            <Bell size={20} strokeWidth={1.5} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -start-1 min-w-[16px] h-4 px-1 rounded-pill bg-red-base text-white text-[10px] font-bold leading-4 text-center tabular-nums pointer-events-none">
                {unreadCount > 99 ? '۹۹+' : String(unreadCount)}
              </span>
            )}
          </span>
          <span>اعلان‌ها</span>
          {unreadCount > 0 && (
            <span className="ms-auto text-[11px] text-text-subtle tabular-nums">{unreadCount}</span>
          )}
        </button>
      </div>

      {notifOpen && notifPos && (
        <NotificationFlyout
          pos={notifPos}
          flyoutRef={notifFlyoutRef}
          onClose={() => setNotifOpen(false)}
        />
      )}

      {/* Profile row */}
      <div className="px-3 pt-1 pb-3">
        <button
          ref={profileBtnRef}
          onClick={toggleProfile}
          aria-expanded={profileOpen}
          aria-haspopup="true"
          className={cn(
            'flex items-center gap-3 w-full px-3 py-3 rounded-[28px] text-[13px] font-medium',
            'transition-colors duration-[120ms] ease-out min-h-[44px]',
            profileOpen
              ? 'bg-blue-tint text-text'
              : 'bg-[var(--sidebar-hover)] text-text-2 hover:bg-blue-tint hover:text-text',
          )}
        >
          <span className="w-7 h-7 rounded-pill bg-green-tint text-green-deep text-xs font-bold flex items-center justify-center shrink-0">
            {initials}
          </span>
          <div className="flex flex-col items-start min-w-0 flex-1">
            <span className="text-[13px] font-semibold text-text leading-tight truncate w-full text-start">
              {displayName}
            </span>
            <span className="text-[11px] text-text-muted leading-tight truncate w-full text-start">
              {displayRole}
            </span>
          </div>
          <ChevronUp
            size={14}
            strokeWidth={2}
            className={cn(
              'text-text-muted transition-transform duration-200 shrink-0',
              profileOpen ? 'rotate-0' : 'rotate-180',
            )}
          />
        </button>
      </div>

      {profileOpen && profilePos && (
        <ProfileFlyout
          pos={profilePos}
          flyoutRef={profileFlyoutRef}
          user={user}
          onClose={() => setProfileOpen(false)}
        />
      )}
    </div>
  )
}

// ─── Desktop sidebar — hidden below lg [M §2] ────────────────────────────────

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="sidebar-pane hidden lg:flex flex-col w-64 shrink-0 h-full overflow-y-auto">
      <SidebarLogo />
      {/* Search moved here from TopBar */}
      <div className="px-3 pb-3">
        <SearchField className="w-full" />
      </div>
      <SidebarNav pathname={pathname} />
      <SidebarBottom />
    </aside>
  )
}
