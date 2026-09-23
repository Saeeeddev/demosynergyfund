'use client'

import { useEffect, useState } from 'react'
import { OtpInput, type OtpStatus } from './OtpInput'
import { toPersianDigits, bidiIsolate } from '@/lib/utils/numbers'

// Step 2 shared by Register + Forgot-password: enter the 5-digit SMS code.
// There is no confirm button — typing the fifth digit submits the code itself.
// While the backend check runs, the boxes sweep green first→last; a wrong
// code flips them red with a shake, then clears the row. The check is the
// parent's `onVerify` (a real /auth/otp/verify call — see AUTH.md): it must
// throw/reject on an invalid code and resolve when the step may advance.

const RESEND_SECONDS = 45
// How long the green sweep takes across 5 boxes — the fake "backend" answers
// after the sweep completes so the animation reads as the request in flight.
const WAVE_MS = 5 * 110 + 250
const SUCCESS_HOLD_MS = 350
const ERROR_HOLD_MS = 800

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

interface OtpStepProps {
  phone: string
  /** The real backend check — must reject on an invalid/expired code. */
  onVerify: (code: string) => Promise<void>
  /** Advance the flow; called only after the success animation finishes. */
  onSuccess: (code: string) => void
  onResend: () => void
  onChangePhone: () => void
}

export function OtpStep({ phone, onVerify, onSuccess, onResend, onChangePhone }: OtpStepProps) {
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<OtpStatus>('idle')
  const [error, setError] = useState<string | undefined>()
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)

  useEffect(() => {
    if (secondsLeft <= 0) return
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [secondsLeft])

  async function verify(fullCode: string) {
    setStatus('verifying')
    setError(undefined)
    // The sweep races the real request so the animation always completes
    // before the verdict shows, however fast the backend answers.
    const [outcome] = await Promise.all([
      onVerify(fullCode).then(
        () => 'valid' as const,
        () => 'invalid' as const,
      ),
      sleep(WAVE_MS),
    ])

    if (outcome === 'valid') {
      setStatus('success')
      await sleep(SUCCESS_HOLD_MS)
      onSuccess(fullCode)
    } else {
      setStatus('error')
      setError('کد تایید نادرست است')
      await sleep(ERROR_HOLD_MS)
      setCode('')
      setStatus('idle')
    }
  }

  function handleChange(next: string) {
    if (status === 'verifying' || status === 'success') return
    if (status === 'error') {
      setStatus('idle')
      setError(undefined)
    }
    setCode(next)
    // The fifth digit doubles as the confirm button.
    if (next.length === 5) void verify(next)
  }

  function handleResend() {
    setSecondsLeft(RESEND_SECONDS)
    setCode('')
    setStatus('idle')
    setError(undefined)
    onResend()
  }

  const isPending = status === 'verifying' || status === 'success'

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-[15px] font-semibold text-text">کد تایید را وارد کنید</h2>
        <p className="text-[13px] text-text-muted">
          کد ۵ رقمی ارسال‌شده به شماره{' '}
          <span dir="ltr" className="font-medium text-text">
            {bidiIsolate(toPersianDigits(phone))}
          </span>{' '}
          را وارد کنید. با ورود آخرین رقم، کد به‌صورت خودکار بررسی می‌شود.
        </p>
      </div>

      <OtpInput
        length={5}
        value={code}
        onChange={handleChange}
        error={error}
        disabled={isPending}
        status={status}
      />

      <div className="flex items-center justify-between text-[12px]">
        <button
          type="button"
          onClick={onChangePhone}
          className="font-medium text-text-muted hover:text-text hover:underline"
        >
          ویرایش شماره موبایل
        </button>

        {secondsLeft > 0 ? (
          <span className="text-text-subtle">
            ارسال مجدد کد تا {toPersianDigits(secondsLeft)} ثانیه دیگر
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="font-medium text-blue-deep hover:underline"
          >
            ارسال مجدد کد
          </button>
        )}
      </div>
    </div>
  )
}
