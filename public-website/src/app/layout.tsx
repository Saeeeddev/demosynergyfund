import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import CookieConsent from '@/components/layout/CookieConsent';
import { SITE_URL } from '@/lib/config';

const yekan = localFont({
  src: [
    { path: '../../public/fonts/YekanBakh-Light.woff2', weight: '300' },
    { path: '../../public/fonts/YekanBakh-Regular.woff2', weight: '400' },
    { path: '../../public/fonts/YekanBakh-Medium.woff2', weight: '500' },
    { path: '../../public/fonts/YekanBakh-Bold.woff2', weight: '700' },
    { path: '../../public/fonts/YekanBakh-Heavy.woff2', weight: '900' },
  ],
  variable: '--font-yekan',
  display: 'swap',
});

const TITLE = 'سینرژی فاند (Synergy Fund) | بازار خرید و فروش سهم نیروگاه‌های خورشیدی';
const DESCRIPTION =
  'سینرژی فاند، بازار آنلاین خرید و فروش سهم نیروگاه‌های خورشیدی؛ با هر میزان سرمایه مالک بخشی از یک نیروگاه واقعی شوید و از فروش برق درآمد کسب کنید. ساده، شفاف و کاملاً آنلاین.';
const KEYWORDS = [
  'سینرژی فاند',
  'سینرژی',
  'Synergy Fund',
  'Synergy',
  'synergyfund',
  'سرمایه‌گذاری خورشیدی',
  'نیروگاه خورشیدی',
  'خرید سهم نیروگاه',
  'انرژی تجدیدپذیر',
  'انرژی پاک',
  'درآمد از انرژی خورشیدی',
  'سرمایه‌گذاری آنلاین',
  'پلتفرم سرمایه‌گذاری خورشیدی',
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: '%s | سینرژی فاند',
  },
  description: DESCRIPTION,
  keywords: KEYWORDS,
  applicationName: 'سینرژی فاند',
  authors: [{ name: 'سینرژی فاند' }],
  creator: 'سینرژی فاند',
  publisher: 'سینرژی فاند',
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: SITE_URL,
    siteName: 'سینرژی فاند — Synergy Fund',
    title: TITLE,
    description: DESCRIPTION,
    images: [
      { url: '/Images/dashboard.webp', width: 1920, height: 840, alt: 'سامانه سرمایه‌گذاری سینرژی فاند' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/Images/dashboard.webp'],
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  category: 'finance',
};

export const viewport = {
  themeColor: '#6d7f9f',
  colorScheme: 'light' as const,
};

const JSON_LD_WEBSITE = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'سینرژی فاند',
  alternateName: ['Synergy Fund', 'سینرژی', 'Synergy', 'synergyfund.ir'],
  url: SITE_URL,
  description: DESCRIPTION,
  inLanguage: 'fa-IR',
};

const JSON_LD_ORGANIZATION = {
  '@context': 'https://schema.org',
  '@type': 'FinancialService',
  name: 'سینرژی فاند',
  alternateName: ['Synergy Fund', 'سینرژی'],
  url: SITE_URL,
  logo: `${SITE_URL}/Images/synergyfundlogotransparent.webp`,
  description: DESCRIPTION,
  sameAs: [] as string[],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={yekan.variable} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_WEBSITE) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_ORGANIZATION) }}
        />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
