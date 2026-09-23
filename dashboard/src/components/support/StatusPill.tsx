import { cn } from '@/lib/utils/cn'
import { STATUS_LABELS, type TicketStatus } from '@/lib/schemas/support'

export function StatusPill({ status }: { status: TicketStatus }) {
  const cls =
    status === 'answered'
      ? 'bg-green-tint text-green-deep'
      : status === 'closed'
      ? 'bg-gray-tint text-gray-deep'
      : 'bg-gold-tint text-gold-deep'
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap',
        cls,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
