'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  Lock, 
  Play, 
  Heart, 
  Settings, 
  Plus, 
  Trophy, 
  Sparkles, 
  Award, 
  Moon, 
  Sun,
  ClipboardList,
  ShoppingCart
} from 'lucide-react';
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
  onToggleDarkMode?: () => void;
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
  onToggleDarkMode,
}: SagaMapProps) {
  const [selectedLevelModal, setSelectedLevelModal] = useState<LevelConfig | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Generate 199-level progression tree (from 199 down to 1)
  const levels = useMemo(() => Array.from({ length: TOTAL_SAGA_LEVELS }, (_, i) => i + 1).reverse(), []);

  // Calculate winding curve x-offset
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
      const levelIndex = TOTAL_SAGA_LEVELS - unlockedLevel;
      const targetY = levelIndex * 68;
      scrollContainerRef.current.scrollTop = Math.max(0, targetY - 250);

      const timer = setTimeout(() => {
        const activeElement = document.getElementById(`level-node-${unlockedLevel}`);
        if (activeElement && scrollContainerRef.current) {
          activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
      return () => clearTimeout(timer);
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
    onSelectLevel(selectedLevelModal);
    setSelectedLevelModal(null);
  };

  const totalStarsEarned = Object.values(starsMap).reduce((acc, curr) => acc + curr, 0);

  return (
    <div 
      className={`relative w-full h-full flex flex-col overflow-hidden select-none transition-colors duration-500 ${
        isDark ? 'bg-[#0F172A] text-white' : 'bg-[#F8FAFC] text-slate-800'
      }`}
    >
      {/* Top Clean Minimalist Header HUD */}
      <header className="relative z-30 w-full px-3 sm:px-4 py-2.5 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-purple-200/50 dark:border-purple-800/40 shadow-sm flex items-center justify-between">
        {/* Left: Sticky Tasks Trigger & Lives Heart */}
        <div className="flex items-center gap-2">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenTasks}
            className="px-2.5 py-1.5 rounded-2xl bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 border border-purple-300/60 dark:border-purple-700/60 flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Open Sticky Quests"
          >
            <ClipboardList size={15} className="text-purple-600 dark:text-purple-300" />
            <span className="text-[11px] font-black text-purple-900 dark:text-purple-200">Quests</span>
          </motion.button>

          {/* Lives Heart Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full border border-white/60 shadow-xs text-white">
            <Heart size={14} fill="currentColor" className="animate-pulse" />
            <span className="font-black text-xs">
              {lives >= 5 ? '5/5' : `${lives}/5`}
            </span>
          </div>
        </div>

        {/* Right: Coins + Dark Mode + Shop + Settings */}
        <div className="flex items-center gap-1.5">
          {/* Gold Coins Pill */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenShop}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-950/70 dark:to-yellow-950/70 border border-amber-300/60 dark:border-amber-700/60 shadow-xs cursor-pointer"
            title="Candy Shop"
          >
            <span className="text-xs">🪙</span>
            <span className="font-black text-xs text-amber-900 dark:text-amber-300">{coins}</span>
            <Plus size={12} className="text-amber-700 dark:text-amber-400 ml-0.5" />
          </motion.button>

          {/* Dark Mode Switch */}
          {onToggleDarkMode && (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={onToggleDarkMode}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-purple-600 dark:text-amber-300 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer"
              title={isDark ? 'Light Mode' : 'Dark Mode'}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </motion.button>
          )}

          {/* Settings */}
          <motion.button
            whileHover={{ rotate: 90, scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onOpenSettings}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer"
            title="Settings"
          >
            <Settings size={15} />
          </motion.button>
        </div>
      </header>

      {/* Main Saga Winding Roadmap Scroll Container */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth focus:outline-none"
      >
        {/* Soft Pastel Cloud Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-4 w-72 h-72 bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-3xl" />
          <div className="absolute top-96 right-4 w-72 h-72 bg-sky-200/20 dark:bg-sky-900/10 rounded-full blur-3xl" />
          <div className="absolute top-[800px] left-8 w-80 h-80 bg-pink-200/20 dark:bg-pink-900/10 rounded-full blur-3xl" />
          <div className="absolute top-[1600px] right-8 w-80 h-80 bg-teal-200/20 dark:bg-teal-900/10 rounded-full blur-3xl" />
        </div>

        {/* Winding Road SVG Path */}
        <div className="relative w-[400px] mx-auto min-h-[14000px]">
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ minHeight: `${TOTAL_SAGA_LEVELS * 68 + 200}px` }}
          >
            {/* Outer Pastel Glow Ribbon */}
            <path
              d={roadSvgPath}
              fill="none"
              stroke={isDark ? '#4C1D95' : '#E0AAFF'}
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.5}
            />
            {/* Core Pastel Road */}
            <path
              d={roadSvgPath}
              fill="none"
              stroke={isDark ? '#8B5CF6' : '#C77DFF'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Inner Dashed Trail */}
            <path
              d={roadSvgPath}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeDasharray="6 8"
              opacity={0.8}
            />
          </svg>

          {/* Level Nodes */}
          {levels.map((lvlNum, idx) => {
            const isUnlocked = isLevelAccessible(lvlNum, unlockedLevel);
            const isCurrent = lvlNum === unlockedLevel;
            const stars = starsMap[lvlNum] || 0;
            const y = idx * 68 + 80;
            const x = 200 + getCurveX(lvlNum);

            return (
              <div
                key={lvlNum}
                id={`level-node-${lvlNum}`}
                style={{
                  top: `${y}px`,
                  left: `${x}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute z-20 flex flex-col items-center cursor-pointer group"
                onClick={() => handleLevelClick(lvlNum)}
              >
                {/* Level Node Button */}
                <motion.div
                  whileHover={{ scale: isUnlocked ? 1.15 : 1 }}
                  whileTap={{ scale: isUnlocked ? 0.9 : 1 }}
                  className={`relative w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all shadow-md ${
                    isCurrent
                      ? 'bg-gradient-to-tr from-pink-400 via-purple-400 to-teal-300 text-white border-white ring-4 ring-pink-300/60 dark:ring-pink-500/40 shadow-lg'
                      : isUnlocked
                      ? 'bg-gradient-to-tr from-sky-400 to-teal-400 text-white border-white/80'
                      : isDark
                      ? 'bg-slate-800 text-slate-500 border-slate-700'
                      : 'bg-slate-200 text-slate-400 border-slate-300'
                  }`}
                >
                  {isUnlocked ? (
                    <span className="font-black text-sm drop-shadow-xs">
                      {lvlNum}
                    </span>
                  ) : (
                    <Lock size={15} strokeWidth={2.5} />
                  )}

                  {/* Pulsing indicator on current level */}
                  {isCurrent && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500 border border-white" />
                    </span>
                  )}
                </motion.div>

                {/* Star Ratings below unlocked node */}
                {isUnlocked && (
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1, 2, 3].map(starIndex => (
                      <Star
                        key={starIndex}
                        size={11}
                        fill={starIndex <= stars ? '#F59E0B' : 'none'}
                        className={
                          starIndex <= stars
                            ? 'text-amber-400 filter drop-shadow-xs'
                            : 'text-slate-300 dark:text-slate-600'
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Level Start Modal */}
      <AnimatePresence>
        {selectedLevelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              className={`w-full max-w-xs ${
                isDark 
                  ? 'bg-slate-900 border-purple-500/50 text-white' 
                  : 'bg-white border-pink-200 text-slate-800'
              } rounded-[2rem] border-3 p-6 shadow-2xl text-center relative overflow-hidden`}
            >
              {/* Top Level Crown Badge */}
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-purple-400 to-pink-400 text-white flex items-center justify-center shadow-lg mb-3">
                <Trophy size={26} />
              </div>

              <h3 className="text-2xl font-black tracking-tight mb-1">
                Level {selectedLevelModal.id}
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4">
                {selectedLevelModal.name || 'Pastel Puzzle'}
              </p>

              {/* Objectives info */}
              <div className="bg-purple-50 dark:bg-slate-800/80 rounded-2xl p-3 border border-purple-100 dark:border-purple-900/40 mb-4 flex justify-around">
                <div>
                  <p className="text-[10px] font-bold text-purple-600 dark:text-purple-300 uppercase">Target</p>
                  <p className="text-xs font-black text-slate-800 dark:text-white capitalize">
                    {selectedLevelModal.objective.type.replace('-', ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-purple-600 dark:text-purple-300 uppercase">Moves</p>
                  <p className="text-xs font-black text-pink-600 dark:text-pink-300">
                    {selectedLevelModal.moves}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedLevelModal(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleStartPlay}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400 text-white font-black text-xs shadow-md flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Play size={14} fill="currentColor" />
                  <span>Play</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
