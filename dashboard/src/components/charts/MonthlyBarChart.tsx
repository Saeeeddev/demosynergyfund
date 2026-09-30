'use client'

// Functional monthly bar chart with the asas SolarResource look (gradient bars,
// gridlines) PLUS a proper left Y-axis price scale. Always renders left-to-right
// (dir="ltr") with the value indicator on the LEFT, regardless of the RTL app.
// Pure CSS — every data point + label always renders.

import { useState } from 'react'
import { cn } from '@/lib/utils/cn'

export interface MonthlyBarDatum {
  label: string
  value: number
}

interface MonthlyBarChartProps {
  data: MonthlyBarDatum[]
  height?: number
  valueFormatter?: (n: number) => string
  tooltipValueFormatter?: (n: number) => string
  tooltipLabel?: string
  /** 'fat' = chunky bars (e.g. درآمد ماهانه), 'normal' = slim bars */
  barSize?: 'normal' | 'fat'
  /** Tilt x-axis labels ~45° so dense date labels stay readable under each bar */
  rotateLabels?: boolean
  className?: string
}

const TICKS = [1, 0.75, 0.5, 0.25, 0] // top → bottom

export function MonthlyBarChart({
  data,
  height = 220,
  valueFormatter = (n) => String(n),
  tooltipValueFormatter = valueFormatter,
  tooltipLabel = 'مقدار',
  barSize = 'normal',
  rotateLabels = false,
  className,
}: MonthlyBarChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const max = Math.max(...data.map((d) => d.value), 1)

  // Min width per column so bars + date labels stay readable on phones. When the
  // total exceeds the viewport the plot scrolls horizontally (Y-axis stays fixed);
  // on desktop the inner fills 100% and no scrolling occurs.
  const colMin = barSize === 'fat' ? 48 : 36
  const plotMinWidth = data.length * colMin

  return (
    // dir=ltr → axis on the left, time progresses left→right (normal chart)
    <div dir="ltr" className={cn('flex w-full', className)}>
      {/* Y-axis price scale (left, fixed — never scrolls) */}
      <div className="flex w-14 shrink-0 flex-col justify-between pe-2 text-right" style={{ height }}>
        {TICKS.map((t) => (
          <span key={t} className="text-[10px] leading-none text-text-muted tabular-nums">
            {valueFormatter(max * t)}
          </span>
        ))}
      </div>

      {/* Scrollable region: plot + labels share one min-width so bars and the
          labels beneath them stay aligned while scrolling. */}
      <div className="min-w-0 flex-1 overflow-x-auto">
        <div className="w-full" style={{ minWidth: plotMinWidth }}>
          {/* Plot area */}
          <div className="relative" style={{ height }}>
            {/* gridlines aligned to the y ticks */}
            {TICKS.map((t) => (
              <div
                key={t}
                className="absolute inset-x-0 border-t border-dashed border-border"
                style={{ top: `${(1 - t) * 100}%` }}
              />
            ))}

            {activeIndex !== null && data[activeIndex] && (
              <div
                dir="rtl"
                role="tooltip"
                className="pointer-events-none absolute top-2 z-20 max-w-[calc(100%-1rem)] min-w-32 -translate-x-1/2 rounded-md border border-border-strong bg-surface px-3 py-2 text-start shadow-[var(--shadow-md)]"
                style={{ left: `clamp(6rem, ${((activeIndex + 0.5) / data.length) * 100}%, calc(100% - 6rem))` }}
              >
                <span className="block text-[11px] text-text-2">{data[activeIndex].label}</span>
                <span className="block text-[12px] font-semibold text-text tabular-nums">
                  {tooltipLabel}: {tooltipValueFormatter(data[activeIndex].value)}
                </span>
              </div>
            )}

            {/* bars */}
            <div className="absolute inset-0 flex items-end justify-between gap-1.5 px-1">
              {data.map((d, i) => (
                <div key={i} className="flex h-full min-w-0 flex-1 items-end justify-center">
                  <button
                    type="button"
                    aria-label={`${d.label}، ${tooltipLabel}: ${tooltipValueFormatter(d.value)}`}
                    onMouseEnter={() => setActiveIndex(i)}
                    onMouseLeave={() => setActiveIndex(null)}
                    onFocus={() => setActiveIndex(i)}
                    onBlur={() => setActiveIndex(null)}
                    onClick={() => setActiveIndex(i)}
                    className={cn(
                      'w-full rounded-t-md bg-gradient-to-t from-[#4361ee] to-[#5DADE2] shadow-[0_0_8px_rgba(67,97,238,0.12)] transition-[filter,transform] duration-150 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-base motion-reduce:transition-none',
                      barSize === 'fat' ? 'max-w-[44px]' : 'max-w-[24px]',
                    )}
                    style={{ height: `${Math.max((d.value / max) * 100, 2)}%` }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* X-axis labels — one per bar, centered directly under each bar */}
          <div className="flex gap-1.5 px-1 pt-2 justify-between items-start">
            {data.map((d, i) => (
              <div key={i} className="flex flex-1 justify-center">
                <span
                  className={cn(
                    'text-[10px] font-medium text-text-muted tabular-nums whitespace-nowrap',
                    rotateLabels
                      // Phone: vertical date sitting right under the bar; horizontal on lg+
                      ? '[writing-mode:vertical-rl] lg:[writing-mode:horizontal-tb]'
                      : 'truncate',
                  )}
                >
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
