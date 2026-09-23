'use client'

// Small chat thread for one ticket. RTL: the user's own messages sit on the
// RIGHT (start), the admin's replies on the LEFT (end).
import { useState } from 'react'
import { Send, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/lib/utils/cn'
import { formatJalali } from '@/lib/utils/jalali'
import { CATEGORY_LABELS, type Ticket } from '@/lib/schemas/support'
import { StatusPill } from './StatusPill'

interface TicketConversationProps {
  ticket: Ticket
  pending: boolean
  onReply: (text: string) => void
  /** back to the ticket list (mobile single-pane) */
  onBack?: () => void
}

export function TicketConversation({ ticket, pending, onReply, onBack }: TicketConversationProps) {
  const [text, setText] = useState('')

  function send() {
    if (!text.trim()) return
    onReply(text.trim())
    setText('')
  }

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border pb-3 shrink-0">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="بازگشت به فهرست تیکت‌ها"
            className="flex items-center justify-center w-9 h-9 rounded-md text-text-muted hover:bg-hover"
          >
            <ArrowRight size={18} />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-text truncate">{ticket.subject}</p>
          <span className="text-[11px] text-text-muted">{CATEGORY_LABELS[ticket.category]}</span>
        </div>
        <StatusPill status={ticket.status} />
      </div>

      {/* Messages — user on the right (start), admin on the left (end). Scrolls. */}
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-3 pe-1">
        {ticket.messages.map((m) => (
          <div key={m.id} className={cn('flex', m.sender === 'user' ? 'justify-start' : 'justify-end')}>
            <div
              className={cn(
                'max-w-[80%] rounded-card px-3 py-2',
                m.sender === 'user'
                  ? 'bg-green-tint text-text rounded-ss-sm'
                  : 'bg-surface-2 border border-border text-text rounded-se-sm',
              )}
            >
              <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{m.text}</p>
              <span className="block text-[10px] text-text-subtle tabular-nums mt-1">
                {m.sender === 'admin' ? 'پشتیبانی · ' : ''}
                {formatJalali(m.date)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Reply input */}
      <div className="flex items-end gap-2 border-t border-border pt-3 shrink-0">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              send()
            }
          }}
          rows={1}
          placeholder="پیام خود را بنویسید…"
          className="flex-1 rounded-md border border-border-strong bg-surface px-3 py-2 text-[14px] text-text resize-none focus:outline-none focus:ring-2 focus:ring-green-tint focus:border-green-base"
        />
        <Button
          variant="primary"
          size="compact"
          onClick={send}
          disabled={pending || !text.trim()}
          icon={pending ? <Spinner size={16} /> : <Send size={16} />}
        >
          ارسال
        </Button>
      </div>
    </div>
  )
}
