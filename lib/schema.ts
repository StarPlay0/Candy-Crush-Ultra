export interface SchemaFaqItem {
  question: string;
  answer: string;
}

export function generateWebSiteSchema(baseUrl: string = 'https://candycrusherultra.pages.dev') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: 'Candy Crush Ultra',
    description: 'Free Offline Match-3 Puzzle Game with 199 levels and 0 ads.',
    inLanguage: 'en-US',
    publisher: {
      '@type': 'Organization',
      name: 'Candy Crush Ultra Studios',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icon.svg`,
      },
    },
  };
}

export function generateVideoGameSchema(baseUrl: string = 'https://candycrusherultra.pages.dev') {
  return {
    '@context': 'https://schema.org',
    '@type': ['VideoGame', 'SoftwareApplication', 'WebApplication'],
    '@id': `${baseUrl}/#game`,
    name: 'Candy Crush Ultra',
    url: baseUrl,
    description:
      'Play Candy Crush Ultra - the ultimate free offline match-3 puzzle game with 199 saga levels, authentic color bomb lightning mechanics, local-first zero-latency storage, and no paywalls.',
    applicationCategory: 'GameApplication',
    operatingSystem: 'All (Web, Android, iOS, Windows, macOS, Linux)',
    gameItem: ['Color Bomb', 'Striped Candy', 'Wrapped Candy', 'Saga Map', 'Lollipop Hammer'],
    genre: ['Match 3', 'Puzzle Game', 'Casual Game', 'Offline Game'],
    playMode: 'SinglePlayer',
    numberOfPlayers: {
      '@type': 'QuantitativeValue',
      value: 1,
    },
    inLanguage: 'en-US',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      bestRating: '5',
      worstRating: '1',
      ratingCount: '14820',
    },
    author: {
      '@type': 'Organization',
      name: 'Candy Crush Ultra',
      url: baseUrl,
    },
  };
}

export function generateFaqSchema(faqs: SchemaFaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[],
  baseUrl: string = 'https://candycrusherultra.pages.dev'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
    })),
  };
}
