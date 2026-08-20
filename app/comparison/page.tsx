import Link from 'next/link';
import { PremiumHeader } from '@/components/ui/premium-header';

export const metadata = {
  title: 'Why Choose Us | Candy Crush Ultra vs The Competition',
  description: 'See why players are switching to our premium, completely free, local-first offline Match-3 engine over bloated, ad-filled alternatives.',
};

export default function ComparisonPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20">
      <PremiumHeader />
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            The Industry&apos;s Most Advanced <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
              Match-3 Engine
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            We ripped out the ads, removed the paywalls, and built a lightning-fast, zero-latency puzzle experience that runs entirely on your device.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm mb-16">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-6 font-bold text-slate-900">Feature</th>
                <th className="p-6 font-bold text-red-500 text-lg">Candy Crush Ultra</th>
                <th className="p-6 font-bold text-slate-500">Traditional Games</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-6 font-medium">Cost to Play</td>
                <td className="p-6 text-green-600 font-bold">100% Free Forever</td>
                <td className="p-6 text-slate-600">Pay-to-win mechanics</td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-6 font-medium">Offline Support</td>
                <td className="p-6 text-slate-900 font-bold">Yes, local-first DB (OPFS)</td>
                <td className="p-6 text-slate-600">Requires connection</td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-6 font-medium">Ads & Interruptions</td>
                <td className="p-6 text-slate-900 font-bold">Zero. Never.</td>
                <td className="p-6 text-slate-600">Unskippable 30s ads</td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-6 font-medium">Performance</td>
                <td className="p-6 text-slate-900 font-bold">&lt;100ms TTFB, 60fps canvas</td>
                <td className="p-6 text-slate-600">Bloated engines, slow loads</td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-6 font-medium">Privacy</td>
                <td className="p-6 text-slate-900 font-bold">No tracking. Data stays local.</td>
                <td className="p-6 text-slate-600">Sells data to 3rd parties</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-900 text-white rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-gradient-to-br from-red-500/30 to-purple-500/30 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-gradient-to-tr from-blue-500/20 to-green-500/20 blur-3xl pointer-events-none"></div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Ready to experience the difference?</h2>
          <Link href="/" className="inline-flex relative z-10 items-center justify-center bg-white text-slate-900 hover:bg-slate-100 font-bold py-4 px-10 rounded-full text-lg transition-transform active:scale-95">
            Launch Game
          </Link>
        </div>
      </div>
    </div>
  );
}
