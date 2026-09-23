'use client'

import { cn } from '@/lib/utils/cn'
import { ChipRole } from './IconChip'

// [D §9.11] 6px height, --r-pill, track = role tint, fill = role base
// Fills from the START (right in RTL): fill is absolute, anchored to inset-inline-start (= right in RTL)
// In RTL: start-0 → right: 0; width% extends leftward from that anchor ✓

const trackClasses: Record<ChipRole, string> = {
  positive: 'bg-green-tint',
  negative: 'bg-red-tint',
  info:     'bg-blue-tint',
  energy:   'bg-gold-tint',
  special:  'bg-purple-tint',
  gray:     'bg-gray-tint',
}

const fillClasses: Record<ChipRole, string> = {
  positive: 'bg-green-base',
  negative: 'bg-red-base',
  info:     'bg-blue-base',
  energy:   'bg-gold-base',
  special:  'bg-purple-base',
  gray:     'bg-gray-base',
}

interface ProgressBarProps {
  value: number    // 0–100 percentage
  role?: ChipRole
  className?: string
}

export function ProgressBar({ value, role = 'positive', className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        'relative h-1.5 rounded-pill overflow-hidden',  // h-1.5 = 6px
        trackClasses[role],
        className,
      )}
    >
      <div
        className={cn(
          'absolute inset-block-0 start-0 rounded-pill',
          'transition-[width] duration-[200ms] ease-out motion-reduce:transition-none',
          fillClasses[role],
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
