'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PhoneStep } from '@/components/auth/PhoneStep'
import { OtpStep } from '@/components/auth/OtpStep'
import { PasswordStep } from '@/components/auth/PasswordStep'
import { toast, toFriendlyMessage } from '@/lib/toast'
import { apiOtpSend, apiOtpVerify, apiPasswordReset } from '@/lib/api/auth'

// [F §0.5] Forgot password — phone → SMS code → set new password, all against
// the real backend (purpose "reset"). The send response is deliberately
// uniform whether or not the phone has an account (phone-enumeration answer
// per FRONTEND_SECURITY_CHECKLIST.md): we always show "code sent".

export function ForgotPasswordForm() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')

  async function handleSendCode(value: string) {
    try {
      await apiOtpSend(value, 'reset')
      setPhone(value)
      toast.success('کد تایید از طریق پیامک ارسال شد.')
      setStep(2)
    } catch (error) {
      toast.error(toFriendlyMessage(error))
    }
  }

  function handleResend() {
    apiOtpSend(phone, 'reset')
      .then(() => toast.success('کد تایید دوباره ارسال شد.'))
      .catch((error) => toast.error(toFriendlyMessage(error)))
  }

  async function handleSetPassword(password: string) {
    try {
      await apiPasswordReset({ phone, code, new_password: password })
      toast.success('رمز عبور با موفقیت تغییر کرد. اکنون وارد شوید.')
      router.push('/login')
    } catch (error) {
      toast.error(toFriendlyMessage(error))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {step === 1 && (
        <PhoneStep
          title="شماره موبایل خود را وارد کنید"
          subtitle="کد تایید به شماره موبایل حساب شما پیامک می‌شود."
          submitLabel="ارسال کد تایید"
          onSubmit={handleSendCode}
        />
      )}

      {step === 2 && (
        <OtpStep
          phone={phone}
          onVerify={(value) => apiOtpVerify(phone, 'reset', value)}
          onSuccess={(value) => {
            setCode(value)
            setStep(3)
          }}
          onResend={handleResend}
          onChangePhone={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <PasswordStep
          title="رمز عبور جدید خود را تعیین کنید"
          submitLabel="تغییر رمز عبور"
          onSubmit={handleSetPassword}
        />
      )}
    </div>
  )
}
