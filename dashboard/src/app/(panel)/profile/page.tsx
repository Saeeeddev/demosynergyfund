// [F §9] Profile Settings page
// [M §6.12] Single-column form

import { ProfileForm } from '@/components/profile/ProfileForm'
import { BackButton } from '@/components/ui/BackButton'

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-5 lg:p-5 max-w-lg">
      <BackButton href="/dashboard" label="بازگشت به داشبورد" />
      <ProfileForm />
    </div>
  )
}
