'use client';

import { Star } from 'lucide-react';

const testimonials = [
  { name: "Sarah M.", text: "The Color Bomb combos feel so crisp! Swapping sprinkle balls with striped candies clears the whole board with zero delay." },
  { name: "David K.", text: "Finally an authentic Candy Crush saga map with real 3-star progression that works 100% offline without paywalls." },
  { name: "Elena R.", text: "Converted this into an APK for my tablet and it runs buttery smooth at 60FPS. Beautiful graphics!" },
  { name: "Marcus T.", text: "The swipe controls and lightning zap effects are Apple-tier polish. Best Match-3 game on the web." },
  { name: "Chloe L.", text: "I love the daily sticky notes challenges and the candy shop. It feels rewarding to earn gold bars by mastering levels." },
  { name: "Liam B.", text: "The pastel theme is so easy on the eyes and the dark mode is gorgeous. Huge upgrade over the original!" },
];

export function Testimonials() {
  return (
    <section className="py-16 bg-white/30 backdrop-blur-md overflow-hidden border-y border-white/40">
      <div className="max-w-6xl mx-auto px-6 mb-10 text-center">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3 tracking-tight">
          Loved by 2M+ Match-3 Players Worldwide
        </h2>
        <p className="text-slate-600 text-sm sm:text-base font-bold">
          Real reviews from our offline-first Candy Kingdom community.
        </p>
      </div>

      <div className="flex flex-col gap-6 relative">
        {/* Row 1: Right to Left */}
        <div className="flex w-max animate-marquee gap-6 px-6">
          {[...testimonials, ...testimonials].map((t, i) => (
            <div key={i} className="bg-white/80 p-6 rounded-3xl shadow-md border-2 border-pink-200 backdrop-blur-sm w-80 flex-shrink-0">
              <div className="flex gap-1 mb-3 text-amber-400">
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
              </div>
              <p className="text-slate-700 mb-4 text-sm leading-relaxed font-bold">&ldquo;{t.text}&rdquo;</p>
              <p className="font-black text-pink-700 text-xs uppercase tracking-wider">— {t.name}</p>
            </div>
          ))}
        </div>

        {/* Row 2: Left to Right (Reverse) */}
        <div className="flex w-max animate-marquee-reverse gap-6 px-6 ml-[-10%]">
          {[...testimonials.slice().reverse(), ...testimonials].map((t, i) => (
            <div key={i} className="bg-white/80 p-6 rounded-3xl shadow-md border-2 border-purple-200 backdrop-blur-sm w-80 flex-shrink-0">
              <div className="flex gap-1 mb-3 text-amber-400">
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
              </div>
              <p className="text-slate-700 mb-4 text-sm leading-relaxed font-bold">&ldquo;{t.text}&rdquo;</p>
              <p className="font-black text-purple-700 text-xs uppercase tracking-wider">— {t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
