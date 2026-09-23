import { cn } from '@/lib/utils/cn'

interface SpinnerProps {
  /** Diameter in px (default 18) */
  size?: number
  className?: string
  /** Accessible label; defaults to a Farsi "loading" label */
  label?: string
}

// Indeterminate loading spinner. Uses `currentColor` so it inherits the
// surrounding text color (e.g. white inside a primary button).
export function Spinner({ size = 18, className, label = 'در حال بارگذاری' }: SpinnerProps) {
  return (
    <svg
      role="status"
      aria-label={label}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn('spin shrink-0', className)}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}
