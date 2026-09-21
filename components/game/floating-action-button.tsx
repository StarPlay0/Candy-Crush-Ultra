'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Map as MapIcon, 
  Gamepad2, 
  ShoppingCart, 
  Moon, 
  Sun, 
  Settings, 
  X, 
  ClipboardList,
  Volume2,
  VolumeX
} from 'lucide-react';
import { sound } from '@/lib/audio';
import { haptics } from '@/lib/haptics';

interface FloatingActionButtonProps {
  currentView: 'splash' | 'map' | 'game';
  onNavigate: (view: 'splash' | 'map' | 'game') => void;
  onOpenTasks: () => void;
  onOpenShop: () => void;
  onOpenSettings: () => void;
  isDark: boolean;
  onToggleDarkMode: () => void;
  unreadTasksCount?: number;
}

export function FloatingActionButton({
  currentView,
  onNavigate,
  onOpenTasks,
  onOpenShop,
  onOpenSettings,
  isDark,
  onToggleDarkMode,
  unreadTasksCount = 1,
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    sound.playClick();
    haptics.touch();
    setIsOpen(!isOpen);
  };

  const handleAction = (action: () => void) => {
    sound.playPop(1.2);
    haptics.touch();
    action();
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 pointer-events-auto select-none">
      {/* Backdrop overlay when menu is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40"
          />
        )}
      </AnimatePresence>

      {/* Floating Action Menu Items */}
      <div className="relative z-50 flex flex-col items-end gap-2.5">
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.9 }}
              transition={{ duration: 0.2, staggerChildren: 0.05 }}
              className="flex flex-col items-end gap-2.5 mb-1"
            >
              {/* Item 1: Sticky Notes Tasks / Daily Quests */}
              <motion.button
                whileHover={{ scale: 1.05, x: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAction(onOpenTasks)}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-slate-800/95 text-slate-800 dark:text-white shadow-lg border border-purple-200 dark:border-purple-800/50 backdrop-blur-md cursor-pointer group"
              >
                <span className="text-xs font-black tracking-wide text-purple-700 dark:text-purple-300">
                  Sticky Tasks
                </span>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-400 to-pink-400 text-white flex items-center justify-center shadow-md relative">
                  <ClipboardList size={18} />
                  {unreadTasksCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 border-2 border-white rounded-full animate-ping" />
                  )}
                </div>
              </motion.button>

              {/* Item 2: Saga Map View */}
              {currentView !== 'map' && (
                <motion.button
                  whileHover={{ scale: 1.05, x: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAction(() => onNavigate('map'))}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-slate-800/95 text-slate-800 dark:text-white shadow-lg border border-sky-200 dark:border-sky-800/50 backdrop-blur-md cursor-pointer group"
                >
                  <span className="text-xs font-black tracking-wide text-sky-700 dark:text-sky-300">
                    Saga Map
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-400 to-teal-400 text-white flex items-center justify-center shadow-md">
                    <MapIcon size={18} />
                  </div>
                </motion.button>
              )}

              {/* Item 3: In-Game Board */}
              {currentView !== 'game' && (
                <motion.button
                  whileHover={{ scale: 1.05, x: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAction(() => onNavigate('game'))}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-slate-800/95 text-slate-800 dark:text-white shadow-lg border border-pink-200 dark:border-pink-800/50 backdrop-blur-md cursor-pointer group"
                >
                  <span className="text-xs font-black tracking-wide text-pink-700 dark:text-pink-300">
                    Play Match-3
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-400 to-rose-400 text-white flex items-center justify-center shadow-md">
                    <Gamepad2 size={18} />
                  </div>
                </motion.button>
              )}

              {/* Item 4: Booster Shop */}
              <motion.button
                whileHover={{ scale: 1.05, x: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAction(onOpenShop)}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-slate-800/95 text-slate-800 dark:text-white shadow-lg border border-teal-200 dark:border-teal-800/50 backdrop-blur-md cursor-pointer group"
              >
                <span className="text-xs font-black tracking-wide text-teal-700 dark:text-teal-300">
                  Sweet Shop
                </span>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-400 to-emerald-400 text-white flex items-center justify-center shadow-md">
                  <ShoppingCart size={18} />
                </div>
              </motion.button>

              {/* Item 5: Dark Mode Toggle */}
              <motion.button
                whileHover={{ scale: 1.05, x: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  sound.playClick();
                  haptics.touch();
                  onToggleDarkMode();
                }}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-slate-800/95 text-slate-800 dark:text-white shadow-lg border border-indigo-200 dark:border-indigo-800/50 backdrop-blur-md cursor-pointer group"
              >
                <span className="text-xs font-black tracking-wide text-indigo-700 dark:text-indigo-300">
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </span>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md">
                  {isDark ? <Sun size={18} className="text-amber-300" /> : <Moon size={18} />}
                </div>
              </motion.button>

              {/* Item 6: Settings */}
              <motion.button
                whileHover={{ scale: 1.05, x: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAction(onOpenSettings)}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-slate-800/95 text-slate-800 dark:text-white shadow-lg border border-slate-200 dark:border-slate-700 backdrop-blur-md cursor-pointer group"
              >
                <span className="text-xs font-black tracking-wide text-slate-700 dark:text-slate-300">
                  Settings
                </span>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-400 to-slate-600 text-white flex items-center justify-center shadow-md">
                  <Settings size={18} />
                </div>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Floating Action Button (FAB) */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          onClick={toggleMenu}
          aria-label="Game Menu"
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-purple-400 via-pink-400 to-teal-300 text-white border-3 border-white dark:border-purple-300 shadow-[0_10px_25px_rgba(244,114,182,0.5)] flex items-center justify-center cursor-pointer transition-all focus:outline-none"
        >
          {/* Subtle Rotating Pastel Glow Ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 via-pink-300 to-teal-300 blur-sm opacity-70 -z-10 animate-pulse" />

          {/* Icon with rotation on open */}
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            {isOpen ? (
              <X size={26} strokeWidth={2.5} className="text-white drop-shadow-md" />
            ) : (
              <Sparkles size={26} strokeWidth={2.5} className="text-white drop-shadow-md" />
            )}
          </motion.div>

          {/* Sticky Tasks unread notification badge on main FAB */}
          {!isOpen && unreadTasksCount > 0 && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 border-2 border-white rounded-full flex items-center justify-center text-[9px] font-black text-white shadow-md">
              {unreadTasksCount}
            </span>
          )}
        </motion.button>
      </div>
    </div>
  );
}
