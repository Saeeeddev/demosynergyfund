'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type QA = { q: string; a: string };

const ITEMS: QA[] = [
  {
    q: 'سرمایه‌گذاری در سینرژی چطور انجام می‌شود؟',
    a: 'در نسخه نمایشی، بدون ثبت‌نام وارد داشبورد مهمان می‌شوید و خرید سهم را با داده‌های ساختگی امتحان می‌کنید. هیچ مالکیت واقعی ثبت نمی‌شود.',
  },
  {
    q: 'حداقل مبلغ برای شروع چقدر است؟',
    a: 'فعلاً امکان سرمایه‌گذاری واقعی وجود ندارد. مبلغ‌ها و سهم‌های نمایش‌داده‌شده فقط برای تجربه داشبورد هستند.',
  },
  {
    q: 'سود من از کجا می‌آید و چه زمانی پرداخت می‌شود؟',
    a: 'در محصول اصلی، ایده درآمد از فروش برق نیروگاه است؛ در این دمو پرداخت، سود و کیف پول همگی شبیه‌سازی شده‌اند.',
  },
  {
    q: 'آیا می‌توانم سهم خود را بفروشم؟',
    a: 'در داشبورد مهمان می‌توانید فرایند فروش نمایشی را امتحان کنید؛ این کار معامله واقعی یا دریافت پول ایجاد نمی‌کند.',
  },
  {
    q: 'مالکیت من واقعی و قانونی است؟',
    a: 'خیر. در نسخه عمومی فعلی، همه دارایی‌ها و تراکنش‌ها داده نمایشی هستند و هیچ حق مالکیت یا تعهد مالی ایجاد نمی‌کنند.',
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ul className="flex flex-col gap-3">
      {ITEMS.map((item, i) => {
        const isOpen = open === i;
        return (
          <li
            key={item.q}
            className="overflow-hidden rounded-card border border-line-soft bg-surface/90 backdrop-blur-sm"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right"
            >
              <span className="text-[15px] font-bold text-ink">{item.q}</span>
              <ChevronDown
                size={20}
                strokeWidth={2}
                className={cn(
                  'shrink-0 text-primary transition-transform duration-300 ease-out',
                  isOpen && 'rotate-180',
                )}
              />
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-[2] text-muted">{item.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
