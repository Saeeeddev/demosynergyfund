import Image from 'next/image';
import { Target, Eye, HandHeart, Sun, ShieldCheck, TrendingUp } from 'lucide-react';
import SiteHeader from '@/components/layout/SiteHeader';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'درباره ما',
  description:
    'سینرژی، بازار خرید و فروش سهم نیروگاه‌های خورشیدی؛ ماموریت، چشم‌انداز و ارزش‌های ما.',
};

const STATS = [
  { value: '۳۰+', label: 'نیروگاه خورشیدی' },
  { value: '۱۲۰ مگاوات', label: 'ظرفیت تولید برق' },
  { value: '۴۵ هزار', label: 'سرمایه‌گذار' },
  { value: '۹۸٪', label: 'رضایت کاربران' },
];

const HIGHLIGHTS = [
  { Icon: Sun, title: 'دارایی واقعی', body: 'هر سهم، مالکیت ملموس بخشی از یک نیروگاه خورشیدی فعال است.' },
  { Icon: ShieldCheck, title: 'شفافیت کامل', body: 'تولید برق و درآمد نیروگاه را لحظه‌به‌لحظه دنبال کنید.' },
  { Icon: TrendingUp, title: 'نقدشوندگی', body: 'هر زمان که بخواهید، سهم خود را در بازار به فروش برسانید.' },
];

const VALUES = [
  {
    Icon: Target,
    title: 'ماموریت ما',
    body: 'دموکراتیک کردن سرمایه‌گذاری در انرژی پاک؛ تا هر فرد با هر میزان سرمایه بتواند مالک بخشی از یک نیروگاه خورشیدی واقعی شود.',
  },
  {
    Icon: Eye,
    title: 'چشم‌انداز ما',
    body: 'ساختن بزرگ‌ترین بازار شفاف خرید و فروش سهم دارایی‌های مولد انرژی تجدیدپذیر در کشور و پیشتازی در گذار به آینده‌ای سبز.',
  },
  {
    Icon: HandHeart,
    title: 'ارزش‌های ما',
    body: 'شفافیت کامل، مالکیت واقعی و ملموس، و پایبندی به منافع سرمایه‌گذار؛ سه اصلی که تمام تصمیم‌های سینرژی بر پایه آن‌ها گرفته می‌شود.',
  },
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero — keeps its own teal wash */}
        <section className="bg-transparent pt-36 pb-32">
          <div className="wrap">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center rounded-pill border border-ink/10 bg-white/70 px-4 py-1.5 text-sm font-medium text-teal-deep backdrop-blur">
                درباره سینرژی
              </span>
              <h1 className="mt-6 text-4xl font-black leading-[1.35] text-ink md:text-[48px] md:leading-[1.25]">
               انرژی خورشیدی را به سرمایه تبدیل می کنیم
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-[2.1] text-ink-2 md:text-base">
                سینرژی یک بازار آنلاین برای خرید و فروش سهم نیروگاه‌های خورشیدی است. ما نیروگاه‌های
                واقعی را به سهم‌های کوچک و قابل‌خرید تقسیم می‌کنیم تا سرمایه‌گذاری در انرژی پاک، برای
                همه ساده، شفاف و در دسترس باشد.
              </p>
            </div>
          </div>
        </section>

        {/* Stats — elevated card overlapping the hero */}
        <section className="relative z-10 -mt-20">
          <div className="wrap">
            <div className="mx-auto max-w-4xl rounded-hero border border-line-soft bg-surface/90 px-6 py-8 shadow-[var(--shadow-pop)] backdrop-blur-xl md:px-10">
              <div className="grid grid-cols-2 gap-y-8 md:grid-cols-4  md:divide-line-soft md:[direction:ltr]">
                {STATS.map((s) => (
                  <div key={s.label} className="px-4 text-center md:[direction:rtl]">
                    <div className="text-3xl font-black text-primary md:text-4xl">{s.value}</div>
                    <div className="mt-2 text-sm text-muted">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Story + image */}
        <section className="py-16 md:py-24">
          <div className="wrap">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-teal-deep">داستان ما</p>
                <h2 className="mt-2 text-3xl font-black leading-[1.4] text-ink md:text-[34px]">
                  مسیری کوتاه تا مالکیت انرژی پاک
                </h2>
                <p className="mt-5 text-[15px] leading-[2.1] text-ink-2">
                  سینرژی با یک باور ساده آغاز شد: انرژی خورشید متعلق به همه است، پس درآمد حاصل از آن
                  هم باید در دسترس همه باشد. تا پیش از این، سرمایه‌گذاری در نیروگاه‌های خورشیدی نیازمند
                  سرمایه‌ای کلان و دانشی تخصصی بود.
                </p>
                <p className="mt-4 text-[15px] leading-[2.1] text-ink-2">
                  ما این مسیر را کوتاه کردیم. امروز هر فرد می‌تواند تنها با چند کلیک سهمی از یک نیروگاه
                  خورشیدی واقعی را در اختیار بگیرد، تولید برق و درآمد آن را لحظه‌به‌لحظه دنبال کند و هر
                  زمان که بخواهد سهم خود را بفروشد.
                </p>
              </div>
              <div className="overflow-hidden rounded-hero border border-line-soft bg-surface p-2 shadow-[var(--shadow-pop)]">
                <Image
                  src="/Images/dashboard.webp"
                  alt="سامانه سینرژی"
                  width={1920}
                  height={840}
                  className="h-auto w-full rounded-[26px] object-cover"
                />
              </div>
            </div>

            {/* Highlights */}
            <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {HIGHLIGHTS.map(({ Icon, title, body }) => (
                <div
                  key={title}
                  className="flex gap-4 rounded-card border border-line-soft bg-surface/80 p-5 backdrop-blur-sm"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-primary-soft text-primary-deep">
                    <Icon size={22} strokeWidth={1.9} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-ink">{title}</h3>
                    <p className="mt-1 text-[13px] leading-[1.9] text-muted">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="pb-20 md:pb-28">
          <div className="wrap">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="text-sm font-medium text-teal-deep">چه چیزی ما را متمایز می‌کند</p>
              <h2 className="mt-2 text-3xl font-black text-ink md:text-[34px]">اصولی که به آن پایبندیم</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {VALUES.map(({ Icon, title, body }) => (
                <div
                  key={title}
                  className="group rounded-hero border border-line-soft bg-surface/90 p-7 shadow-[var(--shadow-card)] backdrop-blur-sm transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-primary-soft text-primary-deep transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                    <Icon size={24} strokeWidth={1.9} />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-ink">{title}</h3>
                  <p className="mt-2 text-sm leading-[2] text-muted">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
