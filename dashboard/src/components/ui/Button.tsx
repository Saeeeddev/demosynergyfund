'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

export type ButtonVariant = 'primary' | 'destructive' | 'dark' | 'energy' | 'secondary' | 'ghost'
export type ButtonSize = 'compact' | 'default' | 'wide'
export type ButtonShape = 'rect' | 'pill'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  shape?: ButtonShape
  icon?: ReactNode
  iconEnd?: ReactNode
  fullWidth?: boolean
}

// [D §9.5] Six button variants: bg / text / hover
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-green-base text-white hover:bg-green-deep active:bg-green-deep',
  destructive:
    'bg-red-base text-white hover:bg-red-deep active:bg-red-deep',
  dark:
    'bg-black-deep text-white hover:bg-black-base active:bg-black-base',
  energy:
    // Gold uses soft bg + near-black text [D §2.5]
    'bg-gold-soft text-text hover:bg-gold-base active:bg-gold-base',
  secondary:
    'bg-surface text-text-2 border border-border hover:bg-hover active:bg-hover',
  ghost:
    'bg-transparent text-text-muted hover:bg-hover active:bg-hover',
}

// Heights: 32px compact / 40px default / 48px wide [D §9.5]
// Mobile: touch target ≥44px — base uses min-h; md+ restores visual height [M §4]
const sizeClasses: Record<ButtonSize, string> = {
  compact: 'min-h-[44px] px-3 text-sm md:min-h-0 md:h-8',
  default: 'min-h-[44px] px-4 text-sm md:min-h-0 md:h-10',
  wide:    'h-12 px-6 text-base',
}

// Radius: --r-md for rect buttons, --r-pill for chip/toggle style [D §9.5]
const shapeClasses: Record<ButtonShape, string> = {
  rect: 'rounded-md',
  pill: 'rounded-pill',
}

export function Button({
  variant = 'primary',
  size = 'default',
  shape = 'rect',
  icon,
  iconEnd,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2',
        'font-medium select-none',
        'transition-colors duration-[120ms] ease-out',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current',
        'motion-reduce:transition-none',
        variantClasses[variant],
        sizeClasses[size],
        shapeClasses[shape],
        fullWidth && 'w-full',
        disabled && 'opacity-50 pointer-events-none cursor-not-allowed',
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {/* Icon on start (right in RTL) — flex RTL places first child at right [D §7] */}
      {icon && <span className="shrink-0 flex items-center">{icon}</span>}
      {children != null && <span>{children}</span>}
      {/* Icon on end (left in RTL) */}
      {iconEnd && <span className="shrink-0 flex items-center">{iconEnd}</span>}
    </button>
  )
}
