import Link from 'next/link';
import { PremiumHeader } from '@/components/ui/premium-header';
import { FaqSection, FaqItem } from '@/components/ui/faq-section';
import { generateFaqSchema, generateBreadcrumbSchema } from '@/lib/schema';
import { Sparkles, CheckCircle2, Shield, Zap, Award } from 'lucide-react';

export const metadata = {
  title: 'Why Choose Us | Candy Crush Ultra vs The Competition',
  description: 'See why players are switching to our premium, completely free, local-first offline Match-3 engine over bloated, ad-filled alternatives.',
  alternates: {
    canonical: 'https://candycrusherultra.pages.dev/comparison',
  },
};

const comparisonFaqs: FaqItem[] = [
  {
    question: 'How is Candy Crush Ultra different from traditional match-3 games?',
    answer:
      'Unlike traditional games that lock levels behind paywalls and interrupt play with 30-second unskippable video ads, Candy Crush Ultra is 100% free, runs completely offline on your device, and delivers pure skill-based gameplay.',
  },
  {
    question: 'Why does Candy Crush Ultra load faster with zero lag?',
    answer:
      'Candy Crush Ultra is built with a modern Next.js/React SSG frontend and local-first SQLite OPFS caching. There are zero remote server queries during moves, giving you buttery-smooth 60fps animations and sub-100ms TTFB.',
  },
  {
    question: 'Are there really zero in-app purchases or pay-to-win boosters?',
    answer:
      'Yes. All boosters (Color Bombs, Striped Candies, Wrapped Candies, Lollipop Hammers, and Free Switches) are earned through milestone stars and in-game achievements.',
  },
  {
    question: 'Does my game data stay private?',
    answer:
      'Yes. We do not collect tracking data or sell your gaming habits to third-party ad brokers. Your progress is stored locally in your browser/device origin storage.',
  },
];

export default function ComparisonPage() {
  const faqSchema = generateFaqSchema(comparisonFaqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Comparison', url: '/comparison' },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-pink-50 text-slate-900 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PremiumHeader />
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-800 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-4 border border-rose-200 shadow-xs">
            <Award size={14} className="text-rose-600" />
            <span>Industrial-Grade Match-3 Architecture</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            The Industry&apos;s Most Advanced <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-purple-600">
              Match-3 Engine
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            We ripped out the ads, removed the paywalls, and built a lightning-fast, zero-latency puzzle experience that runs entirely on your device.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border-2 border-slate-200 bg-white shadow-xl mb-16">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b-2 border-slate-200">
                <th className="p-6 font-black text-slate-900 text-base uppercase tracking-wider">Feature</th>
                <th className="p-6 font-black text-pink-600 text-lg uppercase tracking-wider bg-pink-50/50">Candy Crush Ultra</th>
                <th className="p-6 font-black text-slate-500 text-base uppercase tracking-wider">Traditional Games</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold">
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="p-6 text-slate-800 font-bold">Cost to Play</td>
                <td className="p-6 text-emerald-600 font-black bg-pink-50/30 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  100% Free Forever (0 Paywalls)
                </td>
                <td className="p-6 text-slate-500">Pay-to-win & Energy timers</td>
              </tr>
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="p-6 text-slate-800 font-bold">Offline Support</td>
                <td className="p-6 text-slate-900 font-bold bg-pink-50/30">Yes, local-first DB (OPFS/Cache)</td>
                <td className="p-6 text-slate-500">Requires constant internet</td>
              </tr>
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="p-6 text-slate-800 font-bold">Ads & Interruptions</td>
                <td className="p-6 text-emerald-600 font-black bg-pink-50/30">Zero ads. Ever.</td>
                <td className="p-6 text-slate-500">Forced 30s video interstitials</td>
              </tr>
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="p-6 text-slate-800 font-bold">Performance</td>
                <td className="p-6 text-slate-900 font-bold bg-pink-50/30">&lt;100ms TTFB, 60fps native canvas</td>
                <td className="p-6 text-slate-500">Bloated engines, frame drops</td>
              </tr>
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="p-6 text-slate-800 font-bold">Privacy & Tracking</td>
                <td className="p-6 text-slate-900 font-bold bg-pink-50/30">No tracking. Data stays on device.</td>
                <td className="p-6 text-slate-500">Monetizes user behavior</td>
              </tr>
            </tbody>
          </table>
        </div>

        <FaqSection
          title="Comparison FAQs"
          subtitle="Learn why millions of puzzle players switch to local-first web gaming."
          items={comparisonFaqs}
          className="mb-16"
        />

        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden border-2 border-white/10">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-gradient-to-br from-pink-500/30 to-purple-500/30 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-gradient-to-tr from-cyan-500/20 to-pink-500/20 blur-3xl pointer-events-none"></div>
          
          <h2 className="text-3xl md:text-5xl font-black mb-6 relative z-10 tracking-tight">Ready to experience the difference?</h2>
          <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto relative z-10 font-medium">
            Jump directly into Level 1 with 199 levels of delicious candy puzzles.
          </p>
          <Link href="/" className="inline-flex relative z-10 items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 text-white font-black py-4 px-10 rounded-2xl text-lg transition-transform active:scale-95 shadow-xl border-b-4 border-purple-800">
            Launch Game Now
          </Link>
        </div>
      </div>
    </div>
  );
}

