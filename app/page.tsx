import { PremiumHeader } from '@/components/ui/premium-header';
import { TrustBar } from '@/components/ui/trust-bar';
import { Match3Board } from '@/components/game/match3-board';
import { Testimonials } from '@/components/ui/testimonials';
import { FaqSection, FaqItem } from '@/components/ui/faq-section';
import Link from 'next/link';
import { SplashScreen } from '@/components/ui/splash-screen';
import { PwaInstallPrompt } from '@/components/ui/pwa-install';
import { Sparkles, Star, Award, CheckCircle2 } from 'lucide-react';
import { generateFaqSchema, generateBreadcrumbSchema } from '@/lib/schema';

const homeFaqs: FaqItem[] = [
  {
    question: 'Is Candy Crush Ultra really 100% free to play?',
    answer:
      'Yes, Candy Crush Ultra is 100% free with all 199 levels unlocked through gameplay skill. There are no paywalls, hidden in-app purchases, or forced energy timers.',
  },
  {
    question: 'Can I play Candy Crush Ultra offline without Wi-Fi?',
    answer:
      'Yes! Candy Crush Ultra is built on a progressive web app and local-first architecture (SQLite OPFS/Cache), so you can play all levels, hear audio effects, and save your star progress completely offline.',
  },
  {
    question: 'How do Color Bombs and special combos work?',
    answer:
      'Matching 5 candies in a row creates a multi-color sprinkle Color Bomb. Swapping it with any candy zaps all candies of that color. Combining a Color Bomb with a Striped candy transforms every matching candy on the board into striped lasers for massive board-clearing cascades!',
  },
  {
    question: 'Can I install Candy Crush Ultra as an app on my phone or PC?',
    answer:
      'Yes, you can install Candy Crush Ultra directly to your Android, iOS, Windows, or Mac home screen via the PWA Install button or convert it into an APK/AAB package.',
  },
  {
    question: 'How many levels are included in the Saga map?',
    answer:
      'The game features 199 handcrafted levels across vibrant sweet biomes with moving obstacles, chocolate blockers, jelly clearing, and target score objectives.',
  },
  {
    question: 'Is my game progress saved automatically?',
    answer:
      'Yes, your high scores, unlocked levels, stars earned (up to 3 stars per level), and boosters are saved instantly to your device local storage with zero cloud latency.',
  },
];

export default function Home() {
  const faqSchema = generateFaqSchema(homeFaqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
  ]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#BAE6FD] via-[#FBCFE8] to-[#E0D4FD] text-slate-800 overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SplashScreen />
      <PwaInstallPrompt />
      
      {/* High Quality Luxury Premium Header */}
      <PremiumHeader />

      <TrustBar />

      {/* Hero / Game Area */}
      <section id="game-board" className="pt-2 pb-12 px-2 sm:px-4 md:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center justify-center">
          {/* Full Interactive Match-3 Candy Crush App */}
          <div className="w-full flex justify-center">
            <Match3Board />
          </div>
        </div>
      </section>

      {/* Comparison Spotlight Section on Homepage (SEO & User Authority) */}
      <section className="py-12 px-4 bg-white/40 backdrop-blur-md border-y border-white/40">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
            Why Players Choose Candy Crush Ultra
          </h2>
          <p className="text-slate-600 font-bold mb-8 max-w-2xl mx-auto text-sm sm:text-base">
            Engineered with zero pay-to-win locks, real Web Audio physics, and smooth swipe drag-and-drop controls.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white/80 p-6 rounded-3xl border-2 border-pink-200 shadow-md">
              <div className="w-10 h-10 rounded-2xl bg-pink-500 text-white flex items-center justify-center font-black mb-3">
                1
              </div>
              <h3 className="font-black text-lg text-slate-900 mb-2">Color Bomb Mechanics</h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                Connect the sprinkle ball with any candy to discharge high-voltage lightning zaps across the entire board. Form combos like Striped + Bomb for instant board cascades!
              </p>
            </div>

            <div className="bg-white/80 p-6 rounded-3xl border-2 border-purple-200 shadow-md">
              <div className="w-10 h-10 rounded-2xl bg-purple-500 text-white flex items-center justify-center font-black mb-3">
                2
              </div>
              <h3 className="font-black text-lg text-slate-900 mb-2">Authentic Saga Map</h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                Explore an interactive candy-cane road with 199 levels, 3-star milestone rewards, and charming characters like Tiffi, Yeti, and the Jelly Monster.
              </p>
            </div>

            <div className="bg-white/80 p-6 rounded-3xl border-2 border-teal-200 shadow-md">
              <div className="w-10 h-10 rounded-2xl bg-teal-500 text-white flex items-center justify-center font-black mb-3">
                3
              </div>
              <h3 className="font-black text-lg text-slate-900 mb-2">APK & PWA Ready</h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                Seamlessly converts to Android APK / AAB or install directly to home screen with 0ms offline latency via SQLite WASM local storage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User Reviews & Testimonials */}
      <Testimonials />

      {/* Interactive FAQ Section with Schema-compliant markup */}
      <FaqSection
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about gameplay, level progression, offline modes, and installation."
        items={homeFaqs}
        className="bg-white/30 backdrop-blur-xs border-b border-white/40"
      />

      {/* SEO Footer & Internal Links */}
      <footer className="bg-slate-900 text-white/80 py-16 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 font-bold tracking-wide">
          <div>
            <h3 className="text-white font-black uppercase tracking-widest text-xl mb-4">Candy Crush Ultra</h3>
            <p className="text-sm leading-relaxed mb-6 font-medium text-slate-400">
              The premier destination for ad-free, pure-skill Match-3 gaming. Built on a revolutionary zero-latency PWA engine.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-black uppercase tracking-widest mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/" className="hover:text-white transition-colors">Play Saga Map</Link></li>
              <li><Link href="/comparison" className="hover:text-white transition-colors">Why Choose Us</Link></li>
              <li><Link href="/features/free-match-3-game" className="hover:text-white transition-colors">Free Match 3</Link></li>
              <li><Link href="/features/offline-puzzle-games" className="hover:text-white transition-colors">Offline Puzzles</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-widest mb-4">Top Locations</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/locations/us" className="hover:text-white transition-colors">United States</Link></li>
              <li><Link href="/locations/uk" className="hover:text-white transition-colors">United Kingdom</Link></li>
              <li><Link href="/locations/japan" className="hover:text-white transition-colors">Japan</Link></li>
              <li><Link href="/locations/brazil" className="hover:text-white transition-colors">Brazil</Link></li>
              <li><Link href="/locations/germany" className="hover:text-white transition-colors">Germany</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-black uppercase tracking-widest mb-4">Legal & Privacy</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><span className="cursor-pointer hover:text-white">Privacy Policy</span></li>
              <li><span className="cursor-pointer hover:text-white">Terms of Service</span></li>
            </ul>
          </div>
        </div>
      </footer>
    </main>
  );
}

