"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  apiGetCashConfig,
  apiDepositGateway,
  apiDepositBankTransfer,
  apiWithdraw,
} from "@/lib/api/cash";

// Cash config: deposit gateways, user + platform accounts, withdraw limits.
export function useCashConfig() {
  return useQuery({
    queryKey: ["cash", "config"],
    queryFn: apiGetCashConfig,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDepositGateway() {
  return useMutation({
    mutationFn: (amount: number) => apiDepositGateway(amount),
  });
}

export function useDepositBankTransfer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ amount, receipt }: { amount: number; receipt: File }) =>
      apiDepositBankTransfer(amount, receipt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["income"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });
}

export function useWithdraw() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ amount, iban }: { amount: number; iban: string }) => apiWithdraw(amount, iban),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["income"] });
    },
  });
}
