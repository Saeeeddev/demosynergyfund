'use client'

// [F §2 R4] Recent Activities — buys/sells/deposits/withdrawals only
// [D §9.9] Table with type chips
// [M §6.2/7.3] Phone → stacked cards; ~5 then «نمایش بیشتر»

import { useState } from 'react'
import { Table, ActivityTypeChip, type TableColumn } from '@/components/ui/Table'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { Empty } from '@/components/ui/Empty'
import { formatToman } from '@/lib/utils/currency'
import { bidiIsolate, formatNumber } from '@/lib/utils/numbers'
import { formatJalali } from '@/lib/utils/jalali'
import { Activity as ActivityIcon } from 'lucide-react'
import type { Activity } from '@/lib/schemas/investment'

interface RecentActivitiesTableProps {
  activities: Activity[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

const INITIAL_MOBILE_COUNT = 5

const COLUMNS: TableColumn<Activity>[] = [
  {
    key: 'type',
    header: 'نوع',
    primary: true,
    render: (row) => <ActivityTypeChip type={row.type} />,
  },
  {
    key: 'description',
    header: 'شرح',
    render: (row) => (
      <span className="text-text-2 text-[14px]">{row.description}</span>
    ),
  },
  {
    key: 'shares',
    header: 'تعداد سهم (کیلو وات)',
    numeric: true,
    render: (row) =>
      row.shares ? (
        <span className="tabular-nums text-text-2">
          {bidiIsolate(formatNumber(row.shares, 1))}
        </span>
      ) : (
        <span className="text-text-subtle">—</span>
      ),
  },
  {
    key: 'amount',
    header: 'مبلغ',
    numeric: true,
    render: (row) => (
      <span className="tabular-nums text-text-2">{formatToman(row.amount)}</span>
    ),
  },
  {
    key: 'date',
    header: 'تاریخ',
    numeric: true,
    render: (row) => (
      <span className="tabular-nums text-text-muted text-[13px]">
        {formatJalali(row.date)}
      </span>
    ),
  },
]

export function RecentActivitiesTable({
  activities,
  isLoading,
  isError,
  onRetry,
}: RecentActivitiesTableProps) {
  const [showAll, setShowAll] = useState(false)

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-[15px] font-semibold text-text">فعالیت‌های اخیر</h2>

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-14 w-full rounded-md" count={5} />
        </div>
      )}

      {/* Error */}
      {!isLoading && isError && (
        <ErrorState scope="inline" onRetry={onRetry} />
      )}

      {/* Empty */}
      {!isLoading && !isError && activities.length === 0 && (
        <Empty
          icon={<ActivityIcon size={48} />}
          message="هیچ فعالیتی ثبت نشده است"
        />
      )}

      {/* Data */}
      {!isLoading && !isError && activities.length > 0 && (
        <>
          {/* Desktop: full table */}
          <div className="hidden md:block">
            <Table
              columns={COLUMNS}
              rows={activities}
              keyExtractor={(r) => r.id}
            />
          </div>

          {/* Mobile: stacked cards with show-more [M §6.2] */}
          <div className="md:hidden flex flex-col gap-3">
            {(showAll ? activities : activities.slice(0, INITIAL_MOBILE_COUNT)).map((act) => (
              <div
                key={act.id}
                className="bg-surface-2 border border-border rounded-card p-4 flex flex-col gap-2"
              >
                {/* Primary: type chip + description */}
                <div className="flex items-center gap-2">
                  <ActivityTypeChip type={act.type} />
                  <span className="text-[14px] font-medium text-text truncate">
                    {act.description}
                  </span>
                </div>
                {/* Secondary rows */}
                <div className="flex justify-between text-[13px]">
                  <span className="text-text-muted">مبلغ</span>
                  <span className="tabular-nums text-text-2">{formatToman(act.amount)}</span>
                </div>
                {act.shares != null && (
                  <div className="flex justify-between text-[13px]">
                    <span className="text-text-muted">تعداد سهم (کیلو وات)</span>
                    <span className="tabular-nums text-text-2">
                      {bidiIsolate(formatNumber(act.shares, 1))}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-[13px]">
                  <span className="text-text-muted">تاریخ</span>
                  <span className="tabular-nums text-text-muted">{formatJalali(act.date)}</span>
                </div>
              </div>
            ))}

            {/* Show-more trigger [M §6.2] */}
            {activities.length > INITIAL_MOBILE_COUNT && (
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                className="text-[13px] text-text-muted text-center py-2 hover:text-text transition-colors"
              >
                {showAll ? 'کمتر نشان بده ▲' : `نمایش بیشتر (${activities.length - INITIAL_MOBILE_COUNT} مورد) ▼`}
              </button>
            )}
          </div>
        </>
      )}
    </Card>
  )
}
