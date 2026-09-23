'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type QA = { q: string; a: string };

const ITEMS: QA[] = [
  {
    q: 'سرمایه‌گذاری در سینرژی چطور انجام می‌شود؟',
    a: 'پس از ثبت‌نام و احراز هویت آنلاین، از میان نیروگاه‌های خورشیدی فعال یک نیروگاه را انتخاب می‌کنید و به اندازه دلخواه سهم آن را خریداری می‌کنید؛ مالکیت شما بلافاصله ثبت می‌شود.',
  },
  {
    q: 'حداقل مبلغ برای شروع چقدر است؟',
    a: 'سینرژی نیروگاه‌های واقعی را به سهم‌های کوچک تقسیم کرده است، به‌همین‌دلیل می‌توانید تنها با مبلغی اندک شروع کنید و به‌مرور دارایی خود را افزایش دهید.',
  },
  {
    q: 'سود من از کجا می‌آید و چه زمانی پرداخت می‌شود؟',
    a: 'درآمد شما از فروش برق تولیدی نیروگاه به‌دست می‌آید. به‌ازای هر سهم، سهمی از این درآمد به‌صورت دوره‌ای ,مستقیم به کیف پول شما در سامانه واریز می‌شود.',
  },
  {
    q: 'آیا می‌توانم سهم خود را بفروشم؟',
    a: 'بله. سهم شما در هر زمان قابل عرضه در بازار سینرژی است و می‌توانید آن را به قیمت روز به فروش برسانید؛ نقدشوندگی یکی از اصول اصلی پلتفرم ماست.',
  },
  {
    q: 'مالکیت من واقعی و قانونی است؟',
    a: 'بله؛ هر سهم نشان‌دهنده مالکیت ملموس بخشی از یک نیروگاه خورشیدی واقعی است و تمام معاملات به‌صورت شفاف در سامانه ثبت و قابل پیگیری است.',
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
