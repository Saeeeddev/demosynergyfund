'use client'

// [F §11 R2] Investment Calculator — KILOWATT based (like the Invest flow).
// User picks whole kW (min 1) with a stepper → live shares / ownership / income.
// [M §6.7] Phone: placed ABOVE the tabs. [D §9.18] green inset well.

import { useRouter } from 'next/navigation'
import { Calculator, Minus, Plus } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatToman, formatTomanCompact } from '@/lib/utils/currency'
import { formatNumber, formatPercent, bidiIsolate, onlyDigits, toPersianDigits } from '@/lib/utils/numbers'
import type { Project } from '@/types/domain'

interface InvestmentCalculatorProps {
  project: Project
  /** quantity in kilowatts (raw digit string) — shared with the ROI forecast + Invest flow */
  kw: string
  onKwChange: (raw: string) => void
}

export function InvestmentCalculator({ project, kw, onKwChange }: InvestmentCalculatorProps) {
  const router = useRouter()

  const pricePerKw = project.sharePrice // Toman per kilowatt already
  const maxKw = Math.floor((project.totalCapacityWatts * (1 - project.soldPercent / 100)) / 1000)

  const numKw = parseInt(onlyDigits(kw), 10) || 0
  const shares = numKw * 1000 // watts
  const amount = numKw * pricePerKw
  const ownershipPct = project.totalCapacityWatts > 0 ? (shares / project.totalCapacityWatts) * 100 : 0
  const annualIncome = amount * (project.targetYield / 100)
  const monthlyPayout = annualIncome / 12

  const clamp = (n: number) => Math.max(0, Math.min(maxKw, n))
  const setVal = (n: number) => onKwChange(String(clamp(n)))

  const isValid = numKw >= 1 && numKw <= maxKw

  return (
    <Card className="flex flex-col gap-4 p-5 lg:min-h-[520px]">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="w-8 h-8 rounded-chip bg-[var(--sidebar-hover)] text-[var(--sidebar-active)] flex items-center justify-center shrink-0">
          <Calculator size={16} />
        </span>
        <h3 className="text-[15px] font-semibold text-text">ماشین‌حساب سرمایه‌گذاری</h3>
      </div>

      {/* kW stepper */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-text-muted">تعداد سهام (کیلو وات)</label>
        <div className="flex items-center gap-2">
          <StepBtn ariaLabel="کاهش" disabled={numKw <= 1} onClick={() => setVal(numKw - 1)}>
            <Minus size={18} />
          </StepBtn>
          <input
            dir="ltr"
            inputMode="numeric"
            value={numKw === 0 ? '' : toPersianDigits(String(numKw))}
            onChange={(e) => setVal(parseInt(onlyDigits(e.target.value), 10) || 0)}
            placeholder="۱"
            className="min-w-0 flex-1 h-12 md:h-11 rounded-md border border-border-strong bg-surface text-center text-[18px] font-bold text-text tabular-nums focus:outline-none focus:ring-2 focus:ring-green-tint focus:border-green-base"
          />
          <StepBtn ariaLabel="افزایش" disabled={numKw >= maxKw} onClick={() => setVal(numKw + 1)}>
            <Plus size={18} />
          </StepBtn>
        </div>
        <div className="flex justify-between text-[11px] text-text-muted">
          <span>هر کیلووات: {formatTomanCompact(pricePerKw)}</span>
          <span>موجود: {bidiIsolate(formatNumber(maxKw))} کیلو وات</span>
        </div>
      </div>

      {/* Live calculation results — green inset well [D §9.18] */}
      {numKw > 0 && (
        <div className="rounded-md bg-green-tint border-s-2 border-green-base p-4 flex flex-col gap-2.5">
          <CalcRow label="مبلغ سرمایه‌گذاری" value={formatToman(amount)} />
          <CalcRow label="تعداد سهام (وات)" value={bidiIsolate(formatNumber(shares))} />
          <CalcRow label="درصد مالکیت" value={formatPercent(ownershipPct)} />
          <CalcRow label="درآمد سالانه تخمینی" value={formatToman(annualIncome)} />
          <CalcRow label="پرداخت ماهانه" value={formatToman(monthlyPayout)} />
        </div>
      )}

      {/* Invest Now — carries the chosen kW through to the Invest flow */}
      <Button
        variant="primary"
        size="wide"
        fullWidth
        disabled={!isValid}
        onClick={() => router.push(`/invest/${project.id}?kw=${numKw}`)}
      >
        سرمایه‌گذاری کنید
      </Button>

      {numKw > 0 && numKw < 1 && (
        <p className="text-[12px] text-red-base text-center">حداقل ۱ کیلووات است</p>
      )}
    </Card>
  )
}

function StepBtn({
  children,
  onClick,
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  ariaLabel: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="flex items-center justify-center w-12 h-12 md:w-11 md:h-11 rounded-md border border-border-strong bg-surface text-text hover:bg-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
    >
      {children}
    </button>
  )
}

function CalcRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[12px] text-green-deep">{label}</span>
      <span className="text-[13px] font-semibold text-green-deep tabular-nums">{value}</span>
    </div>
  )
}
