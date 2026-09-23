'use client'

import { ChevronRight, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

// [D §9.17] Prev/next chevrons + page numbers, dark active pill (Black bg)
// Chevrons mirror in RTL: ChevronRight = previous (points right = backward), ChevronLeft = next [D §6.1]
// Whole control is disabled while a page request is in flight [D §9.17]
// Disabled pages: --text-subtle [D §9.17]
// Mobile: replaces with load-more/infinite-scroll — handled in page tasks [M §7.7]

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  loading?: boolean
  className?: string
}

export function Pagination({ page, totalPages, onPageChange, loading, className }: PaginationProps) {
  if (totalPages <= 1) return null

  const isDisabled = Boolean(loading)
  const pages = buildPageRange(page, totalPages)

  return (
    <nav
      aria-label="صفحه‌بندی"
      className={cn(
        'flex items-center gap-1',
        isDisabled && 'opacity-50 pointer-events-none select-none',
        className,
      )}
    >
      {/* Previous — ChevronRight in RTL = visual "go back" [D §6.1] */}
      <ChevronButton
        onClick={() => onPageChange(page - 1)}
        disabled={isDisabled || page <= 1}
        aria-label="صفحه قبل"
      >
        <ChevronRight size={18} />
      </ChevronButton>

      {/* Page number pills */}
      {pages.map((p, i) =>
        p === 'gap' ? (
          <span
            key={`gap-${i}`}
            className="px-1 text-[13px] text-text-subtle select-none"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p as number)}
            disabled={isDisabled}
            aria-label={`صفحه ${p}`}
            aria-current={p === page ? 'page' : undefined}
            className={cn(
              'flex items-center justify-center',
              'min-w-[36px] h-9 px-2 rounded-md',
              // Touch target ≥44px [M §4]
              'min-h-[44px] md:min-h-0 md:h-9',
              'text-[13px] font-medium tabular-nums select-none',
              'transition-colors duration-[120ms] ease-out motion-reduce:transition-none',
              'focus-visible:outline-2 focus-visible:outline-current',
              p === page
                // Active: dark pill (Black-deep) with white text [D §9.17]
                ? 'bg-black-deep text-white'
                : 'bg-surface border border-border text-text-2 hover:bg-hover',
            )}
          >
            {p}
          </button>
        ),
      )}

      {/* Next — ChevronLeft in RTL = visual "go forward" [D §6.1] */}
      <ChevronButton
        onClick={() => onPageChange(page + 1)}
        disabled={isDisabled || page >= totalPages}
        aria-label="صفحه بعد"
      >
        <ChevronLeft size={18} />
      </ChevronButton>
    </nav>
  )
}

/* Shared prev/next button */
function ChevronButton({
  onClick,
  disabled,
  children,
  'aria-label': ariaLabel,
}: {
  onClick: () => void
  disabled: boolean
  children: React.ReactNode
  'aria-label': string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        'flex items-center justify-center',
        'w-9 h-9 rounded-md',
        'min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 md:w-9 md:h-9',
        'text-text-muted bg-surface border border-border',
        'hover:bg-hover',
        'transition-colors duration-[120ms] ease-out motion-reduce:transition-none',
        'focus-visible:outline-2 focus-visible:outline-current',
        'disabled:opacity-40 disabled:cursor-not-allowed',
      )}
    >
      {children}
    </button>
  )
}

/* Build compact page range with gaps (ellipsis) for large page counts */
function buildPageRange(current: number, total: number): (number | 'gap')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const result: (number | 'gap')[] = [1]
  if (current > 3) result.push('gap')
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    result.push(p)
  }
  if (current < total - 2) result.push('gap')
  result.push(total)
  return result
}
