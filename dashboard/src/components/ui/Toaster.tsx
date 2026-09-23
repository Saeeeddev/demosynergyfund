'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { subscribeToasts, dismissToast, type ToastItem, type ToastType } from '@/lib/toast'
import { cn } from '@/lib/utils/cn'

// Bottom-center toast stack. Subscribes to the module-level toast store so any
// code (React Query errors, manual calls) can surface a popup. [F §1] global feedback
const ICONS: Record<ToastType, typeof AlertCircle> = {
  error: AlertCircle,
  success: CheckCircle2,
  info: Info,
}

const STYLES: Record<ToastType, string> = {
  error: 'border-red-soft bg-surface text-text [&_svg]:text-red-base',
  success: 'border-green-soft bg-surface text-text [&_svg]:text-green-deep',
  info: 'border-blue-soft bg-surface text-text [&_svg]:text-blue-deep',
}

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([])

  useEffect(() => subscribeToasts(setItems), [])

  if (items.length === 0) return null

  return (
    <div
      className="fixed inset-x-0 bottom-6 z-[400] flex flex-col items-center gap-3 px-4 pointer-events-none"
      aria-live="polite"
      role="region"
      aria-label="پیام‌ها"
    >
      {items.map((t) => {
        const Icon = ICONS[t.type]
        return (
          <div
            key={t.id}
            role="alert"
            className={cn(
              'toast-enter pointer-events-auto flex items-center gap-3.5 w-full max-w-xl',
              'rounded-lg border-2 px-5 py-4 shadow-[var(--shadow-pop)]',
              STYLES[t.type],
            )}
          >
            <Icon size={26} strokeWidth={2} className="shrink-0" />
            <span className="flex-1 text-[15px] font-medium leading-relaxed">{t.message}</span>
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              aria-label="بستن"
              className="shrink-0 text-text-muted hover:text-text transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
