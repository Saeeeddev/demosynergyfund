'use client'

import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

// Right-side slide-over panel (used for deposit / withdraw flows).
// Overlay click + Escape close it; body scroll is locked while open.
interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
}

export function Drawer({ open, onClose, title, children, className }: DrawerProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[300]">
      {/* Backdrop */}
      <div
        className="drawer-overlay absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel — pinned to the right edge (matches reference) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'drawer-panel absolute inset-y-0 right-0 w-full max-w-md',
          'bg-surface shadow-[var(--shadow-pop)] flex flex-col',
          className,
        )}
      >
        <header className="flex items-center justify-between gap-3 px-5 h-16 border-b border-border shrink-0">
          <h2 className="text-[16px] font-semibold text-text">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="flex items-center justify-center w-9 h-9 rounded-md text-text-muted hover:bg-hover hover:text-text transition-colors"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  )
}
