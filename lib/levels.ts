import { LevelConfig, CandyColor } from './game-types';

export const LEVEL_CONFIGS: Record<number, LevelConfig> = {
  1: {
    id: 1,
    name: 'Candy Town Start',
    moves: 25,
    targetScore: 2500,
    starThresholds: [1000, 2000, 3000],
    objective: { type: 'score', target: 2500, description: 'Reach 2,500 points' },
    gridWidth: 8,
    gridHeight: 8,
  },
  2: {
    id: 2,
    name: 'Jelly Meadow',
    moves: 22,
    targetScore: 4000,
    starThresholds: [2000, 4000, 6000],
    objective: { type: 'jellies', target: 12, description: 'Clear 12 Jellies' },
    gridWidth: 8,
    gridHeight: 8,
    jellyTiles: [
      { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 },
      { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 },
      { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 },
    ],
  },
  3: {
    id: 3,
    name: 'Cherry Orchard',
    moves: 20,
    targetScore: 5000,
    starThresholds: [2500, 5000, 7500],
    objective: { type: 'color', target: 25, color: 'red', description: 'Collect 25 Red Candies' },
    gridWidth: 8,
    gridHeight: 8,
  },
  4: {
    id: 4,
    name: 'Lemon Drop Valley',
    moves: 22,
    targetScore: 6000,
    starThresholds: [3000, 6000, 9000],
    objective: { type: 'color', target: 30, color: 'yellow', description: 'Collect 30 Yellow Drops' },
    gridWidth: 8,
    gridHeight: 8,
  },
  5: {
    id: 5,
    name: 'Sugar Frosting Grove',
    moves: 24,
    targetScore: 7500,
    starThresholds: [3500, 7000, 11000],
    objective: { type: 'waffle', target: 8, description: 'Break 8 Sugar Waffles' },
    gridWidth: 8,
    gridHeight: 8,
    initialObstacles: [
      { x: 1, y: 1, type: 'waffle' }, { x: 6, y: 1, type: 'waffle' },
      { x: 2, y: 2, type: 'waffle' }, { x: 5, y: 2, type: 'waffle' },
      { x: 2, y: 5, type: 'waffle' }, { x: 5, y: 5, type: 'waffle' },
      { x: 1, y: 6, type: 'waffle' }, { x: 6, y: 6, type: 'waffle' },
    ],
  },
  15: {
    id: 15,
    name: 'Licorice Swirl Bend',
    moves: 26,
    targetScore: 10000,
    starThresholds: [5000, 10000, 15000],
    objective: { type: 'jellies', target: 16, description: 'Clear 16 Jellies' },
    gridWidth: 8,
    gridHeight: 8,
    initialObstacles: [
      { x: 3, y: 3, type: 'licorice' }, { x: 4, y: 3, type: 'licorice' },
      { x: 3, y: 4, type: 'licorice' }, { x: 4, y: 4, type: 'licorice' },
    ],
    jellyTiles: [
      { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 },
      { x: 2, y: 3 }, { x: 5, y: 3 },
      { x: 2, y: 4 }, { x: 5, y: 4 },
      { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 },
      { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 3, y: 6 }, { x: 4, y: 6 },
    ],
  },
  16: {
    id: 16,
    name: 'Golden Ribbon Pass',
    moves: 24,
    targetScore: 12000,
    starThresholds: [6000, 12000, 18000],
    objective: { type: 'color-bomb', target: 2, description: 'Create 2 Color Bombs' },
    gridWidth: 8,
    gridHeight: 8,
  },
  17: {
    id: 17,
    name: 'Tiffi Sweet Trail',
    moves: 32,
    targetScore: 15000,
    starThresholds: [7000, 14000, 22000],
    objective: { type: 'color', target: 35, color: 'red', description: 'Collect 35 Red Candies' },
    gridWidth: 8,
    gridHeight: 8,
  },
  83: {
    id: 83,
    name: 'Jelly Fish Lagoon',
    moves: 22,
    targetScore: 18000,
    starThresholds: [9000, 18000, 27000],
    objective: { type: 'fish', target: 6, description: 'Release 6 Jelly Fish' },
    gridWidth: 8,
    gridHeight: 8,
  },
  125: {
    id: 125,
    name: 'Choco Bomb Superstation',
    moves: 32,
    targetScore: 35000,
    starThresholds: [15000, 30000, 45000],
    objective: { type: 'color', target: 40, color: 'red', description: 'Collect 40 Red Candies' },
    gridWidth: 8,
    gridHeight: 8,
  },
  134: {
    id: 134,
    name: 'Rainbow Supernova',
    moves: 27,
    targetScore: 40000,
    starThresholds: [20000, 40000, 60000],
    objective: { type: 'color-bomb', target: 3, description: 'Detonate 3 Color Bombs' },
    gridWidth: 8,
    gridHeight: 8,
  },
};

