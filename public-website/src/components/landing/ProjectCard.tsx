import Image from 'next/image';
import { MapPin, CheckCircle2, Clock, Lock, ChevronLeft, type LucideIcon } from 'lucide-react';
import { cn, bidiIsolate, formatNumber, formatPercent, formatToman, formatTomanCompact } from '@/lib/utils';
import type { ProjectCardData, ProjectStatus } from '@/lib/data/projects';
import { PLATFORM_URL } from '@/lib/config';

const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; text: string; Icon: LucideIcon; bar: string }
> = {
  active: { label: 'فعال', text: 'text-green-deep', Icon: CheckCircle2, bar: 'bg-green-base' },
  funding: { label: 'در حال تأمین', text: 'text-gold-deep', Icon: Clock, bar: 'bg-gold-base' },
  closed: { label: 'بسته‌شده', text: 'text-subtle', Icon: Lock, bar: 'bg-line' },
};

export default function ProjectCard({ project }: { project: ProjectCardData }) {
  const status = STATUS_CONFIG[project.status];
  const totalValue = project.capacityMw * 1000 * project.pricePerKw;
  const reference = `SYN-${project.id.replace(/[^0-9]/g, '').padStart(3, '0')}`;

  return (
    <div
      className={cn(
        'group flex flex-col overflow-hidden rounded-card border border-line-soft bg-surface',
        'shadow-[var(--shadow-card)] transition-[box-shadow,transform] duration-200 ease-out',
        'hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] motion-reduce:transition-none',
      )}
    >
      {/* Thumbnail */}
      <div className="relative h-40">
        <Image
          src={project.image}
          alt={project.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20" />

        <div className="absolute top-3 start-3">
          <span className="inline-flex items-center rounded-pill bg-white px-2.5 py-1 text-[11px] font-bold text-primary-deep shadow-sm tabular-nums">
            {bidiIsolate(formatNumber(project.capacityMw, 1))} مگاوات
          </span>
        </div>
        <div className="absolute top-3 end-3">
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-pill bg-white px-2.5 py-1 text-[11px] font-semibold shadow-sm',
              status.text,
            )}
          >
            <status.Icon size={12} strokeWidth={2.2} />
            {status.label}
          </span>
        </div>
        <div className="absolute bottom-3 start-3 rounded-md bg-black/55 px-2 py-1 text-[10px] font-medium text-white tabular-nums">
          {reference}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3.5 p-4">
        <h3 className="line-clamp-1 text-[17px] font-bold leading-snug text-ink">{project.name}</h3>

        <div className="-mt-2 flex items-center gap-1.5 text-[13px] text-muted">
          <MapPin size={14} className="shrink-0 text-subtle" />
          <span className="truncate">{project.location}</span>
        </div>

        <div className="rounded-chip border border-line-soft bg-surface-2 p-2.5">
          <div className="text-[11px] text-muted">پیش‌بینی بازده سالانه</div>
          <div className="text-[14px] font-bold text-green-deep tabular-nums">
            {bidiIsolate(formatPercent(project.targetYield))}
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="mb-1 flex justify-between text-[11px] text-muted">
            <span>درصد فروش سهام</span>
            <span className="font-medium text-ink-2 tabular-nums">
              {bidiIsolate(`${formatNumber(project.soldPercent)}٪`)}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-pill bg-surface-2">
            <div
              className={cn('h-full rounded-pill transition-all duration-500', status.bar)}
              style={{ width: `${project.soldPercent}%` }}
            />
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-3 pt-1">
          <Metric label="قیمت هر کیلووات" value={formatToman(project.pricePerKw)} />
          <Metric label="حداقل سرمایه" value={formatToman(project.minInvestment)} />
          <Metric label="ظرفیت کل (مگاوات)" value={bidiIsolate(formatNumber(project.capacityMw, 1))} />
          <Metric label="ارزش کل پروژه" value={formatTomanCompact(totalValue)} />
        </div>

        {/* Footer */}
        <div className="-mx-4 -mb-4 mt-auto flex items-center gap-2 border-t border-line-soft bg-surface-2 px-4 py-3">
          <a
            href={PLATFORM_URL}
            className="inline-flex items-center gap-1 px-0 text-[13px] font-medium text-primary transition-colors hover:text-primary-deep"
          >
            مشاهده جزئیات
            <ChevronLeft size={16} />
          </a>
          <a
            href={PLATFORM_URL}
            className="ms-auto inline-flex h-9 items-center rounded-pill bg-primary px-4 text-[13px] font-medium text-white transition-[transform,background-color] duration-200 ease-out hover:bg-primary-deep active:scale-[0.97]"
          >
            سرمایه‌گذاری
          </a>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] leading-tight text-muted">{label}</span>
      <span className="text-[13px] font-bold leading-tight text-ink tabular-nums">{value}</span>
    </div>
  );
}
