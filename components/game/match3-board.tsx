'use client';

import React, { useState, useEffect } from 'react';
import { TitleScreen } from './title-screen';
import { SagaMap } from './saga-map';
import { GameBoardView } from './game-board-view';
import { StickyNotesTasks } from './sticky-notes-tasks';
import { ShopModal } from './shop-modal';
import { SettingsModal } from './settings-modal';
import { BottomTabBar } from '@/components/ui/bottom-tab-bar';
import { getLevelConfig } from '@/lib/levels';
import { LevelConfig } from '@/lib/game-types';
import { useGameState } from '@/hooks/use-game-state';
import { Sparkles, Home, Map as MapIcon, Gamepad2 } from 'lucide-react';

export function Match3Board() {
  const [viewMode, setViewMode] = useState<'splash' | 'map' | 'game'>('splash');
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [currentTab, setCurrentTab] = useState<'map' | 'events' | 'shop'>('map');

  // Unified localStorage wrapper hook
  const {
    gameState,
    unlockedLevels,
    stars,
    totalStars,
    coins,
    lives,
    recordLevelCompletion,
    addCoins,
    buyBooster,
    resetProgress,
    syncNow,
  } = useGameState();

  // Active level config
  const activeLevelId = selectedLevelId ?? unlockedLevels ?? 1;
  const currentLevelConfig = getLevelConfig(activeLevelId);

  // Modals
  const [isTasksOpen, setIsTasksOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const handleSelectLevel = (config: LevelConfig) => {
    setSelectedLevelId(config.id);
    setViewMode('game');
  };

  /**
   * Manages the 199-level progression tree.
   * Once a level's target score or objective is reached, updates local state
   * and IndexedDB so the next level becomes selectable immediately.
   */
  const handleLevelComplete = async (starsEarned: number, score: number) => {
    await recordLevelCompletion(currentLevelConfig.id, starsEarned, score);
  };

  const handleNextLevel = (nextLevelId: number) => {
    setSelectedLevelId(Math.min(199, nextLevelId));
    setViewMode('game');
  };

  const handleClaimReward = async (coinsEarned: number) => {
    addCoins(coinsEarned);
  };

  const handleBuyBooster = async (type: string, cost: number) => {
    buyBooster(type, cost);
  };

  const handleResetProgress = async () => {
    await resetProgress();
    setSelectedLevelId(1);
    setViewMode('map');
  };

  return (
    <div 
      style={{ minHeight: '640px' }}
      className={`relative w-full h-[680px] sm:h-[740px] md:h-[800px] max-w-md mx-auto rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border-4 sm:border-8 ${isDark ? 'border-indigo-900 bg-indigo-950' : 'border-pink-300 bg-sky-100'} flex flex-col justify-between`}
    >
      {/* Top Universal Quick Switcher Nav (when not on splash) */}
      {viewMode !== 'splash' && (
        <div className="w-full flex items-center justify-between px-3 py-1.5 bg-white/95 backdrop-blur-md border-b border-pink-200 z-40 shrink-0 shadow-sm">
          <button
            type="button"
            onClick={() => setViewMode('splash')}
            title="Return to Title Screen"
            className="p-1.5 rounded-full hover:bg-pink-100 text-pink-700 transition-all flex items-center gap-1 cursor-pointer font-bold text-xs"
          >
            <Home size={16} />
            <span className="hidden xs:inline">Home</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`px-3 py-1 rounded-full font-black text-xs transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md ring-2 ring-purple-300'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
              }`}
            >
              <MapIcon size={13} />
              <span>Saga Map</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('game')}
              className={`px-3 py-1 rounded-full font-black text-xs transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === 'game'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md ring-2 ring-pink-300'
                  : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
              }`}
            >
              <Gamepad2 size={13} />
              <span>Level {currentLevelConfig.id}</span>
            </button>
          </div>
        </div>
      )}

      {/* Screen Views */}
      {viewMode === 'splash' ? (
        /* 1. Title / Splash Screen (Reference Image 1) */
        <TitleScreen
          onPlay={() => setViewMode('map')}
          onOpenSettings={() => setIsSettingsOpen(true)}
          unlockedLevel={gameState.unlockedLevels}
          totalStars={totalStars}
          coins={gameState.coins}
          onRestoreProgress={() => {
            syncNow();
          }}
        />
      ) : viewMode === 'map' ? (
        /* 2. Saga Map Screen (Reference Image 2) */
        <div className="relative w-full h-full flex flex-col justify-between overflow-hidden">
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

          {/* Floating Action Button (FAB) for Daily Tasks & Quests */}
          <button
            onClick={() => setIsTasksOpen(true)}
            className="absolute bottom-20 right-4 z-40 w-14 h-14 bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-500 text-white rounded-full border-3 border-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all animate-bounce cursor-pointer"
            style={{ animationDuration: '4s' }}
            title="Daily Events & Missions"
          >
            <Sparkles size={24} className="text-yellow-200" />
          </button>

          {/* Mobile Bottom Tab Bar (Reference Image 2) */}
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
        /* 3. In-Game Match-3 Puzzle Board */
        <GameBoardView
          key={`game-board-level-${currentLevelConfig.id}`}
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
        boosters={gameState.boosters}
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
