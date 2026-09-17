'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Lock, Play, Mail, Heart, Settings, Plus, Trophy, Sparkles, Award, Maximize2, Minimize2 } from 'lucide-react';
import { getLevelConfig } from '@/lib/levels';
import { LevelConfig } from '@/lib/game-types';
import { sound } from '@/lib/audio';
import { haptics } from '@/lib/haptics';
import { TOTAL_SAGA_LEVELS, isLevelAccessible } from '@/lib/progression';

interface SagaMapProps {
  unlockedLevel: number;
  starsMap: Record<number, number>;
  coins: number;
  lives: number;
  onSelectLevel: (level: LevelConfig) => void;
  onOpenTasks: () => void;
  onOpenShop: () => void;
  onOpenSettings: () => void;
  isDark?: boolean;
}

export function SagaMap({
  unlockedLevel,
  starsMap,
  coins,
  lives,
  onSelectLevel,
  onOpenTasks,
  onOpenShop,
  onOpenSettings,
  isDark = false,
}: SagaMapProps) {
  const [selectedLevelModal, setSelectedLevelModal] = useState<LevelConfig | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    sound.playClick();
    haptics.touch();
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Generate complete 199-level progression tree (from 199 down to 1)
  const levels = useMemo(() => Array.from({ length: TOTAL_SAGA_LEVELS }, (_, i) => i + 1).reverse(), []);

  // Calculate curve x-offset for the winding road
  const getCurveX = (levelNum: number) => {
    const angle = levelNum * 0.45;
    return Math.sin(angle) * 110; // -110px to +110px from center
  };

  const roadSvgPath = useMemo(() => {
    return levels.reduce((acc, lvl, idx) => {
      const y = idx * 68 + 80;
      const x = 200 + getCurveX(lvl);
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  }, [levels]);

  // Scroll to active level on load
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeElement = document.getElementById(`level-node-${unlockedLevel}`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [unlockedLevel]);

  const handleLevelClick = (lvlNum: number) => {
    if (!isLevelAccessible(lvlNum, unlockedLevel)) {
      sound.playPop(0.8);
      haptics.error();
      return;
    }
    sound.playClick();
    haptics.touch();
    const config = getLevelConfig(lvlNum);
    setSelectedLevelModal(config);
  };

  const handleStartPlay = () => {
    if (!selectedLevelModal) return;
    sound.playPop(1.4);
    haptics.touch();
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
    onSelectLevel(selectedLevelModal);
    setSelectedLevelModal(null);
  };

  // Calculate total stars earned
  const totalStarsEarned = Object.values(starsMap).reduce((acc, curr) => acc + curr, 0);

  return (
    <div className={`relative w-full h-screen flex flex-col overflow-hidden select-none ${isDark ? 'bg-indigo-950 text-white' : 'bg-[#EBF8FF] text-slate-800'}`}>
      {/* Top Saga Bar */}
      <header className="relative z-30 w-full px-4 py-3 bg-gradient-to-b from-pink-300 via-pink-200 to-pink-100/90 dark:from-indigo-900 dark:to-purple-950 shadow-md border-b-4 border-pink-400/40 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mail Envelope button */}
          <button 
            onClick={onOpenTasks}
            className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/50 border-2 border-yellow-400 rounded-2xl flex items-center justify-center shadow-md relative hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            <Mail size={20} className="text-amber-600 dark:text-yellow-300" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full" />
          </button>

          {/* Lives Heart pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-rose-400 rounded-full border-2 border-white/80 shadow-md text-white">
            <Heart size={18} fill="currentColor" className="text-white animate-pulse" />
            <span className="font-black text-xs sm:text-sm tracking-wide">
              {lives >= 5 ? '∞ Full' : `${lives}/5`}
            </span>
          </div>
        </div>

        {/* Tiffi Avatar & Current Level */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-3 border-amber-300 bg-gradient-to-br from-pink-200 to-purple-300 p-0.5 shadow-lg overflow-hidden flex items-center justify-center">
              {/* Tiffi Face Avatar */}
              <div className="w-full h-full bg-pink-100 rounded-full flex flex-col items-center justify-center relative">
                <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 relative flex items-center justify-center">
                  <div className="flex gap-1.5 mb-1">
                    <span className="w-1.5 h-2 bg-slate-800 rounded-full" />
                    <span className="w-1.5 h-2 bg-slate-800 rounded-full" />
                  </div>
                  <span className="absolute left-1 bottom-1.5 w-2 h-1.5 bg-rose-400/80 rounded-full" />
                  <span className="absolute right-1 bottom-1.5 w-2 h-1.5 bg-rose-400/80 rounded-full" />
                  <span className="absolute bottom-1 w-2.5 h-1.5 border-b-2 border-rose-500 rounded-full" />
                </div>
                <div className="absolute -top-1 w-4 h-2 bg-red-500 rounded-full shadow-sm" />
              </div>
            </div>
            {/* Level Badge */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-950 font-black text-[10px] px-2 py-0.2 rounded-full border border-white shadow-sm whitespace-nowrap">
              {unlockedLevel}/199
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Gold Bars */}
          <button 
            onClick={onOpenShop}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full border-2 border-white/80 shadow-md text-amber-950 font-black text-xs sm:text-sm hover:scale-105 transition-transform cursor-pointer"
          >
            <div className="w-4 h-3 bg-amber-500 rounded-sm border border-yellow-200 transform rotate-12 shadow-sm" />
            <span>{coins}</span>
            <Plus size={14} strokeWidth={3} className="text-amber-800" />
          </button>

          {/* Fullscreen / Immersive Toggle Button (Hides URL bar) */}
          <button 
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen (Hide Browser Bars)"}
            className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 border-2 border-white rounded-2xl flex items-center justify-center shadow-md text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>

          {/* Settings Gear */}
          <button 
            onClick={onOpenSettings}
            className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 border-2 border-white rounded-2xl flex items-center justify-center shadow-md text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Main Saga Map Canvas / Scroll Container for 199 Levels */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden relative"
        style={{
          background: isDark
            ? 'linear-gradient(180deg, #1E1B4B 0%, #312E81 50%, #0F172A 100%)'
            : 'linear-gradient(180deg, #BAE6FD 0%, #FBCFE8 35%, #DDD6FE 70%, #A7F3D0 100%)',
        }}
      >
        {/* Decorative Scenery Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-12 left-6 w-32 h-16 bg-white/70 rounded-full blur-xs" />
          <div className="absolute top-48 right-8 w-40 h-20 bg-white/70 rounded-full blur-xs" />
          <div className="absolute top-[45%] left-4 w-36 h-18 bg-white/60 rounded-full blur-xs" />

          {/* Giant Swirl Lollipop Decor */}
          <div className="absolute top-28 left-4 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 via-yellow-400 to-cyan-400 border-4 border-white shadow-xl flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-4 border-white/60" />
            </div>
            <div className="w-3 h-16 bg-white border border-pink-300 rounded-b-md shadow-md -mt-1" />
          </div>

          {/* Pink Jelly Character */}
          <div className="absolute top-[65%] right-6 flex flex-col items-center animate-bounce" style={{ animationDuration: '3s' }}>
            <div className="w-20 h-20 bg-gradient-to-b from-pink-400 to-rose-500 rounded-t-3xl rounded-b-xl border-2 border-white shadow-xl flex flex-col items-center justify-center p-2 relative">
              <div className="flex gap-3 mb-1">
                <div className="w-3 h-4 bg-white rounded-full flex items-center justify-center"><div className="w-1.5 h-2 bg-black rounded-full" /></div>
                <div className="w-3 h-4 bg-white rounded-full flex items-center justify-center"><div className="w-1.5 h-2 bg-black rounded-full" /></div>
              </div>
              <div className="w-8 h-3 bg-white rounded-full border border-pink-700 flex justify-around items-center px-1">
                <span className="w-1 h-2 bg-pink-700" />
                <span className="w-1 h-2 bg-pink-700" />
                <span className="w-1 h-2 bg-pink-700" />
              </div>
              <div className="absolute -left-3 top-4 w-4 h-6 bg-pink-400 rounded-full transform -rotate-45" />
              <div className="absolute -right-3 top-4 w-4 h-6 bg-pink-400 rounded-full transform rotate-45" />
            </div>
          </div>
        </div>

        {/* The Winding Road & Level Nodes for all 199 Levels */}
        <div 
          className="relative w-full py-20 flex flex-col items-center justify-center"
          style={{ minHeight: `${TOTAL_SAGA_LEVELS * 68 + 200}px` }}
        >
          {/* Candy-Cane Striped Road Centerline */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none" 
            style={{ minHeight: `${TOTAL_SAGA_LEVELS * 68 + 200}px` }}
          >
            <defs>
              <pattern id="candyStripeRoad" width="30" height="30" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="30" stroke="#F43F5E" strokeWidth="12" />
                <line x1="15" y1="0" x2="15" y2="30" stroke="#FFFFFF" strokeWidth="18" />
              </pattern>
            </defs>
            <path
              d={roadSvgPath}
              fill="none"
              stroke="#FFF1F2"
              strokeWidth="56"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-lg"
            />
            <path
              d={roadSvgPath}
              fill="none"
              stroke="url(#candyStripeRoad)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.85"
            />
          </svg>

          {/* Level Nodes */}
          {levels.map((lvlNum, idx) => {
            const isUnlocked = lvlNum <= unlockedLevel;
            const isCurrent = lvlNum === unlockedLevel;
            const stars = starsMap[lvlNum] || (isUnlocked && lvlNum < unlockedLevel ? 3 : 0);
            const isMilestone = lvlNum % 10 === 0 || lvlNum === 1 || lvlNum === 199;
            const curveOffset = getCurveX(lvlNum);

            return (
              <div
                key={lvlNum}
                id={`level-node-${lvlNum}`}
                className="relative flex items-center justify-center my-4.5 z-20"
                style={{
                  transform: `translateX(${curveOffset}px)`,
                }}
              >
                {/* Floating Tiffi on Current Active Level */}
                {isCurrent && (
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: [-6, 2, -6] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    className="absolute -top-16 z-30 flex flex-col items-center pointer-events-none"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-lime-300 via-emerald-400 to-green-500 rounded-2xl border-3 border-white shadow-2xl p-1 flex items-center justify-center relative">
                      <div className="w-full h-full bg-pink-100 rounded-xl flex items-center justify-center overflow-hidden">
                        <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 relative flex items-center justify-center">
                          <div className="flex gap-1 mb-0.5">
                            <span className="w-1.5 h-1.5 bg-black rounded-full" />
                            <span className="w-1.5 h-1.5 bg-black rounded-full" />
                          </div>
                          <span className="absolute bottom-1 w-2.5 h-1 border-b-2 border-rose-500 rounded-full" />
                        </div>
                      </div>
                      <div className="absolute -bottom-2 bg-amber-400 text-amber-950 font-black text-[9px] px-1.5 py-0.2 rounded-md border border-white">
                        YOU
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Main Level Button */}
                <button
                  onClick={() => handleLevelClick(lvlNum)}
                  className={`relative group flex flex-col items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer ${
                    isCurrent
                      ? 'scale-115'
                      : isUnlocked
                      ? 'hover:scale-105'
                      : 'opacity-75 grayscale-30 cursor-not-allowed'
                  }`}
                >
                  {/* Milestone Ribbon / Crown */}
                  {isMilestone && isUnlocked && (
                    <div className="absolute -top-3 z-20 bg-amber-400 border border-yellow-200 text-amber-950 font-black text-[9px] px-2 py-0.5 rounded-full shadow-md flex items-center gap-0.5">
                      <Trophy size={10} className="text-amber-800" />
                      <span>{lvlNum === 199 ? 'FINAL' : lvlNum}</span>
                    </div>
                  )}

                  {/* 3D Round Node Base */}
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 flex items-center justify-center shadow-2xl relative ${
                      isCurrent
                        ? 'bg-gradient-to-b from-fuchsia-400 via-pink-500 to-rose-600 border-white ring-4 ring-pink-300/80 animate-pulse'
                        : isUnlocked
                        ? isMilestone
                          ? 'bg-gradient-to-b from-blue-400 via-indigo-500 to-purple-600 border-yellow-300'
                          : 'bg-gradient-to-b from-pink-400 via-rose-500 to-pink-600 border-white'
                        : 'bg-gradient-to-b from-slate-300 to-slate-400 border-slate-200'
                    }`}
                  >
                    {/* Top Specular Shine */}
                    <div className="absolute top-1 left-2 right-2 h-4 bg-white/40 rounded-full blur-[1px]" />

                    {isUnlocked ? (
                      <span className="font-black text-xl sm:text-2xl text-white tracking-tighter drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
                        {lvlNum}
                      </span>
                    ) : (
                      <Lock size={20} className="text-slate-600 drop-shadow-sm" />
                    )}
                  </div>

                  {/* Stars Container Underneath Node */}
                  {isUnlocked && (
                    <div className="flex gap-0.5 mt-1 bg-amber-950/20 px-2 py-0.5 rounded-full backdrop-blur-xs">
                      {[1, 2, 3].map(s => (
                        <Star
                          key={s}
                          size={12}
                          fill={s <= stars ? '#FACC15' : 'none'}
                          stroke={s <= stars ? '#CA8A04' : '#E2E8F0'}
                          strokeWidth={2}
                          className={s <= stars ? 'drop-shadow-sm' : 'opacity-60'}
                        />
                      ))}
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Level Start Details Modal */}
      <AnimatePresence>
        {selectedLevelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              className="w-full max-w-sm bg-gradient-to-b from-pink-100 via-rose-50 to-purple-100 dark:from-slate-900 dark:to-indigo-950 rounded-[2.5rem] border-6 border-pink-300 dark:border-indigo-600 shadow-2xl p-6 relative overflow-hidden"
            >
              <div className="text-center mb-4">
                <span className="inline-block bg-pink-500 text-white font-black text-xs uppercase tracking-widest px-4 py-1 rounded-full shadow-md mb-1">
                  {selectedLevelModal.name}
                </span>
                <h3 className="text-4xl font-black text-rose-950 dark:text-white tracking-tight">
                  Level {selectedLevelModal.id}
                </h3>
              </div>

              {/* Target Objective Box */}
              <div className="bg-white/80 dark:bg-slate-800/80 rounded-2xl p-4 border-2 border-pink-200 dark:border-indigo-700 shadow-inner mb-5">
                <div className="text-xs font-bold text-pink-700 dark:text-pink-300 uppercase tracking-wider mb-2 text-center">
                  Target Objective
                </div>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 bg-pink-500/20 rounded-2xl flex items-center justify-center">
                    <Trophy size={24} className="text-pink-600 dark:text-pink-400" />
                  </div>
                  <div className="text-left">
                    <div className="font-black text-slate-800 dark:text-white text-base">
                      {selectedLevelModal.objective.description}
                    </div>
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      Moves Allowed: <span className="text-pink-600 font-black">{selectedLevelModal.moves}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Targets & Rewards Info */}
              <div className="flex justify-around items-center mb-6 bg-pink-200/50 dark:bg-slate-800/50 p-2.5 rounded-2xl">
                <div className="text-center">
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase">Target Score</span>
                  <div className="font-black text-rose-600 dark:text-rose-400 text-sm">
                    {selectedLevelModal.targetScore.toLocaleString()}
                  </div>
                </div>
                <div className="w-px h-8 bg-pink-300" />
                <div className="text-center">
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase">Star Rewards</span>
                  <div className="flex gap-1 justify-center mt-0.5">
                    <Star size={14} fill="#FACC15" className="text-amber-500" />
                    <Star size={14} fill="#FACC15" className="text-amber-500" />
                    <Star size={14} fill="#FACC15" className="text-amber-500" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleStartPlay}
                  className="w-full py-4 bg-gradient-to-b from-lime-400 via-green-500 to-emerald-600 border-b-6 border-emerald-800 text-white font-black text-2xl uppercase tracking-wider rounded-2xl shadow-xl flex items-center justify-center gap-3 hover:brightness-105 active:border-b-0 active:translate-y-1.5 transition-all cursor-pointer"
                >
                  <Play size={26} fill="currentColor" />
                  PLAY LEVEL
                </button>

                <button
                  onClick={() => setSelectedLevelModal(null)}
                  className="w-full py-2.5 text-slate-500 dark:text-slate-400 font-bold text-sm hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
