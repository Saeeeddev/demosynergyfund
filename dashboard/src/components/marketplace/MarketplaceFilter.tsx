'use client'

// [F §3] Marketplace filter bar — category chips + sort Dropdown
// [M §6.3] Phone: chips scroll horizontally; sort opens as bottom sheet

import { useState } from 'react'
import { SlidersHorizontal, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { ProjectStatus } from '@/types/domain'

export type SortOption = 'newest' | 'yield_desc' | 'price_asc' | 'sold_desc'

const SORT_LABELS: Record<SortOption, string> = {
  newest: 'جدیدترین',
  yield_desc: 'بیشترین بازده',
  price_asc: 'کمترین قیمت',
  sold_desc: 'بیشترین فروش',
}

export type CategoryFilter = 'all' | ProjectStatus

interface CategoryChip {
  value: CategoryFilter
  label: string
}

const CATEGORIES: CategoryChip[] = [
  { value: 'all', label: 'همه' },
  { value: 'active', label: 'فعال' },
  { value: 'funding', label: 'در حال تأمین' },
  { value: 'closed', label: 'بسته‌شده' },
]

interface MarketplaceFilterProps {
  category: CategoryFilter
  sort: SortOption
  onCategoryChange: (cat: CategoryFilter) => void
  onSortChange: (sort: SortOption) => void
}

export function MarketplaceFilter({
  category,
  sort,
  onCategoryChange,
  onSortChange,
}: MarketplaceFilterProps) {
  const [sortSheetOpen, setSortSheetOpen] = useState(false)

  return (
    <>
      <div className="flex items-center gap-3">
        {/* Category chip row — horizontally scrollable on phone [M §6.3] */}
        <div className="flex items-center gap-2 overflow-x-auto flex-1 pb-1 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => onCategoryChange(cat.value)}
              className={cn(
                'flex-shrink-0 rounded-pill px-4 py-2 text-[13px] font-medium',
                'whitespace-nowrap min-h-[40px]',
                'transition-colors duration-[120ms] motion-reduce:transition-none',
                'focus-visible:outline-2 focus-visible:outline-current',
                category === cat.value
                  ? 'bg-black-deep text-white'
                  : 'bg-surface border border-border text-text-muted hover:bg-hover hover:text-text',
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort — desktop inline dropdown; phone triggers bottom sheet */}
        <div className="relative flex-shrink-0">
          {/* Desktop: inline select */}
          <div className="hidden md:block">
            <SortDropdown value={sort} onChange={onSortChange} />
          </div>
          {/* Phone: open bottom sheet button */}
          <button
            type="button"
            onClick={() => setSortSheetOpen(true)}
            className={cn(
              'md:hidden flex items-center gap-2 px-4 py-2 rounded-md min-h-[44px]',
              'bg-surface border border-border text-[13px] font-medium text-text-2',
              'hover:bg-hover transition-colors motion-reduce:transition-none',
            )}
            aria-label="مرتب‌سازی"
          >
            <SlidersHorizontal size={16} className="text-text-muted" />
            <span>مرتب‌سازی</span>
          </button>
        </div>
      </div>

      {/* Mobile bottom sheet for sort [M §7.4] */}
      {sortSheetOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSortSheetOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-x-0 bottom-0 z-50 bg-surface rounded-t-card p-5 flex flex-col gap-1">
            <div className="w-10 h-1.5 rounded-pill bg-border mx-auto mb-3" aria-hidden="true" />
            <p className="text-[15px] font-semibold text-text mb-2">مرتب‌سازی</p>
            {(Object.keys(SORT_LABELS) as SortOption[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => { onSortChange(s); setSortSheetOpen(false) }}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-md text-[14px] text-start',
                  'min-h-[44px] transition-colors motion-reduce:transition-none',
                  s === sort
                    ? 'bg-green-tint text-green-deep font-medium'
                    : 'text-text-2 hover:bg-hover',
                )}
              >
                {s === sort && <span className="text-green-base">✓</span>}
                {SORT_LABELS[s]}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  )
}

/* Desktop inline dropdown */
function SortDropdown({ value, onChange }: { value: SortOption; onChange: (s: SortOption) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-md min-h-[40px]',
          'bg-surface border border-border text-[13px] font-medium text-text-2',
          'hover:bg-hover transition-colors motion-reduce:transition-none',
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <SlidersHorizontal size={14} className="text-text-muted" />
        {SORT_LABELS[value]}
        <ChevronDown size={13} className={cn('text-text-muted transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} aria-hidden="true" />
          <div
            className="absolute end-0 top-full mt-1 z-40 min-w-[180px] bg-surface border border-border rounded-md shadow-[var(--shadow-md)] py-1"
            role="listbox"
          >
            {(Object.keys(SORT_LABELS) as SortOption[]).map((s) => (
              <button
                key={s}
                type="button"
                role="option"
                aria-selected={s === value}
                onClick={() => { onChange(s); setOpen(false) }}
                className={cn(
                  'flex items-center gap-2 w-full px-4 py-2.5 text-[13px] text-start',
                  'hover:bg-hover transition-colors motion-reduce:transition-none',
                  s === value ? 'text-green-deep font-medium' : 'text-text-2',
                )}
              >
                {s === value ? (
                  <span className="text-green-base text-[10px] w-4">✓</span>
                ) : (
                  <span className="w-4" />
                )}
                {SORT_LABELS[s]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
