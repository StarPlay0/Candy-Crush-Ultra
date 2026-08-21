'use client';

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, Trophy, ArrowRight, RotateCcw, Map, Sparkles, CheckCircle2 } from 'lucide-react';
import { LevelConfig } from '@/lib/game-types';
import { sound } from '@/lib/audio';

interface LevelCompleteOverlayProps {
  levelConfig: LevelConfig;
  score: number;
  stars: number;
  onNextLevel: (nextLevelId: number) => void;
  onReplayLevel: () => void;
  onBackToMap: () => void;
  isDark?: boolean;
}

interface ConfettiPiece {
  id: number;
  x: number;
  initialY: number;
  destY: number;
  size: number;
  color: string;
  shape: 'square' | 'circle' | 'ribbon' | 'star';
  rotation: number;
  delay: number;
  duration: number;
  repeatDelay: number;
}

// Deterministic confetti distribution to maintain component purity
const CONFETTI_COLORS = [
  '#FF1744', '#FF5252', '#FF4081', '#E040FB', 
  '#7C4DFF', '#536DFE', '#00E5FF', '#00E676', 
  '#FFEA00', '#FF9100', '#FF3D00', '#F59E0B'
];
const CONFETTI_SHAPES: ('square' | 'circle' | 'ribbon' | 'star')[] = ['square', 'circle', 'ribbon', 'star'];

const STATIC_CONFETTI_PIECES: ConfettiPiece[] = Array.from({ length: 45 }, (_, i) => {
  // Pure deterministic pseudo-random formula based on index
  const pseudoSeed = (i * 9301 + 49297) % 233280;
  const normalized = pseudoSeed / 233280;
  const xOffset = ((i % 15) - 7) * 24 + ((i * 17) % 20);

  return {
    id: i,
    x: xOffset,
    initialY: -80 - (i % 5) * 16,
    destY: 420 + (i % 7) * 35,
    size: 8 + (i % 4) * 3,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    shape: CONFETTI_SHAPES[i % CONFETTI_SHAPES.length],
    rotation: (i * 47) % 720 - 360,
    delay: (i % 10) * 0.05,
    duration: 2.2 + (i % 6) * 0.25,
    repeatDelay: (i % 4) * 0.35,
  };
});

