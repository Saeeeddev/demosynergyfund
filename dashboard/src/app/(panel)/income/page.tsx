'use client'

// [F §5] Income & Payouts page — all rows
// [M §6.5] Phone: 2×2 KPIs → chart → history + method stacked

import { TrendingUp, Banknote, CalendarCheck, Wallet } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { PageHeader } from '@/components/ui/PageHeader'
import { IncomeTimelineChart } from '@/components/income/IncomeTimelineChart'
import { PayoutHistoryTable } from '@/components/income/PayoutHistoryTable'
import { PaymentMethodsCard } from '@/components/dashboard/PaymentMethodsCard'
import { useIncomeSummary } from '@/lib/hooks/usePayouts'
import { formatToman } from '@/lib/utils/currency'

export default function IncomePage() {
  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryError,
    refetch: refetchSummary,
  } = useIncomeSummary()

  return (
    <div className="flex flex-col gap-4 p-3 lg:gap-5 lg:p-3">

      {/* asas-style page header — desktop only */}
      <PageHeader
        className="hidden lg:flex"
        icon={<Banknote size={22} strokeWidth={1.75} />}
        title="درآمدها و پرداخت‌ها"
        subtitle="سود دریافتی، تاریخچه پرداخت و روش برداشت شما"
      />

      {/* Row 1 — 4 KPI cards [F §5 R1] — 2×2 phone / 4-up desktop */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard
          label="کل درآمد"
          value={formatToman(summary?.totalIncome ?? 0)}
          icon={<TrendingUp size={20} />}
          role="positive"
          isLoading={summaryLoading}
        />
        <StatCard
          label="کل پرداخت‌ها"
          value={formatToman(summary?.totalPayment ?? 0)}
          icon={<Banknote size={20} />}
          role="info"
          isLoading={summaryLoading}
        />
        <StatCard
          label="درآمد این ماه"
          value={formatToman(summary?.thisMonthIncome ?? 0)}
          icon={<CalendarCheck size={20} />}
          role="energy"
          isLoading={summaryLoading}
        />
        <StatCard
          label="موجودی نقدی"
          value={formatToman(summary?.cashBalance ?? 0)}
          icon={<Wallet size={20} />}
          role="special"
          isLoading={summaryLoading}
        />
      </div>

      {/* Row 2 — Income timeline chart [F §5 R2] */}
      <IncomeTimelineChart
        monthlyBars={summary?.monthlyBars ?? []}
        isLoading={summaryLoading}
        isError={summaryError}
        onRetry={() => refetchSummary()}
      />

      {/* Row 3 — Payout history (70%) + Payment methods (30%) [F §5 R3] */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-10 lg:gap-4">
        <div className="lg:col-span-7">
          <PayoutHistoryTable />
        </div>
        <div className="lg:col-span-3">
          <PaymentMethodsCard />
        </div>
      </div>

    </div>
  )
}
