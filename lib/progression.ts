import { GameState, loadGameState, saveGameState } from './db';
import { getLevelConfig } from './levels';

export const TOTAL_SAGA_LEVELS = 199;

export interface ProgressionStats {
  unlockedLevel: number;
  totalLevels: number;
  totalStars: number;
  maxPossibleStars: number;
  completionPercentage: number;
  completedLevelsCount: number;
}

/**
 * Manages the 199-level progression tree.
 * When a level objective or score target is achieved, records stars, high scores,
 * unlocks the next consecutive level in the 199-level tree, and persists state.
 */
export async function advanceLevelProgression(
  completedLevelId: number,
  starsEarned: number,
  scoreEarned: number,
  currentState: GameState
): Promise<{ nextState: GameState; unlockedNextLevel: boolean; newLevelUnlockedId: number }> {
  const currentConfig = getLevelConfig(completedLevelId);
  const nextLevelId = Math.min(TOTAL_SAGA_LEVELS, completedLevelId + 1);
  const previouslyUnlocked = currentState.unlockedLevels;
  const newUnlockedLevel = Math.min(TOTAL_SAGA_LEVELS, Math.max(previouslyUnlocked, nextLevelId));
  const unlockedNextLevel = newUnlockedLevel > previouslyUnlocked;

  const previousBestStars = currentState.stars[completedLevelId] || 0;
  const bestStars = Math.max(previousBestStars, starsEarned);

  const previousHighScore = currentState.highScores[completedLevelId] || 0;
  const newHighScore = Math.max(previousHighScore, scoreEarned);

  const starBonusCoins = Math.max(0, bestStars - previousBestStars) * 50;
  const levelClearReward = unlockedNextLevel ? 100 : 25;

  const nextState: GameState = {
    ...currentState,
    unlockedLevels: newUnlockedLevel,
    stars: {
      ...currentState.stars,
      [completedLevelId]: bestStars,
    },
    highScores: {
      ...currentState.highScores,
      [completedLevelId]: newHighScore,
    },
    coins: currentState.coins + starBonusCoins + levelClearReward,
  };

  await saveGameState(nextState);
  return {
    nextState,
    unlockedNextLevel,
    newLevelUnlockedId: newUnlockedLevel,
  };
}

/**
 * Calculates overall progression metrics across the 199 levels.
 */
export function getProgressionStats(state: GameState): ProgressionStats {
  const completedLevelsCount = Object.keys(state.stars).filter(
    (lvl) => (state.stars[Number(lvl)] || 0) > 0
  ).length;

  const totalStars = Object.values(state.stars).reduce((acc, curr) => acc + curr, 0);
  const maxPossibleStars = TOTAL_SAGA_LEVELS * 3;
  const completionPercentage = Math.min(
    100,
    Math.round((completedLevelsCount / TOTAL_SAGA_LEVELS) * 100)
  );

  return {
    unlockedLevel: state.unlockedLevels,
    totalLevels: TOTAL_SAGA_LEVELS,
    totalStars,
    maxPossibleStars,
    completionPercentage,
    completedLevelsCount,
  };
}

export function isLevelAccessible(levelId: number, unlockedLevels: number): boolean {
  return levelId >= 1 && levelId <= Math.min(TOTAL_SAGA_LEVELS, unlockedLevels);
}
