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

      {/* Center: Clean Minimalist Brand Display Plaque */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 -mt-2">
        {/* Soft Pastel Floating Plaque */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative text-center"
        >
          {/* Pastel Sparkle Crown */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-teal-300 text-white font-black text-[11px] uppercase tracking-widest shadow-md mb-3">
            <Sparkles size={13} className="text-yellow-200 animate-spin" style={{ animationDuration: '6s' }} />
            Match-3 Sweet Puzzle
          </div>

          {/* Clean Modern Typography */}
          <h1 className="font-black text-4xl sm:text-5xl tracking-tight leading-none mb-1">
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-teal-500 dark:from-purple-300 dark:via-pink-300 dark:to-teal-200 bg-clip-text text-transparent drop-shadow-sm">
              Candy Crush
            </span>
          </h1>
          <p className="font-black text-lg sm:text-xl tracking-wider uppercase text-purple-700 dark:text-purple-300 opacity-90">
            Pastel Saga
          </p>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-2">
            199 handcrafted sweet levels • Zero ads • 100% Pure Skill
          </p>
        </motion.div>

        {/* Floating Pastel Candies Orbit */}
        <div className="relative mt-8 mb-4 w-44 h-24 flex items-center justify-center">
          <motion.div 
            animate={{ y: [-4, 4, -4], scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-400 via-purple-400 to-teal-300 p-1 shadow-[0_10px_25px_rgba(244,114,182,0.4)] flex items-center justify-center border-2 border-white dark:border-purple-300"
          >
            <div className="w-full h-full bg-white/30 backdrop-blur-xs rounded-2xl flex items-center justify-center text-3xl">
              🍬
            </div>
          </motion.div>
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
