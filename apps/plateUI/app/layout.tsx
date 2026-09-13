import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
import { Navbar } from '@/app/components/nav-bar';
import ProductHuntBadge from '@/app/components/product-hunt-badge';
import { Toaster } from '@/app/ui/toast';
import { readSiteUrl } from '@/app/utils/site/url';

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  metadataBase: readSiteUrl(),
  title: 'PlateAI | Snap a Meal. Get Instant AI Nutrition.',
  description:
    'Photo-first nutrition from a snap of your plate. Snap any meal and instantly get calories, protein, carbs, and fat from a single AI photo analysis.',
  openGraph: {
    title: 'Plate AI — Snap a Meal. Get Instant Nutrition.',
    description:
      'Snap a photo of any meal and get instant AI-powered calorie, protein, carb, and fat analysis.',
    url: 'https://plateai.fit/',
    type: 'website',
    images: [{ url: 'https://plateai.fit/images/og-image.jpg', alt: 'PlateAI', width: 1200, height: 630 }],
    siteName: 'PlateAI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plate AI — Snap a Meal. Get Instant Nutrition.',
    description:
      'Snap a photo of any meal and get instant AI-powered calorie, protein, carb, and fat analysis.',
    images: ['https://plateai.fit/images/og-image.jpg'],
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: [{ url: '/icons/favicon.png', type: 'image/png', sizes: '48x48' }],
  },
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-pt-28 scroll-smooth antialiased motion-reduce:scroll-auto`}
    >
      <body className="flex min-h-full flex-col font-sans" suppressHydrationWarning>
        <Navbar />
        <ProductHuntBadge />
        <main className="flex min-h-0 flex-1 flex-col">{children}</main>
        <Toaster />
        {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_GA_ID ? (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        ) : null}
      </body>
    </html>
  );
}
