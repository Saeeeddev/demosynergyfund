import { client } from "./client";
import { validate, paginatedSchema } from "./validate";
import {
  HoldingSchema,
  PerformanceSeriesSchema,
  GeoDistributionSchema,
  PortfolioSummarySchema,
  DashboardSummarySchema,
} from "@/lib/schemas/portfolio";
import { ActivitySchema, InvestmentSchema } from "@/lib/schemas/investment";
import { DEMO_MODE } from "@/lib/demo/config";
import { demoService } from "@/lib/demo/service";

export async function apiGetDashboardSummary() {
  if (DEMO_MODE) return demoService.dashboardSummary();
  const res = await client.get("/dashboard/summary");
  return validate(DashboardSummarySchema, res.data);
}

export async function apiGetActivities(page = 1, pageSize = 10) {
  if (DEMO_MODE) return demoService.activities(page, pageSize);
  const res = await client.get("/dashboard/activities", { params: { page, pageSize } });
  return validate(paginatedSchema(ActivitySchema), res.data);
}

export async function apiGetPortfolioSummary() {
  if (DEMO_MODE) return demoService.portfolioSummary();
  const res = await client.get("/portfolio/summary");
  return validate(PortfolioSummarySchema, res.data);
}

export async function apiGetHoldings(page = 1, pageSize = 6) {
  if (DEMO_MODE) return demoService.holdings(page, pageSize);
  const res = await client.get("/portfolio/holdings", { params: { page, pageSize } });
  return validate(paginatedSchema(HoldingSchema), res.data);
}

export async function apiGetPerformance() {
  if (DEMO_MODE) return demoService.performance();
  const res = await client.get("/portfolio/performance");
  return validate(PerformanceSeriesSchema.array(), res.data);
}

export async function apiGetGeo() {
  if (DEMO_MODE) return demoService.geo();
  const res = await client.get("/portfolio/geo");
  return validate(GeoDistributionSchema.array(), res.data);
}

export async function apiGetOrders(page = 1, pageSize = 10) {
  if (DEMO_MODE) return demoService.orders(page, pageSize);
  const res = await client.get("/portfolio/orders", { params: { page, pageSize } });
  return validate(paginatedSchema(InvestmentSchema), res.data);
}
