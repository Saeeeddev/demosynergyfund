import { Sun, ShieldCheck, ArrowLeftRight, Wallet, type LucideIcon } from 'lucide-react';

type Feature = {
  title: string;
  body: string;
  Icon: LucideIcon;
  tint: string;
  color: string;
};

const FEATURES: Feature[] = [
  {
    title: 'دارایی واقعی و ملموس',
    body: 'هر سهم، مالکیت بخشی از یک نیروگاه خورشیدی واقعی است؛ نه یک دارایی کاغذی.',
    Icon: Sun,
    tint: 'bg-[#fbf1dd]',
    color: 'text-gold-deep',
  },
  {
    title: 'شفافیت کامل',
    body: 'میزان تولید برق، درآمد و عملکرد هر نیروگاه را لحظه‌به‌لحظه در داشبورد خود ببینید.',
    Icon: ShieldCheck,
    tint: 'bg-primary-soft',
    color: 'text-primary-deep',
  },
  {
    title: 'نقدشوندگی بالا',
    body: 'هر زمان که بخواهید سهم خود را در بازار سینرژی به فروش برسانید و سرمایه‌تان را آزاد کنید.',
    Icon: ArrowLeftRight,
    tint: 'bg-teal-soft',
    color: 'text-teal-deep',
  },
  {
    title: 'درآمد از فروش برق',
    body: 'سود حاصل از فروش برق نیروگاه به‌صورت دوره‌ای مستقیم به کیف پول شما واریز می‌شود.',
    Icon: Wallet,
    tint: 'bg-[#e7f0e6]',
    color: 'text-green-deep',
  },
];

export default function Features() {
  return (
    <section className="py-16 md:py-20">
      <div className="wrap">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ title, body, Icon, tint, color }) => (
            <div key={title} className="flex flex-col items-center text-center">
              <div className={`flex h-14 w-14 items-center justify-center rounded-[18px] ${tint}`}>
                <Icon className={color} size={26} strokeWidth={1.9} />
              </div>
              <h3 className="mt-5 text-lg font-bold text-ink">{title}</h3>
              <p className="mt-2 max-w-[16rem] text-sm leading-[1.9] text-muted">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
