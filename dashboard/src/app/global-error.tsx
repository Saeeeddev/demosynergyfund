'use client'

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen bg-surface-2 p-6">
        <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center text-center">
          <h1 className="text-xl font-bold text-text">نمایش داشبورد با مشکل روبه‌رو شد</h1>
          <p className="mt-3 text-sm leading-7 text-text-muted">اطلاعات واقعی در این نسخه نگهداری نمی‌شود. دوباره تلاش کنید یا داده‌های دمو را بازنشانی کنید.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={reset} className="min-h-11 rounded-pill bg-blue-base px-6 font-medium text-white">تلاش مجدد</button>
            <button onClick={() => { window.localStorage.removeItem('synergy-portfolio-demo-v1'); window.location.assign('/dashboard') }} className="min-h-11 rounded-pill border border-border bg-white px-6 font-medium text-text">بازنشانی دمو</button>
          </div>
        </main>
      </body>
    </html>
  )
}
