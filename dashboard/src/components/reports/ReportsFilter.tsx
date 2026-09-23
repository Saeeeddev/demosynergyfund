'use client'

// [F §6] Reports filter — search only.
// The previous date-range inputs used the browser-native <input type="date">,
// which renders a Gregorian/English calendar that clashes with the Jalali RTL UI.
// Per product direction it was removed; search covers the common case. The
// dateFrom/dateTo fields remain on FilterState (always '') so DocumentLibrary's
// optional date filtering keeps working if a Jalali picker is added later.

import { SearchField } from '@/components/ui/SearchField'

export interface FilterState {
  search: string
  dateFrom: string
  dateTo: string
}

interface ReportsFilterProps {
  value: FilterState
  onChange: (f: FilterState) => void
}

export function ReportsFilter({ value, onChange }: ReportsFilterProps) {
  const set = (patch: Partial<FilterState>) => onChange({ ...value, ...patch })

  return (
    <SearchField
      value={value.search}
      onChange={(e) => set({ search: e.target.value })}
      className="w-full md:w-72"
      placeholder="جستجوی گزارش…"
    />
  )
}
