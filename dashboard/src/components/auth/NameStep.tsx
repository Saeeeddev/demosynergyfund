'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'

// Register-only step: name is required by the backend (RegisterSerializer),
// asked right after the phone is verified and before the password is set.

interface FormValues {
  firstName: string
  lastName: string
}

interface NameStepProps {
  onSubmit: (firstName: string, lastName: string) => Promise<void> | void
}

export function NameStep({ onSubmit }: NameStepProps) {
  const [isPending, setIsPending] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onSubmit' })

  const submit = async (data: FormValues) => {
    setIsPending(true)
    try {
      await onSubmit(data.firstName.trim(), data.lastName.trim())
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-[15px] font-semibold text-text">نام خود را وارد کنید</h2>
        <p className="text-[13px] text-text-muted">این اطلاعات روی حساب کاربری شما نمایش داده می‌شود.</p>
      </div>

      <Input
        label="نام"
        placeholder="نام خود را وارد کنید"
        error={errors.firstName ? 'نام الزامی است' : undefined}
        {...register('firstName', { required: true, minLength: 1 })}
      />

      <Input
        label="نام خانوادگی"
        placeholder="نام خانوادگی خود را وارد کنید"
        error={errors.lastName ? 'نام خانوادگی الزامی است' : undefined}
        {...register('lastName', { required: true, minLength: 1 })}
      />

      <Button
        variant="primary"
        size="wide"
        type="submit"
        fullWidth
        disabled={isPending}
        icon={isPending ? <Spinner size={18} /> : undefined}
      >
        {isPending ? 'در حال ادامه…' : 'ادامه'}
      </Button>
    </form>
  )
}
