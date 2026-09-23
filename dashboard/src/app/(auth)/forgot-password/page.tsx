// Forgot-password — deliberately conventional: a single centered white card
// (logo → title → 3-step flow → back-to-login), the pattern users already
// know from every other reset page. No split layout here by design. [F §0.5]
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-4 py-10">
      <div
        className="w-full max-w-[440px] bg-surface border border-border rounded-[20px] p-6 sm:p-8 flex flex-col gap-6"
        style={{ boxShadow: 'var(--shadow-md)' }}
      >
        <header className="flex flex-col items-center gap-4 text-center">
          <Image
            src="/Images/synergyfundlogotransparent.png"
            alt="سینرژی فاند"
            width={737}
            height={258}
            className="h-8 w-auto object-contain"
            preload
          />
          <div className="flex flex-col gap-1">
            <h1 className="text-[18px] font-bold text-text leading-[1.7]">
              بازیابی رمز عبور
            </h1>
            <p className="text-[13px] text-text-muted leading-[1.8]">
              ورود و بازیابی حساب در زمان نگهداری سامانه غیرفعال است.
            </p>
          </div>
        </header>

        <Link href="/dashboard" className="inline-flex min-h-12 items-center justify-center rounded-pill bg-blue-base px-6 text-[14px] font-semibold text-white">
          ادامه در حالت مهمان
        </Link>

        <Link
          href="/login"
          className="flex items-center justify-center gap-1.5 text-[13px] font-medium text-blue-deep hover:underline"
        >
          {/* RTL: "back" points right */}
          <ArrowRight size={15} aria-hidden="true" />
          بازگشت به صفحه ورود
        </Link>
      </div>
    </div>
  )
}
