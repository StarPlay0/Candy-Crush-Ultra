import type {Metadata, Viewport} from 'next';
import './globals.css';
import { PwaInstallPrompt } from '@/components/ui/pwa-install';
import { SiteBottomNav } from '@/components/ui/site-bottom-nav';
import { generateWebSiteSchema, generateVideoGameSchema } from '@/lib/schema';

export const viewport: Viewport = {
  themeColor: '#0d0714',
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
        <link rel="manifest" href="data:application/manifest+json;utf8,%7B%22id%22%3A%22%2F%22%2C%22name%22%3A%22Candy%20Ultra%22%2C%22short_name%22%3A%22Candy%20Ultra%22%2C%22start_url%22%3A%22%2F%22%2C%22display%22%3A%22standalone%22%2C%22orientation%22%3A%22any%22%2C%22background_color%22%3A%22%230d0714%22%2C%22theme_color%22%3A%22%230d0714%22%2C%22icons%22%3A%5B%7B%22src%22%3A%22data%3Aimage%2Fsvg%2Bxml%3Butf8%2C%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20512%20512'%3E%3Crect%20width%3D'512'%20height%3D'512'%20fill%3D'%230d0714'%2F%3E%3Ccircle%20cx%3D'256'%20cy%3D'256'%20r%3D'180'%20fill%3D'%23a855f7'%2F%3E%3C%2Fsvg%3E%22%2C%22sizes%22%3A%22512x512%22%2C%22type%22%3A%22image%2Fsvg%2Bxml%22%2C%22purpose%22%3A%22any%20maskable%22%7D%5D%2C%22screenshots%22%3A%5B%7B%22src%22%3A%22data%3Aimage%2Fsvg%2Bxml%3Butf8%2C%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%201080%201920'%3E%3Crect%20width%3D'1080'%20height%3D'1920'%20fill%3D'%230d0714'%2F%3E%3C%2Fsvg%3E%22%2C%22sizes%22%3A%221080x1920%22%2C%22type%22%3A%22image%2Fsvg%2Bxml%22%2C%22form_factor%22%3A%22narrow%22%2C%22label%22%3A%22Mobile%20View%22%7D%2C%7B%22src%22%3A%22data%3Aimage%2Fsvg%2Bxml%3Butf8%2C%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%201920%201080'%3E%3Crect%20width%3D'1920'%20height%3D'1080'%20fill%3D'%230d0714'%2F%3E%3C%2Fsvg%3E%22%2C%22sizes%22%3A%221920x1080%22%2C%22type%22%3A%22image%2Fsvg%2Bxml%22%2C%22form_factor%22%3A%22wide%22%2C%22label%22%3A%22Desktop%20View%22%7D%5D%7D" />
        <meta name="theme-color" content="#0d0714" />
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

