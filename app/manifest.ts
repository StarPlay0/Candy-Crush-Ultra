import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Candy Crush Ultra',
    short_name: 'Candy Ultra',
    description: 'A premium, fully offline Match-3 puzzle game with 199 handcrafted levels, zero ads, and pure static performance.',
    start_url: '/',
    scope: '/',
    display: 'fullscreen',
    display_override: [
      'fullscreen',
      'standalone',
      'minimal-ui',
      'window-controls-overlay',
    ] as any,
    orientation: 'portrait' as any,
    background_color: '#FFFFFF',
    theme_color: '#FFFFFF',
    icons: [
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable' as any,
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    screenshots: [
      {
        src: '/screenshot-mobile.png',
        sizes: '1080x1920',
        type: 'image/png',
        form_factor: 'narrow' as any,
        label: 'Mobile App View',
      },
      {
        src: '/screenshot-desktop.png',
        sizes: '1920x1080',
        type: 'image/png',
        form_factor: 'wide' as any,
        label: 'Desktop App View',
      },
    ],
  };
}
