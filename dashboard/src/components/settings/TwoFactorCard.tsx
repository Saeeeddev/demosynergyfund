'use client'

// [F §7 Tab2] Two-factor authentication toggle
// [M §6.10] Toggle must be ≥44px tap target

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Shield } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export function TwoFactorCard() {
  const [enabled, setEnabled] = useState(false)

  return (
    <Card className="flex items-start justify-between gap-4">
      <div className="flex gap-3">
        <div className={cn(
          'w-10 h-10 rounded-chip flex items-center justify-center shrink-0',
          enabled ? 'bg-green-tint text-green-deep' : 'bg-surface-2 text-text-muted',
        )}>
          <Shield size={18} />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-[15px] font-semibold text-text">احراز هویت دو مرحله‌ای</h3>
          <p className="text-[13px] text-text-muted">
            با فعال‌سازی این گزینه، امنیت حساب شما افزایش می‌یابد.
          </p>
          <span className={cn(
            'text-[12px] font-semibold w-fit',
            enabled ? 'text-green-deep' : 'text-text-muted',
          )}>
            {enabled ? 'فعال' : 'غیرفعال'}
          </span>
        </div>
      </div>

      {/* Toggle — ≥44px tap target [M §6.10] */}
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => setEnabled((v) => !v)}
        className="shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
      >
        <span
          className={cn(
            'relative inline-flex h-6 w-11 items-center rounded-pill transition-colors duration-200',
            enabled ? 'bg-green-base' : 'bg-border-strong',
          )}
        >
          <span
            className={cn(
              'absolute h-5 w-5 rounded-pill bg-surface shadow transition-all duration-200',
              enabled ? 'translate-x-[-1.25rem] rtl:translate-x-[1.25rem]' : 'translate-x-[-0.125rem] rtl:translate-x-[0.125rem]',
            )}
          />
        </span>
      </button>
    </Card>
  )
}
