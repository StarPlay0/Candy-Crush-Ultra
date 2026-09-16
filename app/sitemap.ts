import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://candycrusherultra.pages.dev';

  const locations = [
    'us', 'uk', 'japan', 'germany', 'brazil', 'canada', 'australia', 'france', 'italy', 'spain',
    'mexico', 'south-korea', 'india', 'netherlands', 'sweden', 'switzerland', 'argentina', 'chile',
    'colombia', 'peru', 'singapore', 'new-zealand', 'ireland', 'norway', 'denmark', 'finland',
    'austria', 'belgium', 'portugal', 'greece', 'poland', 'czech-republic', 'hungary', 'turkey'
  ];

  const features = [
    'free-match-3-game', 'offline-puzzle-games', 'no-wifi-games', 'candy-crush-alternative',
    'play-match-3-online', 'best-puzzle-game-2026', 'brain-training-puzzles', 'casual-gaming-web',
    'pwa-games', 'local-first-gaming'
  ];

  const locationUrls = locations.map((loc) => ({
    url: `${baseUrl}/locations/${loc}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const featureUrls = features.map((feat) => ({
    url: `${baseUrl}/features/${feat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/comparison`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...locationUrls,
    ...featureUrls,
  ];
}

