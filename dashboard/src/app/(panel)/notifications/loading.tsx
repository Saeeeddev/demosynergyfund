// [D §9.20] Notifications skeleton — shape-matched to page.tsx's actual layout
// Static chrome (back button, settings panel) renders immediately; only the list is skeletoned.

import { BackButton } from '@/components/ui/BackButton'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { NotificationSettingsPanel } from '@/components/notifications/NotificationSettingsPanel'

export default function NotificationsLoading() {
  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-5 lg:p-5">
      <BackButton href="/dashboard" label="بازگشت به داشبورد" />

      <Card className="flex flex-col">
        <div className="flex items-center justify-between px-4 py-4 border-b border-border gap-3">
          <h2 className="text-[15px] font-semibold text-text">اعلان‌ها</h2>
        </div>
        <div className="flex flex-col p-4 gap-3">
          <Skeleton className="h-16 rounded-md" count={5} />
        </div>
      </Card>

      <NotificationSettingsPanel />
    </div>
  )
}
