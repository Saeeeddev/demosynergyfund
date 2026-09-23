'use client'

// [F §4 R4] "تاریخچه سفارشات" — Order History with pagination, mirroring the
// Payout History table: desktop = page-keyed table + Pagination [D §9.22];
// mobile = infinite load-more [M §7.7]. Self-fetches via useOrders.

import { useState } from 'react'
import { Table, ActivityTypeChip, type TableColumn } from '@/components/ui/Table'
import { Card } from '@/components/ui/Card'
import { Pagination } from '@/components/ui/Pagination'
import { ErrorState } from '@/components/ui/ErrorState'
import { Empty } from '@/components/ui/Empty'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { ReceiptText } from 'lucide-react'
import { formatToman } from '@/lib/utils/currency'
import { bidiIsolate, formatNumber } from '@/lib/utils/numbers'
import { formatJalali } from '@/lib/utils/jalali'
import { useOrders, useOrdersInfinite } from '@/lib/hooks/usePortfolio'
import type { Investment } from '@/lib/schemas/investment'

const COLUMNS: TableColumn<Investment>[] = [
  {
    key: 'type',
    header: 'نوع',
    primary: true,
    render: (row) => <ActivityTypeChip type={row.type} />,
  },
  {
    key: 'projectName',
    header: 'پروژه',
    render: (row) => <span className="text-text-2">{row.projectName}</span>,
  },
  {
    key: 'sharesCount',
    header: 'تعداد سهم (کیلو وات)',
    numeric: true,
    render: (row) => (
      <span className="tabular-nums text-text-2">{bidiIsolate(formatNumber(row.sharesCount, 1))}</span>
    ),
  },
  {
    key: 'totalAmount',
    header: 'مبلغ کل',
    numeric: true,
    render: (row) => <span className="tabular-nums text-text-2">{formatToman(row.totalAmount)}</span>,
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
  const q = useOrders(page)

  const orders = q.data?.data ?? []
  const totalPages = q.data?.totalPages ?? 1

  const firstPageLoading = q.isLoading && page === 1
  const inBoxLoading = q.isLoading && page > 1
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

      {!firstPageLoading && !inBoxError && orders.length === 0 && (
        <Empty icon={<ReceiptText size={48} />} message="تاریخچه سفارشی ثبت نشده است" />
      )}

      {!firstPageLoading && !inBoxError && orders.length > 0 && (
        <>
          {inBoxLoading ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-14 w-full rounded-md" count={5} />
            </div>
          ) : (
            <Table columns={COLUMNS} rows={orders} keyExtractor={(r) => r.id} />
          )}
          <div className="flex justify-center pt-2">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} loading={q.isLoading} />
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
  const q = useOrdersInfinite()
  const pages = q.data?.pages ?? []
  const orders = pages.flatMap((p) => p.data)
  const hasMore = q.hasNextPage

  if (q.isLoading && orders.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-16 rounded-md" count={4} />
      </div>
    )
  }

  if (q.isError && orders.length === 0) {
    return <ErrorState scope="inline" onRetry={() => q.refetch()} />
  }

  if (orders.length === 0) {
    return <Empty icon={<ReceiptText size={48} />} message="تاریخچه سفارشی ثبت نشده است" />
  }

  return (
    <div className="flex flex-col gap-3">
      {orders.map((o) => (
        <div
          key={o.id}
          className="flex items-center justify-between py-3 border-b border-border last:border-0 gap-3"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <ActivityTypeChip type={o.type} />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[14px] text-text truncate">{o.projectName}</span>
              <span className="text-[12px] tabular-nums text-text-muted">{formatJalali(o.date)}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-0.5 shrink-0">
            <span className="text-[14px] tabular-nums text-text-2">{formatToman(o.totalAmount)}</span>
            <span className="text-[12px] tabular-nums text-text-muted">
              {bidiIsolate(formatNumber(o.sharesCount, 1))} کیلو وات
            </span>
          </div>
        </div>
      ))}

      {q.isError && orders.length > 0 && (
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

export function OrderHistoryTable() {
  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-[15px] font-semibold text-text">تاریخچه سفارشات</h2>

      <div className="hidden md:block">
        <DesktopTable />
      </div>
      <div className="md:hidden">
        <MobileList />
      </div>
    </Card>
  )
}
