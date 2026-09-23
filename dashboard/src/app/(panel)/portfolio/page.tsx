'use client'

// [F §4] Portfolio page — all four rows
// [M §6.4] Phone: 2×2 KPIs → chart → geo → holdings → order history (collapsible)

import { useCallback, useState } from 'react'
import { TrendingUp, DollarSign, BarChart2, TrendingDown, Briefcase } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { PageHeader } from '@/components/ui/PageHeader'
import { PerformanceChart } from '@/components/portfolio/PerformanceChart'
import { GeographicalDistribution } from '@/components/portfolio/GeographicalDistribution'
import { HoldingsTable } from '@/components/portfolio/HoldingsTable'
import { OrderHistoryTable } from '@/components/portfolio/OrderHistoryTable'
import {
  usePortfolioSummary,
  useHoldings,
  usePerformance,
  useGeo,
} from '@/lib/hooks/usePortfolio'
import { formatToman } from '@/lib/utils/currency'

export default function PortfolioPage() {
  const { data: summary, isLoading: summaryLoading, isError: summaryError, refetch: refetchSummary } = usePortfolioSummary()
  const [holdingsPage, setHoldingsPage] = useState(1)
  const { data: holdings, isLoading: holdingsLoading, isError: holdingsError, refetch: refetchHoldings } = useHoldings(holdingsPage)
  const { data: performance, isLoading: perfLoading, isError: perfError, refetch: refetchPerf } = usePerformance()
  const { data: geo, isLoading: geoLoading, isError: geoError, refetch: refetchGeo } = useGeo()

  const netReturnSign = (summary?.netReturnPercent ?? 0) >= 0 ? 'positive' : 'negative'

  const handleRetryHoldings = useCallback(() => refetchHoldings(), [refetchHoldings])
  const handleRetryPerf = useCallback(() => refetchPerf(), [refetchPerf])
  const handleRetryGeo = useCallback(() => refetchGeo(), [refetchGeo])

  return (
    <div className="flex flex-col gap-4 p-3 lg:gap-5 lg:p-3">

      {/* asas-style page header — desktop only */}
      <PageHeader
        className="hidden lg:flex"
        icon={<Briefcase size={22} strokeWidth={1.75} />}
        title="سبد دارایی"
        subtitle="عملکرد، دارایی‌ها و سوابق معاملات شما"
      />

      {/* Row 1 — 4 KPI cards [F §4 R1] — 2×2 phone / 4-up desktop */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard
          label="ارزش کل دارایی‌ها"
          value={formatToman(summary?.totalAssetsValue ?? 0)}
          icon={<DollarSign size={20} />}
          role="positive"
          isLoading={summaryLoading}
        />
        <StatCard
          label="کل سرمایه‌گذاری اولیه"
          value={formatToman(summary?.totalInvested ?? 0)}
          icon={<TrendingUp size={20} />}
          role="info"
          isLoading={summaryLoading}
        />
        <StatCard
          label="درآمد کسب‌شده"
          value={formatToman(summary?.incomeEarned ?? 0)}
          icon={<BarChart2 size={20} />}
          role="positive"
          isLoading={summaryLoading}
        />
        <StatCard
          label="بازده خالص"
          value={formatToman(summary?.netReturn ?? 0)}
          change={summary?.netReturnPercent}
          icon={<TrendingDown size={20} />}
          role={netReturnSign}
          isLoading={summaryLoading}
        />
      </div>

      {/* Row 2 — Holdings [F §4 R3] — moved above the performance/geo charts */}
      <HoldingsTable
        holdings={holdings?.data ?? []}
        page={holdings?.page ?? holdingsPage}
        totalPages={holdings?.totalPages ?? 0}
        onPageChange={setHoldingsPage}
        isLoading={holdingsLoading}
        isError={holdingsError}
        onRetry={handleRetryHoldings}
      />

      {/* Row 3 — Performance chart (70%) + Geo distribution (30%) [F §4 R2] */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-10 lg:gap-4">
        <div className="lg:col-span-7">
          <PerformanceChart
            series={performance ?? []}
            isLoading={perfLoading}
            isError={perfError}
            onRetry={handleRetryPerf}
          />
        </div>
        <div className="lg:col-span-3">
          <GeographicalDistribution
            data={geo ?? []}
            isLoading={geoLoading}
            isError={geoError}
            onRetry={handleRetryGeo}
          />
        </div>
      </div>

      {/* Row 4 — Order History [F §4 R4] — self-fetches with its own pagination */}
      <OrderHistoryTable />

    </div>
  )
}
