import { z } from "zod";

// Support tickets — each ticket is a small conversation thread between the user
// and the admin. Same mock → api → hook flow as the rest of the app.

export const TicketCategorySchema = z.enum([
  "technical",
  "financial",
  "account",
  "investment",
  "other",
]);

export const TicketStatusSchema = z.enum(["open", "answered", "closed"]);

export const TicketMessageSchema = z.object({
  id: z.string(),
  sender: z.enum(["user", "admin"]),
  text: z.string(),
  date: z.string(),
});

export const TicketSchema = z.object({
  id: z.string(),
  category: TicketCategorySchema,
  subject: z.string(),
  status: TicketStatusSchema,
  createdAt: z.string(),
  messages: z.array(TicketMessageSchema),
  unreadCount: z.number(),
});

export type TicketCategory = z.infer<typeof TicketCategorySchema>;
export type TicketStatus = z.infer<typeof TicketStatusSchema>;
export type TicketMessage = z.infer<typeof TicketMessageSchema>;
export type Ticket = z.infer<typeof TicketSchema>;

export const CATEGORY_LABELS: Record<TicketCategory, string> = {
  technical: "فنی",
  financial: "مالی",
  account: "حساب کاربری",
  investment: "سرمایه‌گذاری",
  other: "سایر",
};

export const STATUS_LABELS: Record<TicketStatus, string> = {
  open: "در انتظار پاسخ",
  answered: "پاسخ داده‌شده",
  closed: "بسته‌شده",
};
