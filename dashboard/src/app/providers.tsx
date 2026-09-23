"use client";

import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "@/components/ui/Toaster";
import { toast, toFriendlyMessage } from "@/lib/toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        // Surface a popup whenever a background fetch/mutation fails so the user
        // knows it's a connection/server problem — not the app freezing. [F §1]
        queryCache: new QueryCache({
          onError: (error) => {
            toast.error(toFriendlyMessage(error));
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            toast.error(toFriendlyMessage(error));
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
}
