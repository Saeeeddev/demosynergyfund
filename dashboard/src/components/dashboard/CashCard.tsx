'use client'

// [F §2 R1] Cash card — balance + Deposit (green) + Withdraw (red)
// [D §11]: wide card; buttons on the start side; big balance in display/metric
// [M §6.2]: phone → two half-width 48px buttons BELOW the balance

import { Button } from '@/components/ui/Button'
import { formatToman } from '@/lib/utils/currency'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'

interface CashCardProps {
  balance: number
  onDeposit?: () => void
  onWithdraw?: () => void
  isLoading?: boolean
}

export function CashCard({ balance, onDeposit, onWithdraw, isLoading = false }: CashCardProps) {
  return (
    <div className="relative overflow-hidden rounded-card border border-border shadow-[var(--shadow-card)] p-5 lg:p-6">
      {/* Brighter gradient: vivid blue → cyan → lavender */}
      <div className="absolute inset-0 bg-gradient-to-bl from-[var(--blue-base)] via-[var(--cyan-base)] to-[var(--purple-base)]" />
      
      {/* Content overlay */}
      <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Balance section */}
        <div className="flex flex-col gap-2">
          <span className="text-[14px] font-medium text-white/90">موجودی نقدی:</span>
          {isLoading ? (
            <span className="h-[32px] lg:h-[38px] w-40 rounded-md bg-white/25 animate-pulse" aria-hidden="true" />
          ) : (
            <span className="text-[32px] lg:text-[38px] font-bold text-white tabular-nums leading-none tracking-tight drop-shadow-sm">
              {formatToman(balance)}
            </span>
          )}
        </div>

        {/* Buttons section with improved UX */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="wide"
            onClick={onDeposit}
            className="flex-1 lg:flex-none bg-white text-blue-deep border-0 shadow-md hover:shadow-lg hover:bg-white/90 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 font-semibold"
          >
            <ArrowDownLeft size={18} className="rtl:rotate-180" />
            واریز
          </Button>
          <Button
            variant="secondary"
            size="wide"
            onClick={onWithdraw}
            className="flex-1 lg:flex-none bg-white/15 text-white border border-white/40 backdrop-blur shadow-sm hover:bg-white/25 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 font-semibold"
          >
            <ArrowUpRight size={18} className="rtl:rotate-180" />
            برداشت
          </Button>
        </div>
      </div>

      {/* Decorative elements for better UX */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
    </div>
  )
}
