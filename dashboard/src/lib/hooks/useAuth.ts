"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGetMe, apiUpdateProfile, apiMarkInvestmentPromptSeen } from "@/lib/api/auth";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: apiGetMe,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiUpdateProfile,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  });
}

export function useMarkInvestmentPromptSeen() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiMarkInvestmentPromptSeen,
    onSuccess: (user) => qc.setQueryData(["me"], user),
  });
}
