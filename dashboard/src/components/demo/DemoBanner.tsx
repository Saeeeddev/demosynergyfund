'use client'

import { FlaskConical, RotateCcw } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { demoService } from '@/lib/demo/service'

export function DemoBanner() {
  const queryClient = useQueryClient()

  function reset() {
    demoService.reset()
    queryClient.clear()
    window.location.assign('/dashboard')
  }

  return (
    <aside className="flex min-h-10 shrink-0 items-center justify-between gap-3 border-b border-amber-200 bg-amber-50 px-3 py-2 text-amber-950 lg:px-5" role="status">
      <p className="flex min-w-0 items-center gap-2 text-[11px] leading-5 sm:text-[12px]">
        <FlaskConical size={16} className="shrink-0 text-amber-700" aria-hidden="true" />
        <span><strong>حالت نمایشی:</strong> اطلاعات آزمایشی‌اند و فقط در مرورگر شما ذخیره می‌شوند.</span>
      </p>
      <button type="button" onClick={reset} className="inline-flex min-h-8 shrink-0 items-center gap-1.5 rounded-pill border border-amber-300 bg-white px-3 text-[11px] font-semibold text-amber-900 transition-colors hover:bg-amber-100">
        <RotateCcw size={14} aria-hidden="true" />
        <span className="hidden sm:inline">بازنشانی دمو</span>
      </button>
    </aside>
  )
}
