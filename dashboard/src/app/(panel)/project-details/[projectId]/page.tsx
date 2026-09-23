'use client'

// [F §11] Project (Asset) Details Page — dynamic per projectId
// [A §3.5] Dynamic-route guard: validate projectId → redirect to /marketplace if invalid
// Row 1: ProjectHeader (full width)
// Row 2: ProjectTabs (75%) + InvestmentCalculator (25%) — phone: calculator ABOVE tabs [M §6.7]
// Row 3: RoiForecastSection (full width)

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useProject } from '@/lib/hooks/useProjects'
import { ProjectHeader } from '@/components/project-details/ProjectHeader'
import { ProjectTabs } from '@/components/project-details/ProjectTabs'
import { InvestmentCalculator } from '@/components/project-details/InvestmentCalculator'
import { RoiForecastSection } from '@/components/project-details/RoiForecastSection'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { BackButton } from '@/components/ui/BackButton'

interface ProjectPageProps {
  params: Promise<{ projectId: string }>
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = use(params)
  const router = useRouter()
  const { data: project, isLoading, isError } = useProject(projectId)

  // Quantity (kilowatts) shared between the calculator and the ROI forecast so
  // both reflect the same figure (and it carries through to the Invest flow). [F §11]
  const [kw, setKw] = useState('')
  const [debouncedKw, setDebouncedKw] = useState('')

  // Dynamic guard: redirect to /marketplace if project not found [A §3.5, F §0.3]
  useEffect(() => {
    if (!isLoading && !project && !isError) {
      router.replace('/marketplace')
    }
  }, [isLoading, project, isError, router])

  // Debounce kw so RoiForecastSection (Highcharts) only redraws after the user
  // stops typing, not on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedKw(kw), 300)
    return () => clearTimeout(t)
  }, [kw])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-3 lg:gap-5 lg:p-3">
        <Skeleton className="h-64 rounded-card" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <Skeleton className="h-96 rounded-card lg:col-span-3" />
          <Skeleton className="h-96 rounded-card lg:col-span-1" />
        </div>
        <Skeleton className="h-64 rounded-card" />
      </div>
    )
  }

  if (isError || !project) {
    return (
      <div className="p-4 lg:p-5">
        <ErrorState
          scope="page"
          onRetry={() => router.replace('/marketplace')}
          title="پروژه یافت نشد"
          message="صفحه مورد نظر وجود ندارد — به بازار بروید"
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-3 lg:gap-5 lg:p-3">

      <BackButton href="/marketplace" label="بازگشت به فرصت‌های سرمایه‌گذاری" />

      {/* Row 1 — details/tabs card (60%, right) + header (40%, left).
          Mobile: header first (overview), then details. */}
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-5 lg:gap-5 lg:items-start">
        <div className="order-first lg:order-none lg:col-span-2">
          <ProjectHeader project={project} />
        </div>
        <div className="bg-surface border border-border rounded-card shadow-[var(--shadow-card)] p-5 lg:col-span-3 lg:order-none">
          <ProjectTabs project={project} />
        </div>
        
      </div>

      {/* Row 2 — calculator (right, sticky) + ROI forecast (left, bigger) */}
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-4 lg:gap-5 lg:items-start">
        <div className="order-first lg:order-none lg:col-span-1 lg:sticky lg:top-3">
          <InvestmentCalculator project={project} kw={kw} onKwChange={setKw} />
        </div>
        <div className="lg:col-span-3">
          <RoiForecastSection project={project} kw={debouncedKw} />
        </div>
      </div>
    </div>
  )
}
