import { SEO_LOCATIONS } from '@/lib/constants';
import Link from 'next/link';
import { PremiumHeader } from '@/components/ui/premium-header';

export function generateStaticParams() {
  return SEO_LOCATIONS.map((country) => ({
    country,
  }));
}

export function generateMetadata({ params }: { params: Promise<{ country: string }> }) {
  // @ts-ignore - Next.js 15 params are treated as promises in some contexts, but let's safely handle it
  const country = params.country;
  const formattedCountry = country ? country.replace('-', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) : 'Global';
  return {
    title: `Play Free Match-3 Games in ${formattedCountry} | Candy Crush Ultra`,
    description: `Discover the ultimate offline puzzle experience in ${formattedCountry}. Zero latency, no signup, purely local-first Match-3 gaming.`,
  };
}

export default async function LocationPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const formattedCountry = country.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20">
      <PremiumHeader />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 mb-12 shadow-sm">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            The #1 Offline Match-3 Game in <span className="text-red-500">{formattedCountry}</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Experience the next generation of puzzle gaming without internet requirements. Purely local-first, lightning fast, and 100% free.
          </p>
          <Link href="/" className="inline-flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-transform active:scale-95 shadow-lg shadow-red-500/30">
            Play Now for Free
          </Link>
        </div>

        <section className="space-y-8">
          <article>
            <h2 className="text-2xl font-bold mb-3">Why {formattedCountry} Players Love Candy Crush Ultra</h2>
            <p className="text-slate-700 leading-relaxed">
              We built this game specifically with performance in mind. Whether you are commuting, on a flight, or just relaxing at home in {formattedCountry}, our zero-latency local-first architecture means the game loads instantly and never requires a continuous connection.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-bold mb-3">199 Levels of Puzzle Mastery</h2>
            <p className="text-slate-700 leading-relaxed">
              Our 199-level progression tree is carefully balanced to provide the perfect mix of challenge and reward. No frustrating paywalls, just pure skill-based Match-3 mechanics with satisfying combos and boosters.
            </p>
          </article>
        </section>
      </div>
    </div>
  );
}
