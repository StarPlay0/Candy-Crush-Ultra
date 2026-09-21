'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Candy, Cell, CandyColor, SpecialType, LevelConfig, ActiveEffect, ObstacleType } from '@/lib/game-types';
import { sound } from '@/lib/audio';
import { haptics } from '@/lib/haptics';

const COLORS: CandyColor[] = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
const generateId = () => 'candy_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

export interface ScorePopup {
  id: string;
  x: number;
  y: number;
  score: number;
  text?: string;
  color?: string;
}

export interface TrailNode {
  x: number;
  y: number;
}

export interface CandyParticle {
  id: string;
  x: number;
  y: number;
  color: string;
  dx: number;
  dy: number;
  size: number;
  rotation: number;
  shape: 'shard' | 'sparkle' | 'circle' | 'star';
  delay: number;
}

export interface CrushShockwave {
  id: string;
  x: number;
  y: number;
  color: string;
}

export interface ComboAlert {
  id: string;
  title: string;
  count: number;
  multiplier: number;
  x: number;
  y: number;
}

const PARTICLE_COLOR_MAP: Record<CandyColor | 'rainbow', string[]> = {
  red: ['#FF1358', '#FF7096', '#FFB3C6', '#D00036', '#FFE4E6'],
  orange: ['#FF9E00', '#FFAA00', '#FF6B00', '#FFE8B2', '#FFEDD5'],
  yellow: ['#FFE600', '#FFD600', '#FFB703', '#FFFDE7', '#FEF9C3'],
  green: ['#52FF94', '#00D26A', '#52B788', '#B7E4C7', '#DCFCE7'],
  blue: ['#48CAE4', '#00B4D8', '#0077B6', '#ADE8F4', '#E0F2FE'],
  purple: ['#C77DFF', '#9D4EDD', '#F72585', '#F1C0E8', '#F3E8FF'],
  rainbow: ['#FF1358', '#FFAA00', '#FFE600', '#52FF94', '#48CAE4', '#C77DFF'],
};

