// [D §9.20] Support skeleton — shape-matched to page.tsx's 3-col layout
// (new-ticket form start column, ticket list end column)

import { Headset } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'

export default function SupportLoading() {
  return (
    <div className="flex flex-col gap-4 p-3 lg:gap-5 lg:p-3">
      <PageHeader
        className="hidden lg:flex"
        icon={<Headset size={22} strokeWidth={1.75} />}
        title="پشتیبانی"
        subtitle="گفتگو با پشتیبانی و پیگیری تیکت‌های شما"
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5 lg:items-start">
        {/* Start column — new-ticket form */}
        <div className="lg:col-span-1">
          <Card className="flex flex-col gap-3">
            <div className="skeleton h-10 w-full rounded-md" />
            <div className="skeleton h-10 w-full rounded-md" />
            <div className="skeleton h-24 w-full rounded-md" />
            <div className="skeleton h-11 w-full rounded-md" />
          </Card>
        </div>

        {/* End column — ticket list */}
        <div className="lg:col-span-2">
          <Card className="flex flex-col h-[70vh] lg:h-[620px] gap-3">
            <div className="skeleton h-5 w-28 rounded-md" />
            <Skeleton className="h-16 rounded-md" count={4} />
          </Card>
        </div>
      </div>
    </div>
  )
}
