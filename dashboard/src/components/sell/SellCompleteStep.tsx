'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatToman } from '@/lib/utils/currency'
import { formatNumber, bidiIsolate } from '@/lib/utils/numbers'

// [F §12] Sell Step 3 — success screen, red/destructive color scheme [D §11 Sell recipe]
// [M §6.9] Full-screen success on phone; reduced-motion aware

interface SellCompleteStepProps {
  projectName: string
  quantity: number
  netProceeds: number
}

export function SellCompleteStep({ projectName, quantity, netProceeds }: SellCompleteStepProps) {
  const router = useRouter()
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  ).current

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[420px] text-center gap-6 py-10 px-4 overflow-hidden">

      {/* Red circle check — sell success [D §11] */}
      <div
        className="w-24 h-24 rounded-full bg-red-tint flex items-center justify-center"
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
        <CheckCircle2 size={52} className="text-red-base" strokeWidth={1.5} aria-hidden="true" />
      </div>

      {/* Success message */}
      <div className="flex flex-col gap-2">
        <h2 className="text-[22px] font-bold text-text">فروش با موفقیت انجام شد</h2>
        <p className="text-[14px] text-text-muted">
          {bidiIsolate(formatNumber(quantity))} وات از {projectName} فروخته شد
        </p>
        <p className="text-[13px] text-text-muted">
          خالص دریافتی: {formatToman(netProceeds)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button
          variant="primary"
          size="wide"
          fullWidth
          onClick={() => router.replace('/portfolio')}
        >
          بازگشت به دارایی‌ها
        </Button>
        <Button
          variant="secondary"
          fullWidth
          onClick={() => router.replace('/dashboard')}
        >
          رفتن به داشبورد
        </Button>
      </div>
    </div>
  )
}
