export type CandyColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple';

export type SpecialType = 'none' | 'striped-h' | 'striped-v' | 'wrapped' | 'color-bomb' | 'fish';

export type ObstacleType = 'none' | 'jelly' | 'licorice' | 'chocolate' | 'waffle';

export interface Candy {
  id: string;
  color: CandyColor | 'rainbow'; // rainbow for color-bomb
  special: SpecialType;
  isNew?: boolean;
}

export interface Cell {
  x: number;
  y: number;
  candy: Candy | null;
  obstacle: ObstacleType;
  jelly: boolean; // under-tile jelly
  isMatched?: boolean;
  isZapTarget?: boolean;
}

export type ObjectiveType = 'score' | 'jellies' | 'color' | 'color-bomb' | 'fish' | 'waffle';

export interface LevelObjective {
  type: ObjectiveType;
  target: number;
  color?: CandyColor;
  description: string;
}

export interface LevelConfig {
  id: number;
  name: string;
  moves: number;
  targetScore: number;
  starThresholds: [number, number, number];
  objective: LevelObjective;
  gridWidth: number;
  gridHeight: number;
  initialObstacles?: { x: number; y: number; type: ObstacleType }[];
  jellyTiles?: { x: number; y: number }[];
}

export interface ActiveEffect {
  id: string;
  type: 'lightning' | 'laser-h' | 'laser-v' | 'explosion' | 'fish-swim' | 'score-popup' | 'color-bomb' | 'rainbow-burst';
  x: number;
  y: number;
  targetX?: number;
  targetY?: number;
  text?: string;
  color?: string;
}
