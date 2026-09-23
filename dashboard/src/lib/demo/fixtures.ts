import type { CashConfig } from '@/lib/schemas/cash'
import type { Investment, Activity } from '@/lib/schemas/investment'
import type { Verification } from '@/lib/schemas/kyc'
import type { IncomeSummary, Payout, PayoutMethod } from '@/lib/schemas/payout'
import type { GeoDistribution, Holding, PerformanceSeries } from '@/lib/schemas/portfolio'
import type { ProjectWithDetails } from '@/lib/schemas/project'
import type { Report } from '@/lib/schemas/report'
import type { Ticket } from '@/lib/schemas/support'
import type { Notification, User } from '@/lib/schemas/user'

export interface DemoState {
  version: 1
  user: User
  cashBalance: number
  projects: ProjectWithDetails[]
  holdings: Holding[]
  performance: PerformanceSeries[]
  geo: GeoDistribution[]
  activities: Activity[]
  orders: Investment[]
  income: IncomeSummary
  payouts: Payout[]
  payoutMethod: PayoutMethod | null
  cashConfig: CashConfig
  notifications: Notification[]
  tickets: Ticket[]
  verification: Verification
  reports: Report[]
}

const sharedDetails = {
  distributionPeriod: 'ماهانه',
  legal: {
    assetType: 'سهم تولید نیروگاه خورشیدی',
    documentType: 'قرارداد مشارکت در تولید',
    contractPeriod: '۲۰ سال',
    license: 'مجوز ساتبا — نمونه نمایشی',
  },
  reports: [
    { title: 'گزارش فنی فصل بهار', date: '2026-06-21' },
    { title: 'گزارش عملکرد مالی', date: '2026-07-22' },
  ],
  risks: ['تغییرات نرخ خرید تضمینی برق', 'نوسان تولید فصلی', 'هزینه‌های نگهداری تجهیزات'],
  forecast: {
    annualYieldPercent: 24,
    degradationRatePercent: 0.5,
    electricityTariff: 3820,
    operatingFeePercent: 4,
    horizonYears: 20,
    previousPaybackYears: 4.2,
  },
}

export const demoProjects: ProjectWithDetails[] = [
  {
    id: '1', name: 'نیروگاه خورشیدی یزد', location: 'یزد', images: ['/Images/projects/project-1.jpg'],
    status: 'active', targetYield: 25.4, minInvestment: 28_000_000, sharePrice: 28_000_000,
    soldPercent: 68, totalCapacityWatts: 5_000_000, description: 'نیروگاه ۵ مگاواتی متصل به شبکه با سابقه تولید پایدار و قرارداد خرید تضمینی برق.',
    createdAt: '2025-09-12', operationStartDate: '2025-12-01', progressPercent: 100, details: sharedDetails,
  },
  {
    id: '2', name: 'نیروگاه خورشیدی کرمان', location: 'کرمان', images: ['/Images/projects/project-2.jpg'],
    status: 'funding', targetYield: 27.1, minInvestment: 31_500_000, sharePrice: 31_500_000,
    soldPercent: 43, totalCapacityWatts: 3_000_000, description: 'پروژه ۳ مگاواتی در یکی از پربازده‌ترین مناطق تابشی کشور.',
    createdAt: '2026-01-18', operationStartDate: '2026-11-01', progressPercent: 64,
    details: { ...sharedDetails, forecast: { ...sharedDetails.forecast, annualYieldPercent: 26.2 } },
  },
  {
    id: '3', name: 'نیروگاه خورشیدی شیراز', location: 'فارس', images: ['/Images/projects/image3.jpg'],
    status: 'active', targetYield: 23.8, minInvestment: 26_000_000, sharePrice: 26_000_000,
    soldPercent: 81, totalCapacityWatts: 2_500_000, description: 'نیروگاه عملیاتی با پایش لحظه‌ای تولید و تجهیزات استاندارد اروپایی.',
    createdAt: '2025-05-10', operationStartDate: '2025-08-15', progressPercent: 100, details: sharedDetails,
  },
  {
    id: '4', name: 'نیروگاه خورشیدی اصفهان', location: 'اصفهان', images: ['/Images/projects/image4.jpg'],
    status: 'funding', targetYield: 24.6, minInvestment: 29_000_000, sharePrice: 29_000_000,
    soldPercent: 29, totalCapacityWatts: 4_000_000, description: 'پروژه در حال تأمین مالی با دسترسی مستقیم به پست برق منطقه‌ای.',
    createdAt: '2026-04-02', operationStartDate: '2027-02-01', progressPercent: 38, details: sharedDetails,
  },
]

