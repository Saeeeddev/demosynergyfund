'use client'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Checkbox, CheckboxLink } from '@/components/ui/Input'
import { formatToman } from '@/lib/utils/currency'
import { formatNumber, bidiIsolate } from '@/lib/utils/numbers'
import { cn } from '@/lib/utils/cn'

// [F §10 Step1 Left] Live investment review + agreement checkboxes.
// One in-flow card (summary + agreements) on every breakpoint so the content
// scrolls normally — no bottom sheet that expands to the whole screen.
// Mobile gets a slim fixed CTA bar so the kW input above stays visible. [M §6.8]
// CTA disabled until both checkboxes checked. Investing only ever charges the
// account balance — there is no funding-source choice to make.

interface InvestmentReviewBoxProps {
  shares: number
  ownershipPct: number
  annualIncome: number
  monthlyPayout: number
  investmentAmount: number
  fee: number
  total: number
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

export function InvestmentReviewBox({
  shares,
  ownershipPct,
  annualIncome,
  monthlyPayout,
  investmentAmount,
  fee,
  total,
  rules1,
  rules2,
  onRules1Change,
  onRules2Change,
  canProceed,
  onNext,
}: InvestmentReviewBoxProps) {
  const summaryItems: SummaryItem[] = [
    { label: 'مبلغ سرمایه‌گذاری', value: formatToman(investmentAmount) },
    { label: 'تعداد سهام',    value: `${bidiIsolate(formatNumber(shares / 1000, 1))} کیلو وات` },
    { label: 'درصد مالکیت',   value: `${bidiIsolate(formatNumber(ownershipPct, 4))}٪` },
    { label: 'درآمد سالانه',  value: formatToman(annualIncome) },
    { label: 'پرداخت ماهانه', value: formatToman(monthlyPayout) },
    { label: 'کارمزد',        value: formatToman(fee) },
    { label: 'مجموع پرداختی', value: formatToman(total) },
  ]

  return (
    <>
      {/* ── Summary card — in normal flow on every breakpoint ── */}
      <Card className="flex flex-col gap-4 lg:gap-5 p-4 lg:p-5">
        <h3 className="text-[15px] font-semibold text-text">خلاصه سرمایه‌گذاری</h3>

        {/* Live computed values — two columns to keep the card short */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          {summaryItems.map((item) => (
            <SummaryRow key={item.label} label={item.label} value={item.value} />
          ))}
        </div>

        <div className="h-px bg-border" />

        {/* Agreement checkboxes */}
        <div className="flex flex-col gap-3">
          <Checkbox
            checked={rules1}
            onChange={onRules1Change}
            label={
              <span>
                قوانین و مقررات{' '}
                <CheckboxLink href="/rules">پلتفرم سینرژی</CheckboxLink>
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
                <CheckboxLink href="/risk-disclosure">اعلامیه ریسک‌های سرمایه‌گذاری</CheckboxLink>
                {' '}آشنا هستم
              </span>
            }
          />
        </div>

        {/* Desktop CTA lives inside the card; mobile uses the fixed bar below */}
        <Button
          variant="primary"
          size="wide"
          fullWidth
          disabled={!canProceed}
          onClick={onNext}
          className="hidden lg:flex"
        >
          ادامه — بررسی سفارش
        </Button>
      </Card>

      {/* ── Mobile: slim fixed CTA bar (total + button) [M §6.8, M §10] ── */}
      <div
        className={cn(
          'lg:hidden fixed bottom-0 inset-x-0 z-50 bg-surface',
          'border-t border-border shadow-[0_-4px_16px_rgba(3,8,14,.10)]',
          'sticky-cta px-4 pt-2',  // sticky-cta adds safe-area bottom padding
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex flex-col shrink-0">
            <span className="text-[10px] text-text-muted">مجموع پرداختی</span>
            <span className="text-[15px] font-bold text-text tabular-nums">{formatToman(total)}</span>
          </div>
          <Button
            variant="primary"
            size="wide"
            disabled={!canProceed}
            onClick={onNext}
            className="flex-1"
          >
            ادامه — بررسی سفارش
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
