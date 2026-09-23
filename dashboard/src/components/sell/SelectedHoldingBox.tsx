'use client'

import { memo } from 'react'
import { MapPin, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ChangeIndicator } from '@/components/ui/ChangeIndicator'
import { formatToman } from '@/lib/utils/currency'
import { formatNumber, bidiIsolate } from '@/lib/utils/numbers'
import type { Holding } from '@/types/domain'

// [F §12, A §3.3] Shows the holding the user is about to sell:
// project name + location, current price, shares owned, total value, P&L

interface SelectedHoldingBoxProps {
  holding: Holding
}

export const SelectedHoldingBox = memo(function SelectedHoldingBox({ holding }: SelectedHoldingBoxProps) {
  return (
    <Card className="p-4">
      <h3 className="text-[13px] font-medium text-text-muted mb-3">دارایی در حال فروش</h3>

      {/* Project name + location */}
      <div className="flex flex-col gap-1 mb-4">
        <p className="text-[15px] font-semibold text-text leading-tight">{holding.projectName}</p>
        <div className="flex items-center gap-1 text-[12px] text-text-muted">
          <MapPin size={12} aria-hidden="true" />
          <span>{holding.projectLocation}</span>
        </div>
      </div>

      {/* Key stats grid */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
        <StatItem label="سهام موجود"   value={`${bidiIsolate(formatNumber(holding.sharesOwned))} کیلووات`} />
        <StatItem label="قیمت فعلی"    value={formatToman(holding.currentPrice)} />
        <StatItem label="ارزش کل"      value={formatToman(holding.totalValue)} />
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] text-text-muted">سود / زیان</span>
          <ChangeIndicator value={holding.pnlPercent} variant="inline" />
        </div>
      </div>
    </Card>
  )
})

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] text-text-muted">{label}</span>
      <span className="text-[13px] font-semibold text-text tabular-nums">{value}</span>
    </div>
  )
}
