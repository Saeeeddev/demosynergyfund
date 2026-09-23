// Shared label/value cell used across the project-detail tab components.
export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border border-border rounded-md px-3 py-2">
      <span className="text-[12px] text-text-muted">{label}</span>
      <span className="text-[14px] font-semibold text-text">{value}</span>
    </div>
  )
}
