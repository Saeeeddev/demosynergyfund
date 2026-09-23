'use client'

import Link from 'next/link'
import { AlertTriangle, ArrowLeft, RotateCcw } from 'lucide-react'

export function LoginForm() {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-card border border-amber-300 bg-amber-50 p-4 text-start">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 shrink-0 text-amber-700" size={20} />
          <div>
            <p className="text-[14px] font-semibold text-amber-900">در حال به‌روزرسانی هستیم</p>
            <p className="mt-1 text-[13px] leading-6 text-amber-800">
              ورود به حساب‌های واقعی موقتاً غیرفعال است. می‌توانید در حالت دمو ادامه دهید و داشبورد را با اطلاعات آزمایشی بررسی کنید. هیچ پرداخت یا عملیات مالی واقعی انجام نمی‌شود.
            </p>
          </div>
        </div>
      </div>

      <Link
        href="/dashboard"
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-pill bg-blue-base px-6 text-[14px] font-semibold text-white transition-[transform,opacity] hover:opacity-90 active:scale-[0.99]"
      >
        ادامه در حالت دمو (مهمان)
        <ArrowLeft size={18} aria-hidden="true" />
      </Link>

      <p className="flex items-center justify-center gap-2 text-center text-[12px] leading-6 text-text-muted">
        <RotateCcw size={15} aria-hidden="true" />
        اطلاعات دمو را هر زمان می‌توانید از داخل داشبورد بازنشانی کنید.
      </p>
    </div>
  )
}
