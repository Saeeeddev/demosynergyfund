import SiteHeader from '@/components/layout/SiteHeader';
import Footer from '@/components/layout/Footer';

export type LegalSection = {
  id?: string;
  heading: string;
  body: string[];
};

export default function LegalPage({
  eyebrow,
  title,
  intro,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="pt-36 pb-10">
          <div className="wrap">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center rounded-pill border border-ink/10 bg-white/70 px-4 py-1.5 text-sm font-medium text-teal-deep backdrop-blur">
                {eyebrow}
              </span>
              <h1 className="mt-6 text-4xl font-black leading-[1.3] text-ink md:text-5xl">{title}</h1>
              <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-[2.1] text-ink-2">{intro}</p>
              <p className="mt-4 text-xs text-subtle">آخرین به‌روزرسانی: {updated}</p>
            </div>
          </div>
        </section>

        <section className="pb-20 md:pb-28">
          <div className="wrap">
            <div className="mx-auto max-w-3xl rounded-hero border border-line-soft bg-surface/90 p-6 shadow-[var(--shadow-card)] backdrop-blur-sm md:p-10">
              <div className="flex flex-col gap-9">
                {sections.map((s, i) => (
                  <div key={s.heading} id={s.id} className="scroll-mt-28">
                    <h2 className="text-lg font-bold text-ink md:text-xl">
                      <span className="text-primary">{toPersian(i + 1)}. </span>
                      {s.heading}
                    </h2>
                    {s.body.map((p, j) => (
                      <p key={j} className="mt-3 text-sm leading-[2.1] text-ink-2">
                        {p}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function toPersian(n: number): string {
  return String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
}
