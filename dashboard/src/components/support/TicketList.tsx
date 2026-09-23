'use client'

import { Empty } from '@/components/ui/Empty'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { CATEGORY_LABELS, type Ticket } from '@/lib/schemas/support'
import { StatusPill } from './StatusPill'

// Bare (no Card) — rendered inside the shared support card.
interface TicketListProps {
  tickets: Ticket[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  selectedId: string | null
  onSelect: (id: string) => void
}

export function TicketList({ tickets, isLoading, isError, onRetry, selectedId, onSelect }: TicketListProps) {
  return (
    <div className="flex flex-col gap-3 h-full">
      <h2 className="text-[15px] font-semibold text-text shrink-0">تیکت‌های من</h2>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-16 rounded-md" count={4} />
        </div>
      ) : isError ? (
        <ErrorState scope="inline" onRetry={onRetry} />
      ) : tickets.length === 0 ? (
        <Empty icon={<MessageSquare size={36} />} message="هنوز تیکتی ندارید" />
      ) : (
        <div className="flex flex-col gap-2 flex-1 min-h-0 overflow-y-auto pe-1">
          {tickets.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelect(t.id)}
              className={cn(
                'text-start rounded-md border p-3 transition-colors shrink-0',
                selectedId === t.id
                  ? 'border-blue-base bg-blue-tint'
                  : 'border-border bg-surface hover:bg-hover',
              )}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[11px] font-semibold text-blue-deep">
                  {CATEGORY_LABELS[t.category]}
                </span>
                <StatusPill status={t.status} />
              </div>
              <div className="flex items-center gap-2">
                <p className="text-[13px] font-semibold text-text truncate flex-1">{t.subject}</p>
                {t.unreadCount > 0 && (
                  <span className="shrink-0 min-w-[16px] h-4 px-1 rounded-pill bg-red-base text-white text-[10px] font-bold leading-4 text-center tabular-nums">
                    {t.unreadCount > 99 ? '۹۹+' : String(t.unreadCount)}
                  </span>
                )}
              </div>
              <p className="text-[12px] text-text-muted truncate">
                {t.messages[t.messages.length - 1]?.text}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
