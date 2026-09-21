import { PremiumHeader } from '@/components/ui/premium-header';
import { TrustBar } from '@/components/ui/trust-bar';
import { Match3Board } from '@/components/game/match3-board';
import Link from 'next/link';
import { SplashScreen } from '@/components/ui/splash-screen';
import { generateBreadcrumbSchema } from '@/lib/schema';

export default function Home() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
  ]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#BAE6FD] via-[#FBCFE8] to-[#E0D4FD] text-slate-800 overflow-x-hidden pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SplashScreen />
      
      {/* High Quality Luxury Premium Header */}
      <PremiumHeader />

      <TrustBar />

      {/* Hero / Game Area */}
      <section id="game-board" className="pt-2 pb-8 px-2 sm:px-4 md:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center justify-center">
          {/* Full Interactive Match-3 Candy Crush App */}
          <div className="w-full flex justify-center">
            <Match3Board />
          </div>
        </div>
      </section>

      {/* Quick Navigation Cards */}
      <section className="py-6 px-4 max-w-4xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/comparison"
            className="bg-white/75 hover:bg-white/95 border border-white/80 p-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all text-center group"
          >
            <div className="text-xl mb-1 group-hover:scale-110 transition-transform">🏆</div>
            <div className="font-black text-xs text-slate-900">Why Choose Us</div>
            <div className="text-[10px] font-semibold text-slate-500">100% Free vs Ads</div>
          </Link>

          <Link
            href="/reviews"
            className="bg-white/75 hover:bg-white/95 border border-white/80 p-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all text-center group"
          >
            <div className="text-xl mb-1 group-hover:scale-110 transition-transform">⭐</div>
            <div className="font-black text-xs text-slate-900">Player Reviews</div>
            <div className="text-[10px] font-semibold text-slate-500">5.0 Star Ratings</div>
          </Link>

          <Link
            href="/features/free-match-3-game"
            className="bg-white/75 hover:bg-white/95 border border-white/80 p-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all text-center group"
          >
            <div className="text-xl mb-1 group-hover:scale-110 transition-transform">⚡</div>
            <div className="font-black text-xs text-slate-900">Game Features</div>
            <div className="text-[10px] font-semibold text-slate-500">Offline & Combos</div>
          </Link>

          <Link
            href="/faq"
            className="bg-white/75 hover:bg-white/95 border border-white/80 p-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all text-center group"
          >
            <div className="text-xl mb-1 group-hover:scale-110 transition-transform">💡</div>
            <div className="font-black text-xs text-slate-900">FAQs & Guide</div>
            <div className="text-[10px] font-semibold text-slate-500">Answers & Tips</div>
          </Link>
        </div>
      </section>

      {/* SEO Footer & Internal Links */}
      <footer className="hidden bg-slate-900 text-white/80 py-12 px-6 border-t border-slate-800 mt-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 font-bold tracking-wide">
          <div>
            <h3 className="text-white font-black uppercase tracking-widest text-lg mb-3">Candy Crush Ultra</h3>
            <p className="text-sm leading-relaxed font-medium text-slate-400">
              The premier destination for ad-free, pure-skill Match-3 gaming. Built on a revolutionary zero-latency PWA engine.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-3">Explore</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/" className="hover:text-white transition-colors">Play Saga Map</Link></li>
              <li><Link href="/comparison" className="hover:text-white transition-colors">Why Choose Us</Link></li>
              <li><Link href="/reviews" className="hover:text-white transition-colors">Player Reviews</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">Game FAQs</Link></li>
              <li><Link href="/features/free-match-3-game" className="hover:text-white transition-colors">Free Match 3</Link></li>
              <li><Link href="/features/offline-puzzle-games" className="hover:text-white transition-colors">Offline Puzzles</Link></li>
              <li><a href="/privacy.html" className="text-pink-400 hover:text-pink-300 font-bold transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-3">Top Locations</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/locations/us" className="hover:text-white transition-colors">United States</Link></li>
              <li><Link href="/locations/uk" className="hover:text-white transition-colors">United Kingdom</Link></li>
              <li><Link href="/locations/japan" className="hover:text-white transition-colors">Japan</Link></li>
              <li><Link href="/locations/brazil" className="hover:text-white transition-colors">Brazil</Link></li>
              <li><Link href="/locations/germany" className="hover:text-white transition-colors">Germany</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-3">Guarantees</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><span className="text-emerald-400">✓ 100% Free Forever</span></li>
              <li><span className="text-emerald-400">✓ Zero Video Ads</span></li>
              <li><span className="text-emerald-400">✓ 100% Offline Capable</span></li>
              <li><span className="text-emerald-400">✓ 199 Handcrafted Levels</span></li>
            </ul>
          </div>
        </div>
      </footer>
    </main>
  );
}


