"use client";

import {
  useQuery,
  useInfiniteQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import { apiListProjects, apiGetProject } from "@/lib/api/projects";

const PAGE_SIZE = 8;

// Desktop: page-keyed query — [D §9.22]
export function useProjects(page: number) {
  return useQuery({
    queryKey: ["projects", page],
    queryFn: () => apiListProjects(page, PAGE_SIZE),
    placeholderData: keepPreviousData,
    retry: 1,
  });
}

// Mobile: infinite query for load-more — [M §7.7]
export function useProjectsInfinite() {
  return useInfiniteQuery({
    queryKey: ["projects", "infinite"],
    queryFn: ({ pageParam = 1 }) => apiListProjects(pageParam as number, PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < last.totalPages ? last.page + 1 : undefined,
  });
}

// One flat list of every project — for filter dropdowns (e.g. the reports
// page's "reports by project"), where pagination would only get in the way.
export function useAllProjects() {
  return useQuery({
    queryKey: ["projects", "all"],
    queryFn: () => apiListProjects(1, 100),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => apiGetProject(id),
    staleTime: 2 * 60 * 1000,
    // Don't fetch until we have a real id — callers (e.g. the dashboard
    // showcase card) render before holdings load and pass '' for one tick,
    // which would 404 and fire the global error toast.
    enabled: id !== "",
  });
}
