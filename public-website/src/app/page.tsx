import SiteHeader from '@/components/layout/SiteHeader';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';

import HowItWorks from '@/components/landing/HowItWorks';
import InvestmentOpportunities from '@/components/landing/InvestmentOpportunities';
import Partners from '@/components/landing/Partners';
import SupportFab from '@/components/layout/SupportFab';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Features />
        
        <HowItWorks />
        <InvestmentOpportunities />
        <Partners />
      </main>
      <SupportFab />
      <Footer />
    </>
  );
}
