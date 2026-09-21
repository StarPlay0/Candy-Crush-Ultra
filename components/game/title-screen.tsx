'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Cloud, 
  Sparkles, 
  RefreshCw, 
  Trophy, 
  Heart, 
  Award, 
  CheckCircle2, 
  Map as MapIcon, 
  ClipboardList, 
  Settings, 
  Moon, 
  Sun,
  Coins
} from 'lucide-react';
import { sound } from '@/lib/audio';
import { haptics } from '@/lib/haptics';

interface TitleScreenProps {
  onPlay: () => void;
  onOpenSettings: () => void;
  onOpenTasks?: () => void;
  onOpenMap?: () => void;
  unlockedLevel: number;
  totalStars: number;
  coins: number;
  isDark?: boolean;
  onToggleDarkMode?: () => void;
  onRestoreProgress?: () => void;
}

export function TitleScreen({
  onPlay,
  onOpenSettings,
  onOpenTasks,
  onOpenMap,
  unlockedLevel,
  totalStars,
  coins,
  isDark = false,
  onToggleDarkMode,
  onRestoreProgress,
}: TitleScreenProps) {
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');

  const handlePlayClick = () => {
    sound.playTada();
    haptics.levelWin();
    onPlay();
  };

  const handleRetrieveProgress = () => {
    sound.playCandyPop(1.2);
    haptics.touch();
    setShowSyncModal(true);
  };

  const handleTriggerSync = () => {
    sound.playCandyPop(1.5);
    haptics.special();
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('synced');
      sound.playTada();
      haptics.levelWin();
      if (onRestoreProgress) onRestoreProgress();
      setTimeout(() => {
        setShowSyncModal(false);
        setSyncStatus('idle');
      }, 1200);
    }, 1000);
  };

  return (
    <div 
      className={`relative w-full h-full min-h-[640px] flex flex-col justify-between overflow-hidden select-none transition-colors duration-500 ${
        isDark 
          ? 'bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#311042] text-white' 
          : 'bg-gradient-to-b from-[#EDE9FE] via-[#E0F2FE] to-[#FDF2F8] text-slate-800'
      }`}
    >
      {/* Soft Pastel Floating Background Clouds & Glow Spheres */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Pastel Radial Orbs */}
        <div className="absolute -top-12 -left-12 w-80 h-80 bg-purple-300/30 dark:bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-16 w-80 h-80 bg-sky-300/30 dark:bg-sky-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 left-1/4 w-96 h-96 bg-pink-300/30 dark:bg-pink-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-10 w-48 h-48 bg-teal-200/25 dark:bg-teal-500/15 rounded-full blur-2xl" />

        {/* Floating Pastel Clouds */}
        <motion.div
          animate={{ x: [-15, 15, -15], y: [-5, 5, -5] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-6 left-6 text-purple-200/60 dark:text-purple-900/40 drop-shadow-sm"
        >
          <svg width="100" height="50" viewBox="0 0 100 50" fill="currentColor">
            <path d="M 20 40 Q 10 40 10 30 Q 10 20 22 20 Q 25 10 40 10 Q 55 10 60 20 Q 75 18 80 28 Q 88 30 88 40 Z" />
          </svg>
        </motion.div>

        <motion.div
          animate={{ x: [15, -15, 15], y: [5, -5, 5] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-24 -right-4 text-sky-200/60 dark:text-sky-900/40 drop-shadow-sm"
        >
          <svg width="120" height="60" viewBox="0 0 100 50" fill="currentColor">
            <path d="M 20 40 Q 10 40 10 30 Q 10 20 22 20 Q 25 10 40 10 Q 55 10 60 20 Q 75 18 80 28 Q 88 30 88 40 Z" />
          </svg>
        </motion.div>

        {/* Floating Pastel Candies */}
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-44 left-8 text-2xl filter drop-shadow-md opacity-75"
        >
          🍬
        </motion.div>

        <motion.div
          animate={{ y: [0, 12, 0], rotate: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-60 right-8 text-2xl filter drop-shadow-md opacity-75"
        >
          🍭
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-40 left-12 text-xl filter drop-shadow-md opacity-60"
        >
          ✨
        </motion.div>
      </div>

      {/* Top Header Controls: Theme Switcher & Settings */}
      <div className="relative z-20 w-full px-5 pt-4 flex items-center justify-between">
        {/* Level & Stars Badge */}
        <div className="flex items-center gap-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-purple-200/60 dark:border-purple-800/60 shadow-sm">
          <span className="font-black text-xs text-purple-700 dark:text-purple-300 flex items-center gap-1">
            <Trophy size={13} className="text-amber-500" />
            Lvl {unlockedLevel}
          </span>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <span className="font-black text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
            ⭐ {totalStars}
          </span>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <span className="font-black text-xs text-teal-600 dark:text-teal-400 flex items-center gap-1">
            🪙 {coins}
          </span>
        </div>

        {/* Right Actions: Dark Mode & Settings */}
        <div className="flex items-center gap-2">
          {onToggleDarkMode && (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={onToggleDarkMode}
              className="w-9 h-9 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-purple-200 dark:border-purple-700 flex items-center justify-center text-purple-700 dark:text-amber-300 shadow-sm transition-all cursor-pointer"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </motion.button>
          )}

          <motion.button
            whileHover={{ rotate: 90, scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onOpenSettings}
            className="w-9 h-9 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-pink-200 dark:border-pink-700 flex items-center justify-center text-pink-700 dark:text-pink-300 shadow-sm transition-all cursor-pointer"
            title="Audio & Game Settings"
          >
            <Settings size={17} />
          </motion.button>
        </div>
      </div>

      {/* Center: Vibrant Animated Candy Kingdom Scenery & Title Plaque */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-between px-3 -mt-1 min-h-[310px] sm:min-h-[350px]">
        {/* Soft Pastel Floating Plaque */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative text-center z-20"
        >
          {/* Pastel Sparkle Crown */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400 text-white font-black text-[10px] sm:text-[11px] uppercase tracking-widest shadow-md mb-2 border border-white/60">
            <Sparkles size={12} className="text-yellow-200 animate-spin" style={{ animationDuration: '6s' }} />
            Match-3 Sweet Puzzle
          </div>

          {/* Clean Modern Typography */}
          <h1 className="font-black text-3xl sm:text-4xl md:text-5xl tracking-tight leading-none mb-1">
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-teal-500 dark:from-purple-300 dark:via-pink-300 dark:to-teal-200 bg-clip-text text-transparent drop-shadow-sm">
              Candy Crush
            </span>
          </h1>
          <p className="font-black text-base sm:text-lg tracking-wider uppercase text-purple-700 dark:text-purple-300 opacity-90">
            Pastel Saga
          </p>
          <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 max-w-xs mx-auto mt-1">
            199 handcrafted sweet levels • Zero ads • 100% Pure Skill
          </p>
        </motion.div>

        {/* 🌄 IMMERSIVE CANDY KINGDOM SCENERY LANDSCAPE */}
        <div className="relative w-full max-w-sm h-48 sm:h-56 mt-2 flex items-end justify-center overflow-visible">
          {/* Glowing Rainbow Arch */}
          <svg className="absolute -top-6 inset-x-0 w-full h-36 pointer-events-none opacity-85 z-0" viewBox="0 0 320 120" fill="none">
            <defs>
              <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F472B6" stopOpacity="0.8" />
                <stop offset="25%" stopColor="#FBBF24" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#34D399" stopOpacity="0.8" />
                <stop offset="75%" stopColor="#38BDF8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.8" />
              </linearGradient>
              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <path
              d="M 20 120 C 60 20, 260 20, 300 120"
              stroke="url(#rainbowGrad)"
              strokeWidth="10"
              strokeLinecap="round"
              filter="url(#softGlow)"
              fill="none"
              opacity="0.75"
            />
            <path
              d="M 32 120 C 68 35, 252 35, 288 120"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeDasharray="4 6"
              fill="none"
              opacity="0.6"
            />
          </svg>

          {/* Floating Candy Air Balloon */}
          <motion.div
            animate={{ y: [-8, 8, -8], x: [-6, 6, -6], rotate: [-3, 3, -3] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-0 right-4 z-15 flex flex-col items-center pointer-events-none drop-shadow-lg"
          >
            {/* Balloon Body */}
            <div className="w-11 h-13 rounded-t-full rounded-b-3xl bg-gradient-to-tr from-rose-400 via-pink-400 to-amber-300 border-2 border-white shadow-md flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-y-0 w-3 bg-white/40 left-1/2 -translate-x-1/2" />
              <div className="absolute inset-x-0 top-1/2 h-1 bg-yellow-200/80" />
              <span className="text-xs">🍬</span>
            </div>
            {/* Balloon Basket Strings & Basket */}
            <div className="w-4 h-1.5 border-x border-amber-800/60 -mt-0.5" />
            <div className="w-3.5 h-3 bg-amber-700 rounded-sm border border-amber-900 flex items-center justify-center text-[7px] text-white font-bold">
              🧺
            </div>
          </motion.div>

          {/* Floating Marshmallow Cloud with Face */}
          <motion.div
            animate={{ x: [-10, 10, -10], y: [-3, 3, -3] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-pink-200 shadow-sm pointer-events-none"
          >
            <span className="text-sm">☁️</span>
            <span className="text-[9px] font-black text-pink-500 uppercase tracking-tight">Sugar Valley</span>
          </motion.div>

          {/* Scenery Vector Illustration: Castles, Hills, River, Candies */}
          <div className="relative w-full h-40 sm:h-44 z-10">
            <svg className="w-full h-full" viewBox="0 0 380 180" fill="none" preserveAspectRatio="none">
              <defs>
                {/* Back Mountain Gradient */}
                <linearGradient id="backHills" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#C084FC" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#818CF8" stopOpacity="0.95" />
                </linearGradient>
                {/* Mid Pastry Hills Gradient */}
                <linearGradient id="midHills" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F472B6" />
                  <stop offset="100%" stopColor="#FB7185" />
                </linearGradient>
                {/* Front Green Frosting Lawn */}
                <linearGradient id="frontHills" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#34D399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                {/* Lemonade Syrup River */}
                <linearGradient id="syrupRiver" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="#67E8F9" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#A7F3D0" stopOpacity="0.95" />
                </linearGradient>
                {/* Castle Texture */}
                <linearGradient id="castleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFF1F2" />
                  <stop offset="100%" stopColor="#FCE7F3" />
                </linearGradient>
                <linearGradient id="roofGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#EC4899" />
                  <stop offset="100%" stopColor="#BE185D" />
                </linearGradient>
              </defs>

              {/* Distant Wafer & Mousse Mountains */}
              <path d="M 0 130 Q 70 60 140 120 Q 210 50 280 115 Q 340 70 380 130 L 380 180 L 0 180 Z" fill="url(#backHills)" />

              {/* Distant Lollipop Forest on Hilltops */}
              <circle cx="65" cy="80" r="12" fill="#F43F5E" />
              <line x1="65" y1="92" x2="65" y2="120" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />
              <circle cx="65" cy="80" r="8" fill="#FB7185" />
              <circle cx="65" cy="80" r="4" fill="#FFFFFF" />

              <circle cx="310" cy="85" r="14" fill="#06B6D4" />
              <line x1="310" y1="99" x2="310" y2="125" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />
              <circle cx="310" cy="85" r="9" fill="#67E8F9" />
              <circle cx="310" cy="85" r="4" fill="#FFFFFF" />

              {/* CANDY KINGDOM CASTLE (Center-Right Hill) */}
              <g transform="translate(180, 52)">
                {/* Castle Main Wall */}
                <rect x="20" y="35" width="46" height="35" rx="3" fill="url(#castleGrad)" stroke="#F472B6" strokeWidth="1.5" />
                {/* Castle Gate */}
                <path d="M 36 70 L 36 52 Q 43 46 50 52 L 50 70 Z" fill="#9333EA" />
                {/* Castle Turret Left */}
                <rect x="14" y="24" width="14" height="46" rx="2" fill="url(#castleGrad)" stroke="#F472B6" strokeWidth="1.5" />
                <polygon points="12,24 21,4 30,24" fill="url(#roofGrad)" />
                <circle cx="21" cy="4" r="3" fill="#FDE047" />
                {/* Castle Turret Right */}
                <rect x="58" y="24" width="14" height="46" rx="2" fill="url(#castleGrad)" stroke="#F472B6" strokeWidth="1.5" />
                <polygon points="56,24 65,4 74,24" fill="url(#roofGrad)" />
                <circle cx="65" cy="4" r="3" fill="#FDE047" />
                {/* Castle Central Spire */}
                <rect x="34" y="16" width="18" height="25" rx="2" fill="url(#castleGrad)" stroke="#F472B6" strokeWidth="1.5" />
                <polygon points="31,16 43,-2 55,16" fill="url(#roofGrad)" />
                <circle cx="43" cy="-2" r="3.5" fill="#FDE047" />
                {/* Glowing Castle Windows */}
                <rect x="40" y="22" width="6" height="8" rx="3" fill="#FDE047" />
                <rect x="18" y="32" width="6" height="8" rx="3" fill="#FDE047" />
                <rect x="62" y="32" width="6" height="8" rx="3" fill="#FDE047" />
              </g>

              {/* Mid Layer Pastry Hills with Glaze */}
              <path d="M -10 145 Q 80 85 180 135 Q 260 95 390 140 L 390 180 L -10 180 Z" fill="url(#midHills)" />
              {/* White Glaze Drips on Mid Hills */}
              <path d="M 0 140 Q 30 130 60 142 Q 90 132 120 144 Q 150 135 180 146" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.6" fill="none" />

              {/* Sparkling Lemonade / Soda Winding River */}
              <path d="M 175 135 C 160 145, 140 155, 130 180 L 170 180 C 180 160, 200 150, 195 135 Z" fill="url(#syrupRiver)" />
              <path d="M 152 148 Q 148 162 142 178" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.8" fill="none" />

              {/* Front Frosted Sugar Hills */}
              <path d="M -10 160 Q 90 120 210 165 Q 300 130 390 160 L 390 180 L -10 180 Z" fill="url(#frontHills)" />

              {/* Giant Candy Cane Landmark on Left Hill */}
              <g transform="translate(45, 105)">
                {/* Stick */}
                <path d="M 12 55 L 12 20 Q 12 0 28 0 Q 44 0 44 16 L 44 24" stroke="#DC2626" strokeWidth="7" strokeLinecap="round" fill="none" />
                <path d="M 12 55 L 12 20 Q 12 0 28 0 Q 44 0 44 16 L 44 24" stroke="#FFFFFF" strokeWidth="7" strokeDasharray="6 7" strokeLinecap="round" fill="none" />
              </g>

              {/* Gumdrop & Jelly Bean Bushes in Foreground */}
              <g transform="translate(15, 142)">
                <ellipse cx="14" cy="18" rx="14" ry="12" fill="#EC4899" />
                <ellipse cx="14" cy="15" rx="10" ry="7" fill="#F472B6" />
                <circle cx="11" cy="12" r="2" fill="#FFFFFF" opacity="0.8" />
              </g>

              <g transform="translate(270, 138)">
                <ellipse cx="16" cy="18" rx="15" ry="12" fill="#8B5CF6" />
                <ellipse cx="16" cy="15" rx="11" ry="8" fill="#A78BFA" />
                <circle cx="13" cy="12" r="2.5" fill="#FFFFFF" opacity="0.8" />
              </g>

              <g transform="translate(325, 145)">
                <ellipse cx="12" cy="16" rx="13" ry="10" fill="#F59E0B" />
                <ellipse cx="12" cy="13" rx="9" ry="6" fill="#FBBF24" />
                <circle cx="9" cy="11" r="2" fill="#FFFFFF" opacity="0.8" />
              </g>

              {/* Swirl Lollipop on Right Foreground */}
              <g transform="translate(230, 98)">
                <line x1="20" y1="35" x2="20" y2="70" stroke="#FEF08A" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx="20" cy="22" r="16" fill="#EC4899" stroke="#FFFFFF" strokeWidth="1.5" />
                {/* Spiral Swirl */}
                <path d="M 20 22 m -11 0 a 11 11 0 1 0 22 0 a 11 11 0 1 0 -22 0 m 4 0 a 7 7 0 1 0 14 0 a 7 7 0 1 0 -14 0" stroke="#FDE047" strokeWidth="2.5" fill="none" />
                <circle cx="15" cy="16" r="3" fill="#FFFFFF" opacity="0.7" />
              </g>
            </svg>

            {/* Interactive Spinning Peppermint Windmill on Left */}
            <div className="absolute bottom-6 left-16 z-20 flex flex-col items-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-500 via-rose-400 to-white shadow-md border-2 border-white flex items-center justify-center relative cursor-pointer"
                title="Candy Windmill"
              >
                <div className="absolute inset-0 rounded-full border-4 border-dashed border-white/90 animate-spin" style={{ animationDuration: '4s' }} />
                <div className="w-3.5 h-3.5 rounded-full bg-yellow-300 border border-white shadow-xs z-10" />
              </motion.div>
              <div className="w-2 h-7 bg-amber-200 border-x border-amber-400 -mt-1 rounded-b-sm shadow-xs" />
            </div>

            {/* Bouncing Jelly Candy Friends on Hills */}
            <motion.div
              animate={{ y: [0, -10, 0], scaleY: [1, 0.9, 1], scaleX: [1, 1.1, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-6 left-28 z-25 w-8 h-8 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 shadow-md border-2 border-white flex items-center justify-center text-sm cursor-pointer select-none"
              title="Happy Candy"
            >
              ⭐
            </motion.div>

            {/* Bouncing Choco Bomb Friend */}
            <motion.div
              animate={{ y: [0, -12, 0], rotate: [-5, 5, -5] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute bottom-8 right-16 z-25 w-9 h-9 rounded-full bg-gradient-to-tr from-purple-800 via-pink-700 to-indigo-900 shadow-lg border-2 border-amber-300 flex items-center justify-center text-sm cursor-pointer select-none"
              title="Color Bomb"
            >
              💣
            </motion.div>

            {/* Floating Sparkle Glints */}
            <motion.div
              animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-10 left-36 z-30 text-yellow-300 drop-shadow-md text-xs pointer-events-none"
            >
              ✨
            </motion.div>
            <motion.div
              animate={{ scale: [1.2, 0.7, 1.2], opacity: [0.9, 0.3, 0.9] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute top-4 right-28 z-30 text-pink-300 drop-shadow-md text-xs pointer-events-none"
            >
              ✨
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Action Buttons with Soft Pastel Gradients */}
      <div className="relative z-20 px-6 pb-8 flex flex-col items-center gap-3">
        {/* Primary "Start Journey / Play" Button */}
        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={handlePlayClick}
          className="relative w-full max-w-xs h-15 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400 text-white font-black text-xl tracking-wide shadow-[0_8px_25px_rgba(236,72,153,0.45)] border-2 border-white dark:border-pink-300/70 flex items-center justify-center gap-2 cursor-pointer group overflow-hidden"
        >
          {/* Glass Top Shimmer */}
          <div className="absolute top-1 inset-x-6 h-4 bg-gradient-to-b from-white/40 to-transparent rounded-full pointer-events-none" />
          <Play size={22} fill="currentColor" className="group-hover:scale-110 transition-transform" />
          <span>Play Level {unlockedLevel}</span>
        </motion.button>

        {/* Secondary Navigation Row: Daily Sticky Tasks + Saga Map */}
        <div className="w-full max-w-xs grid grid-cols-2 gap-2.5">
          {/* Sticky Tasks Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              if (onOpenTasks) onOpenTasks();
              else onPlay();
            }}
            className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 text-white font-black text-xs shadow-md border border-white dark:border-teal-300/50 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ClipboardList size={15} />
            <span>Sticky Quests</span>
          </motion.button>

          {/* Saga Map Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              if (onOpenMap) onOpenMap();
              else onPlay();
            }}
            className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-sky-400 to-blue-500 text-white font-black text-xs shadow-md border border-white dark:border-sky-300/50 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <MapIcon size={15} />
            <span>199 Map</span>
          </motion.button>
        </div>

        {/* Cloud Progress & Local Sync Link */}
        <button
          onClick={handleRetrieveProgress}
          className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors flex items-center gap-1.5 pt-1 cursor-pointer"
        >
          <Cloud size={14} />
          <span>Sync & Restore Local Data</span>
        </button>
      </div>

      {/* Retrieve Progress Modal */}
      {showSyncModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 rounded-[2rem] border-3 border-purple-300 dark:border-purple-600 p-6 max-w-sm w-full shadow-2xl text-center relative overflow-hidden"
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-purple-400 to-pink-400 text-white flex items-center justify-center shadow-md mb-3">
              <RefreshCw size={26} className={syncStatus === 'syncing' ? 'animate-spin' : ''} />
            </div>

            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">
              Data Synchronization
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              All progress, stars, and coins are safely stored locally in SQLite & IndexedDB.
            </p>

            <div className="bg-purple-50 dark:bg-slate-800 rounded-2xl p-3 border border-purple-100 dark:border-purple-900/50 mb-4 flex justify-around">
              <div>
                <p className="text-[10px] font-bold text-purple-600 dark:text-purple-300 uppercase">Max Level</p>
                <p className="text-base font-black text-slate-800 dark:text-white">{unlockedLevel}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-purple-600 dark:text-purple-300 uppercase">Stars</p>
                <p className="text-base font-black text-amber-500">⭐ {totalStars}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-purple-600 dark:text-purple-300 uppercase">Coins</p>
                <p className="text-base font-black text-teal-600 dark:text-teal-400">🪙 {coins}</p>
              </div>
            </div>

            {syncStatus === 'synced' ? (
              <div className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs py-2 px-3 rounded-xl border border-emerald-300 flex items-center justify-center gap-1.5">
                <CheckCircle2 size={16} /> Progress Synced!
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowSyncModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleTriggerSync}
                  disabled={syncStatus === 'syncing'}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-xs shadow-md cursor-pointer hover:scale-102 transition-all"
                >
                  {syncStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
