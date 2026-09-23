'use client'

// روش‌های پرداخت — saved bank cards / accounts used for deposit & withdraw.
// Data comes from the cash config (mock → api → hook). "افزودن" opens a drawer.

import { useState } from 'react'
import { CreditCard, Plus } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { Empty } from '@/components/ui/Empty'
import { cn } from '@/lib/utils/cn'
import { useCashConfig } from '@/lib/hooks/useCash'
import { AddPaymentMethodPanel } from './AddPaymentMethodPanel'

export function PaymentMethodsCard() {
  const { data: config, isLoading, isError, refetch } = useCashConfig()
  const [addOpen, setAddOpen] = useState(false)
  const accounts = config?.userAccounts ?? []

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[15px] font-semibold text-text">روش‌های پرداخت</h2>
        <Button
          variant="secondary"
          size="compact"
          shape="pill"
          icon={<Plus size={15} />}
          onClick={() => setAddOpen(true)}
        >
          افزودن
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-md" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState scope="inline" onRetry={() => refetch()} />
      ) : accounts.length === 0 ? (
        <Empty
          icon={<CreditCard size={36} />}
          message="هنوز روش پرداختی ثبت نکرده‌اید"
        />
      ) : (
        <div className="flex flex-col divide-y divide-border">
          {accounts.map((a) => (
            <div key={a.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <span className="flex items-center justify-center w-10 h-10 rounded-chip bg-[var(--sidebar-hover)] shrink-0">
                <CreditCard size={18} className={cn(a.brandColor)} />
              </span>
              <div className="flex-1 min-w-0">
                {/* full card number shown first/prominently */}
                <p className="text-[14px] font-semibold text-text tabular-nums truncate" dir="ltr">
                  {a.cardNumber}
                </p>
                <p className="text-[12px] text-text-muted truncate">{a.bankName}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddPaymentMethodPanel open={addOpen} onClose={() => setAddOpen(false)} />
    </Card>
  )
}
