'use client'

// [F §12] Sell page — dynamic per projectId, Invest in reverse (red semantic)
// [A §3.5] Guard: validate projectId AND that user holds shares; redirect /marketplace if not
// [M §6.9] Same structure as Invest, recolored to Red/sell

import { use, useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useProject } from '@/lib/hooks/useProjects'
import { useHoldings } from '@/lib/hooks/usePortfolio'
import { useSellWatts, useUserOwnsProject } from '@/lib/hooks/useInvestments'
import { SellStepper } from '@/components/sell/SellStepper'
import { SelectedHoldingBox } from '@/components/sell/SelectedHoldingBox'
import { SellAmountBox } from '@/components/sell/SellAmountBox'
import { SellReviewBox } from '@/components/sell/SellReviewBox'
import type { ProceedsDestination } from '@/components/sell/SellReviewBox'
import { SellReviewStep } from '@/components/sell/SellReviewStep'
import { SellCompleteStep } from '@/components/sell/SellCompleteStep'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { Card } from '@/components/ui/Card'
import { BackButton } from '@/components/ui/BackButton'

// Platform commission — 5%, matching backend `Plant.fee_bps` (500 bps
// default, changeable per project). Applies both ways (buy and sell).
const SELL_FEE_RATE = 0.05

type Step = 1 | 2 | 3

interface SellPageProps {
  params: Promise<{ projectId: string }>
}

export default function SellPage({ params }: SellPageProps) {
  const { projectId } = use(params)
  const router = useRouter()

  // ── Data ─────────────────────────────────────────────────────────────────────
  const { data: project, isLoading: projectLoading, isError: projectError } = useProject(projectId)
  // One big page: this screen needs to find one specific holding by project.
  const { data: holdings, isLoading: holdingsLoading }  = useHoldings(1, 100)
  const { data: userOwns, isLoading: ownsLoading }      = useUserOwnsProject(projectId)
  const sellMutation = useSellWatts()

  // Find the specific holding for this project
  const holding = useMemo(
    () => holdings?.data.find(h => h.projectId === projectId) ?? null,
    [holdings, projectId],
  )

  const isLoading = projectLoading || holdingsLoading || ownsLoading

  // ── Dynamic guard [A §3.5, F §0.3]:
  //    redirect if project not found OR user doesn't own it ────────────────────
  useEffect(() => {
    if (isLoading) return
    if (projectError || !project || userOwns === false || !holding) {
      router.replace('/marketplace')
    }
  }, [isLoading, projectError, project, userOwns, holding, router])

  // ── Form state ────────────────────────────────────────────────────────────────
  const [step, setStep]                     = useState<Step>(1)
  // Quantity is entered in whole KILOWATTS (min 1 kW) — same rule as Invest.
  const [kw, setKw]                         = useState('')
  const [destination, setDestination]       = useState<ProceedsDestination>('platform')
  const [rules1, setRules1]                 = useState(false)
  const [rules2, setRules2]                 = useState(false)

  // ── Derived values ────────────────────────────────────────────────────────────
  // holding.sharesOwned is already a whole-kilowatt count (backend/apps/portfolio's
  // shares_owned = account.balance, one ledger token = 1 kW) — no ÷1000 here.
  const maxKw        = holding?.sharesOwned ?? 0
  const parsedKw      = parseInt(kw, 10) || 0
  const shares        = parsedKw * 1000 // watts — what the mutation and review/complete steps display
  const currentPrice = holding?.currentPrice ?? 0 // Toman per kilowatt
  const proceeds    = parsedKw * currentPrice
  const fee         = proceeds * SELL_FEE_RATE
  const netProceeds = proceeds - fee

  const isValidQty  = parsedKw > 0 && parsedKw <= maxKw
  const canProceed  = isValidQty && rules1 && rules2

  // ── Loading ───────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="p-3 lg:p-3 flex flex-col gap-4">
        <Skeleton className="h-12 rounded-card" />
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:gap-5">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Skeleton className="h-28 rounded-card" />
            <Skeleton className="h-52 rounded-card" />
            <Skeleton className="h-40 rounded-card" />
          </div>
          <Skeleton className="h-96 rounded-card" />
        </div>
      </div>
    )
  }

  // ── Guard: error / not found / not owned ──────────────────────────────────────
  if (projectError || !project || !holding) {
    return (
      <div className="p-3 lg:p-3">
        <ErrorState
          scope="page"
          onRetry={() => router.replace('/marketplace')}
          title="دارایی یافت نشد"
          message="این پروژه در دارایی‌های شما وجود ندارد — به بازار بروید"
        />
      </div>
    )
  }

  // ── Confirm (Step 2 → Step 3) ─────────────────────────────────────────────────
  const handleConfirm = async () => {
    try {
      await sellMutation.mutateAsync({ projectId: project.id, sharesCount: shares })
      setStep(3)
    } catch {
      // Global mutation error toast handles it (app/providers.tsx)
    }
  }

  return (
    <div className="p-3 lg:p-3 flex flex-col gap-4 lg:gap-5">

      <BackButton href="/portfolio" label="بازگشت به سبد دارایی" />

      {/* Stepper (sell variant = red) */}
      <Card className="p-4">
        <SellStepper step={step} variant="sell" />
      </Card>

      {/* ─── Step 1: Select Quantity ──────────────────────────────────────── */}
      {step === 1 && (
        // Exact mirror of Invest's Step 1 grid: RIGHT (65%, sticky) → asset +
        // amount picker; LEFT (35%, normal flow) → review box (summary +
        // destination + agreements + CTA). Mobile: stacked + fixed CTA bar.
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[65fr_35fr] lg:gap-5 lg:items-start pb-[112px] lg:pb-0">

          {/* RIGHT side (65%) — selected holding + amount picker right beneath it;
              sticky so the input stays in view and the page doesn't scroll. */}
          <div className="lg:sticky lg:top-3 flex flex-col gap-4">
            <SelectedHoldingBox holding={holding} />
            <SellAmountBox
              holding={holding}
              kw={kw}
              onKwChange={setKw}
              maxKw={maxKw}
              proceeds={proceeds}
              netProceeds={netProceeds}
            />
          </div>

          {/* LEFT side (35%) — خلاصه فروش (با مقصد واریز + موافقت‌ها) */}
          <div className="flex flex-col gap-4">
            <SellReviewBox
              quantity={shares}
              proceeds={proceeds}
              fee={fee}
              netProceeds={netProceeds}
              destination={destination}
              onDestinationChange={setDestination}
              feeRate={SELL_FEE_RATE}
              rules1={rules1}
              rules2={rules2}
              onRules1Change={setRules1}
              onRules2Change={setRules2}
              canProceed={canProceed}
              onNext={() => setStep(2)}
            />
          </div>
        </div>
      )}

      {/* ─── Step 2: Review & Confirm ──────────────────────────────────────── */}
      {step === 2 && (
        <SellReviewStep
          holding={holding}
          quantity={shares}
          proceeds={proceeds}
          fee={fee}
          netProceeds={netProceeds}
          destination={destination}
          onConfirm={handleConfirm}
          isPending={sellMutation.isPending}
        />
      )}

      {/* ─── Step 3: Complete ──────────────────────────────────────────────── */}
      {step === 3 && (
        <SellCompleteStep
          projectName={project.name}
          quantity={shares}
          netProceeds={netProceeds}
        />
      )}
    </div>
  )
}
