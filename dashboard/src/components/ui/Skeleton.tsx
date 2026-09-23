'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils/cn'

// [D §9.20] Skeleton shimmer placeholder
// - .skeleton CSS class (defined in design-tokens.css) provides the sweep animation
// - border-radius: inherit picks up the parent card's radius
// - Shape-matched via className (caller sets w-* h-* rounded-*)
// - count prop repeats multiple blocks (e.g. table rows)
// - 100ms debounce before showing — prevents flash on fast loads [D §9.20]
// - Reduced-motion: .skeleton CSS already switches to solid --hover [D §9.20]

interface SkeletonProps {
  /** Tailwind classes to control size/shape: e.g. "h-28 w-full rounded-card" */
  className?: string
  /** Number of skeleton blocks to render (default 1) */
  count?: number
}

export function Skeleton({ className, count = 1 }: SkeletonProps) {
  // Debounce: only show after 100ms so fast data doesn't flash a skeleton [D §9.20]
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'skeleton',   // defined in design-tokens.css: shimmer sweep + reduced-motion solid
            className,
          )}
          aria-hidden="true"
        />
      ))}
    </>
  )
}
