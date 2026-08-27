'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  RotateCcw, Plus, Settings, Sparkles, Zap, Flame, Lightbulb
} from 'lucide-react';
import { LevelConfig, CandyColor } from '@/lib/game-types';
import { useMatch3Engine } from '@/hooks/use-match3-engine';
import { CandySvg, ObstacleSvg } from './candy-svgs';
import { FloatingHud } from './floating-hud';
import { LevelCompleteOverlay } from './level-complete-overlay';
import { PauseModal } from './pause-modal';
import { sound } from '@/lib/audio';
import { haptics } from '@/lib/haptics';

interface GameBoardViewProps {
  levelConfig: LevelConfig;
  lives: number;
  coins: number;
  onBackToMap: () => void;
  onNextLevel: (nextLevelId: number) => void;
  onLevelComplete: (stars: number, score: number) => void;
  isDark?: boolean;
}

const TRAIL_COLOR_MAP: Record<CandyColor | 'rainbow', { stroke: string; glow: string; text: string }> = {
  red: { stroke: '#EF4444', glow: '#F87171', text: 'text-red-500' },
  orange: { stroke: '#F97316', glow: '#FB923C', text: 'text-orange-500' },
  yellow: { stroke: '#EAB308', glow: '#FDE047', text: 'text-yellow-400' },
  green: { stroke: '#22C55E', glow: '#4ADE80', text: 'text-green-500' },
  blue: { stroke: '#0EA5E9', glow: '#38BDF8', text: 'text-sky-400' },
  purple: { stroke: '#A855F7', glow: '#C084FC', text: 'text-purple-400' },
  rainbow: { stroke: '#EC4899', glow: '#F472B6', text: 'text-pink-400' },
};

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
    trail,
    isDraggingTrail,
    trailColor,
    hintTrail,
    triggerHint,
    activeEffects,
    scorePopups,
    highlightedMatches,
    comboAlert,
    particles,
    shockwaves,
    lastMoveDeduction,
    objectiveProgress,
    currentStars,
    comboMultiplier,
    isWon,
    isGameOver,
    activeBooster,
    switchFirstCell,
    selectedCell,
    boardContainerRef,
    setActiveBooster,
    applyColorBombBooster,
    addExtraMoves,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    initBoard,
  } = useMatch3Engine(levelConfig, onLevelComplete);

  const [isMuted, setIsMuted] = useState(sound.isMuted);
  const [reactionText, setReactionText] = useState<string | null>(null);

  // Global Pointer Up listener to ensure no stuck pointer states
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      handlePointerUp();
    };
    window.addEventListener('pointerup', handleGlobalPointerUp);
    return () => {
      window.removeEventListener('pointerup', handleGlobalPointerUp);
    };
  }, [handlePointerUp]);

  // Trigger celebratory confetti burst and triumphant tada fanfare on win
  useEffect(() => {
    if (isWon) {
      sound.playTada();
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
    haptics.touch();
  };

  const handleRestartFromPause = () => {
    haptics.touch();
    setIsPaused(false);
    initBoard();
  };

  // Helper to generate dynamic SVG path connecting trail coordinates
  const generateTrailSvgPath = (): string => {
    if (trail.length === 0) return '';
    const width = levelConfig.gridWidth;
    const height = levelConfig.gridHeight;

    const points = trail.map(node => {
      const px = ((node.x + 0.5) / width) * 100;
      const py = ((node.y + 0.5) / height) * 100;
      return `${px}%,${py}%`;
    });

    return `M ${points.join(' L ')}`;
  };

  // Helper to generate glowing SVG path connecting hinted candy coordinates
  const generateHintSvgPath = (): string => {
    if (!hintTrail || hintTrail.length === 0) return '';
    const width = levelConfig.gridWidth;
    const height = levelConfig.gridHeight;

    const points = hintTrail.map(node => {
      const px = ((node.x + 0.5) / width) * 100;
      const py = ((node.y + 0.5) / height) * 100;
      return `${px}%,${py}%`;
    });

    return `M ${points.join(' L ')}`;
  };

  const currentColorTheme = trailColor ? TRAIL_COLOR_MAP[trailColor] : TRAIL_COLOR_MAP.rainbow;
  const isTrailValidMatch = trail.length >= 3;

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
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
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
        onPause={() => {
          haptics.touch();
          setIsPaused(true);
        }}
        onBackToMap={() => {
          haptics.touch();
          onBackToMap();
        }}
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

      {/* Active Matching Trail Status Float (Appears above grid when player connects candies) */}
      <AnimatePresence>
        {isDraggingTrail && trail.length >= 2 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className={`absolute top-24 left-1/2 -translate-x-1/2 z-40 px-4 py-1.5 rounded-full border-2 border-white shadow-2xl backdrop-blur-md font-black text-xs sm:text-sm tracking-wide flex items-center gap-1.5 pointer-events-none ${
              isTrailValidMatch
                ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white animate-pulse'
                : 'bg-amber-400 text-amber-950'
            }`}
          >
            {trail.length === 2 && (
              <>
                <Sparkles size={14} />
                <span>Connect 1 more candy to match!</span>
              </>
            )}
            {trail.length === 3 && (
              <>
                <Zap size={14} className="text-yellow-200" />
                <span>3 LINKED • RELEASE TO CRUSH (+240)</span>
              </>
            )}
            {trail.length === 4 && (
              <>
                <Zap size={14} className="text-yellow-200" />
                <span>4 LINKED • STRIPED CANDY CRAFT (+400)</span>
              </>
            )}
            {trail.length === 5 && (
              <>
                <Flame size={14} className="text-amber-200" />
                <span>5 LINKED • STRIPED CANDY CRAFT (+750)</span>
              </>
            )}
            {trail.length === 6 && (
              <>
                <Flame size={14} className="text-amber-200" />
                <span>6 LINKED • WRAPPED BOMB CRAFT (+1,200)</span>
              </>
            )}
            {trail.length >= 7 && (
              <>
                <Sparkles size={14} className="text-pink-200" />
                <span>{trail.length} LINKED • COLOR BOMB CRAFT (+2,000)</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Game Board Grid */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 relative">
        {/* Floating Multiplier Badge above grid */}
        <AnimatePresence>
          {comboMultiplier > 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.4, y: -20 }}
              animate={{ opacity: 1, scale: 1.1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="mb-2 z-35 pointer-events-none px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 border-2 border-yellow-200 shadow-[0_0_20px_rgba(251,191,36,0.8)] flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-yellow-200 animate-spin" />
              <span className="font-black text-white text-sm sm:text-base tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] uppercase">
                COMBO x{comboMultiplier} ACTIVE!
              </span>
              <Sparkles className="w-4 h-4 text-yellow-200 animate-spin" style={{ animationDirection: 'reverse' }} />
            </motion.div>
          )}
        </AnimatePresence>

        <div 
          ref={boardContainerRef}
          className="relative bg-slate-900/35 dark:bg-slate-950/60 p-2.5 sm:p-3.5 rounded-3xl border-4 border-white/50 dark:border-indigo-800/40 shadow-2xl backdrop-blur-md touch-none select-none"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Dynamic Glowing SVG Connecting Trail Ribbon (Hardware-accelerated layered path) */}
          {trail.length >= 2 && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-25 overflow-visible">
              {/* Outer Glow Halo */}
              <path
                d={generateTrailSvgPath()}
                fill="none"
                stroke={currentColorTheme.glow}
                strokeWidth={isTrailValidMatch ? '14' : '10'}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={isTrailValidMatch ? '0.7' : '0.4'}
              />

              {/* Core Energy Ribbon */}
              <path
                d={generateTrailSvgPath()}
                fill="none"
                stroke={currentColorTheme.stroke}
                strokeWidth={isTrailValidMatch ? '7' : '5'}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={isTrailValidMatch ? 'none' : '6 6'}
              />

              {/* Bright Spine Highlight */}
              <path
                d={generateTrailSvgPath()}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.95"
              />
            </svg>
          )}

          {/* Hint Trail Sparkling Energy Beam (When player is idle for 5s or tapped Hint button) */}
          {hintTrail && hintTrail.length >= 3 && !isDraggingTrail && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-24 overflow-visible">
              {/* Golden Ambient Halo */}
              <path
                d={generateHintSvgPath()}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.6"
              />

              {/* Shimmering Dashed Connector */}
              <path
                d={generateHintSvgPath()}
                fill="none"
                stroke="#FDE047"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="8 6"
              />

              {/* Center White Spark Spine */}
              <path
                d={generateHintSvgPath()}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.95"
              />
            </svg>
          )}

          {/* Dynamic Coordinate Grid */}
          <div 
            className="grid gap-1.5 sm:gap-2 relative z-20"
            style={{
              gridTemplateColumns: `repeat(${levelConfig.gridWidth}, minmax(0, 1fr))`,
            }}
          >
            {board.map((row, y) =>
              row.map((cell, x) => {
                const isSelected = selectedCell?.x === x && selectedCell?.y === y;
                const isMatchHighlighted = highlightedMatches.some(m => m.x === x && m.y === y);
                const trailIndex = trail.findIndex(t => t.x === x && t.y === y);
                const isInTrail = trailIndex !== -1;
                const isTrailHead = isInTrail && trailIndex === trail.length - 1;
                const isSwitchTarget = switchFirstCell?.x === x && switchFirstCell?.y === y;
                const hintIndex = hintTrail ? hintTrail.findIndex(h => h.x === x && h.y === y) : -1;
                const isInHint = hintIndex !== -1 && !isInTrail;

                return (
                  <div
                    key={`cell-${x}-${y}`}
                    onPointerDown={(e) => handlePointerDown(x, y, e)}
                    className={`w-10 h-10 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-2xl flex items-center justify-center relative cursor-pointer select-none transition-transform duration-150 will-change-transform ${
                      cell.jelly
                        ? 'bg-pink-400/45 border-2 border-pink-300/90 shadow-inner'
                        : 'bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10'
                    } ${
                      isMatchHighlighted
                        ? 'ring-4 ring-yellow-300 shadow-[0_0_24px_rgba(253,224,71,0.9)] scale-110 z-40 bg-yellow-300/40'
                        : isSelected
                        ? 'ring-4 ring-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.9)] scale-105 z-35 bg-amber-300/30'
                        : ''
                    } ${
                      isInTrail 
                        ? 'ring-4 ring-white shadow-lg scale-105 z-30' 
                        : ''
                    } ${
                      isTrailHead && isTrailValidMatch
                        ? 'ring-4 ring-yellow-300 shadow-xl scale-110'
                        : ''
                    } ${
                      isInHint && !isSelected && !isMatchHighlighted
                        ? 'ring-3 ring-amber-400 dark:ring-yellow-300 shadow-[0_0_15px_rgba(245,158,11,0.85)] z-25 bg-amber-200/40 dark:bg-amber-900/40 scale-105'
                        : ''
                    } ${
                      isSwitchTarget ? 'ring-4 ring-cyan-400 scale-105 z-20' : ''
                    }`}
                  >
                    {/* Obstacle Layer */}
                    {cell.obstacle !== 'none' && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                        <ObstacleSvg type={cell.obstacle} size={42} />
                      </div>
                    )}

                    {/* Match Highlight Flash Star */}
                    {isMatchHighlighted && (
                      <div className="absolute inset-0 z-45 flex items-center justify-center pointer-events-none animate-ping">
                        <Sparkles className="w-8 h-8 text-yellow-200 drop-shadow-[0_0_10px_rgba(255,255,255,1)]" />
                      </div>
                    )}

                    {/* Floating Hint Callout Beacon on First Hint Node */}
                    {isInHint && hintIndex === 0 && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 font-black text-[9px] px-1.5 py-0.5 rounded-full border border-white shadow-md flex items-center gap-0.5 pointer-events-none whitespace-nowrap">
                        <Sparkles size={10} className="text-yellow-100" />
                        <span>HINT</span>
                      </div>
                    )}

                    {/* GPU-Accelerated Crisp Candy Layer */}
                    {cell.candy && (
                      <div
                        className={`w-full h-full flex items-center justify-center relative transition-transform duration-150 will-change-transform ${
                          isMatchHighlighted
                            ? 'scale-115'
                            : isSelected
                            ? 'scale-110'
                            : isInTrail
                            ? 'scale-105'
                            : isInHint
                            ? 'scale-105'
                            : 'scale-100'
                        }`}
                      >
                        <CandySvg
                          color={cell.candy.color}
                          special={cell.candy.special}
                          size={46}
                        />

                        {/* Special Candy Ambient Aura */}
                        {cell.candy.special === 'color-bomb' && (
                          <div className="absolute inset-0 rounded-full bg-amber-400/25 animate-ping pointer-events-none" />
                        )}

                        {/* Sequential Connection Index Pill on Candies in Trail */}
                        {isInTrail && (
                          <div
                            className={`absolute -top-1.5 -right-1.5 z-40 w-5 h-5 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[10px] font-black text-white ${
                              isTrailValidMatch
                                ? 'bg-gradient-to-tr from-emerald-500 to-teal-400'
                                : 'bg-amber-500'
                            }`}
                          >
                            {trailIndex + 1}
                          </div>
                        )}
                      </div>
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

          {/* Prominent Floating 'COMBO!' Popup Banner for Matches > 3 and Cascades */}
          <AnimatePresence>
            {comboAlert && (
              <motion.div
                key={comboAlert.id}
                initial={{ opacity: 0, scale: 0.2, y: 35, rotate: -10 }}
                animate={{ 
                  opacity: 1, 
                  scale: [0.2, 1.28, 1.05], 
                  y: [25, -12, 0], 
                  rotate: [-10, 5, -2, 0] 
                }}
                exit={{ opacity: 0, scale: 1.35, y: -40, filter: 'blur(4px)' }}
                transition={{ duration: 0.45, ease: [0.175, 0.885, 0.32, 1.275], type: 'tween' }}
                className="absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center justify-center w-full max-w-[340px] px-3"
              >
                <div className="relative px-6 py-3 rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 border-3 border-yellow-200 shadow-[0_0_40px_rgba(251,191,36,0.95),0_15px_30px_rgba(0,0,0,0.5)] flex items-center gap-3 overflow-hidden">
                  <Sparkles className="w-7 h-7 text-yellow-200 animate-spin flex-shrink-0 drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
                  <div className="flex flex-col items-center text-center">
                    <span className="font-black text-2xl sm:text-3xl text-white drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)] tracking-wider uppercase font-sans">
                      {comboAlert.title}
                    </span>
                    <span className="font-extrabold text-[11px] sm:text-xs text-yellow-200 uppercase tracking-widest drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      {comboAlert.count > 3 ? `★ ${comboAlert.count} CANDY COMBO! ★` : `★ ${comboAlert.multiplier}x MULTIPLIER ★`}
                    </span>
                  </div>
                  <Sparkles className="w-7 h-7 text-yellow-200 animate-spin flex-shrink-0 drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]" style={{ animationDirection: 'reverse' }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Candy Crush Dynamic Particle Burst Layer */}
          <div className="absolute inset-0 pointer-events-none z-36 overflow-visible">
            {particles.map(particle => {
              const width = levelConfig.gridWidth;
              const height = levelConfig.gridHeight;
              const leftPct = ((particle.x + 0.5) / width) * 100;
              const topPct = ((particle.y + 0.5) / height) * 100;

              return (
                <motion.div
                  key={particle.id}
                  initial={{
                    x: 0,
                    y: 0,
                    scale: 1.2,
                    opacity: 1,
                    rotate: 0,
                  }}
                  animate={{
                    x: particle.dx,
                    y: particle.dy + 14,
                    scale: 0,
                    opacity: 0,
                    rotate: particle.rotation + 180,
                  }}
                  transition={{
                    duration: 0.65,
                    ease: [0.25, 1, 0.5, 1],
                    delay: particle.delay,
                  }}
                  style={{
                    position: 'absolute',
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    width: particle.size,
                    height: particle.size,
                    marginLeft: -particle.size / 2,
                    marginTop: -particle.size / 2,
                  }}
                  className="flex items-center justify-center pointer-events-none"
                >
                  {particle.shape === 'star' ? (
                    <Sparkles
                      size={particle.size + 4}
                      style={{ color: particle.color }}
                      className="drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                    />
                  ) : particle.shape === 'shard' ? (
                    <div
                      style={{
                        width: particle.size,
                        height: particle.size * 1.5,
                        backgroundColor: particle.color,
                        clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                        boxShadow: `0 0 10px ${particle.color}`,
                      }}
                    />
                  ) : particle.shape === 'circle' ? (
                    <div
                      style={{
                        width: particle.size,
                        height: particle.size,
                        backgroundColor: particle.color,
                        boxShadow: `0 0 8px ${particle.color}`,
                      }}
                      className="rounded-full"
                    />
                  ) : (
                    <div
                      style={{
                        width: particle.size,
                        height: particle.size,
                        backgroundColor: particle.color,
                        boxShadow: `0 0 8px ${particle.color}`,
                      }}
                      className="rotate-45 rounded-xs"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Shockwave Radial Wave Rings */}
          <div className="absolute inset-0 pointer-events-none z-34 overflow-visible">
            {shockwaves.map(sw => {
              const width = levelConfig.gridWidth;
              const height = levelConfig.gridHeight;
              const leftPct = ((sw.x + 0.5) / width) * 100;
              const topPct = ((sw.y + 0.5) / height) * 100;

              return (
                <motion.div
                  key={sw.id}
                  initial={{ scale: 0.2, opacity: 0.95 }}
                  animate={{ scale: 2.3, opacity: 0 }}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    borderColor: sw.color,
                  }}
                  className="w-16 h-16 -ml-8 -mt-8 rounded-full border-3 pointer-events-none shadow-[0_0_16px_rgba(255,255,255,0.9)]"
                />
              );
            })}
          </div>

          {/* Floating -1 Move Decrement Pop Indicator */}
          <AnimatePresence>
            {lastMoveDeduction && (
              <motion.div
                key={lastMoveDeduction}
                initial={{ opacity: 1, scale: 0.6, y: 10 }}
                animate={{ opacity: 0, scale: 1.25, y: -24 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.75, ease: 'easeOut' }}
                className="absolute top-2 left-4 z-45 bg-gradient-to-r from-rose-500 to-red-600 text-white font-black text-xs px-2.5 py-0.5 rounded-full border-2 border-white shadow-lg pointer-events-none tracking-wider"
              >
                -1 MOVE
              </motion.div>
            )}
          </AnimatePresence>

          {/* Special Effects Lightning / Laser SVG Overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-35 overflow-visible">
            {activeEffects.map(effect => {
              if (effect.type === 'lightning' && effect.targetX !== undefined && effect.targetY !== undefined) {
                const width = levelConfig.gridWidth;
                const height = levelConfig.gridHeight;
                const x1 = ((effect.x + 0.5) / width) * 100;
                const y1 = ((effect.y + 0.5) / height) * 100;
                const x2 = ((effect.targetX + 0.5) / width) * 100;
                const y2 = ((effect.targetY + 0.5) / height) * 100;
                const midX = (x1 + x2) / 2 + 2;
                const midY = (y1 + y2) / 2 - 2;

                return (
                  <g key={effect.id}>
                    <path
                      d={`M ${x1}%,${y1}% Q ${midX}%,${midY}% ${x2}%,${y2}%`}
                      fill="none"
                      stroke="#FFEB3B"
                      strokeWidth="8"
                      strokeLinecap="round"
                      opacity="0.85"
                      className="animate-pulse"
                    />
                    <path
                      d={`M ${x1}%,${y1}% Q ${midX}%,${midY}% ${x2}%,${y2}%`}
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </g>
                );
              }

              if (effect.type === 'laser-h') {
                const height = levelConfig.gridHeight;
                const y = ((effect.y + 0.5) / height) * 100;
                return (
                  <line
                    key={effect.id}
                    x1="0"
                    y1={`${y}%`}
                    x2="100%"
                    y2={`${y}%`}
                    stroke="#FFFFFF"
                    strokeWidth="14"
                    strokeLinecap="round"
                    className="animate-ping"
                  />
                );
              }

              if (effect.type === 'laser-v') {
                const width = levelConfig.gridWidth;
                const x = ((effect.x + 0.5) / width) * 100;
                return (
                  <line
                    key={effect.id}
                    x1={`${x}%`}
                    y1="0"
                    x2={`${x}%`}
                    y2="100%"
                    stroke="#FFFFFF"
                    strokeWidth="14"
                    strokeLinecap="round"
                    className="animate-ping"
                  />
                );
              }

              if (effect.type === 'color-bomb' || effect.type === 'explosion') {
                const width = levelConfig.gridWidth;
                const height = levelConfig.gridHeight;
                const cx = ((effect.x + 0.5) / width) * 100;
                const cy = ((effect.y + 0.5) / height) * 100;
                return (
                  <g key={effect.id}>
                    <circle
                      cx={`${cx}%`}
                      cy={`${cy}%`}
                      r="40"
                      fill="none"
                      stroke="#FFD54F"
                      strokeWidth="6"
                      className="animate-ping"
                    />
                    <circle
                      cx={`${cx}%`}
                      cy={`${cy}%`}
                      r="25"
                      fill="none"
                      stroke="#FF1744"
                      strokeWidth="4"
                      className="animate-pulse"
                    />
                  </g>
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
            onClick={() => {
              haptics.touch();
              setIsPaused(true);
            }}
            className="w-11 h-11 bg-pink-500 hover:bg-pink-600 rounded-2xl border-2 border-white flex items-center justify-center text-white shadow-md transition-all cursor-pointer"
            title="Pause Game"
          >
            <Settings size={20} />
          </motion.button>

          {/* Booster 1: Free Switch Hand */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              haptics.touch();
              setActiveBooster(activeBooster === 'switch' ? null : 'switch');
            }}
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
            onClick={() => {
              haptics.touch();
              setActiveBooster(activeBooster === 'hammer' ? null : 'hammer');
            }}
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
            onClick={() => {
              haptics.touch();
              applyColorBombBooster();
            }}
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
            onClick={() => {
              haptics.touch();
              addExtraMoves();
            }}
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

          {/* Booster 5: Match Hint Trigger */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              triggerHint();
            }}
            className={`flex-1 py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center relative transition-all cursor-pointer ${
              hintTrail
                ? 'bg-amber-400 text-amber-950 ring-2 ring-yellow-200 scale-105 shadow-md animate-pulse'
                : 'bg-white/80 dark:bg-slate-800/80 hover:bg-white text-slate-800 dark:text-white'
            }`}
            title="Highlight Potential Candy Match"
          >
            <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-300 shadow-xs">
              <Lightbulb size={16} className={hintTrail ? 'fill-amber-500' : ''} />
            </div>
            <span className="text-[10px] font-black mt-0.5">Hint</span>
            <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[8px] font-black px-1 rounded-full flex items-center justify-center border border-white shadow-xs">
              FREE
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
            onResume={() => {
              haptics.touch();
              setIsPaused(false);
            }}
            onRestart={handleRestartFromPause}
            onBackToMap={() => {
              haptics.touch();
              onBackToMap();
            }}
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
            onNextLevel={(nextId) => {
              haptics.touch();
              onNextLevel(nextId);
            }}
            onReplayLevel={() => {
              haptics.touch();
              initBoard();
            }}
            onBackToMap={() => {
              haptics.touch();
              onBackToMap();
            }}
            isDark={isDark}
          />
        )}
      </AnimatePresence>

      {/* Out of Moves / Game Over Modal */}
      <AnimatePresence>
        {isGameOver && !isWon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.82, y: 25 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="w-full max-w-sm bg-gradient-to-b from-rose-100 via-pink-100 to-pink-200 dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950 rounded-[2.5rem] border-5 border-rose-400 dark:border-rose-500 shadow-2xl p-6 text-center relative overflow-hidden"
            >
              {/* Header Icon & Title */}
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-rose-500 to-red-600 rounded-3xl border-3 border-white shadow-lg flex items-center justify-center text-3xl animate-bounce">
                💔
              </div>

              <h3 className="text-3xl font-black text-rose-950 dark:text-white tracking-tight mb-1">
                Out of Moves!
              </h3>
              <p className="text-xs font-bold text-slate-600 dark:text-pink-200 mb-4">
                Level {levelConfig.id} • You were so close to winning!
              </p>

              {/* Objective Progress Card */}
              <div className="bg-white/80 dark:bg-slate-800/80 rounded-2xl p-3 border-2 border-rose-200 dark:border-slate-700 shadow-sm mb-4">
                <div className="flex items-center justify-between text-xs font-black text-slate-700 dark:text-slate-200 mb-1.5">
                  <span>Objective Target</span>
                  <span className="text-rose-600 dark:text-pink-400">
                    {levelConfig.objective.type === 'score'
                      ? `${score.toLocaleString()} / ${levelConfig.targetScore.toLocaleString()}`
                      : `${objectiveProgress} / ${levelConfig.objective.target}`}
                  </span>
                </div>

                <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden p-0.5 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(
                          (levelConfig.objective.type === 'score'
                            ? score / levelConfig.targetScore
                            : objectiveProgress / levelConfig.objective.target) * 100
                        )
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    haptics.touch();
                    addExtraMoves();
                  }}
                  className="w-full py-3.5 bg-gradient-to-b from-amber-400 via-yellow-400 to-amber-500 border-b-4 border-amber-700 text-amber-950 font-black text-lg uppercase rounded-2xl shadow-xl flex items-center justify-center gap-2 hover:brightness-105 active:border-b-0 active:translate-y-1 cursor-pointer ring-2 ring-yellow-300/80"
                >
                  <Plus size={22} strokeWidth={3} />
                  +5 EXTRA MOVES (CONTINUE)
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    haptics.touch();
                    initBoard();
                  }}
                  className="w-full py-3 bg-gradient-to-b from-pink-500 to-rose-600 border-b-4 border-rose-800 text-white font-black text-base uppercase rounded-2xl shadow-md hover:brightness-105 active:border-b-0 active:translate-y-1 cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw size={18} />
                  Retry Level
                </motion.button>

                <button
                  onClick={() => {
                    haptics.touch();
                    onBackToMap();
                  }}
                  className="w-full py-2 text-slate-500 dark:text-slate-400 font-bold text-xs hover:text-slate-800 dark:hover:text-white cursor-pointer transition-colors"
                >
                  Return to Saga Map
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
