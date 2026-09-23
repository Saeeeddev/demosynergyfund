'use client'

// [F §10] Invest page — dynamic per projectId, 3-step flow
// [A §3.5] Guard: validate projectId, redirect /marketplace if invalid
// [M §6.8] Most important mobile flow: compact stepper, stacked boxes, sticky CTA, bottom nav hidden

import { use, useEffect, useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { onlyDigits } from '@/lib/utils/numbers'
import { toast } from '@/lib/toast'
import { useProject } from '@/lib/hooks/useProjects'
import { useDashboard } from '@/lib/hooks/usePortfolio'
import { useBuyWatts } from '@/lib/hooks/useInvestments'
import { useVerification } from '@/lib/hooks/useKyc'
import { InvestStepper } from '@/components/invest/InvestStepper'
import { SelectedAssetBox } from '@/components/invest/SelectedAssetBox'
import { InvestmentAmountBox } from '@/components/invest/InvestmentAmountBox'
import { InvestmentReviewBox } from '@/components/invest/InvestmentReviewBox'
import { KycRequiredNotice } from '@/components/invest/KycRequiredNotice'
import { ReviewStep } from '@/components/invest/ReviewStep'
import { CompleteStep } from '@/components/invest/CompleteStep'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { Card } from '@/components/ui/Card'
import { BackButton } from '@/components/ui/BackButton'

// Platform commission — 5%, matching backend `Plant.fee_bps` (500 bps
// default, changeable per project). Investing only ever charges the
// platform account balance — there is no other funding source.
const PLATFORM_FEE = 0.05

type Step = 1 | 2 | 3

interface InvestPageProps {
  params: Promise<{ projectId: string }>
}

export default function InvestPage({ params }: InvestPageProps) {
  const { projectId } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()

  // ── Data ─────────────────────────────────────────────────────────────────────
  const { data: project, isLoading, isError } = useProject(projectId)
  const { data: dashboard } = useDashboard()
  const { data: verification, isLoading: kycLoading } = useVerification()
  const buyMutation = useBuyWatts()

  // Real-life rule (and backend-enforced, this is only the UX layer): buying
  // real ownership requires an approved identity verification.
  const kycStatus = verification?.status ?? 'not_submitted'
  const isKycVerified = kycStatus === 'approved'

  // ── Form state ────────────────────────────────────────────────────────────────
  const [step, setStep]               = useState<Step>(1)
  // Quantity is in whole KILOWATTS (min 1 kW). Prefill from the calculator (?kw=).
  const [kw, setKw]                   = useState(() => onlyDigits(searchParams.get('kw') ?? ''))
  const [rules1, setRules1]           = useState(false)
  const [rules2, setRules2]           = useState(false)

  // ── Dynamic guard: redirect if project not found [A §3.5, F §0.3] ───────────
  useEffect(() => {
    if (!isLoading && !isError && !project) {
      router.replace('/marketplace')
    }
  }, [isLoading, isError, project, router])

  // ── Derived values ────────────────────────────────────────────────────────────
  const cashBalance  = dashboard?.cashBalance ?? 0
  const sharePrice   = project?.sharePrice ?? 1
  const totalCap     = project?.totalCapacityWatts ?? 1
  const targetYield  = project?.targetYield ?? 0
  const soldPercent  = project?.soldPercent ?? 0

  const pricePerKw   = sharePrice // Toman per kilowatt already (backend/apps/projects/api.py)
  // Available shares (watts) and the maximum buyable kW
  const availableWatts = Math.round(totalCap * (1 - soldPercent / 100))
  const maxKw        = Math.floor(availableWatts / 1000)

  const parsedKw     = useMemo(() => parseInt(kw.replace(/[^0-9]/g, ''), 10) || 0, [kw])
  const shares       = useMemo(() => parsedKw * 1000, [parsedKw]) // watts, display-only
  // Toman math uses the kW count directly against the per-kW price — not
  // `shares` (watts), which would overstate the amount 1000x.
  const investmentAmount = useMemo(() => parsedKw * pricePerKw, [parsedKw, pricePerKw])
  const ownershipPct = useMemo(() => (shares / totalCap) * 100, [shares, totalCap])
  const annualIncome = useMemo(() => investmentAmount * (targetYield / 100), [investmentAmount, targetYield])
  const monthlyPayout = useMemo(() => annualIncome / 12, [annualIncome])
  const fee           = investmentAmount * PLATFORM_FEE
  const total         = investmentAmount + fee

  // Min 1 kW, cannot exceed available shares. Balance is NOT a hard block here —
  // if the account balance is short, we send the user to top up (see handleProceed).
  const isValidAmount = parsedKw >= 1 && parsedKw <= maxKw
  const canProceed    = isValidAmount && rules1 && rules2 && isKycVerified

  // Step 1 → 2. KYC first (a real purchase cannot happen without it), then the
  // balance check — investing only ever charges the account balance, so if
  // it's short, redirect to deposit prefilled with the exact shortfall. The
  // backend re-enforces both regardless — this is only the friendly,
  // explain-why UX layer.
  const handleProceed = () => {
    if (!isKycVerified) {
      toast.error('برای خرید سهام، ابتدا باید احراز هویت خود را تکمیل کنید.')
      router.push('/verification')
      return
    }
    if (total > cashBalance) {
      const shortfall = Math.ceil(total - cashBalance)
      toast.error('موجودی حساب کافی نیست. لطفاً حساب خود را شارژ کنید.')
      router.push(`/dashboard?deposit=${shortfall}`)
      return
    }
    setStep(2)
  }

  // ── Loading state ─────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="p-3 lg:p-3 flex flex-col gap-4">
        {/* Stepper skeleton */}
        <Skeleton className="h-12 rounded-card" />
        {/* Step 1 layout skeleton: phone = stacked, desktop = 2/3 + 1/3 */}
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

  // ── Error / not found ─────────────────────────────────────────────────────────
  if (isError || !project) {
    return (
      <div className="p-3 lg:p-3">
        <ErrorState
          scope="page"
          onRetry={() => router.replace('/marketplace')}
          title="پروژه یافت نشد"
          message="صفحه مورد نظر وجود ندارد — به بازار بروید"
        />
      </div>
    )
  }

  // ── Handle confirm (Step 2 → Step 3) ─────────────────────────────────────────
  const handleConfirm = async () => {
    try {
      await buyMutation.mutateAsync({ projectId: project.id, sharesCount: shares })
      setStep(3)
    } catch {
      // Global mutation error toast handles it (app/providers.tsx)
    }
  }

  return (
    <div className="p-3 lg:p-3 flex flex-col gap-4 lg:gap-5">

      <BackButton href="/marketplace" label="بازگشت به فرصت‌های سرمایه‌گذاری" />

      {/* Stepper — always visible */}
      <Card className="p-4">
        <InvestStepper step={step} variant="invest" />
      </Card>

      {/* ─── Step 1: Select Amount ──────────────────────────────────────────── */}
      {step === 1 && (
        <>
        {!isKycVerified && !kycLoading && <KycRequiredNotice status={kycStatus} />}
        {/* Desktop RTL grid: first child → RIGHT (3 boxes, 2fr), second child → LEFT (ReviewBox, 1fr)
            Mobile: single column stack — SelectedAsset → Amount → FundingSource → sticky ReviewBox
            Bottom padding on mobile so the sticky ReviewBox doesn't cover the last card [M §6.8] */}
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[65fr_35fr] lg:gap-5 lg:items-start pb-[112px] lg:pb-0">

          {/* RIGHT side (65%) — selected asset + amount picker right beneath it;
              sticky so the input stays in view and the page doesn't scroll. */}
          <div className="lg:sticky lg:top-3 flex flex-col gap-4">
            <SelectedAssetBox project={project} />
            <InvestmentAmountBox
              project={project}
              kw={kw}
              onKwChange={setKw}
              maxKw={maxKw}
              pricePerKw={pricePerKw}
            />
          </div>

          {/* LEFT side (35%) — خلاصه سرمایه‌گذاری (با موافقت‌ها) */}
          <div className="flex flex-col gap-4">
            <InvestmentReviewBox
              shares={shares}
              ownershipPct={ownershipPct}
              annualIncome={annualIncome}
              monthlyPayout={monthlyPayout}
              investmentAmount={investmentAmount}
              fee={fee}
              total={total}
              rules1={rules1}
              rules2={rules2}
              onRules1Change={setRules1}
              onRules2Change={setRules2}
              canProceed={canProceed}
              onNext={handleProceed}
            />
          </div>
        </div>
        </>
      )}

      {/* ─── Step 2: Review & Confirm ──────────────────────────────────────── */}
      {step === 2 && (
        <ReviewStep
          project={project}
          shares={shares}
          ownershipPct={ownershipPct}
          annualIncome={annualIncome}
          monthlyPayout={monthlyPayout}
          investmentAmount={investmentAmount}
          fee={fee}
          total={total}
          onConfirm={handleConfirm}
          isPending={buyMutation.isPending}
        />
      )}

      {/* ─── Step 3: Complete ──────────────────────────────────────────────── */}
      {step === 3 && (
        <CompleteStep
          projectName={project.name}
          shares={shares}
          investmentAmount={investmentAmount}
        />
      )}
    </div>
  )
}
