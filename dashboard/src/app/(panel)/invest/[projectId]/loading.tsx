// [D §9.20] Invest page skeleton — shape-matched to the 3-step layout
// Mobile stack order: stepper → 3 boxes stacked [M §7.8]

export default function Loading() {
  return (
    <div className="p-4 lg:p-5 flex flex-col gap-4">
      {/* Stepper */}
      <div className="skeleton h-12 rounded-[var(--r-card)]" />
      {/* Step 1 content */}
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:gap-5">
        {/* Right: 3 boxes */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="skeleton h-28 rounded-[var(--r-card)]" />
          <div className="skeleton h-56 rounded-[var(--r-card)]" />
          <div className="skeleton h-40 rounded-[var(--r-card)]" />
        </div>
        {/* Left: review box */}
        <div className="skeleton h-80 rounded-[var(--r-card)]" />
      </div>
    </div>
  )
}
