'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Store, Briefcase, Banknote, Menu } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { NavPendingReporter } from './NavProgress'

// Primary destinations in the bottom nav — right→left in RTL [M §3.1]
// Reports & Settings go into the "More" drawer (only 5 slots available)
const BOTTOM_ITEMS = [
  { href: '/dashboard',   label: 'داشبورد',  icon: LayoutDashboard },
  { href: '/marketplace', label: 'بازار',    icon: Store           },
  { href: '/portfolio',   label: 'دارایی‌ها', icon: Briefcase       },
  { href: '/income',      label: 'درآمد',    icon: Banknote        },
]

interface MobileBottomNavProps {
  onOpenDrawer: () => void
}

export function MobileBottomNav({ onOpenDrawer }: MobileBottomNavProps) {
  const pathname = usePathname()

  // Hide bottom nav during Invest/Sell checkout flows so the sticky CTA owns the bottom [M §6.8, M §7.6]
  if (pathname.startsWith('/invest/') || pathname.startsWith('/sell/')) return null

  return (
    // Hidden at lg+ — persistent sidebar takes over [M §2]
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface border-t border-border shadow-[0_-4px_16px_rgba(3,8,14,.06)] bottom-nav"
      aria-label="ناوبری اصلی"
    >
      <div className="flex h-14">
        {/* Nav items — flex in RTL naturally flows right→left [M §3.1] */}
        {BOTTOM_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-0.5',
                'min-h-[44px] transition-colors duration-[120ms] motion-reduce:transition-none',
                isActive ? 'text-text' : 'text-text-muted',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active pill behind icon [D §9.16 / M §3.1] */}
              <span
                className={cn(
                  'flex items-center justify-center w-10 h-6 rounded-pill transition-colors duration-[120ms]',
                  isActive ? 'bg-sidebar-active' : 'bg-transparent',
                )}
              >
                <Icon
                  size={20}
                  strokeWidth={1.5}
                  className={isActive ? 'text-sidebar-active-fg' : 'text-text-muted'}
                />
              </span>
              <span className="text-[10px] font-medium">{label}</span>
              <NavPendingReporter />
            </Link>
          )
        })}

        {/* "More" — opens the drawer [M §3.1] */}
        <button
          onClick={onOpenDrawer}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[44px] text-text-muted"
          aria-label="بیشتر"
        >
          <span className="flex items-center justify-center w-10 h-6 rounded-pill">
            <Menu size={20} strokeWidth={1.5} />
          </span>
          <span className="text-[10px] font-medium">بیشتر</span>
        </button>
      </div>
    </nav>
  )
}
