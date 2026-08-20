import type {Metadata, Viewport} from 'next';
import './globals.css';
import { PwaInstallPrompt } from '@/components/ui/pwa-install';

export const viewport: Viewport = {
  themeColor: '#FF3B30',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Candy Crush Ultra - Free Offline Match-3 Game',
  description: 'A premium, completely free, local-first Match-3 puzzle game. 199 levels, 0 ads, purely static performance.',
  manifest: '/manifest.json',
  openGraph: {
    title: 'Candy Crush Ultra',
    description: 'A premium, completely free, local-first Match-3 puzzle game.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Candy Crush Ultra',
    description: 'A premium, completely free, local-first Match-3 puzzle game.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="antialiased font-sans selection:bg-white/30 min-h-screen bg-[#5BCEFA]" style={{ background: 'radial-gradient(circle at center, #64D3FF 0%, #2980B9 100%)' }} suppressHydrationWarning>
        {children}
        <PwaInstallPrompt />
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(function(registration) {
                  console.log('ServiceWorker registration successful');
                }, function(err) {
                  console.log('ServiceWorker registration failed: ', err);
                });
              });
            }
          `
        }} />
      </body>
    </html>
  );
}
