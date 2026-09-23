// [D §9.20] Income skeleton — shape-matched to page.tsx's actual layout
// Phone order: 2×2 KPIs → chart → history → method card

import { Banknote } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function IncomeLoading() {
  return (
    <div className="flex flex-col gap-4 p-3 lg:gap-5 lg:p-3">
      <PageHeader
        className="hidden lg:flex"
        icon={<Banknote size={22} strokeWidth={1.75} />}
        title="درآمدها و پرداخت‌ها"
        subtitle="سود دریافتی، تاریخچه پرداخت و روش برداشت شما"
      />

      {/* Row 1 — 4 KPI cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-28 w-full rounded-card" />
        ))}
      </div>

      {/* Row 2 — Income timeline chart */}
      <div className="skeleton h-72 w-full rounded-card" />

      {/* Row 3 — History table + Method card */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-10 lg:gap-4">
        {/* History table: header + 5 rows */}
        <div className="rounded-card border border-border bg-surface p-5 flex flex-col gap-3 lg:col-span-7">
          <div className="skeleton h-5 w-36 rounded-md" />
          <div className="skeleton h-10 w-full rounded-md" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-14 w-full rounded-md" />
          ))}
        </div>

        {/* Method card */}
        <div className="rounded-card border border-border bg-surface p-5 flex flex-col gap-4 lg:col-span-3">
          <div className="skeleton h-5 w-28 rounded-md" />
          <div className="skeleton h-12 w-12 rounded-full" />
          <div className="skeleton h-5 w-28 rounded-md" />
          <div className="skeleton h-4 w-40 rounded-md" />
        </div>
      </div>
    </div>
  )
}
