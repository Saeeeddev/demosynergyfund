'use client'

// واریز وجه — deposit is receipt-only for now: the user enters the amount, the
// receipt (فیش واریزی) number/date/destination, uploads the receipt image and
// submits. Nothing posts automatically — an admin matches it against the bank
// statement and approves it by hand in the back office.
//
// The instant online-gateway ("واریز آنی") path is deferred: the provider is
// left wired in the backend (POST /cash/deposit/gateway) but is intentionally
// not surfaced here yet. Re-add a mode toggle when the gateway goes live.

import { useState } from 'react'
import { Drawer } from '@/components/ui/Drawer'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Dropdown } from '@/components/ui/Dropdown'
import { JalaliDateInput } from '@/components/ui/JalaliDateInput'
import { UploadCloud } from 'lucide-react'
import { groupDigits, onlyDigits } from '@/lib/utils/numbers'
import { toast } from '@/lib/toast'
import { useCashConfig, useDepositBankTransfer } from '@/lib/hooks/useCash'
import { DEMO_MODE } from '@/lib/demo/config'

// Today, as the Gregorian ISO date JalaliDateInput expects — local time, not
// toISOString() (which is UTC and can land on the wrong day near midnight).
function todayIso(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

interface DepositPanelProps {
  open: boolean
  onClose: () => void
  /** prefill the amount (e.g. the shortfall when redirected from Invest) */
  initialAmount?: string
}

export function DepositPanel({ open, onClose, initialAmount }: DepositPanelProps) {
  const { data: config } = useCashConfig()
  // "به کدام حساب واریز کرده‌اید؟" = which PLATFORM account the receipt was paid to.
  const platformAccounts = config?.platformAccounts ?? []
  const bankTransferMutation = useDepositBankTransfer()

  const [amount, setAmount] = useState(initialAmount ?? '')
  const [receiptNo, setReceiptNo] = useState('')
  const [receiptDate, setReceiptDate] = useState(todayIso())
  const [account, setAccount] = useState('')
  const [fileName, setFileName] = useState('')
  const [receiptFile, setReceiptFile] = useState<File | null>(null)

  const accountValue = account || platformAccounts[0]?.id || ''
  const numAmount = parseInt(onlyDigits(amount), 10) || 0
  const amountValid = numAmount > 0

  async function handleReceipt() {
    if (!amountValid || !receiptNo || !receiptDate || !receiptFile) {
      toast.error('مبلغ، شماره فیش، تاریخ فیش و تصویر فیش را کامل کنید.')
      return
    }
    try {
      await bankTransferMutation.mutateAsync({ amount: numAmount, receipt: receiptFile })
      toast.success(
        DEMO_MODE
          ? 'واریز آزمایشی ثبت شد و موجودی دمو افزایش یافت.'
          : 'فیش واریزی ثبت شد و پس از بررسی و تأیید، به حساب شما اضافه می‌شود.',
      )
      onClose()
    } catch {
      // Global mutation error toast handles it (app/providers.tsx)
    }
  }

  return (
    <Drawer open={open} onClose={onClose} title="واریز وجه">
      <div className="flex flex-col gap-4">
        {/* Amount — the first thing the user enters, at the top */}
        <Input
          label="مبلغ واریزی (ریال)"
          dir="ltr"
          inputMode="numeric"
          placeholder="مبلغ را وارد کنید"
          value={groupDigits(amount)}
          onChange={(e) => setAmount(onlyDigits(e.target.value))}
        />

        <Input
          label="شماره فیش"
          inputMode="numeric"
          placeholder="شماره فیش واریزی"
          value={receiptNo}
          onChange={(e) => setReceiptNo(onlyDigits(e.target.value))}
        />

        <Field label="تاریخ فیش">
          <JalaliDateInput value={receiptDate} onChange={setReceiptDate} />
        </Field>

        <Field label="به کدام حساب واریز کرده‌اید؟">
          <Dropdown
            fullWidth
            value={accountValue}
            onChange={setAccount}
            options={platformAccounts.map((a) => ({ value: a.id, label: `${a.bankName} — ${a.cardNumber}` }))}
          />
        </Field>

        {/* Receipt image upload */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium text-text-muted">بارگذاری تصویر فیش واریزی</span>
          <label className="flex items-center justify-between gap-3 rounded-md border border-dashed border-border-strong bg-surface-2 px-4 py-3 cursor-pointer hover:bg-hover transition-colors">
            <span className="text-[13px] text-text-muted truncate">
              {fileName || 'فرمت‌های مجاز: png ,jpg ,jpeg ,pdf'}
            </span>
            <span className="flex items-center gap-1.5 text-[13px] font-medium text-blue-deep shrink-0">
              <UploadCloud size={16} /> انتخاب تصویر
            </span>
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null
                setReceiptFile(f)
                setFileName(f?.name ?? '')
              }}
            />
          </label>
        </div>

        <div className="rounded-md bg-surface-2 border border-border p-4 text-[12px] text-text-muted leading-relaxed">
          {DEMO_MODE
            ? 'این یک واریز آزمایشی است؛ فایل ارسال نمی‌شود و فقط موجودی محلی مرورگر تغییر می‌کند.'
            : 'واریز شما پس از بررسی و تأیید توسط تیم پشتیبانی به موجودی حساب شما اضافه می‌شود. این فرآیند ممکن است کمی زمان ببرد.'}
        </div>

        <Button
          variant="primary"
          size="wide"
          fullWidth
          onClick={handleReceipt}
          disabled={bankTransferMutation.isPending}
        >
          {bankTransferMutation.isPending ? 'در حال ثبت…' : 'ثبت فیش واریزی'}
        </Button>
      </div>
    </Drawer>
  )
}

/* ── small local helpers ─────────────────────────────────────────────── */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-text-muted">{label}</span>
      {children}
    </div>
  )
}
