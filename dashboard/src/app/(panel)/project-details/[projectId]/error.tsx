'use client'

// [D §9.21] Project details error boundary — full-section scope
// Sidebar + top bar stay visible; only content area shows error [D §9.21]

import { ErrorState } from '@/components/ui/ErrorState'

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
