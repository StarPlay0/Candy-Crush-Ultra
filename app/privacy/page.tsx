import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ShieldCheck, Lock, Smartphone, Database, HeartHandshake, ArrowLeft, Mail } from 'lucide-react';
import { PremiumHeader } from '@/components/ui/premium-header';

export const metadata: Metadata = {
  title: 'Privacy Policy - Candy Crush Ultra',
  description: 'Official Google Play Console compliant privacy policy for Candy Crush Ultra. Zero personal data collection, 100% offline gameplay.',
  alternates: {
    canonical: 'https://candycrusherultra.pages.dev/privacy.html',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FFFFFF] text-slate-900">
      <PremiumHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 pb-28">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 border border-pink-200 px-4 py-2 rounded-full transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Game</span>
          </Link>
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
            <ShieldCheck size={14} className="text-emerald-600" />
            Google Play Console Compliant
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm font-semibold text-slate-500 mb-8">
          Effective Date: September 17, 2026 • Application Identifier: <code className="bg-slate-100 px-2 py-0.5 rounded text-pink-600 font-mono text-xs">com.candycrushultra.app</code>
        </p>

        <div className="space-y-6">
          <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                🍬
              </div>
              <h2 className="text-xl font-black text-slate-900">1. Overview &amp; Application Identity</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Welcome to <strong>Candy Crush Ultra</strong>. This Privacy Policy outlines our strict commitment to safeguarding player privacy. 
              Candy Crush Ultra is built as a pure client-side, local-first web application and Progressive Web App (PWA). Our core philosophy is simple: you own your device, and we never collect, monetize, or harvest your personal information.
            </p>
          </section>

          <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Lock size={20} />
              </div>
              <h2 className="text-xl font-black text-slate-900">2. Zero Personal Data Collection</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-4">
              We do not collect, store, sell, or transmit any Personal Identifiable Information (PII). Specifically:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-slate-700">
              <li><strong>No Accounts or Logins:</strong> No email, password, phone number, or social logins required.</li>
              <li><strong>Zero Ad Networks:</strong> We do not integrate Google AdMob, Unity Ads, IronSource, or any advertising tracking SDKs.</li>
              <li><strong>No Hardware Identifiers:</strong> No collection of Android ID, advertising identifiers (AAID), IMEI, or MAC addresses.</li>
              <li><strong>No Geolocation Data:</strong> We never request access to GPS or location hardware.</li>
            </ul>
          </section>

          <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <Database size={20} />
              </div>
              <h2 className="text-xl font-black text-slate-900">3. Local Storage &amp; Data Retention</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-4">
              Candy Crush Ultra utilizes client-side storage technologies (such as <code>localStorage</code>, <code>sessionStorage</code>, and <code>IndexedDB</code>) solely to preserve your gameplay state on your own hardware:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-slate-700">
              <li>Level unlock progress (Levels 1 to 199).</li>
              <li>High scores, three-star achievements, and combo statistics.</li>
              <li>Audio preferences (music and sound effects mute toggles).</li>
              <li>Service Worker asset cache for offline availability.</li>
            </ul>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed mt-4">
              All stored information remains on your local device and is never sent to any remote server. You can reset or delete this data at any time by clearing your browser site data or uninstalling the app.
            </p>
          </section>

          <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Smartphone size={20} />
              </div>
              <h2 className="text-xl font-black text-slate-900">4. Security &amp; Data Protection Protocols</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              We enforce industry-standard security protocols:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-slate-700 mt-2">
              <li><strong>HTTPS Encryption:</strong> All assets and pages are delivered strictly via TLS 1.3 encrypted HTTPS.</li>
              <li><strong>Content Security Policy (CSP):</strong> Restricts unauthorized script execution.</li>
              <li><strong>Zero External Remote Dependencies:</strong> Offline service workers protect against unauthorized runtime modification.</li>
            </ul>
          </section>

          <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <HeartHandshake size={20} />
              </div>
              <h2 className="text-xl font-black text-slate-900">5. Children&apos;s Privacy (COPPA &amp; GDPR)</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Candy Crush Ultra is family friendly and safe for all age demographics. Because we do not collect personal data from any user, we fully comply with COPPA, GDPR, and Google Play Families guidelines.
            </p>
          </section>

          <section className="bg-rose-50 border border-rose-200 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-200 text-rose-700 flex items-center justify-center">
                <Mail size={20} />
              </div>
              <h2 className="text-xl font-black text-rose-950">6. Developer Contact Information</h2>
            </div>
            <p className="text-sm sm:text-base text-rose-900 leading-relaxed mb-3">
              For privacy questions, regulatory inquiries, or feedback regarding Candy Crush Ultra:
            </p>
            <div className="space-y-1 text-sm font-semibold text-rose-900">
              <p><strong>Application:</strong> Candy Crush Ultra (com.candycrushultra.app)</p>
              <p><strong>Developer Email:</strong> mohsinlali47@gmail.com</p>
              <p><strong>Official Policy URL:</strong> <a href="/privacy.html" className="underline text-pink-700 hover:text-pink-800">https://candycrusherultra.pages.dev/privacy.html</a></p>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-8 text-center text-xs font-semibold text-slate-500">
        <p>© 2026 Candy Crush Ultra. All rights reserved. • <a href="/privacy.html" className="text-pink-600 hover:underline">Privacy Policy (/privacy.html)</a> • <Link href="/" className="text-pink-600 hover:underline">Play Saga</Link></p>
      </footer>
    </div>
  );
}
