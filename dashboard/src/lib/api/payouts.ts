import { client } from "./client";
import { validate } from "./validate";
import {
  IncomeSummarySchema,
  PaginatedPayoutsSchema,
  PayoutMethodSchema,
} from "@/lib/schemas/payout";
import { DEMO_MODE } from "@/lib/demo/config";
import { demoService } from "@/lib/demo/service";

export async function apiGetIncomeSummary() {
  if (DEMO_MODE) return demoService.incomeSummary();
  const res = await client.get("/payouts/summary");
  return validate(IncomeSummarySchema, res.data);
}

export async function apiGetPayouts(page = 1, pageSize = 8) {
  if (DEMO_MODE) return demoService.payouts(page, pageSize);
  const res = await client.get("/payouts", { params: { page, pageSize } });
  return validate(PaginatedPayoutsSchema, res.data);
}

/** Null when the user hasn't set a payout method yet. */
export async function apiGetPayoutMethod() {
  if (DEMO_MODE) return demoService.payoutMethod();
  const res = await client.get("/payouts/method");
  return validate(PayoutMethodSchema.nullable(), res.data);
}

/** Create/replace the user's saved bank card — one slot, "add" always means
 *  "this is now my card" (backend/apps/payments/services.py::save_bank_card). */
export async function apiSaveBankCard(input: {
  bank_name: string;
  account_holder_name: string;
  card_number: string;
  iban: string;
}) {
  if (DEMO_MODE) return demoService.saveBankCard(input);
  const res = await client.post("/payouts/method", input);
  return validate(PayoutMethodSchema, res.data);
}
