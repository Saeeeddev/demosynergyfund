import { z } from "zod";

export const ProjectStatusSchema = z.enum(["active", "funding", "closed"]);

// ─── Project details (the project page tabs + ROI forecast) ──────────────────
// Mirrors types/domain.ts ProjectDetails — this is the API contract for what
// the admin configures per project and Django serves on /api/projects/<id>.

export const ProjectLegalInfoSchema = z.object({
  assetType: z.string(),
  documentType: z.string(),
  contractPeriod: z.string(),
  license: z.string(),
});

export const ProjectReportItemSchema = z.object({
  title: z.string(),
  date: z.string(),
});

export const ProjectForecastConfigSchema = z.object({
  annualYieldPercent: z.number(),
  degradationRatePercent: z.number(),
  electricityTariff: z.number(),
  operatingFeePercent: z.number(),
  horizonYears: z.number(),
  previousPaybackYears: z.number(),
});

export const ProjectDetailsSchema = z.object({
  distributionPeriod: z.string(),
  legal: ProjectLegalInfoSchema,
  reports: z.array(ProjectReportItemSchema),
  risks: z.array(z.string()),
  forecast: ProjectForecastConfigSchema,
});

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.string(),
  images: z.array(z.string()),
  status: ProjectStatusSchema,
  targetYield: z.number(),
  minInvestment: z.number(),
  sharePrice: z.number(),
  soldPercent: z.number().min(0).max(100),
  totalCapacityWatts: z.number(),
  description: z.string(),
  createdAt: z.string(),
  operationStartDate: z.string(),
  progressPercent: z.number().min(0).max(100).optional(),
  // List responses may omit details; the detail endpoint always includes them.
  details: ProjectDetailsSchema.optional(),
});

// What /api/projects/<id> returns — details guaranteed present.
export const ProjectWithDetailsSchema = ProjectSchema.extend({
  details: ProjectDetailsSchema,
});
export type ProjectWithDetails = z.infer<typeof ProjectWithDetailsSchema>;

export type Project = z.infer<typeof ProjectSchema>;
export type ProjectDetails = z.infer<typeof ProjectDetailsSchema>;
export type ProjectStatus = z.infer<typeof ProjectStatusSchema>;
export type ProjectLegalInfo = z.infer<typeof ProjectLegalInfoSchema>;
export type ProjectReportItem = z.infer<typeof ProjectReportItemSchema>;
export type ProjectForecastConfig = z.infer<typeof ProjectForecastConfigSchema>;

export const PaginatedProjectsSchema = z.object({
  data: z.array(ProjectSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
});
