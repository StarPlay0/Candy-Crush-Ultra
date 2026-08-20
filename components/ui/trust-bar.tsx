'use client';

export function TrustBar() {
  return (
    <div className="w-full bg-white/40 backdrop-blur-md overflow-hidden py-3 border-y border-white/50 relative z-20">
      <div className="flex w-max animate-marquee text-xs font-black uppercase tracking-widest text-pink-950">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-8 px-4">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-500 shadow-xs" />
              100% Free & Ad-Free
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-xs" />
              Real Color Bomb Lightning
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs" />
              Zero Server Lag (SQLite Local-First)
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 shadow-xs" />
              199 Handcrafted Levels
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 shadow-xs" />
              PWA & APK Convertible
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
