'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { CandySvg } from '@/components/game/candy-svgs';
import { preloadGameAssets, PreloadProgress } from '@/lib/asset-loader';

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState<number>(0);
  const [stageLabel, setStageLabel] = useState<string>('Initializing Engine...');

  useEffect(() => {
    let isMounted = true;

    async function loadAssets() {
      try {
        await preloadGameAssets((p: PreloadProgress) => {
          if (!isMounted) return;
          setProgress(p.percentage);
          setStageLabel(p.stage);
        });

        // Ensure smooth visual completion before fading out
        if (isMounted) {
          setProgress(100);
          setStageLabel('All Assets Cached & Ready!');
          setTimeout(() => {
            if (isMounted) setIsVisible(false);
          }, 450);
        }
      } catch {
        // Safe fallback in case of errors
        if (isMounted) {
          setIsVisible(false);
        }
      }
    }

    loadAssets();

    // Fallback safety timer so the screen never gets permanently stuck
    const safetyTimer = setTimeout(() => {
      if (isMounted) setIsVisible(false);
    }, 4000);

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center select-none"
          style={{
            background: 'radial-gradient(circle at center, #BAE6FD 0%, #FBCFE8 50%, #E0D4FD 100%)',
          }}
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', duration: 1.0, bounce: 0.35 }}
            className="flex flex-col items-center max-w-sm px-6 w-full"
          >
            {/* 3D Color Bomb Mascot */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white/60 border-4 border-white/80 rounded-[2.25rem] flex items-center justify-center shadow-2xl mb-5 relative overflow-hidden backdrop-blur-md">
              <CandySvg color="rainbow" special="color-bomb" size={76} />
            </div>

            <motion.h1
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight text-center"
            >
              Candy <span className="bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">Ultra</span>
            </motion.h1>

            <motion.p
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="text-pink-900 mt-2 font-black tracking-[0.2em] uppercase text-[11px] sm:text-xs bg-white/70 px-3.5 py-1 rounded-full border border-pink-200 shadow-sm"
            >
              The Next Evolution of Match-3
            </motion.p>

            {/* Asset Preload Progress Bar */}
            <div className="w-full mt-8 flex flex-col items-center">
              <div className="w-full bg-white/40 border border-white/70 h-3 rounded-full overflow-hidden p-0.5 shadow-inner backdrop-blur-sm">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut', duration: 0.2 }}
                />
              </div>

              <div className="w-full flex justify-between items-center mt-2.5 px-1">
                <span className="text-[11px] font-semibold text-slate-700 truncate max-w-[200px]">
                  {stageLabel}
                </span>
                <span className="text-[11px] font-bold text-pink-700 tabular-nums">
                  {progress}%
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
