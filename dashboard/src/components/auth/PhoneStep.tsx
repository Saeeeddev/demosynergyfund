'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'

// Step 1 shared by Register + Forgot-password: collect a phone number and
// request an SMS code for it. UI-only for now — see AUTH.md.

interface FormValues {
  phone: string
}

interface PhoneStepProps {
  title: string
  subtitle: string
  submitLabel: string
  onSubmit: (phone: string) => Promise<void> | void
}

export function PhoneStep({ title, subtitle, submitLabel, onSubmit }: PhoneStepProps) {
  const [isPending, setIsPending] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onSubmit' })

  const submit = async (data: FormValues) => {
    setIsPending(true)
    try {
      await onSubmit(data.phone)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-[15px] font-semibold text-text">{title}</h2>
        <p className="text-[13px] text-text-muted">{subtitle}</p>
      </div>

      <Input
        label="شماره موبایل"
        placeholder="۰۹xxxxxxxxx"
        type="tel"
        dir="ltr"
        autoComplete="tel"
        inputMode="numeric"
        error={
          errors.phone
            ? errors.phone.type === 'pattern'
              ? 'شماره موبایل معتبر نیست'
              : 'شماره موبایل الزامی است'
            : undefined
        }
        {...register('phone', { required: true, pattern: /^09\d{9}$/ })}
      />

      <Button
        variant="primary"
        size="wide"
        type="submit"
        fullWidth
        disabled={isPending}
        icon={isPending ? <Spinner size={18} /> : undefined}
      >
        {isPending ? 'در حال ارسال…' : submitLabel}
      </Button>
    </form>
  )
}