// Procedural generator for all 199 levels with rich progressive difficulty
export function getLevelConfig(levelId: number): LevelConfig {
  if (LEVEL_CONFIGS[levelId]) {
    return LEVEL_CONFIGS[levelId];
  }

  const baseMoves = Math.max(18, 32 - Math.floor(levelId / 15));
  const baseTargetScore = 2000 + levelId * 450;
  const colors: CandyColor[] = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
  const targetColor = colors[levelId % colors.length];

  const objTypeSelector = levelId % 5;
  let objective;

  if (objTypeSelector === 0) {
    objective = {
      type: 'color' as const,
      target: 20 + Math.floor(levelId / 5) * 2,
      color: targetColor,
      description: `Collect ${20 + Math.floor(levelId / 5) * 2} ${targetColor.toUpperCase()} Candies`,
    };
  } else if (objTypeSelector === 1) {
    objective = {
      type: 'jellies' as const,
      target: Math.min(24, 10 + Math.floor(levelId / 10)),
      description: `Clear ${Math.min(24, 10 + Math.floor(levelId / 10))} Jellies`,
    };
  } else if (objTypeSelector === 2) {
    objective = {
      type: 'color-bomb' as const,
      target: Math.min(4, 1 + Math.floor(levelId / 40)),
      description: `Create ${Math.min(4, 1 + Math.floor(levelId / 40))} Color Bombs`,
    };
  } else if (objTypeSelector === 3) {
    objective = {
      type: 'waffle' as const,
      target: Math.min(16, 6 + Math.floor(levelId / 12)),
      description: `Break ${Math.min(16, 6 + Math.floor(levelId / 12))} Sugar Waffles`,
    };
  } else {
    objective = {
      type: 'score' as const,
      target: baseTargetScore,
      description: `Score ${baseTargetScore.toLocaleString()} points`,
    };
  }

  const jellyTiles: { x: number; y: number }[] = [];
  if (objective.type === 'jellies') {
    for (let y = 1; y < 7; y++) {
      for (let x = 1; x < 7; x++) {
        if (jellyTiles.length < objective.target) {
          jellyTiles.push({ x, y });
        }
      }
    }
  }

  const initialObstacles: { x: number; y: number; type: 'waffle' | 'licorice' | 'chocolate' }[] = [];
  if (objective.type === 'waffle') {
    for (let i = 0; i < objective.target; i++) {
      const x = 1 + (i % 6);
      const y = 1 + Math.floor(i / 6);
      initialObstacles.push({ x, y, type: 'waffle' });
    }
  } else if (levelId > 10 && levelId % 3 === 0) {
    initialObstacles.push({ x: 3, y: 3, type: 'licorice' });
    initialObstacles.push({ x: 4, y: 4, type: 'licorice' });
  }

  return {
    id: levelId,
    name: `Sugar Level ${levelId}`,
    moves: baseMoves,
    targetScore: baseTargetScore,
    starThresholds: [
      Math.floor(baseTargetScore * 0.5),
      baseTargetScore,
      Math.floor(baseTargetScore * 1.5),
    ],
    objective,
    gridWidth: 8,
    gridHeight: 8,
    jellyTiles: jellyTiles.length > 0 ? jellyTiles : undefined,
    initialObstacles: initialObstacles.length > 0 ? initialObstacles : undefined,
  };
}
