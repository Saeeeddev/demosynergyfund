import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle, type LucideIcon } from 'lucide-react';

type Option = {
  Icon: LucideIcon;
  title: string;
  body: string;
  action?: string;
  href?: string;
  mapHref?: string;
};

const OPTIONS: Option[] = [
  {
    Icon: Phone,
    title: 'تماس تلفنی',
    body: 'کارشناسان ما همه‌روزه و به‌صورت ۲۴ ساعته پاسخگوی شما هستند.',
    action: '۰۲۱–۹۱۰۰۰۰۰۰',
    href: 'tel:02191000000',
  },
  {
    Icon: Mail,
    title: 'ایمیل پشتیبانی',
    body: 'سوال خود را ایمیل کنید؛ در کمتر از ۲۴ ساعت پاسخ می‌گیرید.',
    action: 'support@synergy.ir',
    href: 'mailto:support@synergy.ir',
  },
  {
    Icon: MapPin,
    title: 'نشانی دفتر',
    body: 'تهران، شهرک غرب، بزرگراه یادگار امام، خیابان شهید دادمان، ساختمان پژوهشگاه نیرو، طبقه همکف',
    mapHref: 'https://www.google.com/maps?q=35.7676667,51.3447778',
  },
  {
    Icon: MessageCircle,
    title: 'ارسال پیام',
    body: 'فرم تماس را پر کنید تا کارشناسان با شما در ارتباط باشند.',
    action: 'رفتن به فرم تماس',
    href: '#contact-form',
  },
];

const CARD =
  'group flex flex-col rounded-hero border border-line-soft bg-surface/90 p-6 shadow-[var(--shadow-card)] backdrop-blur-sm';
const CARD_LINK =
  ' transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]';

export default function SupportOptions() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {OPTIONS.map(({ Icon, title, body, action, href, mapHref }) => {
        const content = (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-primary-soft text-primary-deep transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
              <Icon size={24} strokeWidth={1.9} />
            </div>
            <h3 className="mt-5 text-lg font-bold text-ink">{title}</h3>
            <p className="mt-2 text-sm leading-[2] text-muted">{body}</p>
            {mapHref ? (
              <a
                href={mapHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex h-10 items-center gap-1.5 self-start rounded-pill bg-primary px-5 text-[13px] font-medium text-white transition-[transform,background-color] duration-200 ease-out hover:bg-primary-deep active:scale-[0.97]"
              >
                <MapPin size={16} strokeWidth={2} />
                نمایش روی نقشه
              </a>
            ) : action ? (
              <span className="mt-4 text-[15px] font-bold text-primary tabular-nums">{action}</span>
            ) : null}
          </>
        );

        return href ? (
          <Link key={title} href={href} className={CARD + CARD_LINK}>
            {content}
          </Link>
        ) : (
          <div key={title} className={CARD}>
            {content}
          </div>
        );
      })}
    </div>
  );
}
