'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  title?: string;
  subtitle?: string;
  items: FaqItem[];
  className?: string;
}

export function FaqSection({
  title = 'Frequently Asked Questions',
  subtitle = 'Everything you need to know about Candy Crush Ultra, mechanics, offline mode, and PWA installation.',
  items,
  className = '',
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={`py-12 px-4 ${className}`} id="faq-section">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-3 border border-pink-200 dark:border-pink-800">
            <HelpCircle size={14} />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            {title}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-medium max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white/90 dark:bg-slate-900/90 rounded-2xl border-2 border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:border-pink-300 dark:hover:border-pink-700 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 dark:text-slate-100 hover:text-pink-600 dark:hover:text-pink-400 transition-colors focus:outline-hidden"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-500 shrink-0" />
                    {item.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-pink-500' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-100 dark:border-slate-800 font-medium">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
