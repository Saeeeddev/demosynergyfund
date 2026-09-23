'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useMarkInvestmentPromptSeen } from '@/lib/hooks/useAuth'

// Centered, bold welcome popup for a first-time investor (no holdings yet).
// Shown exactly once per account, ever — the parent only sets `shouldShow`
// while `!user.hasSeenInvestmentPrompt`, and the moment this mounts open it
// fires InvestmentPromptSeenView so the flag flips server-side and it never
// shows again on any future login, regardless of how it's dismissed (X,
// backdrop, "بعداً", or the tab just being closed).

interface FirstInvestmentModalProps {
  /** Only meaningful once the dashboard summary + user have actually loaded. */
  shouldShow: boolean
}

export function FirstInvestmentModal({ shouldShow }: FirstInvestmentModalProps) {
  const router = useRouter()
  const markSeen = useMarkInvestmentPromptSeen()
  // Latches true the first time shouldShow is true and never resets for this
  // mount. Necessary because marking it seen updates the `me` cache, which
  // flips the parent's `shouldShow` back to false — without the latch that
  // would close the modal itself the instant it opened.
  const [hasOpened, setHasOpened] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const open = hasOpened && !dismissed

  useEffect(() => {
    if (shouldShow && !hasOpened) setHasOpened(true)
  }, [shouldShow, hasOpened])

  useEffect(() => {
    if (!hasOpened) return
    markSeen.mutate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasOpened])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  function close() {
    setDismissed(true)
  }

  function goInvest() {
    close()
    router.push('/marketplace')
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={close} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="اولین سرمایه‌گذاری شما"
        className="relative bg-surface rounded-card shadow-[var(--shadow-pop)] w-full max-w-md p-6 flex flex-col items-center gap-4 text-center"
      >
        <button
          type="button"
          onClick={close}
          aria-label="بستن"
          className="absolute top-3 left-3 flex items-center justify-center w-8 h-8 rounded-md text-text-muted hover:bg-hover hover:text-text transition-colors"
        >
          <X size={18} />
        </button>

        <div className="w-16 h-16 rounded-pill bg-green-tint flex items-center justify-center">
          <Sparkles size={30} className="text-green-base" />
        </div>

        <p className="text-[18px] font-bold text-text leading-relaxed">
          هنوز هیچ سرمایه‌گذاری‌ای ثبت نکرده‌اید!
        </p>
        <p className="text-[14px] text-text-muted">
          همین حالا اولین فرصت سرمایه‌گذاری خود را در نیروگاه‌های خورشیدی سینرژی انتخاب کنید.
        </p>

        <div className="flex flex-col gap-2 w-full mt-2">
          <Button variant="primary" size="wide" fullWidth onClick={goInvest}>
            مشاهده فرصت‌های سرمایه‌گذاری
          </Button>
          <Button variant="ghost" size="wide" fullWidth onClick={close}>
            بعداً
          </Button>
        </div>
      </div>
    </div>
  )
}
