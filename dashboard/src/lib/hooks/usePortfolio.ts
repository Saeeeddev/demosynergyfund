"use client";

import {
  useQuery,
  useInfiniteQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  apiGetDashboardSummary,
  apiGetActivities,
  apiGetPortfolioSummary,
  apiGetHoldings,
  apiGetPerformance,
  apiGetGeo,
  apiGetOrders,
} from "@/lib/api/portfolio";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: apiGetDashboardSummary,
  });
}

export function useActivities(page: number) {
  return useQuery({
    queryKey: ["activities", page],
    queryFn: () => apiGetActivities(page),
    placeholderData: keepPreviousData,
    retry: 1,
  });
}

export function usePortfolioSummary() {
  return useQuery({
    queryKey: ["portfolio", "summary"],
    queryFn: apiGetPortfolioSummary,
  });
}

export function useHoldings(page = 1, pageSize = 6) {
  return useQuery({
    queryKey: ["portfolio", "holdings", page, pageSize],
    queryFn: () => apiGetHoldings(page, pageSize),
  });
}

export function usePerformance() {
  return useQuery({
    queryKey: ["portfolio", "performance"],
    queryFn: apiGetPerformance,
  });
}

export function useGeo() {
  return useQuery({
    queryKey: ["portfolio", "geo"],
    queryFn: apiGetGeo,
  });
}

// Desktop: page-keyed order history — [D §9.22]
export function useOrders(page: number) {
  return useQuery({
    queryKey: ["orders", page],
    queryFn: () => apiGetOrders(page),
    placeholderData: keepPreviousData,
    retry: 1,
  });
}

// Mobile: infinite order history — [M §7.7]
export function useOrdersInfinite() {
  return useInfiniteQuery({
    queryKey: ["orders", "infinite"],
    queryFn: ({ pageParam = 1 }) => apiGetOrders(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < last.totalPages ? last.page + 1 : undefined,
  });
}
