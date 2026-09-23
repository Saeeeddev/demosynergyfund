'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatToman } from '@/lib/utils/currency'
import { formatNumber, bidiIsolate } from '@/lib/utils/numbers'

// [F §10 Step3] Success screen — green check + message + navigation
// Optional gold/green confetti respects prefers-reduced-motion [D §8, M §6.8]

interface CompleteStepProps {
  projectName: string
  shares: number
  investmentAmount: number
}

export function CompleteStep({ projectName, shares, investmentAmount }: CompleteStepProps) {
  const router = useRouter()
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  ).current

  // Count-up animation guard [D §8]
  useEffect(() => {
    // Nothing needed here — no count-up animation implemented (reduced-motion safe default)
  }, [])

  const CONFETTI_COLORS = [
    'var(--gold-soft)',
    'var(--green-base)',
    'var(--gold-base)',
    'var(--green-soft)',
    'var(--blue-soft)',
  ]

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[420px] text-center gap-6 py-10 px-4 overflow-hidden">

      {/* Gold/green confetti — skipped when prefers-reduced-motion [D §8] */}
      {!reducedMotion && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <style>{`
            @keyframes confetti-fall {
              0%   { transform: translateY(-10px) rotate(0deg); opacity: 1; }
              100% { transform: translateY(120px) rotate(360deg); opacity: 0; }
            }
          `}</style>
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className="absolute w-2 h-2 rounded-sm"
              style={{
                backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                left: `${6 + i * 6.5}%`,
                top: '10%',
                animation: `confetti-fall ${0.9 + (i % 4) * 0.2}s ease-out ${i * 0.07}s forwards`,
              }}
            />
          ))}
        </div>
      )}

      {/* Green check circle */}
      <div
        className="w-24 h-24 rounded-full bg-green-tint flex items-center justify-center"
        style={{ animation: reducedMotion ? 'none' : 'scale-in 0.3s ease-out' }}
      >
        {!reducedMotion && (
          <style>{`
            @keyframes scale-in {
              from { transform: scale(0.5); opacity: 0; }
              to   { transform: scale(1);   opacity: 1; }
            }
          `}</style>
        )}
        <CheckCircle2 size={52} className="text-green-base" strokeWidth={1.5} aria-hidden="true" />
      </div>

      {/* Success message */}
      <div className="flex flex-col gap-2">
        <h2 className="text-[22px] font-bold text-text">سرمایه‌گذاری با موفقیت انجام شد</h2>
        <p className="text-[14px] text-text-muted">
          {bidiIsolate(formatNumber(shares))} وات در {projectName} خریداری شد
        </p>
        <p className="text-[13px] text-text-muted">
          مبلغ: {formatToman(investmentAmount)}
        </p>
      </div>

      {/* Actions — [M §6.8] full-screen success on phone */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button
          variant="primary"
          size="wide"
          fullWidth
          onClick={() => router.replace('/dashboard')}
        >
          بازگشت به داشبورد
        </Button>
        <Button
          variant="secondary"
          fullWidth
          onClick={() => router.replace('/portfolio')}
        >
          مشاهده دارایی‌ها
        </Button>
      </div>
    </div>
  )
}
