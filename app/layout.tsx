import type {Metadata, Viewport} from 'next';
import './globals.css';
import { PwaInstallPrompt } from '@/components/ui/pwa-install';
import { SiteBottomNav } from '@/components/ui/site-bottom-nav';
import { generateWebSiteSchema, generateVideoGameSchema } from '@/lib/schema';

export const viewport: Viewport = {
  themeColor: '#FF3B30',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://candycrusherultra.pages.dev'),
  title: 'Candy Crush Ultra - Free Offline Match-3 Game',
  description: 'A premium, completely free, local-first Match-3 puzzle game. 199 levels, 0 ads, purely static performance.',
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://candycrusherultra.pages.dev',
  },
  verification: {
    google: 'otderKAIRbSW1PQR1p1pSL2iILJn7iSFMRlmbhz2_9g',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icon-192.png', sizes: '192x192' }],
  },
  openGraph: {
    title: 'Candy Crush Ultra - Free Offline Match-3 Game',
    description: 'A premium, completely free, local-first Match-3 puzzle game. 199 levels, 0 ads, purely static performance.',
    url: 'https://candycrusherultra.pages.dev',
    siteName: 'Candy Crush Ultra',
    type: 'website',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'Candy Crush Ultra - Match-3 Saga',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Candy Crush Ultra - Free Offline Match-3 Game',
    description: 'A premium, completely free, local-first Match-3 puzzle game.',
    images: ['/icon-512.png'],
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  const websiteSchema = generateWebSiteSchema();
  const videoGameSchema = generateVideoGameSchema();

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FF3B30" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoGameSchema) }}
        />
      </head>
      <body className="antialiased font-sans selection:bg-white/30 min-h-screen bg-[#5BCEFA]" style={{ background: 'radial-gradient(circle at center, #64D3FF 0%, #2980B9 100%)' }} suppressHydrationWarning>
        {children}
        <PwaInstallPrompt />
        <SiteBottomNav />
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                  .then(reg => console.log('Service Worker Registered:', reg))
                  .catch(err => console.error('Service Worker Registration Failed:', err));
              });
            }
          `
        }} />
      </body>
    </html>
  );
}

