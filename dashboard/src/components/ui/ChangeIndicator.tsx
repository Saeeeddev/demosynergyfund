'use client'

import { cn } from '@/lib/utils/cn'
import { formatPercent } from '@/lib/utils/numbers'

// [D §9.3] ▲/▼ + value, green for positive, red for negative, bidi-isolated
// Arrow sits on the END side (left in RTL) — flex RTL: value first (right), arrow last (left)
// [D §6.1] Use vertical ▲/▼ so "up = good" is unambiguous after mirroring

interface ChangeIndicatorProps {
  value: number              // raw numeric change (positive or negative)
  formatted?: string         // pre-formatted string (skips auto-formatting)
  variant?: 'pill' | 'inline'
  className?: string
}

export function ChangeIndicator({
  value,
  formatted,
  variant = 'inline',
  className,
}: ChangeIndicatorProps) {
  const isPositive = value >= 0
  const label = formatted ?? formatPercent(value)
  const arrow = isPositive ? '▲' : '▼'

  const colorClasses = isPositive
    ? variant === 'pill'
      ? 'bg-green-tint text-green-deep'
      : 'text-green-deep'
    : variant === 'pill'
      ? 'bg-red-tint text-red-deep'
      : 'text-red-deep'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1',
        'text-[13px] font-medium leading-none whitespace-nowrap tabular-nums',
        variant === 'pill' && 'rounded-pill px-2 py-0.5',
        colorClasses,
        className,
      )}
    >
      {/* Value on start (right in RTL flex), arrow on end (left in RTL flex) [D §6.1] */}
      <span>{label}</span>
      <span aria-hidden="true" className="text-[10px]">{arrow}</span>
    </span>
  )
}
