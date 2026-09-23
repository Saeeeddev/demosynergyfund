import ShellClient from '@/components/layout/ShellClient'

// Panel layout — wraps every authenticated page in the app shell.
// ShellClient owns the interactive shell state (drawer, dropdowns, search overlay).
// Page content is passed as server-rendered children: Next.js evaluates children
// as server components even though ShellClient is a client component. [A §3.2]
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return <ShellClient>{children}</ShellClient>
}
