import { SEO_FEATURES } from '@/lib/constants';
import Link from 'next/link';
import { PremiumHeader } from '@/components/ui/premium-header';
import { FaqSection, FaqItem } from '@/components/ui/faq-section';
import { Testimonials } from '@/components/ui/testimonials';
import { generateFaqSchema, generateBreadcrumbSchema } from '@/lib/schema';
import { Sparkles, CheckCircle2, ShieldCheck, Zap, Trophy, Flame, Smartphone } from 'lucide-react';

export function generateStaticParams() {
  return SEO_FEATURES.map((feature) => ({
    feature,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ feature: string }> }) {
  const { feature } = await params;
  const formattedFeature = feature ? feature.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) : 'Match 3';
  return {
    title: `${formattedFeature} | Candy Crush Ultra Free Match-3`,
    description: `Discover everything about ${formattedFeature} with our completely offline, local-first premium Match-3 puzzle engine. 199 levels, 0 ads.`,
    alternates: {
      canonical: `https://candycrusherultra.pages.dev/features/${feature}`,
    },
  };
}

export default async function FeaturePage({ params }: { params: Promise<{ feature: string }> }) {
  const { feature } = await params;
  const formattedFeature = feature.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const featureFaqs: FaqItem[] = [
    {
      question: `How does Candy Crush Ultra provide the best ${formattedFeature} experience?`,
      answer: `Our game is engineered as a zero-latency progressive web app using local-first SQLite OPFS storage. You get 60fps performance and instant response times without needing an active internet connection.`,
    },
    {
      question: `Are all 199 levels accessible in ${formattedFeature}?`,
      answer: `Yes! Every single level from 1 to 199 is 100% free and unlocked through skill progression. There are no paywalls or energy recharge timers.`,
    },
    {
      question: `Can I play offline without consuming mobile data?`,
      answer: `Absolutely. Once loaded or installed as a PWA, the entire game engine, audio synthesizer, and graphics assets run completely offline.`,
    },
    {
      question: `How do special combos work in ${formattedFeature}?`,
      answer: `Match 4 candies to build Striped candies that wipe entire rows/columns, match 5 candies for multi-color sprinkle Color Bombs, and match in T/L shapes for Wrapped candies. Combine special candies for massive explosions!`,
    },
  ];

  const faqSchema = generateFaqSchema(featureFaqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Features', url: '/features' },
    { name: formattedFeature, url: `/features/${feature}` },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-pink-50 text-slate-900 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PremiumHeader />
      
      <div className="max-w-4xl mx-auto px-6 pt-10">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-pink-100 mb-12">
          <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-800 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-4 border border-pink-200">
            <Sparkles size={14} className="text-pink-600" />
            <span>Feature Showcase</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight text-slate-900">
            The Ultimate Guide to <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 bg-clip-text text-transparent">{formattedFeature}</span>
          </h1>
          
          <div className="prose prose-lg prose-slate max-w-none">
            <p className="lead text-lg sm:text-xl text-slate-600 mb-8 font-medium">
              When looking for <strong>{formattedFeature.toLowerCase()}</strong>, players demand authentic candy match-3 physics, responsive swipe controls, and uninterrupted gameplay without pay-to-win locks.
            </p>

            <h2 className="text-2xl font-black mt-8 mb-4 text-slate-900">Why {formattedFeature} with Candy Crush Ultra?</h2>
            <p className="mb-6 text-slate-700 leading-relaxed font-medium">
              In modern mobile gaming, bloated applications drain batteries and rely on continuous server connections for telemetry and advertisements. By building a pure HTML5 Canvas and React application, we eliminate network latency and deliver lightning-fast candy blasting.
            </p>

            {/* Why Choose Us Spotlight in Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8 not-prose">
              <div className="bg-pink-50/80 p-5 rounded-2xl border border-pink-200 text-center">
                <div className="w-10 h-10 rounded-xl bg-pink-500 text-white flex items-center justify-center font-black mx-auto mb-2 shadow-xs">
                  <Flame size={20} />
                </div>
                <h4 className="font-black text-sm text-slate-900 mb-1">Zero Paywalls</h4>
                <p className="text-xs text-slate-600 font-medium">All 199 levels unlocked through pure skill progression.</p>
              </div>

              <div className="bg-purple-50/80 p-5 rounded-2xl border border-purple-200 text-center">
                <div className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center font-black mx-auto mb-2 shadow-xs">
                  <Trophy size={20} />
                </div>
                <h4 className="font-black text-sm text-slate-900 mb-1">Instant Boosters</h4>
                <p className="text-xs text-slate-600 font-medium">Earn Color Bombs & Hammers via daily sticky note challenges.</p>
              </div>

              <div className="bg-teal-50/80 p-5 rounded-2xl border border-teal-200 text-center">
                <div className="w-10 h-10 rounded-xl bg-teal-500 text-white flex items-center justify-center font-black mx-auto mb-2 shadow-xs">
                  <Smartphone size={20} />
                </div>
                <h4 className="font-black text-sm text-slate-900 mb-1">100% Offline</h4>
                <p className="text-xs text-slate-600 font-medium">Works on subway, airplane, and without Wi-Fi or data.</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-2xl my-8 border-2 border-pink-200">
              <h3 className="font-black text-lg mb-3 text-slate-900 flex items-center gap-2">
                <ShieldCheck size={20} className="text-emerald-600" />
                Guaranteed Player Protections
              </h3>
              <ul className="space-y-2 text-slate-700 font-medium text-sm sm:text-base">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  100% Offline capability with local-first persistence
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  Zero latency swipe & match interactions (60fps canvas)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  No unskippable video ads, tracking cookies, or subscriptions
                </li>
              </ul>
            </div>

            <FaqSection
              title={`${formattedFeature} FAQs`}
              subtitle={`Common questions regarding ${formattedFeature.toLowerCase()} in Candy Crush Ultra.`}
              items={featureFaqs}
              className="my-8 px-0"
            />
          </div>
        </div>
      </div>

      {/* Testimonials on Feature Pages */}
      <Testimonials />

      <div className="max-w-4xl mx-auto px-6 pt-10 text-center">
        <Link href="/" className="inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 text-white font-black py-4 px-10 rounded-2xl text-lg transition-transform active:scale-95 shadow-xl border-b-4 border-purple-800">
          Play Candy Crush Ultra Now
        </Link>
      </div>
    </div>
  );
}


