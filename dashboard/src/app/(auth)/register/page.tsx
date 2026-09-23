import Link from 'next/link'
import { AuthShell } from '../AuthShell'

export default function RegisterPage() {
  return (
    <AuthShell>
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-5">
          <img
            src="/Images/synergyfundlogotransparent.webp"
            alt="سینرژی فاند"
            className="h-9 w-auto self-start object-contain"
          />
          <h1 className="text-[24px] font-bold text-text leading-[1.6]">
            ثبت‌نام موقتاً غیرفعال است
          </h1>
          <p className="text-[14px] leading-7 text-text-muted">
            سامانه اصلی در حال نگهداری است. در نسخه نمایشی هیچ حساب واقعی ایجاد نمی‌شود.
          </p>
        </header>

        <Link href="/dashboard" className="inline-flex min-h-12 items-center justify-center rounded-pill bg-blue-base px-6 font-semibold text-white">
          ادامه در حالت مهمان
        </Link>
        <Link href="/login" className="text-center text-[13px] font-medium text-blue-deep hover:underline">بازگشت</Link>
      </div>
    </AuthShell>
  )
}
