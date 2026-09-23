'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'
import { ChipRole } from './IconChip'

// [D §9.4] pill, micro text, role tint bg + deep text
const roleClasses: Record<ChipRole, string> = {
  positive: 'bg-green-tint text-green-deep',
  negative: 'bg-red-tint text-red-deep',
  info:     'bg-blue-tint text-blue-deep',
  energy:   'bg-gold-tint text-gold-deep',
  special:  'bg-purple-tint text-purple-deep',
  gray:     'bg-gray-tint text-gray-deep',
}

interface BadgeProps {
  role?: ChipRole
  children: ReactNode
  className?: string
}

export function Badge({ role = 'gray', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center',
        'rounded-pill px-2 py-0.5',
        'text-[11px] font-semibold leading-none whitespace-nowrap',
        roleClasses[role],
        className,
      )}
    >
      {children}
    </span>
  )
}
