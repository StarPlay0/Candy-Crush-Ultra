'use client';

import { useState } from 'react';
import { Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' }
];

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-sm font-medium"
      >
        <Globe size={16} />
        {LANGUAGES.find(l => l.code === currentLang)?.label}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white border border-slate-100 shadow-xl rounded-2xl overflow-hidden min-w-[150px] z-50">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => {
                setCurrentLang(lang.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 transition-colors ${currentLang === lang.code ? 'bg-slate-50 text-red-500 font-bold' : 'text-slate-700'}`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
