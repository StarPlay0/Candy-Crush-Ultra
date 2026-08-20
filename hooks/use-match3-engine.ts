'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Candy, Cell, CandyColor, SpecialType, LevelConfig, ActiveEffect, ObstacleType } from '@/lib/game-types';
import { sound } from '@/lib/audio';

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

function createInitialBoard(config: LevelConfig): Cell[][] {
  const width = config.gridWidth;
  const height = config.gridHeight;
  const newBoard: Cell[][] = [];

  const jellyMap = new Set<string>();
  config.jellyTiles?.forEach(t => jellyMap.add(`${t.x},${t.y}`));

  const obstacleMap = new Map<string, ObstacleType>();
  config.initialObstacles?.forEach(o => obstacleMap.set(`${o.x},${o.y}`, o.type));

  for (let y = 0; y < height; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < width; x++) {
      const key = `${x},${y}`;
      const obstacle = obstacleMap.get(key) || 'none';
      const hasJelly = jellyMap.has(key);

      let color = getRandomColor();
      // Prevent initial 3-in-a-row matches on start
      while (
        (x >= 2 && row[x - 1]?.candy?.color === color && row[x - 2]?.candy?.color === color) ||
        (y >= 2 && newBoard[y - 1]?.[x]?.candy?.color === color && newBoard[y - 2]?.[x]?.candy?.color === color)
      ) {
        color = getRandomColor();
      }

      // Feature special starting candy on signature levels
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
          id: generateId(),
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

interface MatchResult {
  matchedCoordinates: { x: number; y: number }[];
  specialsToCreate: { pos: { x: number; y: number }; candy: Candy }[];
}

export function useMatch3Engine(config: LevelConfig, onLevelComplete?: (stars: number, score: number) => void) {
  const [board, setBoard] = useState<Cell[][]>(() => createInitialBoard(config));
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(config.moves);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>(null);
  const [activeEffects, setActiveEffects] = useState<ActiveEffect[]>([]);
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);
  const [objectiveProgress, setObjectiveProgress] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [activeBooster, setActiveBooster] = useState<'hammer' | 'switch' | null>(null);
  const [switchFirstCell, setSwitchFirstCell] = useState<{ x: number; y: number } | null>(null);

  const pointerStartRef = useRef<{ x: number; y: number; clientX: number; clientY: number } | null>(null);
  const isMountedRef = useRef(true);
  const hasTriggeredWinRef = useRef(false);

  // Initialize board from level configuration
  const initBoard = useCallback(() => {
    setBoard(createInitialBoard(config));
    setScore(0);
    setMoves(config.moves);
    setIsProcessing(false);
    setIsPaused(false);
    setSelectedCell(null);
    setActiveEffects([]);
    setScorePopups([]);
    setObjectiveProgress(0);
    setIsWon(false);
    setIsGameOver(false);
    setComboMultiplier(1);
    setActiveBooster(null);
    setSwitchFirstCell(null);
    hasTriggeredWinRef.current = false;
  }, [config]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Calculate Stars (1, 2, 3)
  const currentStars = score >= config.starThresholds[2] ? 3 : score >= config.starThresholds[1] ? 2 : score >= config.starThresholds[0] ? 1 : 0;

  // Add floating effect / laser / lightning / score popups
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
    }, 1100);
  }, []);

  // Check and update win/loss conditions
  const checkGameStatus = useCallback((currentScore: number, currentProgress: number, currentMoves: number) => {
    const isObjectiveMet = currentProgress >= config.objective.target || currentScore >= config.targetScore;
    if (isObjectiveMet && !hasTriggeredWinRef.current) {
      hasTriggeredWinRef.current = true;
      setIsWon(true);
      const earnedStars = currentScore >= config.starThresholds[2] ? 3 : currentScore >= config.starThresholds[1] ? 2 : 1;
      sound.playSuccess();
      onLevelComplete?.(earnedStars, currentScore);
    } else if (currentMoves <= 0 && !isObjectiveMet) {
      setIsGameOver(true);
    }
  }, [config, onLevelComplete]);

  // Match Detection Engine using 2D Coordinate System (Detects 3, 4, 5 in row/col and L/T shape intersections)
  const analyzeMatches = useCallback((b: Cell[][], swapOrigin?: { x: number; y: number }): MatchResult => {
    const width = config.gridWidth;
    const height = config.gridHeight;
    const matchedCoordSet = new Set<string>();
    const horizontalMatchGroups: { color: CandyColor; coords: { x: number; y: number }[] }[] = [];
    const verticalMatchGroups: { color: CandyColor; coords: { x: number; y: number }[] }[] = [];

    // 1. Horizontal Match Detection
    for (let y = 0; y < height; y++) {
      let currentMatch: { x: number; y: number }[] = [];
      let matchColor: CandyColor | null = null;

      for (let x = 0; x < width; x++) {
        const cellCandy = b[y][x]?.candy;
        if (cellCandy && cellCandy.color !== 'rainbow') {
          if (matchColor === cellCandy.color) {
            currentMatch.push({ x, y });
          } else {
            if (currentMatch.length >= 3 && matchColor) {
              horizontalMatchGroups.push({ color: matchColor, coords: [...currentMatch] });
            }
            currentMatch = [{ x, y }];
            matchColor = cellCandy.color;
          }
        } else {
          if (currentMatch.length >= 3 && matchColor) {
            horizontalMatchGroups.push({ color: matchColor, coords: [...currentMatch] });
          }
          currentMatch = [];
          matchColor = null;
        }
      }
      if (currentMatch.length >= 3 && matchColor) {
        horizontalMatchGroups.push({ color: matchColor, coords: [...currentMatch] });
      }
    }

    // 2. Vertical Match Detection
    for (let x = 0; x < width; x++) {
      let currentMatch: { x: number; y: number }[] = [];
      let matchColor: CandyColor | null = null;

      for (let y = 0; y < height; y++) {
        const cellCandy = b[y][x]?.candy;
        if (cellCandy && cellCandy.color !== 'rainbow') {
          if (matchColor === cellCandy.color) {
            currentMatch.push({ x, y });
          } else {
            if (currentMatch.length >= 3 && matchColor) {
              verticalMatchGroups.push({ color: matchColor, coords: [...currentMatch] });
            }
            currentMatch = [{ x, y }];
            matchColor = cellCandy.color;
          }
        } else {
          if (currentMatch.length >= 3 && matchColor) {
            verticalMatchGroups.push({ color: matchColor, coords: [...currentMatch] });
          }
          currentMatch = [];
          matchColor = null;
        }
      }
      if (currentMatch.length >= 3 && matchColor) {
        verticalMatchGroups.push({ color: matchColor, coords: [...currentMatch] });
      }
    }

    const specialsToCreate: { pos: { x: number; y: number }; candy: Candy }[] = [];

    // 3. Detect L and T Intersections (creates Wrapped Candies)
    for (const hGroup of horizontalMatchGroups) {
      for (const vGroup of verticalMatchGroups) {
        if (hGroup.color === vGroup.color) {
          // Find intersection cell
          const intersection = hGroup.coords.find(hc => vGroup.coords.some(vc => vc.x === hc.x && vc.y === hc.y));
          if (intersection) {
            specialsToCreate.push({
              pos: intersection,
              candy: {
                id: generateId(),
                color: hGroup.color,
                special: 'wrapped',
              },
            });
          }
        }
      }
    }

    // 4. Detect 5-in-a-line (creates Color Bomb "Rainbow Ball") and 4-in-a-line (creates Striped)
    for (const hGroup of horizontalMatchGroups) {
      hGroup.coords.forEach(c => matchedCoordSet.add(`${c.x},${c.y}`));
      const targetPos = swapOrigin && hGroup.coords.some(c => c.x === swapOrigin.x && c.y === swapOrigin.y)
        ? swapOrigin
        : hGroup.coords[Math.floor(hGroup.coords.length / 2)];

      if (hGroup.coords.length >= 5) {
        specialsToCreate.push({
          pos: targetPos,
          candy: { id: generateId(), color: 'rainbow', special: 'color-bomb' },
        });
      } else if (hGroup.coords.length === 4) {
        specialsToCreate.push({
          pos: targetPos,
          candy: { id: generateId(), color: hGroup.color, special: 'striped-v' },
        });
      }
    }

    for (const vGroup of verticalMatchGroups) {
      vGroup.coords.forEach(c => matchedCoordSet.add(`${c.x},${c.y}`));
      const targetPos = swapOrigin && vGroup.coords.some(c => c.x === swapOrigin.x && c.y === swapOrigin.y)
        ? swapOrigin
        : vGroup.coords[Math.floor(vGroup.coords.length / 2)];

      if (vGroup.coords.length >= 5) {
        if (!specialsToCreate.some(s => s.pos.x === targetPos.x && s.pos.y === targetPos.y)) {
          specialsToCreate.push({
            pos: targetPos,
            candy: { id: generateId(), color: 'rainbow', special: 'color-bomb' },
          });
        }
      } else if (vGroup.coords.length === 4) {
        if (!specialsToCreate.some(s => s.pos.x === targetPos.x && s.pos.y === targetPos.y)) {
          specialsToCreate.push({
            pos: targetPos,
            candy: { id: generateId(), color: vGroup.color, special: 'striped-h' },
          });
        }
      }
    }

    const matchedCoordinates = Array.from(matchedCoordSet).map(key => {
      const [x, y] = key.split(',').map(Number);
      return { x, y };
    });

    return { matchedCoordinates, specialsToCreate };
  }, [config]);

  // Execute Special Combos
  const executeSpecialCombo = async (
    c1: { x: number; y: number },
    c2: { x: number; y: number },
    candy1: Candy,
    candy2: Candy,
    b: Cell[][]
  ) => {
    setIsProcessing(true);
    let newBoard = b.map(row => row.map(cell => ({ ...cell })));
    let addedScore = 0;
    let addedProgress = 0;

    // COMBO 1: COLOR BOMB + COLOR BOMB (Screen Nuke)
    if (
      (candy1.special === 'color-bomb' || candy1.color === 'rainbow') &&
      (candy2.special === 'color-bomb' || candy2.color === 'rainbow')
    ) {
      sound.playNuke();
      addScorePopup(c2.x, c2.y, 2500, 'COSMIC NUKE!');

      for (let y = 0; y < config.gridHeight; y++) {
        for (let x = 0; x < config.gridWidth; x++) {
          addEffect({ type: 'lightning', x: c1.x, y: c1.y, targetX: x, targetY: y });
          if (newBoard[y][x].candy) {
            addedScore += 60;
            if (config.objective.type === 'color' && newBoard[y][x].candy?.color === config.objective.color) {
              addedProgress++;
            }
            newBoard[y][x].candy = null;
          }
          if (newBoard[y][x].jelly) {
            newBoard[y][x].jelly = false;
            addedScore += 100;
            if (config.objective.type === 'jellies') addedProgress++;
          }
        }
      }
      setBoard([...newBoard]);
      await new Promise(r => setTimeout(r, 600));
    }
    // COMBO 2: COLOR BOMB + ANY CANDY (Multi-Beam Lightning Zap)
    else if (
      (candy1.special === 'color-bomb' || candy1.color === 'rainbow') ||
      (candy2.special === 'color-bomb' || candy2.color === 'rainbow')
    ) {
      const bombPos = candy1.color === 'rainbow' || candy1.special === 'color-bomb' ? c1 : c2;
      const otherCandy = candy1.color === 'rainbow' || candy1.special === 'color-bomb' ? candy2 : candy1;
      const targetColor = otherCandy.color !== 'rainbow' ? otherCandy.color : 'red';
      const isOtherStriped = otherCandy.special.startsWith('striped');

      sound.playColorBomb();
      addScorePopup(bombPos.x, bombPos.y, 800, 'COLOR BOMB!');

      // Find all candies of target color and create lightning arcs
      const targetPositions: { x: number; y: number }[] = [];
      for (let y = 0; y < config.gridHeight; y++) {
        for (let x = 0; x < config.gridWidth; x++) {
          if (newBoard[y][x].candy?.color === targetColor) {
            targetPositions.push({ x, y });
            addEffect({ type: 'lightning', x: bombPos.x, y: bombPos.y, targetX: x, targetY: y });
          }
        }
      }

      // Remove the color bomb cell
      newBoard[bombPos.y][bombPos.x].candy = null;
      setBoard([...newBoard]);
      await new Promise(r => setTimeout(r, 450));

      if (isOtherStriped) {
        // Transform and detonate
        for (const pos of targetPositions) {
          const stripeType: SpecialType = (pos.x + pos.y) % 2 === 0 ? 'striped-h' : 'striped-v';
          sound.playLaser();
          if (stripeType === 'striped-h') {
            addEffect({ type: 'laser-h', x: pos.x, y: pos.y });
            for (let nx = 0; nx < config.gridWidth; nx++) {
              if (newBoard[pos.y][nx].candy) {
                addedScore += 60;
                newBoard[pos.y][nx].candy = null;
              }
            }
          } else {
            addEffect({ type: 'laser-v', x: pos.x, y: pos.y });
            for (let ny = 0; ny < config.gridHeight; ny++) {
              if (newBoard[ny][pos.x].candy) {
                addedScore += 60;
                newBoard[ny][pos.x].candy = null;
              }
            }
          }
        }
      } else {
        // Clear all of target color
        for (const pos of targetPositions) {
          if (newBoard[pos.y][pos.x].candy) {
            addedScore += 60;
            if (config.objective.type === 'color' && newBoard[pos.y][pos.x].candy?.color === config.objective.color) {
              addedProgress++;
            }
            newBoard[pos.y][pos.x].candy = null;
          }
        }
      }

      setBoard([...newBoard]);
      await new Promise(r => setTimeout(r, 400));
    }
    // COMBO 3: STRIPED + WRAPPED (Giant 3-line cross laser)
    else if (
      (candy1.special.startsWith('striped') && candy2.special === 'wrapped') ||
      (candy2.special.startsWith('striped') && candy1.special === 'wrapped')
    ) {
      sound.playLaser();
      sound.playWrappedExplosion();
      const centerX = c2.x;
      const centerY = c2.y;
      addScorePopup(centerX, centerY, 600, 'CROSS BLAST!');

      for (let dy = -1; dy <= 1; dy++) {
        const py = centerY + dy;
        if (py >= 0 && py < config.gridHeight) {
          addEffect({ type: 'laser-h', x: centerX, y: py });
          for (let px = 0; px < config.gridWidth; px++) {
            if (newBoard[py][px].candy) {
              addedScore += 60;
              newBoard[py][px].candy = null;
            }
          }
        }
      }
      for (let dx = -1; dx <= 1; dx++) {
        const px = centerX + dx;
        if (px >= 0 && px < config.gridWidth) {
          addEffect({ type: 'laser-v', x: px, y: centerY });
          for (let py = 0; py < config.gridHeight; py++) {
            if (newBoard[py][px].candy) {
              addedScore += 60;
              newBoard[py][px].candy = null;
            }
          }
        }
      }
      setBoard([...newBoard]);
      await new Promise(r => setTimeout(r, 450));
    }
    // COMBO 4: STRIPED + STRIPED (Cross Laser)
    else if (candy1.special.startsWith('striped') && candy2.special.startsWith('striped')) {
      sound.playLaser();
      addEffect({ type: 'laser-h', x: c2.x, y: c2.y });
      addEffect({ type: 'laser-v', x: c2.x, y: c2.y });
      addScorePopup(c2.x, c2.y, 400, 'CROSS LASER!');

      for (let px = 0; px < config.gridWidth; px++) {
        if (newBoard[c2.y][px].candy) {
          addedScore += 60;
          newBoard[c2.y][px].candy = null;
        }
      }
      for (let py = 0; py < config.gridHeight; py++) {
        if (newBoard[py][c2.x].candy) {
          addedScore += 60;
          newBoard[py][c2.x].candy = null;
        }
      }
      setBoard([...newBoard]);
      await new Promise(r => setTimeout(r, 400));
    }
    // COMBO 5: WRAPPED + WRAPPED (Massive 5x5 explosion)
    else if (candy1.special === 'wrapped' && candy2.special === 'wrapped') {
      sound.playWrappedExplosion();
      addEffect({ type: 'explosion', x: c2.x, y: c2.y });
      addScorePopup(c2.x, c2.y, 500, 'MEGA BOMB!');

      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const px = c2.x + dx;
          const py = c2.y + dy;
          if (px >= 0 && px < config.gridWidth && py >= 0 && py < config.gridHeight) {
            if (newBoard[py][px].candy) {
              addedScore += 60;
              newBoard[py][px].candy = null;
            }
          }
        }
      }
      setBoard([...newBoard]);
      await new Promise(r => setTimeout(r, 450));
    }

    setScore(prev => prev + addedScore);
    setObjectiveProgress(prev => prev + addedProgress);
    await processCascades(newBoard, addedScore, addedProgress, 1);
  };

  // Smooth Gravity-Based Replenishment using 2D Coordinate Grid
  const dropCandies = (b: Cell[][]): { board: Cell[][]; droppedCount: number } => {
    const width = config.gridWidth;
    const height = config.gridHeight;
    let droppedCount = 0;
    const newBoard = b.map(row => row.map(cell => ({ ...cell })));

    for (let x = 0; x < width; x++) {
      let emptyY = height - 1;

      // Scan from bottom to top and shift existing candies down into empty spaces
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

      // Fill empty coordinate positions at top with brand new candies
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

  // Consecutive Match Combo Phrases
  const getComboFeedback = (multiplier: number): string => {
    if (multiplier === 2) return 'SWEET! x2';
    if (multiplier === 3) return 'TASTY! x3';
    if (multiplier === 4) return 'DELICIOUS! x4';
    if (multiplier >= 5) return `DIVINE! x${multiplier}`;
    return `x${multiplier} COMBO!`;
  };

  // Handle Cascading Matches Loop with Multipliers & Popping Sounds
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
      await new Promise(r => setTimeout(r, 260));

      const { matchedCoordinates, specialsToCreate } = analyzeMatches(b);
      if (matchedCoordinates.length === 0) break;

      cascadeCount++;
      setComboMultiplier(cascadeCount);
      
      // Play satisfying pop sound with progressive pitch ladder
      sound.playPop(1 + cascadeCount * 0.18);
      sound.playMatch(cascadeCount);

      const nextBoard = b.map(row => row.map(cell => ({ ...cell })));
      
      // Dynamic Combo Multiplier Bonus
      const baseMatchScore = matchedCoordinates.length * 60;
      const matchScore = baseMatchScore * cascadeCount;
      totalAddedScore += matchScore;

      const primaryCoord = matchedCoordinates[0];
      if (primaryCoord) {
        addScorePopup(
          primaryCoord.x,
          primaryCoord.y,
          matchScore,
          getComboFeedback(cascadeCount)
        );
      }

      for (const m of matchedCoordinates) {
        const cell = nextBoard[m.y][m.x];
        if (cell.candy) {
          if (config.objective.type === 'color' && cell.candy.color === config.objective.color) {
            totalAddedProgress++;
          }
          cell.candy = null;
        }

        // Damage jelly / obstacles
        if (cell.jelly) {
          cell.jelly = false;
          totalAddedScore += 100 * cascadeCount;
          if (config.objective.type === 'jellies') totalAddedProgress++;
        }
      }

      // Insert newly generated special candies
      for (const spec of specialsToCreate) {
        nextBoard[spec.pos.y][spec.pos.x].candy = spec.candy;
      }

      b = nextBoard;
      setBoard([...b]);
      await new Promise(r => setTimeout(r, 220));
    }

    setScore(prev => prev + totalAddedScore);
    setObjectiveProgress(prev => prev + totalAddedProgress);
    setIsProcessing(false);
    
    // Briefly hold combo multiplier for visual satisfaction before reset
    setTimeout(() => {
      setComboMultiplier(1);
    }, 1200);

    setMoves(prevMoves => {
      const nextMoves = prevMoves - 1;
      checkGameStatus(score + totalAddedScore, objectiveProgress + totalAddedProgress, nextMoves);
      return nextMoves;
    });
  };

  // Swap Two Adjacent Cells with Coordinate Validation
  const swapCells = async (c1: { x: number; y: number }, c2: { x: number; y: number }) => {
    if (isProcessing || isPaused || moves <= 0 || isWon || isGameOver) return;

    // Strict Orthogonal Adjacency Check: |x1 - x2| + |y1 - y2| === 1
    const isAdjacent = Math.abs(c1.x - c2.x) + Math.abs(c1.y - c2.y) === 1;
    if (!isAdjacent) {
      sound.playInvalid();
      return;
    }

    const candy1 = board[c1.y]?.[c1.x]?.candy;
    const candy2 = board[c2.y]?.[c2.x]?.candy;

    if (!candy1 || !candy2) return;

    // Check if either is a Special Candy or Color Bomb combo
    const isSpecial1 = candy1.special !== 'none' || candy1.color === 'rainbow';
    const isSpecial2 = candy2.special !== 'none' || candy2.color === 'rainbow';

    if (isSpecial1 || isSpecial2) {
      await executeSpecialCombo(c1, c2, candy1, candy2, board);
      return;
    }

    // Standard Swap
    setIsProcessing(true);
    sound.playSwap();

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    newBoard[c1.y][c1.x].candy = candy2;
    newBoard[c2.y][c2.x].candy = candy1;

    setBoard([...newBoard]);
    await new Promise(r => setTimeout(r, 220));

    const { matchedCoordinates, specialsToCreate } = analyzeMatches(newBoard, c2);

    if (matchedCoordinates.length === 0) {
      // Invalid swap - Revert coordinates with invalid audio cue
      sound.playInvalid();
      newBoard[c1.y][c1.x].candy = candy1;
      newBoard[c2.y][c2.x].candy = candy2;
      setBoard([...newBoard]);
      setIsProcessing(false);
      return;
    }

    // Valid Match!
    sound.playPop(1);
    sound.playMatch(1);
    let addedScore = matchedCoordinates.length * 60;
    let addedProgress = 0;

    addScorePopup(c2.x, c2.y, addedScore, `+${addedScore}`);

    // Clear matched candies
    const boardAfterMatch = newBoard.map(row => row.map(cell => ({ ...cell })));
    for (const m of matchedCoordinates) {
      const cell = boardAfterMatch[m.y][m.x];
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

    // Spawn special candies created from 4 or 5-matches
    for (const spec of specialsToCreate) {
      boardAfterMatch[spec.pos.y][spec.pos.x].candy = spec.candy;
      if (spec.candy.special === 'color-bomb') sound.playColorBomb();
      if (spec.candy.special.startsWith('striped')) sound.playStriped();
      if (spec.candy.special === 'wrapped') sound.playWrappedExplosion();
    }

    setBoard([...boardAfterMatch]);
    await processCascades(boardAfterMatch, addedScore, addedProgress, 1);
  };

  // Booster: Smash Cell with Lollipop Hammer
  const applyLollipopHammer = (x: number, y: number) => {
    if (isPaused) return;
    sound.playWrappedExplosion();
    addEffect({ type: 'explosion', x, y });
    addScorePopup(x, y, 150, 'HAMMER SMASH!');

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    const targetCell = newBoard[y][x];

    let addedScore = 150;
    let addedProgress = 0;

    if (targetCell.candy) {
      if (config.objective.type === 'color' && targetCell.candy.color === config.objective.color) {
        addedProgress++;
      }
      targetCell.candy = null;
    }
    if (targetCell.obstacle !== 'none') {
      targetCell.obstacle = 'none';
      if (config.objective.type === 'waffle') addedProgress++;
    }
    if (targetCell.jelly) {
      targetCell.jelly = false;
      if (config.objective.type === 'jellies') addedProgress++;
    }

    setBoard([...newBoard]);
    setScore(prev => prev + addedScore);
    setObjectiveProgress(prev => prev + addedProgress);
    setActiveBooster(null);

    processCascades(newBoard, addedScore, addedProgress, 1);
  };

  // Booster: Free Switch Hand
  const applySwitchHand = (c1: { x: number; y: number }, c2: { x: number; y: number }) => {
    if (isPaused) return;
    sound.playSwap();
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    const temp = newBoard[c1.y][c1.x].candy;
    newBoard[c1.y][c1.x].candy = newBoard[c2.y][c2.x].candy;
    newBoard[c2.y][c2.x].candy = temp;

    setBoard([...newBoard]);
    setActiveBooster(null);
    setSwitchFirstCell(null);
  };

  // Booster: Spawn Color Bomb on Board
  const useColorBombBooster = () => {
    if (isPaused) return;
    sound.playColorBomb();
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    for (let y = config.gridHeight - 1; y >= 0; y--) {
      for (let x = 0; x < config.gridWidth; x++) {
        if (newBoard[y][x].candy && newBoard[y][x].candy?.special === 'none') {
          newBoard[y][x].candy = {
            id: generateId(),
            color: 'rainbow',
            special: 'color-bomb',
          };
          addEffect({ type: 'lightning', x, y, targetX: x, targetY: y });
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
    sound.playBonus();
    setMoves(prev => prev + 5);
    setIsGameOver(false);
  };

  // Cell Interaction Handlers (Click + Drag/Swipe)
  const handlePointerDown = (x: number, y: number, e: React.PointerEvent) => {
    if (isProcessing || isPaused || isWon || isGameOver) return;
    pointerStartRef.current = { x, y, clientX: e.clientX, clientY: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointerStartRef.current || isProcessing || isPaused || isWon || isGameOver) return;

    const deltaX = e.clientX - pointerStartRef.current.clientX;
    const deltaY = e.clientY - pointerStartRef.current.clientY;
    const threshold = 26;

    if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
      const fromX = pointerStartRef.current.x;
      const fromY = pointerStartRef.current.y;
      let toX = fromX;
      let toY = fromY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        toX += deltaX > 0 ? 1 : -1;
      } else {
        toY += deltaY > 0 ? 1 : -1;
      }

      pointerStartRef.current = null;
      if (toX >= 0 && toX < config.gridWidth && toY >= 0 && toY < config.gridHeight) {
        swapCells({ x: fromX, y: fromY }, { x: toX, y: toY });
      }
    }
  };

  const handlePointerUp = () => {
    pointerStartRef.current = null;
  };

  const handleCellClick = (x: number, y: number) => {
    if (isProcessing || isPaused || isWon || isGameOver) return;

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
      } else {
        applySwitchHand(switchFirstCell, { x, y });
      }
      return;
    }

    // Regular tap-to-swap
    if (!selectedCell) {
      setSelectedCell({ x, y });
      sound.playClick();
    } else {
      const isAdjacent =
        (Math.abs(selectedCell.x - x) === 1 && selectedCell.y === y) ||
        (Math.abs(selectedCell.y - y) === 1 && selectedCell.x === x);

      if (isAdjacent) {
        swapCells(selectedCell, { x, y });
        setSelectedCell(null);
      } else {
        setSelectedCell({ x, y });
        sound.playClick();
      }
    }
  };

  return {
    board,
    score,
    moves,
    isProcessing,
    isPaused,
    setIsPaused,
    selectedCell,
    activeEffects,
    scorePopups,
    objectiveProgress,
    currentStars,
    isWon,
    isGameOver,
    comboMultiplier,
    activeBooster,
    switchFirstCell,
    setActiveBooster,
    useColorBombBooster,
    addExtraMoves,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleCellClick,
    initBoard,
  };
}
