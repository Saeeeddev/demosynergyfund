'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

// asas analysis-result card title: medium-weight heading with a short slate-blue
// gradient underline accent (RTL: anchored to the start/right edge).
// Optional trailing slot (e.g. a "total" pill) sits on the end/left.
interface SectionTitleProps {
  title: string
  subtitle?: string
  /** Trailing element (badge/pill/control) shown on the end side. */
  trailing?: ReactNode
  /** Leading icon node rendered in a soft slate chip. */
  icon?: ReactNode
  /** Underline accent under the title (asas signature). Default true. */
  accent?: boolean
  className?: string
}

export function SectionTitle({
  title,
  subtitle,
  trailing,
  icon,
  accent = true,
  className,
}: SectionTitleProps) {
  return (
    <div className={cn('flex items-start justify-between gap-3', className)}>
      <div className="flex items-center gap-3 min-w-0">
        {icon && (
          <span className="flex items-center justify-center w-9 h-9 rounded-chip bg-blue-tint text-blue-base shrink-0">
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <h3 className="relative inline-block text-[17px] font-semibold text-text leading-tight pb-2">
            {title}
            {accent && (
              <span className="absolute bottom-0 start-0 h-[3px] w-10 rounded-sm bg-gradient-to-l from-blue-base to-blue-soft" />
            )}
          </h3>
          {subtitle && (
            <p className="text-[12px] text-text-muted leading-snug mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </div>
  )
}
