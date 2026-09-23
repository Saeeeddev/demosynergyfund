import { client } from "./client";
import { validate } from "./validate";
import { VerificationSchema, type VerificationDocKind } from "@/lib/schemas/kyc";
import { DEMO_MODE } from "@/lib/demo/config";
import { demoService } from "@/lib/demo/service";

export async function apiGetVerification() {
  if (DEMO_MODE) return demoService.verification();
  const res = await client.get("/kyc/verification");
  return validate(VerificationSchema, res.data);
}

export async function apiSubmitVerification(nationalId: string, birthDate: string) {
  if (DEMO_MODE) return demoService.submitVerification(nationalId, birthDate);
  const res = await client.post("/kyc/verification", {
    national_id: nationalId,
    birth_date: birthDate,
  });
  return validate(VerificationSchema, res.data);
}

export async function apiUploadVerificationDocument(kind: VerificationDocKind, file: File) {
  if (DEMO_MODE) return demoService.uploadVerificationDocument(kind, file);
  const form = new FormData();
  form.append("kind", kind);
  form.append("file", file);
  await client.post("/kyc/verification/documents", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
