'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { CandySvg } from '@/components/game/candy-svgs';

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{
            background: 'radial-gradient(circle at center, #BAE6FD 0%, #FBCFE8 50%, #E0D4FD 100%)',
          }}
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', duration: 1.2, bounce: 0.4 }}
            className="flex flex-col items-center"
          >
            {/* 3D Color Bomb Mascot */}
            <div className="w-28 h-28 bg-white/50 border-4 border-white/80 rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-6 relative overflow-hidden backdrop-blur-md">
              <CandySvg color="rainbow" special="color-bomb" size={80} />
            </div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight"
            >
              Candy <span className="bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">Ultra</span>
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-pink-900 mt-3 font-black tracking-[0.25em] uppercase text-xs sm:text-sm bg-white/60 px-4 py-1 rounded-full border border-pink-200 shadow-sm"
            >
              The Next Evolution of Match-3
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
