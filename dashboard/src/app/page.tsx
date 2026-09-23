import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-surface-2 p-6" dir="rtl">
      <div className="max-w-md rounded-card border border-border bg-surface p-8 text-center shadow-[var(--shadow-card)]">
        <h1 className="text-xl font-bold text-text">نسخه نمایشی سینرژی فاند</h1>
        <p className="mt-3 text-sm leading-7 text-text-muted">
          این نسخه فقط برای نمایش نمونه‌کار است و از اطلاعات آزمایشی استفاده می‌کند.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-pill bg-blue-base px-8 font-medium text-white transition-opacity hover:opacity-90"
        >
          ورود به داشبورد مهمان
        </Link>
      </div>
    </main>
  );
}
