// FEATURES.md §2–§13 data shapes — all pages derive from these types.
// "token" below = blockchain watt (ERC-20, Polygon), never a CSS variable.

// Project/ProjectDetails and friends live in lib/schemas/project.ts now — that's
// the schema with runtime validation, so it's the one definition (REALWORLD_API.md
// §5): re-exported here so the many existing `from "@/types/domain"` imports
// don't all need to move.
export type {
  Project,
  ProjectDetails,
  ProjectStatus,
  ProjectLegalInfo,
  ProjectReportItem,
  ProjectForecastConfig,
} from "@/lib/schemas/project";

export type ActivityType = "buy" | "sell" | "deposit" | "withdraw";
export type NotificationType = "payout" | "performance";
export type ReportCategory = "financial" | "technical" | "legal" | "quarterly";
export type ForecastScenario = "conservative" | "base" | "optimistic";
export type InvestmentStatus = "pending" | "completed" | "failed";
export type PayoutStatus = "paid" | "pending" | "processing";
export type VerificationStatus = "pending" | "verified" | "rejected";

// ─── Portfolio ────────────────────────────────────────────────────────────────

export interface Holding {
  projectId: string;
  projectName: string;
  projectLocation: string;
  sharesOwned: number;       // kilowatts — one ledger token = 1 kW
  purchasePrice: number;     // Toman per kilowatt at purchase
  currentPrice: number;      // Toman per kilowatt now
  totalValue: number;        // Toman
  totalInvested: number;     // Toman
  pnl: number;               // Toman
  pnlPercent: number;
  ownershipPercent: number;
}

export interface PerformanceSeries {
  date: string;              // ISO date
  value: number;             // Toman
}

export interface GeoDistribution {
  city: string;
  ownershipPercent: number;
  projectsCount: number;
}

export interface PortfolioSummary {
  totalAssetsValue: number;
  totalInvested: number;
  incomeEarned: number;
  netReturn: number;
  netReturnPercent: number;
}

// ─── Investment (transaction) ──────────────────────────────────────────────────

export interface Investment {
  id: string;
  type: Extract<ActivityType, "buy" | "sell">;
  projectId: string;
  projectName: string;
  sharesCount: number;
  pricePerShare: number;
  totalAmount: number;
  fee: number;
  status: InvestmentStatus;
  date: string;
}

// ─── Activity (dashboard recent activities) ────────────────────────────────────

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  amount: number;
  shares?: number;
  projectName?: string;
  date: string;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardSummary {
  cashBalance: number;
  totalInvested: number;
  currentValue: number;
  incomeEarned: number;
  energyProducedKwh: number;
  investedSeries: PerformanceSeries[];
  allocation: Array<{ name: string; value: number; color?: string; watts?: number }>;
}

// ─── Payouts ──────────────────────────────────────────────────────────────────

export interface Payout {
  id: string;
  projectId: string;
  projectName: string;
  amount: number;
  periodStart: string;
  periodEnd: string;
  status: PayoutStatus;
  date: string;
}

export interface PayoutMethod {
  id: string;
  type: "bank" | "platform";
  name: string;
  details: string;           // e.g. masked account number
  isDefault: boolean;
}

export interface IncomeSummary {
  totalIncome: number;
  totalPayment: number;
  thisMonthIncome: number;
  cashBalance: number;
  monthlyBars: Array<{ month: string; amount: number }>;
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export interface Report {
  id: string;
  title: string;
  category: ReportCategory;
  projectId?: string;
  projectName?: string;
  date: string;
  sizeKb: number;
  downloadUrl: string;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
  verificationStatus: VerificationStatus;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
}

// ─── ROI Forecast (FEATURES.md §11 R3) ────────────────────────────────────────

export interface ForecastAssumptions {
  annualYieldPercent: number;
  degradationRatePercent: number;
  electricityTariff: number;
  operatingFeePercent: number;
}

export interface ForecastYearData {
  year: number;
  annualIncome: number;
  cumulativeReturn: number;
}

export interface RoiForecastResult {
  projectedTotalReturn: number;
  projectedReturnPercent: number;
  avgAnnualRoi: number;
  paybackYears: number;
  projectedCumulativeIncome: number;
  yearlyData: ForecastYearData[];
}
