'use client'

// [§9.21] Error boundary for Sell page — uses shared ErrorState component
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