export const initialDemoState: DemoState = {
  version: 1,
  user: {
    id: 'guest-1', username: 'guest', name: 'کاربر مهمان', first_name: 'کاربر', last_name: 'مهمان',
    email: 'guest@example.com', phone: '09120000000', role: 'investor', verificationStatus: 'verified',
    hasSeenInvestmentPrompt: true,
  },
  cashBalance: 850_000_000,
  projects: demoProjects,
  holdings: [
    { projectId: '1', projectName: 'نیروگاه خورشیدی یزد', projectLocation: 'یزد', sharesOwned: 12, purchasePrice: 26_000_000, currentPrice: 28_000_000, totalValue: 336_000_000, totalInvested: 312_000_000, pnl: 24_000_000, pnlPercent: 7.69, ownershipPercent: 0.00024 },
    { projectId: '3', projectName: 'نیروگاه خورشیدی شیراز', projectLocation: 'فارس', sharesOwned: 8, purchasePrice: 24_500_000, currentPrice: 26_000_000, totalValue: 208_000_000, totalInvested: 196_000_000, pnl: 12_000_000, pnlPercent: 6.12, ownershipPercent: 0.00032 },
  ],
  performance: [
    { date: '2026-04-01', value: 482_000_000 }, { date: '2026-05-01', value: 493_000_000 },
    { date: '2026-06-01', value: 507_000_000 }, { date: '2026-07-01', value: 519_000_000 },
    { date: '2026-08-01', value: 532_000_000 }, { date: '2026-09-01', value: 544_000_000 },
  ],
  geo: [
    { city: 'یزد', ownershipPercent: 60, projectsCount: 1 },
    { city: 'فارس', ownershipPercent: 40, projectsCount: 1 },
  ],
  activities: [
    { id: 'a1', type: 'deposit', description: 'افزایش موجودی حساب', amount: 250_000_000, date: '2026-09-18T09:30:00Z' },
    { id: 'a2', type: 'buy', description: 'خرید سهم نیروگاه یزد', amount: 112_000_000, shares: 4000, projectName: 'نیروگاه خورشیدی یزد', date: '2026-09-12T12:10:00Z' },
    { id: 'a3', type: 'withdraw', description: 'برداشت آزمایشی', amount: 40_000_000, date: '2026-09-04T08:20:00Z' },
  ],
  orders: [
    { id: 'o1', type: 'buy', projectId: '1', projectName: 'نیروگاه خورشیدی یزد', sharesCount: 12_000, pricePerShare: 28_000_000, totalAmount: 336_000_000, fee: 16_800_000, status: 'completed', date: '2026-07-10T10:00:00Z' },
    { id: 'o2', type: 'buy', projectId: '3', projectName: 'نیروگاه خورشیدی شیراز', sharesCount: 8_000, pricePerShare: 26_000_000, totalAmount: 208_000_000, fee: 10_400_000, status: 'completed', date: '2026-05-14T11:45:00Z' },
  ],
  income: {
    totalIncome: 78_400_000, totalPayment: 69_300_000, thisMonthIncome: 12_600_000, cashBalance: 850_000_000,
    monthlyBars: [
      { month: 'فروردین', amount: 8_200_000 }, { month: 'اردیبهشت', amount: 9_100_000 },
      { month: 'خرداد', amount: 10_400_000 }, { month: 'تیر', amount: 11_200_000 },
      { month: 'مرداد', amount: 11_800_000 }, { month: 'شهریور', amount: 12_600_000 },
    ],
  },
  payouts: [
    { id: 'p1', projectId: '1', projectName: 'نیروگاه خورشیدی یزد', amount: 7_600_000, periodStart: '2026-08-23', periodEnd: '2026-09-22', status: 'paid', date: '2026-09-23' },
    { id: 'p2', projectId: '3', projectName: 'نیروگاه خورشیدی شیراز', amount: 5_000_000, periodStart: '2026-08-23', periodEnd: '2026-09-22', status: 'processing', date: '2026-09-23' },
  ],
  payoutMethod: { id: 'pm1', type: 'bank', name: 'بانک ملت', details: 'کارت •••• ۷۸۹۳', isDefault: true },
  cashConfig: {
    userAccounts: [{ id: 'bank-1', bankName: 'بانک ملت', cardNumber: '۶۱۰۴-۳۳۷۷-۱۲۳۴-۷۸۹۳', iban: 'IR120170000000123456789012', brandColor: 'text-red-base' }],
    platformAccounts: [{ id: 'platform-1', bankName: 'بانک پاسارگاد', cardNumber: '۵۰۲۲-۲۹۱۰-۱۲۳۴-۵۶۷۸', brandColor: 'text-blue-base' }],
    gateways: [], recentWithdrawAmounts: [20_000_000, 50_000_000, 100_000_000], dailyWithdrawCap: 500_000_000,
  },
  notifications: [
    { id: 'n1', type: 'payout', title: 'واریز درآمد شهریور', body: 'درآمد نیروگاه یزد به کیف پول نمایشی شما اضافه شد.', timestamp: '2026-09-23T08:00:00Z', read: false },
    { id: 'n2', type: 'performance', title: 'گزارش عملکرد جدید', body: 'گزارش ماهانه تولید نیروگاه شیراز آماده مشاهده است.', timestamp: '2026-09-20T13:20:00Z', read: false },
    { id: 'n3', type: 'broadcast', title: 'نسخه نمایشی', body: 'همه اطلاعات این داشبورد آزمایشی هستند.', timestamp: '2026-09-18T07:00:00Z', read: true },
  ],
  tickets: [
    { id: 't1', category: 'technical', subject: 'نحوه مشاهده گزارش تولید', status: 'answered', createdAt: '2026-09-15T09:00:00Z', unreadCount: 1, messages: [
      { id: 'tm1', sender: 'user', text: 'گزارش تولید ماهانه را از کجا ببینم؟', date: '2026-09-15T09:00:00Z' },
      { id: 'tm2', sender: 'admin', text: 'از بخش گزارش‌ها می‌توانید فایل‌های هر نیروگاه را مشاهده کنید.', date: '2026-09-15T10:20:00Z' },
    ] },
  ],
  verification: { status: 'approved', national_id: '0012345678', birth_date: '1995-04-12', shahkar_matched: true, submitted_at: '2026-03-12T08:00:00Z', reviewed_at: '2026-03-12T10:00:00Z', documents: [] },
  reports: [
    { id: 'r1', title: 'گزارش عملکرد شهریور ۱۴۰۵', category: 'monthly_statement', date: '2026-09-22', sizeKb: 184, downloadUrl: '/demo/sample-report.txt' },
    { id: 'r2', title: 'گزارش فنی نیروگاه یزد', category: 'technical', projectId: '1', projectName: 'نیروگاه خورشیدی یزد', date: '2026-08-30', sizeKb: 920, downloadUrl: '/demo/sample-report.txt' },
    { id: 'r3', title: 'گزارش مالی فصل تابستان', category: 'quarterly', date: '2026-09-15', sizeKb: 640, downloadUrl: '/demo/sample-report.txt' },
  ],
}
