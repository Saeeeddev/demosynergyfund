'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

export type ChipRole = 'positive' | 'negative' | 'info' | 'energy' | 'special' | 'gray'

// Unified icon treatment: a single slate color for ALL icon chips, matching the
// sidebar's one-color icon style for a cleaner, more professional look.
// `role` is kept for API compatibility but no longer changes the color.
const CHIP_BG = 'bg-[var(--sidebar-hover)]'
const CHIP_ICON = 'text-[var(--sidebar-active)]'

interface IconChipProps {
  role?: ChipRole
  icon: ReactNode
  size?: 'sm' | 'md'   // 36px / 40px [D §9.2]
  className?: string
}

export function IconChip({ icon, size = 'md', className }: IconChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center shrink-0',
        'rounded-chip',          // --r-chip = 10px [D §4.3]
        size === 'md' ? 'w-10 h-10' : 'w-9 h-9',
        CHIP_BG,
        CHIP_ICON,
        className,
      )}
    >
      {icon}
    </span>
  )
}
