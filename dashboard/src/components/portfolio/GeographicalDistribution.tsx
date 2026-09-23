'use client'

// [F §4 R2 left] "توزیع جغرافیایی" — donut chart of the portfolio's distribution
// across cities + a legend list (swatch · city · %).

import { MapPin } from 'lucide-react'
import { DonutChart } from '@/components/charts/DonutChart'
import { Card } from '@/components/ui/Card'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { ErrorState } from '@/components/ui/ErrorState'
import { Empty } from '@/components/ui/Empty'
import { CATEGORICAL_COLORS } from '@/lib/utils/highchartsBase'
import { bidiIsolate, formatPercent } from '@/lib/utils/numbers'
import type { GeoDistribution } from '@/lib/schemas/portfolio'

interface GeographicalDistributionProps {
  data: GeoDistribution[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

export function GeographicalDistribution({ data, isLoading, isError, onRetry }: GeographicalDistributionProps) {
  const donutData = data.map((d) => ({ name: d.city, y: d.ownershipPercent }))
  const isEmpty = !isLoading && !isError && data.length === 0

  return (
    <Card className="flex flex-col gap-5 h-full">
      <SectionTitle title="توزیع جغرافیایی" subtitle="سهم هر شهر از سبد دارایی شما" />

      {isEmpty ? (
        <Empty
          icon={<MapPin size={48} />}
          message="هنوز سرمایه‌گذاری‌ای ندارید — اولین پروژه را انتخاب کنید"
        />
      ) : (
        <div className="flex flex-col gap-5">
          <DonutChart
            data={donutData}
            centerText={bidiIsolate(`${data.length} شهر`)}
            showLegend={false}
            height={200}
            isLoading={isLoading}
            isError={isError}
            onRetry={onRetry}
          />

          {!isLoading && !isError && (
            <div className="flex flex-col gap-2">
              {data.map((item, i) => (
                <div key={item.city} className="flex items-center gap-2 text-[13px]">
                  <span
                    className="w-3 h-3 rounded-sm shrink-0"
                    style={{ backgroundColor: CATEGORICAL_COLORS[i % CATEGORICAL_COLORS.length] }}
                  />
                  <span className="flex-1 text-text truncate">{item.city}</span>
                  <span className="font-semibold text-text-2 tabular-nums">
                    {bidiIsolate(formatPercent(item.ownershipPercent))}
                  </span>
                </div>
              ))}
            </div>
          )}

          {!isLoading && isError && <ErrorState scope="inline" onRetry={onRetry} />}
        </div>
      )}
    </Card>
  )
}
