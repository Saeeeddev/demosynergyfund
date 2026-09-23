'use client'

import { InputHTMLAttributes, ReactNode, forwardRef, useId } from 'react'
import { cn } from '@/lib/utils/cn'

// [D §9.18] Label above / field / helper-error below
// Focus ring = Green tint outline + Green-base border (role tint default)
// Mobile: min-height 48px, font-size ≥16px to prevent iOS auto-zoom [M §7.5, M §10]
// Checkbox sub-component also exported (§9.18 checkboxes + blue rules link)

/* ------------------------------------------------------------------ */
/* Input field                                                          */
/* ------------------------------------------------------------------ */

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helper?: string
  error?: string
  wrapperClassName?: string
  /** Element rendered inside the field on the end side (left in RTL), e.g. a password toggle. */
  endAdornment?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, helper, error, className, wrapperClassName, endAdornment, ...props },
  ref,
) {
  const uid = useId()
  const inputId = props.id ?? uid
  const hasError = Boolean(error)

  return (
    <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-[13px] font-medium text-text-muted leading-none"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          aria-invalid={hasError || undefined}
          aria-describedby={
            error    ? `${inputId}-msg` :
            helper   ? `${inputId}-msg` :
            undefined
          }
          className={cn(
            'w-full bg-surface border rounded-md',
            'ps-4',
            // Leave room for the trailing adornment when present
            endAdornment ? 'pe-11' : 'pe-4',
            // Mobile: 48px height, ≥16px font; desktop: 40px height, 14px font [M §7.5, M §10]
            'h-12 text-[16px] md:h-10 md:text-[14px]',
            'text-text placeholder:text-text-subtle',
            'transition-colors duration-[120ms] ease-out motion-reduce:transition-none',
            'focus:outline-none focus:ring-2',
            hasError
              ? 'border-red-base focus:ring-red-tint focus:border-red-base'
              : 'border-border-strong focus:ring-green-tint focus:border-green-base',
            className,
          )}
          {...props}
        />

        {endAdornment && (
          <div className="absolute inset-y-0 end-0 flex items-center pe-2">
            {endAdornment}
          </div>
        )}
      </div>

      {(error || helper) && (
        <p
          id={`${inputId}-msg`}
          role={error ? 'alert' : undefined}
          className={cn(
            'text-[12px] leading-tight',
            error ? 'text-red-base' : 'text-text-subtle',
          )}
        >
          {error ?? helper}
        </p>
      )}
    </div>
  )
})

/* ------------------------------------------------------------------ */
/* Checkbox sub-component [D §9.18]                                    */
/* 18px box, checked = Green fill + white check; rules link = Blue     */
/* ------------------------------------------------------------------ */

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: ReactNode   // supports inline links inside label text
  id?: string
  className?: string
}

export function Checkbox({ checked, onChange, label, id, className }: CheckboxProps) {
  const uid = useId()
  const checkId = id ?? uid

  return (
    <label
      htmlFor={checkId}
      className={cn(
        'inline-flex items-start gap-2.5 cursor-pointer select-none',
        // Touch target ≥44px vertically [M §4]
        'min-h-[44px]',
        className,
      )}
    >
      {/* Hidden native checkbox for a11y */}
      <input
        type="checkbox"
        id={checkId}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />

      {/* Custom visual checkbox — 18px box [D §9.18] */}
      <span
        aria-hidden="true"
        className={cn(
          'shrink-0 mt-0.5',
          'w-[18px] h-[18px] rounded-[4px]',
          'border-2 flex items-center justify-center',
          'transition-colors duration-[120ms] ease-out motion-reduce:transition-none',
          checked
            ? 'bg-green-base border-green-base'
            : 'bg-surface border-border-strong',
        )}
      >
        {checked && (
          <svg
            width="10"
            height="8"
            viewBox="0 0 10 8"
            fill="none"
            className="text-white"
            aria-hidden="true"
          >
            <path
              d="M1 4l2.5 2.5L9 1"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>

      {/* Label text — supports ReactNode so caller can embed a blue link [D §9.18] */}
      <span className="text-[14px] text-text-2 leading-relaxed">{label}</span>
    </label>
  )
}

/* ------------------------------------------------------------------ */
/* CheckboxLink helper — Blue underlined rules link inside checkbox    */
/* [D §9.18] "the rules link uses Blue (#243344) underlined"           */
/* ------------------------------------------------------------------ */

interface CheckboxLinkProps {
  href: string
  children: ReactNode
}

export function CheckboxLink({ href, children }: CheckboxLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-deep underline hover:text-blue-base"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </a>
  )
}
