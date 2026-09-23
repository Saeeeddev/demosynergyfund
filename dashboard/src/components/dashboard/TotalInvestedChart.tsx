'use client'

// [F §2 R3] "ارزش کل سرمایه‌گذاری" — ascending area/line chart (green line over a
// soft gradient fill), matching the reference "Total Invested Value" design.

import { useMemo } from 'react'
import { TrendingUp } from 'lucide-react'
import { AreaChart } from '@/components/charts/AreaChart'
import { Card } from '@/components/ui/Card'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { Empty } from '@/components/ui/Empty'
import { formatToman, formatTomanCompact } from '@/lib/utils/currency'
import { formatJalaliMonth } from '@/lib/utils/jalali'
import type { PerformanceSeries } from '@/lib/schemas/portfolio'

interface TotalInvestedChartProps {
  series: PerformanceSeries[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

export function TotalInvestedChart({ series, isLoading, isError, onRetry }: TotalInvestedChartProps) {
  // [epoch_ms, value] pairs sorted ascending (oldest → newest)
  const data = useMemo<[number, number][]>(
    () => series
      .map((p) => [Date.parse(p.date), p.value] as [number, number])
      .sort((a, b) => a[0] - b[0]),
    [series],
  )

  const isEmpty = !isLoading && !isError && series.length === 0

  return (
    <Card className="flex flex-col gap-5 h-full">
      <SectionTitle title="ارزش کل سرمایه‌گذاری" subtitle="روند ماهانه ارزش سرمایه‌گذاری شما" />

      {isEmpty ? (
        <Empty
          icon={<TrendingUp size={48} />}
          message="هنوز سرمایه‌گذاری‌ای ندارید — اولین پروژه را انتخاب کنید"
        />
      ) : (
        <AreaChart
          data={data}
          height={280}
          reversed={false}
          yFormatter={formatTomanCompact}
          xFormatter={(ms) => formatJalaliMonth(new Date(ms).toISOString())}
          tooltipFormatter={formatToman}
          isLoading={isLoading}
          isError={isError}
          onRetry={onRetry}
        />
      )}
    </Card>
  )
}
