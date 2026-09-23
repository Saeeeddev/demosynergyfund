'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

// [D §9.19] Empty state: centered outline icon (48px, --text-subtle) + h-sub message + optional CTA
// Direction-correct RTL Farsi copy phrased as an invitation
//
// Example copy per [D §9.19]:
//   Portfolio no holdings : «هنوز سرمایه‌گذاری‌ای ندارید — اولین پروژه را انتخاب کنید»
//   Notifications empty   : «هیچ اعلانی وجود ندارد»
//   Reports no documents  : «سندی یافت نشد — فیلترها را تغییر دهید»

interface EmptyProps {
  /** Lucide icon node (or any ReactNode); rendered at 48px [D §9.19] */
  icon?: ReactNode
  /** Farsi h-sub message — phrased as an invitation [D §9.19] */
  message: string
  /** Primary or Secondary CTA button — use <Button> from Button.tsx */
  action?: ReactNode
  className?: string
}

export function Empty({ icon, message, action, className }: EmptyProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4',
        'text-center p-8',
        className,
      )}
    >
      {/* Outline icon — 48px, text-subtle [D §9.19, D §7] */}
      {icon && (
        <span
          className="text-text-subtle flex items-center justify-center"
          style={{ width: 48, height: 48 }}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}

      {/* h-sub: 15/24px 600 [D §3.2] */}
      <p className="text-[15px] font-semibold text-text leading-6 max-w-xs">
        {message}
      </p>

      {/* Optional CTA */}
      {action && <div>{action}</div>}
    </div>
  )
}
