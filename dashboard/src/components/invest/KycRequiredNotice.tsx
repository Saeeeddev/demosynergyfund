'use client'

// خرید سهام نیازمند احراز هویت است — real-life rule: a platform cannot let
// someone buy real ownership of a solar plant before confirming who they are.
// Shown on the invest page whenever the user isn't KYC-approved yet, with
// copy that matches their actual state (never submitted / awaiting review /
// rejected) rather than one generic message.

import Link from 'next/link'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { Verification } from '@/lib/schemas/kyc'

const COPY: Record<Exclude<Verification['status'], 'approved'>, { title: string; body: string; cta: string }> = {
  not_submitted: {
    title: 'برای خرید سهام، ابتدا احراز هویت کنید',
    body: 'طبق مقررات، خرید سهام پروژه‌ها فقط برای کاربران با هویت تأییدشده امکان‌پذیر است.',
    cta: 'تکمیل احراز هویت',
  },
  pending: {
    title: 'احراز هویت شما در حال بررسی است',
    body: 'مدارک شما ارسال شده و در انتظار تأیید تیم پشتیبانی است. تا تأیید نهایی امکان خرید سهام وجود ندارد.',
    cta: 'مشاهده وضعیت احراز هویت',
  },
  rejected: {
    title: 'احراز هویت شما تأیید نشد',
    body: 'برای خرید سهام باید مدارک هویتی خود را دوباره ارسال کنید.',
    cta: 'ارسال مجدد مدارک',
  },
}

export function KycRequiredNotice({ status }: { status: Verification['status'] }) {
  if (status === 'approved') return null
  const copy = COPY[status]

  return (
    <div className="flex items-start gap-3 rounded-card border border-gold-base/40 bg-gold-tint p-4">
      <ShieldAlert size={22} className="text-gold-deep shrink-0 mt-0.5" />
      <div className="flex-1 flex flex-col gap-2">
        <div>
          <p className="text-[14px] font-semibold text-gold-deep">{copy.title}</p>
          <p className="text-[13px] text-text-2 mt-0.5">{copy.body}</p>
        </div>
        <Link href="/verification" className="self-start">
          <Button variant="secondary" size="compact">
            {copy.cta}
          </Button>
        </Link>
      </div>
    </div>
  )
}
