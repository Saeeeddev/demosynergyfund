'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PhoneStep } from '@/components/auth/PhoneStep'
import { OtpStep } from '@/components/auth/OtpStep'
import { NameStep } from '@/components/auth/NameStep'
import { PasswordStep } from '@/components/auth/PasswordStep'
import { toast, toFriendlyMessage } from '@/lib/toast'
import { apiOtpSend, apiOtpVerify, apiRegister } from '@/lib/api/auth'
import { syncSessionFromBackend } from '@/lib/auth/backend-session'

// [F §0.4] Register — phone → SMS code → name → set password. Real backend
// flow (AUTH.md "Register & Forgot Password → real SMS OTP"): send/verify go
// to /auth/otp/*, the final step spends the code via /auth/register (which
// requires first_name/last_name — RegisterSerializer). The backend opens a
// session for the new account, so on success we sync the middleware gate
// cookie and land straight in the dashboard — no redundant second login.

export function RegisterForm() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  async function handleSendCode(value: string) {
    try {
      await apiOtpSend(value, 'register')
      setPhone(value)
      toast.success('کد تایید از طریق پیامک ارسال شد.')
      setStep(2)
    } catch (error) {
      toast.error(toFriendlyMessage(error))
    }
  }

  function handleResend() {
    apiOtpSend(phone, 'register')
      .then(() => toast.success('کد تایید دوباره ارسال شد.'))
      .catch((error) => toast.error(toFriendlyMessage(error)))
  }

  function handleName(first: string, last: string) {
    setFirstName(first)
    setLastName(last)
    setStep(4)
  }

  async function handleSetPassword(password: string) {
    try {
      await apiRegister({ phone, code, password, first_name: firstName, last_name: lastName })
      await syncSessionFromBackend()
      toast.success('ثبت‌نام با موفقیت انجام شد. خوش آمدید!')
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      toast.error(toFriendlyMessage(error))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {step === 1 && (
        <PhoneStep
          title="شماره موبایل خود را وارد کنید"
          subtitle="کد تایید از طریق پیامک برای شما ارسال می‌شود."
          submitLabel="ارسال کد تایید"
          onSubmit={handleSendCode}
        />
      )}

      {step === 2 && (
        <OtpStep
          phone={phone}
          onVerify={(value) => apiOtpVerify(phone, 'register', value)}
          onSuccess={(value) => {
            setCode(value)
            setStep(3)
          }}
          onResend={handleResend}
          onChangePhone={() => setStep(1)}
        />
      )}

      {step === 3 && <NameStep onSubmit={handleName} />}

      {step === 4 && (
        <PasswordStep
          title="یک رمز عبور برای حساب خود تعیین کنید"
          submitLabel="تکمیل ثبت‌نام"
          onSubmit={handleSetPassword}
        />
      )}
    </div>
  )
}
