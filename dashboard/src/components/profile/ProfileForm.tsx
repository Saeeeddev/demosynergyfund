'use client'

// [F §9] Profile information settings
// [M §6.12] Single-column form, inputs 48px, labels above, full-width Primary submit
// [D §9.18] Input component with label above + helper/error below

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { User, UserIcon } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { useMe, useUpdateProfile } from '@/lib/hooks/useAuth'

interface ProfileFields {
  firstName: string
  lastName: string
  email: string
}

export function ProfileForm() {
  const { data: user, isLoading } = useMe()
  const updateMutation = useUpdateProfile()
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFields>()

  // Pre-fill form when user data arrives
  useEffect(() => {
    if (user) {
      reset({ firstName: user.first_name ?? '', lastName: user.last_name ?? '', email: user.email })
    }
  }, [user, reset])

  async function onSubmit(data: ProfileFields) {
    try {
      await updateMutation.mutateAsync({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      // Global mutation error toast handles it (app/providers.tsx)
    }
  }

  if (isLoading) {
    return (
      <Card className="flex flex-col gap-4">
        <Skeleton className="h-6 w-36 rounded-md" />
        <Skeleton className="h-12 rounded-md" count={4} />
      </Card>
    )
  }

  return (
    <Card className="flex flex-col gap-5">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-10 h-10 rounded-chip bg-blue-tint text-blue-deep shrink-0">
          <User size={20} />
        </span>
        <div>
          <h2 className="text-[15px] font-semibold text-text">اطلاعات پروفایل</h2>
          <p className="text-[12px] text-text-muted mt-0.5">اطلاعات نمایش‌داده‌شده در پنل کاربری</p>
        </div>
      </div>

      {/* Avatar placeholder */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-pill bg-gray-tint flex items-center justify-center shrink-0">
          <UserIcon size={32} className="text-text-muted" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[14px] font-medium text-text">{user?.name}</span>
          <span className="text-[12px] text-text-muted">{user?.role}</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <Input
          label="نام"
          placeholder="نام خود را وارد کنید"
          error={errors.firstName?.message}
          {...register('firstName', { required: 'نام الزامی است' })}
        />

        <Input
          label="نام خانوادگی"
          placeholder="نام خانوادگی خود را وارد کنید"
          error={errors.lastName?.message}
          {...register('lastName', { required: 'نام خانوادگی الزامی است' })}
        />

        <Input
          label="ایمیل"
          type="email"
          inputMode="email"
          placeholder="example@email.com"
          dir="ltr"
          error={errors.email?.message}
          {...register('email', {
            required: 'ایمیل الزامی است',
            pattern: { value: /\S+@\S+\.\S+/, message: 'ایمیل معتبر نیست' },
          })}
        />

        {/* Phone is the account identity — not editable from this form */}
        <Input
          label="شماره موبایل"
          type="tel"
          dir="ltr"
          value={user?.phone ?? ''}
          readOnly
          disabled
        />

        {/* Success message */}
        {saved && (
          <p className="text-[13px] text-green-deep bg-green-tint rounded-md px-3 py-2">
            اطلاعات با موفقیت ذخیره شد
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="wide"
          fullWidth
          disabled={isSubmitting || updateMutation.isPending}
        >
          {isSubmitting || updateMutation.isPending ? 'در حال ذخیره…' : 'ذخیره تغییرات'}
        </Button>
      </form>
    </Card>
  )
}
