'use client'

// [پشتیبانی] Support — quick new-ticket form + ticket list (start) and the
// selected conversation chat (end). Wired through useTickets / useCreateTicket /
// useReplyTicket (mock → api → hook), like the rest of the app.

import { useState } from 'react'
import { Headset } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { NewTicketForm } from '@/components/support/NewTicketForm'
import { TicketList } from '@/components/support/TicketList'
import { TicketConversation } from '@/components/support/TicketConversation'
import { useTickets, useCreateTicket, useReplyTicket, useMarkTicketRead } from '@/lib/hooks/useSupport'
import { toast } from '@/lib/toast'

export default function SupportPage() {
  const { data: tickets = [], isLoading, isError, refetch } = useTickets()
  const createMut = useCreateTicket()
  const replyMut = useReplyTicket()
  const markReadMut = useMarkTicketRead()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = tickets.find((t) => t.id === selectedId) ?? null

  function selectTicket(id: string) {
    setSelectedId(id)
    const ticket = tickets.find((t) => t.id === id)
    if (ticket && ticket.unreadCount > 0) markReadMut.mutate(id)
  }

  return (
    <div className="flex flex-col gap-4 p-3 lg:gap-5 lg:p-3">
      <PageHeader
        className="hidden lg:flex"
        icon={<Headset size={22} strokeWidth={1.75} />}
        title="پشتیبانی"
        subtitle="گفتگو با پشتیبانی و پیگیری تیکت‌های شما"
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5 lg:items-start">
        {/* Start column — quick new-ticket form (always visible) */}
        <div className="lg:col-span-1">
          <NewTicketForm
            pending={createMut.isPending}
            onCreate={async (category, subject, message) => {
              try {
                const ticket = await createMut.mutateAsync({ category, subject, message })
                selectTicket(ticket.id)
                toast.success('تیکت شما ثبت شد.')
              } catch {
                /* global error toast handles it */
              }
            }}
          />
        </div>

        {/* End column — ONE card: ticket list ⇄ selected conversation (with back) */}
        <div className="lg:col-span-2">
          <Card className="flex flex-col h-[70vh] lg:h-[620px]">
            {selected ? (
              <TicketConversation
                ticket={selected}
                pending={replyMut.isPending}
                onBack={() => setSelectedId(null)}
                onReply={async (text) => {
                  try {
                    await replyMut.mutateAsync({ ticketId: selected.id, text })
                  } catch {
                    /* global error toast handles it */
                  }
                }}
              />
            ) : (
              <TicketList
                tickets={tickets}
                isLoading={isLoading}
                isError={isError}
                onRetry={() => refetch()}
                selectedId={selectedId}
                onSelect={selectTicket}
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
