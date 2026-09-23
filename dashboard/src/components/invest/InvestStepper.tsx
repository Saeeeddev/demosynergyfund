'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

// [F §10, D §11, M §6.8] Step bar: 1 Select Amount · 2 Review · 3 Complete
// Desktop: horizontal bar with icons — completed=green(sell:red), current=dark pill, upcoming=subtle
// Mobile: compact «گام ۲ از ۳» text + 3 dots

const STEPS = [
  { label: 'انتخاب مقدار' },
  { label: 'بررسی سفارش' },
  { label: 'تکمیل' },
]
const PERSIAN = ['۱', '۲', '۳']

interface InvestStepperProps {
  step: 1 | 2 | 3
  variant?: 'invest' | 'sell'
}

export function InvestStepper({ step, variant = 'invest' }: InvestStepperProps) {
  const isSell = variant === 'sell'
  const doneColor  = isSell ? 'text-red-base'   : 'text-green-base'
  const activeBg   = isSell ? 'bg-red-base'     : 'bg-green-base'
  const activeLine = isSell ? 'bg-red-base'     : 'bg-green-base'
  const dotDone    = isSell ? 'bg-red-base'     : 'bg-green-base'

  return (
    <>
      {/* Desktop: horizontal step bar [M §6.8 excluded from phone] */}
      <div className="hidden md:flex items-center" aria-label="مراحل">
        {STEPS.map((s, i) => {
          const n = (i + 1) as 1 | 2 | 3
          const done    = n < step
          const current = n === step
          return (
            <div key={n} className="flex items-center">
              {/* Node */}
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'w-7 h-7 rounded-pill flex items-center justify-center shrink-0',
                    'text-[11px] font-bold transition-colors duration-200',
                    done    ? cn('bg-transparent', doneColor) :
                    current ? cn(activeBg, 'text-white') :
                    'bg-gray-tint text-text-subtle',
                  )}
                  aria-current={current ? 'step' : undefined}
                >
                  {done ? <Check size={14} strokeWidth={2.5} /> : PERSIAN[i]}
                </span>
                <span
                  className={cn(
                    'text-[13px] font-medium',
                    done    ? doneColor :
                    current ? 'text-text font-semibold' :
                    'text-text-subtle',
                  )}
                >
                  {s.label}
                </span>
              </div>
              {/* Connector */}
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 w-12 mx-3 rounded transition-colors duration-200',
                    n < step ? activeLine : 'bg-border',
                  )}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile: compact «گام X از ۳» + dot progress [M §6.8] */}
      <div className="md:hidden flex items-center gap-3" aria-label="مرحله">
        <span className="text-[13px] font-medium text-text-muted">
          گام {PERSIAN[step - 1]} از ۳
        </span>
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {STEPS.map((_, i) => {
            const n = i + 1
            return (
              <span
                key={n}
                className={cn(
                  'w-2 h-2 rounded-pill transition-colors duration-200',
                  n < step  ? dotDone :
                  n === step ? 'bg-text' :
                  'bg-border',
                )}
              />
            )
          })}
        </div>
      </div>
    </>
  )
}
