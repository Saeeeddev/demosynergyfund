'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  X,
  Bell,
  User,
  ShieldCheck,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { SidebarLogo, SidebarNav } from './Sidebar'

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
}

const SECONDARY_ITEMS = [
  { href: '/notifications', label: 'اعلان‌ها',    icon: Bell       },
  { href: '/profile',       label: 'پروفایل',     icon: User       },
  { href: '/verification',  label: 'تأیید هویت', icon: ShieldCheck },
]

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const pathname = usePathname()
  const drawerRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Focus trap: keep Tab key inside the drawer while open [M §3.2]
  useEffect(() => {
    if (!open) return
    // Focus the close button when drawer opens
    closeButtonRef.current?.focus()

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !drawerRef.current) return
      const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  // Prevent body scroll while drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    // Hidden on desktop — drawer is only for mobile/tablet [M §3.2]
    <div className={cn('lg:hidden', !open && 'pointer-events-none')}>
      {/* Scrim */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-40 bg-black/50',
          'transition-opacity duration-200 ease-out motion-reduce:transition-none',
          open ? 'opacity-100' : 'opacity-0',
        )}
      />

      {/* Drawer panel — slides from start (RIGHT in RTL) [M §3.2] */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="منوی ناوبری"
        className={cn(
          // Positioned at the inline-start edge (right in RTL)
          'fixed inset-y-0 start-0 z-50',
          'w-[min(86vw,320px)] bg-surface flex flex-col',
          'shadow-[var(--shadow-pop)]',
          // Slide animation: closed = off-screen to the right; open = in place
          'transition-transform duration-200 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header: logo + close button */}
        <div className="flex items-center justify-between border-b border-border shrink-0">
          <SidebarLogo />
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="بستن منو"
            className="flex items-center justify-center w-10 h-10 me-4 text-text-muted hover:bg-hover rounded-md transition-colors duration-[120ms]"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Primary nav — same as desktop sidebar [F §1.1] */}
        <div className="flex-1 overflow-y-auto">
          <SidebarNav pathname={pathname} onNavigate={onClose} />

          {/* Divider */}
          <div className="mx-4 my-2 border-t border-border" />

          {/* Secondary destinations [M §3.2] */}
          <nav className="flex flex-col gap-0.5 px-3 py-2">
            {SECONDARY_ITEMS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-md text-[13px] font-medium min-h-[44px]',
                    'transition-colors duration-[120ms] ease-out motion-reduce:transition-none',
                    isActive
                      ? 'bg-sidebar-active text-sidebar-active-fg'
                      : 'text-text-muted hover:bg-hover hover:text-text',
                  )}
                >
                  <Icon size={20} strokeWidth={1.5} className="shrink-0" />
                  <span>{label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Logout at bottom */}
        <div className="px-3 py-4 border-t border-border shrink-0">
          <button
            onClick={() => {
              onClose()
              window.location.href = '/login'
            }}
            className="flex items-center gap-3 px-3 py-3 w-full rounded-md text-[13px] font-medium text-red-base hover:bg-red-tint min-h-[44px] transition-colors duration-[120ms]"
          >
            <LogOut size={20} strokeWidth={1.5} className="shrink-0" />
            <span>خروج از دمو</span>
          </button>
        </div>
      </div>
    </div>
  )
}
