'use client'

// Always-visible quick "new ticket" form (no toggle button) — fast type-in.
import { useState } from 'react'
import { Send } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/lib/utils/cn'
import { toast } from '@/lib/toast'
import { CATEGORY_LABELS, type TicketCategory } from '@/lib/schemas/support'

const CATEGORIES = Object.entries(CATEGORY_LABELS) as [TicketCategory, string][]

interface NewTicketFormProps {
  pending: boolean
  onCreate: (category: TicketCategory, subject: string, message: string) => void
}

export function NewTicketForm({ pending, onCreate }: NewTicketFormProps) {
  const [category, setCategory] = useState<TicketCategory>('technical')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) {
      toast.error('لطفاً موضوع و متن پیام را کامل کنید.')
      return
    }
    onCreate(category, subject.trim(), message.trim())
    setSubject('')
    setMessage('')
  }

  return (
    <Card className="flex flex-col gap-3">
      <h2 className="text-[15px] font-semibold text-text">تیکت جدید</h2>

      <form onSubmit={submit} className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setCategory(value)}
              aria-pressed={category === value}
              className={cn(
                'rounded-pill px-3 py-1.5 text-[12px] font-medium transition-colors min-h-[36px]',
                category === value
                  ? 'bg-blue-tint text-blue-deep border border-blue-base'
                  : 'bg-surface border border-border text-text-muted hover:bg-hover',
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <Input
          label="موضوع"
          placeholder="موضوع تیکت"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="متن پیام خود را بنویسید…"
          className="w-full rounded-md border border-border-strong bg-surface p-3 text-[14px] text-text leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-green-tint focus:border-green-base"
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={pending}
          icon={pending ? <Spinner size={16} /> : <Send size={16} />}
        >
          ارسال به پشتیبانی
        </Button>
      </form>
    </Card>
  )
}
