import { Building2, Zap, Sun, Leaf, LineChart, ShieldCheck, type LucideIcon } from 'lucide-react';

type Partner = { name: string; Icon: LucideIcon };

// Placeholder partner marks — swap for real logos when available.
const PARTNERS: Partner[] = [
  { name: 'بورس‌ویو', Icon: LineChart },
  { name: 'توان‌گستر', Icon: Zap },
  { name: 'خورشید نو', Icon: Sun },
  { name: 'پاک‌انرژی', Icon: Leaf },
  { name: 'آرمان‌سرمایه', Icon: Building2 },
  { name: 'اعتماد', Icon: ShieldCheck },
];

export default function Partners() {
  return (
    <section id="partners" className="scroll-mt-28 py-16 md:py-24">
      <div className="wrap">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-teal-deep">همکاران ما</p>
          <h2 className="mt-2 text-3xl font-black text-ink md:text-[34px]">با همکاری بهترین‌ها</h2>
          <p className="mt-3 text-[15px] leading-[2] text-muted">
            سینرژی در کنار شرکای مطمئن در حوزه انرژی و بازار سرمایه، بستری شفاف و پایدار برای
            سرمایه‌گذاری شما فراهم کرده است.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {PARTNERS.map(({ name, Icon }) => (
            <div
              key={name}
              className="group flex flex-col items-center justify-center gap-3 rounded-card border border-line-soft bg-surface/80 px-4 py-7 backdrop-blur-sm transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-surface-2 text-subtle transition-colors duration-300 group-hover:bg-primary-soft group-hover:text-primary-deep">
                <Icon size={24} strokeWidth={1.8} />
              </span>
              <span className="text-sm font-bold text-ink-2 transition-colors duration-300 group-hover:text-ink">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
