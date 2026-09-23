'use client'

// [F §13] Verification page — real KYC flow (backend/apps/kyc/api.py):
//   not_submitted/rejected → one combined form (national ID + birth date +
//   all 3 documents, single submit) → pending → approved/rejected.
// Everything is collected on one page and sent as one action
// (useSubmitFullVerification), not a multi-step wizard.

import { useState } from 'react'
import { ShieldCheck, ShieldAlert, ShieldX, ShieldQuestion, FileText, UploadCloud, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { JalaliDateInput } from '@/components/ui/JalaliDateInput'
import { Skeleton } from '@/components/ui/Skeleton'
import { toast } from '@/lib/toast'
import { useVerification, useSubmitFullVerification } from '@/lib/hooks/useKyc'
import type { VerificationDocKind, Verification } from '@/lib/schemas/kyc'

const STATUS_CONFIG: Record<Verification['status'], {
  label: string
  description: string
  icon: typeof ShieldCheck
  badgeClasses: string
}> = {
  approved: {
    label: 'هویت تأیید شده',
    description: 'احراز هویت شما با موفقیت انجام شده است.',
    icon: ShieldCheck,
    badgeClasses: 'bg-green-tint text-green-deep',
  },
  pending: {
    label: 'در انتظار تأیید',
    description: 'مدارک شما در حال بررسی است. معمولاً این فرآیند تا ۴۸ ساعت طول می‌کشد.',
    icon: ShieldAlert,
    badgeClasses: 'bg-gold-tint text-gold-deep',
  },
  rejected: {
    label: 'رد شده',
    description: 'متأسفانه اطلاعات ارسالی تأیید نشد. لطفاً اطلاعات و مدارک خود را مجدداً ارسال کنید.',
    icon: ShieldX,
    badgeClasses: 'bg-red-tint text-red-deep',
  },
  not_submitted: {
    label: 'احراز هویت نشده',
    description: 'اطلاعات هویتی و مدارک خود را یکجا وارد و ارسال کنید.',
    icon: ShieldQuestion,
    badgeClasses: 'bg-gray-tint text-text-muted',
  },
}

const REQUIRED_DOCS: { kind: VerificationDocKind; label: string }[] = [
  { kind: 'national_card_front', label: 'روی کارت ملی' },
  { kind: 'national_card_back', label: 'پشت کارت ملی' },
  { kind: 'selfie', label: 'سلفی همراه با کارت' },
]

export function VerificationCard() {
  const { data: verification, isLoading } = useVerification()
  const submitMutation = useSubmitFullVerification()

  const [nationalId, setNationalId] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [files, setFiles] = useState<Partial<Record<VerificationDocKind, File>>>({})

  const status = verification?.status ?? 'not_submitted'
  const { label, description, icon: StatusIcon, badgeClasses } = STATUS_CONFIG[status]
  const canSubmit = status === 'not_submitted' || status === 'rejected'

  function setFile(kind: VerificationDocKind, file: File) {
    setFiles((prev) => ({ ...prev, [kind]: file }))
  }

  async function handleSubmit() {
    if (!/^\d{10}$/.test(nationalId)) {
      toast.error('کد ملی باید ۱۰ رقم باشد.')
      return
    }
    if (!birthDate) {
      toast.error('تاریخ تولد الزامی است.')
      return
    }
    const missing = REQUIRED_DOCS.filter((d) => !files[d.kind])
    if (missing.length > 0) {
      toast.error('لطفاً هر سه مدرک را انتخاب کنید.')
      return
    }
    try {
      await submitMutation.mutateAsync({
        nationalId,
        birthDate,
        documents: REQUIRED_DOCS.map((d) => ({ kind: d.kind, file: files[d.kind] as File })),
      })
      toast.success('اطلاعات و مدارک هویتی شما ارسال شد.')
    } catch {
      // Global mutation error toast handles it (app/providers.tsx)
    }
  }

  return (
    <Card className="flex flex-col gap-6 w-full">
      {/* Status header */}
      <div className="flex flex-col items-center gap-4 py-4">
        {isLoading ? (
          <>
            <Skeleton className="w-20 h-20 rounded-pill" />
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-5 w-32 rounded-md" />
              <Skeleton className="h-4 w-56 rounded-md" />
            </div>
            <Skeleton className="h-9 w-40 rounded-pill" />
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-pill bg-purple-tint flex items-center justify-center">
              <StatusIcon size={40} className="text-purple-base" />
            </div>
            <div className="text-center flex flex-col gap-1">
              <h1 className="text-[17px] font-semibold text-text">تأیید هویت</h1>
              <p className="text-[13px] text-text-muted max-w-xs">{description}</p>
              {status === 'rejected' && verification?.reject_reason && (
                <p className="text-[12px] text-red-deep">{verification.reject_reason}</p>
              )}
            </div>
            <div className={`inline-flex items-center gap-1.5 rounded-pill px-4 py-2 text-[13px] font-semibold ${badgeClasses}`}>
              <StatusIcon size={16} />
              <span>{label}</span>
            </div>
          </>
        )}
      </div>

      {/* One combined form: identity fields + all documents, single submit */}
      {!isLoading && canSubmit && (
        <div className="border-t border-border pt-5 flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-chip bg-purple-tint flex items-center justify-center shrink-0 mt-0.5">
              <FileText size={20} className="text-purple-deep" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-[14px] font-semibold text-text">اطلاعات و مدارک هویتی</h3>
              <p className="text-[13px] text-text-muted">همه موارد زیر را تکمیل و یکجا ارسال کنید.</p>
            </div>
          </div>

          <Input
            label="کد ملی"
            dir="ltr"
            inputMode="numeric"
            placeholder="۱۰ رقم"
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value.replace(/\D/g, '').slice(0, 10))}
          />
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-text-muted">تاریخ تولد</span>
            <JalaliDateInput value={birthDate} onChange={setBirthDate} />
          </div>

          <div className="flex flex-col gap-2">
            {REQUIRED_DOCS.map(({ kind, label: docLabel }) => (
              <div key={kind} className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface-2 px-4 py-3">
                <span className="text-[13px] text-text">{docLabel}</span>
                {files[kind] ? (
                  <span className="flex items-center gap-1.5 text-[12px] font-medium text-green-deep truncate max-w-[50%]">
                    <CheckCircle2 size={16} className="shrink-0" />
                    <span className="truncate">{files[kind]?.name}</span>
                  </span>
                ) : (
                  <label className="flex items-center gap-1.5 text-[13px] font-medium text-blue-deep cursor-pointer hover:underline">
                    <UploadCloud size={16} />
                    انتخاب تصویر
                    <input
                      type="file"
                      accept="image/png,image/jpeg,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) setFile(kind, file)
                      }}
                    />
                  </label>
                )}
              </div>
            ))}
          </div>

          <Button
            variant="primary"
            size="wide"
            fullWidth
            onClick={handleSubmit}
            disabled={submitMutation.isPending}
          >
            {submitMutation.isPending ? 'در حال ارسال…' : 'ارسال اطلاعات و مدارک'}
          </Button>
        </div>
      )}

      {/* Uploaded documents summary — once submitted */}
      {!isLoading && status === 'pending' && verification && verification.documents.length > 0 && (
        <div className="border-t border-border pt-5 flex flex-col gap-2">
          <h3 className="text-[13px] font-semibold text-text-muted mb-1">مدارک ارسال‌شده</h3>
          {REQUIRED_DOCS.map(({ kind, label: docLabel }) => {
            const uploaded = verification.documents.some((d) => d.kind === kind)
            return (
              <div key={kind} className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface-2 px-4 py-3">
                <span className="text-[13px] text-text">{docLabel}</span>
                {uploaded ? (
                  <span className="flex items-center gap-1.5 text-[12px] font-medium text-green-deep">
                    <CheckCircle2 size={16} /> ارسال شد
                  </span>
                ) : (
                  <span className="text-[12px] text-text-muted">—</span>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Steps guide */}
      <div className="border-t border-border pt-5">
        <h3 className="text-[13px] font-semibold text-text-muted mb-3">مراحل احراز هویت</h3>
        <ol className="flex flex-col gap-3">
          {[
            { label: 'ارسال اطلاعات و مدارک هویتی', done: status !== 'not_submitted' },
            { label: 'تأیید نهایی توسط تیم پلتفرم', done: status === 'approved' },
          ].map((step, i) => (
            <li key={i} className="flex items-center gap-3">
              <span className={`w-6 h-6 rounded-pill text-[11px] font-bold flex items-center justify-center shrink-0 ${
                step.done ? 'bg-green-base text-white' : 'bg-gray-tint text-text-muted'
              }`}>
                {step.done ? '✓' : String(i + 1)}
              </span>
              <span className={`text-[13px] ${step.done ? 'text-text line-through' : 'text-text-2'}`}>
                {step.label}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </Card>
  )
}
