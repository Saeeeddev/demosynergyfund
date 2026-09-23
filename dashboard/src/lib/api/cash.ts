import { z } from "zod";
import { client } from "./client";
import { validate } from "./validate";
import { CashConfigSchema } from "@/lib/schemas/cash";
import { DEMO_MODE } from "@/lib/demo/config";
import { demoService } from "@/lib/demo/service";

export async function apiGetCashConfig() {
  if (DEMO_MODE) return demoService.getCashConfig();
  const res = await client.get("/cash/config");
  return validate(CashConfigSchema, res.data);
}

const GatewayDepositResultSchema = z.object({
  deposit: z.number(),
  redirect_url: z.string(),
});

/** Starts an instant gateway deposit; the caller should redirect the browser
 *  to the returned URL (Zarinpal takes it from there). */
export async function apiDepositGateway(amount: number) {
  if (DEMO_MODE) {
    await demoService.deposit(amount);
    return { deposit: Date.now(), redirect_url: "/dashboard" };
  }
  const res = await client.post("/cash/deposit/gateway", { amount });
  return validate(GatewayDepositResultSchema, res.data);
}

/** Manual receipt deposit — goes to an approval queue. Only amount + the
 *  receipt image are part of the backend contract (content sniffed by magic
 *  bytes server-side, max RECEIPT_MAX_BYTES). */
export async function apiDepositBankTransfer(amount: number, receipt: File) {
  if (DEMO_MODE) return demoService.deposit(amount);
  const form = new FormData();
  form.append("amount", String(amount));
  form.append("receipt", receipt);
  await client.post("/cash/deposit/bank-transfer", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function apiWithdraw(amount: number, iban: string) {
  if (DEMO_MODE) return demoService.withdraw(amount);
  await client.post("/cash/withdraw", { amount, iban });
}
