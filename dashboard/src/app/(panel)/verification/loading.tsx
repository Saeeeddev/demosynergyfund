// [D §9.20] Verification skeleton — shape-matched to page.tsx's single centered card

import { BackButton } from '@/components/ui/BackButton'
import { Card } from '@/components/ui/Card'

export default function VerificationLoading() {
  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-5 lg:p-5 max-w-lg">
      <BackButton href="/dashboard" label="بازگشت به داشبورد" />

      <Card className="flex flex-col gap-6 w-full">
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="skeleton w-20 h-20 rounded-pill" />
          <div className="flex flex-col items-center gap-2">
            <div className="skeleton h-5 w-32 rounded-md" />
            <div className="skeleton h-4 w-56 rounded-md" />
          </div>
          <div className="skeleton h-9 w-40 rounded-pill" />
        </div>

        <div className="border-t border-border pt-5 flex flex-col gap-4">
          <div className="skeleton h-11 w-full rounded-md" />
        </div>
      </Card>
    </div>
  )
}
