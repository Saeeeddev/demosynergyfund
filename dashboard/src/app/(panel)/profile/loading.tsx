// [D §9.20] Profile skeleton — shape-matched to page.tsx's single-column form

import { BackButton } from '@/components/ui/BackButton'
import { Card } from '@/components/ui/Card'

export default function ProfileLoading() {
  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-5 lg:p-5 max-w-lg">
      <BackButton href="/dashboard" label="بازگشت به داشبورد" />

      <Card className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="skeleton h-4 w-24 rounded-md" />
            <div className="skeleton h-11 w-full rounded-md" />
          </div>
        ))}
        <div className="skeleton h-11 w-32 rounded-md self-end" />
      </Card>
    </div>
  )
}
