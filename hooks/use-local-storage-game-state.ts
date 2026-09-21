'use client';

import { useGameState } from './use-game-state';

export { useGameState, useGameState as useLocalStorageGameState } from './use-game-state';
export type { BoosterKey } from './use-game-state';
export default useGameState;
