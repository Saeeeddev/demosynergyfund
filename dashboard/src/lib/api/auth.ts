// Real auth API (AUTH.md "Migration to Django", REALWORLD_API.md §3).
// The old mockAuth pair that lived here was dead code and is gone (§6).
// All endpoints are backend/apps/users/api.py; responses for /me and
// login/register are validated against the UserSchema contract.

import { client } from "./client";
import { validate } from "./validate";
import { UserSchema, type User } from "@/lib/schemas/user";
import { DEMO_MODE } from "@/lib/demo/config";
import { demoService } from "@/lib/demo/service";

export type OtpPurpose = "register" | "reset";

export async function apiGetMe(): Promise<User> {
  if (DEMO_MODE) return demoService.getMe();
  const res = await client.get("/me");
  return validate(UserSchema, res.data);
}

/** ProfileUpdateSerializer only accepts these three fields — phone (the
 *  identity/username) isn't editable through this endpoint. */
export async function apiUpdateProfile(input: {
  first_name: string;
  last_name: string;
  email: string;
}): Promise<User> {
  if (DEMO_MODE) return demoService.updateProfile(input);
  const res = await client.patch("/me", input);
  return validate(UserSchema, res.data);
}

/** Idempotent: only the first call actually flips the flag server-side. */
export async function apiMarkInvestmentPromptSeen(): Promise<User> {
  if (DEMO_MODE) return demoService.markInvestmentPromptSeen();
  const res = await client.post("/me/investment-prompt-seen");
  return validate(UserSchema, res.data);
}

export async function apiOtpSend(phone: string, purpose: OtpPurpose) {
  if (DEMO_MODE) return;
  // Uniform response by design — it never says whether the phone exists.
  await client.post("/auth/otp/send", { phone, purpose });
}

/** Resolves if the code is valid, throws (400) if not. Does not consume it. */
export async function apiOtpVerify(phone: string, purpose: OtpPurpose, code: string) {
  if (DEMO_MODE) return;
  await client.post("/auth/otp/verify", { phone, purpose, code });
}

/** Spends the register code and creates the account. first_name/last_name
 *  are required by RegisterSerializer. The backend also opens a session for
 *  the new user, so a separate login afterwards is redundant. */
export async function apiRegister(input: {
  phone: string;
  code: string;
  password: string;
  first_name: string;
  last_name: string;
}): Promise<User> {
  if (DEMO_MODE) return demoService.getMe();
  const res = await client.post("/auth/register", input);
  return validate(UserSchema, res.data);
}

export async function apiPasswordReset(input: {
  phone: string;
  code: string;
  new_password: string;
}) {
  if (DEMO_MODE) return;
  await client.post("/auth/password-reset", input);
}
