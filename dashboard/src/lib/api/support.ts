import { client } from "./client";
import { validate } from "./validate";
import { TicketSchema, type TicketCategory } from "@/lib/schemas/support";
import { DEMO_MODE } from "@/lib/demo/config";
import { demoService } from "@/lib/demo/service";

export async function apiGetTickets() {
  if (DEMO_MODE) return demoService.tickets();
  const res = await client.get("/support/tickets");
  return validate(TicketSchema.array(), res.data);
}

export async function apiCreateTicket(
  category: TicketCategory,
  subject: string,
  message: string,
) {
  if (DEMO_MODE) return demoService.createTicket(category, subject, message);
  const res = await client.post("/support/tickets", { category, subject, message });
  return validate(TicketSchema, res.data);
}

export async function apiReplyTicket(ticketId: string, text: string) {
  if (DEMO_MODE) return demoService.replyTicket(ticketId, text);
  const res = await client.post(`/support/tickets/${ticketId}/reply`, { text });
  return validate(TicketSchema, res.data);
}

/** Clears the unread badge for one ticket — call when its conversation opens. */
export async function apiMarkTicketRead(ticketId: string) {
  if (DEMO_MODE) return demoService.markTicketRead(ticketId);
  const res = await client.post(`/support/tickets/${ticketId}/read`);
  return validate(TicketSchema, res.data);
}
