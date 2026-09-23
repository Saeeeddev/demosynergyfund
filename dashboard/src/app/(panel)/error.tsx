'use client'

import { ErrorState } from '@/components/ui/ErrorState'

// Panel-level error boundary [A §3.2, D §9.21]
// Shown when a critical failure makes the panel content unrenderable.
// The sidebar + top bar remain visible — this only covers the content area [D §9.21].
// The "reset" prop is the Next.js boundary reset: re-renders the segment, never full reload.
export default function PanelError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorState
      scope="page"
      onRetry={reset}
    />
  )
}
