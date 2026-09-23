import { z } from "zod";

export const PayoutStatusSchema = z.enum(["paid", "pending", "processing"]);

export const PayoutSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  projectName: z.string(),
  amount: z.number(),
  periodStart: z.string(),
  periodEnd: z.string(),
  status: PayoutStatusSchema,
  date: z.string(),
});

export const PayoutMethodSchema = z.object({
  id: z.string(),
  type: z.enum(["bank", "platform"]),
  name: z.string(),
  details: z.string(),
  isDefault: z.boolean(),
});

export const IncomeSummarySchema = z.object({
  totalIncome: z.number(),
  totalPayment: z.number(),
  thisMonthIncome: z.number(),
  cashBalance: z.number(),
  monthlyBars: z.array(z.object({ month: z.string(), amount: z.number() })),
});

export const PaginatedPayoutsSchema = z.object({
  data: z.array(PayoutSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
});

export type Payout = z.infer<typeof PayoutSchema>;
export type PayoutMethod = z.infer<typeof PayoutMethodSchema>;
export type IncomeSummary = z.infer<typeof IncomeSummarySchema>;
