'use client'

import { ErrorState } from '@/components/ui/ErrorState'

// [D §9.21] Invest page error boundary — full-section, sidebar + topbar stay visible

export default function ErrorBoundary({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="p-4 lg:p-5">
      <ErrorState scope="page" onRetry={reset} />
    </div>
  )
}
