'use client'

// [F §11 R3] Assumptions & methodology — disclaimer remains visible when collapsed.

import { useState } from 'react'
import { AlertTriangle, ChevronDown, SlidersHorizontal } from 'lucide-react'
import { formatNumber } from '@/lib/utils/numbers'
import type { ForecastAssumptions } from '@/types/domain'

interface AssumptionsPanelProps {
  assumptions: ForecastAssumptions
  targetYieldPercent: number
}

export function AssumptionsPanel({ assumptions, targetYieldPercent }: AssumptionsPanelProps) {
  const [open, setOpen] = useState(false)

  return (
    <section className="overflow-hidden rounded-card border border-border bg-surface">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-16 w-full items-center gap-3 px-4 py-3 text-start transition-colors hover:bg-hover focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-base sm:px-5"
        aria-expanded={open}
        aria-controls="forecast-assumptions-details"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-chip bg-blue-tint text-blue-deep">
          <SlidersHorizontal size={18} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-semibold text-text">مفروضات و روش محاسبه</span>
          <span className="block text-[12px] leading-relaxed text-text-2">
            بازده مبنای محاسبه {formatNumber(targetYieldPercent, 1)}٪ · افت سالانه {formatNumber(assumptions.degradationRatePercent, 1)}٪
          </span>
        </span>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-chip border border-border-strong text-text-2">
          <ChevronDown size={17} className={`transition-transform duration-200 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      <div id="forecast-assumptions-details" hidden={!open} className="border-t border-border px-4 py-4 sm:px-5">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <AssumptionRow label="بازده سالانه مبنای محاسبه" value={`${formatNumber(targetYieldPercent, 1)}٪`} />
            <AssumptionRow label="افت سالانه تولید پنل" value={`${formatNumber(assumptions.degradationRatePercent, 1)}٪`} />
            <AssumptionRow label="تعرفه برق" value={`${formatNumber(assumptions.electricityTariff)} تومان / کیلووات‌ساعت`} />
            <AssumptionRow label="کارمزد عملیاتی" value={`${formatNumber(assumptions.operatingFeePercent, 1)}٪`} />
          </div>
          <div className="mt-4 border-t border-border pt-3">
            <p className="text-[12px] font-semibold text-text">روش محاسبه</p>
            <p className="mt-1 text-[12px] leading-relaxed text-text-2">
              درآمد هر سال با بازده هدف و افت تدریجی تولید برآورد می‌شود؛ سپس درآمد سال‌ها برای نمایش بازده تجمیعی جمع می‌شود.
            </p>
            <p className="mt-2 text-[12px] leading-relaxed text-text-2">
              تعرفه برق و کارمزد بالا اطلاعات تکمیلی پروژه‌اند و در این برآورد ساده مستقیماً محاسبه نمی‌شوند.
            </p>
          </div>
      </div>

      <div className="flex items-start gap-2 border-t border-gold-base/30 bg-gold-tint px-4 py-3 sm:px-5">
        <AlertTriangle size={17} className="mt-0.5 shrink-0 text-gold-deep" />
        <p className="text-[12px] leading-relaxed text-text-2">
          <strong className="text-text">توجه:</strong> این اعداد تخمینی‌اند؛ بازده واقعی ممکن است متفاوت باشد و سود تضمین نمی‌شود.
        </p>
      </div>
    </section>
  )
}

function AssumptionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-surface-2 px-3 py-2.5">
      <span className="block text-[12px] text-text-2">{label}</span>
      <span className="mt-0.5 block text-[14px] font-semibold text-text tabular-nums">{value}</span>
    </div>
  )
}
