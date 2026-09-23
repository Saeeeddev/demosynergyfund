'use client'

import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverLift?: boolean
}

export function Card({ hoverLift = false, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        // asas card: white, generously rounded, soft diffuse shadow, hairline border
        'bg-surface border border-border rounded-card shadow-[var(--shadow-card)] p-6',
        hoverLift && [
          'cursor-pointer',
          'transition-[box-shadow,transform] duration-200 ease-out motion-reduce:transition-none',
          'hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5',
        ].join(' '),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
