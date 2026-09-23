'use client'

import { memo } from 'react'
import Image from 'next/image'
import { MapPin, CalendarClock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatToman } from '@/lib/utils/currency'
import { formatNumber, bidiIsolate, formatCompact } from '@/lib/utils/numbers'
import { formatJalali } from '@/lib/utils/jalali'
import type { Project } from '@/types/domain'

// [F §10 Step1] Selected asset — compact: a smaller image with the name and a
// few details beside it, then a thin stats row. Kept short to avoid a tall page.

interface SelectedAssetBoxProps {
  project: Project
}

export const SelectedAssetBox = memo(function SelectedAssetBox({ project }: SelectedAssetBoxProps) {
  const pricePerKw = project.sharePrice // Toman per kilowatt already
  const capacityMw = project.totalCapacityWatts / 1_000_000
  const sharesAvailable = Math.round(project.totalCapacityWatts * (1 - project.soldPercent / 100))

  return (
    <Card className="p-4 flex flex-col gap-4">
      <h3 className="text-[13px] font-medium text-text-muted">دارایی انتخاب‌شده</h3>

      {/* Image (right) + name & details (left) */}
      <div className="flex gap-4">
        <div className="relative w-40 h-28 sm:w-48 sm:h-32 rounded-card overflow-hidden shrink-0 bg-surface-2">
          <Image
            src={project.images[0] ?? '/Images/projects/project-1.jpg'}
            alt={project.name}
            fill
            sizes="192px"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          <p className="text-[16px] font-bold text-text leading-tight line-clamp-1">{project.name}</p>
          <div className="flex items-center gap-1.5 text-[12px] text-text-muted">
            <MapPin size={13} className="shrink-0" />
            <span className="truncate">{project.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-text-subtle">
            <CalendarClock size={13} className="shrink-0" />
            <span>شروع بهره‌برداری:</span>
            <span className="tabular-nums text-text-2">
              {project.operationStartDate ? formatJalali(project.operationStartDate) : 'به‌زودی'}
            </span>
          </div>
          <div className="mt-1">
            <Badge role="energy">
              {bidiIsolate(formatNumber(project.targetYield, 1))}٪ پیش‌بینی بازده سالانه
            </Badge>
          </div>
        </div>
      </div>

      {/* Thin stats row */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4 border-t border-border pt-3">
        <StatItem label="قیمت هر کیلووات" value={formatToman(pricePerKw)} />
        <StatItem label="حداقل سرمایه" value={formatToman(project.minInvestment)} />
        <StatItem label="ظرفیت کل" value={`${bidiIsolate(formatNumber(capacityMw, 1))} مگاوات`} />
        <StatItem label="سهام موجود (وات)" value={bidiIsolate(formatCompact(sharesAvailable))} />
      </div>
    </Card>
  )
})

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] text-text-muted">{label}</span>
      <span className="text-[13px] font-semibold text-text tabular-nums">{value}</span>
    </div>
  )
}
