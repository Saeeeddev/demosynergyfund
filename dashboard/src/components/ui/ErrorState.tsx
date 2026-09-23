'use client'

import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from './Button'

// [D §9.21] Error state — inline (card-level) or full-section (page-level)
// - AlertTriangle 40px --red-base
// - Farsi title + subtitle from the copy table in [D §9.21]
// - Secondary retry button → calls onRetry (refetch), never full reload
// - scope="inline": replaces one card's content; scope="page": covers the panel content area
// - Do NOT show raw errors, stack traces, or HTTP codes to the user

/* Predefined Farsi error copy per failure type [D §9.21] */
export const ERROR_COPY = {
  network: {
    title:   'اتصال برقرار نشد',
    message: 'لطفاً اتصال اینترنت خود را بررسی کنید',
  },
  server: {
    title:   'خطای سرور',
    message: 'مشکلی از سمت سرور رخ داده — دوباره تلاش کنید',
  },
  notFound: {
    title:   'مورد یافت نشد',
    message: 'صفحه مورد نظر وجود ندارد — به بازار بروید',
  },
  generic: {
    title:   'بارگذاری با خطا مواجه شد',
    message: 'لطفاً دوباره تلاش کنید یا صفحه را بازخوانی کنید',
  },
} as const

interface ErrorStateProps {
  /** "inline" replaces a single card; "page" covers the full panel content area */
  scope?: 'inline' | 'page'
  /** Retry function — re-requests data, never does a full page reload */
  onRetry?: () => void
  /** Override the default Farsi error title */
  title?: string
  /** Override the default Farsi error subtitle */
  message?: string
  className?: string
}

export function ErrorState({
  scope = 'inline',
  onRetry,
  title   = ERROR_COPY.generic.title,
  message = ERROR_COPY.generic.message,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-4 text-center',
        scope === 'inline'
          // Inline: same card shape as whatever it replaces; caller controls container
          ? 'p-6 min-h-[160px]'
          // Page: full-section inside the shell; sidebar & topbar stay visible [D §9.21]
          : 'p-8 min-h-[360px]',
        className,
      )}
    >
      {/* AlertTriangle 40px --red-base [D §9.21] */}
      <AlertTriangle size={40} className="text-red-base shrink-0" aria-hidden="true" />

      <div className="flex flex-col gap-2">
        {/* h-sub: 15/24px 600 [D §3.2] */}
        <p className="text-[15px] font-semibold text-text leading-6">{title}</p>
        {/* caption: 12/18px 400 [D §3.2] */}
        <p className="text-[12px] text-text-muted leading-[18px]">{message}</p>
      </div>

      {onRetry && (
        <Button
          variant="secondary"
          size="compact"
          onClick={onRetry}
          // Touch target ≥44px [M §4]
          className="min-h-[44px]"
        >
          تلاش مجدد
        </Button>
      )}
    </div>
  )
}
