import { PremiumHeader } from '@/components/ui/premium-header';
import { TrustBar } from '@/components/ui/trust-bar';
import { Match3Board } from '@/components/game/match3-board';
import { Testimonials } from '@/components/ui/testimonials';
import Link from 'next/link';
import { SplashScreen } from '@/components/ui/splash-screen';
import { PwaInstallPrompt } from '@/components/ui/pwa-install';
import { Sparkles, Trophy, ShieldCheck, Zap, Star, Award, CheckCircle2 } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#BAE6FD] via-[#FBCFE8] to-[#E0D4FD] text-slate-800 overflow-x-hidden">
      <SplashScreen />
      <PwaInstallPrompt />
      
      {/* High Quality Luxury Premium Header */}
      <PremiumHeader />

      <TrustBar />

      {/* Hero / Game Area */}
      <section id="game-board" className="pt-6 pb-16 px-4 md:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col xl:flex-row items-center justify-between gap-10">
          
          {/* Left Hero Content */}
          <div className="flex-1 text-center xl:text-left">
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-md px-4 py-1.5 rounded-full border-2 border-pink-300 shadow-md mb-4">
              <Sparkles size={16} className="text-pink-500" />
              <span className="text-pink-900 font-black text-xs uppercase tracking-widest">
                Candy Kingdom Saga Map • 199 Levels
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight select-none mb-4 leading-tight drop-shadow-sm">
              Sweetest <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 bg-clip-text text-transparent">Match-3 Saga</span> <br className="hidden sm:inline" />
              Ever Created
            </h1>

            <p className="text-base sm:text-lg text-slate-700 mb-6 max-w-xl mx-auto xl:mx-0 font-bold leading-relaxed">
              Match vibrant candies, unleash multi-beam Color Bombs (&quot;bolls&quot;), blast striped lasers, and conquer the winding sugar road with Tiffi and Yeti. 100% Free & Offline.
            </p>

            {/* Quick Feature Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 max-w-lg mx-auto xl:mx-0">
              <div className="bg-white/60 backdrop-blur-md p-3 rounded-2xl border border-white/80 shadow-sm flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 font-black">
                  <Zap size={18} />
                </div>
                <div className="text-left">
                  <div className="text-xs font-black text-slate-900">Color Bombs</div>
                  <div className="text-[10px] font-bold text-slate-500">Lightning Zaps</div>
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-md p-3 rounded-2xl border border-white/80 shadow-sm flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 font-black">
                  <Trophy size={18} />
                </div>
                <div className="text-left">
                  <div className="text-xs font-black text-slate-900">199 Levels</div>
                  <div className="text-[10px] font-bold text-slate-500">Saga Map</div>
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-md p-3 rounded-2xl border border-white/80 shadow-sm flex items-center gap-2 col-span-2 sm:col-span-1">
                <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600 font-black">
                  <ShieldCheck size={18} />
                </div>
                <div className="text-left">
                  <div className="text-xs font-black text-slate-900">100% Offline</div>
                  <div className="text-[10px] font-bold text-slate-500">Local-First</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center xl:justify-start">
              <Link 
                href="/comparison" 
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-105 border-b-4 border-purple-800 rounded-2xl py-3.5 px-6 text-base font-black text-white uppercase tracking-wider shadow-lg active:border-b-0 active:translate-y-1 transition-all text-center"
              >
                Why Choose Us vs Rivals
              </Link>
            </div>
          </div>

          {/* Right Hero: Full Interactive Match-3 Candy Crush App */}
          <div className="flex-1 w-full flex justify-center">
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

      <Testimonials />

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
