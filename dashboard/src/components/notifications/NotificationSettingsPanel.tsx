'use client'

// [F §8] Notification settings — per-type toggles
// [M §6.11] Phone: below list or behind expander; toggles ≥44px

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface ToggleRowProps {
  label: string
  description: string
  enabled: boolean
  onChange: (v: boolean) => void
}

function ToggleRow({ label, description, enabled, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0">
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[14px] font-medium text-text">{label}</span>
        <span className="text-[12px] text-text-muted">{description}</span>
      </div>
      {/* Toggle — ≥44px [M §6.11] */}
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className="shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
      >
        <span
          className={cn(
            'relative inline-flex h-6 w-11 rounded-pill transition-colors duration-200',
            enabled ? 'bg-green-base' : 'bg-border-strong',
          )}
        >
          <span
            className={cn(
              'absolute top-[2px] h-5 w-5 rounded-pill bg-surface shadow transition-all duration-200',
              enabled ? 'end-[2px]' : 'start-[2px]',
            )}
          />
        </span>
      </button>
    </div>
  )
}

export function NotificationSettingsPanel() {
  const [payoutEnabled, setPayoutEnabled] = useState(true)
  const [performanceEnabled, setPerformanceEnabled] = useState(true)
  const [expanded, setExpanded] = useState(false)

  const content = (
    <div className="flex flex-col">
      <ToggleRow
        label="اعلان‌های پرداخت"
        description="هنگام دریافت سود یا پرداخت جدید اطلاع‌رسانی شوید"
        enabled={payoutEnabled}
        onChange={setPayoutEnabled}
      />
      <ToggleRow
        label="اعلان‌های عملکرد دارایی"
        description="تغییرات قابل توجه در ارزش سبد سرمایه‌گذاری"
        enabled={performanceEnabled}
        onChange={setPerformanceEnabled}
      />
    </div>
  )

  return (
    <>
      {/* Desktop: always expanded card */}
      <Card className="hidden md:flex flex-col gap-3">
        <h3 className="text-[15px] font-semibold text-text">تنظیمات اعلان‌ها</h3>
        {content}
      </Card>

      {/* Mobile: collapsible expander [M §6.11] */}
      <Card className="md:hidden flex flex-col">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center justify-between w-full text-start py-1"
          aria-expanded={expanded}
        >
          <h3 className="text-[15px] font-semibold text-text">تنظیمات اعلان‌ها</h3>
          {expanded
            ? <ChevronUp size={18} className="text-text-muted shrink-0" />
            : <ChevronDown size={18} className="text-text-muted shrink-0" />}
        </button>
        {expanded && <div className="mt-2">{content}</div>}
      </Card>
    </>
  )
}
