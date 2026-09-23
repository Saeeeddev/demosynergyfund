'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

// [D §9.8] Secondary-button trigger + caret; floating menu --shadow-md
// Selected item shows a check on the start side (right in RTL)
// NOTE: on phone this becomes a bottom sheet — wired in T3.4 [M §7.4]

export interface DropdownOption<T extends string = string> {
  value: T
  label: string
}

interface DropdownProps<T extends string = string> {
  options: DropdownOption<T>[]
  value?: T
  placeholder?: string
  onChange: (value: T) => void
  icon?: ReactNode
  disabled?: boolean
  /** Fill the available width with a block trigger (label start, caret end). */
  fullWidth?: boolean
  className?: string
}

export function Dropdown<T extends string = string>({
  options,
  value,
  placeholder = 'انتخاب کنید',
  onChange,
  icon,
  disabled,
  fullWidth,
  className,
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selected = options.find((o) => o.value === value)

  // Close on outside click / tap
  useEffect(() => {
    if (!open) return
    const onOutside = (e: MouseEvent | TouchEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    document.addEventListener('touchstart', onOutside)
    return () => {
      document.removeEventListener('mousedown', onOutside)
      document.removeEventListener('touchstart', onOutside)
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div
      ref={containerRef}
      className={cn('relative', fullWidth ? 'block w-full' : 'inline-block', className)}
    >
      {/* Trigger — Secondary button look [D §9.8] */}
      <button
        type="button"
        onClick={() => !disabled && setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        className={cn(
          'inline-flex items-center gap-2',
          'h-10 px-4 rounded-md',
          'bg-surface text-text-2 border border-border',
          'text-sm font-medium select-none',
          // Touch target ≥44px [M §4]
          'min-h-[44px] md:min-h-0 md:h-10',
          'hover:bg-hover',
          'transition-colors duration-[120ms] ease-out motion-reduce:transition-none',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current',
          fullWidth && 'flex w-full justify-between',
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        )}
      >
        {icon && <span className="shrink-0 text-text-muted">{icon}</span>}
        <span className={cn('text-start', fullWidth && 'min-w-0 flex-1 truncate', !selected && 'text-text-muted')}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          size={16}
          className={cn(
            'shrink-0 text-text-muted transition-transform duration-[200ms] motion-reduce:transition-none',
            open && 'rotate-180',
          )}
        />
      </button>

      {/* Floating menu [D §9.8] */}
      {open && (
        <div
          role="listbox"
          className={cn(
            'absolute start-0 z-50 mt-1 min-w-full',
            'bg-surface rounded-md border border-border shadow-[var(--shadow-md)]',
            'p-2',
          )}
        >
          {options.map((opt) => {
            const isSel = opt.value === value
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSel}
                onClick={() => { onChange(opt.value); setOpen(false) }}
                className={cn(
                  'w-full flex items-center gap-2',
                  'h-9 px-3 rounded-md text-sm text-start',
                  'transition-colors duration-[120ms] ease-out motion-reduce:transition-none',
                  'focus-visible:outline-2 focus-visible:outline-current',
                  isSel ? 'text-text font-semibold' : 'text-text-2',
                  'hover:bg-hover',
                )}
              >
                {/* Selected check on start side (right in RTL) [D §9.8] */}
                <span className="shrink-0 w-4 flex items-center">
                  {isSel && <Check size={14} className="text-green-base" />}
                </span>
                <span className="min-w-0 flex-1 truncate text-start">{opt.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
