'use client'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Minus, Plus } from 'lucide-react'
import { formatToman } from '@/lib/utils/currency'
import { formatNumber, bidiIsolate, onlyDigits } from '@/lib/utils/numbers'
import type { Holding } from '@/types/domain'

// [F §12, D §11, M §6.9] Quantity input + 4 sell presets + red summary well.
// The user sells whole KILOWATTS (min 1 kW, never a fraction) — same rule and
// stepper pattern as Invest's InvestmentAmountBox. Presets: 25/50/75/100% of
// the whole-kW holding.

interface SellAmountBoxProps {
  holding: Holding
  /** quantity in kilowatts, as a raw digit string */
  kw: string
  onKwChange: (v: string) => void
  /** maximum sellable kW (holding.sharesOwned, already a whole-kW count) */
  maxKw: number
  proceeds: number
  netProceeds: number
}

function presetLabel(pct: number): string {
  return `${Math.round(pct * 100)}٪`
}

const PRESET_PCTS = [0.25, 0.5, 0.75, 1]

export function SellAmountBox({
  holding,
  kw,
  onKwChange,
  maxKw,
  proceeds,
  netProceeds,
}: SellAmountBoxProps) {
  const value = parseInt(onlyDigits(kw), 10) || 0
  const clamp = (n: number) => Math.max(0, Math.min(maxKw, n))
  const setVal = (n: number) => onKwChange(String(clamp(n)))
  const presets = PRESET_PCTS.map(pct => Math.floor(maxKw * pct))

  const showSummary = value > 0 && value <= maxKw

  return (
    <Card className="p-4 flex flex-col gap-4">
      <h3 className="text-[13px] font-medium text-text-muted">تعداد سهام (کیلو وات)</h3>

      {/* Stepper — same shape as InvestmentAmountBox */}
      <div className="flex items-center gap-2">
        <StepBtn ariaLabel="کاهش" disabled={value <= 1} onClick={() => setVal(value - 1)}>
          <Minus size={18} />
        </StepBtn>
        <input
          dir="ltr"
          inputMode="numeric"
          value={value === 0 ? '' : String(value)}
          onChange={e => setVal(parseInt(onlyDigits(e.target.value), 10) || 0)}
          placeholder="۱"
          className="flex-1 h-12 md:h-11 rounded-md border border-border-strong bg-surface text-center text-[18px] font-bold text-text tabular-nums focus:outline-none focus:ring-2 focus:ring-red-tint focus:border-red-base"
        />
        <StepBtn ariaLabel="افزایش" disabled={value >= maxKw} onClick={() => setVal(value + 1)}>
          <Plus size={18} />
        </StepBtn>
      </div>

      {/* Min / available info */}
      <div className="flex justify-between text-[12px] text-text-muted">
        <span>حداقل: {bidiIsolate(formatNumber(1))} کیلو وات</span>
        <span>موجودی: {bidiIsolate(formatNumber(maxKw))} کیلو وات</span>
      </div>

      {/* Preset pills [F §12, D §11] — 25% / 50% / 75% / 100% of the holding */}
      <div className="grid grid-cols-4 gap-2">
        {PRESET_PCTS.map((pct, i) => {
          const preset  = presets[i]
          const isActive = value === preset
          return (
            <Button
              key={pct}
              variant={isActive ? 'destructive' : 'secondary'}
              size="compact"
              shape="pill"
              onClick={() => setVal(preset)}
              className="text-[11px] px-1"
            >
              {presetLabel(pct)}
            </Button>
          )
        })}
      </div>

      {/* Red sell summary well [D §11 Sell recipe] */}
      {showSummary && (
        <div
          className="bg-red-tint border-s-2 border-red-base rounded-md p-3 flex flex-col gap-2.5"
          aria-label="خلاصه فروش"
        >
          <p className="text-[12px] font-semibold text-red-deep">خلاصه فروش</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <SummaryRow label="تعداد سهام"    value={`${bidiIsolate(formatNumber(value * 1000))} وات`} />
            <SummaryRow label="قیمت فعلی"     value={formatToman(holding.currentPrice)} />
            <SummaryRow label="عواید فروش"    value={formatToman(proceeds)} />
            <SummaryRow label="خالص دریافتی"  value={formatToman(netProceeds)} />
          </div>
        </div>
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

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] text-red-soft">{label}</span>
      <span className="text-[12px] font-semibold text-red-deep tabular-nums">{value}</span>
    </div>
  )
}
