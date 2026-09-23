'use client'

// [F §11] Project details — "حقوقی و مالکیت" tab. The values here are placeholders
// that the admin will configure per project later (wired to Django).

import { InfoRow } from './InfoRow'
import type { ProjectWithDetails } from '@/lib/schemas/project'

export function LegalTab({ project }: { project: ProjectWithDetails }) {
  const { legal } = project.details

  return (
    <div className="flex flex-col gap-3">
      <p className="text-text-muted text-[13px]">
        اطلاعات حقوقی و مالکیتی «{project.name}» از جمله اسناد قرارداد، ساختار مالکیت
        توکن وات و تعهدات قانونی در این بخش در دسترس است.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InfoRow label="نوع دارایی" value={legal.assetType} />
        <InfoRow label="نوع سند" value={legal.documentType} />
        <InfoRow label="دوره قرارداد" value={legal.contractPeriod} />
        <InfoRow label="مجوز بهره‌برداری" value={legal.license} />
      </div>
    </div>
  )
}
