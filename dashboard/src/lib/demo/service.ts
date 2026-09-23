import type { TicketCategory } from '@/lib/schemas/support'
import type { VerificationDocKind } from '@/lib/schemas/kyc'
import type { TradeResult } from '@/lib/api/investments'
import { loadDemoState, resetDemoState, updateDemoState } from './store'

export class DemoError extends Error {
  response: { status: number }
  userMessage: string

  constructor(status: number, userMessage: string) {
    super(userMessage)
    this.name = 'DemoError'
    this.response = { status }
    this.userMessage = userMessage
  }
}

async function ready(): Promise<void> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    const error = new DemoError(0, 'اتصال اینترنت در دسترس نیست.') as DemoError & { code?: string }
    error.code = 'ERR_NETWORK'
    throw error
  }
  await new Promise((resolve) => setTimeout(resolve, 180))
}

function paginate<T>(items: T[], page: number, pageSize: number) {
  const safePage = Math.max(1, page)
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = (safePage - 1) * pageSize
  return { data: items.slice(start, start + pageSize), total, page: safePage, pageSize, totalPages }
}

function now() {
  return new Date().toISOString()
}

function id(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export const demoService = {
  reset() {
    resetDemoState()
  },

  async getMe() {
    await ready()
    return loadDemoState().user
  },

  async updateProfile(input: { first_name: string; last_name: string; email: string }) {
    await ready()
    return updateDemoState((state) => {
      state.user.first_name = input.first_name
      state.user.last_name = input.last_name
      state.user.email = input.email
      state.user.name = `${input.first_name} ${input.last_name}`.trim() || 'کاربر مهمان'
    }).user
  },

  async markInvestmentPromptSeen() {
    await ready()
    return updateDemoState((state) => { state.user.hasSeenInvestmentPrompt = true }).user
  },

  async getCashConfig() {
    await ready()
    return loadDemoState().cashConfig
  },

  async deposit(amount: number) {
    await ready()
    if (!Number.isFinite(amount) || amount <= 0) throw new DemoError(422, 'مبلغ واریز معتبر نیست.')
    updateDemoState((state) => {
      state.cashBalance += amount
      state.income.cashBalance = state.cashBalance
      state.activities.unshift({ id: id('activity'), type: 'deposit', description: 'واریز آزمایشی تأییدشده', amount, date: now() })
    })
  },

  async withdraw(amount: number) {
    await ready()
    const current = loadDemoState()
    if (!Number.isFinite(amount) || amount <= 0) throw new DemoError(422, 'مبلغ برداشت معتبر نیست.')
    if (amount > current.cashBalance) throw new DemoError(422, 'موجودی آزمایشی برای این برداشت کافی نیست.')
    if (amount > current.cashConfig.dailyWithdrawCap) throw new DemoError(422, 'مبلغ از سقف برداشت روزانه بیشتر است.')
    updateDemoState((state) => {
      state.cashBalance -= amount
      state.income.cashBalance = state.cashBalance
      state.activities.unshift({ id: id('activity'), type: 'withdraw', description: 'برداشت آزمایشی', amount, date: now() })
    })
  },

  async listProjects(page = 1, pageSize = 8) {
    await ready()
    return paginate(loadDemoState().projects, page, pageSize)
  },

  async getProject(projectId: string) {
    await ready()
    const project = loadDemoState().projects.find((item) => item.id === projectId)
    if (!project) throw new DemoError(404, 'پروژه نمایشی پیدا نشد.')
    return project
  },

  async dashboardSummary() {
    await ready()
    const state = loadDemoState()
    const totalInvested = state.holdings.reduce((sum, item) => sum + item.totalInvested, 0)
    const currentValue = state.holdings.reduce((sum, item) => sum + item.totalValue, 0)
    return {
      cashBalance: state.cashBalance,
      totalInvested,
      currentValue,
      incomeEarned: state.income.totalIncome,
      energyProducedKwh: 42_860,
      investedSeries: state.performance,
      allocation: state.holdings.map((holding) => ({ name: holding.projectName, value: holding.totalValue, watts: holding.sharesOwned })),
    }
  },

  async activities(page = 1, pageSize = 10) {
    await ready()
    return paginate(loadDemoState().activities, page, pageSize)
  },

  async portfolioSummary() {
    await ready()
    const state = loadDemoState()
    const totalAssetsValue = state.holdings.reduce((sum, item) => sum + item.totalValue, 0)
    const totalInvested = state.holdings.reduce((sum, item) => sum + item.totalInvested, 0)
    const netReturn = totalAssetsValue - totalInvested + state.income.totalIncome
    return { totalAssetsValue, totalInvested, incomeEarned: state.income.totalIncome, netReturn, netReturnPercent: totalInvested ? (netReturn / totalInvested) * 100 : 0 }
  },

  async holdings(page = 1, pageSize = 6) {
    await ready()
    return paginate(loadDemoState().holdings, page, pageSize)
  },

  async performance() { await ready(); return loadDemoState().performance },
  async geo() { await ready(); return loadDemoState().geo },
  async orders(page = 1, pageSize = 10) { await ready(); return paginate(loadDemoState().orders, page, pageSize) },
  async owns(projectId: string) { await ready(); return loadDemoState().holdings.some((item) => item.projectId === projectId && item.sharesOwned > 0) },

  async buy(projectId: string, quantityWatts: number): Promise<TradeResult> {
    await ready()
    const snapshot = loadDemoState()
    const project = snapshot.projects.find((item) => item.id === projectId)
    if (!project) throw new DemoError(404, 'پروژه نمایشی پیدا نشد.')
    if (snapshot.verification.status !== 'approved') throw new DemoError(403, 'برای خرید، احراز هویت نمایشی باید تأیید شده باشد.')
    const quantity = quantityWatts / 1000
    if (!Number.isInteger(quantity) || quantity <= 0) throw new DemoError(422, 'مقدار خرید باید حداقل یک کیلووات باشد.')
    const gross = quantity * project.sharePrice
    const fee = Math.round(gross * 0.05)
    const total = gross + fee
    if (total > snapshot.cashBalance) throw new DemoError(422, 'موجودی آزمایشی برای این خرید کافی نیست.')

    const next = updateDemoState((state) => {
      const stateProject = state.projects.find((item) => item.id === projectId)!
      state.cashBalance -= total
      state.income.cashBalance = state.cashBalance
      const holding = state.holdings.find((item) => item.projectId === projectId)
      if (holding) {
        const previousQty = holding.sharesOwned
        holding.sharesOwned += quantity
        holding.purchasePrice = Math.round(((previousQty * holding.purchasePrice) + gross) / holding.sharesOwned)
        holding.currentPrice = project.sharePrice
        holding.totalValue = holding.sharesOwned * holding.currentPrice
        holding.totalInvested += gross
        holding.pnl = holding.totalValue - holding.totalInvested
        holding.pnlPercent = holding.totalInvested ? (holding.pnl / holding.totalInvested) * 100 : 0
      } else {
        state.holdings.push({ projectId, projectName: project.name, projectLocation: project.location, sharesOwned: quantity, purchasePrice: project.sharePrice, currentPrice: project.sharePrice, totalValue: gross, totalInvested: gross, pnl: 0, pnlPercent: 0, ownershipPercent: (quantity * 1000 / project.totalCapacityWatts) * 100 })
      }
      stateProject.soldPercent = Math.min(100, stateProject.soldPercent + (quantityWatts / stateProject.totalCapacityWatts) * 100)
      state.orders.unshift({ id: id('order'), type: 'buy', projectId, projectName: project.name, sharesCount: quantityWatts, pricePerShare: project.sharePrice, totalAmount: gross, fee, status: 'completed', date: now() })
      state.activities.unshift({ id: id('activity'), type: 'buy', description: `خرید آزمایشی ${project.name}`, amount: total, shares: quantityWatts, projectName: project.name, date: now() })
    })
    const holding = next.holdings.find((item) => item.projectId === projectId)!
    return { transaction_id: Date.now(), kind: 'BUY', quantity, unit_price: project.sharePrice, total_amount: total, fee_amount: fee, cash_balance: next.cashBalance, token_balance: holding.sharesOwned }
  },

  async sell(projectId: string, quantityWatts: number): Promise<TradeResult> {
    await ready()
    const snapshot = loadDemoState()
    const project = snapshot.projects.find((item) => item.id === projectId)
    const holding = snapshot.holdings.find((item) => item.projectId === projectId)
    const quantity = quantityWatts / 1000
    if (!project || !holding) throw new DemoError(404, 'دارایی نمایشی پیدا نشد.')
    if (!Number.isInteger(quantity) || quantity <= 0 || quantity > holding.sharesOwned) throw new DemoError(422, 'مقدار فروش از دارایی نمایشی شما بیشتر است.')
    const gross = quantity * project.sharePrice
    const fee = Math.round(gross * 0.05)
    const total = gross - fee
    const next = updateDemoState((state) => {
      const stateProject = state.projects.find((item) => item.id === projectId)!
      const target = state.holdings.find((item) => item.projectId === projectId)!
      const costRemoved = target.purchasePrice * quantity
      target.sharesOwned -= quantity
      target.totalInvested = Math.max(0, target.totalInvested - costRemoved)
      target.totalValue = target.sharesOwned * target.currentPrice
      target.pnl = target.totalValue - target.totalInvested
      target.pnlPercent = target.totalInvested ? (target.pnl / target.totalInvested) * 100 : 0
      if (target.sharesOwned === 0) state.holdings = state.holdings.filter((item) => item.projectId !== projectId)
      state.cashBalance += total
      state.income.cashBalance = state.cashBalance
      stateProject.soldPercent = Math.max(0, stateProject.soldPercent - (quantityWatts / stateProject.totalCapacityWatts) * 100)
      state.orders.unshift({ id: id('order'), type: 'sell', projectId, projectName: project.name, sharesCount: quantityWatts, pricePerShare: project.sharePrice, totalAmount: gross, fee, status: 'completed', date: now() })
      state.activities.unshift({ id: id('activity'), type: 'sell', description: `فروش آزمایشی ${project.name}`, amount: total, shares: quantityWatts, projectName: project.name, date: now() })
    })
    return { transaction_id: Date.now(), kind: 'SELL', quantity, unit_price: project.sharePrice, total_amount: total, fee_amount: fee, cash_balance: next.cashBalance, token_balance: next.holdings.find((item) => item.projectId === projectId)?.sharesOwned ?? 0 }
  },

  async incomeSummary() { await ready(); const state = loadDemoState(); return { ...state.income, cashBalance: state.cashBalance } },
  async payouts(page = 1, pageSize = 8) { await ready(); return paginate(loadDemoState().payouts, page, pageSize) },
  async payoutMethod() { await ready(); return loadDemoState().payoutMethod },

  async saveBankCard(input: { bank_name: string; account_holder_name: string; card_number: string; iban: string }) {
    await ready()
    const digits = input.card_number.replace(/\D/g, '')
    if (digits.length !== 16 || !/^IR\d{24}$/.test(input.iban)) throw new DemoError(422, 'اطلاعات کارت یا شبا معتبر نیست.')
    const method = { id: id('payment'), type: 'bank' as const, name: input.bank_name, details: `کارت •••• ${digits.slice(-4)}`, isDefault: true }
    updateDemoState((state) => {
      state.payoutMethod = method
      state.cashConfig.userAccounts = [{ id: method.id, bankName: input.bank_name, cardNumber: digits.replace(/(.{4})/g, '$1-').replace(/-$/, ''), iban: input.iban, brandColor: 'text-blue-base' }]
    })
    return method
  },

  async notifications() { await ready(); return loadDemoState().notifications },
  async markNotification(idValue: string) {
    await ready()
    const next = updateDemoState((state) => {
      const item = state.notifications.find((notification) => notification.id === idValue)
      if (item) item.read = true
    })
    const item = next.notifications.find((notification) => notification.id === idValue)
    if (!item) throw new DemoError(404, 'اعلان پیدا نشد.')
    return item
  },
  async markAllNotifications() { await ready(); updateDemoState((state) => { state.notifications.forEach((item) => { item.read = true }) }) },

  async verification() { await ready(); return loadDemoState().verification },
  async submitVerification(nationalId: string, birthDate: string) {
    await ready()
    return updateDemoState((state) => {
      state.verification = { ...state.verification, status: 'pending', national_id: nationalId, birth_date: birthDate, submitted_at: now(), reviewed_at: null, shahkar_matched: null }
      state.user.verificationStatus = 'pending'
    }).verification
  },
  async uploadVerificationDocument(kind: VerificationDocKind, file: File) {
    await ready()
    updateDemoState((state) => {
      state.verification.documents.push({ id: Date.now(), kind, content_type: file.type || 'application/octet-stream', size: file.size, uploaded_at: now(), url: '#' })
    })
  },

  async tickets() { await ready(); return loadDemoState().tickets },
  async createTicket(category: TicketCategory, subject: string, message: string) {
    await ready()
    const ticket = { id: id('ticket'), category, subject, status: 'answered' as const, createdAt: now(), unreadCount: 1, messages: [
      { id: id('message'), sender: 'user' as const, text: message, date: now() },
      { id: id('message'), sender: 'admin' as const, text: 'این پاسخ خودکار در حالت نمایشی ثبت شده است.', date: now() },
    ] }
    updateDemoState((state) => { state.tickets.unshift(ticket) })
    return ticket
  },
  async replyTicket(ticketId: string, text: string) {
    await ready()
    const next = updateDemoState((state) => {
      const ticket = state.tickets.find((item) => item.id === ticketId)
      if (ticket) ticket.messages.push({ id: id('message'), sender: 'user', text, date: now() })
    })
    const ticket = next.tickets.find((item) => item.id === ticketId)
    if (!ticket) throw new DemoError(404, 'درخواست پشتیبانی پیدا نشد.')
    return ticket
  },
  async markTicketRead(ticketId: string) {
    await ready()
    const next = updateDemoState((state) => {
      const ticket = state.tickets.find((item) => item.id === ticketId)
      if (ticket) ticket.unreadCount = 0
    })
    const ticket = next.tickets.find((item) => item.id === ticketId)
    if (!ticket) throw new DemoError(404, 'درخواست پشتیبانی پیدا نشد.')
    return ticket
  },

  async reports(page = 1, pageSize = 8, category?: string, project?: string) {
    await ready()
    const filtered = loadDemoState().reports.filter((report) => (!category || report.category === category) && (!project || report.projectId === project))
    return paginate(filtered, page, pageSize)
  },
}
