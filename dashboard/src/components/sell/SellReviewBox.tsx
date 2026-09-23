'use client'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Checkbox, CheckboxLink } from '@/components/ui/Input'
import { formatToman } from '@/lib/utils/currency'
import { formatNumber, bidiIsolate } from '@/lib/utils/numbers'
import { cn } from '@/lib/utils/cn'

export type ProceedsDestination = 'platform' | 'bank'

const DESTINATION_OPTIONS: { value: ProceedsDestination; label: string }[] = [
  { value: 'platform', label: 'موجودی پلتفرم' },
  { value: 'bank', label: 'انتقال بانکی' },
]

// [F §12, D §11, M §6.9] Sell review — Invest in reverse (red semantic).
// Structure mirrors InvestmentReviewBox exactly: one in-flow card (summary +
// destination + agreements) on every breakpoint so the content scrolls
// normally, plus a slim mobile fixed CTA bar. No expandable sheet — that was
// Sell-only drift; Invest never had one, so neither should this.

interface SellReviewBoxProps {
  quantity: number
  proceeds: number
  fee: number
  netProceeds: number
  destination: ProceedsDestination
  onDestinationChange: (v: ProceedsDestination) => void
  feeRate: number
  rules1: boolean
  rules2: boolean
  onRules1Change: (v: boolean) => void
  onRules2Change: (v: boolean) => void
  canProceed: boolean
  onNext: () => void
}

interface SummaryItem {
  label: string
  value: string
}

export function SellReviewBox({
  quantity,
  proceeds,
  fee,
  netProceeds,
  destination,
  onDestinationChange,
  feeRate,
  rules1,
  rules2,
  onRules1Change,
  onRules2Change,
  canProceed,
  onNext,
}: SellReviewBoxProps) {
  const feeLabel = `${(feeRate * 100).toFixed(1)}٪`

  const summaryItems: SummaryItem[] = [
    { label: 'تعداد سهام فروخته‌شده', value: `${bidiIsolate(formatNumber(quantity))} وات` },
    { label: 'عواید فروش', value: formatToman(proceeds) },
    { label: `کارمزد (${feeLabel})`, value: formatToman(fee) },
    { label: 'خالص دریافتی', value: formatToman(netProceeds) },
  ]

  return (
    <>
      {/* ── Summary card — in normal flow on every breakpoint ── */}
      <Card className="flex flex-col gap-4 lg:gap-5 p-4 lg:p-5">
        <h3 className="text-[15px] font-semibold text-text">خلاصه فروش</h3>

        {/* Live computed values — two columns to keep the card short */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          {summaryItems.map((item) => (
            <SummaryRow key={item.label} label={item.label} value={item.value} />
          ))}
        </div>

        <div className="h-px bg-border" />

        {/* Destination — where sell proceeds go, mirrors the funding-source toggle */}
        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-medium text-text-muted">واریز عواید به</span>
          <div className="grid grid-cols-2 gap-2">
            {DESTINATION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onDestinationChange(opt.value)}
                aria-pressed={destination === opt.value}
                className={cn(
                  'min-h-[44px] rounded-md border text-[13px] font-medium px-2 py-2 transition-colors',
                  destination === opt.value
                    ? 'bg-red-tint border-red-base text-red-deep'
                    : 'bg-surface border-border text-text-muted hover:bg-hover',
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Agreement checkboxes */}
        <div className="flex flex-col gap-3">
          <Checkbox
            checked={rules1}
            onChange={onRules1Change}
            label={
              <span>
                قوانین فروش سهام{' '}
                <CheckboxLink href="/rules">پلتفرم سینرجی</CheckboxLink>
                {' '}را خوانده و می‌پذیرم
              </span>
            }
          />
          <Checkbox
            checked={rules2}
            onChange={onRules2Change}
            label={
              <span>
                با{' '}
                <CheckboxLink href="/risk-disclosure">ریسک‌های فروش زودهنگام</CheckboxLink>
                {' '}آشنا هستم
              </span>
            }
          />
        </div>

        {/* Desktop CTA lives inside the card; mobile uses the fixed bar below */}
        <Button
          variant="destructive"
          size="wide"
          fullWidth
          disabled={!canProceed}
          onClick={onNext}
          className="hidden lg:flex"
        >
          ادامه — بررسی سفارش فروش
        </Button>
      </Card>

      {/* ── Mobile: slim fixed CTA bar (total + button) [M §6.9, M §10] ── */}
      <div
        className={cn(
          'lg:hidden fixed bottom-0 inset-x-0 z-50 bg-surface',
          'border-t border-border shadow-[0_-4px_16px_rgba(3,8,14,.10)]',
          'sticky-cta px-4 pt-2',
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex flex-col shrink-0">
            <span className="text-[10px] text-text-muted">خالص دریافتی</span>
            <span className="text-[15px] font-bold text-text tabular-nums">{formatToman(netProceeds)}</span>
          </div>
          <Button
            variant="destructive"
            size="wide"
            disabled={!canProceed}
            onClick={onNext}
            className="flex-1"
          >
            ادامه — بررسی سفارش فروش
          </Button>
        </div>
      </div>
    </>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[12px] text-text-muted">{label}</span>
      <span className="text-[14px] font-semibold text-text tabular-nums">{value}</span>
    </div>
  )
}
