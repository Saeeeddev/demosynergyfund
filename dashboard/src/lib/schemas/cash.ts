import { z } from "zod";

// Cash flows (deposit / withdraw / payment methods) configuration.
// Returned as one config object so the UI has everything it needs in a single
// fetch; swapping the mock for a real endpoint is a one-line change in api/cash.ts.

export const BankAccountSchema = z.object({
  id: z.string(),
  bankName: z.string(),
  /** full card number, already grouped + in Persian digits for display */
  cardNumber: z.string(),
  /** present on the user's own saved card — what a withdrawal actually
   *  transfers to (SATNA/PAYA move by shaba, not by card number) */
  iban: z.string().optional(),
  /** tailwind text-color class for the brand dot/icon */
  brandColor: z.string(),
});

export const PaymentGatewaySchema = z.object({
  id: z.string(),
  label: z.string(),
});

export const CashConfigSchema = z.object({
  /** the user's own bank cards — withdraw destinations + saved payment methods */
  userAccounts: z.array(BankAccountSchema),
  /** the platform's accounts — i.e. where a manual receipt deposit was paid TO */
  platformAccounts: z.array(BankAccountSchema),
  /** online payment gateways for instant deposit */
  gateways: z.array(PaymentGatewaySchema),
  /** quick recent-amount chips (Toman) in the withdraw form */
  recentWithdrawAmounts: z.array(z.number()),
  /** daily withdraw cap (Toman) shown next to date options */
  dailyWithdrawCap: z.number(),
});

export type BankAccount = z.infer<typeof BankAccountSchema>;
export type PaymentGateway = z.infer<typeof PaymentGatewaySchema>;
export type CashConfig = z.infer<typeof CashConfigSchema>;
