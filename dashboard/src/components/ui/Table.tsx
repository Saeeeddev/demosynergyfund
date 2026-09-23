'use client'

import { ReactNode, useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

// [D §9.9] Data table with:
//   - --surface-2 header strip, label text in --text-muted
//   - Sortable columns: chevron pair mirrored in RTL
//   - Rows 48–56px, 1px --border separator, hover --hover
//   - Numeric columns align end; text columns align start
//   - Type chips: Buy=Green / Sell=Red / Deposit=Green / Withdraw=Red
// Phone: stacked-card render mode [M §7.3]

/* ------------------------------------------------------------------ */
/* ActivityTypeChip — Buy/Sell/Deposit/Withdraw role-tinted pill       */
/* ------------------------------------------------------------------ */

export type ActivityType = 'buy' | 'sell' | 'deposit' | 'withdraw'

const TYPE_MAP: Record<ActivityType, { label: string; classes: string }> = {
  buy:      { label: 'خرید',    classes: 'bg-green-tint text-green-deep' },
  sell:     { label: 'فروش',    classes: 'bg-red-tint text-red-deep'     },
  deposit:  { label: 'واریز',   classes: 'bg-green-tint text-green-deep' },
  withdraw: { label: 'برداشت',  classes: 'bg-red-tint text-red-deep'     },
}

interface ActivityTypeChipProps {
  type: ActivityType
  className?: string
}

export function ActivityTypeChip({ type, className }: ActivityTypeChipProps) {
  const { label, classes } = TYPE_MAP[type]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill px-2 py-0.5',
        'text-[11px] font-semibold leading-none whitespace-nowrap',
        classes,
        className,
      )}
    >
      {label}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Table column definition                                             */
/* ------------------------------------------------------------------ */

export interface TableColumn<T = Record<string, unknown>> {
  key: string
  header: string
  render?: (row: T) => ReactNode
  numeric?: boolean   // align end for numbers
  sortable?: boolean
  // Used in stacked-card mode to determine primary line vs secondary lines
  primary?: boolean
}

/* ------------------------------------------------------------------ */
/* Table props                                                         */
/* ------------------------------------------------------------------ */

interface TableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[]
  rows: T[]
  keyExtractor: (row: T) => string
  sortKey?: string
  sortDir?: 'asc' | 'desc'
  onSort?: (key: string) => void
  rowHeight?: 'compact' | 'normal'   // 48px / 56px
  className?: string
}

/* ------------------------------------------------------------------ */
/* Table component                                                     */
/* ------------------------------------------------------------------ */

export function Table<T = Record<string, unknown>>({
  columns,
  rows,
  keyExtractor,
  sortKey,
  sortDir,
  onSort,
  rowHeight = 'normal',
  className,
}: TableProps<T>) {
  const rowH = rowHeight === 'compact' ? 'h-12' : 'h-14'

  // Identify the primary column for stacked view (first column marked primary, or first column)
  const primaryCol = columns.find((c) => c.primary) ?? columns[0]
  const secondaryCols = columns.filter((c) => c !== primaryCol)

  return (
    <div className={cn('w-full', className)}>
      {/* ── Desktop table (md+) ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          {/* Header strip — surface-2 bg, label text in text-muted [D §9.9] */}
          <thead>
            <tr className="bg-surface-2">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn(
                    'px-4 h-10',
                    'text-[13px] font-medium text-text-muted',
                    'border-b border-border',
                    col.numeric ? 'text-end' : 'text-start',
                    col.sortable && 'cursor-pointer select-none hover:text-text',
                  )}
                  onClick={() => col.sortable && onSort?.(col.key)}
                  aria-sort={
                    col.key === sortKey
                      ? sortDir === 'asc' ? 'ascending' : 'descending'
                      : col.sortable ? 'none' : undefined
                  }
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {/* Sortable chevron pair — mirrored correctly in RTL by CSS logical layout */}
                    {col.sortable && (
                      <span className="flex flex-col text-text-subtle opacity-60" aria-hidden="true">
                        <ChevronUp
                          size={10}
                          className={cn(
                            '-mb-0.5',
                            col.key === sortKey && sortDir === 'asc' && 'text-text opacity-100',
                          )}
                        />
                        <ChevronDown
                          size={10}
                          className={cn(
                            col.key === sortKey && sortDir === 'desc' && 'text-text opacity-100',
                          )}
                        />
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          {/* Rows */}
          <tbody>
            {rows.map((row) => (
              <tr
                key={keyExtractor(row)}
                className={cn(
                  'border-b border-border last:border-0',
                  'hover:bg-hover transition-colors duration-[120ms] ease-out motion-reduce:transition-none',
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      'px-4',
                      rowH,
                      'text-[14px] text-text-2',
                      col.numeric ? 'text-end tabular-nums' : 'text-start',
                    )}
                  >
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile stacked-card view (below md) [M §7.3] ── */}
      <div className="md:hidden flex flex-col gap-2">
        {rows.map((row) => (
          <MobileCard
            key={keyExtractor(row)}
            row={row}
            primaryCol={primaryCol}
            secondaryCols={secondaryCols}
          />
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Mobile stacked card for a single row [M §7.3]                      */
/* ------------------------------------------------------------------ */

function MobileCard<T>({
  row,
  primaryCol,
  secondaryCols,
}: {
  row: T
  primaryCol: TableColumn<T>
  secondaryCols: TableColumn<T>[]
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="bg-surface border border-border rounded-card p-4 flex flex-col gap-3"
    >
      {/* Primary line */}
      <div className="flex items-center gap-2 text-sm font-semibold text-text">
        {primaryCol.render
          ? primaryCol.render(row)
          : String((row as Record<string, unknown>)[primaryCol.key] ?? '')}
      </div>

      {/* Secondary label:value pairs */}
      {(expanded ? secondaryCols : secondaryCols.slice(0, 3)).map((col) => (
        <div key={col.key} className="flex items-center justify-between gap-4">
          <span className="text-[12px] text-text-muted">{col.header}</span>
          <span
            className={cn(
              'text-[13px] text-text-2',
              col.numeric && 'tabular-nums',
            )}
          >
            {col.render
              ? col.render(row)
              : String((row as Record<string, unknown>)[col.key] ?? '')}
          </span>
        </div>
      ))}

      {/* Expand / collapse when there are more than 3 secondary columns */}
      {secondaryCols.length > 3 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-[12px] text-text-muted text-start hover:text-text transition-colors"
        >
          {expanded ? 'کمتر نشان بده ▲' : 'بیشتر نشان بده ▼'}
        </button>
      )}
    </div>
  )
}
