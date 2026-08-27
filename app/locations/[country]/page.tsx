import { SEO_LOCATIONS } from '@/lib/constants';
import Link from 'next/link';
import { PremiumHeader } from '@/components/ui/premium-header';
import { FaqSection, FaqItem } from '@/components/ui/faq-section';
import { Testimonials } from '@/components/ui/testimonials';
import { generateFaqSchema, generateBreadcrumbSchema } from '@/lib/schema';
import { Sparkles, MapPin, Trophy, ShieldCheck, Flame, Smartphone, CheckCircle2 } from 'lucide-react';

export function generateStaticParams() {
  return SEO_LOCATIONS.map((country) => ({
    country,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const formattedCountry = country ? country.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) : 'Global';
  return {
    title: `Play Free Match-3 Games in ${formattedCountry} | Candy Crush Ultra`,
    description: `Discover the ultimate offline puzzle experience in ${formattedCountry}. Zero latency, no signup, purely local-first Match-3 gaming with 199 levels.`,
    alternates: {
      canonical: `https://candycrusherultra.pages.dev/locations/${country}`,
    },
  };
}

export default async function LocationPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const formattedCountry = country.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const locationFaqs: FaqItem[] = [
    {
      question: `Is Candy Crush Ultra available for players in ${formattedCountry}?`,
      answer: `Yes! Candy Crush Ultra is accessible globally from ${formattedCountry} on all mobile browsers, tablets, and desktop computers with zero geo-restrictions or signup requirements.`,
    },
    {
      question: `Can I play without using cellular data in ${formattedCountry}?`,
      answer: `Yes, after your initial visit, all 199 levels and audio soundscapes are cached locally on your device for 100% offline play.`,
    },
    {
      question: `Is there any cost or subscription fee for players in ${formattedCountry}?`,
      answer: `Candy Crush Ultra is 100% free forever. There are zero subscription charges, in-app purchases, or pay-to-win locks.`,
    },
    {
      question: `Can I install this on Android or iPhone in ${formattedCountry}?`,
      answer: `Yes! You can tap Install PWA in your browser or install via APK / AAB package in ${formattedCountry} for standalone offline gaming.`,
    },
  ];

  const faqSchema = generateFaqSchema(locationFaqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Locations', url: '/locations' },
    { name: formattedCountry, url: `/locations/${country}` },
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
      
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white border-2 border-pink-200 rounded-3xl p-8 md:p-12 mb-12 shadow-xl">
          <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-800 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-4 border border-pink-200">
            <MapPin size={14} className="text-pink-600" />
            <span>Regional Gaming Hub</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-slate-900 leading-tight">
            The #1 Offline Match-3 Game in <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 bg-clip-text text-transparent">{formattedCountry}</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-8 font-medium leading-relaxed">
            Experience the next generation of puzzle gaming without internet requirements. Purely local-first, lightning fast, and 100% free for players across {formattedCountry}.
          </p>
          <Link href="/" className="inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 text-white font-black py-4 px-10 rounded-2xl text-lg transition-transform active:scale-95 shadow-xl border-b-4 border-purple-800">
            Play Now for Free
          </Link>
        </div>

        {/* Why Choose Us in Regional Pages */}
        <section className="space-y-6 bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm mb-12">
          <article>
            <h2 className="text-2xl font-black mb-3 text-slate-900 flex items-center gap-2">
              <Sparkles size={20} className="text-amber-500" />
              Why {formattedCountry} Players Choose Us
            </h2>
            <p className="text-slate-700 leading-relaxed font-medium mb-6">
              We built this game specifically with performance in mind. Whether you are commuting, on a flight, or relaxing at home in {formattedCountry}, our zero-latency local-first architecture means the game loads instantly and never requires a continuous connection.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-pink-50 p-4 rounded-2xl border border-pink-200">
                <div className="font-black text-slate-900 text-sm mb-1 flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  0 Data Usage
                </div>
                <p className="text-xs text-slate-600">Cached on device after first load for 100% offline play.</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200">
                <div className="font-black text-slate-900 text-sm mb-1 flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  Zero Ads
                </div>
                <p className="text-xs text-slate-600">No interruptions, video popups, or energy timer limits.</p>
              </div>

              <div className="bg-teal-50 p-4 rounded-2xl border border-teal-200">
                <div className="font-black text-slate-900 text-sm mb-1 flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  199 Levels
                </div>
                <p className="text-xs text-slate-600">Complete Saga Map with 3-star milestone rewards.</p>
              </div>
            </div>
          </article>

          <article className="pt-6 border-t border-slate-100">
            <h2 className="text-2xl font-black mb-3 text-slate-900 flex items-center gap-2">
              <Trophy size={20} className="text-purple-600" />
              199 Levels of Pure Match-3 Mastery
            </h2>
            <p className="text-slate-700 leading-relaxed font-medium">
              Our 199-level progression tree is carefully balanced to provide the perfect mix of challenge and reward. No frustrating paywalls, just pure skill-based Match-3 mechanics with satisfying combos, multi-beam Color Bombs, and powerful boosters.
            </p>
          </article>
        </section>

        <FaqSection
          title={`${formattedCountry} FAQs`}
          subtitle={`Frequently asked questions for puzzle players located in ${formattedCountry}.`}
          items={locationFaqs}
          className="mb-10 px-0"
        />
      </div>

      {/* Regional Testimonials Marquee */}
      <Testimonials />

      <div className="max-w-4xl mx-auto px-6 pt-10 text-center">
        <Link href="/" className="inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 text-white font-black py-4 px-10 rounded-2xl text-lg transition-transform active:scale-95 shadow-xl border-b-4 border-purple-800">
          Start Playing in {formattedCountry}
        </Link>
      </div>
    </div>
  );
}


