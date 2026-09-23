'use client'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Minus, Plus } from 'lucide-react'
import { formatToman } from '@/lib/utils/currency'
import { bidiIsolate, formatNumber, onlyDigits } from '@/lib/utils/numbers'
import type { Project } from '@/types/domain'

// [F §10 Step1] Share quantity picker — the user buys whole KILOWATTS (min 1 kW).
// Stepper (− / value / +) + quick presets. No summary well here — the live
// figures live in the review box. [M §7.5]

interface InvestmentAmountBoxProps {
  project: Project
  /** quantity in kilowatts, as a raw digit string */
  kw: string
  onKwChange: (v: string) => void
  /** maximum buyable kW (available shares) */
  maxKw: number
  /** price of one kilowatt (Toman) */
  pricePerKw: number
}

const PRESETS = [1, 5, 10, 50]

export function InvestmentAmountBox({ kw, onKwChange, maxKw, pricePerKw }: InvestmentAmountBoxProps) {
  const value = parseInt(onlyDigits(kw), 10) || 0
  const clamp = (n: number) => Math.max(0, Math.min(maxKw, n))
  const setVal = (n: number) => onKwChange(String(clamp(n)))

  const amount = value * pricePerKw
  const tooHigh = value > maxKw

  return (
    <Card className="p-4 flex flex-col gap-4">
      <h3 className="text-[13px] font-medium text-text-muted">تعداد سهام (کیلو وات)</h3>

      {/* Stepper */}
      <div className="flex items-center gap-2">
        <StepBtn ariaLabel="کاهش" disabled={value <= 1} onClick={() => setVal(value - 1)}>
          <Minus size={18} />
        </StepBtn>
        <input
          dir="ltr"
          inputMode="numeric"
          value={value === 0 ? '' : String(value)}
          onChange={(e) => setVal(parseInt(onlyDigits(e.target.value), 10) || 0)}
          placeholder="۱"
          className="flex-1 h-12 md:h-11 rounded-md border border-border-strong bg-surface text-center text-[18px] font-bold text-text tabular-nums focus:outline-none focus:ring-2 focus:ring-green-tint focus:border-green-base"
        />
        <StepBtn ariaLabel="افزایش" disabled={value >= maxKw} onClick={() => setVal(value + 1)}>
          <Plus size={18} />
        </StepBtn>
      </div>

      {/* Min / available info */}
      <div className="flex justify-between text-[12px] text-text-muted">
        <span>حداقل: {bidiIsolate(formatNumber(1))} کیلو وات</span>
        <span>موجود: {bidiIsolate(formatNumber(maxKw))} کیلو وات</span>
      </div>

      {/* Quick presets (skip those above availability) */}
      <div className="grid grid-cols-4 gap-2">
        {PRESETS.filter((p) => p <= maxKw).map((p) => (
          <Button
            key={p}
            variant={value === p ? 'primary' : 'secondary'}
            size="compact"
            shape="pill"
            onClick={() => setVal(p)}
            className="text-[12px]"
          >
            {bidiIsolate(formatNumber(p))}
          </Button>
        ))}
      </div>

      {/* Cost of the selected quantity */}
      <div className="flex justify-between border-t border-border pt-3 text-[14px]">
        <span className="text-text-muted">مبلغ قابل پرداخت</span>
        <span className="font-semibold text-text tabular-nums">{formatToman(amount)}</span>
      </div>

      {tooHigh && (
        <p className="text-[12px] text-red-base">تعداد انتخابی بیش از سهام موجود پروژه است.</p>
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
