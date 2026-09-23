'use client'

// [F §5 R3 right] Income Row 3: Payout history table
// [D §9.22] In-box pagination: page 1 = normal load; page 2+ = in-box skeleton + in-box retry
// [M §7.7] Mobile: load-more button + in-box error (no page-level error.tsx trigger)

import { useState } from 'react'
import { Table, type TableColumn } from '@/components/ui/Table'
import { Card } from '@/components/ui/Card'
import { Pagination } from '@/components/ui/Pagination'
import { ErrorState } from '@/components/ui/ErrorState'
import { Empty } from '@/components/ui/Empty'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { ReceiptText } from 'lucide-react'
import { formatToman } from '@/lib/utils/currency'
import { formatJalali } from '@/lib/utils/jalali'
import { usePayouts, usePayoutsInfinite } from '@/lib/hooks/usePayouts'
import type { Payout } from '@/lib/schemas/payout'

/* ---- Status pill ---- */
const STATUS_MAP: Record<Payout['status'], { label: string; className: string }> = {
  paid:       { label: 'پرداخت‌شده', className: 'bg-green-tint text-green-deep' },
  pending:    { label: 'در انتظار',   className: 'bg-gold-tint text-gold-deep'  },
  processing: { label: 'در پردازش',  className: 'bg-blue-tint text-blue-deep'  },
}

function StatusPill({ status }: { status: Payout['status'] }) {
  const { label, className } = STATUS_MAP[status]
  return (
    <span className={`inline-flex items-center rounded-pill px-2 py-0.5 text-[11px] font-semibold leading-none whitespace-nowrap ${className}`}>
      {label}
    </span>
  )
}

/* ---- Columns ---- */
const COLUMNS: TableColumn<Payout>[] = [
  {
    key: 'projectName',
    header: 'پروژه',
    primary: true,
    render: (row) => <span className="text-text-2">{row.projectName}</span>,
  },
  {
    key: 'amount',
    header: 'مبلغ',
    numeric: true,
    render: (row) => <span className="tabular-nums text-text-2">{formatToman(row.amount)}</span>,
  },
  {
    key: 'status',
    header: 'وضعیت',
    render: (row) => <StatusPill status={row.status} />,
  },
  {
    key: 'date',
    header: 'تاریخ',
    numeric: true,
    render: (row) => (
      <span className="tabular-nums text-text-muted text-[13px]">{formatJalali(row.date)}</span>
    ),
  },
]

/* ---- Desktop (md+) — page-keyed with in-box pagination [D §9.22] ---- */
function DesktopTable() {
  const [page, setPage] = useState(1)
  const q = usePayouts(page)

  const payouts = q.data?.data ?? []
  const totalPages = q.data?.totalPages ?? 1

  /* Page 1 loading → pass isLoading=true to Table; page 2+ loading → in-box skeleton */
  const firstPageLoading = q.isLoading && page === 1
  const inBoxLoading = q.isLoading && page > 1
  /* Page 1 error → bubble to page error.tsx; page 2+ error → in-box retry */
  if (q.isError && page === 1) throw q.error
  const inBoxError = q.isError && page > 1

  return (
    <>
      {firstPageLoading && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-14 w-full rounded-md" count={5} />
        </div>
      )}

      {!firstPageLoading && !inBoxError && payouts.length === 0 && (
        <Empty icon={<ReceiptText size={48} />} message="تاریخچه پرداختی ثبت نشده است" />
      )}

      {!firstPageLoading && !inBoxError && payouts.length > 0 && (
        <>
          {inBoxLoading ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-14 w-full rounded-md" count={5} />
            </div>
          ) : (
            <Table columns={COLUMNS} rows={payouts} keyExtractor={(r) => r.id} />
          )}
          <div className="flex justify-center pt-2">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              loading={q.isLoading}
            />
          </div>
        </>
      )}

      {inBoxError && (
        <div className="rounded-card border border-border p-4">
          <ErrorState scope="inline" onRetry={() => q.refetch()} />
        </div>
      )}
    </>
  )
}

/* ---- Mobile (< md) — load-more / infinite [M §7.7] ---- */
function MobileList() {
  const q = usePayoutsInfinite()
  const pages = q.data?.pages ?? []
  const payouts = pages.flatMap((p) => p.data)
  const hasMore = q.hasNextPage

  if (q.isLoading && payouts.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-16 rounded-md" count={4} />
      </div>
    )
  }

  if (q.isError && payouts.length === 0) {
    return <ErrorState scope="inline" onRetry={() => q.refetch()} />
  }

  if (payouts.length === 0) {
    return <Empty icon={<ReceiptText size={48} />} message="تاریخچه پرداختی ثبت نشده است" />
  }

  return (
    <div className="flex flex-col gap-3">
      {payouts.map((p) => (
        <div
          key={p.id}
          className="flex items-center justify-between py-3 border-b border-border last:border-0 gap-3"
        >
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <span className="text-[14px] text-text truncate">{p.projectName}</span>
            <span className="text-[12px] tabular-nums text-text-muted">{formatJalali(p.date)}</span>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-[14px] tabular-nums text-text-2">{formatToman(p.amount)}</span>
            <StatusPill status={p.status} />
          </div>
        </div>
      ))}

      {/* In-box error on page 2+ load-more */}
      {q.isError && payouts.length > 0 && (
        <div className="rounded-card border border-border p-4">
          <ErrorState scope="inline" onRetry={() => q.fetchNextPage()} />
        </div>
      )}

      {hasMore && !q.isError && (
        <Button
          variant="ghost"
          onClick={() => q.fetchNextPage()}
          disabled={q.isFetchingNextPage}
          className="w-full min-h-[44px]"
        >
          {q.isFetchingNextPage ? 'در حال بارگذاری…' : 'نمایش بیشتر'}
        </Button>
      )}
    </div>
  )
}

/* ---- Exported component ---- */
export function PayoutHistoryTable() {
  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-[15px] font-semibold text-text">تاریخچه پرداخت‌ها</h2>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopTable />
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <MobileList />
      </div>
    </Card>
  )
}
