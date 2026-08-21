import Link from 'next/link';
import { ArrowLeft, Sparkles, Home, MapPin, Layers } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-pink-200 dark:border-pink-900/40 shadow-2xl">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl flex items-center justify-center shadow-lg text-4xl animate-bounce">
          🍬
        </div>

        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          404 - Sweet Lost!
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm font-medium mb-6">
          The sugar trail ends here, but dozens of exciting puzzles and features await your moves!
        </p>

        <div className="flex flex-col gap-3 mb-6">
          <Link
            href="/"
            className="w-full py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-black text-sm uppercase rounded-2xl shadow-lg hover:shadow-pink-500/25 transition-all flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Play Candy Crush Ultra
          </Link>

          <Link
            href="/comparison"
            className="w-full py-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-xs rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={16} className="text-amber-500" />
            Why Choose Us (Comparison)
          </Link>

          <Link
            href="/features/free-match-3-game"
            className="w-full py-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-xs rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <Layers size={16} className="text-pink-500" />
            Free Match-3 Puzzle Features
          </Link>

          <Link
            href="/locations/us"
            className="w-full py-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-xs rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <MapPin size={16} className="text-blue-500" />
            Global Play Regions & Servers
          </Link>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-pink-500 transition-colors"
        >
          <ArrowLeft size={14} />
          Return to Home Screen
        </Link>
      </div>
    </div>
  );
}
