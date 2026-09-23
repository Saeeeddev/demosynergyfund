"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiBuyWatts, apiSellWatts, apiUserOwnsProject } from "@/lib/api/investments";

export function useUserOwnsProject(projectId: string) {
  return useQuery({
    queryKey: ["owns", projectId],
    queryFn: () => apiUserOwnsProject(projectId),
  });
}

export function useBuyWatts() {
  const queryClient = useQueryClient();
  return useMutation({
    // The backend prices every trade itself (quote → execute) — no fee rate
    // to pass in; see lib/api/investments.ts.
    mutationFn: ({ projectId, sharesCount }: { projectId: string; sharesCount: number }) =>
      apiBuyWatts(projectId, sharesCount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project"] });
      queryClient.invalidateQueries({ queryKey: ["owns"] });
    },
  });
}

export function useSellWatts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, sharesCount }: { projectId: string; sharesCount: number }) =>
      apiSellWatts(projectId, sharesCount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project"] });
      queryClient.invalidateQueries({ queryKey: ["owns"] });
    },
  });
}
