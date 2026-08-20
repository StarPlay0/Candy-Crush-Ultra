'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  RotateCcw, Plus, Settings
} from 'lucide-react';
import { LevelConfig } from '@/lib/game-types';
import { useMatch3Engine } from '@/hooks/use-match3-engine';
import { CandySvg, ObstacleSvg } from './candy-svgs';
import { FloatingHud } from './floating-hud';
import { LevelCompleteOverlay } from './level-complete-overlay';
import { PauseModal } from './pause-modal';
import { sound } from '@/lib/audio';

interface GameBoardViewProps {
  levelConfig: LevelConfig;
  lives: number;
  coins: number;
  onBackToMap: () => void;
  onNextLevel: (nextLevelId: number) => void;
  onLevelComplete: (stars: number, score: number) => void;
  isDark?: boolean;
}

export function GameBoardView({
  levelConfig,
  lives,
  onBackToMap,
  onNextLevel,
  onLevelComplete,
  isDark = false,
}: GameBoardViewProps) {
  const {
    board,
    score,
    moves,
    isPaused,
    setIsPaused,
    selectedCell,
    activeEffects,
    scorePopups,
    objectiveProgress,
    currentStars,
    isWon,
    isGameOver,
    comboMultiplier,
    activeBooster,
    switchFirstCell,
    setActiveBooster,
    useColorBombBooster,
    addExtraMoves,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleCellClick,
    initBoard,
  } = useMatch3Engine(levelConfig, onLevelComplete);

  const [isMuted, setIsMuted] = useState(sound.isMuted);
  const [reactionText, setReactionText] = useState<string | null>(null);

  // Trigger celebratory confetti burst on win
  useEffect(() => {
    if (isWon) {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#FF1744', '#00E676', '#FFEA00', '#00B0FF', '#D500F9', '#FF9100'],
      });
      const timer = setTimeout(() => {
        setReactionText('SUGAR CRUSH!');
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isWon]);

  const toggleSound = () => {
    sound.isMuted = !sound.isMuted;
    setIsMuted(sound.isMuted);
  };

  const handleRestartFromPause = () => {
    setIsPaused(false);
    initBoard();
  };

  return (
    <div 
      className={`relative w-full h-full flex flex-col justify-between overflow-hidden select-none touch-none ${
        isDark ? 'bg-indigo-950 text-white' : 'bg-sky-100 text-slate-800'
      }`}
      style={{
        background: isDark
          ? 'radial-gradient(circle at center, #1E1B4B 0%, #0F172A 100%)'
          : 'radial-gradient(circle at center, #E0F2FE 0%, #FDF2F8 45%, #EDE9FE 100%)',
      }}
    >
      {/* Floating HUD Overlay on top of the Game Board */}
      <FloatingHud
        levelConfig={levelConfig}
        score={score}
        highScore={levelConfig.targetScore}
        moves={moves}
        objectiveProgress={objectiveProgress}
        currentStars={currentStars}
        comboMultiplier={comboMultiplier}
        lives={lives}
        isMuted={isMuted}
        onToggleSound={toggleSound}
        onPause={() => setIsPaused(true)}
        onBackToMap={onBackToMap}
        isDark={isDark}
      />

      {/* Live Reaction Sweet / Tasty / Sugar Crush Banner */}
      <AnimatePresence>
        {reactionText && (
          <motion.div
            initial={{ scale: 0.4, opacity: 0, y: 15 }}
            animate={{ scale: 1.15, opacity: 1, y: 0 }}
            exit={{ scale: 1.4, opacity: 0 }}
            className="absolute top-28 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-yellow-400 via-pink-500 to-rose-500 text-white font-black text-2xl sm:text-3xl italic tracking-tighter px-6 py-2 rounded-full border-4 border-white shadow-2xl pointer-events-none drop-shadow-lg"
          >
            {reactionText}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Game Board Grid with Framer Motion Layout Animations */}
      <main className="flex-1 flex items-center justify-center p-2 sm:p-4 relative">
        <div 
          className="relative bg-slate-900/35 dark:bg-slate-950/60 p-2.5 sm:p-3.5 rounded-3xl border-4 border-white/50 dark:border-indigo-800/40 shadow-2xl backdrop-blur-md"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Dynamic Coordinate Grid */}
          <div 
            className="grid gap-1.5 sm:gap-2 relative"
            style={{
              gridTemplateColumns: `repeat(${levelConfig.gridWidth}, minmax(0, 1fr))`,
            }}
          >
            {board.map((row, y) =>
              row.map((cell, x) => {
                const isSelected = selectedCell?.x === x && selectedCell?.y === y;
                const isSwitchTarget = switchFirstCell?.x === x && switchFirstCell?.y === y;

                return (
                  <div
                    key={`cell-${x}-${y}`}
                    onPointerDown={(e) => handlePointerDown(x, y, e)}
                    onClick={() => handleCellClick(x, y)}
                    className={`w-10 h-10 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-2xl flex items-center justify-center relative cursor-pointer select-none transition-all duration-150 ${
                      cell.jelly
                        ? 'bg-pink-400/45 border-2 border-pink-300/90 shadow-inner'
                        : 'bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10'
                    } ${
                      isSelected ? 'ring-4 ring-yellow-300 scale-105 z-20 shadow-lg' : ''
                    } ${
                      isSwitchTarget ? 'ring-4 ring-cyan-400 scale-105 z-20' : ''
                    }`}
                  >
                    {/* Obstacle Layer */}
                    {cell.obstacle !== 'none' && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center">
                        <ObstacleSvg type={cell.obstacle} size={42} />
                      </div>
                    )}

                    {/* Framer Motion Animated Candy Layer */}
                    {cell.candy && (
                      <motion.div
                        layout
                        layoutId={cell.candy.id}
                        initial={cell.candy.isNew ? { scale: 0.2, opacity: 0, y: -45 } : false}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.1, opacity: 0 }}
                        transition={{
                          type: 'spring',
                          stiffness: 420,
                          damping: 26,
                          mass: 0.7,
                        }}
                        className="w-full h-full flex items-center justify-center relative"
                      >
                        <CandySvg
                          color={cell.candy.color}
                          special={cell.candy.special}
                          size={46}
                        />

                        {/* Special Candy Ambient Aura */}
                        {cell.candy.special === 'color-bomb' && (
                          <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping pointer-events-none" />
                        )}
                      </motion.div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Floating Score Popups */}
          <AnimatePresence>
            {scorePopups.map(popup => (
              <motion.div
                key={popup.id}
                initial={{ opacity: 1, scale: 0.8, y: 0 }}
                animate={{ opacity: 0, scale: 1.25, y: -40 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{
                  left: `${(popup.x / levelConfig.gridWidth) * 100 + 5}%`,
                  top: `${(popup.y / levelConfig.gridHeight) * 100}%`,
                }}
                className="absolute z-40 pointer-events-none font-black text-sm sm:text-base text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] whitespace-nowrap"
              >
                {popup.text || `+${popup.score}`}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Special Effects Lightning / Laser SVG Overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible">
            {activeEffects.map(effect => {
              if (effect.type === 'lightning' && effect.targetX !== undefined && effect.targetY !== undefined) {
                const cellSize = 52;
                const x1 = effect.x * cellSize + 26;
                const y1 = effect.y * cellSize + 26;
                const x2 = effect.targetX * cellSize + 26;
                const y2 = effect.targetY * cellSize + 26;
                const midX = (x1 + x2) / 2 + 6;
                const midY = (y1 + y2) / 2 - 6;

                return (
                  <g key={effect.id}>
                    <path
                      d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                      fill="none"
                      stroke="#FFEB3B"
                      strokeWidth="8"
                      strokeLinecap="round"
                      opacity="0.85"
                      className="animate-pulse"
                    />
                    <path
                      d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </g>
                );
              }

              if (effect.type === 'laser-h') {
                const cellSize = 52;
                const y = effect.y * cellSize + 26;
                return (
                  <line
                    key={effect.id}
                    x1="0"
                    y1={y}
                    x2="100%"
                    y2={y}
                    stroke="#FFFFFF"
                    strokeWidth="14"
                    strokeLinecap="round"
                    className="animate-ping"
                  />
                );
              }

              if (effect.type === 'laser-v') {
                const cellSize = 52;
                const x = effect.x * cellSize + 26;
                return (
                  <line
                    key={effect.id}
                    x1={x}
                    y1="0"
                    x2={x}
                    y2="100%"
                    stroke="#FFFFFF"
                    strokeWidth="14"
                    strokeLinecap="round"
                    className="animate-ping"
                  />
                );
              }

              return null;
            })}
          </svg>
        </div>
      </main>

      {/* Bottom Boosters Action Tray */}
      <footer className="relative z-30 w-full px-3 sm:px-4 pb-3 pt-1">
        <div className="max-w-md mx-auto bg-gradient-to-r from-pink-200/95 via-rose-100/90 to-purple-200/95 dark:from-slate-900/90 dark:to-indigo-950/90 rounded-3xl border-3 border-white dark:border-slate-700 shadow-xl p-2 flex items-center justify-between gap-1.5 backdrop-blur-md">
          {/* Pause / Settings Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPaused(true)}
            className="w-11 h-11 bg-pink-500 hover:bg-pink-600 rounded-2xl border-2 border-white flex items-center justify-center text-white shadow-md transition-all cursor-pointer"
            title="Pause Game"
          >
            <Settings size={20} />
          </motion.button>

          {/* Booster 1: Free Switch Hand */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveBooster(activeBooster === 'switch' ? null : 'switch')}
            className={`flex-1 py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center relative transition-all cursor-pointer ${
              activeBooster === 'switch'
                ? 'bg-cyan-500 text-white ring-2 ring-white scale-105 shadow-md'
                : 'bg-white/80 dark:bg-slate-800/80 hover:bg-white text-slate-800 dark:text-white'
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center shadow-xs">
              <span className="text-sm">✋</span>
            </div>
            <span className="text-[10px] font-black mt-0.5">Switch</span>
            <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
              5
            </span>
          </motion.button>

          {/* Booster 2: Lollipop Hammer */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveBooster(activeBooster === 'hammer' ? null : 'hammer')}
            className={`flex-1 py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center relative transition-all cursor-pointer ${
              activeBooster === 'hammer'
                ? 'bg-pink-500 text-white ring-2 ring-white scale-105 shadow-md'
                : 'bg-white/80 dark:bg-slate-800/80 hover:bg-white text-slate-800 dark:text-white'
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center shadow-xs">
              <span className="text-sm">🔨</span>
            </div>
            <span className="text-[10px] font-black mt-0.5">Hammer</span>
            <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
              5
            </span>
          </motion.button>

          {/* Booster 3: Color Bomb ("Boll") Booster */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={useColorBombBooster}
            className="flex-1 py-1.5 px-1 rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-white text-slate-800 dark:text-white flex flex-col items-center justify-center relative transition-all cursor-pointer"
          >
            <div className="w-7 h-7 flex items-center justify-center">
              <CandySvg color="rainbow" special="color-bomb" size={24} />
            </div>
            <span className="text-[10px] font-black mt-0.5">Bomb</span>
            <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
              5
            </span>
          </motion.button>

          {/* Booster 4: +5 Extra Moves */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addExtraMoves}
            className="flex-1 py-1.5 px-1 rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-white text-slate-800 dark:text-white flex flex-col items-center justify-center relative transition-all cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center font-black text-xs text-amber-700 dark:text-amber-300 shadow-xs">
              +5
            </div>
            <span className="text-[10px] font-black mt-0.5">Moves</span>
            <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
              5
            </span>
          </motion.button>
        </div>
      </footer>

      {/* Pause Modal */}
      <AnimatePresence>
        {isPaused && (
          <PauseModal
            isOpen={isPaused}
            levelConfig={levelConfig}
            score={score}
            moves={moves}
            isMuted={isMuted}
            onResume={() => setIsPaused(false)}
            onRestart={handleRestartFromPause}
            onBackToMap={onBackToMap}
            onToggleSound={toggleSound}
            isDark={isDark}
          />
        )}
      </AnimatePresence>

      {/* High-End Level Complete Overlay with Framer Motion Confetti Animation */}
      <AnimatePresence>
        {isWon && (
          <LevelCompleteOverlay
            levelConfig={levelConfig}
            score={score}
            stars={currentStars || 1}
            onNextLevel={onNextLevel}
            onReplayLevel={initBoard}
            onBackToMap={onBackToMap}
            isDark={isDark}
          />
        )}
      </AnimatePresence>

      {/* Out of Moves Modal */}
      <AnimatePresence>
        {isGameOver && !isWon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm bg-gradient-to-b from-rose-100 to-pink-200 dark:from-slate-900 dark:to-indigo-950 rounded-[2.5rem] border-6 border-pink-400 shadow-2xl p-6 text-center"
            >
              <h3 className="text-3xl font-black text-rose-950 dark:text-white tracking-tight mb-2">
                Out of Moves!
              </h3>
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-5">
                Don&apos;t give up! Add +5 moves or retry the level.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={addExtraMoves}
                  className="w-full py-3.5 bg-gradient-to-b from-amber-400 to-yellow-500 border-b-4 border-amber-700 text-amber-950 font-black text-xl uppercase rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:brightness-105 active:border-b-0 active:translate-y-1 cursor-pointer"
                >
                  <Plus size={22} strokeWidth={3} />
                  +5 MOVES (FREE)
                </button>

                <button
                  onClick={initBoard}
                  className="w-full py-3 bg-gradient-to-b from-pink-500 to-rose-600 border-b-4 border-rose-800 text-white font-black text-lg uppercase rounded-2xl shadow-lg hover:brightness-105 active:border-b-0 active:translate-y-1 cursor-pointer"
                >
                  <RotateCcw size={18} className="inline mr-2" />
                  Retry Level
                </button>

                <button
                  onClick={onBackToMap}
                  className="w-full py-2 text-slate-500 dark:text-slate-400 font-bold text-sm hover:text-slate-800 dark:hover:text-white cursor-pointer"
                >
                  Back to Map
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