// Deterministic pseudo-random number generator for SSR-hydration parity
function getSeededRandom(seed: number) {
  let s = Math.abs(seed | 0) + 1;
  return function() {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function createInitialBoard(config: LevelConfig): Cell[][] {
  const width = config.gridWidth;
  const height = config.gridHeight;
  const newBoard: Cell[][] = [];

  const jellyMap = new Set<string>();
  config.jellyTiles?.forEach(t => jellyMap.add(`${t.x},${t.y}`));

  const obstacleMap = new Map<string, ObstacleType>();
  config.initialObstacles?.forEach(o => obstacleMap.set(`${o.x},${o.y}`, o.type));

  // Deterministic seeded generator ensures identical layout across server SSR/SSG and client hydration
  const rng = getSeededRandom(config.id * 10007 + width * 31 + height);
  const getSeededColor = () => COLORS[Math.floor(rng() * COLORS.length)];

  for (let y = 0; y < height; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < width; x++) {
      const key = `${x},${y}`;
      const obstacle = obstacleMap.get(key) || 'none';
      const hasJelly = jellyMap.has(key);

      let color = getSeededColor();
      // Avoid initial 3-in-a-row lines on startup
      while (
        (x >= 2 && row[x - 1]?.candy?.color === color && row[x - 2]?.candy?.color === color) ||
        (y >= 2 && newBoard[y - 1]?.[x]?.candy?.color === color && newBoard[y - 2]?.[x]?.candy?.color === color)
      ) {
        color = getSeededColor();
      }

      // Starting signature special candies on certain levels
      let special: SpecialType = 'none';
      let candyColor: CandyColor | 'rainbow' = color;

      if (config.id === 125 && x === 4 && y === 4) {
        candyColor = 'rainbow';
        special = 'color-bomb';
      } else if (config.id === 134 && x === 3 && y === 3) {
        candyColor = 'rainbow';
        special = 'color-bomb';
      }

      row.push({
        x,
        y,
        candy: {
          id: `candy_init_${config.id}_${x}_${y}`,
          color: candyColor,
          special,
        },
        obstacle,
        jelly: hasJelly,
      });
    }
    newBoard.push(row);
  }
  return newBoard;
}

export function useMatch3Engine(config: LevelConfig, onLevelComplete?: (stars: number, score: number) => void) {
  const [board, setBoard] = useState<Cell[][]>(() => createInitialBoard(config));
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(config.moves);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeEffects, setActiveEffects] = useState<ActiveEffect[]>([]);
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);
  const [particles, setParticles] = useState<CandyParticle[]>([]);
  const [shockwaves, setShockwaves] = useState<CrushShockwave[]>([]);
  const [lastMoveDeduction, setLastMoveDeduction] = useState<number | null>(null);
  const [objectiveProgress, setObjectiveProgress] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [activeBooster, setActiveBooster] = useState<'hammer' | 'switch' | null>(null);
  const [switchFirstCell, setSwitchFirstCell] = useState<{ x: number; y: number } | null>(null);
  const [highlightedMatches, setHighlightedMatches] = useState<{ x: number; y: number; color?: CandyColor | 'rainbow' }[]>([]);
  const [comboAlert, setComboAlert] = useState<ComboAlert | null>(null);

  // Selected cell for tap-to-swap
  const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>(null);

  // Trigger combo alert banner
  const triggerComboPopup = useCallback((title: string, count: number, multiplier: number, x: number, y: number) => {
    const id = generateId();
    setComboAlert({ id, title, count, multiplier, x, y });
    sound.playCombo(multiplier);
    setTimeout(() => {
      setComboAlert(prev => (prev?.id === id ? null : prev));
    }, 1500);
  }, []);

  // Trail Connection States
  const [trail, setTrail] = useState<TrailNode[]>([]);
  const [isDraggingTrail, setIsDraggingTrail] = useState(false);
  const [trailColor, setTrailColor] = useState<CandyColor | 'rainbow' | null>(null);
  const [hintTrail, setHintTrail] = useState<TrailNode[] | null>(null);

  const isMountedRef = useRef(true);
  const hasTriggeredWinRef = useRef(false);
  const boardContainerRef = useRef<HTMLDivElement | null>(null);
  const lastActivityRef = useRef<number>(0);
  const dragStartRef = useRef<{ clientX: number; clientY: number; cellX: number; cellY: number } | null>(null);
  const isSwappingRef = useRef(false);

  // Spawn visual candy crush particles & shockwaves with lightweight footprint
  const spawnCrushParticles = useCallback((nodes: { x: number; y: number; color?: CandyColor | 'rainbow' }[]) => {
    const newParticles: CandyParticle[] = [];
    const newShockwaves: CrushShockwave[] = [];

    nodes.slice(0, 3).forEach(node => {
      const colorKey = node.color || 'red';
      const palette = PARTICLE_COLOR_MAP[colorKey] || PARTICLE_COLOR_MAP.red;

      // Shockwave at node
      newShockwaves.push({
        id: generateId(),
        x: node.x,
        y: node.y,
        color: palette[0],
      });

      // 4 particles per crushed candy with randomized radial velocities
      const particleCount = 4;
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() * 0.4 - 0.2);
        const speed = 25 + Math.random() * 35;
        const color = palette[Math.floor(Math.random() * palette.length)];
        const shapes: CandyParticle['shape'][] = ['shard', 'sparkle', 'circle', 'star'];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];

        newParticles.push({
          id: generateId(),
          x: node.x,
          y: node.y,
          color,
          dx: Math.cos(angle) * speed,
          dy: Math.sin(angle) * speed,
          size: 5 + Math.random() * 4,
          rotation: Math.random() * 180,
          shape,
          delay: 0,
        });
      }
    });

    setParticles(prev => [...prev.slice(-2), ...newParticles].slice(0, 5));
    setShockwaves(prev => [...prev.slice(-1), ...newShockwaves].slice(0, 2));

    setTimeout(() => {
      setParticles([]);
      setShockwaves([]);
    }, 250);
  }, []);

  // Initialize board from level configuration
  const initBoard = useCallback(() => {
    setBoard(createInitialBoard(config));
    setScore(0);
    setMoves(config.moves);
    setIsProcessing(false);
    setIsPaused(false);
    setSelectedCell(null);
    setTrail([]);
    setIsDraggingTrail(false);
    setTrailColor(null);
    setHintTrail(null);
    setActiveEffects([]);
    setScorePopups([]);
    setParticles([]);
    setShockwaves([]);
    setLastMoveDeduction(null);
    setObjectiveProgress(0);
    setIsWon(false);
    setIsGameOver(false);
    setComboMultiplier(1);
    setActiveBooster(null);
    setSwitchFirstCell(null);
    setHighlightedMatches([]);
    setComboAlert(null);
    hasTriggeredWinRef.current = false;
    lastActivityRef.current = Date.now();
    isSwappingRef.current = false;
  }, [config]);

  // Find natural automatic matches (for classic match-3 lines & cascades)
  const findGridMatches = useCallback((b: Cell[][]): {
    matches: { x: number; y: number }[];
    matchGroups: { x: number; y: number }[][];
  } => {
    const width = config.gridWidth;
    const height = config.gridHeight;
    const matchedSet = new Set<string>();
    const matchGroups: { x: number; y: number }[][] = [];

    // Horizontal scan
    for (let y = 0; y < height; y++) {
      let matchLength = 1;
      for (let x = 0; x < width; x++) {
        const current = b[y][x]?.candy;
        const next = x < width - 1 ? b[y][x + 1]?.candy : null;

        if (
          current &&
          next &&
          current.color !== 'rainbow' &&
          current.color === next.color &&
          b[y][x].obstacle === 'none' &&
          b[y][x + 1].obstacle === 'none'
        ) {
          matchLength++;
        } else {
          if (matchLength >= 3) {
            const group: { x: number; y: number }[] = [];
            for (let i = 0; i < matchLength; i++) {
              const mx = x - i;
              matchedSet.add(`${mx},${y}`);
              group.push({ x: mx, y });
            }
            matchGroups.push(group);
          }
          matchLength = 1;
        }
      }
    }

    // Vertical scan
    for (let x = 0; x < width; x++) {
      let matchLength = 1;
      for (let y = 0; y < height; y++) {
        const current = b[y][x]?.candy;
        const next = y < height - 1 ? b[y + 1]?.[x]?.candy : null;

        if (
          current &&
          next &&
          current.color !== 'rainbow' &&
          current.color === next.color &&
          b[y][x].obstacle === 'none' &&
          b[y + 1][x].obstacle === 'none'
        ) {
          matchLength++;
        } else {
          if (matchLength >= 3) {
            const group: { x: number; y: number }[] = [];
            for (let i = 0; i < matchLength; i++) {
              const my = y - i;
              matchedSet.add(`${x},${my}`);
              group.push({ x, y: my });
            }
            matchGroups.push(group);
          }
          matchLength = 1;
        }
      }
    }

    const matches = Array.from(matchedSet).map(key => {
      const [x, y] = key.split(',').map(Number);
      return { x, y };
    });

    return { matches, matchGroups };
  }, [config]);

  // Find a valid potential move across the board (for HINT button & 5s idle highlight)
  const findPotentialMove = useCallback((currentBoard: Cell[][]): TrailNode[] | null => {
    const width = config.gridWidth;
    const height = config.gridHeight;

    // Check potential orthogonal swaps that would produce a 3+ match
    const deltas = [
      [1, 0],
      [0, 1],
    ];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        for (const [dx, dy] of deltas) {
          const x2 = x + dx;
          const y2 = y + dy;
          if (x2 >= width || y2 >= height) continue;

          const c1 = currentBoard[y]?.[x];
          const c2 = currentBoard[y2]?.[x2];
          if (!c1?.candy || !c2?.candy) continue;
          if (c1.obstacle !== 'none' || c2.obstacle !== 'none') continue;

          // Color bomb swap is always valid
          if (c1.candy.color === 'rainbow' || c2.candy.color === 'rainbow') {
            return [{ x, y }, { x: x2, y: y2 }, { x, y }];
          }

          // Test swap on virtual board
          const tempBoard = currentBoard.map(row => row.map(cell => ({ ...cell })));
          const tempCandy = tempBoard[y][x].candy;
          tempBoard[y][x].candy = tempBoard[y2][x2].candy;
          tempBoard[y2][x2].candy = tempCandy;

          const { matches } = findGridMatches(tempBoard);
          if (matches.length >= 3) {
            return [{ x, y }, { x: x2, y: y2 }, ...matches.slice(0, 2)];
          }
        }
      }
    }

    // Fallback: 8-way matching trail
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const candy = currentBoard[y]?.[x]?.candy;
        if (!candy) continue;
        const color = candy.color;
        const neighbors: { x: number; y: number }[] = [];

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const nCandy = currentBoard[ny]?.[nx]?.candy;
              if (nCandy && (nCandy.color === color || nCandy.color === 'rainbow')) {
                neighbors.push({ x: nx, y: ny });
              }
            }
          }
        }

        if (neighbors.length >= 2) {
          return [{ x, y }, neighbors[0], neighbors[1]];
        }
      }
    }

    return null;
  }, [config, findGridMatches]);

  // Manually trigger a hint
  const triggerHint = useCallback(() => {
    if (isProcessing || isPaused || isWon || isGameOver || moves <= 0) return false;
    const potential = findPotentialMove(board);
    if (potential && potential.length >= 2) {
      setHintTrail(potential);
      sound.playHint();
      haptics.hint();
      lastActivityRef.current = Date.now();
      return true;
    }
    return false;
  }, [board, isProcessing, isPaused, isWon, isGameOver, moves, findPotentialMove]);

  // Clear active hint
  const clearHint = useCallback(() => {
    setHintTrail(null);
  }, []);

  // 5-Second Auto Idle Hint Detector
  useEffect(() => {
    const idleTimer = setInterval(() => {
      if (
        isProcessing ||
        isPaused ||
        isWon ||
        isGameOver ||
        isDraggingTrail ||
        moves <= 0 ||
        hintTrail !== null
      ) {
        return;
      }

      const idleDuration = Date.now() - lastActivityRef.current;
      if (idleDuration >= 5000) {
        const potential = findPotentialMove(board);
        if (potential && potential.length >= 2) {
          setHintTrail(potential);
          sound.playHint();
          haptics.hint();
        }
      }
    }, 1000);

    return () => clearInterval(idleTimer);
  }, [
    isProcessing,
    isPaused,
    isWon,
    isGameOver,
    isDraggingTrail,
    moves,
    hintTrail,
    board,
    findPotentialMove,
  ]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Calculate Stars (1, 2, 3)
  const currentStars = score >= config.starThresholds[2] ? 3 : score >= config.starThresholds[1] ? 2 : score >= config.starThresholds[0] ? 1 : 0;

  // Add visual effects
  const addEffect = useCallback((effect: Omit<ActiveEffect, 'id'>) => {
    const id = generateId();
    setActiveEffects(prev => [...prev, { ...effect, id }]);
    setTimeout(() => {
      setActiveEffects(prev => prev.filter(e => e.id !== id));
    }, 1200);
  }, []);

  const addScorePopup = useCallback((x: number, y: number, popupScore: number, text?: string) => {
    const id = generateId();
    setScorePopups(prev => [...prev, { id, x, y, score: popupScore, text }]);
    setTimeout(() => {
      setScorePopups(prev => prev.filter(p => p.id !== id));
    }, 1200);
  }, []);

  // Check and update win/loss conditions
  const checkGameStatus = useCallback((currentScore: number, currentProgress: number, currentMoves: number) => {
    const isObjectiveMet = currentProgress >= config.objective.target || currentScore >= config.targetScore;
    if (isObjectiveMet && !hasTriggeredWinRef.current) {
      hasTriggeredWinRef.current = true;
      setIsWon(true);
      const earnedStars = currentScore >= config.starThresholds[2] ? 3 : currentScore >= config.starThresholds[1] ? 2 : 1;
      sound.playLevelWin();
      haptics.levelWin();
      onLevelComplete?.(earnedStars, currentScore);
    } else if (currentMoves <= 0 && !isObjectiveMet) {
      setIsGameOver(true);
      sound.playGameOver();
      haptics.error();
    }
  }, [config, onLevelComplete]);

  // Smooth Gravity-Based Replenishment using 2D Coordinate Grid
  const dropCandies = (b: Cell[][]): { board: Cell[][]; droppedCount: number } => {
    const width = config.gridWidth;
    const height = config.gridHeight;
    let droppedCount = 0;
    const newBoard = b.map(row => row.map(cell => ({ ...cell })));

    for (let x = 0; x < width; x++) {
      let emptyY = height - 1;

      // Scan bottom-to-top and drop existing candies into empty slots
      for (let y = height - 1; y >= 0; y--) {
        if (newBoard[y][x].obstacle === 'none' || newBoard[y][x].obstacle === 'waffle') {
          if (newBoard[y][x].candy) {
            if (emptyY !== y) {
              newBoard[emptyY][x].candy = newBoard[y][x].candy;
              newBoard[y][x].candy = null;
              droppedCount++;
            }
            emptyY--;
          }
        } else {
          emptyY = y - 1;
        }
      }

      // Fill top empty positions with fresh candies
      for (let y = emptyY; y >= 0; y--) {
        if (newBoard[y][x].obstacle === 'none') {
          newBoard[y][x].candy = {
            id: generateId(),
            color: getRandomColor(),
            special: 'none',
            isNew: true,
          };
          droppedCount++;
        }
      }
    }

    return { board: newBoard, droppedCount };
  };

  // Consecutive Cascade Feedback
  const getComboFeedback = (multiplier: number): string => {
    if (multiplier === 2) return 'SWEET! x2';
    if (multiplier === 3) return 'TASTY! x3';
    if (multiplier === 4) return 'DELICIOUS! x4';
    if (multiplier >= 5) return `DIVINE! x${multiplier}`;
    return `x${multiplier} COMBO!`;
  };

  // Process Cascades after a Move or Match
  const processCascades = async (
    currentBoard: Cell[][],
    currentAddedScore: number,
    currentAddedProgress: number,
    initialMultiplier: number = 1
  ) => {
    let b = currentBoard;
    let cascadeCount = initialMultiplier;
    let totalAddedScore = currentAddedScore;
    let totalAddedProgress = currentAddedProgress;

    while (true) {
      const dropResult = dropCandies(b);
      b = dropResult.board;
      setBoard([...b]);
      sound.playDrop();
      await new Promise(r => setTimeout(r, 30));

      const { matches, matchGroups } = findGridMatches(b);
      if (matches.length === 0) break;

      cascadeCount++;
      setComboMultiplier(cascadeCount);

      // Highlight matching candies for this cascade
      const cascadeCandiesToAnimate = matches.map(m => ({
        x: m.x,
        y: m.y,
        color: b[m.y]?.[m.x]?.candy?.color || 'yellow',
      }));
      setHighlightedMatches(cascadeCandiesToAnimate);
      setTimeout(() => setHighlightedMatches([]), 70);

      // Play satisfying multi-layer popping sound
      sound.playPop(1 + cascadeCount * 0.18, matches.length);
      haptics.connect(cascadeCount);

      // Show COMBO! popup message for matches greater than 3 or cascade chains
      if (matches.length > 3 || cascadeCount >= 2) {
        const title =
          matches.length >= 5
            ? `DIVINE COMBO! x${cascadeCount}`
            : matches.length === 4
            ? `SUPER COMBO! x${cascadeCount}`
            : `COMBO! x${cascadeCount}`;
        triggerComboPopup(title, matches.length, cascadeCount, matches[0]?.x ?? 3, matches[0]?.y ?? 3);
      }

      // Spawn particles for cascade matches
      spawnCrushParticles(cascadeCandiesToAnimate);

      const nextBoard = b.map(row => row.map(cell => ({ ...cell })));
      const baseMatchScore = matches.length * 60;
      const matchScore = baseMatchScore * cascadeCount;
      totalAddedScore += matchScore;

      const primaryCoord = matches[0];
      if (primaryCoord) {
        addScorePopup(
          primaryCoord.x,
          primaryCoord.y,
          matchScore,
          getComboFeedback(cascadeCount)
        );
      }

      // Check special candy creation during cascade (4 in line -> striped, 5 in line -> color bomb)
      matchGroups.forEach(group => {
        if (group.length === 4) {
          const center = group[1] || group[0];
          const candyColor = b[center.y]?.[center.x]?.candy?.color || 'red';
          const isHoriz = group[0].y === group[1].y;
          nextBoard[center.y][center.x].candy = {
            id: generateId(),
            color: candyColor,
            special: isHoriz ? 'striped-h' : 'striped-v',
          };
          addEffect({ type: 'explosion', x: center.x, y: center.y });
          addScorePopup(center.x, center.y, 400, 'STRIPED CRAFT!');
        } else if (group.length >= 5) {
          const center = group[2] || group[0];
          nextBoard[center.y][center.x].candy = {
            id: generateId(),
            color: 'rainbow',
            special: 'color-bomb',
          };
          addEffect({ type: 'color-bomb', x: center.x, y: center.y });
          addScorePopup(center.x, center.y, 1000, 'COLOR BOMB!');
        }
      });

      for (const m of matches) {
        // If it was upgraded to a special candy above, preserve it
        if (nextBoard[m.y][m.x].candy && nextBoard[m.y][m.x].candy?.special !== 'none') {
          continue;
        }

        const cell = nextBoard[m.y][m.x];
        if (cell.candy) {
          if (config.objective.type === 'color' && cell.candy.color === config.objective.color) {
            totalAddedProgress++;
          }
          cell.candy = null;
        }

        if (cell.jelly) {
          cell.jelly = false;
          totalAddedScore += 100 * cascadeCount;
          if (config.objective.type === 'jellies') totalAddedProgress++;
        }
      }

      b = nextBoard;
      setBoard([...b]);
      await new Promise(r => setTimeout(r, 25));
    }

    setScore(prev => prev + totalAddedScore);
    setObjectiveProgress(prev => prev + totalAddedProgress);
    setIsProcessing(false);
    isSwappingRef.current = false;

    setTimeout(() => {
      setComboMultiplier(1);
    }, 800);

    setMoves(prevMoves => {
      const nextMoves = prevMoves - 1;
      checkGameStatus(score + totalAddedScore, objectiveProgress + totalAddedProgress, nextMoves);
      return nextMoves;
    });
  };

  // Perform Classic Swap Between Two Adjacent Cells
  const attemptSwap = async (c1: { x: number; y: number }, c2: { x: number; y: number }): Promise<boolean> => {
    if (isProcessing || isPaused || isWon || isGameOver || moves <= 0 || isSwappingRef.current) {
      return false;
    }

    const cell1 = board[c1.y]?.[c1.x];
    const cell2 = board[c2.y]?.[c2.x];
    if (!cell1?.candy || !cell2?.candy) return false;
    if (cell1.obstacle !== 'none' || cell2.obstacle !== 'none') return false;

    isSwappingRef.current = true;
    setIsProcessing(true);
    setSelectedCell(null);
    setHintTrail(null);
    lastActivityRef.current = Date.now();

    sound.playSwap();
    haptics.touch();

    // 1. Perform visually swapped board
    const swappedBoard = board.map(row => row.map(cell => ({ ...cell })));
    const tempCandy = swappedBoard[c1.y][c1.x].candy;
    swappedBoard[c1.y][c1.x].candy = swappedBoard[c2.y][c2.x].candy;
    swappedBoard[c2.y][c2.x].candy = tempCandy;

    setBoard([...swappedBoard]);
    await new Promise(r => setTimeout(r, 35));

    // 2. Check for Color Bomb Specials
    const isC1ColorBomb = cell1.candy.color === 'rainbow' || cell1.candy.special === 'color-bomb';
    const isC2ColorBomb = cell2.candy.color === 'rainbow' || cell2.candy.special === 'color-bomb';

    // A. Color Bomb + Color Bomb (Nuke entire board)
    if (isC1ColorBomb && isC2ColorBomb) {
      sound.playColorBomb();
      sound.playNuke();
      haptics.special();

      const clearedBoard = swappedBoard.map(row => row.map(cell => ({ ...cell })));
      const allCandies: { x: number; y: number; color?: CandyColor | 'rainbow' }[] = [];

      for (let y = 0; y < config.gridHeight; y++) {
        for (let x = 0; x < config.gridWidth; x++) {
          if (clearedBoard[y][x].candy) {
            allCandies.push({ x, y, color: clearedBoard[y][x].candy?.color });
            clearedBoard[y][x].candy = null;
          }
          if (clearedBoard[y][x].jelly) {
            clearedBoard[y][x].jelly = false;
          }
        }
      }

      spawnCrushParticles(allCandies);
      addEffect({ type: 'color-bomb', x: c1.x, y: c1.y });
      addEffect({ type: 'color-bomb', x: c2.x, y: c2.y });
      addScorePopup(c2.x, c2.y, 5000, 'SUPERNOVA NUKE!');

      setBoard([...clearedBoard]);
      await new Promise(r => setTimeout(r, 60));
      await processCascades(clearedBoard, 5000, allCandies.length, 2);
      return true;
    }

    // B. Single Color Bomb + Regular / Special Candy
    if (isC1ColorBomb || isC2ColorBomb) {
      const targetColor = isC1ColorBomb ? cell2.candy.color : cell1.candy.color;
      const bombPos = isC1ColorBomb ? c1 : c2;

      sound.playColorBomb();
      haptics.special();
      addEffect({ type: 'color-bomb', x: bombPos.x, y: bombPos.y });

      const nextBoard = swappedBoard.map(row => row.map(cell => ({ ...cell })));
      nextBoard[bombPos.y][bombPos.x].candy = null;

      const matchedCandies: { x: number; y: number; color?: CandyColor | 'rainbow' }[] = [];
      let clearedCount = 0;

      for (let y = 0; y < config.gridHeight; y++) {
        for (let x = 0; x < config.gridWidth; x++) {
          if (nextBoard[y][x].candy?.color === targetColor) {
            matchedCandies.push({ x, y, color: targetColor });
            nextBoard[y][x].candy = null;
            clearedCount++;
            if (nextBoard[y][x].jelly) nextBoard[y][x].jelly = false;
          }
        }
      }

      spawnCrushParticles(matchedCandies);
      const addedScore = clearedCount * 150 + 1000;
      addScorePopup(bombPos.x, bombPos.y, addedScore, 'COLOR BOMB CLEAR!');

      setBoard([...nextBoard]);
      await new Promise(r => setTimeout(r, 60));
      await processCascades(nextBoard, addedScore, clearedCount, 2);
      return true;
    }

    // 3. Check Standard Grid Matches
    const { matches, matchGroups } = findGridMatches(swappedBoard);

    if (matches.length >= 3) {
      // Valid Match!
      const candiesToAnimate = matches.map(m => ({
        x: m.x,
        y: m.y,
        color: swappedBoard[m.y]?.[m.x]?.candy?.color || 'red',
      }));

      // Highlight matched candies
      setHighlightedMatches(candiesToAnimate);
      setTimeout(() => setHighlightedMatches([]), 80);

      // Play satisfying popping sound
      sound.playPop(1.1, matches.length);
      haptics.match(matches.length);

      // Show COMBO! popup for matches greater than 3
      if (matches.length > 3) {
        const title =
          matches.length >= 5
            ? 'DIVINE COMBO!'
            : matches.length === 4
            ? 'SUPER COMBO!'
            : 'SWEET COMBO!';
        triggerComboPopup(title, matches.length, 1, c2.x, c2.y);
      }

      const nextBoard = swappedBoard.map(row => row.map(cell => ({ ...cell })));
      let addedScore = matches.length * 60;
      let addedProgress = 0;

      // Special Candy Creation
      matchGroups.forEach(group => {
        if (group.length === 4) {
          const spawnTarget = group.some(g => g.x === c2.x && g.y === c2.y) ? c2 : c1;
          const candyColor = swappedBoard[spawnTarget.y]?.[spawnTarget.x]?.candy?.color || 'red';
          const isHoriz = group[0].y === group[1].y;
          nextBoard[spawnTarget.y][spawnTarget.x].candy = {
            id: generateId(),
            color: candyColor,
            special: isHoriz ? 'striped-h' : 'striped-v',
          };
          addEffect({ type: 'explosion', x: spawnTarget.x, y: spawnTarget.y });
          addScorePopup(spawnTarget.x, spawnTarget.y, 400, 'STRIPED CRAFT!');
        } else if (group.length >= 5) {
          const spawnTarget = group.some(g => g.x === c2.x && g.y === c2.y) ? c2 : c1;
          nextBoard[spawnTarget.y][spawnTarget.x].candy = {
            id: generateId(),
            color: 'rainbow',
            special: 'color-bomb',
          };
          addEffect({ type: 'color-bomb', x: spawnTarget.x, y: spawnTarget.y });
          addScorePopup(spawnTarget.x, spawnTarget.y, 1000, 'COLOR BOMB!');
        }
      });

      const crushCandiesToAnimate = matches.map(m => ({
        x: m.x,
        y: m.y,
        color: swappedBoard[m.y]?.[m.x]?.candy?.color || 'red',
      }));
      spawnCrushParticles(crushCandiesToAnimate);

      for (const m of matches) {
        if (nextBoard[m.y][m.x].candy && nextBoard[m.y][m.x].candy?.special !== 'none') {
          continue;
        }

        const cell = nextBoard[m.y][m.x];
        if (cell.candy) {
          if (config.objective.type === 'color' && cell.candy.color === config.objective.color) {
            addedProgress++;
          }
          cell.candy = null;
        }

        if (cell.jelly) {
          cell.jelly = false;
          addedScore += 100;
          if (config.objective.type === 'jellies') addedProgress++;
        }
      }

      addScorePopup(c2.x, c2.y, addedScore, `+${addedScore}`);
      setBoard([...nextBoard]);
      await new Promise(r => setTimeout(r, 30));
      await processCascades(nextBoard, addedScore, addedProgress, 1);
      return true;
    }

    // 4. Invalid Move: Swap back smoothly!
    sound.playClick();
    haptics.error();
    await new Promise(r => setTimeout(r, 40));
    setBoard([...board]); // Reset back to original
    setIsProcessing(false);
    isSwappingRef.current = false;
    return false;
  };

  // Booster: Smash Cell with Lollipop Hammer
  const applyLollipopHammer = (x: number, y: number) => {
    if (isPaused) return;
    lastActivityRef.current = Date.now();
    setHintTrail(null);
    sound.playWrappedExplosion();
    haptics.special();
    addEffect({ type: 'explosion', x, y });

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    const targetCell = newBoard[y]?.[x];
    if (targetCell) {
      if (targetCell.candy) {
        spawnCrushParticles([{ x, y, color: targetCell.candy.color }]);
        targetCell.candy = null;
      }
      if (targetCell.jelly) {
        targetCell.jelly = false;
        setObjectiveProgress(p => p + 1);
      }
      if (targetCell.obstacle !== 'none') {
        targetCell.obstacle = 'none';
      }
    }

    addScorePopup(x, y, 500, 'HAMMER SMASH!');
    setScore(s => s + 500);
    setBoard(newBoard);
    setActiveBooster(null);
    processCascades(newBoard, 500, 1, 1);
  };

  // Booster: Free Switch Hand
  const applySwitchHand = (c1: { x: number; y: number }, c2: { x: number; y: number }) => {
    if (isPaused) return;
    lastActivityRef.current = Date.now();
    setHintTrail(null);
    sound.playSwap();
    haptics.touch();
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    const temp = newBoard[c1.y][c1.x].candy;
    newBoard[c1.y][c1.x].candy = newBoard[c2.y][c2.x].candy;
    newBoard[c2.y][c2.x].candy = temp;

    setBoard(newBoard);
    setActiveBooster(null);
    setSwitchFirstCell(null);
    processCascades(newBoard, 200, 0, 1);
  };

  // Booster: Spawn Color Bomb
  const applyColorBombBooster = () => {
    if (isPaused) return;
    lastActivityRef.current = Date.now();
    setHintTrail(null);
    sound.playColorBomb();
    haptics.special();
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    for (let y = 0; y < config.gridHeight; y++) {
      for (let x = 0; x < config.gridWidth; x++) {
        if (newBoard[y][x].candy && newBoard[y][x].candy?.special === 'none') {
          newBoard[y][x].candy = {
            id: generateId(),
            color: 'rainbow',
            special: 'color-bomb',
          };
          addEffect({ type: 'color-bomb', x, y });
          addScorePopup(x, y, 300, 'COLOR BOMB!');
          setBoard([...newBoard]);
          return;
        }
      }
    }
  };

  // Booster: +5 Moves
  const addExtraMoves = () => {
    if (isPaused) return;
    lastActivityRef.current = Date.now();
    setHintTrail(null);
    sound.playBonus();
    haptics.touch();
    setMoves(prev => prev + 5);
    setIsGameOver(false);
  };

  // Pointer Down: Start Drag Swipe or Tap Selection
  const handlePointerDown = (x: number, y: number, e: React.PointerEvent) => {
    if (isProcessing || isPaused || isWon || isGameOver || moves <= 0 || isSwappingRef.current) return;

    lastActivityRef.current = Date.now();
    setHintTrail(null);

    // Hammer booster active
    if (activeBooster === 'hammer') {
      applyLollipopHammer(x, y);
      return;
    }

    // Switch hand booster active
    if (activeBooster === 'switch') {
      if (!switchFirstCell) {
        setSwitchFirstCell({ x, y });
        sound.playClick();
        haptics.touch();
      } else {
        applySwitchHand(switchFirstCell, { x, y });
      }
      return;
    }

    const cellCandy = board[y]?.[x]?.candy;
    if (!cellCandy) return;

    // Record drag start coordinates
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      cellX: x,
      cellY: y,
    };

    // If already had a selected cell and tapped an adjacent neighbor -> trigger swap!
    if (selectedCell) {
      const dx = Math.abs(selectedCell.x - x);
      const dy = Math.abs(selectedCell.y - y);
      const isOrthogonalNeighbor = (dx === 1 && dy === 0) || (dx === 0 && dy === 1);

      if (isOrthogonalNeighbor) {
        attemptSwap(selectedCell, { x, y });
        dragStartRef.current = null;
        return;
      }
    }

    // Initialize trail connection
    setTrail([{ x, y }]);
    setIsDraggingTrail(true);
    setTrailColor(cellCandy.color);

    sound.playTrailConnect(1);
    haptics.touch();
  };

  // Pointer Move: Detect Swipe Direction (Left/Right/Up/Down) or Extend Chain Trail
  const handlePointerMove = (e: React.PointerEvent) => {
    if (isProcessing || isPaused || isWon || isGameOver || isSwappingRef.current) return;
    lastActivityRef.current = Date.now();

    // 1. Swipe Direction Detection (Candy Crush Drag to Move / Swap)
    if (dragStartRef.current) {
      const deltaX = e.clientX - dragStartRef.current.clientX;
      const deltaY = e.clientY - dragStartRef.current.clientY;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      const threshold = 5; // 5px swipe threshold for instant responsive tactile drag

      if (absX >= threshold || absY >= threshold) {
        const startX = dragStartRef.current.cellX;
        const startY = dragStartRef.current.cellY;
        let targetX = startX;
        let targetY = startY;

        if (absX > absY) {
          targetX = deltaX > 0 ? startX + 1 : startX - 1;
        } else {
          targetY = deltaY > 0 ? startY + 1 : startY - 1;
        }

        dragStartRef.current = null;
        setIsDraggingTrail(false);
        setTrail([]);

        if (targetX >= 0 && targetX < config.gridWidth && targetY >= 0 && targetY < config.gridHeight) {
          attemptSwap({ x: startX, y: startY }, { x: targetX, y: targetY });
        }
        return;
      }
    }
  };

  // Pointer Up: Finalize Tap Selection or Trail Connection
  const handlePointerUp = () => {
    if (dragStartRef.current) {
      const { cellX, cellY } = dragStartRef.current;
      dragStartRef.current = null;

      // Handle Tap Selection
      if (selectedCell && selectedCell.x === cellX && selectedCell.y === cellY) {
        setSelectedCell(null); // Deselect
      } else {
        setSelectedCell({ x: cellX, y: cellY }); // Select new candidate
        sound.playClick();
        haptics.touch();
      }
    }

    setIsDraggingTrail(false);
    setTrail([]);
    setTrailColor(null);
  };

  return {
    board,
    score,
    moves,
    isProcessing,
    isPaused,
    setIsPaused,
    objectiveProgress,
    isWon,
    isGameOver,
    currentStars,
    comboMultiplier,
    activeBooster,
    setActiveBooster,
    switchFirstCell,
    selectedCell,
    setSelectedCell,
    attemptSwap,
    trail,
    isDraggingTrail,
    trailColor,
    hintTrail,
    triggerHint,
    clearHint,
    activeEffects,
    scorePopups,
    highlightedMatches,
    comboAlert,
    particles,
    shockwaves,
    lastMoveDeduction,
    boardContainerRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    applyColorBombBooster,
    addExtraMoves,
    initBoard,
  };
}
