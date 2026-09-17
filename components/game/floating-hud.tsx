'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Star, Volume2, VolumeX, Sparkles, CheckCircle2,
  Trophy, Pause, Flame, Maximize2, Minimize2
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
  const star3Pct = 100;

  return (
    <header className="relative z-30 w-full pt-2 pb-2.5 px-3 sm:px-4 bg-gradient-to-b from-white/95 via-pink-100/90 to-pink-200/80 dark:from-slate-900/95 dark:via-indigo-950/90 dark:to-purple-950/80 border-b-3 border-pink-300/60 dark:border-indigo-800/60 shadow-xl backdrop-blur-lg">
      {/* Top Utility Ribbon: Back + Level Badge + Progress Bar with % + Controls */}
      <div className="max-w-md mx-auto flex items-center justify-between gap-2 mb-2 px-1">
        {/* Back Button & Level Indicator */}
        <div className="flex items-center gap-1.5">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onBackToMap}
            className="w-8 h-8 bg-white/90 dark:bg-slate-800/90 rounded-full border-2 border-pink-300 dark:border-pink-500/50 flex items-center justify-center text-pink-700 dark:text-pink-300 shadow-sm transition-all cursor-pointer"
            title="Return to Saga Map"
          >
            <ArrowLeft size={16} strokeWidth={3} />
          </motion.button>

          <div className="bg-pink-600 dark:bg-pink-700 text-white font-black text-xs px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 border border-white/40">
            <span>LVL {levelConfig.id}</span>
            <span className="opacity-70">|</span>
            <span className="text-[10px] text-pink-200">❤ {lives}</span>
          </div>
        </div>

        {/* Dynamic Score Progression Bar with Percentage & Star Milestones */}
        <div className="flex-1 max-w-[170px] relative px-1">
          <div className="flex items-center justify-between text-[9px] font-black text-pink-900 dark:text-pink-200 uppercase tracking-tight mb-0.5 px-0.5">
            <span>Progress</span>
            <span className="font-extrabold text-rose-600 dark:text-amber-300">
              {progressPercentage}%
            </span>
          </div>

          <div className="w-full h-3.5 bg-pink-950/25 dark:bg-black/50 rounded-full overflow-hidden p-0.5 border-2 border-white/70 dark:border-slate-700 shadow-inner relative">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-400 rounded-full shadow-sm"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            />
          </div>

          {/* 3-Star Milestone Markers on the Progress Bar */}
          <div className="absolute inset-x-1 top-4.5 pointer-events-none">
            {/* Star 1 */}
            <div 
              className="absolute -top-1 -translate-x-1/2"
              style={{ left: `${star1Pct}%` }}
            >
              <Star
                size={13}
                fill={currentStars >= 1 ? '#FACC15' : '#CBD5E1'}
                stroke={currentStars >= 1 ? '#B45309' : '#64748B'}
                strokeWidth={1.5}
                className={currentStars >= 1 ? 'drop-shadow-[0_0_6px_rgba(250,204,21,0.9)] animate-bounce' : ''}
              />
            </div>

            {/* Star 2 */}
            <div 
              className="absolute -top-1 -translate-x-1/2"
              style={{ left: `${star2Pct}%` }}
            >
              <Star
                size={13}
                fill={currentStars >= 2 ? '#FACC15' : '#CBD5E1'}
                stroke={currentStars >= 2 ? '#B45309' : '#64748B'}
                strokeWidth={1.5}
                className={currentStars >= 2 ? 'drop-shadow-[0_0_6px_rgba(250,204,21,0.9)] animate-bounce' : ''}
              />
            </div>

            {/* Star 3 */}
            <div 
              className="absolute -top-1 right-0 translate-x-1"
            >
              <Star
                size={14}
                fill={currentStars >= 3 ? '#FACC15' : '#CBD5E1'}
                stroke={currentStars >= 3 ? '#B45309' : '#64748B'}
                strokeWidth={1.5}
                className={currentStars >= 3 ? 'drop-shadow-[0_0_8px_rgba(250,204,21,1)] animate-pulse' : ''}
              />
            </div>
          </div>
        </div>

        {/* Pause Button + Audio Toggle */}
        <div className="flex items-center gap-1.5">
          {/* Pause Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onPause}
            className="w-8 h-8 bg-white/95 dark:bg-slate-800/90 rounded-full border border-pink-300 dark:border-slate-700 flex items-center justify-center text-pink-700 dark:text-pink-300 shadow-sm cursor-pointer hover:bg-pink-50 transition-all"
            title="Pause Game"
          >
            <Pause size={15} fill="currentColor" />
          </motion.button>

          {/* Fullscreen Toggle (Hides URL bar) */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggleFullscreen}
            className="w-8 h-8 bg-white/95 dark:bg-slate-800/90 rounded-full border border-pink-300 dark:border-slate-700 flex items-center justify-center text-pink-700 dark:text-pink-300 shadow-sm cursor-pointer transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen (Hide Browser URL Bar)'}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </motion.button>

          {/* Sound Toggle */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onToggleSound}
            className="w-8 h-8 bg-white/95 dark:bg-slate-800/90 rounded-full border border-pink-300 dark:border-slate-700 flex items-center justify-center text-pink-700 dark:text-pink-300 shadow-sm cursor-pointer transition-all"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </motion.button>
        </div>
      </div>

      {/* Main Floating HUD Row: Moves Orb + Goal Capsule + Score Display */}
      <div className="max-w-md mx-auto flex items-center justify-between gap-2 px-1">
        {/* 3D Moves Orb */}
        <motion.div
          animate={isLowMoves ? { scale: [1, 1.12, 1], rotate: [-2, 2, -2] } : { scale: 1 }}
          transition={isLowMoves ? { repeat: Infinity, duration: 0.8 } : undefined}
          className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl border-3 shadow-lg ${
            isLowMoves
              ? 'bg-gradient-to-br from-rose-500 to-red-600 border-yellow-300 text-white shadow-rose-500/40 animate-pulse'
              : 'bg-gradient-to-br from-pink-500 to-rose-600 border-white text-white'
          }`}
        >
          <span className="text-[9px] font-black uppercase tracking-widest text-pink-200 -mb-1">Moves</span>
          <motion.span
            key={moves}
            initial={{ scale: 1.35 }}
            animate={{ scale: 1 }}
            className="font-black text-2xl leading-none italic tracking-tight"
          >
            {moves}
          </motion.span>
        </motion.div>

        {/* Center Target Objective Pill Capsule */}
        <div className={`flex-1 bg-gradient-to-r ${isObjectiveMet ? 'from-emerald-500 via-green-500 to-teal-600 border-emerald-300 ring-2 ring-emerald-300/60' : 'from-pink-500 via-rose-500 to-pink-600 border-white'} rounded-2xl py-2 px-3.5 border-3 shadow-xl flex items-center justify-between gap-2 transition-colors duration-300 relative overflow-hidden`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center drop-shadow-md">
              {levelConfig.objective.type === 'color' && (
                <CandySvg color={levelConfig.objective.color || 'red'} size={32} />
              )}
              {levelConfig.objective.type === 'color-bomb' && (
                <CandySvg color="rainbow" special="color-bomb" size={32} />
              )}
              {levelConfig.objective.type === 'fish' && (
                <CandySvg color="blue" special="fish" size={32} />
              )}
              {levelConfig.objective.type === 'waffle' && (
                <ObstacleSvg type="waffle" size={32} />
              )}
              {levelConfig.objective.type === 'jellies' && (
                <div className="w-7 h-7 bg-pink-200 dark:bg-pink-300 rounded-lg border-2 border-white shadow-inner flex items-center justify-center font-black text-[10px] text-pink-900">
                  JELLY
                </div>
              )}
              {levelConfig.objective.type === 'score' && (
                <Trophy size={26} className="text-yellow-300" />
              )}
            </div>

            <div className="flex flex-col">
              <span className="text-[9px] font-black text-pink-100 uppercase tracking-wider">
                {isObjectiveMet ? 'Goal Met!' : 'Target'}
              </span>
              <div className="flex items-center gap-1">
                {isObjectiveMet ? (
                  <span className="flex items-center gap-1 font-black text-xl text-white tracking-tight">
                    <CheckCircle2 size={20} className="text-yellow-300 animate-bounce" /> COMPLETE
                  </span>
                ) : (
                  <motion.span
                    key={remainingObjective}
                    initial={{ scale: 1.25 }}
                    animate={{ scale: 1 }}
                    className="font-black text-2xl text-white italic tracking-tight"
                  >
                    {levelConfig.objective.type === 'score' ? score.toLocaleString() : remainingObjective}
                  </motion.span>
                )}
              </div>
            </div>
          </div>

          {/* Dynamic Consecutive Match Combo Multiplier Badge */}
          <AnimatePresence>
            {comboMultiplier > 1 && (
              <motion.div
                initial={{ scale: 0, rotate: -15, y: 8, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, y: 0, opacity: 1 }}
                exit={{ scale: 0, opacity: 0, transition: { duration: 0.15 } }}
                transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                className="bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 text-amber-950 font-black text-xs px-2.5 py-1 rounded-full border-2 border-white shadow-lg flex items-center gap-1 ring-2 ring-yellow-400/60"
              >
                <Flame size={13} className="text-orange-600 animate-bounce" />
                <span className="tracking-tight">x{comboMultiplier} COMBO!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Live Score Display Tile */}
        <div className="w-20 bg-white/90 dark:bg-slate-800/90 rounded-2xl border-2 border-pink-300 dark:border-slate-700 py-1 px-2 shadow-md flex flex-col items-center justify-center">
          <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest -mb-0.5">Score</span>
          <motion.span
            key={score}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            className="font-black text-base text-rose-600 dark:text-pink-400 tracking-tight"
          >
            {score.toLocaleString()}
          </motion.span>
        </div>
      </div>
    </header>
  );
}
