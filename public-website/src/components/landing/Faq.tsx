'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type QA = { q: string; a: string };

const ITEMS: QA[] = [
  {
    q: 'سرمایه‌گذاری در سینرژی چطور انجام می‌شود؟',
    a: 'فرصت‌های سرمایه‌گذاری و اطلاعات هر نیروگاه در پلتفرم معرفی می‌شوند. شرایط هر فرصت را پیش از هر تصمیمی بررسی کنید.',
  },
  {
    q: 'حداقل مبلغ برای شروع چقدر است؟',
    a: 'حداقل مبلغ و شرایط خرید ممکن است برای هر فرصت متفاوت باشد و در جزئیات همان فرصت اعلام می‌شود.',
  },
  {
    q: 'سود من از کجا می‌آید و چه زمانی پرداخت می‌شود؟',
    a: 'درآمد احتمالی به فروش برق نیروگاه و شرایط همان فرصت بستگی دارد. زمان و شیوه پرداخت باید در جزئیات طرح مشخص شود.',
  },
  {
    q: 'آیا می‌توانم سهم خود را بفروشم؟',
    a: 'شرایط فروش سهم به قوانین و وضعیت هر فرصت بستگی دارد. پیش از خرید، این شرایط را در جزئیات طرح بررسی کنید.',
  },
  {
    q: 'مالکیت من واقعی و قانونی است؟',
    a: 'نوع مالکیت و حقوق سرمایه‌گذار باید در قرارداد و اسناد هر فرصت مشخص شود. پیش از هر تصمیم مالی، این مدارک را مطالعه کنید.',
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
