'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Gift, Sparkles, X, Award, Flame } from 'lucide-react';
import { sound } from '@/lib/audio';
import { haptics } from '@/lib/haptics';

interface Task {
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
      title: 'Berry Burst',
      description: 'Crush 50 Red Jelly Beans',
      current: 42,
      target: 50,
      rewardCoins: 100,
      rewardType: '100 Gold + 1 Color Bomb',
      claimed: false,
      color: 'pink',
    },
    {
      id: 'task-2',
      title: 'Cosmic Connector',
      description: 'Connect 5 Color Bombs ("Bolls")',
      current: 3,
      target: 5,
      rewardCoins: 150,
      rewardType: '150 Gold + 1 Hammer',
      claimed: false,
      color: 'purple',
    },
    {
      id: 'task-3',
      title: 'Star Collector',
      description: 'Earn 3 Stars on 3 Different Levels',
      current: 3,
      target: 3,
      rewardCoins: 200,
      rewardType: '200 Gold + 2 Switches',
      claimed: false,
      color: 'teal',
    },
    {
      id: 'task-4',
      title: 'Daily Sweet Login',
      description: 'Log in and play today',
      current: 1,
      target: 1,
      rewardCoins: 50,
      rewardType: '50 Gold',
      claimed: false,
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

  const colorStyles = {
    pink: 'bg-[#FBCFE8] text-pink-950 border-pink-300 shadow-pink-200/50',
    purple: 'bg-[#E0D4FD] text-purple-950 border-purple-300 shadow-purple-200/50',
    blue: 'bg-[#BAE6FD] text-sky-950 border-sky-300 shadow-sky-200/50',
    teal: 'bg-[#99F6E4] text-teal-950 border-teal-300 shadow-teal-200/50',
    yellow: 'bg-[#FEF08A] text-amber-950 border-yellow-300 shadow-yellow-200/50',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="w-full max-w-md bg-white/95 dark:bg-slate-900/95 rounded-[2.5rem] border-6 border-pink-300 dark:border-indigo-600 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={() => {
            haptics.touch();
            onClose();
          }}
          className="absolute top-5 right-5 w-9 h-9 bg-pink-100 dark:bg-slate-800 text-pink-800 dark:text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-black text-xs uppercase tracking-widest px-4 py-1 rounded-full shadow-md mb-2">
            <Sparkles size={14} />
            Daily Sticky Notes & Tasks
          </div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            Sweet Challenges
          </h2>
        </div>

        {/* Sticky Notes Grid */}
        <div className="flex flex-col gap-4">
          {tasks.map((task, idx) => {
            const isComplete = task.current >= task.target;
            const progressPercent = Math.min(100, Math.round((task.current / task.target) * 100));

            return (
              <motion.div
                key={task.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.08 }}
                className={`p-4 rounded-2xl border-2 shadow-lg relative transform ${
                  idx % 2 === 0 ? 'rotate-[-1deg]' : 'rotate-[1deg]'
                } ${colorStyles[task.color]}`}
              >
                {/* Washi Tape / Push Pin decoration */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-3.5 bg-white/70 backdrop-blur-xs rounded-xs transform -rotate-2 border border-black/10" />

                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-black text-lg tracking-tight">{task.title}</h4>
                    <p className="text-xs font-bold opacity-80">{task.description}</p>
                  </div>
                  <div className="bg-black/10 px-2 py-0.5 rounded-full font-black text-xs">
                    {task.current}/{task.target}
                  </div>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full h-3 bg-black/10 rounded-full overflow-hidden mb-3 p-0.5">
                  <div
                    className="h-full bg-black/40 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Reward & Claim Button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-black">
                    <Gift size={15} />
                    <span>{task.rewardType}</span>
                  </div>

                  {task.claimed ? (
                    <span className="text-xs font-black text-green-700 flex items-center gap-1">
                      <CheckCircle2 size={16} /> Claimed
                    </span>
                  ) : isComplete ? (
                    <button
                      onClick={() => handleClaim(task.id, task.rewardCoins)}
                      className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md hover:scale-105 active:scale-95 transition-transform"
                    >
                      CLAIM
                    </button>
                  ) : (
                    <span className="text-xs font-bold opacity-60">In Progress</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
