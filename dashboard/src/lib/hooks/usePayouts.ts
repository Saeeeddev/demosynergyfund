"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  apiGetIncomeSummary,
  apiGetPayouts,
  apiGetPayoutMethod,
  apiSaveBankCard,
} from "@/lib/api/payouts";

export function useIncomeSummary() {
  return useQuery({
    queryKey: ["income", "summary"],
    queryFn: apiGetIncomeSummary,
  });
}

// Desktop: page-keyed payout history — [D §9.22]
export function usePayouts(page: number) {
  return useQuery({
    queryKey: ["payouts", page],
    queryFn: () => apiGetPayouts(page),
    placeholderData: keepPreviousData,
    retry: 1,
  });
}

// Mobile: infinite payout history — [M §7.7]
export function usePayoutsInfinite() {
  return useInfiniteQuery({
    queryKey: ["payouts", "infinite"],
    queryFn: ({ pageParam = 1 }) => apiGetPayouts(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < last.totalPages ? last.page + 1 : undefined,
  });
}

export function usePayoutMethod() {
  return useQuery({
    queryKey: ["payout-method"],
    queryFn: apiGetPayoutMethod,
  });
}

export function useSaveBankCard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiSaveBankCard,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payout-method"] });
      qc.invalidateQueries({ queryKey: ["cash", "config"] });
    },
  });
}
