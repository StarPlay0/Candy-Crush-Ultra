import { get, set } from 'idb-keyval';

export interface GameState {
  unlockedLevels: number;
  stars: Record<number, number>; // levelId -> stars
  lives: number;
  lastLifeLostAt: number | null;
  highScores: Record<number, number>;
  coins: number;
  boosters: {
    colorBomb: number;
    striped: number;
    wrapped: number;
  };
}

export const DEFAULT_STATE: GameState = {
  unlockedLevels: 1,
  stars: {},
  lives: 5,
  lastLifeLostAt: null,
  highScores: {},
  coins: 500,
  boosters: {
    colorBomb: 3,
    striped: 3,
    wrapped: 3,
  },
};

const DB_KEY = 'candy_crush_ultra_save';

export function getLocalStorageState(): GameState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(DB_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATE,
      ...parsed,
      boosters: {
        ...DEFAULT_STATE.boosters,
        ...(parsed?.boosters || {}),
      },
    };
  } catch (e) {
    console.warn('Failed to read game state from localStorage:', e);
    return DEFAULT_STATE;
  }
}

export function setLocalStorageState(state: GameState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(DB_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to write game state to localStorage:', e);
  }
}

export async function loadGameState(): Promise<GameState> {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    // 1. First check localStorage for zero-latency synchronous hit
    const local = getLocalStorageState();
    if (local && local.unlockedLevels > 1) {
      return local;
    }

    // 2. Fallback to IndexedDB
    const data = await get<GameState>(DB_KEY);
    if (data) {
      const merged = { ...DEFAULT_STATE, ...data };
      setLocalStorageState(merged); // sync back to localStorage
      return merged;
    }
    return local || DEFAULT_STATE;
  } catch (err) {
    console.error('Failed to load game state', err);
    return getLocalStorageState();
  }
}

export async function saveGameState(state: GameState): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    // Save to localStorage immediately
    setLocalStorageState(state);
    // Asynchronously backup to IndexedDB
    await set(DB_KEY, state);
  } catch (err) {
    console.error('Failed to save game state', err);
  }
}
