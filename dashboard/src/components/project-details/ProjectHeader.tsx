'use client'

// [F §11 R1] Project header: name+location (right) + images (left) + 4 stat items
// [D §11] Gold energy badge + status pill + sold% bar + ProgressBar
// [M §6.7] Phone: stacked, 16:9 image, stats 2×2

import { memo } from 'react'
import Image from 'next/image'
import { MapPin, CalendarClock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { formatToman } from '@/lib/utils/currency'
import { formatNumber, formatPercent } from '@/lib/utils/numbers'
import { formatJalali } from '@/lib/utils/jalali'
import type { Project } from '@/types/domain'

interface ProjectHeaderProps {
  project: Project
}

const STATUS_CONFIG = {
  active:  { label: 'فعال',           role: 'positive' as const },
  funding: { label: 'در حال تأمین',   role: 'energy'   as const },
  closed:  { label: 'بسته‌شده',       role: 'gray'     as const },
}

export const ProjectHeader = memo(function ProjectHeader({ project }: ProjectHeaderProps) {
  const { label: statusLabel, role: statusRole } = STATUS_CONFIG[project.status]

  return (
    <Card className="flex flex-col gap-5 p-5">
      {/* Top section: image on top (full width), name/location below — fits the
          narrower 40% column and gives a bigger image [F §11 R1] */}
      <div className="flex flex-col-reverse gap-4">

        {/* Image — full-width 16:9 */}
        <div className="relative w-full aspect-video rounded-md overflow-hidden shrink-0">
          {project.images[0] ? (
            <Image
              src={project.images[0]}
              alt={project.name}
              fill
              sizes="(max-width: 1024px) 100vw, 288px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-tint flex items-center justify-center">
              <span className="text-[12px] text-text-muted">تصویر موجود نیست</span>
            </div>
          )}

          {/* Gold energy badge — start-top corner [D §11] */}
          <div className="absolute top-2 start-2">
            <Badge role="energy">
              {formatNumber(project.totalCapacityWatts / 1_000_000, 1)} مگاوات
            </Badge>
          </div>

          {/* Status pill — end-top corner [D §11] */}
          <div className="absolute top-2 end-2">
            <Badge role={statusRole}>{statusLabel}</Badge>
          </div>
        </div>

        {/* Name + location + description */}
        <div className="flex flex-col gap-3 flex-1">
          <h1 className="text-[22px] font-bold text-text leading-snug">{project.name}</h1>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-text-muted">
              <MapPin size={16} className="shrink-0" />
              <span className="text-[14px]">{project.location}</span>
            </div>
            {/* تاریخ شروع بهره‌برداری — below the city */}
            <div className="flex items-center gap-1.5 text-text-muted">
              <CalendarClock size={16} className="shrink-0" />
              <span className="text-[13px]">
                شروع بهره‌برداری:{' '}
                <span className="tabular-nums text-text-2">
                  {project.operationStartDate ? formatJalali(project.operationStartDate) : 'به‌زودی'}
                </span>
              </span>
            </div>
          </div>

          {project.description && (
            <p className="text-[13px] text-text-2 leading-relaxed">{project.description}</p>
          )}
        </div>
      </div>

      {/* 4 stat items in a row — phone: 2x2 [F §11 R1, M §6.7] */}
      <div className="grid grid-cols-2 gap-3 lg:gap-4 border-t border-border pt-5">

        {/* Target Annual Yield */}
        <div className="flex flex-col gap-1">
          <span className="text-[12px] font-medium text-text-muted">پیش‌بینی بازده سالانه</span>
          <span className="text-[18px] font-bold text-text tabular-nums">
            {formatPercent(project.targetYield)}
          </span>
        </div>

        {/* Min Investment */}
        <div className="flex flex-col gap-1">
          <span className="text-[12px] font-medium text-text-muted">حداقل سرمایه‌گذاری</span>
          <span className="text-[15px] font-bold text-text tabular-nums">
            {formatToman(project.minInvestment)}
          </span>
        </div>

        {/* Share Price */}
        <div className="flex flex-col gap-1">
          <span className="text-[12px] font-medium text-text-muted">قیمت هر سهم</span>
          <span className="text-[15px] font-bold text-text tabular-nums">
            {formatToman(project.sharePrice)}
          </span>
        </div>

        {/* Sold % — with bar AND number [F §11 R1] */}
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-medium text-text-muted">درصد فروش</span>
          <div className="flex items-center gap-2">
            <span className="text-[18px] font-bold text-text tabular-nums shrink-0">
              {formatNumber(project.soldPercent, 0)}٪
            </span>
          </div>
          <ProgressBar value={project.soldPercent} role="energy" className="w-full" />
        </div>
      </div>
    </Card>
  )
})
