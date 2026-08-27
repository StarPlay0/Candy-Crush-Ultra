import Link from 'next/link';
import { PremiumHeader } from '@/components/ui/premium-header';
import { FaqSection, FaqItem } from '@/components/ui/faq-section';
import { Testimonials } from '@/components/ui/testimonials';
import { generateFaqSchema, generateBreadcrumbSchema } from '@/lib/schema';
import { HelpCircle, Sparkles, BookOpen, ShieldCheck, Zap, Flame, Trophy, Smartphone } from 'lucide-react';

export const metadata = {
  title: 'Frequently Asked Questions & Guide | Candy Crush Ultra',
  description: 'Find complete answers to all your questions about Candy Crush Ultra mechanics, special candy combos, offline mode, level progression, and installation.',
  alternates: {
    canonical: 'https://candycrusherultra.pages.dev/faq',
  },
};

const fullFaqList: FaqItem[] = [
  {
    question: 'Is Candy Crush Ultra really 100% free to play forever?',
    answer:
      'Yes! Candy Crush Ultra is completely free with all 199 levels unlocked through gameplay skill. There are no paywalls, hidden in-app purchases, or forced energy recharge timers.',
  },
  {
    question: 'How do I create special candies and explosive combos?',
    answer:
      'Match 4 in a line for Striped Candies (clears whole row/column). Match in T or L shape for Wrapped Candies (3x3 explosion). Match 5 in a row for the Color Bomb (sprinkle ball). Combine a Color Bomb with a Striped candy to turn every matching colored candy into striped lasers!',
  },
  {
    question: 'Can I play Candy Crush Ultra offline without Wi-Fi or data?',
    answer:
      'Yes! Candy Crush Ultra uses a local-first Progressive Web App architecture with SQLite OPFS and browser Cache storage. All levels, audio synthesizers, and graphics run 100% offline.',
  },
  {
    question: 'How do I install Candy Crush Ultra on my home screen or desktop?',
    answer:
      'Click the "Install App" button at the bottom of the screen or your browser\'s address bar install icon. You can also export or convert to an Android APK / AAB package.',
  },
  {
    question: 'How do the daily Sticky Notes Tasks and Candy Shop work?',
    answer:
      'Tap the sparkles FAB or Events tab on the bottom bar to open your daily sticky notes tasks. Completing challenges awards gold coins that you can spend in the Candy Shop for Lollipop Hammers, Free Switches, and Color Bombs.',
  },
  {
    question: 'Will my progress and high scores be saved if I close the browser?',
    answer:
      'Yes! All stars, unlocked levels, booster counts, and high scores are saved immediately to your local device database (IndexedDB / SQLite WASM) with zero latency.',
  },
  {
    question: 'Are the 199 levels beatable without paying for boosters?',
    answer:
      '100% yes. Every single level is designed and mathematically verified for strategic completion through matching skill and earned in-game boosters.',
  },
];

export default function FaqPage() {
  const faqSchema = generateFaqSchema(fullFaqList);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'FAQ', url: '/faq' },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-pink-50 text-slate-900 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PremiumHeader />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-800 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-4 border border-pink-200">
            <HelpCircle size={14} className="text-pink-600" />
            <span>Knowledge Base & Support</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-slate-900">
            Frequently Asked <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600">
              Questions & Guide
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            Everything you need to know about game rules, special combos, offline mode, and PWA installation.
          </p>
        </div>

        {/* Quick Tips Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="bg-white p-5 rounded-2xl border border-pink-200 shadow-sm">
            <div className="text-2xl mb-2">🍬</div>
            <h2 className="font-black text-sm text-slate-900 mb-1">Color Bomb + Striped</h2>
            <p className="text-xs text-slate-600">Swap a sprinkle ball with a striped candy to clear dozens of candies at once!</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-purple-200 shadow-sm">
            <div className="text-2xl mb-2">⭐</div>
            <h2 className="font-black text-sm text-slate-900 mb-1">3-Star Mastery</h2>
            <p className="text-xs text-slate-600">Finish levels with leftover moves to trigger Sugar Crush bonus cascades.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-teal-200 shadow-sm">
            <div className="text-2xl mb-2">📱</div>
            <h2 className="font-black text-sm text-slate-900 mb-1">Offline Anywhere</h2>
            <p className="text-xs text-slate-600">Install to your phone and play without internet, data, or Wi-Fi.</p>
          </div>
        </div>

        <FaqSection
          title="All Gameplay & Technical FAQs"
          subtitle="Detailed answers directly from the Candy Crush Ultra development team."
          items={fullFaqList}
          className="px-0 mb-12"
        />
      </div>

      {/* Testimonials on FAQ Page */}
      <Testimonials />

      <div className="max-w-4xl mx-auto px-6 pt-10 text-center">
        <Link href="/" className="inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 text-white font-black py-4 px-10 rounded-2xl text-lg transition-transform active:scale-95 shadow-xl border-b-4 border-purple-800">
          Jump Back into the Game
        </Link>
      </div>
    </div>
  );
}
