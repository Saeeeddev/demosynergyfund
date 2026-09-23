'use client'

// [F §11 R3] 4 summary cards — live-recalculate when horizon/scenario/amount change
// Projected Total Return / Avg Annual ROI / Payback Period / Cumulative Income

import { TrendingUp, Percent, DollarSign } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { formatTomanCompact } from '@/lib/utils/currency'
import { formatPercent } from '@/lib/utils/numbers'
import type { RoiForecastResult } from '@/types/domain'

interface ForecastSummaryCardsProps {
  result: RoiForecastResult
}

export function ForecastSummaryCards({ result }: ForecastSummaryCardsProps) {
  const {
    projectedTotalReturn,
    projectedReturnPercent,
    avgAnnualRoi,
    projectedCumulativeIncome,
  } = result

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-4">
      <StatCard
        label="بازده کل پیش‌بینی‌شده"
        value={formatTomanCompact(projectedTotalReturn)}
        changeLabel={formatPercent(projectedReturnPercent)}
        icon={<TrendingUp size={20} />}
        role="positive"
      />

      <StatCard
        label="میانگین ROI سالانه"
        value={formatPercent(avgAnnualRoi)}
        icon={<Percent size={20} />}
        role="info"
      />

      <StatCard
        label="درآمد تجمیعی پیش‌بینی‌شده"
        value={formatTomanCompact(projectedCumulativeIncome)}
        icon={<DollarSign size={20} />}
        role="special"
      />
    </div>
  )
}