export function LevelCompleteOverlay({
  levelConfig,
  score,
  stars,
  onNextLevel,
  onReplayLevel,
  onBackToMap,
  isDark = false,
}: LevelCompleteOverlayProps) {
  const nextLevelId = Math.min(199, levelConfig.id + 1);
  const isLastLevel = levelConfig.id >= 199;
  const is3Star = stars === 3;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-hidden"
    >
      {/* Framer Motion Confetti Streamers Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        {STATIC_CONFETTI_PIECES.map((piece) => (
          <motion.div
            key={piece.id}
            initial={{
              x: 0,
              y: piece.initialY,
              rotate: 0,
              scale: 0,
              opacity: 1,
            }}
            animate={{
              x: piece.x,
              y: piece.destY,
              rotate: piece.rotation,
              scale: [0, 1.2, 1, 0.9],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: piece.duration,
              delay: piece.delay,
              ease: [0.25, 0.46, 0.45, 0.94],
              repeat: Infinity,
              repeatDelay: piece.repeatDelay,
            }}
            style={{
              position: 'absolute',
              width: piece.shape === 'ribbon' ? piece.size * 2 : piece.size,
              height: piece.shape === 'ribbon' ? piece.size * 0.5 : piece.size,
              backgroundColor: piece.color,
              borderRadius: piece.shape === 'circle' ? '50%' : piece.shape === 'ribbon' ? '4px' : '2px',
              boxShadow: `0 0 10px ${piece.color}80`,
            }}
          />
        ))}
      </div>

      {/* Main Level Complete Card */}
      <motion.div
        initial={{ scale: 0.65, y: 40, rotate: -2 }}
        animate={{ scale: 1, y: 0, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 22 }}
        className={`relative w-full max-w-sm rounded-[2.75rem] border-8 ${
          isDark 
            ? 'bg-gradient-to-b from-slate-900 via-indigo-950 to-purple-950 border-indigo-500/80 text-white' 
            : 'bg-gradient-to-b from-amber-100 via-pink-100 to-rose-100 border-pink-400 text-slate-800'
        } shadow-2xl p-6 text-center overflow-hidden z-10`}
      >
        {/* Background Candy Radiance */}
        <div className="absolute -top-20 -left-20 w-44 h-44 bg-pink-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

        {/* Level Ribbon Badge */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 text-white font-black text-xs uppercase tracking-widest px-5 py-1.5 rounded-full shadow-lg border-2 border-white/60 mb-2"
        >
          <Sparkles size={14} className="text-yellow-300 animate-spin" style={{ animationDuration: '3s' }} />
          <span>Level {levelConfig.id} Completed!</span>
        </motion.div>

        {/* Header Title */}
        <motion.h2
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-3xl sm:text-4xl font-black text-rose-950 dark:text-white italic tracking-tight mb-2 drop-shadow-xs"
        >
          {is3Star ? 'DIVINE VICTORY!' : 'SUGAR CRUSH!'}
        </motion.h2>

        <p className="text-xs font-bold text-pink-700 dark:text-pink-300 uppercase tracking-wider mb-4">
          Goal Reached • Next Level Unlocked
        </p>

        {/* 3-Star Celebration Area */}
        <div className="flex justify-center items-center gap-3 my-3">
          {[1, 2, 3].map((starIndex) => {
            const isEarned = starIndex <= stars;
            return (
              <motion.div
                key={starIndex}
                initial={{ scale: 0, rotate: -40, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{
                  delay: 0.25 + starIndex * 0.18,
                  type: 'spring',
                  stiffness: 400,
                  damping: 18,
                }}
                className="relative"
              >
                <div className="relative">
                  <Star
                    size={starIndex === 2 ? 52 : 44}
                    fill={isEarned ? '#FACC15' : '#CBD5E1'}
                    stroke={isEarned ? '#B45309' : '#64748B'}
                    strokeWidth={2}
                    className={isEarned ? 'drop-shadow-[0_0_12px_rgba(250,204,21,0.9)] animate-pulse' : ''}
                  />
                  {isEarned && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.5, 0] }}
                      transition={{ delay: 0.4 + starIndex * 0.2, duration: 0.6 }}
                      className="absolute inset-0 flex items-center justify-center text-white font-black text-xs pointer-events-none"
                    >
                      ✨
                    </motion.span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Score & Progression Summary Box */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white/85 dark:bg-slate-800/85 backdrop-blur-md rounded-2xl p-3.5 border-2 border-pink-200 dark:border-indigo-800 shadow-md my-4 flex flex-col gap-1.5"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>Score Achieved</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-black">
              <CheckCircle2 size={13} /> Target Cleared
            </span>
          </div>

          <div className="font-black text-3xl text-rose-600 dark:text-pink-400 tracking-tight">
            {score.toLocaleString()}
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-100 dark:border-slate-700">
            <span className="flex items-center gap-1">
              <Trophy size={13} className="text-amber-500" />
              <span>Target: {levelConfig.targetScore.toLocaleString()}</span>
            </span>
            <span className="text-pink-600 dark:text-pink-300 font-black">
              +{stars * 50} Gold Coins
            </span>
          </div>
        </motion.div>

        {/* Interactive Action Buttons */}
        <div className="flex flex-col gap-2.5 mt-2">
          {/* Primary NEXT LEVEL Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNextLevel(nextLevelId)}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 hover:brightness-110 border-b-4 border-emerald-800 text-white font-black text-xl uppercase tracking-wider rounded-2xl shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:border-b-0 active:translate-y-1"
          >
            <span>{isLastLevel ? 'REPLAY SAGA' : `NEXT LEVEL (${nextLevelId})`}</span>
            <ArrowRight size={22} strokeWidth={3} />
          </motion.button>

          {/* Secondary Actions: Replay Level & Return to Map */}
          <div className="flex items-center gap-2">
            <button
              onClick={onReplayLevel}
              className="flex-1 py-2.5 bg-white/80 dark:bg-slate-800 hover:bg-white text-slate-700 dark:text-slate-200 font-black text-xs uppercase tracking-wide rounded-xl border border-pink-200 dark:border-slate-700 shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Replay</span>
            </button>

            <button
              onClick={onBackToMap}
              className="flex-1 py-2.5 bg-white/80 dark:bg-slate-800 hover:bg-white text-pink-600 dark:text-pink-300 font-black text-xs uppercase tracking-wide rounded-xl border border-pink-200 dark:border-slate-700 shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Map size={14} />
              <span>Saga Map</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
