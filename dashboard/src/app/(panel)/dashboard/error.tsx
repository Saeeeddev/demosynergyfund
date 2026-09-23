'use client'

// [D §9.21] Dashboard page-level error boundary — shell stays visible, only content replaced
import { ErrorState } from '@/components/ui/ErrorState'

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <ErrorState scope="page" onRetry={reset} />
    </div>
  )
}
