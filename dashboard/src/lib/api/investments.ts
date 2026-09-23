import { z } from "zod";
import { client } from "./client";
import { validate } from "./validate";
import { DEMO_MODE } from "@/lib/demo/config";
import { demoService } from "@/lib/demo/service";

// Trading is quote → execute (backend/apps/trading/api.py): the server prices
// every trade — the client never sends or trusts a price. A quote is short-
// lived (QUOTE_TTL_SECONDS), so create + execute happen back-to-back inside
// one api call rather than spanning the multi-step UI; what the UI shows
// while the user is choosing an amount is an estimate, the executed trade is
// always priced by the quote. Field names are snake_case here because that's
// what TradeResultSerializer/QuoteSerializer actually emit — unlike the rest
// of the API, this pair was never given the camelCase treatment.
//
// Unit note: the rest of this app's invest/sell UI works in watts internally
// ("shares" = kW × 1000, matching Project.totalCapacityWatts). The backend's
// quantity is a plain whole-kilowatt count (one ledger token = 1 kW —
// Plant.issued_supply is minted 1:1 with nameplate_capacity_kw, and
// Plant.share_price is Toman per kilowatt). This is the one place that
// boundary gets crossed, so the ÷1000 happens right here, once.

const QuoteSchema = z.object({
  id: z.string(),
  plant: z.number(),
  side: z.enum(["buy", "sell"]),
  quantity: z.number(),
  unit_price: z.number(),
  gross_amount: z.number(),
  fee_amount: z.number(),
  total_amount: z.number(),
  price_version: z.number(),
  expires_at: z.string(),
});

const TradeResultSchema = z.object({
  transaction_id: z.number(),
  kind: z.string(),
  quantity: z.number(),
  unit_price: z.number(),
  total_amount: z.number(),
  fee_amount: z.number(),
  cash_balance: z.number(),
  token_balance: z.number(),
});

export type TradeResult = z.infer<typeof TradeResultSchema>;

async function createQuote(projectId: string, side: "buy" | "sell", quantityWatts: number) {
  const res = await client.post("/trading/quote", {
    plant: Number(projectId),
    side,
    quantity: quantityWatts / 1000,
  });
  return validate(QuoteSchema, res.data);
}

export async function apiBuyWatts(projectId: string, sharesCount: number): Promise<TradeResult> {
  if (DEMO_MODE) return demoService.buy(projectId, sharesCount);
  const quote = await createQuote(projectId, "buy", sharesCount);
  const res = await client.post("/trading/buy", { quote: quote.id });
  return validate(TradeResultSchema, res.data);
}

export async function apiSellWatts(projectId: string, sharesCount: number): Promise<TradeResult> {
  if (DEMO_MODE) return demoService.sell(projectId, sharesCount);
  const quote = await createQuote(projectId, "sell", sharesCount);
  const res = await client.post("/trading/sell", { quote: quote.id });
  return validate(TradeResultSchema, res.data);
}

export async function apiUserOwnsProject(projectId: string): Promise<boolean> {
  if (DEMO_MODE) return demoService.owns(projectId);
  const res = await client.get(`/trading/holdings/${projectId}`);
  return validate(z.number(), res.data.quantity) > 0;
}
