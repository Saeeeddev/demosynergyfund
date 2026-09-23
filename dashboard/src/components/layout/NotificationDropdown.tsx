'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Bell, Coins, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { IconChip } from '@/components/ui/IconChip'
import { formatJalaliRelative } from '@/lib/utils/jalali'
import type { Notification } from '@/types/domain'

// ─── Single notification row [D §9.14] ────────────────────────────────────────

function NotificationRow({ n }: { n: Notification }) {
  const role = n.type === 'payout' ? 'energy' : 'positive'
  const Icon = n.type === 'payout' ? Coins : TrendingUp

  return (
    <div
      className={cn(
        'flex items-start gap-3 px-4 py-3 border-b border-border last:border-0',
        'hover:bg-hover transition-colors duration-[120ms]',
        !n.read && 'bg-surface-2',
      )}
    >
      <IconChip role={role} icon={<Icon size={14} />} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text truncate">{n.title}</p>
        <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{n.body}</p>
        <p className="text-[11px] text-text-subtle mt-1 tabular-nums">
          {formatJalaliRelative(n.timestamp)}
        </p>
      </div>
    </div>
  )
}

// ─── Bell button + floating dropdown [D §9.14] ────────────────────────────────

interface NotificationDropdownProps {
  notifications: Notification[]
  unreadCount: number
  open: boolean
  onToggle: () => void
  onClose: () => void
}

export function NotificationDropdown({
  notifications,
  unreadCount,
  open,
  onToggle,
  onClose,
}: NotificationDropdownProps) {
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click / Escape [D §9.14]
  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open, onClose])

  return (
    <div ref={ref} className="relative">
      {/* Bell icon button with count badge */}
      <button
        onClick={onToggle}
        aria-label="اعلان‌ها"
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          'relative flex items-center justify-center w-10 h-10 rounded-md',
          'text-text-muted hover:bg-hover hover:text-text',
          'transition-colors duration-[120ms] ease-out motion-reduce:transition-none',
          'min-h-[44px] md:min-h-0', // touch target on mobile [M §4]
        )}
      >
        <Bell size={20} strokeWidth={1.5} />
        {/* Count badge — start-top (top-right in RTL) [D §9.14] */}
        {unreadCount > 0 && (
          <span className="absolute top-1 start-0.5 min-w-[16px] h-4 px-1 rounded-pill bg-red-base text-white text-[10px] font-bold leading-4 text-center tabular-nums pointer-events-none">
            {unreadCount > 99 ? '۹۹+' : String(unreadCount)}
          </span>
        )}
      </button>

      {/* Floating dropdown — desktop only (M §7.4: becomes a bottom sheet on phone) */}
      {open && (
        <div
          role="dialog"
          aria-label="اعلان‌ها"
          className="absolute top-full end-0 mt-2 w-80 bg-surface border border-border rounded-md shadow-[var(--shadow-md)] z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-semibold text-text">اعلان‌ها</span>
            {unreadCount > 0 && (
              <span className="text-xs text-text-muted tabular-nums">
                {unreadCount} خوانده‌نشده
              </span>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-text-muted text-sm py-8">هیچ اعلانی وجود ندارد</p>
            ) : (
              notifications.slice(0, 6).map((n) => <NotificationRow key={n.id} n={n} />)
            )}
          </div>

          {/* Footer link */}
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
      )}
    </div>
  )
}
