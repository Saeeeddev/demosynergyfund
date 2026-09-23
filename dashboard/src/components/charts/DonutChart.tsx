'use client'

// T2.2 — DonutChart
// Spec: [D §10] Donut chart · [M §8] donut legend below on phone · [A §3.3]
//
// • Categorical color order: Green → Blue → Gold → Purple → Gray [D §10]
// • Thin segments, generous center hole (65%), center can show total text
// • Legend dots on the start (right) side on desktop [D §10]
// • Legend moves below the donut on phone (<= 768px) [M §8]
// • Lazy-loaded; skeleton + error states [D §9.20/9.21]
// • Draw-in animation once; disabled under prefers-reduced-motion [D §8]
// • Center text rendered via Highcharts SVG renderer (uses series[0].center
//   so it stays accurate regardless of legend placement)

import { useEffect, useMemo, useRef, useState, memo } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { CATEGORICAL_COLORS, CHART_COLORS, CHART_FONT } from '@/lib/utils/highchartsBase'
import { cn } from '@/lib/utils/cn'

export interface DonutSlice {
  /** Farsi label shown in the legend / tooltip */
  name: string
  /** Numeric value (raw number; the chart shows %) */
  y: number
  /** Override the categorical color for this slice */
  color?: string
}

export interface DonutChartProps {
  data: DonutSlice[]
  /** Text displayed in the donut hole (e.g. the formatted total) */
  centerText?: string
  /** Show the legend (default true) */
  showLegend?: boolean
  /** Container height in px (default 280; mobile → 220 via responsive rule) */
  height?: number
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  className?: string
}

export const DonutChart = memo(function DonutChart({
  data,
  centerText,
  showLegend = true,
  height = 280,
  isLoading,
  isError,
  onRetry,
  className,
}: DonutChartProps) {
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

  // Assign categorical colors — stable reference until data changes
  const coloredData = useMemo(
    () => data.map((slice, i) => ({
      ...slice,
      color: slice.color ?? CATEGORICAL_COLORS[i % CATEGORICAL_COLORS.length],
    })),
    [data],
  )

  // Center text render callback — stable reference until centerText changes.
  // Uses series[0].center for correct positioning regardless of legend placement.
  const onRenderCenterText = useMemo(
    () => centerText
      ? function (this: any) {
          const chart = this
          const ser = chart.series?.[0]
          if (!ser?.center) return

          const cx = chart.plotLeft + ser.center[0]
          const cy = chart.plotTop + ser.center[1]

          if (chart._donutLabel) {
            chart._donutLabel.attr({ text: centerText, x: cx, y: cy + 6 })
          } else {
            chart._donutLabel = chart.renderer
              .text(centerText, cx, cy + 6)
              .attr({ align: 'center', zIndex: 5 })
              .css({
                fontSize: '14px',
                fontWeight: '600',
                color: CHART_COLORS.text,
                fontFamily: CHART_FONT,
              })
              .add()
          }
        }
      : undefined,
    [centerText],
  )

  // Highcharts options — stable reference until a real input changes.
  // Deps: coloredData, height, showLegend, onRenderCenterText, reducedMotion.
  // CHART_COLORS/CHART_FONT are module constants and excluded.
  const options = useMemo(() => {
    const anim = reducedMotion ? false : { duration: 600 }

    return {
      chart: {
        height,
        type: 'pie',
        style: { fontFamily: CHART_FONT },
        backgroundColor: 'transparent',
        animation: anim,
        events: onRenderCenterText ? { render: onRenderCenterText } : {},
      },
      title: { text: '' },
      credits: { enabled: false },
      accessibility: { enabled: false },

      // Legend: circular dots on the start (right in RTL) on desktop [D §10]
      legend: showLegend
        ? {
            enabled: true,
            align: 'right',
            verticalAlign: 'middle',
            layout: 'vertical',
            symbolRadius: 999,  // circular dots [D §10]
            symbolWidth: 10,
            symbolHeight: 10,
            itemStyle: {
              color: CHART_COLORS.text,
              fontSize: '12px',
              fontFamily: CHART_FONT,
              fontWeight: '500',
            },
            itemHoverStyle: { color: CHART_COLORS.green },
          }
        : { enabled: false },

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
        pointFormat:
          '<span style="color:{point.color}">●</span> {series.name}: <b>{point.percentage:.1f}٪</b>',
      },

      plotOptions: {
        pie: {
          innerSize: '65%',    // generous center hole [D §10]
          size: '80%',
          borderWidth: 2,
          borderColor: CHART_COLORS.surface,  // white gap between segments
          dataLabels: { enabled: false },
          showInLegend: showLegend,
          animation: anim,
          stickyTracking: false,  // tap tooltip on touch [M §8]
          states: {
            hover: { halo: { size: 6 } },
          },
        },
      },

      // Mobile: legend moves below the donut [M §8, D §10]
      responsive: {
        rules: [
          {
            condition: { maxWidth: 768 },
            chartOptions: {
              chart: { height: 220 },
              legend: {
                align: 'center',
                verticalAlign: 'bottom',
                layout: 'horizontal',
              },
            },
          },
        ],
      },

      series: [
        {
          name: 'تخصیص',
          type: 'pie',
          data: coloredData,
        },
      ],
    }
  }, [coloredData, height, showLegend, onRenderCenterText, reducedMotion])

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
