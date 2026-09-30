'use client'

// Marketplace Project Card — ported from the asas dashboard ProjectCard design,
// adapted for buying a share in a solar power-plant project.
// asas anatomy: rounded soft card → image thumbnail w/ status pill + ref tag
//   → title row + favorite star → location → 2 stat boxes → progress bar
//   → 2×2 key-metrics grid → footer action bar.
// Share-buying fields: capacity, target yield, share price, min investment,
//   shares available, total project value, sold%.

import Image from 'next/image'
import {
  MapPin,
  CheckCircle2,
  Clock,
  Lock,
  ChevronLeft,
} from 'lucide-react'
import { NavButton } from '@/components/ui/NavButton'
import { cn } from '@/lib/utils/cn'
import { formatToman, formatTomanCompact } from '@/lib/utils/currency'
import { bidiIsolate, formatNumber, formatPercent } from '@/lib/utils/numbers'
import { formatJalali } from '@/lib/utils/jalali'
import type { Project, ProjectStatus } from '@/types/domain'

interface ProjectCardProps {
  project: Project
  className?: string
}

// asas-style status pill: solid white bg (always legible on the photo) + colored
// icon/text + matching bar color
const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; text: string; Icon: typeof CheckCircle2; bar: string }
> = {
  active: {
    label: 'فعال',
    text: 'text-green-deep',
    Icon: CheckCircle2,
    bar: 'bg-green-base',
  },
  funding: {
    label: 'در حال تأمین',
    text: 'text-gold-deep',
    Icon: Clock,
    bar: 'bg-gold-base',
  },
  closed: {
    label: 'بسته‌شده',
    text: 'text-gray-deep',
    Icon: Lock,
    bar: 'bg-gray-soft',
  },
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const status = STATUS_CONFIG[project.status]

  const capacityMw = project.totalCapacityWatts / 1_000_000
  // sharePrice is Toman per kilowatt (backend/apps/projects/api.py) —
  // totalCapacityWatts needs converting to kW before multiplying by it.
  const totalValue = (project.totalCapacityWatts / 1000) * project.sharePrice
  const pricePerKw = project.sharePrice
  const reference = `SYN-${project.id.replace(/[^0-9]/g, '').padStart(3, '0')}`

  return (
    <div
      className={cn(
        // asas card: white, rounded, soft card shadow, hairline border, lift on hover
        'group min-w-0 bg-surface rounded-card border border-border overflow-hidden flex flex-col',
        'shadow-[var(--shadow-card)]',
        'transition-[box-shadow,transform] duration-200 ease-out motion-reduce:transition-none',
        'hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5',
        className,
      )}
    >
      {/* ── Thumbnail with overlays ── */}
      <div className="relative h-40">
        <Image
          src={project.images[0] ?? '/Images/projects/project-1.jpg'}
          alt={project.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {/* gentle gradient for overlay legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/20" />

        {/* Capacity badge — start/top (solid white for legibility) */}
        <div className="absolute top-3 start-3">
          <span className="inline-flex items-center rounded-pill bg-white px-2.5 py-1 text-[11px] font-bold text-blue-deep shadow-sm tabular-nums">
            {bidiIsolate(formatNumber(capacityMw, 1))} مگاوات
          </span>
        </div>

        {/* Status pill — end/top (solid white for legibility) */}
        <div className="absolute top-3 end-3">
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-pill bg-white px-2.5 py-1 text-[11px] font-semibold shadow-sm',
              status.text,
            )}
          >
            <status.Icon size={12} strokeWidth={2.2} />
            {status.label}
          </span>
        </div>

        {/* Reference id — start/bottom */}
        <div className="absolute bottom-3 start-3 rounded-md bg-black/55 px-2 py-1 text-[10px] font-medium text-white tabular-nums">
          {reference}
        </div>
      </div>

      {/* ── Card content ── */}
      <div className="flex min-w-0 flex-col gap-3.5 p-4 flex-1">
        {/* Title */}
        <h3 className="text-[17px] font-semibold text-text leading-snug line-clamp-1">
          {project.name}
        </h3>

        {/* Location + operation start date below it */}
        <div className="flex flex-col gap-1 -mt-2">
          <div className="flex items-center gap-1.5 text-[13px] text-text-muted">
            <MapPin size={14} className="shrink-0 text-text-subtle" />
            <span className="truncate">{project.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-text-subtle ps-[20px]">
            <span>شروع بهره‌برداری:</span>
            <span className="tabular-nums">
              {project.operationStartDate ? formatJalali(project.operationStartDate) : 'به‌زودی'}
            </span>
          </div>
        </div>

        {/* Forecast yield (asas well) */}
        <div className="rounded-chip bg-surface-2 border border-border p-2.5">
          <div className="text-[11px] text-text-muted">پیش‌بینی بازده سالانه</div>
          <div className="text-[14px] font-semibold text-green-deep tabular-nums">
            {bidiIsolate(formatPercent(project.targetYield))}
          </div>
        </div>

        {/* Progress (sold %) */}
        <div>
          <div className="flex justify-between text-[11px] text-text-muted mb-1">
            <span>درصد فروش سهام</span>
            <span className="tabular-nums font-medium text-text-2">
              {bidiIsolate(`${formatNumber(project.soldPercent, 0)}٪`)}
            </span>
          </div>
          <div className="h-1.5 rounded-pill bg-hover overflow-hidden">
            <div
              className={cn('h-full rounded-pill transition-all duration-500', status.bar)}
              style={{ width: `${project.soldPercent}%` }}
            />
          </div>
        </div>

        {/* Funding projects: extra construction/funding progress bar */}
        {project.status === 'funding' && project.progressPercent != null && (
          <div>
            <div className="flex justify-between text-[11px] text-text-muted mb-1">
              <span>پیشرفت ساخت پروژه</span>
              <span className="tabular-nums font-medium text-text-2">
                {bidiIsolate(`${formatNumber(project.progressPercent, 0)}٪`)}
              </span>
            </div>
            <div className="h-1.5 rounded-pill bg-hover overflow-hidden">
              <div
                className="h-full rounded-pill bg-blue-base transition-all duration-500"
                style={{ width: `${project.progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* 2×2 key metrics — share-buying details */}
        <div className="grid min-w-0 grid-cols-2 gap-x-3 gap-y-3 pt-1">
          <Metric label="قیمت هر کیلووات" value={formatToman(pricePerKw)} />
          <Metric label="حداقل سرمایه" value={formatToman(project.minInvestment)} />
          <Metric label="ظرفیت کل (مگاوات)" value={bidiIsolate(formatNumber(capacityMw, 1))} />
          <Metric label="ارزش کل پروژه" value={formatTomanCompact(totalValue)} />
        </div>

        {/* Footer action bar (asas) — NavButton shows a spinner during navigation */}
        <div className="-mx-4 -mb-4 mt-auto border-t border-border bg-surface-2 px-4 py-3 flex flex-wrap items-center gap-2">
          <NavButton
            href={`/project-details/${project.id}`}
            variant="ghost"
            size="compact"
            iconEnd={<ChevronLeft size={16} />}
            className="px-0 text-blue-base hover:text-blue-deep hover:bg-transparent"
          >
            مشاهده جزئیات
          </NavButton>
          <NavButton href={`/invest/${project.id}`} variant="primary" size="compact" className="ms-auto px-4">
            سرمایه‌گذاری
          </NavButton>
        </div>
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className="text-[11px] text-text-muted leading-tight">{label}</span>
      <span className="break-words text-[13px] font-semibold text-text tabular-nums leading-tight">{value}</span>
    </div>
  )
}
