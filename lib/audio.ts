// High-quality Web Audio API Sound Synthesizer for 100% offline, zero-asset game audio
class SoundEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private init() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  /** Satisfying candy match pop with dynamic pitch ladder based on cascade combos */
  playPop(pitchMultiplier = 1) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const baseFreq = 380 * pitchMultiplier;

      // Primary tone: warm bubble sine pop
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.2, now + 0.07);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);

      // Secondary click/snap transient for tactile punch
      const snapOsc = this.ctx.createOscillator();
      const snapGain = this.ctx.createGain();

      snapOsc.type = 'triangle';
      snapOsc.frequency.setValueAtTime(baseFreq * 1.5, now);
      snapOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.03);

      snapGain.gain.setValueAtTime(0.2, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      snapOsc.connect(snapGain);
      snapGain.connect(this.ctx.destination);

      snapOsc.start(now);
      snapOsc.stop(now + 0.035);
    } catch {
      // Audio fallback
    }
  }

  /** Triumphant success sound played when a level goal is reached */
  playSuccess() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      // Arpeggiated C-E-G-C major fanfare chords with shimmering harmonics
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const now = this.ctx!.currentTime + idx * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.05, now + 0.35);

        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now);
        osc.stop(now + 0.4);
      });

      // Sparkle high chime overlay
      setTimeout(() => {
        if (!this.ctx || this.isMuted) return;
        const chimeOsc = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        chimeOsc.type = 'sine';
        chimeOsc.frequency.setValueAtTime(1567.98, now);
        chimeOsc.frequency.exponentialRampToValueAtTime(2093.00, now + 0.25);

        chimeGain.gain.setValueAtTime(0.25, now);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        chimeOsc.connect(chimeGain);
        chimeGain.connect(this.ctx.destination);

        chimeOsc.start(now);
        chimeOsc.stop(now + 0.3);
      }, 350);
    } catch {
      // Audio fallback
    }
  }

  playGoalReached() {
    this.playSuccess();
  }

  playLevelWin() {
    this.playSuccess();
  }

  /** Smooth swoosh sound when swapping candies */
  playSwap() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.08);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Audio fallback
    }
  }

  /** Soft landing bounce sound when candies drop */
  playDrop() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.05);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Audio fallback
    }
  }

  /** Gentle invalid swap nudge */
  playInvalid() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(190, now);
      osc.frequency.linearRampToValueAtTime(130, now + 0.12);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // Audio fallback
    }
  }

  /** Harmonic match chime */
  playMatch(comboCount = 1) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 987.77, 1046.5];
      const baseIdx = Math.min(comboCount - 1, notes.length - 3);
      const chord = [notes[baseIdx], notes[baseIdx + 2]];

      chord.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const now = this.ctx!.currentTime + (i * 0.04);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.2, now + 0.18);

        gain.gain.setValueAtTime(0.24, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now);
        osc.stop(now + 0.22);
      });
    } catch {
      // Audio fallback
    }
  }

  /** High-energy beam laser for striped candies */
  playLaser() {
    this.playLaserBeam();
  }

  playStriped() {
    this.playLaserBeam();
  }

  playLaserBeam() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(950, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Audio fallback
    }
  }

  /** Color bomb multi-beam lightning zap */
  playColorBomb() {
    this.playColorBombZap();
  }

  playColorBombZap() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(1300, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.45);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.48);
    } catch {
      // Audio fallback
    }
  }

  /** Heavy wrapped candy 3x3 explosion */
  playWrappedExplosion() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.35);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // Audio fallback
    }
  }

  /** Cosmic nuke when two color bombs combine */
  playNuke() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(850, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.65);

      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.65);
    } catch {
      // Audio fallback
    }
  }

  playBonus() {
    this.playPop(1.6);
  }

  playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(820, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.04);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Audio fallback
    }
  }
}

export const sound = new SoundEngine();
