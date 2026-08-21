'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Volume2, VolumeX, Moon, Sun, HelpCircle, Smartphone, Sparkles, Zap, Flame } from 'lucide-react';
import { CandySvg } from './candy-svgs';
import { sound } from '@/lib/audio';
import { haptics } from '@/lib/haptics';

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
  const [isMuted, setIsMuted] = useState(sound.isMuted);
  const [isHapticsEnabled, setIsHapticsEnabled] = useState(haptics.isEnabled);

  if (!isOpen) return null;

  const toggleAudio = () => {
    sound.isMuted = !sound.isMuted;
    setIsMuted(sound.isMuted);
    sound.playClick();
    haptics.touch();
  };

  const toggleHaptics = () => {
    haptics.isEnabled = !haptics.isEnabled;
    setIsHapticsEnabled(haptics.isEnabled);
    if (haptics.isEnabled) {
      haptics.match(4);
    }
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
          onClick={() => {
            haptics.touch();
            onClose();
          }}
          className="absolute top-5 right-5 w-9 h-9 bg-pink-100 dark:bg-slate-800 text-pink-800 dark:text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 cursor-pointer"
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
          {/* Sound Toggle */}
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
              className={`px-4 py-1.5 rounded-xl font-black text-xs uppercase cursor-pointer ${
                !isMuted ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-700'
              }`}
            >
              {!isMuted ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Vibration API Haptics Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-emerald-50 dark:bg-slate-800/80 rounded-2xl border border-emerald-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center">
                <Smartphone size={20} />
              </div>
              <div>
                <h4 className="font-black text-slate-800 dark:text-white text-sm">Vibration Haptics</h4>
                <p className="text-xs text-slate-500">Physical Touch Feedback</p>
              </div>
            </div>
            <button
              onClick={toggleHaptics}
              className={`px-4 py-1.5 rounded-xl font-black text-xs uppercase cursor-pointer ${
                isHapticsEnabled ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-700'
              }`}
            >
              {isHapticsEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Dark / Light Theme Toggle */}
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
              onClick={() => {
                haptics.touch();
                onToggleDarkMode();
              }}
              className={`px-4 py-1.5 rounded-xl font-black text-xs uppercase cursor-pointer ${
                isDark ? 'bg-purple-600 text-white' : 'bg-slate-300 text-slate-700'
              }`}
            >
              {isDark ? 'NIGHT' : 'DAY'}
            </button>
          </div>
        </div>

        {/* Trail Matching Guide */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-indigo-950 p-4 rounded-2xl border-2 border-amber-200 dark:border-indigo-800 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-amber-600 dark:text-amber-400" />
            <h4 className="font-black text-sm text-amber-950 dark:text-amber-200 uppercase tracking-wide">
              How to Play: Trail Matching
            </h4>
          </div>

          <div className="flex flex-col gap-2.5 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center font-black text-xs bg-emerald-100 rounded-lg text-emerald-800 border border-emerald-300">
                1
              </div>
              <div>
                <span className="font-black text-slate-900 dark:text-white">Touch & Drag:</span>{' '}
                Touch any candy and drag your finger across 3 or more adjacent candies of the same color (orthogonally or diagonally).
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center font-black text-xs bg-amber-100 rounded-lg text-amber-800 border border-amber-300">
                2
              </div>
              <div>
                <span className="font-black text-slate-900 dark:text-white">Release to Crush:</span>{' '}
                Release your touch to explode all connected candies with haptic feedback!
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center font-black text-xs bg-purple-100 rounded-lg text-purple-800 border border-purple-300">
                3
              </div>
              <div>
                <span className="font-black text-slate-900 dark:text-white">Backtrack to Undo:</span>{' '}
                Swipe back to the previous candy in your chain to undo mistakes before releasing.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center font-black text-xs bg-pink-100 rounded-lg text-pink-800 border border-pink-300">
                4
              </div>
              <div>
                <span className="font-black text-slate-900 dark:text-white">Craft Specials:</span>{' '}
                Connect 4-5 candies for Striped Lasers, 6 for Wrapped Bombs, or 7+ for Color Bombs!
              </div>
            </div>
          </div>
        </div>

        {/* Reset Progress */}
        <button
          onClick={() => {
            haptics.touch();
            if (confirm('Are you sure you want to reset your level progress?')) {
              onResetProgress();
              onClose();
            }
          }}
          className="w-full py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 font-black text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
        >
          Reset Game Progress
        </button>
      </motion.div>
    </div>
  );
}
