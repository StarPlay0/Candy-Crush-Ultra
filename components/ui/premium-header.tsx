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
      {/* Luxury Micro Announcement Banner (Subtle & High-End) */}
      <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white text-[11px] font-black uppercase tracking-wider py-1.5 px-4 text-center flex items-center justify-center gap-2 relative overflow-hidden shadow-inner">
        <div className="flex items-center gap-1.5">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400"></span>
          </span>
          <span className="text-yellow-300">SAGA 2026 EDITION:</span>
          <span>199 Handcrafted Match-3 Levels • 100% Free • Zero Lag (Local-First Engine)</span>
        </div>
      </div>

      {/* Main Luxury Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity Logo */}
        <Link href="/" className="flex items-center gap-3 group select-none">
          <div className="relative">
            {/* Candy Swirl 3D Emblem */}
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 p-0.5 shadow-lg shadow-pink-500/25 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center border-2 border-white">
              <div className="w-full h-full bg-gradient-to-br from-pink-400 via-rose-500 to-purple-600 rounded-[14px] flex items-center justify-center relative overflow-hidden">
                <span className="text-2xl drop-shadow-md">🍬</span>
                <Sparkles size={12} className="absolute top-1 right-1 text-yellow-300 animate-pulse" />
              </div>
            </div>
            {/* Sparkle badge */}
            <span className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 font-black text-[9px] px-1.5 py-0.2 rounded-full border border-white shadow-xs">
              PRO
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xl tracking-tight text-slate-900 leading-none group-hover:text-pink-600 transition-colors">
                CANDY CRUSH
              </span>
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-md shadow-xs">
                ULTRA
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
              Pure-Skill Match-3 Saga
            </span>
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

        {/* Right: Badges, Language Switcher & Play Action */}
        <div className="flex items-center gap-2.5">
          {/* Trust Pillar Pill (Desktop) */}
          <div className="hidden sm:flex items-center gap-1.5 bg-pink-50/90 border border-pink-200/80 px-3 py-1.5 rounded-full text-[11px] font-black text-pink-900 shadow-xs">
            <ShieldCheck size={14} className="text-pink-600" />
            <span>100% Offline</span>
            <span className="w-1 h-1 rounded-full bg-pink-300" />
            <Star size={12} className="text-amber-500 fill-amber-500" />
            <span>199 Levels</span>
          </div>

          {/* Premium Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-pink-300 text-slate-700 px-3 py-1.5 rounded-full text-xs font-bold shadow-xs transition-all cursor-pointer"
              title="Change Language"
            >
              <Globe size={14} className="text-slate-500" />
              <span className="hidden md:inline">{selectedLangObj.flag} {selectedLangObj.label}</span>
              <span className="md:hidden">{selectedLangObj.flag}</span>
              <ChevronDown size={12} className={`text-slate-400 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
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
                          ? 'bg-pink-500 text-white font-black'
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

          {/* Primary Action Button: "Play Saga" */}
          <Link
            href="#game-board"
            className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:brightness-110 border-b-3 border-purple-800 text-white font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-full shadow-md shadow-pink-500/20 active:border-b-0 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <Sparkles size={14} className="text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Play Now</span>
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-pink-100 bg-white/95 backdrop-blur-2xl px-5 py-4 overflow-hidden"
          >
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-pink-50/80 text-pink-950 font-black text-sm"
              >
                <Gamepad2 size={18} className="text-pink-600" />
                <span>Play Saga Map (199 Levels)</span>
              </Link>

              <Link
                href="/comparison"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-purple-50 text-slate-800 font-bold text-sm"
              >
                <Trophy size={18} className="text-purple-600" />
                <span>Why Choose Us vs Rivals</span>
              </Link>

              <Link
                href="/features/free-match-3-game"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-indigo-50 text-slate-800 font-bold text-sm"
              >
                <Flame size={18} className="text-indigo-600" />
                <span>Game Features & Combos</span>
              </Link>

              <Link
                href="/locations/us"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-teal-50 text-slate-800 font-bold text-sm"
              >
                <MapPin size={18} className="text-teal-600" />
                <span>Global Country Discoveries</span>
              </Link>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  <span>100% Free • Offline PWA</span>
                </div>
                <Link
                  href="#game-board"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-pink-600 text-white font-black text-xs px-4 py-2 rounded-full"
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
