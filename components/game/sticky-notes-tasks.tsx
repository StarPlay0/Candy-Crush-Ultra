'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Gift, Sparkles, X, Award, Flame, Star, Coins, Zap } from 'lucide-react';
import { sound } from '@/lib/audio';
import { haptics } from '@/lib/haptics';

export interface Task {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  rewardCoins: number;
  rewardType: string;
  claimed: boolean;
  color: 'pink' | 'purple' | 'blue' | 'teal' | 'yellow';
}

interface StickyNotesTasksProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimReward: (coins: number) => void;
  isDark?: boolean;
}

export function StickyNotesTasks({
  isOpen,
  onClose,
  onClaimReward,
  isDark = false,
}: StickyNotesTasksProps) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'task-1',
      title: 'Pink Berry Burst',
      description: 'Match & clear 40 sweet pink candies',
      current: 40,
      target: 40,
      rewardCoins: 120,
      rewardType: '120 Coins + 1 Color Bomb',
      claimed: false,
      color: 'pink',
    },
    {
      id: 'task-2',
      title: 'Lavender Swirls',
      description: 'Trigger 4 special candy combos',
      current: 3,
      target: 4,
      rewardCoins: 150,
      rewardType: '150 Coins + 1 Lollipop Hammer',
      claimed: false,
      color: 'purple',
    },
    {
      id: 'task-3',
      title: 'Teal Frosting Rush',
      description: 'Score 12,000 points in any level',
      current: 12000,
      target: 12000,
      rewardCoins: 200,
      rewardType: '200 Coins + 2 Free Swaps',
      claimed: false,
      color: 'teal',
    },
    {
      id: 'task-4',
      title: 'Sky Blue Cascade',
      description: 'Reach a 3-step chain reaction',
      current: 3,
      target: 3,
      rewardCoins: 100,
      rewardType: '100 Coins + Free Lives',
      claimed: false,
      color: 'blue',
    },
    {
      id: 'task-5',
      title: 'Daily Sweet Login',
      description: 'Log in today to claim your daily gift',
      current: 1,
      target: 1,
      rewardCoins: 80,
      rewardType: '80 Gold Coins',
      claimed: true,
      color: 'yellow',
    },
  ]);

  const handleClaim = (taskId: string, coins: number) => {
    sound.playLevelWin();
    haptics.special();
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, claimed: true } : t))
    );
    onClaimReward(coins);
  };

  if (!isOpen) return null;

  // Soft Pastel Card Palettes matching the requested theme
  const pastelStyles = {
    pink: {
      card: isDark 
        ? 'bg-gradient-to-br from-pink-950/80 via-rose-900/60 to-purple-950/80 border-pink-500/40 text-pink-100 shadow-pink-900/30' 
        : 'bg-gradient-to-br from-[#FDE2E4] to-[#FBCFE8] border-[#F472B6]/40 text-pink-950 shadow-pink-200/50',
      badge: isDark ? 'bg-pink-500/20 text-pink-300' : 'bg-pink-300/50 text-pink-900',
      bar: isDark ? 'from-pink-500 to-rose-400' : 'from-pink-400 to-rose-500',
      tape: 'bg-pink-200/80 dark:bg-pink-700/60',
      accent: 'text-pink-600 dark:text-pink-300',
    },
    purple: {
      card: isDark 
        ? 'bg-gradient-to-br from-purple-950/80 via-indigo-900/60 to-purple-950/80 border-purple-500/40 text-purple-100 shadow-purple-900/30' 
        : 'bg-gradient-to-br from-[#E2ECE9] to-[#E0D4FD] border-[#C084FC]/40 text-purple-950 shadow-purple-200/50',
      badge: isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-300/50 text-purple-900',
      bar: isDark ? 'from-purple-500 to-fuchsia-400' : 'from-purple-400 to-indigo-500',
      tape: 'bg-purple-200/80 dark:bg-purple-700/60',
      accent: 'text-purple-600 dark:text-purple-300',
    },
    blue: {
      card: isDark 
        ? 'bg-gradient-to-br from-sky-950/80 via-blue-900/60 to-indigo-950/80 border-sky-500/40 text-sky-100 shadow-sky-900/30' 
        : 'bg-gradient-to-br from-[#E0F2FE] to-[#BAE6FD] border-[#7DD3FC]/40 text-sky-950 shadow-sky-200/50',
      badge: isDark ? 'bg-sky-500/20 text-sky-300' : 'bg-sky-300/50 text-sky-900',
      bar: isDark ? 'from-sky-500 to-blue-400' : 'from-sky-400 to-blue-500',
      tape: 'bg-sky-200/80 dark:bg-sky-700/60',
      accent: 'text-sky-600 dark:text-sky-300',
    },
    teal: {
      card: isDark 
        ? 'bg-gradient-to-br from-teal-950/80 via-emerald-900/60 to-cyan-950/80 border-teal-500/40 text-teal-100 shadow-teal-900/30' 
        : 'bg-gradient-to-br from-[#CCFBF1] to-[#99F6E4] border-[#2DD4BF]/40 text-teal-950 shadow-teal-200/50',
      badge: isDark ? 'bg-teal-500/20 text-teal-300' : 'bg-teal-300/50 text-teal-900',
      bar: isDark ? 'from-teal-500 to-cyan-400' : 'from-teal-400 to-emerald-500',
      tape: 'bg-teal-200/80 dark:bg-teal-700/60',
      accent: 'text-teal-600 dark:text-teal-300',
    },
    yellow: {
      card: isDark 
        ? 'bg-gradient-to-br from-amber-950/80 via-yellow-900/60 to-orange-950/80 border-amber-500/40 text-amber-100 shadow-amber-900/30' 
        : 'bg-gradient-to-br from-[#FEF9C3] to-[#FEF08A] border-[#FACC15]/40 text-amber-950 shadow-amber-200/50',
      badge: isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-300/50 text-amber-900',
      bar: isDark ? 'from-amber-500 to-yellow-400' : 'from-amber-400 to-yellow-500',
      tape: 'bg-amber-200/80 dark:bg-amber-700/60',
      accent: 'text-amber-600 dark:text-amber-300',
    },
  };

  const totalCompleted = tasks.filter(t => t.current >= t.target).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={`w-full max-w-lg ${
          isDark 
            ? 'bg-slate-900/95 border-purple-500/40 text-white shadow-[0_20px_50px_rgba(0,0,0,0.8)]' 
            : 'bg-white/95 border-pink-200 text-slate-800 shadow-[0_20px_50px_rgba(244,114,182,0.25)]'
        } rounded-[2.5rem] border-3 p-5 sm:p-7 relative max-h-[90vh] overflow-y-auto flex flex-col backdrop-blur-xl`}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            haptics.touch();
            onClose();
          }}
          className="absolute top-5 right-5 w-9 h-9 bg-pink-100 dark:bg-slate-800 text-pink-700 dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-slate-700 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm"
          aria-label="Close Tasks"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        {/* Header Ribbon */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-400 via-pink-400 to-teal-400 text-white font-black text-[11px] uppercase tracking-widest px-4 py-1 rounded-full shadow-sm mb-2">
            <Sparkles size={13} className="text-yellow-200" />
            Sticky Notes Daily Quests
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center justify-center gap-2">
            <span>Sweet Milestones</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-300 border border-pink-300/60 font-bold">
              {totalCompleted}/{tasks.length} Done
            </span>
          </h2>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            Complete sticky tasks to unlock bonus boosters and free coins!
          </p>
        </div>

        {/* Sticky Notes Cards Grid */}
        <div className="flex flex-col gap-3.5 my-1">
          {tasks.map((task, idx) => {
            const isComplete = task.current >= task.target;
            const progressPercent = Math.min(100, Math.round((task.current / task.target) * 100));
            const style = pastelStyles[task.color];
            const tilt = idx % 2 === 0 ? '-rotate-[0.6deg]' : 'rotate-[0.6deg]';

            return (
              <motion.div
                key={task.id}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-4 rounded-2xl border-2 shadow-md relative transform ${tilt} ${style.card} transition-transform hover:scale-[1.01] hover:rotate-0`}
              >
                {/* Pastel Washi Tape accent at top center */}
                <div 
                  className={`absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-3.5 ${style.tape} rounded-xs transform -rotate-1 shadow-xs border border-white/40 pointer-events-none`} 
                />

                {/* Card Title & Progress Pill */}
                <div className="flex justify-between items-start mb-2">
                  <div className="pr-2">
                    <h4 className="font-black text-base tracking-tight flex items-center gap-1.5">
                      {task.title}
                      {task.claimed && (
                        <span className="text-[10px] bg-emerald-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                          Done
                        </span>
                      )}
                    </h4>
                    <p className="text-xs font-semibold opacity-85 mt-0.5">
                      {task.description}
                    </p>
                  </div>

                  <div className={`px-2.5 py-0.5 rounded-full font-black text-xs ${style.badge} shadow-xs shrink-0`}>
                    {task.current}/{task.target}
                  </div>
                </div>

                {/* Animated Gradient Progress Bar with Striped Glow */}
                <div className="w-full h-3 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden mb-3 p-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className={`h-full bg-gradient-to-r ${style.bar} rounded-full relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-white/20 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:12px_12px]" />
                  </motion.div>
                </div>

                {/* Bottom Reward Row & Claim Action */}
                <div className="flex items-center justify-between gap-2 pt-0.5 border-t border-black/5 dark:border-white/10">
                  <div className="flex items-center gap-1.5 text-xs font-black">
                    <Gift size={15} className={style.accent} />
                    <span>{task.rewardType}</span>
                  </div>

                  {task.claimed ? (
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={16} /> Claimed
                    </span>
                  ) : isComplete ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleClaim(task.id, task.rewardCoins)}
                      className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer flex items-center gap-1 animate-pulse"
                    >
                      <Coins size={14} className="text-yellow-200" />
                      Claim {task.rewardCoins}
                    </motion.button>
                  ) : (
                    <span className="text-xs font-bold opacity-60 flex items-center gap-1">
                      <Zap size={13} /> In Progress
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-[11px] font-semibold text-slate-400">
            Quests reset every 24 hours. Keep matching to collect free rewards!
          </p>
        </div>
      </motion.div>
    </div>
  );
}
