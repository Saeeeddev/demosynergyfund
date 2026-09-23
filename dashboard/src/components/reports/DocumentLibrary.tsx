'use client'

// [F §6] Document library — paginated rows + download ghost button
// [D §9.22] In-box pagination: page 2+ failures retry in-box, no page-level error.tsx
// [M §6.6] Phone: stacked rows, load-more

import { useEffect, useState } from 'react'
import { Download, FileText } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Pagination } from '@/components/ui/Pagination'
import { ErrorState } from '@/components/ui/ErrorState'
import { Empty } from '@/components/ui/Empty'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { useReports, useReportsInfinite } from '@/lib/hooks/useReports'
import { formatJalali } from '@/lib/utils/jalali'
import { bidiIsolate } from '@/lib/utils/numbers'
import type { Report } from '@/lib/schemas/report'
import type { ReportCategory } from './CategoryChips'
import type { FilterState } from './ReportsFilter'

const CATEGORY_LABEL: Record<Report['category'], string> = {
  financial: 'مالی',
  technical: 'فنی',
  legal:     'حقوقی',
  quarterly: 'فصلی',
  monthly_statement: 'صورت‌حساب ماهانه',
}

function formatKb(kb: number): string {
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`
  return `${kb} KB`
}

function matchesFilter(doc: Report, filter: FilterState): boolean {
  if (filter.search && !doc.title.includes(filter.search)) return false
  if (filter.dateFrom && doc.date < filter.dateFrom) return false
  if (filter.dateTo && doc.date > filter.dateTo) return false
  return true
}

function DocRow({ doc }: { doc: Report }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0 group">
      {/* Icon */}
      <div className="w-10 h-10 rounded-chip bg-blue-tint text-blue-deep flex items-center justify-center shrink-0">
        <FileText size={18} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <span className="text-[14px] font-medium text-text truncate">{doc.title}</span>
        <span className="text-[12px] text-text-muted">
          {CATEGORY_LABEL[doc.category]}
          {doc.projectName && <> · {doc.projectName}</>}
          {' · '}
          {formatJalali(doc.date)}
          {' · '}
          {bidiIsolate(formatKb(doc.sizeKb))}
        </span>
      </div>

      {/* Download button — end side (left in RTL), ≥44px tap target [M §6.6] */}
      <a
        href={doc.downloadUrl}
        download
        aria-label={`دانلود ${doc.title}`}
        className="flex items-center justify-center w-10 h-10 min-h-[44px] min-w-[44px] rounded-md text-text-muted hover:bg-hover hover:text-text transition-colors duration-[120ms]"
      >
        <Download size={18} />
      </a>
    </div>
  )
}

/* ── Desktop (md+) ── page-keyed + in-box pagination [D §9.22] ────────────── */
function DesktopLibrary({ category, filter, project }: { category: ReportCategory | 'all'; filter: FilterState; project?: string }) {
  const [page, setPage] = useState(1)
  const cat = category === 'all' ? undefined : category
  const q = useReports(page, cat, project)

  // A narrower filter can have fewer pages — start over rather than strand
  // the user on an empty page.
  useEffect(() => setPage(1), [category, project])

  const docs = (q.data?.data ?? []).filter((d) => matchesFilter(d, filter))
  const totalPages = q.data?.totalPages ?? 1

  const firstPageLoading = q.isLoading && page === 1
  const inBoxLoading = q.isLoading && page > 1
  if (q.isError && page === 1) throw q.error
  const inBoxError = q.isError && page > 1

  if (firstPageLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-16 w-full rounded-md" count={6} />
      </div>
    )
  }

  if (!firstPageLoading && !inBoxError && docs.length === 0) {
    return <Empty icon={<FileText size={48} />} message="سندی یافت نشد" />
  }

  return (
    <>
      {inBoxLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-16 w-full rounded-md" count={6} />
        </div>
      ) : (
        <div className="divide-y divide-transparent">
          {docs.map((d) => <DocRow key={d.id} doc={d} />)}
        </div>
      )}

      {inBoxError && (
        <div className="rounded-card border border-border p-4">
          <ErrorState scope="inline" onRetry={() => q.refetch()} />
        </div>
      )}

      <div className="flex justify-center pt-3">
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} loading={q.isLoading} />
      </div>
    </>
  )
}

/* ── Mobile (<md) ── load-more / infinite [M §7.7] ────────────────────────── */
function MobileLibrary({ category, filter, project }: { category: ReportCategory | 'all'; filter: FilterState; project?: string }) {
  const cat = category === 'all' ? undefined : category
  const q = useReportsInfinite(cat, project)

  const allDocs = (q.data?.pages ?? []).flatMap((p) => p.data).filter((d) => matchesFilter(d, filter))

  if (q.isLoading && allDocs.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-16 w-full rounded-md" count={5} />
      </div>
    )
  }

  if (q.isError && allDocs.length === 0) {
    return <ErrorState scope="inline" onRetry={() => q.refetch()} />
  }

  if (allDocs.length === 0) {
    return <Empty icon={<FileText size={48} />} message="سندی یافت نشد" />
  }

  return (
    <div className="flex flex-col">
      {allDocs.map((d) => <DocRow key={d.id} doc={d} />)}

      {q.isError && allDocs.length > 0 && (
        <div className="rounded-card border border-border p-4 mt-3">
          <ErrorState scope="inline" onRetry={() => q.fetchNextPage()} />
        </div>
      )}

      {q.hasNextPage && !q.isError && (
        <Button
          variant="ghost"
          onClick={() => q.fetchNextPage()}
          disabled={q.isFetchingNextPage}
          className="w-full min-h-[44px] mt-3"
        >
          {q.isFetchingNextPage ? 'در حال بارگذاری…' : 'نمایش بیشتر'}
        </Button>
      )}
    </div>
  )
}

/* ── Exported component ────────────────────────────────────────────────────── */
interface DocumentLibraryProps {
  category: ReportCategory | 'all'
  filter: FilterState
  /** Plant id — narrows the library to one project's reports. */
  project?: string
}

export function DocumentLibrary({ category, filter, project }: DocumentLibraryProps) {
  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-[15px] font-semibold text-text">کتابخانه اسناد</h2>

      <div className="hidden md:block">
        <DesktopLibrary category={category} filter={filter} project={project} />
      </div>

      <div className="md:hidden">
        <MobileLibrary category={category} filter={filter} project={project} />
      </div>
    </Card>
  )
}
