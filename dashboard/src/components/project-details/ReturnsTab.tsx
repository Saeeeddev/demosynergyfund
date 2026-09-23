'use client'

// [F §11] Project details — "بازده‌ها" tab. Project-driven so the admin can set
// the return figures per project later (wired to Django).

import { InfoRow } from './InfoRow'
import type { ProjectWithDetails } from '@/lib/schemas/project'

export function ReturnsTab({ project }: { project: ProjectWithDetails }) {
  const monthlyYield = (project.targetYield / 12).toFixed(2)

  return (
    <div className="flex flex-col gap-3">
      <p className="text-text-muted text-[13px]">
        عملکرد تاریخی و توزیع سود این پروژه در این بخش نمایش داده می‌شود.
        جزئیات بیشتر در بخش پیش‌بینی اقتصادی و ROI در پایین همین صفحه موجود است.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InfoRow label="بازده سالانه هدف" value={`${project.targetYield}٪`} />
        <InfoRow label="بازده ماهانه تخمینی" value={`${monthlyYield}٪`} />
        <InfoRow label="درصد فروش‌رفته" value={`${project.soldPercent}٪`} />
        <InfoRow label="دوره توزیع سود" value={project.details.distributionPeriod} />
      </div>
    </div>
  )
}
