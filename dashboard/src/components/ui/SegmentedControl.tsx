'use client'

import { cn } from '@/lib/utils/cn'

// [D §9.6] Pill container --surface-2 bg, active segment = white pill + shadow-sm + --text
// Inactive segments: --text-muted, no bg
// RTL: segments flow right→left naturally in flex RTL
// Horizontally scrollable if overflow [M §7.1]

export interface SegmentOption<T extends string = string> {
  value: T
  label: string
}

interface SegmentedControlProps<T extends string = string> {
  options: SegmentOption<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="group"
      className={cn(
        'inline-flex items-center gap-1 p-1',
        'rounded-pill bg-surface-2',
        // Scrollable if segments overflow the container [M §7.1]
        'overflow-x-auto',
        // Hide scrollbar visually while keeping scroll functionality
        '[&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]',
        className,
      )}
    >
      {options.map((opt) => {
        const isActive = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(opt.value)}
            className={cn(
              'px-3 py-1.5 rounded-pill',
              'text-[13px] font-medium whitespace-nowrap select-none',
              // Touch target ≥44px [M §4]
              'min-h-[36px]',
              'transition-all duration-[200ms] ease-out motion-reduce:transition-none',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current',
              isActive
                ? 'bg-surface shadow-[var(--shadow-sm)] text-text'
                : 'text-text-muted hover:text-text-2',
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
