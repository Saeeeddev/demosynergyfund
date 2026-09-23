// Full-screen shell for auth pages — no sidebar, no top bar [F §0.1, A §3.2]
// Pages own their layout: Login/Register render the split AuthShell,
// Forgot-password centers its own card. This layout only provides the canvas.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-[100dvh] bg-bg">{children}</div>;
}
