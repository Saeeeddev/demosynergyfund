"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  apiGetVerification,
  apiSubmitVerification,
  apiUploadVerificationDocument,
} from "@/lib/api/kyc";
import type { VerificationDocKind } from "@/lib/schemas/kyc";

const VERIFICATION_KEY = ["kyc", "verification"];

export function useVerification() {
  return useQuery({
    queryKey: VERIFICATION_KEY,
    queryFn: apiGetVerification,
  });
}

/** One-shot KYC: national ID + birth date + all three documents, submitted
 *  together as a single user action (national ID must land first since the
 *  documents attach to the verification row it creates). */
export function useSubmitFullVerification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      nationalId,
      birthDate,
      documents,
    }: {
      nationalId: string;
      birthDate: string;
      documents: { kind: VerificationDocKind; file: File }[];
    }) => {
      await apiSubmitVerification(nationalId, birthDate);
      for (const { kind, file } of documents) {
        await apiUploadVerificationDocument(kind, file);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: VERIFICATION_KEY });
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
