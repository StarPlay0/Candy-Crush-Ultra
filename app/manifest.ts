import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Candy Ultra',
    short_name: 'Candy Ultra',
    description: 'A premium, fully offline, local-first Match-3 puzzle game.',
    start_url: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#0d0714',
    theme_color: '#0d0714',
    icons: [
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable' as any,
      },
    ],
    screenshots: [
      {
        src: '/screenshot-mobile.png',
        sizes: '1080x1920',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Mobile App View',
      },
      {
        src: '/screenshot-desktop.png',
        sizes: '1920x1080',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Desktop App View',
      },
    ],
  };
}
