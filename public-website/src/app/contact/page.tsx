import SiteHeader from '@/components/layout/SiteHeader';
import Footer from '@/components/layout/Footer';
import ContactForm from '@/components/landing/ContactForm';
import Faq from '@/components/landing/Faq';
import SupportFab from '@/components/layout/SupportFab';

export const metadata = {
  title: 'تماس با ما',
  description: 'وضعیت پشتیبانی نسخه نمایشی سینرژی و پاسخ پرسش‌های متداول.',
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero — keeps its own teal wash */}
        <section className="bg-transparent pt-36 pb-24">
          <div className="wrap">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center rounded-pill border border-ink/10 bg-white/70 px-4 py-1.5 text-sm font-medium text-teal-deep backdrop-blur">
                نسخه نمایشی
              </span>
              <h1 className="mt-6 text-4xl font-black leading-[1.35] text-ink md:text-5xl md:leading-[1.25]">
                تماس با ما
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-[15px] leading-[2.1] text-ink-2">
                این وب‌سایت نمونه‌کار است. خدمات حساب کاربری و پشتیبانی فعلاً فعال نیست؛
                می‌توانید امکانات نمایشی داشبورد را بدون ثبت‌نام ببینید.
              </p>
            </div>
          </div>
        </section>

        {/* Contact form */}
        <section id="contact-form" className="relative z-10 -mt-12 scroll-mt-28 pb-20 md:pb-28">
          <div className="wrap">
            <div className="mx-auto max-w-2xl rounded-hero border border-line-soft bg-surface/95 p-6 shadow-[var(--shadow-pop)] backdrop-blur-xl md:p-8">
              <h2 className="text-xl font-black text-ink">وضعیت ارتباط با ما</h2>
              <p className="mt-1.5 text-sm text-muted">
                در این نسخه امکان ارسال پیام یا دریافت پشتیبانی وجود ندارد.
              </p>
              <ContactForm />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-28 pb-20 md:pb-28">
          <div className="wrap">
            <div className="mx-auto max-w-3xl">
              <div className="mb-8 text-center">
                <p className="text-sm font-medium text-teal-deep">سوالات متداول</p>
                <h2 className="mt-2 text-3xl font-black text-ink md:text-[34px]">پاسخ پرسش‌های پرتکرار</h2>
                <p className="mt-3 text-[15px] leading-[2] text-muted">
                  این پاسخ‌ها درباره ایده محصول هستند؛ قابلیت‌های مالی در نسخه نمایشی واقعی نیستند.
                </p>
              </div>
              <Faq />
            </div>
          </div>
        </section>
      </main>
      <SupportFab />
      <Footer />
    </>
  );
}
