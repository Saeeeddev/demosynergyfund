// [D §9.20] Reports skeleton — shape-matched to page.tsx's actual layout
// Phone: stat+search toolbar row → chips row → document library

import { FileText } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function ReportsLoading() {
  return (
    <div className="flex flex-col gap-4 p-3 lg:gap-5 lg:p-3">
      <PageHeader
        className="hidden lg:flex"
        icon={<FileText size={22} strokeWidth={1.75} />}
        title="گزارش‌ها"
        subtitle="گزارش‌های فنی و مالی پروژه‌های شما"
      />

      {/* Toolbar row: total stat (start) + search (end) — matches page.tsx's single row */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="skeleton h-20 w-full lg:max-w-xs rounded-card" />
        <div className="skeleton h-10 w-full lg:max-w-md rounded-md" />
      </div>

      {/* Category chips */}
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton h-10 w-16 rounded-pill" />
        ))}
      </div>

      {/* Document library card */}
      <div className="rounded-card border border-border bg-surface p-5 flex flex-col gap-3">
        <div className="skeleton h-5 w-36 rounded-md" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-16 w-full rounded-md" />
        ))}
      </div>
    </div>
  )
}
