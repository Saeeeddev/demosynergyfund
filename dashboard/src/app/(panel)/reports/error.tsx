'use client'

import { ErrorState } from '@/components/ui/ErrorState'

export default function ReportsError({
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
