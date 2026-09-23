import { Wrench } from 'lucide-react';

export default function ContactForm() {
  return (
    <div className="mt-6 rounded-card border border-amber-200 bg-amber-50 px-6 py-8 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
        <Wrench size={24} aria-hidden="true" />
      </span>
      <p className="mt-4 text-base font-bold text-ink">فرم تماس موقتاً غیرفعال است</p>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-7 text-muted">
        این وب‌سایت به‌عنوان نمونه‌کار منتشر شده و سرویس پشتیبانی اصلی در حال نگهداری است. لطفاً هیچ اطلاعات شخصی یا مالی وارد نکنید.
      </p>
    </div>
  );
}
