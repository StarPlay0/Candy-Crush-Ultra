// Mobile Vibration API Haptics Engine for Physical Feedback

export class HapticsEngine {
  public isEnabled: boolean = true;

  private canVibrate(): boolean {
    return (
      this.isEnabled &&
      typeof window !== 'undefined' &&
      typeof navigator !== 'undefined' &&
      'vibrate' in navigator &&
      typeof navigator.vibrate === 'function'
    );
  }

  /** Subtle tick when first touching a candy or clicking a UI button */
  touch() {
    if (!this.canVibrate()) return;
    try {
      navigator.vibrate(10);
    } catch {
      // Ignore vibration error on unsupported platforms
    }
  }

  /** Escalating haptic pulse as player connects more candies in the matching trail */
  connect(chainLength: number) {
    if (!this.canVibrate()) return;
    try {
      const duration = Math.min(12 + chainLength * 3, 35);
      navigator.vibrate(duration);
    } catch {
      // Ignore
    }
  }

  /** Gentle haptic buzz when backtracking / undoing the trail */
  backtrack() {
    if (!this.canVibrate()) return;
    try {
      navigator.vibrate(8);
    } catch {
      // Ignore
    }
  }

  /** Pleasant double-pulse when a hint is activated */
  hint() {
    if (!this.canVibrate()) return;
    try {
      navigator.vibrate([15, 30, 22]);
    } catch {
      // Ignore
    }
  }

  /** Satisfying crunch / burst vibration when releasing a valid 3+ candy trail */
  match(chainLength: number = 3) {
    if (!this.canVibrate()) return;
    try {
      if (chainLength >= 6) {
        // Heavy multi-burst for epic chains
        navigator.vibrate([25, 20, 35, 20, 55]);
      } else if (chainLength >= 4) {
        // Medium double-burst
        navigator.vibrate([20, 25, 40]);
      } else {
        // Standard crisp pop
        navigator.vibrate([18, 30]);
      }
    } catch {
      // Ignore
    }
  }

  /** High-energy pulse for Special Candies (Striped lasers, Wrapped bombs, Color Bomb zap) */
  special() {
    if (!this.canVibrate()) return;
    try {
      navigator.vibrate([35, 25, 50, 25, 80]);
    } catch {
      // Ignore
    }
  }

  /** Triumphant victory rhythm when completing a level */
  levelWin() {
    if (!this.canVibrate()) return;
    try {
      navigator.vibrate([40, 30, 40, 30, 60, 40, 100]);
    } catch {
      // Ignore
    }
  }

  /** Low double-thud for invalid moves / out of moves */
  error() {
    if (!this.canVibrate()) return;
    try {
      navigator.vibrate([40, 40, 40]);
    } catch {
      // Ignore
    }
  }
}

export const haptics = new HapticsEngine();
