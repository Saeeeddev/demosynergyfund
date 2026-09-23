'use client'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatToman } from '@/lib/utils/currency'
import { formatNumber, bidiIsolate } from '@/lib/utils/numbers'
import { cn } from '@/lib/utils/cn'
import type { Project } from '@/types/domain'

// [F §10 Step2] Read-only summary of Step 1 selections + Confirm button
// [M §6.8] Confirm is sticky at bottom on mobile

interface ReviewStepProps {
  project: Project
  shares: number
  ownershipPct: number
  annualIncome: number
  monthlyPayout: number
  investmentAmount: number
  fee: number
  total: number
  onConfirm: () => void
  isPending: boolean
}

export function ReviewStep({
  project,
  shares,
  ownershipPct,
  annualIncome,
  monthlyPayout,
  investmentAmount,
  fee,
  total,
  onConfirm,
  isPending,
}: ReviewStepProps) {
  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full pb-24 lg:pb-0">
      <Card className="p-5 flex flex-col gap-5">
        <h3 className="text-[15px] font-semibold text-text">بررسی سفارش</h3>

        {/* Project summary chip */}
        <div className="bg-surface-2 border border-border rounded-md p-3">
          <p className="text-[11px] text-text-muted mb-1">دارایی</p>
          <p className="text-[14px] font-semibold text-text">{project.name}</p>
          <p className="text-[12px] text-text-muted">{project.location}</p>
        </div>

        {/* Investment summary rows */}
        <div className="flex flex-col gap-3">
          {[
            { label: 'تعداد سهام خریداری‌شده', value: `${bidiIsolate(formatNumber(shares))} وات` },
            { label: 'درصد مالکیت',            value: `${bidiIsolate(formatNumber(ownershipPct, 4))}٪` },
            { label: 'درآمد سالانه (تخمینی)',   value: formatToman(annualIncome) },
            { label: 'پرداخت ماهانه (تخمینی)',  value: formatToman(monthlyPayout) },
          ].map(row => (
            <ReviewRow key={row.label} label={row.label} value={row.value} />
          ))}

          <div className="h-px bg-border" />

          <ReviewRow label="مبلغ سرمایه‌گذاری"                              value={formatToman(investmentAmount)} />
          <ReviewRow label="کارمزد"                                          value={formatToman(fee)} />

          <div className="h-px bg-border" />

          <div className="flex justify-between items-center">
            <span className="text-[14px] font-semibold text-text">مجموع پرداختی</span>
            <span className="text-[15px] font-bold text-green-deep tabular-nums">{formatToman(total)}</span>
          </div>
        </div>
      </Card>

      {/* Confirm CTA — sticky bottom on mobile [M §6.8] */}
      <div className="lg:static fixed bottom-0 inset-x-0 z-40 lg:z-auto bg-surface lg:bg-transparent border-t border-border lg:border-0 p-4 lg:p-0 sticky-cta lg:[padding-block-end:0]">
        <Button
          variant="primary"
          size="wide"
          fullWidth
          onClick={onConfirm}
          disabled={isPending}
        >
          {isPending ? 'در حال پردازش…' : 'تأیید و سرمایه‌گذاری'}
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
