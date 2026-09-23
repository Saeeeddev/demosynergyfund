import { z } from "zod";

export const ReportCategorySchema = z.enum([
  "financial",
  "technical",
  "legal",
  "quarterly",
  // Auto-generated personal statement (one per user per Persian month),
  // scoped so only its owner ever sees it — see backend/reports/services.py.
  "monthly_statement",
]);

export const ReportSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: ReportCategorySchema,
  projectId: z.string().optional(),
  projectName: z.string().optional(),
  date: z.string(),
  sizeKb: z.number(),
  downloadUrl: z.string(),
});

export const PaginatedReportsSchema = z.object({
  data: z.array(ReportSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
});

export type ReportCategory = z.infer<typeof ReportCategorySchema>;
export type Report = z.infer<typeof ReportSchema>;
