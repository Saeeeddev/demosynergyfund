'use client'

// Global top progress bar for client-side route transitions.
//
// Next.js route-level loading.tsx covers the *destination* skeleton, but on slow
// connections users want immediate confirmation that their tap registered. Each
// nav <Link> renders a <NavPendingReporter/> child that reads useLinkStatus and
// reports its pending state up to this provider, which shows a thin top bar while
// any navigation is in flight. [F §1] — "let the user know nothing stopped".

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useLinkStatus } from 'next/link'

interface NavProgressApi {
  inc: () => void
  dec: () => void
}

const NavProgressContext = createContext<NavProgressApi | null>(null)

export function NavProgressProvider({ children }: { children: ReactNode }) {
  const [pendingCount, setPendingCount] = useState(0)

  const apiRef = useRef<NavProgressApi>({
    inc: () => setPendingCount((c) => c + 1),
    dec: () => setPendingCount((c) => Math.max(0, c - 1)),
  })

  return (
    <NavProgressContext.Provider value={apiRef.current}>
      {pendingCount > 0 && (
        <div className="nav-progress" role="status" aria-label="در حال بارگذاری صفحه" />
      )}
      {children}
    </NavProgressContext.Provider>
  )
}

// Render inside a <Link>. Reports that link's pending navigation to the provider.
export function NavPendingReporter() {
  const { pending } = useLinkStatus()
  const api = useContext(NavProgressContext)

  useEffect(() => {
    if (!api || !pending) return
    api.inc()
    return () => api.dec()
  }, [pending, api])

  return null
}
