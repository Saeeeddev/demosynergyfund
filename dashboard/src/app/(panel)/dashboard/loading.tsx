// [D §9.20 table] Dashboard skeleton — shape-matched to page.tsx's actual grid
// so the real content resolves in place with no layout shift.
// Phone order: cash rect → showcase rect → donut rect → 2×2 stat rects → chart rect → activity rows

import { LayoutDashboard } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-4 p-3 lg:gap-5 lg:p-3">
      {/* Static header — no async data, render immediately [F §2] */}
      <PageHeader
        className="hidden lg:flex"
        icon={<LayoutDashboard size={22} strokeWidth={1.75} />}
        title="داشبورد"
        subtitle="نمای کلی سرمایه‌گذاری‌ها، دارایی‌ها و درآمد شما"
      />

      {/* Row 1 — Cash + showcase (start) beside allocation donut (end) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-4 lg:items-stretch">
        <div className="flex flex-col gap-4">
          <div className="skeleton h-28 w-full rounded-card" />
          <div className="skeleton flex-1 min-h-[200px] w-full rounded-card" />
        </div>
        <div className="skeleton min-h-[300px] w-full rounded-card" />
      </div>

      {/* Row 2 — 4 KPI cards: 2×2 phone / 4-up desktop */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-28 w-full rounded-card" />
        ))}
      </div>

      {/* Row 3 — Total invested chart (full width) */}
      <div className="skeleton h-80 w-full rounded-card" />

      {/* Row 4 — Activities: header strip + 5 row rects */}
      <div className="rounded-card border border-border bg-surface p-5 flex flex-col gap-2">
        <div className="skeleton h-5 w-36 rounded-md" />
        <div className="skeleton h-10 w-full rounded-md mt-2" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton h-14 w-full rounded-md" />
        ))}
      </div>
    </div>
  )
}
