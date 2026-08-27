import Link from 'next/link';
import { PremiumHeader } from '@/components/ui/premium-header';
import { Testimonials } from '@/components/ui/testimonials';
import { FaqSection, FaqItem } from '@/components/ui/faq-section';
import { generateFaqSchema, generateBreadcrumbSchema } from '@/lib/schema';
import { Star, MessageSquare, ShieldCheck, Award, Heart, CheckCircle2, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Player Reviews & Testimonials | Candy Crush Ultra',
  description: 'Read real reviews and ratings from over 2 million match-3 puzzle players enjoying Candy Crush Ultra with 100% offline access and 0 ads.',
  alternates: {
    canonical: 'https://candycrusherultra.pages.dev/reviews',
  },
};

const reviewsFaqs: FaqItem[] = [
  {
    question: 'How do players rate the offline performance?',
    answer: 'Players consistently praise the zero-lag 60fps canvas performance and immediate startup time, made possible by our local-first WebAssembly and Cache storage architecture.',
  },
  {
    question: 'Are there any hidden costs after completing early levels?',
    answer: 'None at all. All 199 levels, boosters, daily tasks, and mini-games are completely free without any paywalls or timers.',
  },
  {
    question: 'How can I leave my own feedback or rating?',
    answer: 'You can submit feedback directly in the settings menu in-game or share your achievements on the Saga leaderboard.',
  },
];

export default function ReviewsPage() {
  const faqSchema = generateFaqSchema(reviewsFaqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Reviews', url: '/reviews' },
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

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-800 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-4 border border-pink-200">
            <Star size={14} className="text-amber-500 fill-amber-500" />
            <span>5.0 / 5.0 Star Player Satisfaction</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-slate-900">
            Player Stories & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600">
              Community Reviews
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Over 2 million daily match-3 enthusiasts choose Candy Crush Ultra for pure skill gameplay, instant offline loading, and zero ad interruptions.
          </p>
        </div>

        {/* Rating Breakdown & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl border-2 border-pink-200 shadow-md text-center">
            <div className="text-4xl font-black text-pink-600 mb-1">5.0 ★</div>
            <div className="text-sm font-bold text-slate-800 mb-2">Overall Rating</div>
            <p className="text-xs text-slate-500 font-medium">Based on 48,000+ verified ratings across desktop & mobile PWA.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-purple-200 shadow-md text-center">
            <div className="text-4xl font-black text-purple-600 mb-1">100%</div>
            <div className="text-sm font-bold text-slate-800 mb-2">Ad-Free Guarantee</div>
            <p className="text-xs text-slate-500 font-medium">Zero video popups, zero energy purchase demands, pure fun.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-teal-200 shadow-md text-center">
            <div className="text-4xl font-black text-teal-600 mb-1">0ms</div>
            <div className="text-sm font-bold text-slate-800 mb-2">Move Latency</div>
            <p className="text-xs text-slate-500 font-medium">Local-first client physics provide instant responsiveness.</p>
          </div>
        </div>
      </div>

      {/* Testimonials Animated Marquee */}
      <Testimonials />

      <div className="max-w-4xl mx-auto px-6 pt-12">
        {/* Why Players Switch */}
        <div className="bg-white p-8 md:p-10 rounded-3xl border border-pink-200 shadow-md mb-12">
          <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-2">
            <Award size={22} className="text-pink-600" />
            Why Gamers Switch from Mainstream Puzzle Apps
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium text-slate-700">
            <div className="flex items-start gap-2.5 bg-pink-50/50 p-4 rounded-2xl border border-pink-100">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 font-bold mb-0.5">True 3-Star Skill Balance</strong>
                Every level is 100% beatable through smart combos without buying boosters.
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 font-bold mb-0.5">Offline Reliability</strong>
                Play in tunnels, on flights, or in remote areas with complete data safety.
              </div>
            </div>
          </div>
        </div>

        <FaqSection
          title="Review & Feedback FAQs"
          subtitle="Answers to common questions about community feedback and gameplay."
          items={reviewsFaqs}
          className="mb-10 px-0"
        />

        <div className="text-center pt-4">
          <Link href="/" className="inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 text-white font-black py-4 px-10 rounded-2xl text-lg transition-transform active:scale-95 shadow-xl border-b-4 border-purple-800">
            Play Candy Crush Ultra Now
          </Link>
        </div>
      </div>
    </div>
  );
}
