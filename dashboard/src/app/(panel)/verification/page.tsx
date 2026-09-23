// [F §13] Verification page
// [M §6.12] Single-column, full-width card

import { VerificationCard } from '@/components/verification/VerificationCard'
import { BackButton } from '@/components/ui/BackButton'

export default function VerificationPage() {
  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-5 lg:p-5 max-w-lg">
      <BackButton href="/dashboard" label="بازگشت به داشبورد" />
      <VerificationCard />
    </div>
  )
}
