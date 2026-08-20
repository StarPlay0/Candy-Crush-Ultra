'use client';

import React from 'react';
import { motion } from 'motion/react';
import { X, Volume2, VolumeX, Moon, Sun, RotateCcw, HelpCircle, Sparkles } from 'lucide-react';
import { CandySvg } from './candy-svgs';
import { sound } from '@/lib/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onToggleDarkMode: () => void;
  onResetProgress: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  isDark,
  onToggleDarkMode,
  onResetProgress,
}: SettingsModalProps) {
  const [isMuted, setIsMuted] = React.useState(sound.isMuted);

  if (!isOpen) return null;

  const toggleAudio = () => {
    sound.isMuted = !sound.isMuted;
    setIsMuted(sound.isMuted);
    sound.playClick();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="w-full max-w-md bg-white/95 dark:bg-slate-900/95 rounded-[2.5rem] border-6 border-pink-300 dark:border-indigo-600 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 bg-pink-100 dark:bg-slate-800 text-pink-800 dark:text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xs uppercase tracking-widest px-4 py-1 rounded-full shadow-md mb-2">
            Game Options
          </div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            Settings & Guide
          </h2>
        </div>

        {/* Toggles */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex items-center justify-between p-3.5 bg-pink-50 dark:bg-slate-800/80 rounded-2xl border border-pink-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-500 text-white rounded-xl flex items-center justify-center">
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </div>
              <div>
                <h4 className="font-black text-slate-800 dark:text-white text-sm">Sound Effects</h4>
                <p className="text-xs text-slate-500">Chimes, Zaps, and Fanfare</p>
              </div>
            </div>
            <button
              onClick={toggleAudio}
              className={`px-4 py-1.5 rounded-xl font-black text-xs uppercase ${
                !isMuted ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-700'
              }`}
            >
              {!isMuted ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-purple-50 dark:bg-slate-800/80 rounded-2xl border border-purple-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 text-white rounded-xl flex items-center justify-center">
                {isDark ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div>
                <h4 className="font-black text-slate-800 dark:text-white text-sm">Dark Theme</h4>
                <p className="text-xs text-slate-500">Soft Pastel / Royal Night</p>
              </div>
            </div>
            <button
              onClick={onToggleDarkMode}
              className={`px-4 py-1.5 rounded-xl font-black text-xs uppercase ${
                isDark ? 'bg-purple-600 text-white' : 'bg-slate-300 text-slate-700'
              }`}
            >
              {isDark ? 'NIGHT' : 'DAY'}
            </button>
          </div>
        </div>

        {/* How to Connect Color Bombs & Special Candies Guide */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-indigo-950 p-4 rounded-2xl border-2 border-amber-200 dark:border-indigo-800 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle size={18} className="text-amber-600 dark:text-amber-400" />
            <h4 className="font-black text-sm text-amber-950 dark:text-amber-200 uppercase tracking-wide">
              Special Combos & Color Bombs
            </h4>
          </div>

          <div className="flex flex-col gap-2.5 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                <CandySvg color="rainbow" special="color-bomb" size={28} />
              </div>
              <div>
                <span className="font-black text-slate-900 dark:text-white">Color Bomb (&quot;Boll&quot;) Swap:</span>{' '}
                Swap with ANY candy to zap ALL candies of that color with lightning beams!
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center font-black text-xs bg-pink-200 rounded-lg text-pink-900">
                4-LINE
              </div>
              <div>
                <span className="font-black text-slate-900 dark:text-white">Striped Candies:</span> Match 4 in a line. Detonates a full laser beam across the row or column!
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center font-black text-xs bg-purple-200 rounded-lg text-purple-900">
                L / T
              </div>
              <div>
                <span className="font-black text-slate-900 dark:text-white">Wrapped Candies:</span> Match 5 in an L or T shape. Creates a massive 3x3 double explosion!
              </div>
            </div>
          </div>
        </div>

        {/* Reset Progress */}
        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset your level progress?')) {
              onResetProgress();
              onClose();
            }
          }}
          className="w-full py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 font-black text-xs uppercase tracking-wider rounded-xl transition-colors"
        >
          Reset Game Progress
        </button>
      </motion.div>
    </div>
  );
}
