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

const DEFAULT_STATE: GameState = {
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

export async function loadGameState(): Promise<GameState> {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const data = await get<GameState>(DB_KEY);
    return data ? { ...DEFAULT_STATE, ...data } : DEFAULT_STATE;
  } catch (err) {
    console.error('Failed to load game state', err);
    return DEFAULT_STATE;
  }
}

export async function saveGameState(state: GameState): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    await set(DB_KEY, state);
  } catch (err) {
    console.error('Failed to save game state', err);
  }
}
