'use client'

// [F §7] Settings page — 2 tabs: Account & Identity / Security & Access
// [M §6.10] Phone: scrollable underline tab strip

import { useState } from 'react'
import { Settings } from 'lucide-react'
import { Tabs } from '@/components/ui/Tabs'
import { PageHeader } from '@/components/ui/PageHeader'
import { VerificationStatusCard } from '@/components/settings/VerificationStatusCard'
import { PasswordCard } from '@/components/settings/PasswordCard'
import { TwoFactorCard } from '@/components/settings/TwoFactorCard'
import { PaymentMethodsCard } from '@/components/dashboard/PaymentMethodsCard'

const TABS = [
  { value: 'account', label: 'حساب و هویت' },
  { value: 'security', label: 'امنیت و دسترسی' },
]

export default function SettingsPage() {
  const [tab, setTab] = useState('account')

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-5 lg:p-5">

      {/* asas-style page header — desktop only */}
      <PageHeader
        className="hidden lg:flex"
        icon={<Settings size={22} strokeWidth={1.75} />}
        title="تنظیمات"
        subtitle="حساب کاربری، هویت، امنیت و دسترسی"
      />

      {/* Underline tabs — scrollable strip on phone [M §6.10, D §9.7] */}
      <Tabs tabs={TABS} value={tab} onChange={setTab} accent="green" />

      {/* Tab 1 — Account & Identity [F §7 Tab1] — two cards side by side on desktop */}
      {tab === 'account' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          <VerificationStatusCard />
          {/* Same payment-methods card as the dashboard (single shared component) */}
          <PaymentMethodsCard />
        </div>
      )}

      {/* Tab 2 — Security & Access [F §7 Tab2] — two cards side by side on desktop */}
      {tab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          <PasswordCard />
          <TwoFactorCard />
        </div>
      )}

    </div>
  )
}
