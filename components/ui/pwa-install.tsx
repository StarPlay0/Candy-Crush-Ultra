'use client';

import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  // Standard Next.js production-only service worker registration
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production' &&
      window.location.hostname === 'candycrusherultra.pages.dev'
    ) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('[SW] ServiceWorker registration failed:', err);
      });
    }
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-84 bg-white/95 text-slate-800 p-5 rounded-3xl shadow-2xl flex flex-col gap-3 z-50 border-3 border-pink-300 backdrop-blur-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="font-black uppercase tracking-tight text-base text-pink-950">Install Candy Ultra</h4>
          <p className="text-xs text-slate-600 font-bold mt-0.5">Play 100% offline anytime. Add to homescreen.</p>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-slate-400 hover:text-slate-700 font-black text-xl w-6 h-6 flex items-center justify-center rounded-full"
        >
          ×
        </button>
      </div>

      <button 
        onClick={handleInstall}
        className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:brightness-105 border-b-4 border-rose-800 text-white font-black uppercase tracking-wider py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg active:border-b-0 active:translate-y-1 transition-all text-xs"
      >
        <Download size={18} strokeWidth={2.5} /> Install Web App
      </button>
    </div>
  );
}
