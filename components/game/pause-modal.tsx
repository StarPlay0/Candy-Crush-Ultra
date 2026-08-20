'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Play, RotateCcw, Map, Volume2, VolumeX, Pause, Sparkles } from 'lucide-react';
import { LevelConfig } from '@/lib/game-types';

interface PauseModalProps {
  isOpen: boolean;
  levelConfig: LevelConfig;
  score: number;
  moves: number;
  isMuted: boolean;
  onResume: () => void;
  onRestart: () => void;
  onBackToMap: () => void;
  onToggleSound: () => void;
  isDark?: boolean;
}

export function PauseModal({
  isOpen,
  levelConfig,
  score,
  moves,
  isMuted,
  onResume,
  onRestart,
  onBackToMap,
  onToggleSound,
  isDark = false,
}: PauseModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className={`w-full max-w-sm rounded-[2.5rem] border-6 ${
          isDark
            ? 'bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 border-indigo-500/80 text-white'
            : 'bg-gradient-to-b from-pink-100 via-white to-pink-50 border-pink-400 text-slate-800'
        } shadow-2xl p-6 text-center relative overflow-hidden`}
      >
        {/* Decorative Top Pill */}
        <div className="inline-flex items-center gap-1.5 bg-pink-600 text-white font-black text-xs uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md mb-2">
          <Pause size={14} fill="currentColor" />
          <span>Game Suspended</span>
        </div>

        {/* Title */}
        <h3 className="text-3xl font-black text-slate-900 dark:text-white italic tracking-tight mb-1">
          PAUSED
        </h3>
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-4">
          Level {levelConfig.id}: {levelConfig.name}
        </p>

        {/* Current Stats Snapshot */}
        <div className="grid grid-cols-2 gap-2 bg-pink-50/80 dark:bg-slate-800/80 rounded-2xl p-3 border border-pink-200 dark:border-slate-700 mb-5">
          <div className="flex flex-col items-center justify-center border-r border-pink-200/80 dark:border-slate-700">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Score</span>
            <span className="font-black text-xl text-rose-600 dark:text-pink-400">
              {score.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Moves Left</span>
            <span className="font-black text-xl text-pink-600 dark:text-pink-300">
              {moves}
            </span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-col gap-2.5">
          {/* Resume Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onResume}
            className="w-full py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:brightness-110 border-b-4 border-purple-800 text-white font-black text-lg uppercase tracking-wider rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:border-b-0 active:translate-y-1"
          >
            <Play size={20} fill="currentColor" />
            <span>Resume Game</span>
          </motion.button>

          {/* Restart Level Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRestart}
            className="w-full py-3 bg-amber-400 hover:bg-amber-500 border-b-4 border-amber-600 text-amber-950 font-black text-base uppercase tracking-wider rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:border-b-0 active:translate-y-1"
          >
            <RotateCcw size={18} />
            <span>Restart Level</span>
          </motion.button>

          {/* Secondary Controls: Sound & Map */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onToggleSound}
              className="flex-1 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX size={15} className="text-rose-500" /> : <Volume2 size={15} className="text-emerald-500" />}
              <span>{isMuted ? 'Unmute Audio' : 'Sound On'}</span>
            </button>

            <button
              onClick={onBackToMap}
              className="flex-1 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Map size={15} className="text-pink-500" />
              <span>Saga Map</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
