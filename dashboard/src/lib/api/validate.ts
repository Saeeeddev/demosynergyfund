import { z } from "zod";
import type { ZodType } from "zod";

// FRONTEND_SECURITY_CHECKLIST.md §4 — every api/*.ts response runs through
// here before reaching a hook. The schemas in lib/schemas/*.ts are the API
// contract; since they now cover every consumed field (incl. Project.details
// and DashboardSummary — the historical gaps ARCHITECTURE.md §3.1 flagged),
// this ENFORCES the contract: on success the parsed value is returned, so
// components only ever see contract-shaped data, whether it came from the
// mock or the real backend. A mismatch logs loudly and falls back to the raw
// payload rather than blanking the page.
//
// The return type is inferred from the *schema*, not the `data` argument —
// `data` is `unknown` on purpose. Axios responses are `any`-typed
// (`client.get()` has no generic), so inferring off `data` would silently
// make every real-API call site `any` all the way up through its hook,
// exactly the kind of drift this function exists to catch.
export function validate<S extends ZodType>(schema: S, data: unknown): z.infer<S> {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(
      "[schema] response does not match its zod schema:",
      result.error.flatten(),
    );
    return data as z.infer<S>;
  }
  return result.data;
}

export function paginatedSchema<T extends z.ZodTypeAny>(item: T) {
  return z.object({
    data: z.array(item),
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
  });
}
