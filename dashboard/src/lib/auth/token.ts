// Signed session tokens (HMAC-SHA256 via Web Crypto — Edge + Node safe).
//
// Security model: the cookie value is `<payload>.<signature>`. The signature is
// an HMAC of the payload keyed by SESSION_SECRET. A cookie is only trusted if its
// signature recomputes correctly, so it cannot be forged or hand-edited.
//
// Rotating SESSION_SECRET invalidates EVERY existing cookie at once → all users
// are logged out. See docs/Syerngy_versions/v1/AUTH.md.

const encoder = new TextEncoder();

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set");
  }
  return secret;
}

function base64urlEncode(bytes: Uint8Array): string {
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecode(input: string): Uint8Array {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const str = atob(b64);
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
  return bytes;
}

async function hmac(data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return new Uint8Array(sig);
}

// Constant-time string comparison to avoid signature timing leaks.
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export interface SessionPayload {
  sub: string; // phone number (login identifier)
  iat: number; // issued-at (ms epoch)
}

export async function signToken(payload: SessionPayload): Promise<string> {
  const body = base64urlEncode(encoder.encode(JSON.stringify(payload)));
  const sig = base64urlEncode(await hmac(body));
  return `${body}.${sig}`;
}

export async function verifyToken(
  token: string | undefined | null
): Promise<SessionPayload | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;

  const expected = base64urlEncode(await hmac(body));
  if (!timingSafeEqual(sig, expected)) return null;

  try {
    const payload = JSON.parse(
      new TextDecoder().decode(base64urlDecode(body))
    ) as SessionPayload;
    if (typeof payload.sub !== "string" || typeof payload.iat !== "number") {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
