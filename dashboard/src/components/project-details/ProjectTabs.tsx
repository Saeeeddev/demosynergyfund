'use client'

// [F §11 R2 right 75%] 5 underline tabs: Overview / Returns / Legal / Reports / Risks
// [D §9.7] Underline tabs, accent Blue for Project Details
// [M §6.7] Phone: horizontally scrollable tab strip
//
// Each tab is its own project-driven component so the admin can configure the
// content per project later (wired to Django), the same way ProjectCard is.

import { useState, memo } from 'react'
import { Tabs } from '@/components/ui/Tabs'
import { OverviewTab } from './OverviewTab'
import { ReturnsTab } from './ReturnsTab'
import { LegalTab } from './LegalTab'
import { ReportsTab } from './ReportsTab'
import { RisksTab } from './RisksTab'
import type { ProjectWithDetails } from '@/lib/schemas/project'

const PROJECT_TABS = [
  { value: 'overview', label: 'بررسی اجمالی' },
  { value: 'returns',  label: 'بازده‌ها' },
  { value: 'legal',    label: 'حقوقی و مالکیت' },
  { value: 'reports',  label: 'گزارش‌ها' },
  { value: 'risks',    label: 'ریسک‌ها' },
]

interface ProjectTabsProps {
  project: ProjectWithDetails
}

export const ProjectTabs = memo(function ProjectTabs({ project }: ProjectTabsProps) {
  const [tab, setTab] = useState('overview')

  return (
    <div className="flex flex-col gap-4">
      {/* Scrollable underline tab strip — Blue accent for project details [D §9.7] */}
      <Tabs tabs={PROJECT_TABS} value={tab} onChange={setTab} accent="blue" />

      {/* Tab panels — one component per tab */}
      <div className="text-[14px] text-text-2 leading-relaxed min-h-[200px]">
        {tab === 'overview' && <OverviewTab project={project} />}
        {tab === 'returns' && <ReturnsTab project={project} />}
        {tab === 'legal' && <LegalTab project={project} />}
        {tab === 'reports' && <ReportsTab project={project} />}
        {tab === 'risks' && <RisksTab project={project} />}
      </div>
    </div>
  )
})
