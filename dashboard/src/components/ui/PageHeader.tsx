'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

// asas-style page header: bold title + optional subtitle on the start (right in RTL),
// optional action buttons on the end (left in RTL). Sits directly on the gray canvas.
interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  /** Optional leading icon node rendered in a soft slate chip before the title. */
  icon?: ReactNode
  className?: string
}

export function PageHeader({ title, subtitle, actions, icon, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        {icon && (
          <span className="flex items-center justify-center w-11 h-11 rounded-chip bg-[var(--sidebar-hover)] text-[var(--sidebar-active)] shrink-0">
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <h1 className="text-[22px] lg:text-[24px] font-bold text-text leading-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[13px] text-text-muted mt-0.5 leading-snug">{subtitle}</p>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  )
}
