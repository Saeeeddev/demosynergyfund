'use client'

import { Search } from 'lucide-react'
import { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

// [D §9.13] --surface-2 bg, --border, --r-pill
// Search icon on start (right in RTL), Persian placeholder «جستجو…»

type SearchFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  className?: string
}

export function SearchField({ className, placeholder = 'جستجو…', ...props }: SearchFieldProps) {
  return (
    <label className={cn('relative flex items-center', className)}>
      {/* Icon on start (right in RTL) — absolute, pointer-events-none [D §9.13] */}
      <span className="pointer-events-none absolute start-3 text-text-muted flex items-center">
        <Search size={16} />
      </span>

      <input
        type="search"
        placeholder={placeholder}
        className={cn(
          'w-full',
          'bg-surface-2 border border-border rounded-pill',
          // Icon on start → pad start by icon width + gap; pad end normally
          'h-10 ps-10 pe-4',
          // Mobile: ≥16px prevents iOS auto-zoom [M §10]
          'text-[16px] md:text-[13px]',
          'text-text placeholder:text-text-subtle',
          'focus:outline-none focus:border-border-strong',
          'transition-colors duration-[120ms] ease-out motion-reduce:transition-none',
          // Hide native search-clear and decoration
          '[&::-webkit-search-cancel-button]:hidden',
        )}
        {...props}
      />
    </label>
  )
}
