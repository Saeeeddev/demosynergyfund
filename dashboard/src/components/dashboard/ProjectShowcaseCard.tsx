'use client'

// Dashboard "my projects" showcase — one project at a time, dominated by a big
// image that fills the card height; details are overlaid at the bottom of the
// image. Designed to flex-fill so cash + this card match the ترکیب دارایی height.

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, MapPin, Briefcase } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { Empty } from '@/components/ui/Empty'
import { useHoldings } from '@/lib/hooks/usePortfolio'
import { useProject } from '@/lib/hooks/useProjects'
import { formatToman } from '@/lib/utils/currency'
import { bidiIsolate, formatNumber } from '@/lib/utils/numbers'

export function ProjectShowcaseCard() {
  // The showcase cycles through what the user owns — one page is plenty.
  const { data, isLoading } = useHoldings(1, 100)
  const holdings = data?.data ?? []
  const [index, setIndex] = useState(0)

  const count = holdings.length
  const safeIndex = count > 0 ? index % count : 0
  const current = holdings[safeIndex]
  const { data: project } = useProject(current?.projectId ?? '')

  if (isLoading) {
    return (
      <Card className="flex flex-col gap-3 h-full">
        <Skeleton className="h-5 w-1/3 rounded-md" />
        <Skeleton className="flex-1 min-h-[200px] w-full rounded-card" />
      </Card>
    )
  }

  if (count === 0 || !current) {
    return (
      <Card className="flex flex-col gap-3 h-full">
        <h2 className="text-[15px] font-semibold text-text">پروژه‌های من</h2>
        <Empty icon={<Briefcase size={36} />} message="هنوز پروژه‌ای ندارید" />
      </Card>
    )
  }

  const next = () => setIndex((i) => (i + 1) % count)
  const prev = () => setIndex((i) => (i - 1 + count) % count)

  return (
    // Reduced left/right/bottom padding (image sits closer to those edges); top padding kept.
    <Card className="flex flex-col gap-3 h-full pt-6 px-3 pb-3">
      <div className="flex items-center justify-between shrink-0">
        <h2 className="text-[15px] font-semibold text-text">پروژه‌های من</h2>
        <span className="text-[12px] text-text-muted tabular-nums">
          {bidiIsolate(`${formatNumber(safeIndex + 1)} / ${formatNumber(count)}`)}
        </span>
      </div>

      {/* Big image fills the card; details overlaid at the bottom */}
      <div className="relative flex-1 min-h-[200px] rounded-card overflow-hidden">
        <Link href={`/project-details/${current.projectId}`} className="absolute inset-0 group">
          <Image
            src={project?.images?.[0] ?? '/Images/projects/project-1.jpg'}
            alt={current.projectName}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
          {/* Name + location (top) */}
          <div className="absolute top-3 start-3 end-3 text-white">
            <p className="text-[15px] font-bold leading-tight line-clamp-1 drop-shadow">
              {current.projectName}
            </p>
            <div className="flex items-center gap-1 text-[11px] text-white/90 mt-0.5">
              <MapPin size={11} className="shrink-0" />
              <span className="truncate">{current.projectLocation}</span>
            </div>
          </div>
        </Link>

        {/* Details box (bottom, over the image) */}
        <div className="absolute bottom-0 inset-x-0 p-3 flex items-end justify-between gap-2 pointer-events-none">
          <div className="text-white">
            <span className="block text-[11px] text-white/85">ارزش دارایی</span>
            <span className="block text-[15px] font-bold tabular-nums drop-shadow">
              {formatToman(current.totalValue)}
            </span>
          </div>

          <div className="flex flex-col items-end gap-2 pointer-events-auto">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prev}
                aria-label="قبلی"
                className="w-8 h-8 rounded-full bg-white/85 text-text flex items-center justify-center shadow-sm hover:bg-white transition-colors"
              >
                <ChevronRight size={16} />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="بعدی"
                className="w-8 h-8 rounded-full bg-white/85 text-text flex items-center justify-center shadow-sm hover:bg-white transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              {holdings.map((h, i) => (
                <span
                  key={h.projectId}
                  className={
                    i === safeIndex
                      ? 'w-3.5 h-1.5 rounded-pill bg-white transition-all'
                      : 'w-1.5 h-1.5 rounded-pill bg-white/50 transition-all'
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
