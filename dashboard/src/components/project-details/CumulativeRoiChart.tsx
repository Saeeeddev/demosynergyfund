'use client'

// [F §11 R3] Cumulative ROI / Net Return over years — Area or Line Chart
// Break-even marker where cumulative payouts pass original investment
// [M §8] Mobile: ~220px height, tap tooltips, RTL time axis

import { useEffect, useState, useMemo } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { CHART_COLORS, CHART_FONT } from '@/lib/utils/highchartsBase'
import { formatCompact } from '@/lib/utils/numbers'
import { formatTomanCompact } from '@/lib/utils/currency'
import type { ForecastYearData } from '@/types/domain'

interface CumulativeRoiChartProps {
  yearlyData: ForecastYearData[]
  investedAmount: number
  height?: number
}

export function CumulativeRoiChart({ yearlyData, investedAmount, height = 280 }: CumulativeRoiChartProps) {
  const [HighchartsReact, setHighchartsReact] = useState<React.ComponentType<Record<string, unknown>> | null>(null)
  const [Highcharts, setHighcharts] = useState<unknown>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    Promise.all([import('highcharts'), import('highcharts-react-official')]).then(
      ([hc, hcr]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const H = (hc as any).default ?? hc
        H.setOptions({ lang: { numericSymbols: [' ه', ' م', ' م م', ' ت', ' ک ت', ' م ت'] } })
        setHighcharts(H)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setHighchartsReact(() => (hcr as any).default)
      }
    )
  }, [])

  // Find break-even year
  const breakEvenYear = useMemo(() => {
    if (investedAmount <= 0) return null
    const idx = yearlyData.findIndex((d) => d.cumulativeReturn >= investedAmount)
    return idx >= 0 ? yearlyData[idx].year : null
  }, [yearlyData, investedAmount])

  const options = useMemo(() => {
    const categories = yearlyData.map((d) => String(d.year))
    const data = yearlyData.map((d) => d.cumulativeReturn)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const plotLines: any[] = []
    if (breakEvenYear !== null) {
      plotLines.push({
        value: categories.indexOf(String(breakEvenYear)),
        color: CHART_COLORS.green,
        dashStyle: 'Dash',
        width: 2,
        label: {
          text: 'نقطه سربه‌سر',
          style: { color: CHART_COLORS.green, fontSize: '11px', fontFamily: CHART_FONT },
          align: 'right',
          rotation: 0,
          y: -6,
        },
      })
    }

    return {
      chart: {
        type: 'area',
        backgroundColor: 'transparent',
        animation: !reducedMotion,
        height,
        style: { fontFamily: CHART_FONT },
      },
      title: { text: '' },
      xAxis: {
        categories,
        reversed: false, // LTR: year 1 on the left → latest on the right
        lineColor: 'transparent',
        tickColor: 'transparent',
        // step:1 → never skip a year label (fixes hidden dates)
        labels: { step: 1, style: { color: CHART_COLORS.textSubtle, fontSize: '11px', fontFamily: CHART_FONT } },
        plotLines,
      },
      yAxis: {
        title: { text: '' },
        opposite: false,
        gridLineDashStyle: 'Dash',
        gridLineColor: CHART_COLORS.border,
        labels: {
          style: { color: CHART_COLORS.textSubtle, fontSize: '11px', fontFamily: CHART_FONT },
          formatter() {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const v = (this as any).value as number
            // Persian compact incl. میلیارد for large values
            return formatCompact(v)
          },
        },
        plotLines: investedAmount > 0 ? [{
          value: investedAmount,
          color: CHART_COLORS.gold,
          dashStyle: 'ShortDash',
          width: 1.5,
          label: {
            text: 'سرمایه اولیه',
            style: { color: CHART_COLORS.gold, fontSize: '11px', fontFamily: CHART_FONT },
            align: 'left',
          },
        }] : [],
      },
      series: [{
        name: 'بازده تجمیعی',
        data,
        color: CHART_COLORS.green,
        lineWidth: 2,
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, `${CHART_COLORS.green}33`],
            [1, `${CHART_COLORS.green}00`],
          ],
        },
        marker: { enabled: false, states: { hover: { enabled: true, radius: 4 } } },
      }],
      tooltip: {
        backgroundColor: 'white',
        borderColor: CHART_COLORS.border,
        borderRadius: 12,
        style: { color: CHART_COLORS.text, fontFamily: CHART_FONT, fontSize: '13px' },
        stickyTracking: false,
        followTouchMove: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter(): string {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const self = this as any
          const v = self.y as number
          return `<b>سال ${self.x}</b><br/>بازده: ${formatTomanCompact(v)}`
        },
      },
      legend: { enabled: false },
      credits: { enabled: false },
      responsive: {
        rules: [{
          condition: { maxWidth: 768 },
          chartOptions: { chart: { height: 220 } },
        }],
      },
    }
  }, [yearlyData, investedAmount, breakEvenYear, reducedMotion, height])

  if (!HighchartsReact || !Highcharts) {
    return (
      <div style={{ height }}>
        <Skeleton className="h-full w-full rounded-card" />
      </div>
    )
  }

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  )
}
