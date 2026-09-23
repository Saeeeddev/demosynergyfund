'use client'

// [F §7 Tab1] Verification status card — purple badge + link to /verification
// [D §11] Purple special accent for verification

import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react'
import { useMe } from '@/lib/hooks/useAuth'
import type { User } from '@/lib/schemas/user'

const STATUS_CONFIG: Record<User['verificationStatus'], {
  label: string
  icon: typeof ShieldCheck
  classes: string
}> = {
  verified: {
    label: 'تأیید شده',
    icon: ShieldCheck,
    classes: 'bg-green-tint text-green-deep',
  },
  pending: {
    label: 'در انتظار تأیید',
    icon: ShieldAlert,
    classes: 'bg-gold-tint text-gold-deep',
  },
  rejected: {
    label: 'رد شده',
    icon: ShieldX,
    classes: 'bg-red-tint text-red-deep',
  },
}

export function VerificationStatusCard() {
  const { data: user, isLoading } = useMe()
  const status = user?.verificationStatus ?? 'pending'
  const { label, icon: Icon, classes } = STATUS_CONFIG[status]

  return (
    <Card className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-[15px] font-semibold text-text">وضعیت احراز هویت</h3>
        <p className="text-[13px] text-text-muted">
          برای استفاده از همه امکانات پلتفرم، هویت خود را تأیید کنید.
        </p>
        {isLoading ? (
          <Skeleton className="h-7 w-32 rounded-pill" />
        ) : (
          <div className={`inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-[12px] font-semibold w-fit ${classes}`}>
            <Icon size={14} />
            <span>{label}</span>
          </div>
        )}
      </div>

      <Link
        href="/verification"
        className="shrink-0 flex items-center gap-1 px-4 py-2 rounded-md border border-border text-[13px] font-medium text-text-2 hover:bg-hover transition-colors min-h-[44px]"
      >
        {status === 'verified' ? 'مشاهده' : 'تأیید هویت'}
      </Link>
    </Card>
  )
}
