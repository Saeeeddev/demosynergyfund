'use client'

// [F §11] Project details — "ریسک‌ها" tab. The risk list comes from the API per
// project (project.details.risks); the admin configures it once Django is wired.

import { AlertTriangle } from 'lucide-react'
import type { ProjectWithDetails } from '@/lib/schemas/project'

export function RisksTab({ project }: { project: ProjectWithDetails }) {
  const risks = project.details.risks

  return (
    <div className="flex flex-col gap-3">
      <p className="text-text-muted text-[13px]">
        سرمایه‌گذاری در «{project.name}» مانند هر پروژه انرژی خورشیدی با ریسک‌هایی همراه است
        که در ادامه شرح داده شده:
      </p>

      <ul className="flex flex-col gap-2">
        {risks.map((risk) => (
          <li key={risk} className="flex items-start gap-2 text-[13px] text-text-2">
            <AlertTriangle size={15} className="text-gold-deep shrink-0 mt-0.5" />
            <span>{risk}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
