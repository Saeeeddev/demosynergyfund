'use client'

// [F §11 R3] Assumptions & methodology — expandable panel
// Disclaimer ALWAYS visible outside the expander [M §6.7, F §11]

import { useState } from 'react'
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import type { ForecastAssumptions } from '@/types/domain'

interface AssumptionsPanelProps {
  assumptions: ForecastAssumptions
}

export function AssumptionsPanel({ assumptions }: AssumptionsPanelProps) {
  const [open, setOpen] = useState(false)

  return (
    <Card className="flex flex-col gap-4 p-4">
      {/* Disclaimer — ALWAYS visible [F §11, M §6.7] */}
      <div className="flex items-start gap-3 rounded-md bg-gold-tint border border-gold-base/30 px-4 py-3">
        <AlertTriangle size={18} className="text-gold-deep shrink-0 mt-0.5" />
        <p className="text-[13px] text-gold-deep leading-relaxed">
          <strong>توجه:</strong> این اعداد تخمینی هستند و بر اساس مفروضاتی مدل‌سازی شده‌اند.
          بازده واقعی می‌تواند متفاوت باشد و این اطلاعات ضمانت سود را به همراه ندارند.
        </p>
      </div>

      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full text-start group"
        aria-expanded={open}
      >
        <span className="text-[14px] font-medium text-text">مفروضات و روش محاسبه</span>
        <span className="text-text-muted group-hover:text-text transition-colors">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>

      {/* Expandable content */}
      {open && (
        <div className="border-t border-border pt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <AssumptionRow label="بازده سالانه هدف" value={`${assumptions.annualYieldPercent}٪`} />
          <AssumptionRow label="نرخ کاهش سالانه پنل" value={`${assumptions.degradationRatePercent}٪`} />
          <AssumptionRow
            label="تعرفه برق (تومان / کیلووات‌ساعت)"
            value={assumptions.electricityTariff.toLocaleString('fa')}
          />
          <AssumptionRow label="کارمزد عملیاتی" value={`${assumptions.operatingFeePercent}٪`} />
          <div className="sm:col-span-2">
            <p className="text-[12px] text-text-muted leading-relaxed">
              پیش‌بینی‌ها بر اساس عملکرد تاریخی، مشخصات فنی پنل‌های نصب‌شده، تعرفه فعلی برق،
              و نرخ کاهش استاندارد پنل‌های خورشیدی محاسبه شده‌اند. سناریوهای محافظه‌کارانه و خوش‌بینانه
              تغییرات ±۲۰٪ در پارامترهای کلیدی را فرض می‌کنند.
            </p>
          </div>
        </div>
      )}
    </Card>
  )
}

function AssumptionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[12px] text-text-muted">{label}</span>
      <span className="text-[14px] font-semibold text-text tabular-nums">{value}</span>
    </div>
  )
}
