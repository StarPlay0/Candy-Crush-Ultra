'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Star, Volume2, VolumeX, Sparkles, CheckCircle2,
  Trophy, Pause, Flame, Maximize2, Minimize2, Moon, Sun, Heart
} from 'lucide-react';
import { LevelConfig } from '@/lib/game-types';
import { CandySvg, ObstacleSvg } from './candy-svgs';

interface FloatingHudProps {
  levelConfig: LevelConfig;
  score: number;
  highScore: number;
  moves: number;
  objectiveProgress: number;
  currentStars: number;
  comboMultiplier: number;
  lives: number;
  isMuted: boolean;
  onToggleSound: () => void;
  onPause: () => void;
  onBackToMap: () => void;
  isDark?: boolean;
  onToggleDarkMode?: () => void;
}

export function FloatingHud({
  levelConfig,
  score,
  highScore,
  moves,
  objectiveProgress,
  currentStars,
  comboMultiplier,
  lives,
  isMuted,
  onToggleSound,
  onPause,
  onBackToMap,
  isDark = false,
  onToggleDarkMode,
}: FloatingHudProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFs);
    return () => document.removeEventListener('fullscreenchange', handleFs);
  }, []);

  const toggleFullscreen = () => {
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

  const objectiveTarget = levelConfig.objective.target;
  const remainingObjective = Math.max(0, objectiveTarget - objectiveProgress);
  const isObjectiveMet = remainingObjective === 0;

  // Score Progression Calculation relative to 3-Star Target Threshold
  const maxThreshold = levelConfig.starThresholds[2] || levelConfig.targetScore || 10000;
  const progressPercentage = Math.min(100, Math.round((score / maxThreshold) * 100));
  const isLowMoves = moves <= 5 && !isObjectiveMet;

  // Star threshold percentages along the progress bar
  const star1Pct = Math.min(100, Math.round(((levelConfig.starThresholds[0] || maxThreshold * 0.33) / maxThreshold) * 100));
  const star2Pct = Math.min(100, Math.round(((levelConfig.starThresholds[1] || maxThreshold * 0.66) / maxThreshold) * 100));

  return (
    <header className="relative z-30 w-full pt-2.5 pb-2.5 px-3 sm:px-4 bg-white/90 dark:bg-slate-900/90 border-b border-purple-200/50 dark:border-purple-800/40 shadow-sm backdrop-blur-xl transition-colors duration-500">
      {/* Top Utility Ribbon: Back + Level Pill + Progress Bar with % + Controls */}
      <div className="max-w-md mx-auto flex items-center justify-between gap-2 mb-2 px-0.5">
        {/* Back Button & Level Badge */}
        <div className="flex items-center gap-1.5">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onBackToMap}
            className="w-8 h-8 bg-purple-50 dark:bg-slate-800 rounded-full border border-purple-200 dark:border-purple-700/60 flex items-center justify-center text-purple-700 dark:text-purple-300 shadow-xs transition-all cursor-pointer"
            title="Return to Saga Map"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
          </motion.button>

          <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white font-black text-xs px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
            <span>LVL {levelConfig.id}</span>
            <span className="opacity-70">|</span>
            <span className="text-[10px] text-pink-100 flex items-center gap-0.5">
              <Heart size={11} fill="currentColor" /> {lives}
            </span>
          </div>
        </div>

        {/* Dynamic Score Progression Bar with Percentage & Star Milestones */}
        <div className="flex-1 max-w-[170px] relative px-1">
          <div className="flex items-center justify-between text-[9px] font-black text-purple-900 dark:text-purple-200 uppercase tracking-tight mb-0.5 px-0.5">
            <span>Score</span>
            <span className="font-extrabold text-pink-600 dark:text-pink-300">
              {progressPercentage}%
            </span>
          </div>

          <div className="w-full h-3 bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-purple-200/50 dark:border-purple-900 shadow-inner relative">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-400 via-pink-400 to-teal-300 rounded-full shadow-xs"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            />
          </div>

          {/* 3-Star Milestone Markers on the Progress Bar */}
          <div className="absolute inset-x-1 top-4 pointer-events-none">
            {/* Star 1 */}
            <div 
              className="absolute -top-1 -translate-x-1/2"
              style={{ left: `${star1Pct}%` }}
            >
              <Star
                size={12}
                fill={currentStars >= 1 ? '#F59E0B' : '#94A3B8'}
                stroke={currentStars >= 1 ? '#B45309' : '#64748B'}
                strokeWidth={1.5}
                className={currentStars >= 1 ? 'drop-shadow-xs animate-bounce' : 'opacity-40'}
              />
            </div>

            {/* Star 2 */}
            <div 
              className="absolute -top-1 -translate-x-1/2"
              style={{ left: `${star2Pct}%` }}
            >
              <Star
                size={12}
                fill={currentStars >= 2 ? '#F59E0B' : '#94A3B8'}
                stroke={currentStars >= 2 ? '#B45309' : '#64748B'}
                strokeWidth={1.5}
                className={currentStars >= 2 ? 'drop-shadow-xs animate-bounce' : 'opacity-40'}
              />
            </div>

            {/* Star 3 */}
            <div 
              className="absolute -top-1 right-0 translate-x-1"
            >
              <Star
                size={13}
                fill={currentStars >= 3 ? '#F59E0B' : '#94A3B8'}
                stroke={currentStars >= 3 ? '#B45309' : '#64748B'}
                strokeWidth={1.5}
                className={currentStars >= 3 ? 'drop-shadow-xs animate-pulse' : 'opacity-40'}
              />
            </div>
          </div>
        </div>

        {/* Right Controls: Dark Mode + Pause + Audio */}
        <div className="flex items-center gap-1">
          {onToggleDarkMode && (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={onToggleDarkMode}
              className="w-7 h-7 bg-purple-50 dark:bg-slate-800 rounded-full border border-purple-200/70 dark:border-purple-800/60 flex items-center justify-center text-purple-700 dark:text-amber-300 shadow-xs cursor-pointer transition-all"
              title={isDark ? 'Light Mode' : 'Dark Mode'}
            >
              {isDark ? <Sun size={13} /> : <Moon size={13} />}
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onPause}
            className="w-7 h-7 bg-pink-50 dark:bg-slate-800 rounded-full border border-pink-200/70 dark:border-pink-800/60 flex items-center justify-center text-pink-700 dark:text-pink-300 shadow-xs cursor-pointer transition-all"
            title="Pause Game"
          >
            <Pause size={13} fill="currentColor" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onToggleSound}
            className="w-7 h-7 bg-teal-50 dark:bg-slate-800 rounded-full border border-teal-200/70 dark:border-teal-800/60 flex items-center justify-center text-teal-700 dark:text-teal-300 shadow-xs cursor-pointer transition-all"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </motion.button>
        </div>
      </div>

      {/* Main Floating HUD Row: Moves Orb + Goal Capsule + Score Display */}
      <div className="max-w-md mx-auto flex items-center justify-between gap-2 px-0.5">
        {/* Soft Pastel Moves Pill */}
        <motion.div
          animate={isLowMoves ? { scale: [1, 1.08, 1] } : { scale: 1 }}
          transition={isLowMoves ? { repeat: Infinity, duration: 0.8 } : undefined}
          className={`flex flex-col items-center justify-center w-13 h-13 rounded-2xl border-2 shadow-sm ${
            isLowMoves
              ? 'bg-gradient-to-br from-rose-400 to-pink-500 border-yellow-200 text-white animate-pulse'
              : 'bg-gradient-to-br from-purple-400 to-pink-400 border-white text-white'
          }`}
        >
          <span className="text-[8px] font-black uppercase tracking-widest text-purple-100 -mb-0.5">Moves</span>
          <motion.span
            key={moves}
            initial={{ scale: 1.25 }}
            animate={{ scale: 1 }}
            className="font-black text-xl leading-none italic tracking-tight"
          >
            {moves}
          </motion.span>
        </motion.div>

        {/* Center Target Objective Capsule */}
        <div className={`flex-1 bg-gradient-to-r ${isObjectiveMet ? 'from-teal-400 to-emerald-400 text-white' : 'from-pink-400 via-purple-400 to-teal-300 text-white'} rounded-2xl py-1.5 px-3 border border-white/60 shadow-md flex items-center justify-between gap-2 relative overflow-hidden`}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center drop-shadow-xs">
              {levelConfig.objective.type === 'color' && (
                <CandySvg color={levelConfig.objective.color || 'red'} size={28} />
              )}
              {levelConfig.objective.type === 'color-bomb' && (
                <CandySvg color="rainbow" special="color-bomb" size={28} />
              )}
              {levelConfig.objective.type === 'fish' && (
                <CandySvg color="blue" special="fish" size={28} />
              )}
              {levelConfig.objective.type === 'waffle' && (
                <ObstacleSvg type="waffle" size={28} />
              )}
              {levelConfig.objective.type === 'jellies' && (
                <div className="w-6 h-6 bg-pink-200 rounded-lg border border-white flex items-center justify-center font-black text-[9px] text-pink-900">
                  JELLY
                </div>
              )}
              {levelConfig.objective.type === 'score' && (
                <Trophy size={22} className="text-yellow-200" />
              )}
            </div>

            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-white/90 uppercase tracking-widest">
                Objective
              </span>
              <span className="text-xs font-black leading-tight drop-shadow-xs">
                {isObjectiveMet ? 'Target Done!' : `${remainingObjective} Left`}
              </span>
            </div>
          </div>

          {/* Target Status Checkmark */}
          {isObjectiveMet ? (
            <div className="w-6 h-6 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-xs">
              <CheckCircle2 size={16} />
            </div>
          ) : (
            <div className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-black">
              {objectiveProgress}/{objectiveTarget}
            </div>
          )}
        </div>

        {/* Current Score Display */}
        <div className="flex flex-col items-end justify-center px-2.5 py-1 rounded-2xl bg-gradient-to-r from-sky-400 to-teal-400 text-white border border-white/60 shadow-sm min-w-[70px]">
          <span className="text-[8px] font-black uppercase tracking-widest text-sky-100">Score</span>
          <motion.span 
            key={score}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            className="text-sm font-black tracking-tight"
          >
            {score.toLocaleString()}
          </motion.span>
        </div>
      </div>
    </header>
  );
}
