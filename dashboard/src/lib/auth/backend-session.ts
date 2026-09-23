"use server";

// Bridge between the Django session and the middleware gate (AUTH.md
// "Migration to Django" steps 2–3). Django owns credentials; the signed
// `synergy_auth` cookie that middleware.ts checks is only ever issued here,
// after the backend has confirmed the session — so the gate cannot be
// obtained without a real Django login.
//
// Locally the Django cookies work across ports because cookies are
// host-scoped (`localhost`), not port-scoped. In production, api.<domain> and
// d.<domain> are different hosts, so this only keeps working because the
// backend's COOKIE_DOMAIN setting (e.g. ".synergyy.ir") widens Django's
// Set-Cookie to cover both subdomains, and relayDjangoCookies below actually
// preserves that Domain attribute instead of dropping it.

import { cookies } from "next/headers";
import { setSession } from "./session";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export interface LoginResult {
  ok: true;
}

export interface LoginError {
  ok: false;
  error: string;
}

export type LoginResponse = LoginResult | LoginError;

/** Copy Django's Set-Cookie headers (sessionid, csrftoken) onto our response
 *  so the browser holds them exactly as if it had called Django directly.
 *
 *  The `Domain` attribute must be preserved, not just name/value/max-age: once
 *  COOKIE_DOMAIN is set on the backend (e.g. ".synergyy.ir" in production),
 *  Django's Set-Cookie carries that domain so the cookie works on both
 *  d.<domain> and api.<domain>. Dropping it here would silently re-issue a
 *  host-only cookie scoped to this app's own origin instead — which is
 *  exactly the bug that broke login across subdomains before this fix. */
export async function relayDjangoCookies(response: Response): Promise<void> {
  const jar = await cookies();
  for (const raw of response.headers.getSetCookie()) {
    const [pair, ...attrs] = raw.split(";");
    const eq = pair.indexOf("=");
    const name = pair.slice(0, eq).trim();
    const value = pair.slice(eq + 1).trim();
    if (name !== "sessionid" && name !== "csrftoken") continue;
    const trimmedAttrs = attrs.map((a) => a.trim());
    const maxAgeAttr = trimmedAttrs.find((a) => a.toLowerCase().startsWith("max-age="));
    const domainAttr = trimmedAttrs.find((a) => a.toLowerCase().startsWith("domain="));
    jar.set(name, value, {
      httpOnly: name === "sessionid",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      domain: domainAttr ? domainAttr.split("=")[1] : undefined,
      maxAge: maxAgeAttr ? Number(maxAgeAttr.split("=")[1]) : undefined,
    });
  }
}

export async function loginAction(
  phone: string,
  password: string,
): Promise<LoginResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: phone.trim(), password }),
      cache: "no-store",
    });
  } catch {
    return { ok: false, error: "اتصال به سرور برقرار نشد. بعداً تلاش کنید." };
  }

  if (response.status === 429) {
    return { ok: false, error: "تلاش‌های ناموفق زیاد است. کمی بعد دوباره تلاش کنید." };
  }
  if (!response.ok) {
    return { ok: false, error: "شماره موبایل یا رمز عبور اشتباه است" };
  }

  await relayDjangoCookies(response);
  await setSession(phone.trim());
  return { ok: true };
}

/** For flows where the browser already obtained a Django session directly
 *  (Register auto-login): verify it against /me, then issue the gate cookie. */
export async function syncSessionFromBackend(): Promise<boolean> {
  const jar = await cookies();
  const sessionId = jar.get("sessionid")?.value;
  if (!sessionId) return false;

  let response: Response;
  try {
    response = await fetch(`${API_URL}/me`, {
      headers: { Cookie: `sessionid=${sessionId}` },
      cache: "no-store",
    });
  } catch {
    return false;
  }
  if (!response.ok) return false;

  const user = (await response.json()) as { phone?: string };
  if (!user.phone) return false;
  await setSession(user.phone);
  return true;
}
