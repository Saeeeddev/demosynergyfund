'use client'

import { useTransition, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Button, type ButtonVariant, type ButtonSize, type ButtonShape } from './Button'
import { Spinner } from './Spinner'

// A Button that navigates via the router and shows a spinner immediately on click
// for the whole pending transition — so slow destinations give instant feedback
// before the page actually changes. [F §1] navigation loading.
interface NavButtonProps {
  href: string
  children?: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  shape?: ButtonShape
  fullWidth?: boolean
  icon?: ReactNode
  iconEnd?: ReactNode
  className?: string
  disabled?: boolean
  'aria-label'?: string
}

export function NavButton({
  href,
  children,
  icon,
  iconEnd,
  disabled,
  ...rest
}: NavButtonProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  return (
    <Button
      {...rest}
      disabled={disabled || pending}
      icon={pending ? <Spinner size={16} /> : icon}
      iconEnd={pending ? undefined : iconEnd}
      onClick={() => startTransition(() => router.push(href))}
    >
      {children}
    </Button>
  )
}
