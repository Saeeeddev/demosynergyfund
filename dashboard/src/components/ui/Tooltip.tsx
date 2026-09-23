'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

// [D §9.12] Light (white card) and dark (black multi-series) tooltip variants
// Anchored to the start side in RTL (opens from the right side of the trigger)
// Desktop: appears on hover; Touch: opens on tap, dismisses on outside-tap [M §4]

export interface TooltipSeries {
  label: string
  value: string
  color?: string   // hex or CSS color for the role-colored dot
}

interface TooltipProps {
  // For light variant — any ReactNode content
  content?: ReactNode
  // For dark multi-series variant — chart legend-style rows
  series?: TooltipSeries[]
  variant?: 'light' | 'dark'
  children: ReactNode
  className?: string
}

export function Tooltip({
  content,
  series,
  variant = 'light',
  children,
  className,
}: TooltipProps) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLSpanElement>(null)

  // Dismiss on outside tap [M §4]
  useEffect(() => {
    if (!open) return
    const dismiss = (e: MouseEvent | TouchEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', dismiss)
    document.addEventListener('touchstart', dismiss)
    return () => {
      document.removeEventListener('mousedown', dismiss)
      document.removeEventListener('touchstart', dismiss)
    }
  }, [open])

  const handlePointerDown = (e: React.PointerEvent) => {
    // Touch: toggle on tap; prevent the following mousedown from immediately closing [M §4]
    if (e.pointerType === 'touch') {
      e.preventDefault()
      setOpen((v) => !v)
    }
  }

  return (
    <span
      ref={wrapRef}
      className={cn('relative inline-flex', className)}
      // Desktop hover
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      // Touch tap
      onPointerDown={handlePointerDown}
    >
      {children}

      {open && (
        <span
          // Positioned above the trigger; anchored to start (right in RTL) [D §9.12]
          className={cn(
            'absolute bottom-full mb-2 z-50',
            'start-0',
            'pointer-events-none select-none',
            'rounded-md',
            variant === 'light'
              ? 'bg-surface border border-border shadow-[var(--shadow-pop)] px-3 py-2 whitespace-nowrap'
              : 'bg-black-deep shadow-[var(--shadow-pop)] px-3 py-2 min-w-[160px]',
          )}
        >
          {/* Light variant — simple label + value [D §9.12] */}
          {variant === 'light' && (
            <span className="flex flex-col gap-0.5">
              {typeof content === 'string' ? (
                <span className="text-[13px] font-semibold text-text">{content}</span>
              ) : (
                content
              )}
            </span>
          )}

          {/* Dark multi-series variant — role-colored dot rows [D §9.12] */}
          {variant === 'dark' && series && (
            <span className="flex flex-col gap-1.5">
              {series.map((s, i) => (
                <span key={i} className="flex items-center gap-2">
                  {s.color && (
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: s.color }}
                    />
                  )}
                  <span className="text-[12px] text-white/70 leading-none">{s.label}</span>
                  <span className="text-[13px] font-semibold text-white tabular-nums ms-auto">
                    {s.value}
                  </span>
                </span>
              ))}
            </span>
          )}
        </span>
      )}
    </span>
  )
}
