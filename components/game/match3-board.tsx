'use client';

import React, { useState, useEffect } from 'react';
import { SagaMap } from './saga-map';
import { GameBoardView } from './game-board-view';
import { StickyNotesTasks } from './sticky-notes-tasks';
import { ShopModal } from './shop-modal';
import { SettingsModal } from './settings-modal';
import { BottomTabBar } from '@/components/ui/bottom-tab-bar';
import { getLevelConfig } from '@/lib/levels';
import { LevelConfig } from '@/lib/game-types';
import { loadGameState, saveGameState, GameState } from '@/lib/db';
import { advanceLevelProgression } from '@/lib/progression';
import { Sparkles } from 'lucide-react';

export function Match3Board() {
  const [viewMode, setViewMode] = useState<'map' | 'game'>('map');
  const [currentLevelConfig, setCurrentLevelConfig] = useState<LevelConfig>(getLevelConfig(17));
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentTab, setCurrentTab] = useState<'map' | 'events' | 'shop'>('map');

  // Modals
  const [isTasksOpen, setIsTasksOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    loadGameState().then(state => {
      setGameState(state);
      setCurrentLevelConfig(getLevelConfig(state.unlockedLevels || 17));
      setMounted(true);
    });
  }, []);

  const handleSelectLevel = (config: LevelConfig) => {
    setCurrentLevelConfig(config);
    setViewMode('game');
  };

  /**
   * Manages the 199-level progression tree.
   * Once a level's target score or objective is reached, updates local state
   * and IndexedDB so the next level becomes selectable immediately.
   */
  const handleLevelComplete = async (stars: number, score: number) => {
    if (!gameState) return;
    const { nextState } = await advanceLevelProgression(
      currentLevelConfig.id,
      stars,
      score,
      gameState
    );
    setGameState(nextState);
  };

  const handleNextLevel = (nextLevelId: number) => {
    const nextConfig = getLevelConfig(Math.min(199, nextLevelId));
    setCurrentLevelConfig(nextConfig);
    setViewMode('game');
  };

  const handleClaimReward = async (coinsEarned: number) => {
    if (!gameState) return;
    const newState = {
      ...gameState,
      coins: gameState.coins + coinsEarned,
    };
    await saveGameState(newState);
    setGameState(newState);
  };

  const handleBuyBooster = async (type: string, cost: number) => {
    if (!gameState || gameState.coins < cost) return;
    const newState = {
      ...gameState,
      coins: gameState.coins - cost,
      boosters: {
        ...gameState.boosters,
        colorBomb: type === 'color-bomb' ? gameState.boosters.colorBomb + 1 : gameState.boosters.colorBomb,
        striped: type === 'switch' ? gameState.boosters.striped + 1 : gameState.boosters.striped,
        wrapped: type === 'hammer' ? gameState.boosters.wrapped + 1 : gameState.boosters.wrapped,
      },
    };
    await saveGameState(newState);
    setGameState(newState);
  };

  const handleResetProgress = async () => {
    const defaultState: GameState = {
      unlockedLevels: 1,
      stars: {},
      lives: 5,
      lastLifeLostAt: null,
      highScores: {},
      coins: 500,
      boosters: { colorBomb: 3, striped: 3, wrapped: 3 },
    };
    await saveGameState(defaultState);
    setGameState(defaultState);
    setCurrentLevelConfig(getLevelConfig(1));
    setViewMode('map');
  };

  if (!mounted || !gameState) {
    return (
      <div className="w-full h-[650px] bg-pink-100/50 rounded-[3rem] animate-pulse flex items-center justify-center">
        <div className="text-pink-600 font-black text-xl uppercase tracking-wider">
          Loading Candy Kingdom...
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-[750px] md:h-[820px] max-w-md mx-auto rounded-[3rem] overflow-hidden shadow-2xl border-8 ${isDark ? 'border-indigo-900 bg-indigo-950' : 'border-pink-300 bg-sky-100'} flex flex-col justify-between`}>
      {/* View Switcher: Map vs In-Game Board */}
      {viewMode === 'map' ? (
        <div className="relative w-full h-full flex flex-col justify-between">
          <SagaMap
            unlockedLevel={gameState.unlockedLevels}
            starsMap={gameState.stars}
            coins={gameState.coins}
            lives={gameState.lives}
            onSelectLevel={handleSelectLevel}
            onOpenTasks={() => setIsTasksOpen(true)}
            onOpenShop={() => setIsShopOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            isDark={isDark}
          />

          {/* Floating Action Button (FAB) for Sticky Tasks */}
          <button
            onClick={() => setIsTasksOpen(true)}
            className="absolute bottom-20 right-4 z-40 w-14 h-14 bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-500 text-white rounded-full border-3 border-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all animate-bounce cursor-pointer"
            style={{ animationDuration: '4s' }}
          >
            <Sparkles size={24} className="text-yellow-200" />
          </button>

          {/* Mobile Bottom Tab Bar */}
          <div className="absolute bottom-0 inset-x-0 z-30">
            <BottomTabBar
              currentTab={currentTab}
              onSelectTab={(tab) => {
                setCurrentTab(tab);
                if (tab === 'events') setIsTasksOpen(true);
                if (tab === 'shop') setIsShopOpen(true);
              }}
              isDark={isDark}
            />
          </div>
        </div>
      ) : (
        <GameBoardView
          levelConfig={currentLevelConfig}
          lives={gameState.lives}
          coins={gameState.coins}
          onBackToMap={() => setViewMode('map')}
          onNextLevel={handleNextLevel}
          onLevelComplete={handleLevelComplete}
          isDark={isDark}
        />
      )}

      {/* Sticky Notes Daily Tasks Modal */}
      <StickyNotesTasks
        isOpen={isTasksOpen}
        onClose={() => {
          setIsTasksOpen(false);
          setCurrentTab('map');
        }}
        onClaimReward={handleClaimReward}
        isDark={isDark}
      />

      {/* Shop Modal */}
      <ShopModal
        isOpen={isShopOpen}
        onClose={() => {
          setIsShopOpen(false);
          setCurrentTab('map');
        }}
        coins={gameState.coins}
        onBuyBooster={handleBuyBooster}
        isDark={isDark}
      />

      {/* Settings & Guide Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isDark={isDark}
        onToggleDarkMode={() => setIsDark(!isDark)}
        onResetProgress={handleResetProgress}
      />
    </div>
  );
}
