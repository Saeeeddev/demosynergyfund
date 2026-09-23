'use client'

// [F §5 R2] "درآمد ماهانه" — asas SolarResource-style monthly bar chart showing
// ALL months (no range filter, no hidden labels).

import { useMemo } from 'react'
import { Banknote } from 'lucide-react'
import { MonthlyBarChart, type MonthlyBarDatum } from '@/components/charts/MonthlyBarChart'
import { Card } from '@/components/ui/Card'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { formatTomanCompact } from '@/lib/utils/currency'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { Empty } from '@/components/ui/Empty'
import type { IncomeSummary } from '@/lib/schemas/payout'

interface IncomeTimelineChartProps {
  monthlyBars: IncomeSummary['monthlyBars']
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

export function IncomeTimelineChart({
  monthlyBars,
  isLoading,
  isError,
  onRetry,
}: IncomeTimelineChartProps) {
  const data = useMemo<MonthlyBarDatum[]>(
    () => monthlyBars.map((b) => ({ label: b.month, value: b.amount })),
    [monthlyBars],
  )

  return (
    <Card className="flex flex-col gap-5 h-full">
      <SectionTitle title="درآمد ماهانه" subtitle="درآمد دریافتی شما به تفکیک ماه" />

      {isLoading ? (
        <Skeleton className="h-[260px] w-full rounded-card" />
      ) : isError ? (
        <div className="flex items-center justify-center h-[260px]">
          <ErrorState scope="inline" onRetry={onRetry} />
        </div>
      ) : monthlyBars.length === 0 ? (
        <Empty
          icon={<Banknote size={48} />}
          message="هنوز درآمدی ثبت نشده است"
        />
      ) : (
        <MonthlyBarChart data={data} height={240} valueFormatter={formatTomanCompact} barSize="fat" rotateLabels />
      )}
    </Card>
  )
}
