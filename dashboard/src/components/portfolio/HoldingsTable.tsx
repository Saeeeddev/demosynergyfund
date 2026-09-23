'use client'

// [F §4 R3] Current holdings — ONE card: a clickable price/P&L table (start/right)
// and a "details" panel (end/left) for the selected holding (defaults to first).
// Table columns deliberately avoid what the details panel already shows.

import { useState } from 'react'
import Image from 'next/image'
import { MapPin, ChevronLeft, Wallet } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { NavButton } from '@/components/ui/NavButton'
import { Pagination } from '@/components/ui/Pagination'
import { ChangeIndicator } from '@/components/ui/ChangeIndicator'
import { ErrorState } from '@/components/ui/ErrorState'
import { Empty } from '@/components/ui/Empty'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils/cn'
import { formatToman } from '@/lib/utils/currency'
import { bidiIsolate, formatNumber, formatPercent } from '@/lib/utils/numbers'
import { useProject } from '@/lib/hooks/useProjects'
import type { Holding } from '@/lib/schemas/portfolio'

interface HoldingsTableProps {
  // One server page of holdings (the API paginates; see useHoldings).
  holdings: Holding[]
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

export function HoldingsTable({
  holdings,
  page,
  totalPages,
  onPageChange,
  isLoading,
  isError,
  onRetry,
}: HoldingsTableProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = holdings.find((h) => h.projectId === selectedId) ?? holdings[0] ?? null

  if (isLoading) {
    return <Skeleton className="h-80 rounded-card" />
  }

  if (isError) {
    return (
      <Card>
        <ErrorState scope="inline" onRetry={onRetry} />
      </Card>
    )
  }

  if (holdings.length === 0) {
    return (
      <Card>
        <h2 className="text-[15px] font-semibold text-text mb-3">دارایی‌های فعلی</h2>
        <Empty icon={<Wallet size={48} />} message="هنوز سرمایه‌گذاری‌ای ندارید" />
      </Card>
    )
  }

  const paged = holdings

  return (
    <Card className="p-0 overflow-hidden rounded-[20px]">
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:items-stretch">
        {/* Table — right (first DOM), 2/3 */}
        <div className="lg:col-span-2 flex flex-col gap-3 p-4">
          <h2 className="text-[15px] font-semibold text-text">دارایی‌های فعلی</h2>

          {/* Mobile: stacked cards — a 6-column table can't fit a phone width */}
          <div className="flex flex-col gap-2 lg:hidden">
            {paged.map((h) => {
              const isSel = h.projectId === selected?.projectId
              return (
                <button
                  type="button"
                  key={h.projectId}
                  onClick={() => setSelectedId(h.projectId)}
                  className={cn(
                    'w-full rounded-card border p-3 text-start transition-colors',
                    isSel ? 'border-blue-base bg-blue-tint' : 'border-border bg-surface hover:bg-hover',
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-green-base shrink-0" />
                      <span className="font-semibold text-text truncate">{h.projectName}</span>
                    </div>
                    <ChangeIndicator value={h.pnlPercent} variant="pill" />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
                    <MobileStat label="سهم شما (کیلو وات)" value={bidiIsolate(formatNumber(h.sharesOwned, 1))} />
                    <MobileStat label="قیمت روز هر کیلووات" value={formatToman(h.currentPrice)} />
                    <MobileStat
                      label="سود و زیان فعلی"
                      value={formatToman(h.pnl)}
                      valueClass={h.pnl >= 0 ? 'text-green-deep' : 'text-red-base'}
                    />
                    <MobileStat label="ارزش فعلی" value={formatToman(h.totalValue)} valueClass="text-text font-semibold" />
                  </div>
                </button>
              )
            })}
          </div>

          {/* Desktop: full table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-[13px] border-collapse min-w-[640px]">
              <thead>
                <tr className="text-text-muted text-[12px] border-b border-border">
                  <th className="text-start font-medium px-3 py-2.5">نماد</th>
                  <th className="text-center font-medium px-3 py-2.5">سهم شما (کیلو وات)</th>
                  <th className="text-center font-medium px-3 py-2.5">قیمت روز هر کیلووات</th>
                  <th className="text-center font-medium px-3 py-2.5">سود و زیان فعلی</th>
                  <th className="text-center font-medium px-3 py-2.5">ارزش فعلی</th>
                  <th className="text-center font-medium px-3 py-2.5 w-12">جزئیات</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((h) => {
                  const isSel = h.projectId === selected?.projectId
                  return (
                    <tr
                      key={h.projectId}
                      onClick={() => setSelectedId(h.projectId)}
                      className={cn(
                        'cursor-pointer border-b border-border/70 last:border-0 transition-colors',
                        isSel ? 'bg-blue-tint' : 'hover:bg-hover',
                      )}
                    >
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-base shrink-0" />
                          <span className="font-medium text-text truncate">{h.projectName}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center tabular-nums text-text-2">
                        {bidiIsolate(formatNumber(h.sharesOwned, 1))}
                      </td>
                      <td className="px-3 py-3 text-center tabular-nums text-text-2">
                        {formatToman(h.currentPrice)}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-col items-center gap-1">
                          <span
                            className={cn(
                              'tabular-nums font-medium',
                              h.pnl >= 0 ? 'text-green-deep' : 'text-red-base',
                            )}
                          >
                            {formatToman(h.pnl)}
                          </span>
                          <ChangeIndicator value={h.pnlPercent} variant="pill" />
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center tabular-nums font-semibold text-text">
                        {formatToman(h.totalValue)}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span
                          className={cn(
                            'inline-flex items-center justify-center w-8 h-8 rounded-md transition-colors',
                            isSel ? 'text-blue-deep bg-white/60' : 'text-blue-base',
                          )}
                        >
                          <ChevronLeft size={18} />
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center pt-1">
              <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
            </div>
          )}
        </div>

        {/* Details — left (second DOM), 1/3 */}
        {selected && (
          <div className="lg:col-span-1 p-4 border-t border-border lg:border-t-0 lg:border-s bg-surface-2/40">
            <DetailsPanel holding={selected} />
          </div>
        )}
      </div>
    </Card>
  )
}

/* ── Details panel for the selected holding (fields NOT shown in the table) ── */
function DetailsPanel({ holding }: { holding: Holding }) {
  const { data: project } = useProject(holding.projectId)
  const ownedKw = holding.sharesOwned

  return (
    <div className="flex flex-col gap-4 h-full">
      <h2 className="text-[15px] font-semibold text-text">جزئیات دارایی</h2>

      <div className="relative h-32 rounded-card overflow-hidden bg-surface-2">
        <Image
          src={project?.images?.[0] ?? '/Images/projects/project-1.jpg'}
          alt={holding.projectName}
          fill
          sizes="(max-width: 1024px) 100vw, 30vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
        <div className="absolute bottom-2 start-3 end-3 text-white">
          <p className="text-[14px] font-bold leading-tight line-clamp-1 drop-shadow">
            {holding.projectName}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-white/90">
            <MapPin size={11} className="shrink-0" />
            <span className="truncate">{holding.projectLocation}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Detail label="سهم شما (کیلو وات)" value={bidiIsolate(formatNumber(ownedKw, 1))} />
        <Detail label="درصد مالکیت" value={bidiIsolate(formatPercent(holding.ownershipPercent))} />
        <Detail label="میانگین قیمت خرید" value={formatToman(holding.purchasePrice)} />
        <Detail label="سرمایه‌گذاری اولیه" value={formatToman(holding.totalInvested)} />
      </div>

      <div className="flex gap-2 mt-auto pt-1">
        <NavButton href={`/sell/${holding.projectId}`} variant="destructive" fullWidth className="flex-1">
          فروش
        </NavButton>
        <NavButton href={`/project-details/${holding.projectId}`} variant="secondary" fullWidth className="flex-1">
          جزئیات
        </NavButton>
      </div>
    </div>
  )
}

function MobileStat({
  label,
  value,
  valueClass,
}: {
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] text-text-muted">{label}</span>
      <span className={cn('text-[13px] tabular-nums text-text-2', valueClass)}>{value}</span>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] text-text-muted">{label}</span>
      <span className="text-[13px] font-semibold text-text tabular-nums">{value}</span>
    </div>
  )
}
