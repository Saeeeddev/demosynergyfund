"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  apiGetTickets,
  apiCreateTicket,
  apiReplyTicket,
  apiMarkTicketRead,
} from "@/lib/api/support";
import type { TicketCategory } from "@/lib/schemas/support";

const TICKETS_KEY = ["support", "tickets"];

export function useTickets() {
  return useQuery({
    queryKey: TICKETS_KEY,
    queryFn: apiGetTickets,
    staleTime: 30 * 1000,
  });
}

/** Sidebar badge: total unread staff replies across all of the user's tickets. */
export function useUnreadTicketCount() {
  const { data } = useTickets();
  return data?.reduce((sum, t) => sum + t.unreadCount, 0) ?? 0;
}

export function useMarkTicketRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ticketId: string) => apiMarkTicketRead(ticketId),
    onSuccess: () => qc.invalidateQueries({ queryKey: TICKETS_KEY }),
  });
}

export function useCreateTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { category: TicketCategory; subject: string; message: string }) =>
      apiCreateTicket(vars.category, vars.subject, vars.message),
    onSuccess: () => qc.invalidateQueries({ queryKey: TICKETS_KEY }),
  });
}

export function useReplyTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { ticketId: string; text: string }) =>
      apiReplyTicket(vars.ticketId, vars.text),
    onSuccess: () => qc.invalidateQueries({ queryKey: TICKETS_KEY }),
  });
}
