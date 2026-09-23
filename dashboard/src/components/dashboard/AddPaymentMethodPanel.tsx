'use client'

// افزودن روش پرداخت — add/replace the user's saved bank card. Real backend
// (POST /payouts/method): both the card number (what the user recognizes)
// and the IBAN/شماره شبا (what an actual withdrawal transfer needs) are
// collected — same as any real banking app's "add a card" form.

import { useEffect, useState } from 'react'
import { Drawer } from '@/components/ui/Drawer'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { onlyDigits, toPersianDigits } from '@/lib/utils/numbers'
import { toast } from '@/lib/toast'
import { useSaveBankCard } from '@/lib/hooks/usePayouts'
import { useMe } from '@/lib/hooks/useAuth'

interface AddPaymentMethodPanelProps {
  open: boolean
  onClose: () => void
}

const IBAN_PATTERN = /^IR\d{24}$/

// Group a card number into ····-····-····-···· while typing.
function formatCard(raw: string): string {
  const d = onlyDigits(raw).slice(0, 16)
  return toPersianDigits(d.replace(/(.{4})/g, '$1-').replace(/-$/, ''))
}

export function AddPaymentMethodPanel({ open, onClose }: AddPaymentMethodPanelProps) {
  const { data: me } = useMe()
  const myName = (me as { name?: string } | undefined)?.name ?? ''
  const [bankName, setBankName] = useState('')
  const [card, setCard] = useState('')
  const [owner, setOwner] = useState('')
  const [iban, setIban] = useState('')
  const saveMutation = useSaveBankCard()

  // The card must belong to the user, so default the holder name to their own
  // registered name (still editable, e.g. a slightly different legal spelling).
  useEffect(() => {
    if (open && myName && !owner) setOwner(myName)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, myName])

  async function handleSubmit() {
    const cardDigits = onlyDigits(card)
    const ibanValue = iban.trim().toUpperCase()

    if (!bankName || !owner) {
      toast.error('نام بانک و نام صاحب حساب را کامل کنید.')
      return
    }
    // 16-digit format only — the card is a reference/display field; the IBAN
    // below is what a real transfer uses and stays strictly validated.
    if (cardDigits.length !== 16) {
      toast.error('شماره کارت باید ۱۶ رقم باشد.')
      return
    }
    if (!IBAN_PATTERN.test(ibanValue)) {
      toast.error('شماره شبا معتبر نیست (IR و ۲۴ رقم).')
      return
    }

    try {
      await saveMutation.mutateAsync({
        bank_name: bankName,
        account_holder_name: owner,
        card_number: cardDigits,
        iban: ibanValue,
      })
      toast.success('روش پرداخت جدید ثبت شد.')
      setBankName('')
      setCard('')
      setOwner('')
      setIban('')
      onClose()
    } catch {
      // Global mutation error toast handles it (app/providers.tsx)
    }
  }

  return (
    <Drawer open={open} onClose={onClose} title="افزودن روش پرداخت">
      <div className="flex flex-col gap-4">
        <Input
          label="نام بانک"
          placeholder="مثلاً بانک ملت"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
        />
        <Input
          label="شماره کارت"
          dir="ltr"
          inputMode="numeric"
          placeholder="۱۶ رقم"
          value={formatCard(card)}
          onChange={(e) => setCard(onlyDigits(e.target.value).slice(0, 16))}
        />
        <Input
          label="شماره شبا"
          dir="ltr"
          placeholder="IRxxxxxxxxxxxxxxxxxxxxxxxx"
          value={iban}
          onChange={(e) => setIban(e.target.value.toUpperCase())}
        />
        <Input
          label="نام صاحب حساب"
          placeholder="نام و نام خانوادگی"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          helper="کارت باید متعلق به خودتان و به نام شما باشد."
        />

        <Button
          variant="primary"
          size="wide"
          fullWidth
          onClick={handleSubmit}
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? 'در حال ثبت…' : 'افزودن حساب'}
        </Button>
      </div>
    </Drawer>
  )
}
