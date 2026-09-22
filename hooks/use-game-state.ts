'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, DEFAULT_STATE, getLocalStorageState, setLocalStorageState, loadGameState, saveGameState } from '@/lib/db';
import { advanceLevelProgression, ProgressionStats, getProgressionStats } from '@/lib/progression';

export type BoosterKey = 'colorBomb' | 'striped' | 'wrapped';

function normalizeBoosterKey(type: string): BoosterKey {
  if (type === 'color-bomb' || type === 'colorBomb') return 'colorBomb';
  if (type === 'switch' || type === 'striped') return 'striped';
  if (type === 'hammer' || type === 'wrapped') return 'wrapped';
  return 'striped';
}

/**
 * Custom localStorage wrapper hook for Candy Crush Ultra.
 * Automatically synchronizes game progression (199 levels, stars, high scores)
 * and booster inventory across browser sessions with zero external database dependencies.
 */
export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasHydrated = useRef(false);

  // Initialize and synchronize with localStorage & IndexedDB on mount (client-only to prevent hydration mismatch)
  useEffect(() => {
    let isSubscribed = true;

    // Load from storage layers asynchronously
    loadGameState()
      .then((loaded) => {
        if (!isSubscribed) return;
        if (loaded) {
          setGameState(loaded);
        }
        setIsLoaded(true);
        hasHydrated.current = true;
      })
      .catch((err) => {
        console.warn('[useGameState] Error loading state from storage:', err);
        if (isSubscribed) {
          setIsLoaded(true);
          hasHydrated.current = true;
        }
      });

    // Cross-tab synchronization via window storage events
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'candy_crush_ultra_save' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setGameState((prev) => ({
            ...prev,
            ...parsed,
            boosters: {
              ...prev.boosters,
              ...(parsed?.boosters || {}),
            },
          }));
        } catch (err) {
          console.warn('[useGameState] Storage event sync failed:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      isSubscribed = false;
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Sync state to localStorage whenever gameState changes after initial hydration
  useEffect(() => {
    if (!hasHydrated.current) {
      return;
    }
    setLocalStorageState(gameState);
  }, [gameState]);

  // Direct state updater that writes to both localStorage and async backup
  const updateState = useCallback((updater: (prev: GameState) => GameState) => {
    setGameState((prev) => {
      const next = updater(prev);
      setLocalStorageState(next);
      saveGameState(next).catch(() => {});
      return next;
    });
  }, []);

  // Advance level progression
  const recordLevelCompletion = useCallback(
    async (completedLevelId: number, starsEarned: number, scoreEarned: number) => {
      const result = await advanceLevelProgression(
        completedLevelId,
        starsEarned,
        scoreEarned,
        gameState
      );
      setGameState(result.nextState);
      setLocalStorageState(result.nextState);
      return result;
    },
    [gameState]
  );

  // Use / consume a booster from inventory
  const useBooster = useCallback(
    (type: string): boolean => {
      const key = normalizeBoosterKey(type);
      if (gameState.boosters[key] <= 0) {
        return false;
      }
      updateState((prev) => ({
        ...prev,
        boosters: {
          ...prev.boosters,
          [key]: Math.max(0, prev.boosters[key] - 1),
        },
      }));
      return true;
    },
    [gameState.boosters, updateState]
  );

  // Add boosters to inventory (e.g. earned via rewards / quests)
  const addBooster = useCallback(
    (type: string, count: number = 1) => {
      const key = normalizeBoosterKey(type);
      updateState((prev) => ({
        ...prev,
        boosters: {
          ...prev.boosters,
          [key]: (prev.boosters[key] || 0) + count,
        },
      }));
    },
    [updateState]
  );

  // Purchase booster with coins
  const buyBooster = useCallback(
    (type: string, cost: number): boolean => {
      if (gameState.coins < cost) return false;
      const key = normalizeBoosterKey(type);
      updateState((prev) => ({
        ...prev,
        coins: prev.coins - cost,
        boosters: {
          ...prev.boosters,
          [key]: (prev.boosters[key] || 0) + 1,
        },
      }));
      return true;
    },
    [gameState.coins, updateState]
  );

  // Add coins
  const addCoins = useCallback(
    (amount: number) => {
      if (amount <= 0) return;
      updateState((prev) => ({
        ...prev,
        coins: prev.coins + amount,
      }));
    },
    [updateState]
  );

  // Deduct coins
  const deductCoins = useCallback(
    (amount: number): boolean => {
      if (gameState.coins < amount) return false;
      updateState((prev) => ({
        ...prev,
        coins: prev.coins - amount,
      }));
      return true;
    },
    [gameState.coins, updateState]
  );

  // Reset all progress back to factory defaults
  const resetProgress = useCallback(async () => {
    const freshState: GameState = {
      unlockedLevels: 1,
      stars: {},
      lives: 5,
      lastLifeLostAt: null,
      highScores: {},
      coins: 500,
      boosters: { colorBomb: 3, striped: 3, wrapped: 3 },
    };
    setGameState(freshState);
    setLocalStorageState(freshState);
    await saveGameState(freshState);
  }, []);

  // Force synchronous or full reload
  const syncNow = useCallback(async () => {
    const loaded = await loadGameState();
    setGameState(loaded);
    return loaded;
  }, []);

  const totalStars = Object.values(gameState.stars).reduce((acc, curr) => acc + curr, 0);
  const stats: ProgressionStats = getProgressionStats(gameState);

  return {
    gameState,
    isLoaded,
    unlockedLevels: gameState.unlockedLevels,
    stars: gameState.stars,
    totalStars,
    highScores: gameState.highScores,
    coins: gameState.coins,
    lives: gameState.lives,
    boosters: gameState.boosters,
    stats,
    // Actions
    setGameState,
    updateState,
    recordLevelCompletion,
    useBooster,
    addBooster,
    buyBooster,
    addCoins,
    deductCoins,
    resetProgress,
    syncNow,
  };
}

export default useGameState;
