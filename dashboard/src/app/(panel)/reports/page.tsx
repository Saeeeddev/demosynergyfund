'use client'

// [F §6] Reports page: total stat → category chips → filter → document library
// [M §6.6] Phone: stat → scrollable chip row → search+filter button → stacked doc rows

import { useState } from 'react'
import { FileBarChart, FileText } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { PageHeader } from '@/components/ui/PageHeader'
import { Dropdown } from '@/components/ui/Dropdown'
import { CategoryChips, type ReportCategory } from '@/components/reports/CategoryChips'
import { ReportsFilter, type FilterState } from '@/components/reports/ReportsFilter'
import { DocumentLibrary } from '@/components/reports/DocumentLibrary'
import { useReports } from '@/lib/hooks/useReports'
import { useAllProjects } from '@/lib/hooks/useProjects'
import { bidiIsolate } from '@/lib/utils/numbers'

export default function ReportsPage() {
  const [category, setCategory] = useState<ReportCategory | 'all'>('all')
  const [project, setProject] = useState('all')
  const [filter, setFilter] = useState<FilterState>({ search: '', dateFrom: '', dateTo: '' })

  // Fetch page 1 to get total count
  const totalQ = useReports(1)
  const total = totalQ.data?.total ?? 0

  // Reports by project — "همه پروژه‌ها" plus every plant.
  const { data: projectsData } = useAllProjects()
  const projectOptions = [
    { value: 'all', label: 'همه پروژه‌ها' },
    ...(projectsData?.data ?? []).map((p) => ({ value: p.id, label: p.name })),
  ]

  return (
    <div className="flex flex-col gap-4 p-3 lg:gap-5 lg:p-3">

      {/* asas-style page header — desktop only */}
      <PageHeader
        className="hidden lg:flex"
        icon={<FileText size={22} strokeWidth={1.75} />}
        title="گزارش‌ها"
        subtitle="گزارش‌های فنی و مالی پروژه‌های شما"
      />

      {/* Toolbar row: total stat (start) + search (end) on one line [F §6] */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <StatCard
          label="مجموع گزارش‌ها"
          value={bidiIsolate(String(total))}
          icon={<FileBarChart size={20} />}
          role="info"
          compact
          className="w-full lg:max-w-xs"
          isLoading={totalQ.isLoading}
        />
        <ReportsFilter value={filter} onChange={setFilter} />
      </div>

      {/* Category chips + reports-by-project filter [F §6] */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <CategoryChips value={category} onChange={setCategory} />
        <Dropdown
          value={project}
          onChange={setProject}
          options={projectOptions}
          className="lg:w-64"
          fullWidth
        />
      </div>

      {/* Document library [F §6] */}
      <DocumentLibrary
        category={category}
        filter={filter}
        project={project === 'all' ? undefined : project}
      />

    </div>
  )
}
