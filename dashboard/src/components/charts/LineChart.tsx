'use client'

// T2.2 — LineChart
// Spec: [D §10] Line chart · [M §8] mobile rules · [A §3.3]
//
// • Primary series: solid Green (#435144)
// • Benchmark / comparison series: dashed Blue (#243344) or Gray (#666565)
// • Below-benchmark / loss series: Red (#802922) — reserved for "below benchmark" only [D §10]
// • Dark multi-series tooltip (Reference B style) [D §10]
// • RTL: xAxis reversed (right→left), Y-axis on the left [D §6.2]
// • Draw-in once on load; disabled under prefers-reduced-motion [D §8]
// • Lazy-loaded; skeleton + error states [D §9.20/9.21]

import { useEffect, useRef, useState } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { CHART_COLORS, CHART_FONT } from '@/lib/utils/highchartsBase'
import { cn } from '@/lib/utils/cn'

export type LineSeriesVariant = 'primary' | 'benchmark' | 'negative'

export interface LineSeries {
  name: string
  /** [epoch_ms, value] pairs sorted chronologically ascending */
  data: [number, number][]
  /** Visual role:
   *  primary    → solid Green (the main portfolio line)
   *  benchmark  → dashed Blue/Gray (reference / index comparison)
   *  negative   → solid Red (below-benchmark emphasis only)
   */
  variant?: LineSeriesVariant
}

export interface LineChartProps {
  series: LineSeries[]
  /** Container height in px (default 300; mobile → 220 via responsive rule) */
  height?: number
  /** Y-axis label formatter */
  yFormatter?: (val: number) => string
  /** X-axis label formatter — receives the raw timestamp in ms */
  xFormatter?: (val: number) => string
  /** Tooltip value formatter for each data point */
  tooltipFormatter?: (val: number) => string
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  className?: string
}

// Color + style per variant [D §10]
const VARIANT_STYLE: Record<LineSeriesVariant, {
  color: string
  lineWidth: number
  dashStyle: string
}> = {
  primary:   { color: CHART_COLORS.green,   lineWidth: 2, dashStyle: 'Solid' },
  benchmark: { color: CHART_COLORS.blue,    lineWidth: 1.5, dashStyle: 'Dash' },
  negative:  { color: CHART_COLORS.red,     lineWidth: 1.5, dashStyle: 'Solid' },
}

export function LineChart({
  series,
  height = 300,
  yFormatter,
  xFormatter,
  tooltipFormatter,
  isLoading,
  isError,
  onRetry,
  className,
}: LineChartProps) {
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

  const anim = reducedMotion ? false : { duration: 600 }
  const hasMultipleSeries = series.length > 1

  const hcSeries = series.map((s) => {
    const style = VARIANT_STYLE[s.variant ?? 'primary']
    return {
      name: s.name,
      type: 'line',
      data: s.data,
      color: style.color,
      lineWidth: style.lineWidth,
      dashStyle: style.dashStyle,
      marker: { enabled: false, states: { hover: { enabled: true, radius: 4 } } },
      // Dot color in the multi-series tooltip legend
      legendSymbol: 'circle',
    }
  })

  const options = {
    chart: {
      height,
      type: 'line',
      style: { fontFamily: CHART_FONT },
      backgroundColor: 'transparent',
      animation: anim,
      marginRight: 0,
    },
    title: { text: '' },
    credits: { enabled: false },
    accessibility: { enabled: false },

    // Legend is shown for multi-series line charts
    legend: hasMultipleSeries
      ? {
          enabled: true,
          align: 'end',         // logical: start = right in RTL, end = left
          verticalAlign: 'top',
          itemStyle: {
            color: CHART_COLORS.text,
            fontSize: '12px',
            fontFamily: CHART_FONT,
            fontWeight: '500',
          },
          symbolRadius: 999,
          symbolWidth: 10,
          symbolHeight: 10,
        }
      : { enabled: false },

    // RTL x-axis [D §6.2]
    xAxis: {
      reversed: true,
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
      crosshair: {
        dashStyle: 'Dash',
        color: CHART_COLORS.textSubtle,
        width: 1,
      },
    },

    // Y-axis on the left, dashed gridlines [D §6.2, D §10]
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

    // Dark multi-series tooltip (Reference B style) [D §10]
    tooltip: {
      shared: true,
      backgroundColor: CHART_COLORS.surfaceDark,
      borderColor: CHART_COLORS.surfaceDark2,
      borderRadius: 12,
      shadow: false,
      followTouchMove: true,
      style: {
        color: '#FFFFFF',
        fontSize: '12px',
        fontFamily: CHART_FONT,
      },
      useHTML: true,
      formatter: function (this: any) {
        const pts: any[] = this.points ?? [{ series: { name: this.series?.name ?? '' }, color: this.color, y: this.y }]
        let out = ''
        for (const pt of pts) {
          const val = tooltipFormatter ? tooltipFormatter(pt.y) : String(pt.y)
          out += `<span style="color:${pt.color}">●</span>&nbsp;${pt.series.name}: <b>${val}</b><br/>`
        }
        return out
      },
    },

    plotOptions: {
      series: {
        animation: anim,
        stickyTracking: false,
      },
      line: {
        marker: { enabled: false },
        states: { hover: { lineWidthPlus: 0 } },
      },
    },

    // Mobile: shorter chart, fewer ticks [M §8]
    responsive: {
      rules: [
        {
          condition: { maxWidth: 768 },
          chartOptions: {
            chart: { height: 220 },
            xAxis: { labels: { step: 2 } },
            legend: { itemStyle: { fontSize: '11px' } },
          },
        },
      ],
    },

    series: hcSeries,
  }

  return (
    <div className={cn('w-full', className)}>
      <HCReact ref={chartRef} highcharts={HC} options={options} />
    </div>
  )
}
