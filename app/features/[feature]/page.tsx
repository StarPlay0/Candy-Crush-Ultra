import { SEO_FEATURES } from '@/lib/constants';
import Link from 'next/link';
import { PremiumHeader } from '@/components/ui/premium-header';

export function generateStaticParams() {
  return SEO_FEATURES.map((feature) => ({
    feature,
  }));
}

export function generateMetadata({ params }: { params: Promise<{ feature: string }> }) {
  // @ts-ignore
  const feature = params.feature;
  const formattedFeature = feature.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
  return {
    title: `${formattedFeature} | Candy Crush Ultra`,
    description: `Discover everything about ${formattedFeature} with our completely offline, local-first premium Match-3 engine.`,
  };
}

export default async function FeaturePage({ params }: { params: Promise<{ feature: string }> }) {
  const { feature } = await params;
  const formattedFeature = feature.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <PremiumHeader />
      <div className="max-w-3xl mx-auto bg-white p-10 md:p-16 rounded-3xl shadow-sm border border-slate-100 mt-10 px-6">
        <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
          The Ultimate Guide to <span className="text-blue-500">{formattedFeature}</span>
        </h1>
        
        <div className="prose prose-lg prose-slate max-w-none">
          <p className="lead text-xl text-slate-600 mb-8">
            When looking for <strong>{formattedFeature.toLowerCase()}</strong>, users consistently demand performance, privacy, and uninterrupted gameplay. Our engine delivers exactly that.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">Why is {formattedFeature} Important?</h2>
          <p className="mb-6">
            In modern mobile gaming, heavy applications drain batteries and rely on constant internet connections. By building a pure HTML5 Canvas and React application, we eliminate network overhead. This ensures that your experience with {formattedFeature.toLowerCase()} is flawless, whether you&apos;re commuting or relaxing at home.
          </p>

          <div className="bg-slate-100 p-6 rounded-xl my-8 border-l-4 border-blue-500">
            <h3 className="font-bold text-lg mb-2">Key Takeaways</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-700">
              <li>100% Offline capability via OPFS</li>
              <li>Zero latency interactions (no server roundtrips)</li>
              <li>Free from unskippable video ads</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Experience it Yourself</h2>
          <p className="mb-8">
            Don&apos;t just take our word for it. Our 199-level progression tree is ready for you to explore right now directly in your browser.
          </p>

          <Link href="/" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-transform active:scale-95 shadow-lg shadow-blue-500/30 no-underline">
            Play Candy Crush Ultra Now
          </Link>
        </div>
      </div>
    </div>
  );
}
