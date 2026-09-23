'use client'

// برداشت وجه — withdraw drawer. The destination is chosen from the user's own
// saved cards (added in Settings), not typed each time: a withdrawal must go to
// a card that belongs to the user, and the IBAN behind it is what the transfer
// actually uses. If they have no saved card yet, we send them to add one.

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Drawer } from '@/components/ui/Drawer'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Dropdown } from '@/components/ui/Dropdown'
import { formatToman } from '@/lib/utils/currency'
import { groupDigits, onlyDigits, toPersianDigits } from '@/lib/utils/numbers'
import { toast } from '@/lib/toast'
import { useCashConfig, useWithdraw } from '@/lib/hooks/useCash'

const IBAN_PATTERN = /^IR\d{24}$/

interface WithdrawPanelProps {
  open: boolean
  onClose: () => void
  balance: number
}

// "بانک ملت — کارت ····۷۸۹۳"
function cardLabel(bankName: string, cardNumber: string): string {
  const last4 = onlyDigits(cardNumber).slice(-4)
  return `${bankName} — کارت ${toPersianDigits(`····${last4}`)}`
}

export function WithdrawPanel({ open, onClose, balance }: WithdrawPanelProps) {
  const router = useRouter()
  const { data: config } = useCashConfig()
  const recentAmounts = config?.recentWithdrawAmounts ?? []
  const savedCards = config?.userAccounts ?? []
  const withdrawMutation = useWithdraw()

  const [cardId, setCardId] = useState('')
  const [amount, setAmount] = useState('')

  // Default to the first saved card once the config loads.
  useEffect(() => {
    if (open && savedCards.length > 0 && !cardId) setCardId(savedCards[0].id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, savedCards.length])

  const selectedCard = savedCards.find((c) => c.id === cardId) ?? savedCards[0]
  const numAmount = parseFloat(onlyDigits(amount)) || 0

  async function handleSubmit() {
    const ibanValue = (selectedCard?.iban ?? '').trim().toUpperCase()
    if (!selectedCard || !IBAN_PATTERN.test(ibanValue)) {
      toast.error('لطفاً یک کارت مقصد معتبر انتخاب کنید.')
      return
    }
    if (numAmount <= 0) {
      toast.error('لطفاً مبلغ برداشت را وارد کنید.')
      return
    }
    if (numAmount > balance) {
      toast.error('مبلغ برداشت بیشتر از موجودی نقدی است.')
      return
    }
    try {
      await withdrawMutation.mutateAsync({ amount: numAmount, iban: ibanValue })
      toast.success('درخواست برداشت شما ثبت شد.')
      onClose()
    } catch {
      // Global mutation error toast handles it (app/providers.tsx)
    }
  }

  return (
    <Drawer open={open} onClose={onClose} title="برداشت وجه">
      <div className="flex flex-col gap-5">
        {/* Destination — pick one of the user's own saved cards */}
        {savedCards.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-text-muted">کارت مقصد</span>
            <Dropdown
              fullWidth
              value={cardId || savedCards[0].id}
              onChange={setCardId}
              options={savedCards.map((c) => ({ value: c.id, label: cardLabel(c.bankName, c.cardNumber) }))}
            />
            <span className="text-[12px] text-text-subtle">
              وجه فقط به کارت‌های ثبت‌شده به نام خودتان واریز می‌شود.
            </span>
          </div>
        ) : (
          <div className="rounded-md border border-border bg-surface-2 p-4 text-[13px] text-text-muted leading-relaxed">
            <p className="mb-2">هنوز کارتی ثبت نکرده‌اید. برای برداشت، ابتدا یک کارت به نام خودتان اضافه کنید.</p>
            <Button
              variant="secondary"
              size="compact"
              onClick={() => {
                onClose()
                router.push('/settings')
              }}
            >
              افزودن کارت
            </Button>
          </div>
        )}

        {/* Amount */}
        <Input
          label="مبلغ (ریال)"
          dir="ltr"
          inputMode="numeric"
          placeholder="مبلغ را وارد کنید"
          value={groupDigits(amount)}
          onChange={(e) => setAmount(onlyDigits(e.target.value))}
          helper={`موجودی نقدی: ${formatToman(balance)}`}
        />

        {/* Recent amounts */}
        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-medium text-text-muted">تراکنش‌های اخیر:</span>
          <div className="flex flex-wrap gap-2">
            {recentAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setAmount(String(amt))}
                className="rounded-pill border border-border bg-surface px-3 py-1.5 text-[12px] font-medium text-text-2 tabular-nums hover:bg-hover transition-colors"
              >
                {formatToman(amt)}
              </button>
            ))}
          </div>
        </div>

        <Button
          variant="primary"
          size="wide"
          fullWidth
          onClick={handleSubmit}
          disabled={withdrawMutation.isPending || savedCards.length === 0}
        >
          {withdrawMutation.isPending ? 'در حال ثبت…' : 'ثبت درخواست'}
        </Button>
      </div>
    </Drawer>
  )
}
