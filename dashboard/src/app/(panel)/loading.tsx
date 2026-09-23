// Panel-level skeleton fallback [A §3.2, D §9.20]
// Shown while the shell and first page are loading.
// Follows the mobile-first stack order [M §7.8].
export default function PanelLoading() {
  return (
    <div className="p-4 lg:p-6 flex flex-col gap-4">
      {/* Row 1 — full-width cash card placeholder */}
      <div className="skeleton h-28 rounded-card" />

      {/* Row 2 — 4 stat cards: 2×2 on phone, 4-up on desktop [M §7.8] */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-28 rounded-card" />
        ))}
      </div>

      {/* Row 3 — chart + donut: stacked on phone, 60/40 on desktop */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-10 lg:gap-5">
        <div className="skeleton h-72 rounded-card lg:col-span-7" />
        <div className="skeleton h-72 rounded-card lg:col-span-3" />
      </div>

      {/* Row 4 — activity table */}
      <div className="rounded-card border border-border overflow-hidden">
        <div className="skeleton h-10 rounded-none" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton h-14 rounded-none border-t border-border" />
        ))}
      </div>
    </div>
  )
}
