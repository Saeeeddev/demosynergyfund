'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'
import { IconChip, ChipRole } from './IconChip'
import { ProgressBar } from './ProgressBar'
import { ChangeIndicator } from './ChangeIndicator'

// [D §9.10] Holdings-style list row
// Reading right→left in RTL: asset chip → name + sub → value → mini bar → P/L pill
// In flex RTL, first child is on the right (start)

interface ListRowProps {
  icon?: ReactNode           // chip icon
  chipRole?: ChipRole        // chip color role
  chipInitials?: string      // if no icon, render initials in chip
  name: string
  sub?: string
  value: string              // pre-formatted value
  barValue?: number          // 0–100 for mini weight bar
  barRole?: ChipRole
  change?: number            // P/L: positive = green, negative = red
  changeLabel?: string       // pre-formatted change label
  onClick?: () => void
  className?: string
  trailing?: ReactNode       // slot for a trailing action (e.g. Sell button)
}

export function ListRow({
  icon,
  chipRole = 'positive',
  chipInitials,
  name,
  sub,
  value,
  barValue,
  barRole = 'positive',
  change,
  changeLabel,
  onClick,
  className,
  trailing,
}: ListRowProps) {
  const Tag = onClick ? 'button' : 'div'

  return (
    <Tag
      className={cn(
        'flex items-center gap-3 w-full text-start',
        'py-3 px-0',
        'transition-colors duration-[120ms] ease-out',
        'hover:bg-hover',
        onClick && 'cursor-pointer rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border',
        className,
      )}
      onClick={onClick}
    >
      {/* Asset chip — sits on start (right in RTL, first in flex RTL) [D §9.10] */}
      {(icon || chipInitials) && (
        <IconChip role={chipRole} size="sm" icon={
          icon ?? (
            <span className="text-[11px] font-bold leading-none">
              {chipInitials?.slice(0, 2)}
            </span>
          )
        } />
      )}

      {/* Name + sub — takes remaining space */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-text leading-tight truncate">
          {name}
        </span>
        {sub && (
          <span className="text-xs text-text-muted leading-tight truncate">
            {sub}
          </span>
        )}
      </div>

      {/* Value — tabular digits for alignment [D §3.3] */}
      {value && (
        <span className="text-sm font-semibold text-text tabular-nums whitespace-nowrap shrink-0">
          {value}
        </span>
      )}

      {/* Mini weight bar — w-16 = 64px */}
      {barValue !== undefined && (
        <div className="w-16 shrink-0">
          <ProgressBar value={barValue} role={barRole} />
        </div>
      )}

      {/* P/L pill */}
      {(change !== undefined || changeLabel !== undefined) && (
        <ChangeIndicator
          value={change ?? 0}
          formatted={changeLabel}
          variant="pill"
          className="shrink-0"
        />
      )}

      {/* Trailing slot — e.g. Sell button */}
      {trailing && (
        <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
          {trailing}
        </div>
      )}
    </Tag>
  )
}
