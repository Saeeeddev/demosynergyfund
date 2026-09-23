'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'

// Step 3 shared by Register + Forgot-password: choose (or reset) a password.
// UI-only for now — see AUTH.md / REALWORLD_API.md for what a real submit needs.

interface FormValues {
  password: string
  confirmPassword: string
}

interface PasswordStepProps {
  title: string
  submitLabel: string
  onSubmit: (password: string) => Promise<void> | void
}

export function PasswordStep({ title, submitLabel, onSubmit }: PasswordStepProps) {
  const [isPending, setIsPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onSubmit' })

  const submit = async (data: FormValues) => {
    setIsPending(true)
    try {
      await onSubmit(data.password)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-5">
      <h2 className="text-[15px] font-semibold text-text">{title}</h2>

      <Input
        label="رمز عبور جدید"
        placeholder="حداقل ۸ کاراکتر"
        type={showPassword ? 'text' : 'password'}
        autoComplete="new-password"
        error={
          errors.password
            ? errors.password.type === 'minLength'
              ? 'رمز عبور باید حداقل ۸ کاراکتر باشد'
              : 'رمز عبور الزامی است'
            : undefined
        }
        endAdornment={
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'پنهان کردن رمز عبور' : 'نمایش رمز عبور'}
            className="flex items-center justify-center w-9 h-9 rounded-md text-text-muted hover:text-text hover:bg-hover transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        }
        {...register('password', { required: true, minLength: 8 })}
      />

      <Input
        label="تکرار رمز عبور"
        placeholder="رمز عبور را دوباره وارد کنید"
        type={showPassword ? 'text' : 'password'}
        autoComplete="new-password"
        error={
          errors.confirmPassword
            ? 'رمز عبور و تکرار آن یکسان نیستند'
            : undefined
        }
        {...register('confirmPassword', {
          required: true,
          validate: (value) => value === getValues('password'),
        })}
      />

      <Button
        variant="primary"
        size="wide"
        type="submit"
        fullWidth
        disabled={isPending}
        icon={isPending ? <Spinner size={18} /> : undefined}
      >
        {isPending ? 'در حال ثبت…' : submitLabel}
      </Button>
    </form>
  )
}
