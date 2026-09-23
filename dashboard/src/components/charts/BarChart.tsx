'use client'

// T2.2 — BarChart
// Spec: [D §10] Bar (column) chart · [M §8] mobile rules · [A §3.3]
//
// • Gold bars (#D5AB0D = --gold-soft) — the energy/income identity accent [D §10]
// • Hover → Gold-base (#BB970D)
// • --r-md (12px) radius on the END (top) corners only [D §10, D §4.3]
//   Uses Highcharts v11+ borderRadius object: { radius, where: 'end' }
// • Grow-from-baseline animation once on load [D §10]
// • Disabled under prefers-reduced-motion [D §8]
// • RTL: xAxis reversed so first category sits on the right [D §6.2]
// • Y-axis on the left, dashed horizontal gridlines [D §6.2, D §10]
// • Lazy-loaded; skeleton + error states [D §9.20/9.21]

import { useEffect, useRef, useState } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { CHART_COLORS, CHART_FONT } from '@/lib/utils/highchartsBase'
import { cn } from '@/lib/utils/cn'

export interface BarDataPoint {
  /** Farsi label shown on the x-axis (e.g. "فروردین", "۱۴۰۳") */
  name: string
  /** Numeric value (Toman, watt-hours, etc.) */
  y: number
}

export interface BarChartProps {
  data: BarDataPoint[]
  /** Container height in px (default 300; mobile → 220 via responsive rule) */
  height?: number
  /** Y-axis label formatter, e.g. formatTomanCompact */
  yFormatter?: (val: number) => string
  /** Tooltip value formatter */
  tooltipFormatter?: (val: number) => string
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  className?: string
}

export function BarChart({
  data,
  height = 300,
  yFormatter,
  tooltipFormatter,
  isLoading,
  isError,
  onRetry,
  className,
}: BarChartProps) {
  const chartRef = useRef<any>(null)
  const [HC, setHC] = useState<any>(null)
  const [HCReact, setHCReact] = useState<any>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onMqChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', onMqChange)

    Promise.all([
      import('highcharts'),
      import('highcharts-react-official'),
    ]).then(([hc, hcr]) => {
      setHC(hc.default)
      setHCReact(() => hcr.default)
    })

    return () => mq.removeEventListener('change', onMqChange)
  }, [])

  // --- Loading state -------------------------------------------------------
  if (isLoading || !HC || !HCReact) {
    return (
      <div
        style={{ height }}
        className={cn('w-full rounded-card overflow-hidden', className)}
      >
        <Skeleton className="h-full w-full" />
      </div>
    )
  }

  // --- Error state ----------------------------------------------------------
  if (isError) {
    return (
      <div
        style={{ minHeight: height }}
        className={cn(
          'w-full rounded-card border border-border bg-surface flex items-center justify-center',
          className,
        )}
      >
        <ErrorState scope="inline" onRetry={onRetry} />
      </div>
    )
  }

  // Grow-from-baseline animation (column chart default in Highcharts) [D §10]
  const anim = reducedMotion ? false : { duration: 600 }

  const options = {
    chart: {
      height,
      type: 'column',
      style: { fontFamily: CHART_FONT },
      backgroundColor: 'transparent',
      animation: anim,
      marginRight: 0,
    },
    title: { text: '' },
    credits: { enabled: false },
    legend: { enabled: false },
    accessibility: { enabled: false },

    // RTL x-axis: first category on the right [D §6.2]
    xAxis: {
      reversed: true,
      type: 'category',
      lineColor: 'transparent',
      tickLength: 0,
      labels: {
        style: {
          color: CHART_COLORS.textSubtle,
          fontSize: '12px',
          fontFamily: CHART_FONT,
        },
      },
      // Dashed crosshair on hover/touch [D §10]
      crosshair: {
        dashStyle: 'Dash',
        color: CHART_COLORS.textSubtle,
        width: 1,
      },
    },

    // Y-axis on the left, dashed horizontal gridlines [D §6.2, D §10]
    yAxis: {
      opposite: false,
      gridLineDashStyle: 'Dash',
      gridLineColor: CHART_COLORS.border,
      labels: {
        style: {
          color: CHART_COLORS.textSubtle,
          fontSize: '12px',
          fontFamily: CHART_FONT,
        },
        align: 'left',
        x: 5,
        ...(yFormatter
          ? { formatter: function (this: any) { return yFormatter(this.value) } }
          : {}),
      },
      title: { text: '' },
    },

    // Light tooltip [D §9.12]
    tooltip: {
      backgroundColor: CHART_COLORS.surface,
      borderColor: CHART_COLORS.border,
      borderRadius: 12,
      shadow: true,
      followTouchMove: true,
      style: {
        color: CHART_COLORS.text,
        fontSize: '12px',
        fontFamily: CHART_FONT,
      },
      ...(tooltipFormatter
        ? {
            formatter: function (this: any) {
              return `<b>${this.key}</b><br/>${tooltipFormatter(this.y)}`
            },
          }
        : {}),
    },

    plotOptions: {
      series: {
        animation: anim,
        stickyTracking: false,
      },
      column: {
        // Gold bars — energy / income identity [D §10]
        color: CHART_COLORS.gold,
        // --r-md (12px) top corners only [D §10, D §4.3]
        // Highcharts v11+ borderRadius object; 'end' = top for up-facing bars
        borderRadius: { radius: 10, where: 'end' },
        borderWidth: 0,
        pointPadding: 0.15,
        groupPadding: 0.1,
        states: {
          hover: {
            color: CHART_COLORS.goldBase,  // Gold-base on hover [D §10]
            brightness: 0,                 // prevent Highcharts default brightness shift
          },
        },
      },
    },

    // Mobile: shorter chart, fewer x-axis labels [M §8]
    responsive: {
      rules: [
        {
          condition: { maxWidth: 768 },
          chartOptions: {
            chart: { height: 220 },
            xAxis: { labels: { step: 2 } },
          },
        },
      ],
    },

    series: [
      {
        name: 'درآمد',
        type: 'column',
        data,
      },
    ],
  }

  return (
    <div className={cn('w-full', className)}>
      <HCReact ref={chartRef} highcharts={HC} options={options} />
    </div>
  )
}
