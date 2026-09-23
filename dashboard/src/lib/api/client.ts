// Axios instance for the real Django API (REALWORLD_API.md §0, AUTH.md
// "Migration to Django" step 3: Django session cookie + CSRF).
// Base URL comes from NEXT_PUBLIC_API_URL (http://localhost:8000/api in dev);
// withCredentials carries the Django sessionid/csrftoken cookies, which are
// host-scoped to `localhost` and therefore shared across the :3000/:8000 ports.
// Every domain is wired to this client now — there is no mock branch left.

import axios from "axios";

const UNSAFE_METHODS = new Set(["post", "put", "patch", "delete"]);

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

// Django enforces CSRF on session-authenticated unsafe requests: the csrftoken
// cookie must be echoed back as the X-CSRFToken header. GET /auth/csrf plants
// the cookie the first time (backend api.py `csrf`).
client.interceptors.request.use(async (config) => {
  if (UNSAFE_METHODS.has((config.method ?? "get").toLowerCase())) {
    let token = readCookie("csrftoken");
    if (!token) {
      await axios.get(`${client.defaults.baseURL}/auth/csrf`, {
        withCredentials: true,
      });
      token = readCookie("csrftoken");
    }
    if (token) config.headers["X-CSRFToken"] = token;
  }
  return config;
});

// The middleware gate (synergy_auth) is a separately-signed cookie with its
// own 1-day expiry — it does not know when the real Django session behind it
// has died (expired server-side, been revoked, etc.). Without this, a dead
// session shows the "access expired" toast forever: the gate cookie keeps
// letting every page through, but every API call keeps failing, and nothing
// ever sends the user back to /login. React Query's global onError only
// toasts (app/providers.tsx) — this is the one place that actually acts on
// "the backend says I'm not authenticated" for every client.* call at once.
const AUTH_PAGE_PREFIXES = ["/login", "/register", "/forgot-password"];
let loggingOut = false;

function onAuthPage(): boolean {
  if (typeof window === "undefined") return true;
  return AUTH_PAGE_PREFIXES.some((p) => window.location.pathname.startsWith(p));
}

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error.response?.status;
    if ((status === 401 || status === 403) && typeof window !== "undefined" && !onAuthPage() && !loggingOut) {
      loggingOut = true;
      // Clears the gate cookie (and best-effort invalidates the Django session)
      // so middleware.ts stops letting the dead session through next time too.
      await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export { client };
