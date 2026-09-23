'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

// Back link shown at the top of a flow page. In RTL "back" points right, so
// ArrowRight is the correct visual affordance. [F §10/§12] back navigation.
interface BackButtonProps {
  href: string
  label: string
  className?: string
}

export function BackButton({ href, label, className }: BackButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center gap-1.5 w-fit',
        'text-[13px] font-medium text-text-muted hover:text-text',
        'transition-colors duration-[120ms] ease-out motion-reduce:transition-none',
        'min-h-[44px] md:min-h-0',
        className,
      )}
    >
      <ArrowRight size={18} strokeWidth={2} className="shrink-0" />
      <span>{label}</span>
    </Link>
  )
}
