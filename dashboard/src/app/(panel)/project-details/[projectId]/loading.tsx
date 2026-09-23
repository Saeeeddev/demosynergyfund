// [D §9.20] Project details skeleton — shape-matched to the 3-row layout
// Phone mobile-first stack order [M §7.8, M §6.7]

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-5 lg:p-5">
      {/* Row 1: header skeleton */}
      <div className="skeleton h-64 rounded-card" />

      {/* Row 2: tabs + calculator */}
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-4 lg:gap-5">
        <div className="skeleton h-64 rounded-card lg:col-span-1" />
        <div className="skeleton h-64 rounded-card lg:col-span-3" />
      </div>

      {/* Row 3: ROI forecast */}
      <div className="skeleton h-24 rounded-card" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <div className="skeleton h-24 rounded-card" />
        <div className="skeleton h-24 rounded-card" />
        <div className="skeleton h-24 rounded-card" />
        <div className="skeleton h-24 rounded-card" />
      </div>
      <div className="skeleton h-72 rounded-card" />
    </div>
  )
}
