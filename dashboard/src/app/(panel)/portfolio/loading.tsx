// [D §9.20] Portfolio skeleton — shape-matched to page.tsx's actual layout
// Phone order: 4 KPIs → Holdings → chart rect → geo rect → order history

import { Briefcase } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function PortfolioLoading() {
  return (
    <div className="flex flex-col gap-4 p-3 lg:gap-5 lg:p-3">
      <PageHeader
        className="hidden lg:flex"
        icon={<Briefcase size={22} strokeWidth={1.75} />}
        title="سبد دارایی"
        subtitle="عملکرد، دارایی‌ها و سوابق معاملات شما"
      />

      {/* Row 1 — 4 KPI cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-28 w-full rounded-card" />
        ))}
      </div>

      {/* Row 2 — Holdings (rendered above chart/geo on the real page) */}
      <div className="rounded-card border border-border bg-surface p-5 flex flex-col gap-3">
        <div className="skeleton h-5 w-36 rounded-md" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-16 w-full rounded-md" />
        ))}
      </div>

      {/* Row 3 — Chart + Geo */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-10 lg:gap-4">
        <div className="skeleton h-60 w-full rounded-card lg:col-span-7" />
        <div className="skeleton h-60 w-full rounded-card lg:col-span-3" />
      </div>

      {/* Row 4 — Order history */}
      <div className="skeleton h-16 w-full rounded-card" />
    </div>
  )
}
