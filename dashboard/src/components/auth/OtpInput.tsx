'use client'

import { useEffect, useRef } from 'react'
import { onlyDigits, toPersianDigits } from '@/lib/utils/numbers'
import { cn } from '@/lib/utils/cn'

// Fixed-length SMS verification code entry — one box per digit, auto-advance on
// type, auto-back on backspace, paste-friendly (pasting the full code fills every
// box at once). Value is always kept as raw Latin digits; only the display uses
// Persian digits, matching the numeral convention used everywhere else (numbers.ts).
//
// `status` drives the verification feedback that replaces a confirm button:
// 'verifying' sweeps the boxes green first→last (staggered transition-delay),
// 'success' holds them all green, 'error' turns them red and shakes the row.

export type OtpStatus = 'idle' | 'verifying' | 'success' | 'error'

interface OtpInputProps {
  length?: number
  value: string
  onChange: (raw: string) => void
  error?: string
  disabled?: boolean
  status?: OtpStatus
}

const WAVE_STEP_MS = 110

export function OtpInput({
  length = 5,
  value,
  onChange,
  error,
  disabled,
  status = 'idle',
}: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const digits = onlyDigits(value).slice(0, length).split('')
  const isGreen = status === 'verifying' || status === 'success'
  const isRed = status === 'error' || Boolean(error)

  // After a wrong code the row is cleared — put the caret back on the first box.
  useEffect(() => {
    if (value === '' && !disabled) refs.current[0]?.focus()
  }, [value, disabled])

  function setDigitAt(index: number, raw: string) {
    const next = digits.slice()
    next[index] = raw
    onChange(next.join('').slice(0, length))
  }

  function handleChange(index: number, raw: string) {
    const clean = onlyDigits(raw)
    if (!clean) {
      setDigitAt(index, '')
      return
    }
    // Handle paste / multi-char input landing in one box.
    if (clean.length > 1) {
      onChange(clean.slice(0, length))
      const lastIndex = Math.min(clean.length, length) - 1
      refs.current[lastIndex]?.focus()
      return
    }
    setDigitAt(index, clean)
    if (index < length - 1) refs.current[index + 1]?.focus()
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus()
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div
        dir="ltr"
        className={cn(
          'flex items-center justify-center gap-2',
          status === 'error' && 'otp-shake',
        )}
      >
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el
            }}
            inputMode="numeric"
            autoComplete="one-time-code"
            disabled={disabled}
            value={digits[i] ? toPersianDigits(digits[i]) : ''}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            aria-label={`رقم ${i + 1} کد تایید`}
            style={{
              // Stagger both the color transition and the pop keyframe so the
              // green sweeps first→last (physically left→right, matching the
              // LTR digit order).
              transitionDelay: isGreen ? `${i * WAVE_STEP_MS}ms` : '0ms',
              animationDelay: isGreen ? `${i * WAVE_STEP_MS}ms` : undefined,
            }}
            className={cn(
              'w-11 h-12 md:w-10 md:h-11 rounded-md border text-center text-[18px] font-bold tabular-nums',
              'bg-surface text-text focus:outline-none focus:ring-2 transition-colors duration-200',
              isGreen
                ? 'border-green-base bg-green-base text-white otp-pop'
                : status === 'error'
                  ? 'border-red-base bg-red-base text-white'
                  : isRed
                    ? 'border-red-base focus:ring-red-tint focus:border-red-base'
                    : 'border-border-strong focus:ring-green-tint focus:border-green-base',
            )}
          />
        ))}
      </div>
      {error && (
        <p role="alert" className="text-[12px] leading-tight text-red-base text-center">
          {error}
        </p>
      )}
    </div>
  )
}
