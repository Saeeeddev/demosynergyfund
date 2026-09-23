'use client'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatToman } from '@/lib/utils/currency'
import { formatNumber, bidiIsolate } from '@/lib/utils/numbers'
import { cn } from '@/lib/utils/cn'
import type { Holding } from '@/types/domain'

// [F §12] Sell Step 2 — read-only summary of the sell order + Confirm (red)
// [M §6.9] Confirm sticky at bottom on mobile

interface SellReviewStepProps {
  holding: Holding
  quantity: number
  proceeds: number
  fee: number
  netProceeds: number
  destination: 'platform' | 'bank'
  onConfirm: () => void
  isPending: boolean
}

export function SellReviewStep({
  holding,
  quantity,
  proceeds,
  fee,
  netProceeds,
  destination,
  onConfirm,
  isPending,
}: SellReviewStepProps) {
  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full pb-24 lg:pb-0">
      <Card className="p-5 flex flex-col gap-5">
        <h3 className="text-[15px] font-semibold text-text">بررسی سفارش فروش</h3>

        {/* Holding info chip */}
        <div className="bg-red-tint border border-red-base rounded-md p-3">
          <p className="text-[11px] text-red-soft mb-1">دارایی در حال فروش</p>
          <p className="text-[14px] font-semibold text-red-deep">{holding.projectName}</p>
          <p className="text-[12px] text-red-soft">{holding.projectLocation}</p>
        </div>

        {/* Order summary */}
        <div className="flex flex-col gap-3">
          {[
            { label: 'تعداد سهام فروخته‌شده', value: `${bidiIsolate(formatNumber(quantity))} وات` },
            { label: 'قیمت فروش هر سهم',      value: formatToman(holding.currentPrice) },
            { label: 'عواید ناخالص فروش',      value: formatToman(proceeds) },
            { label: 'کارمزد',                 value: formatToman(fee) },
            { label: 'واریز عواید به',
              value: destination === 'platform' ? 'موجودی پلتفرم' : 'انتقال بانکی',
              valueClassName: 'text-text' },
          ].map(row => (
            <ReviewRow key={row.label} label={row.label} value={row.value} valueClassName={row.valueClassName} />
          ))}

          <div className="h-px bg-border" />

          <div className="flex justify-between items-center">
            <span className="text-[14px] font-semibold text-text">خالص دریافتی</span>
            <span className="text-[15px] font-bold text-red-deep tabular-nums">{formatToman(netProceeds)}</span>
          </div>
        </div>
      </Card>

      {/* Confirm — sticky bottom on mobile */}
      <div className="lg:static fixed bottom-0 inset-x-0 z-40 lg:z-auto bg-surface lg:bg-transparent border-t border-border lg:border-0 p-4 lg:p-0 sticky-cta lg:[padding-block-end:0]">
        <Button
          variant="destructive"
          size="wide"
          fullWidth
          onClick={onConfirm}
          disabled={isPending}
        >
          {isPending ? 'در حال پردازش…' : 'تأیید و فروش سهام'}
        </Button>
      </div>
    </div>
  )
}

function ReviewRow({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="flex justify-between items-center gap-2">
      <span className="text-[13px] text-text-muted">{label}</span>
      <span className={cn('text-[13px] font-medium tabular-nums text-text-2', valueClassName)}>
        {value}
      </span>
    </div>
  )
}
