'use client'

// [F §6] Reports category filter chips
// [M §6.6] Phone: horizontally scrollable row, no wrap

import { cn } from '@/lib/utils/cn'
import type { ReportCategory } from '@/lib/schemas/report'

// Re-export so page.tsx can use the same type
export type { ReportCategory }

const CATEGORY_MAP: Record<ReportCategory | 'all', { label: string; classes: string }> = {
  all:               { label: 'همه',              classes: 'bg-black-tint text-text'         },
  financial:         { label: 'مالی',              classes: 'bg-green-tint text-green-deep'   },
  technical:         { label: 'فنی',               classes: 'bg-blue-tint text-blue-deep'     },
  legal:             { label: 'حقوقی',             classes: 'bg-purple-tint text-purple-deep' },
  quarterly:         { label: 'فصلی',              classes: 'bg-gold-tint text-gold-deep'     },
  // Auto-generated, one per user per Persian month — see backend/reports/services.py.
  monthly_statement: { label: 'صورت‌حساب ماهانه', classes: 'bg-red-tint text-red-deep'        },
}

interface CategoryChipsProps {
  value: ReportCategory | 'all'
  onChange: (cat: ReportCategory | 'all') => void
  className?: string
}

export function CategoryChips({ value, onChange, className }: CategoryChipsProps) {
  return (
    <div
      role="group"
      aria-label="دسته‌بندی گزارش‌ها"
      className={cn(
        'flex gap-2',
        'overflow-x-auto',
        '[&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]',
        className,
      )}
    >
      {(Object.keys(CATEGORY_MAP) as (ReportCategory | 'all')[]).map((cat) => {
        const { label, classes } = CATEGORY_MAP[cat]
        const isActive = value === cat
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onChange(cat)}
            className={cn(
              'inline-flex items-center rounded-pill px-4 py-2',
              'text-[13px] font-medium whitespace-nowrap min-h-[44px] shrink-0',
              'border transition-colors duration-[120ms] ease-out motion-reduce:transition-none',
              'focus-visible:outline-2 focus-visible:outline-current',
              isActive
                ? cn(classes, 'border-transparent')
                : 'bg-surface border-border text-text-muted hover:bg-hover',
            )}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
