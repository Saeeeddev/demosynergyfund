'use client'

// [F §5 R3 left] Income Row 3: Payout method display + link to Settings
// Shows active bank/platform method; loading and error states

import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { Landmark, Wallet, Settings, CheckCircle2 } from 'lucide-react'
import type { PayoutMethod } from '@/lib/schemas/payout'

interface PayoutMethodCardProps {
  method?: PayoutMethod
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

const TYPE_CONFIG = {
  bank: {
    icon: <Landmark size={22} strokeWidth={1.5} />,
    label: 'حساب بانکی',
    iconBg: 'bg-blue-tint text-blue-base',
  },
  platform: {
    icon: <Wallet size={22} strokeWidth={1.5} />,
    label: 'کیف پول پلتفرم',
    iconBg: 'bg-gold-tint text-gold-deep',
  },
}

export function PayoutMethodCard({ method, isLoading, isError, onRetry }: PayoutMethodCardProps) {
  return (
    <Card className="flex flex-col gap-4 h-full p-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-text">روش پرداخت</h2>
        <Link
          href="/settings"
          className="flex items-center gap-1 text-[12px] text-text-muted hover:text-text transition-colors"
        >
          <Settings size={13} strokeWidth={1.5} />
          <span>تنظیمات</span>
        </Link>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-4 w-24 rounded-md" />
        </div>
      )}

      {/* Error state */}
      {!isLoading && isError && <ErrorState scope="inline" onRetry={onRetry} />}

      {/* Method card */}
      {!isLoading && !isError && method && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-2 border border-border">
            {/* Icon */}
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${TYPE_CONFIG[method.type].iconBg}`}>
              {TYPE_CONFIG[method.type].icon}
            </div>
            {/* Info */}
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <span className="text-[11px] text-text-muted leading-tight">
                {TYPE_CONFIG[method.type].label}
              </span>
              <span className="text-[14px] font-semibold text-text truncate leading-tight">
                {method.name}
              </span>
              <span className="text-[12px] text-text-muted tabular-nums leading-tight">
                {method.details}
              </span>
            </div>
          </div>

          {/* Default badge */}
          {method.isDefault && (
            <div className="flex items-center gap-1.5 text-green-deep">
              <CheckCircle2 size={14} strokeWidth={2} />
              <span className="text-[12px] font-medium">روش پرداخت پیش‌فرض</span>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && !method && (
        <div className="flex flex-col items-center gap-3 py-6 text-text-muted">
          <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center">
            <Wallet size={24} strokeWidth={1.5} className="opacity-50" />
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-[13px] font-medium text-text-muted">روش پرداختی تنظیم نشده</p>
            <Link
              href="/settings"
              className="text-[12px] text-blue-base hover:underline"
            >
              افزودن روش پرداخت
            </Link>
          </div>
        </div>
      )}
    </Card>
  )
}
