// [D §9.20] Settings skeleton — shape-matched to page.tsx's default "account" tab
// Tab strip is skeletoned (not interactive) since it needs client-side value/onChange state.

import { Settings } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function SettingsLoading() {
  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-5 lg:p-5">
      <PageHeader
        className="hidden lg:flex"
        icon={<Settings size={22} strokeWidth={1.75} />}
        title="تنظیمات"
        subtitle="حساب کاربری، هویت، امنیت و دسترسی"
      />

      {/* Tab strip */}
      <div className="flex gap-6 border-b border-border pb-3">
        <div className="skeleton h-5 w-20 rounded-md" />
        <div className="skeleton h-5 w-24 rounded-md" />
      </div>

      {/* Default "account" tab: verification status + payment methods, side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <div className="rounded-card border border-border bg-surface p-5 flex flex-col gap-3">
          <div className="skeleton h-5 w-32 rounded-md" />
          <div className="skeleton h-4 w-56 rounded-md" />
          <div className="skeleton h-7 w-28 rounded-pill" />
        </div>
        <div className="rounded-card border border-border bg-surface p-5 flex flex-col gap-3">
          <div className="skeleton h-5 w-32 rounded-md" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-12 w-full rounded-md" />
          ))}
        </div>
      </div>
    </div>
  )
}
