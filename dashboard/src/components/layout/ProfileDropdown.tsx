'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ChevronDown,
  User,
  Bell,
  ShieldCheck,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { User as UserType } from '@/types/domain'

interface ProfileDropdownProps {
  user: UserType | null
  open: boolean
  onToggle: () => void
  onClose: () => void
}

const MENU_ITEMS = [
  { href: '/profile',       label: 'پروفایل',     icon: User       },
  { href: '/notifications', label: 'اعلان‌ها',    icon: Bell       },
  { href: '/verification',  label: 'تأیید هویت', icon: ShieldCheck },
]

export function ProfileDropdown({
  user,
  open,
  onToggle,
  onClose,
}: ProfileDropdownProps) {
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close on outside click / Escape [D §9.15]
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

  function handleLogout() {
    onClose()
    router.push('/login')
  }

  const displayName = user?.name ?? 'کاربر'
  const displayRole = user?.role ?? 'مدیر'
  const initials = displayName.charAt(0)

  return (
    <div ref={ref} className="relative">
      {/* Profile box trigger [D §9.15] */}
      <button
        onClick={onToggle}
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-white',
          'hover:bg-hover transition-colors duration-[120ms] ease-out motion-reduce:transition-none',
          'min-h-[44px] md:min-h-0', // touch target [M §4]
        )}
      >
        {/* Avatar */}
        <span className="w-7 h-7 rounded-pill bg-green-tint text-green-deep text-xs font-bold flex items-center justify-center shrink-0">
          {initials}
        </span>
        {/* Name + role — hidden on small screens */}
        <div className="hidden md:flex flex-col items-start">
          <span className="text-[13px] font-semibold text-text leading-tight">{displayName}</span>
          <span className="text-[11px] text-text-muted leading-tight">{displayRole}</span>
        </div>
        {/* Expand chevron — flips open [D §6.1: mirrors in RTL] */}
        <ChevronDown
          size={14}
          strokeWidth={2}
          className={cn(
            'text-text-muted transition-transform duration-200 motion-reduce:transition-none hidden md:block',
            open && 'rotate-180',
          )}
        />
      </button>

      {/* Floating dropdown [D §9.15] */}
      {open && (
        <div
          role="menu"
          aria-label="منوی پروفایل"
          className="absolute top-full end-0 mt-2 w-48 bg-surface border border-border rounded-md shadow-[var(--shadow-md)] z-50 overflow-hidden py-1"
        >
          {MENU_ITEMS.map(({ href, label, icon: Icon }) => (
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

          {/* Divider */}
          <div className="my-1 border-t border-border" />

          {/* Logout */}
          <button
            role="menuitem"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-base hover:bg-red-tint transition-colors duration-[120ms] min-h-[40px]"
          >
            <LogOut size={16} strokeWidth={1.5} className="shrink-0" />
            <span>خروج از دمو</span>
          </button>
        </div>
      )}
    </div>
  )
}
