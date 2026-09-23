'use client'

// T2.1 — AreaChart
// Spec: [D §10] Area chart · [M §8] mobile rules · [A §3.3] charts/AreaChart.tsx
//
// • Single Green line (#435144, ~2px) over a soft green vertical gradient fill
// • Dashed linear-regression trend line overlay [D §10]
// • Dashed crosshair on hover/touch
// • Light tooltip [D §9.12]
// • RTL: xAxis reversed (time flows right→left), Y-axis on the left [D §6.2]
// • Draw-in animation once on load; disabled under prefers-reduced-motion [D §8]
// • Lazy-loaded via dynamic import (Highcharts is ~300 kB) [M §11]
// • Shows <Skeleton> while loading, <ErrorState> on fetch failure [D §9.20/9.21]

import { useEffect, useMemo, useRef, useState, memo } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { CHART_COLORS, CHART_FONT } from '@/lib/utils/highchartsBase'
import { cn } from '@/lib/utils/cn'

export interface AreaChartProps {
  /** [epoch_ms, value] pairs — must be sorted chronologically ascending */
  data: [number, number][]
  /** Container height in px (default 300; mobile overridden to 220 by responsive rule) */
  height?: number
  /** Y-axis label formatter, e.g. formatTomanCompact */
  yFormatter?: (val: number) => string
  /** X-axis label formatter — receives the raw timestamp in ms */
  xFormatter?: (val: number) => string
  /** Tooltip value formatter */
  tooltipFormatter?: (val: number) => string
  /** RTL time axis (newest on the left). Set false for a left→right timeline. */
  reversed?: boolean
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  className?: string
}

export const AreaChart = memo(function AreaChart({
  data,
  height = 300,
  yFormatter,
  xFormatter,
  tooltipFormatter,
  reversed = true,
  isLoading,
  isError,
  onRetry,
  className,
}: AreaChartProps) {
  const chartRef = useRef<any>(null)
  const [HC, setHC] = useState<any>(null)
  const [HCReact, setHCReact] = useState<any>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    // Detect prefers-reduced-motion [D §8]
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onMqChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', onMqChange)

    // Lazy-load Highcharts [M §11] — not in the initial bundle
    Promise.all([
      import('highcharts'),
      import('highcharts-react-official'),
    ]).then(([hc, hcr]) => {
      setHC(hc.default)
      setHCReact(() => hcr.default)
    })

    return () => mq.removeEventListener('change', onMqChange)
  }, [])

  // Dashed linear-regression trend line — recomputed only when data changes [D §10]
  const trendPoints = useMemo(() => computeTrendLine(data), [data])

  // Highcharts options — stable reference until a real input changes.
  // highcharts-react-official calls chart.update() on every new options reference,
  // so keeping this stable prevents redraws on unrelated parent re-renders.
  const options = useMemo(() => {
    const anim = reducedMotion ? false : { duration: 600 }

    return {
      chart: {
        height,
        type: 'area',
        style: { fontFamily: CHART_FONT },
        backgroundColor: 'transparent',
        animation: anim,
        marginRight: 0,
      },
      title: { text: '' },
      credits: { enabled: false },
      legend: { enabled: false },
      accessibility: { enabled: false },

      // Time axis direction — RTL (newest left) by default, or left→right when reversed=false
      xAxis: {
        reversed,
        type: 'datetime',
        lineColor: 'transparent',
        tickLength: 0,
        labels: {
          style: {
            color: CHART_COLORS.textSubtle,
            fontSize: '12px',
            fontFamily: CHART_FONT,
          },
          ...(xFormatter
            ? { formatter: function (this: any) { return xFormatter(this.value) } }
            : {}),
        },
        // Dashed crosshair appears on hover/touch [D §10]
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
                return `<b>${tooltipFormatter(this.y)}</b>`
              },
            }
          : {}),
      },

      plotOptions: {
        series: {
          animation: anim,
          // Enables tap-to-show tooltip on touch screens [M §8]
          stickyTracking: false,
        },
        area: {
          marker: { enabled: false, states: { hover: { enabled: true, radius: 4 } } },
          states: { hover: { lineWidth: 2 } },
        },
        line: {
          marker: { enabled: false },
          enableMouseTracking: false,
        },
      },

      // Mobile: shorter chart. Show EVERY label, rotated vertical so the (wide)
      // Jalali month labels all fit instead of being auto-hidden on overlap.
      responsive: {
        rules: [
          {
            condition: { maxWidth: 768 },
            chartOptions: {
              chart: { height: 240, marginBottom: 64 },
              xAxis: {
                labels: {
                  step: 1,
                  rotation: -90,
                  autoRotation: undefined,
                  align: 'right',
                  style: { fontSize: '10px', fontFamily: CHART_FONT },
                },
              },
            },
          },
        ],
      },

      series: [
        {
          // Main area series — Green line + gradient fill [D §10]
          name: 'ارزش',
          type: 'area',
          data,
          color: CHART_COLORS.green,
          lineWidth: 2,
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, CHART_COLORS.greenGradTop],
              [1, CHART_COLORS.greenGradBot],
            ],
          },
          zIndex: 2,
        },
        // Dashed trend line — linear regression overlay [D §10]
        ...(trendPoints.length === 2
          ? [
              {
                name: 'روند',
                type: 'line',
                data: trendPoints,
                color: CHART_COLORS.green,
                lineWidth: 1,
                dashStyle: 'Dash',
                zIndex: 3,
              },
            ]
          : []),
      ],
    }
  }, [data, trendPoints, height, reversed, xFormatter, yFormatter, tooltipFormatter, reducedMotion])

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

  return (
    <div className={cn('w-full', className)}>
      <HCReact ref={chartRef} highcharts={HC} options={options} />
    </div>
  )
})

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Compute two endpoints of a linear regression line through [epoch_ms, value] data */
function computeTrendLine(points: [number, number][]): [number, number][] {
  const n = points.length
  if (n < 2) return []

  let sx = 0, sy = 0, sxy = 0, sx2 = 0
  for (const [x, y] of points) {
    sx += x; sy += y; sxy += x * y; sx2 += x * x
  }

  const denom = n * sx2 - sx * sx
  if (denom === 0) return []

  const slope = (n * sxy - sx * sy) / denom
  const intercept = (sy - slope * sx) / n

  const x0 = points[0][0]
  const x1 = points[n - 1][0]

  return [
    [x0, +(slope * x0 + intercept).toFixed(2)],
    [x1, +(slope * x1 + intercept).toFixed(2)],
  ]
}
