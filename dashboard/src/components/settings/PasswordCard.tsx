'use client'

// [F §7 Tab2] Password management — change-password form
// [D §9.18] Form with label-above inputs, react-hook-form

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface PasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

function PasswordInput({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  const [show, setShow] = useState(false)
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-text-muted">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          className={cn(
            'w-full h-12 rounded-md border bg-surface text-[14px] text-text',
            'ps-4 pe-10',
            'focus:outline-2 focus:outline-border-strong',
            error ? 'border-red-base' : 'border-border',
          )}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow((v) => !v)}
          className="absolute end-2 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="text-[12px] text-red-base">{error}</p>}
    </div>
  )
}

export function PasswordCard() {
  const [success, setSuccess] = useState(false)
  const { register, handleSubmit, getValues, formState: { errors }, reset } = useForm<PasswordForm>()

  const onSubmit = async () => {
    // Guest demo: validate the form and demonstrate feedback without changing credentials.
    await new Promise((r) => setTimeout(r, 500))
    setSuccess(true)
    reset()
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <Card className="flex flex-col gap-4">
      <h3 className="text-[15px] font-semibold text-text">تغییر رمز عبور</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <PasswordInput
          label="رمز عبور فعلی"
          placeholder="رمز عبور فعلی را وارد کنید"
          error={errors.currentPassword?.message}
          {...register('currentPassword', { required: 'این فیلد الزامی است' })}
        />
        <PasswordInput
          label="رمز عبور جدید"
          placeholder="رمز عبور جدید را وارد کنید"
          error={errors.newPassword?.message}
          {...register('newPassword', {
            required: 'این فیلد الزامی است',
            minLength: { value: 8, message: 'رمز عبور باید حداقل ۸ کاراکتر باشد' },
          })}
        />
        <PasswordInput
          label="تکرار رمز عبور جدید"
          placeholder="رمز عبور جدید را تکرار کنید"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'این فیلد الزامی است',
            validate: (v) => v === getValues('newPassword') || 'رمز عبور با تکرار آن مطابقت ندارد',
          })}
        />

        {success && (
          <p className="text-[13px] text-green-deep bg-green-tint rounded-md px-3 py-2">
            نمایش موفق بود؛ در حالت مهمان هیچ رمزی تغییر نمی‌کند.
          </p>
        )}

        <Button type="submit" variant="primary" className="min-h-[44px]">
          ذخیره تغییرات
        </Button>
      </form>
    </Card>
  )
}
