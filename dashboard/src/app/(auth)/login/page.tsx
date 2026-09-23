// Public login during the product update: visitors can explore the guest demo.
import { AuthShell } from '../AuthShell'
import { LoginForm } from './LoginForm'

export default function LoginPage() {
  return (
    <AuthShell>
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-5">
          <img
            src="/Images/synergyfundlogotransparent.webp"
            alt="سینرژی فاند"
            className="h-9 w-auto self-start object-contain"
          />
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[24px] font-bold text-text leading-[1.6]">
              ورود به داشبورد سینرژی
            </h1>
            <p className="text-[14px] text-text-muted leading-[1.8]">
              سامانه در حال به‌روزرسانی است. تا زمان بازگشت ورود اصلی، می‌توانید دموی داشبورد را ببینید.
            </p>
          </div>
        </header>

        <LoginForm />
      </div>
    </AuthShell>
  )
}
