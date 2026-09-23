import Image from 'next/image';
import Link from 'next/link';
import { PLATFORM_URL } from '@/lib/config';

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'بازار',
    links: [
      { label: 'فرصت‌های سرمایه‌گذاری', href: '/#opportunities' },
      { label: 'نیروگاه‌های فعال', href: '/#opportunities' },
      { label: '  ', href: '/#how' },
      { label: 'خرید و فروش سهم', href: '/#how' },
    ],
  },
  {
    title: 'شرکت',
    links: [
      { label: 'درباره سینرژی', href: '/about' },
      { label: 'تماس با ما', href: '/contact' },
      { label: 'همکاران ما', href: '/#partners' },
      { label: 'راهنمای شروع', href: '/#how' },
    ],
  },
  {
    title: 'پشتیبانی',
    links: [
      { label: 'سوالات متداول', href: '/contact#faq' },
      { label: 'قوانین و مقررات', href: '/terms' },
      { label: 'حریم خصوصی', href: '/privacy' },
      { label: 'سیاست کوکی‌ها', href: '/privacy#cookies' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-transparent">
      <div className="wrap py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" aria-label="سینرژی — صفحه اصلی" className="inline-flex transition-opacity duration-200 hover:opacity-80">
              <Image
                src="/Images/synergyfundlogotransparent.webp"
                alt="سینرژی"
                width={140}
                height={32}
                className="w-auto"
                style={{ height: 32, width: 'auto' }}
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-[2] text-muted">
              سامانه سرمایه‌گذاری در انرژی پاک؛ ساده، شفاف و کاملاً آنلاین.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-sm font-bold text-ink">{col.title}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-muted transition-colors hover:text-primary">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line-soft pt-6 text-sm text-muted sm:flex-row">
          <p>© ۱۴۰۵ سینرژی — تمامی حقوق محفوظ است.</p>
          <a href={PLATFORM_URL} className="font-medium text-primary transition-opacity hover:opacity-75">
            ورود به پلتفرم
          </a>
        </div>
      </div>
    </footer>
  );
}
