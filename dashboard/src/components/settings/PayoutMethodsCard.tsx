'use client'

// [F §7 Tab1] Payout methods management card
// Shows current payout method(s) with option to edit

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { AddPaymentMethodPanel } from '@/components/dashboard/AddPaymentMethodPanel'
import { Landmark, Wallet, ChevronLeft } from 'lucide-react'
import { usePayoutMethod } from '@/lib/hooks/usePayouts'
import type { PayoutMethod } from '@/lib/schemas/payout'

const TYPE_ICON = {
  bank: Landmark,
  platform: Wallet,
}

const TYPE_LABEL = {
  bank: 'حساب بانکی',
  platform: 'کیف پول پلتفرم',
}

function MethodRow({ method }: { method: PayoutMethod }) {
  const Icon = TYPE_ICON[method.type]
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      <div className="w-10 h-10 rounded-chip bg-surface-2 flex items-center justify-center shrink-0 text-text-muted">
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-medium text-text">{method.name}</p>
        <p className="text-[12px] text-text-muted tabular-nums">{method.details}</p>
      </div>
      {method.isDefault && (
        <span className="text-[11px] font-semibold bg-green-tint text-green-deep rounded-pill px-2 py-0.5 shrink-0">
          پیش‌فرض
        </span>
      )}
      <span className="text-[12px] text-text-muted shrink-0">{TYPE_LABEL[method.type]}</span>
      <ChevronLeft size={16} className="text-text-muted shrink-0" />
    </div>
  )
}

export function PayoutMethodsCard() {
  const { data: method, isLoading } = usePayoutMethod()
  const [addOpen, setAddOpen] = useState(false)

  return (
    <>
      <Card className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-text">روش‌های پرداخت</h3>
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="text-[13px] text-blue-base hover:underline min-h-[44px] px-1"
          >
            + افزودن روش جدید
          </button>
        </div>

        {isLoading && (
          <div className="flex flex-col gap-2">
            <div className="skeleton h-14 rounded-md" />
            <div className="skeleton h-14 rounded-md" />
          </div>
        )}

        {!isLoading && !method && (
          <p className="text-[14px] text-text-muted py-4 text-center">
            هنوز روش پرداختی اضافه نشده است
          </p>
        )}

        {!isLoading && method && <MethodRow method={method} />}
      </Card>
      <AddPaymentMethodPanel open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  )
}
