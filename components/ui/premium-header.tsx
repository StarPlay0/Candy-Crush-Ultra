'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Gamepad2, 
  Trophy, 
  ShieldCheck, 
  Globe, 
  Menu, 
  X, 
  ChevronDown, 
  Download, 
  Flame, 
  Star,
  MapPin
} from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'zh', label: '中文', flag: '🇨🇳' }
];

export function PremiumHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');

  const selectedLangObj = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur-xl border-b border-pink-200/70 shadow-[0_4px_24px_rgba(236,72,153,0.08)] transition-all">
      {/* Main Luxury Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-15 sm:h-16 md:h-18 flex items-center justify-between gap-2 sm:gap-4 transition-all">
        
        {/* Left: Brand Identity Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group select-none min-w-0">
          <div className="relative shrink-0">
            {/* Candy Swirl 3D Emblem with Gloss Effect */}
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 p-0.5 shadow-md sm:shadow-lg shadow-pink-500/25 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center border-1.5 sm:border-2 border-white ring-2 ring-pink-200/50">
              <div className="w-full h-full bg-gradient-to-br from-pink-400 via-rose-500 to-purple-600 rounded-[10px] sm:rounded-[14px] flex items-center justify-center relative overflow-hidden">
                {/* Top specular candy highlight */}
                <div className="absolute -top-1 left-0 right-0 h-3 bg-white/35 rounded-full blur-[1px] transform -rotate-12" />
                <span className="text-xl sm:text-2xl drop-shadow-md select-none">🍬</span>
                <Sparkles size={11} className="absolute top-0.5 right-0.5 text-yellow-300 animate-pulse" />
              </div>
            </div>
            {/* Sparkle VIP badge */}
            <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 font-black text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0.2 rounded-full border border-white shadow-xs tracking-wider">
              PRO
            </span>
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="font-black text-[15px] sm:text-lg md:text-xl tracking-tight text-slate-900 leading-none group-hover:text-pink-600 transition-colors truncate">
                CANDY CRUSH
              </span>
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-[8px] sm:text-[10px] tracking-widest uppercase px-1.5 sm:px-2 py-0.5 rounded-md shadow-xs ring-1 ring-white/50 shrink-0">
                ULTRA
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[9px] sm:text-[10px] font-extrabold text-pink-700/85 sm:text-slate-500 uppercase tracking-wider sm:tracking-widest truncate max-w-[130px] xs:max-w-none">
                Pure-Skill Match-3 Saga
              </span>
              <span className="hidden xs:inline-block w-1 h-1 rounded-full bg-pink-400/60" />
              <span className="hidden xs:inline-block text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded-full">
                100% Free
              </span>
            </div>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <Link
            href="/"
            className="px-3.5 py-2 rounded-xl text-xs font-black text-slate-700 hover:text-pink-600 hover:bg-pink-50/80 transition-all flex items-center gap-1.5"
          >
            <Gamepad2 size={15} className="text-pink-500" />
            <span>Saga Map</span>
          </Link>

          <Link
            href="/comparison"
            className="px-3.5 py-2 rounded-xl text-xs font-black text-slate-700 hover:text-purple-600 hover:bg-purple-50/80 transition-all flex items-center gap-1.5"
          >
            <Trophy size={15} className="text-purple-500" />
            <span>Why Choose Us</span>
          </Link>

          <Link
            href="/features/free-match-3-game"
            className="px-3.5 py-2 rounded-xl text-xs font-black text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/80 transition-all flex items-center gap-1.5"
          >
            <Flame size={15} className="text-amber-500" />
            <span>Features</span>
          </Link>

          <Link
            href="/locations/us"
            className="px-3.5 py-2 rounded-xl text-xs font-black text-slate-700 hover:text-teal-600 hover:bg-teal-50/80 transition-all flex items-center gap-1.5"
          >
            <MapPin size={15} className="text-teal-500" />
            <span>Locations</span>
          </Link>
        </nav>

        {/* Right: Badges, Language Switcher, Quick Play & Mobile Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Trust Pillar Pill (Desktop) */}
          <div className="hidden sm:flex items-center gap-1.5 bg-pink-50/90 border border-pink-200/80 px-3 py-1.5 rounded-full text-[11px] font-black text-pink-900 shadow-xs">
            <ShieldCheck size={14} className="text-pink-600" />
            <span>100% Offline</span>
            <span className="w-1 h-1 rounded-full bg-pink-300" />
            <Star size={12} className="text-amber-500 fill-amber-500" />
            <span>199 Levels</span>
          </div>

          {/* Quick Play Mobile Pill (Compact on Mobile) */}
          <Link
            href="#game-board"
            className="flex sm:hidden items-center gap-1 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:brightness-110 active:scale-95 text-white font-black text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded-full shadow-xs shadow-pink-500/25 border border-pink-300/40"
          >
            <Sparkles size={11} className="text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Play</span>
          </Link>

          {/* Premium Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 sm:gap-1.5 bg-white/90 hover:bg-white border border-pink-200/90 hover:border-pink-300 text-slate-700 px-2 sm:px-3 py-1.5 rounded-full text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer"
              title="Change Language"
            >
              <Globe size={13} className="text-pink-500" />
              <span className="hidden md:inline">{selectedLangObj.flag} {selectedLangObj.label}</span>
              <span className="md:hidden text-xs">{selectedLangObj.flag}</span>
              <ChevronDown size={11} className={`text-slate-400 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {langDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-44 bg-white/95 backdrop-blur-xl border border-pink-200/80 rounded-2xl shadow-xl p-1.5 z-50 overflow-hidden"
                >
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1.5 border-b border-slate-100">
                    Select Language
                  </div>
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setCurrentLang(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        currentLang === lang.code
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black shadow-xs'
                          : 'text-slate-700 hover:bg-pink-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </span>
                      {currentLang === lang.code && <Sparkles size={12} />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Primary Action Button (Desktop): "Play Saga" */}
          <Link
            href="#game-board"
            className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:brightness-110 border-b-3 border-purple-800 text-white font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-full shadow-md shadow-pink-500/20 active:border-b-0 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <Sparkles size={14} className="text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Play Now</span>
          </Link>

          {/* Luxury Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer border ${
              mobileMenuOpen
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-pink-400 shadow-md shadow-pink-500/30 rotate-90'
                : 'bg-gradient-to-br from-pink-50/90 via-purple-50/80 to-white text-pink-700 border-pink-200/80 shadow-xs hover:border-pink-300 hover:shadow-sm active:scale-95'
            }`}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="lg:hidden border-t border-pink-200/70 bg-white/95 backdrop-blur-2xl px-4 py-3.5 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col gap-1.5">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200/60 text-pink-950 font-black text-xs sm:text-sm active:scale-[0.99] transition-transform"
              >
                <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-600 shrink-0">
                  <Gamepad2 size={17} />
                </div>
                <div className="flex flex-col">
                  <span>Play Saga Map (199 Levels)</span>
                  <span className="text-[10px] font-semibold text-pink-600/80">Full handcrafted levels • Zero Ads</span>
                </div>
              </Link>

              <Link
                href="/comparison"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-purple-50/80 border border-transparent hover:border-purple-200/60 text-slate-800 font-bold text-xs sm:text-sm transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 shrink-0">
                  <Trophy size={17} />
                </div>
                <div className="flex flex-col">
                  <span>Why Choose Us vs Rivals</span>
                  <span className="text-[10px] font-medium text-slate-400">Pure-skill vs pay-to-win comparison</span>
                </div>
              </Link>

              <Link
                href="/features/free-match-3-game"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-indigo-50/80 border border-transparent hover:border-indigo-200/60 text-slate-800 font-bold text-xs sm:text-sm transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 shrink-0">
                  <Flame size={17} />
                </div>
                <div className="flex flex-col">
                  <span>Game Features & Combos</span>
                  <span className="text-[10px] font-medium text-slate-400">Color bombs, striped combos & boosters</span>
                </div>
              </Link>

              <Link
                href="/locations/us"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-teal-50/80 border border-transparent hover:border-teal-200/60 text-slate-800 font-bold text-xs sm:text-sm transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-600 shrink-0">
                  <MapPin size={17} />
                </div>
                <div className="flex flex-col">
                  <span>Global Country Discoveries</span>
                  <span className="text-[10px] font-medium text-slate-400">Available across 34+ worldwide regions</span>
                </div>
              </Link>

              <div className="pt-2 mt-1 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[11px] font-black text-slate-600">
                  <ShieldCheck size={15} className="text-emerald-500 shrink-0" />
                  <span>100% Free • Offline PWA</span>
                </div>
                <Link
                  href="#game-board"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-xs active:scale-95 transition-transform"
                >
                  Start Game
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
