import { ChevronLeft } from 'lucide-react';
import ProjectCard from './ProjectCard';
import { PROJECTS } from '@/lib/data/projects';
import { PLATFORM_URL } from '@/lib/config';

export default function InvestmentOpportunities() {
  return (
    <section id="opportunities" className="py-16 md:py-24">
      <div className="wrap">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-teal-deep">بازار سینرژی</p>
            <h2 className="mt-2 text-3xl font-black text-ink md:text-[38px]">
              فرصت‌های سرمایه‌گذاری
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-[2] text-muted">
              نیروگاه‌های خورشیدی فعال و در حال تأمین را ببینید، بازده و ظرفیت هرکدام را مقایسه کنید و سهم دلخواه خود را خریداری کنید.
            </p>
          </div>
          <a
            href={PLATFORM_URL}
            className="inline-flex h-11 shrink-0 items-center gap-1 rounded-pill border border-line px-6 text-sm font-medium text-ink-2 transition-colors hover:border-primary hover:text-primary"
          >
            مشاهده همه فرصت‌ها
            <ChevronLeft size={16} />
          </a>
        </div>

        <div className="mt-10 flex justify-center">
          {PROJECTS.map((project) => (
            <div key={project.id} className="w-full max-w-sm">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
