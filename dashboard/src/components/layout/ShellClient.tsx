'use client'

import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar, MobilePageTitle } from './TopBar'
import { MobileBottomNav } from './MobileBottomNav'
import { MobileDrawer } from './MobileDrawer'
import { NavProgressProvider } from './NavProgress'
import { DemoBanner } from '@/components/demo/DemoBanner'

interface ShellClientProps {
  children: React.ReactNode
}

export default function ShellClient({ children }: ShellClientProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <NavProgressProvider>
      {/*
        Outer: full-viewport gray field (#F7F7F7 = --bg).
        In RTL: sidebar (first DOM element) appears on the RIGHT [D §6.1].
      */}
      <div className="flex h-[100dvh] overflow-hidden bg-[linear-gradient(135deg,#E3E8F3_0%,#ECE5F6_50%,#E4EDF6_100%)]">
        {/* Persistent sidebar — desktop only [M §2], inline-start = right in RTL */}
        <Sidebar />

        {/* Content column: TopBar + scrollable page content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopBar />
          <DemoBanner />

          {/*
            White content box — edge-to-edge on phone, 8px margin + 24px radius on md+.
            border + shadow give the floating-card look from Reference A [D §1, M §5.1].
          */}
          <main className="content-box flex-1 overflow-y-auto pb-20 lg:pb-0">
            {/* Page title at the top of the scrollable content on mobile (non-sticky,
                page-colored). Desktop uses each page's own <PageHeader> instead. */}
            <MobilePageTitle />
            {children}
          </main>
        </div>
      </div>

      {/* Mobile shell — bottom tab bar + drawer (hidden at lg+) */}
      <MobileBottomNav onOpenDrawer={() => setDrawerOpen(true)} />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </NavProgressProvider>
  )
}
