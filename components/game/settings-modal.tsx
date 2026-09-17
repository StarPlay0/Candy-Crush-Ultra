'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Volume2, VolumeX, Moon, Sun, HelpCircle, Smartphone, Sparkles, Zap, Flame, Maximize2, Minimize2, ShieldAlert, Monitor } from 'lucide-react';
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
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const updateFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', updateFs);
    return () => document.removeEventListener('fullscreenchange', updateFs);
  }, []);

  if (!isOpen) return null;

  const toggleFullscreen = () => {
    sound.playClick();
    haptics.touch();
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

          {/* Fullscreen / Hide Browser Bar Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-blue-50 dark:bg-slate-800/80 rounded-2xl border border-blue-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center">
                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </div>
              <div>
                <h4 className="font-black text-slate-800 dark:text-white text-sm">Immersive Fullscreen</h4>
                <p className="text-xs text-slate-500">Hide URL &amp; Navigation Bars</p>
              </div>
            </div>
            <button
              onClick={toggleFullscreen}
              className={`px-4 py-1.5 rounded-xl font-black text-xs uppercase cursor-pointer ${
                isFullscreen ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-700'
              }`}
            >
              {isFullscreen ? 'ACTIVE' : 'ENTER'}
            </button>
          </div>
        </div>

        {/* APK / Android URL Bar Removal Guide */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-950 p-4 rounded-2xl border-2 border-blue-200 dark:border-blue-900 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Monitor size={18} className="text-blue-600 dark:text-blue-400" />
            <h4 className="font-black text-sm text-blue-950 dark:text-blue-200 uppercase tracking-wide">
              How to Remove URL Bar in APK
            </h4>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 mb-2 leading-relaxed">
            The top bar with <code className="bg-white/80 dark:bg-slate-900 px-1 py-0.5 rounded font-mono text-[11px]">[X] domain [Share] [:]</code> is Android&apos;s Chrome Custom Tab. To eliminate it:
          </p>
          <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <div className="bg-white/90 dark:bg-slate-900/90 p-2.5 rounded-xl border border-blue-100 dark:border-slate-700">
              <span className="font-bold text-blue-700 dark:text-blue-300">1. WebToAPK Converter Setting:</span> In your web-to-apk converter, change Browser Type from <em>&quot;Custom Tab&quot;</em> to <strong className="underline text-indigo-600 dark:text-indigo-300">Full Screen WebView</strong> and toggle <strong>&quot;Show Action Bar / Toolbar&quot; OFF</strong>.
            </div>
            <div className="bg-white/90 dark:bg-slate-900/90 p-2.5 rounded-xl border border-blue-100 dark:border-slate-700">
              <span className="font-bold text-blue-700 dark:text-blue-300">2. PWABuilder / TWA:</span> If using PWABuilder, the SHA-256 signature in <code className="text-pink-600 font-mono">assetlinks.json</code> must match your APK certificate.
            </div>
            <div className="bg-white/90 dark:bg-slate-900/90 p-2.5 rounded-xl border border-blue-100 dark:border-slate-700">
              <span className="font-bold text-blue-700 dark:text-blue-300">3. Quick One-Tap:</span> Tap the purple ⛶ Fullscreen icon on top of the Saga Map to instantly collapse the URL bar.
            </div>
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
