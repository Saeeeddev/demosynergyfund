'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'
import { IconChip, ChipRole } from './IconChip'
import { ChangeIndicator } from './ChangeIndicator'
import { Skeleton } from './Skeleton'

// [D §9.1] KPI stat card
// Anatomy (reading right→left in RTL):
//   Row 1: IconChip (start) + label
//   Row 2: big metric value
//   Row 3: ChangeIndicator + optional caption
// Compact variant: no chip, 16px padding [D §9.1]
// Phone: metric may step down to ~20px but stays largest [M §7.1]

interface StatCardProps {
  label: string
  value: string              // pre-formatted (use currency.ts / numbers.ts)
  change?: number            // raw percentage change for ChangeIndicator
  changeLabel?: string       // pre-formatted change (skip auto-formatting)
  caption?: string           // suffix after change, e.g. "/ ماه"
  icon?: ReactNode           // Lucide icon node
  role?: ChipRole
  compact?: boolean
  isLoading?: boolean        // shows shape-matched skeleton in place of value/change [D §9.20]
  className?: string
}

export function StatCard({
  label,
  value,
  change,
  changeLabel,
  caption,
  icon,
  role = 'positive',
  compact = false,
  isLoading = false,
  className,
}: StatCardProps) {
  const showChange = change !== undefined || changeLabel !== undefined

  return (
    <div
      className={cn(
        // asas metric card: soft diffuse shadow, gentle hover lift
        'bg-surface border border-border rounded-card shadow-[var(--shadow-card)]',
        'transition-[box-shadow,transform] duration-200 ease-out motion-reduce:transition-none',
        'hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5',
        'flex flex-col gap-2',
        compact ? 'p-4' : 'p-5',
        className,
      )}
    >
      {/* Row 1: chip + label (chip on start/right in RTL) */}
      <div className="flex items-center gap-2">
        {!compact && icon && (
          <IconChip role={role} icon={icon} size="md" />
        )}
        <span className="text-[13px] font-medium text-text-muted leading-tight">
          {label}
        </span>
      </div>

      {/* Row 2: big metric value — tabular-nums for digit alignment [D §3.3] */}
      {isLoading ? (
        <Skeleton className="h-6 w-2/3 rounded-md" />
      ) : (
        <div
          className={cn(
            'font-bold text-text tabular-nums leading-none',
            // Phone: allow step-down to ~20px but keep it largest [M §7.1]
            'text-[20px] lg:text-[24px]',
          )}
        >
          {value}
        </div>
      )}

      {/* Row 3: change indicator + optional caption */}
      {!isLoading && showChange && (
        <div className="flex items-center gap-2 flex-wrap">
          <ChangeIndicator
            value={change ?? 0}
            formatted={changeLabel}
            variant="pill"
          />
          {caption && (
            <span className="text-xs text-text-muted">{caption}</span>
          )}
        </div>
      )}
    </div>
  )
}
