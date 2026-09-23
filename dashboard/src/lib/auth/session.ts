// Session management via signed HTTP-only cookie (ARCHITECTURE.md §3.3).
// The cookie carries an HMAC-signed token (see ./token.ts), so it can't be
// forged. getSession() reads + verifies the cookie in server context;
// setSession/clearSession run in Route Handlers or server actions.

import { cookies } from "next/headers";
import { signToken, verifyToken } from "./token";

const COOKIE_NAME = "synergy_auth";
const MAX_AGE = 60 * 60 * 24; // 1 day — users must re-login at least daily

export async function getSession(): Promise<{ phone: string } | null> {
  const jar = await cookies();
  const payload = await verifyToken(jar.get(COOKIE_NAME)?.value);
  if (!payload) return null;
  return { phone: payload.sub };
}

export async function setSession(phone: string): Promise<void> {
  const token = await signToken({ sub: phone, iat: Date.now() });
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}
