'use client'

import { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils/cn'

// [D §9.7] Underline tabs
// Active tab: --text + 2px underline in active role color (default Green; Project-details Blue)
// Inactive: --text-muted
// 200ms animated underline
// Phone: single-line horizontally scrollable strip [M §7.2]

export type TabAccent = 'green' | 'blue'

export interface TabItem {
  value: string
  label: string
}

interface TabsProps {
  tabs: TabItem[]
  value: string
  onChange: (value: string) => void
  accent?: TabAccent
  className?: string
}

// 2px underline color per accent [D §9.7]
const underlineColor: Record<TabAccent, string> = {
  green: 'bg-green-base',
  blue:  'bg-blue-base',
}

export function Tabs({ tabs, value, onChange, accent = 'green', className }: TabsProps) {
  const activeRef = useRef<HTMLButtonElement>(null)

  // Auto-scroll the active tab into view on change [M §7.2]
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [value])

  return (
    // Single-line scrollable strip; border-b is the baseline [D §9.7, M §7.2]
    <div
      role="tablist"
      className={cn(
        'flex border-b border-border',
        'overflow-x-auto',
        '[&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]',
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.value === value
        return (
          <button
            key={tab.value}
            ref={isActive ? activeRef : undefined}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.value)}
            className={cn(
              'relative shrink-0 px-4 py-3',
              'text-[14px] font-medium whitespace-nowrap select-none',
              // Touch target ≥44px [M §4]
              'min-h-[44px]',
              'transition-colors duration-[200ms] ease-out motion-reduce:transition-none',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current',
              isActive ? 'text-text' : 'text-text-muted hover:text-text-2',
            )}
          >
            {tab.label}

            {/* 2px animated underline pinned to the bottom [D §9.7] */}
            <span
              className={cn(
                'absolute bottom-0 inset-x-0 h-0.5',
                'transition-opacity duration-[200ms] ease-out motion-reduce:transition-none',
                underlineColor[accent],
                isActive ? 'opacity-100' : 'opacity-0',
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
