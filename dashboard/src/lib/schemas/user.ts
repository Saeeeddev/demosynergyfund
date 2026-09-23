import { z } from "zod";

export const VerificationStatusSchema = z.enum([
  "pending",
  "verified",
  "rejected",
]);

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  name: z.string(),
  // A phone-first platform: email is optional profile data, often empty.
  email: z.string(),
  phone: z.string(),
  role: z.string(),
  avatar: z.string().optional(),
  verificationStatus: VerificationStatusSchema,
  // snake_case: UserSerializer keeps these for compatibility, predating the
  // camelCase contract — only ProfileForm reads them (to prefill/save).
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  // False until InvestmentPromptSeenView is hit; then permanently true.
  hasSeenInvestmentPrompt: z.boolean(),
});

export const NotificationTypeSchema = z.enum(["payout", "performance", "broadcast"]);

export const NotificationSchema = z.object({
  id: z.string(),
  type: NotificationTypeSchema,
  title: z.string(),
  body: z.string(),
  timestamp: z.string(),
  read: z.boolean(),
});

export type User = z.infer<typeof UserSchema>;
export type Notification = z.infer<typeof NotificationSchema>;
