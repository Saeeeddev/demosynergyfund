'use client'

// [F §11 R3] ROI Forecast Section
// The investment amount comes from the shared InvestmentCalculator (lifted to the
// page) so the calculator, the forecast, and the Invest flow all use the same
// number. ALL forecast inputs (horizon, assumptions, prior-year payback) come from
// the API via project.details.forecast — nothing here is hardcoded. [F §11]
// Layout: Summary cards → payback note → assumptions → cumulative cash-flow chart.

import { useMemo } from 'react'
import { Clock } from 'lucide-react'
import { ForecastSummaryCards } from './ForecastSummaryCards'
import { CumulativeRoiChart } from './CumulativeRoiChart'
import { AssumptionsPanel } from './AssumptionsPanel'
import { formatNumber, onlyDigits } from '@/lib/utils/numbers'
import type { ForecastScenario, ForecastYearData, RoiForecastResult } from '@/types/domain'
import type { ProjectWithDetails } from '@/lib/schemas/project'

// ─── ROI calculation (client-side only — pure math over API-supplied inputs) ───

const SCENARIO_MULTIPLIERS: Record<ForecastScenario, number> = {
  conservative: 0.80,
  base:         1.00,
  optimistic:   1.20,
}

// Single (base) scenario per product direction.
const SCENARIO: ForecastScenario = 'base'

// Toggle the war/market context line in the payback note. Set false to hide it.
const SHOW_MARKET_NOTE = true

function computeForecast(
  project: ProjectWithDetails,
  scenario: ForecastScenario,
  investedAmount: number,
): { result: RoiForecastResult; yearlyData: ForecastYearData[] } {
  const { horizonYears, degradationRatePercent } = project.details.forecast
  const multiplier = SCENARIO_MULTIPLIERS[scenario]
  const yieldRate = (project.targetYield / 100) * multiplier
  const degradation = degradationRatePercent / 100
  const principal = investedAmount > 0 ? investedAmount : project.minInvestment

  // With no amount entered and no minimum set (principal 0), every ratio below
  // divides by zero and renders as NaN. Nothing is invested, so the forecast is
  // simply all-zero until the user types an amount.
  if (principal <= 0) {
    const empty: ForecastYearData[] = Array.from({ length: horizonYears }, (_, i) => ({
      year: i + 1,
      annualIncome: 0,
      cumulativeReturn: 0,
    }))
    return {
      result: {
        projectedTotalReturn: 0,
        projectedReturnPercent: 0,
        avgAnnualRoi: 0,
        paybackYears: horizonYears + 1,
        projectedCumulativeIncome: 0,
        yearlyData: empty,
      },
      yearlyData: empty,
    }
  }

  let cumulative = 0
  let paybackYear: number | null = null
  const yearlyData: ForecastYearData[] = []

  for (let y = 1; y <= horizonYears; y++) {
    const yearYield = yieldRate * Math.pow(1 - degradation, y - 1)
    const annualIncome = principal * yearYield
    cumulative += annualIncome
    if (paybackYear === null && cumulative >= principal) {
      paybackYear = y
    }
    yearlyData.push({ year: y, annualIncome, cumulativeReturn: cumulative })
  }

  const projectedTotalReturn = cumulative - principal
  const projectedReturnPercent = (projectedTotalReturn / principal) * 100
  const avgAnnualRoi = projectedReturnPercent / horizonYears
  const paybackYears = paybackYear ?? horizonYears + 1

  return {
    result: {
      projectedTotalReturn,
      projectedReturnPercent,
      avgAnnualRoi,
      paybackYears,
      projectedCumulativeIncome: cumulative,
      yearlyData,
    },
    yearlyData,
  }
}

interface RoiForecastSectionProps {
  project: ProjectWithDetails
  /** Quantity in kilowatts (shared with the calculator); 0 → uses min investment */
  kw: string
}

export function RoiForecastSection({ project, kw }: RoiForecastSectionProps) {
  const { forecast } = project.details
  const investedAmount = (parseInt(onlyDigits(kw), 10) || 0) * project.sharePrice

  const { result, yearlyData } = useMemo(
    () => computeForecast(project, SCENARIO, investedAmount),
    [project, investedAmount],
  )

  return (
    <div className="flex min-w-0 flex-col gap-5">
      {/* 3 summary cards — live (payback shown as a note below, not a card) */}
      <ForecastSummaryCards result={result} />

      {/* Payback period — shown as a contextual note instead of a hard number card */}
      <div className="flex items-start gap-3 rounded-md bg-surface border border-blue-base/20 px-4 py-3">
        <Clock size={18} className="text-blue-deep shrink-0 mt-0.5" />
        <p className="text-[13px] text-text-2 leading-relaxed">
          دوره بازگشت سرمایه در شرایط فعلی بازار
          {SHOW_MARKET_NOTE && ' (با توجه به وضعیت جنگ)'} حدود{' '}
          <strong className="tabular-nums">{formatNumber(result.paybackYears, 1)} سال</strong>{' '}
          برآورد می‌شود؛ سال گذشته این عدد حدود{' '}
          <strong className="tabular-nums">{formatNumber(forecast.previousPaybackYears)} سال</strong> بود.
          این یک تخمین است و تضمینی برای آینده نیست.
        </p>
      </div>

      {/* Assumptions & methodology — moved up, above the charts [F §11] */}
      <AssumptionsPanel assumptions={forecast} targetYieldPercent={project.targetYield} />

      {/* Chart — cumulative cash flow over time */}
      <div className="flex flex-col gap-4 rounded-card border border-border bg-surface p-4 sm:p-5">
          <h3 className="text-[14px] font-semibold text-text">جریان نقدینگی تجمیعی</h3>
          <CumulativeRoiChart
            yearlyData={yearlyData}
            investedAmount={investedAmount || project.minInvestment}
            height={300}
          />
      </div>
    </div>
  )
}
