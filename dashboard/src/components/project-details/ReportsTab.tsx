'use client'

// [F §11] Project details — "گزارش‌ها" tab. Lists every published report for
// this project (paginated) straight from the reports API — the same source and
// download route as the reports page — so downloads actually work and nothing
// is capped at the small nested `project.details.reports` preview.

import { useState } from 'react'
import { FileText, Download } from 'lucide-react'
import { Pagination } from '@/components/ui/Pagination'
import { ErrorState } from '@/components/ui/ErrorState'
import { Empty } from '@/components/ui/Empty'
import { Skeleton } from '@/components/ui/Skeleton'
import { useReports } from '@/lib/hooks/useReports'
import { formatJalali } from '@/lib/utils/jalali'
import { bidiIsolate } from '@/lib/utils/numbers'
import type { ProjectWithDetails } from '@/lib/schemas/project'
import type { Report } from '@/lib/schemas/report'

const CATEGORY_LABEL: Record<Report['category'], string> = {
  financial: 'مالی',
  technical: 'فنی',
  legal: 'حقوقی',
  quarterly: 'فصلی',
  monthly_statement: 'صورت‌حساب ماهانه',
}

function formatKb(kb: number): string {
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`
  return `${kb} KB`
}

export function ReportsTab({ project }: { project: ProjectWithDetails }) {
  const [page, setPage] = useState(1)
  const q = useReports(page, undefined, project.id)

  const reports = q.data?.data ?? []
  const totalPages = q.data?.totalPages ?? 1

  if (q.isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-14 w-full rounded-md" count={4} />
      </div>
    )
  }

  if (q.isError) {
    return <ErrorState scope="inline" onRetry={() => q.refetch()} />
  }

  if (reports.length === 0) {
    return (
      <Empty
        icon={<FileText size={40} />}
        message={`گزارشی برای «${project.name}» ثبت نشده است.`}
      />
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {reports.map((r) => (
        <div
          key={r.id}
          className="flex items-center justify-between gap-3 border border-border rounded-md px-3 py-2.5"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <FileText size={18} className="text-blue-base shrink-0" />
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-text truncate">{r.title}</p>
              <p className="text-[11px] text-text-muted tabular-nums">
                {CATEGORY_LABEL[r.category]}
                {' · '}
                {formatJalali(r.date)}
                {' · '}
                {bidiIsolate(formatKb(r.sizeKb))}
              </p>
            </div>
          </div>
          <a
            href={r.downloadUrl}
            download
            aria-label={`دانلود ${r.title}`}
            className="flex items-center gap-1 text-[12px] font-medium text-blue-deep hover:underline shrink-0"
          >
            <Download size={14} /> دانلود
          </a>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="flex justify-center pt-2">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} loading={q.isLoading} />
        </div>
      )}
    </div>
  )
}
