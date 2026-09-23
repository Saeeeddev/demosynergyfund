import { z } from "zod";

// KYC verification (backend/apps/kyc/api.py, /api/kyc/verification).
// "not_submitted" is synthetic — the view returns it when no Verification
// row exists yet; "pending"/"approved"/"rejected" mirror Verification.Status.

export const VerificationDocKindSchema = z.enum([
  "national_card_front",
  "national_card_back",
  "selfie",
  "other",
]);

export const VerificationDocSchema = z.object({
  id: z.number(),
  kind: VerificationDocKindSchema,
  content_type: z.string(),
  size: z.number(),
  uploaded_at: z.string(),
  url: z.string(),
});

export const VerificationSchema = z.object({
  status: z.enum(["not_submitted", "pending", "approved", "rejected"]),
  national_id: z.string().optional(),
  birth_date: z.string().nullable().optional(),
  shahkar_matched: z.boolean().nullable().optional(),
  reject_reason: z.string().nullable().optional(),
  submitted_at: z.string().nullable().optional(),
  reviewed_at: z.string().nullable().optional(),
  documents: z.array(VerificationDocSchema).default([]),
});

export type VerificationDocKind = z.infer<typeof VerificationDocKindSchema>;
export type VerificationDoc = z.infer<typeof VerificationDocSchema>;
export type Verification = z.infer<typeof VerificationSchema>;
