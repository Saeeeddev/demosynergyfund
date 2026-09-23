'use client'

// [F §11] Project details — "بررسی اجمالی" tab.
// Self-contained, project-driven component so the admin can configure the
// overview per project later (wired to Django). Mirrors the ProjectCard pattern.

import { InfoRow } from './InfoRow'
import { formatJalali } from '@/lib/utils/jalali'
import type { Project } from '@/types/domain'

export function OverviewTab({ project }: { project: Project }) {
  return (
    <div className="flex flex-col gap-4">
      <p>{project.description}</p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InfoRow label="ظرفیت کل" value={`${(project.totalCapacityWatts / 1000).toLocaleString('fa')} کیلووات`} />
        <InfoRow label="مکان" value={project.location} />
        <InfoRow label="بازده سالانه هدف" value={`${project.targetYield}٪`} />
        <InfoRow label="قیمت هر سهم" value={`${project.sharePrice.toLocaleString('fa')} تومان`} />
        <InfoRow
          label="تاریخ شروع بهره‌برداری"
          value={project.operationStartDate ? formatJalali(project.operationStartDate) : 'به‌زودی'}
        />
        <InfoRow label="درصد فروش‌رفته" value={`${project.soldPercent}٪`} />
      </div>
    </div>
  )
}
