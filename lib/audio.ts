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

  /** Satisfying candy match pop with multi-layer bubble acoustics and dynamic pitch ladder */
  playPop(pitchMultiplier = 1, candyCount = 3) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Base frequency scaled by combo multiplier
      const baseFreq = Math.min(380 * pitchMultiplier, 1200);

      // Layer 1: Warm resonant bubble pop (Sine with quick pitch sweep)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.4, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, now + 0.09);

      gain.gain.setValueAtTime(0.38, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);

      // Layer 2: Tactile snap transient (Triangle click)
      const snapOsc = this.ctx.createOscillator();
      const snapGain = this.ctx.createGain();

      snapOsc.type = 'triangle';
      snapOsc.frequency.setValueAtTime(baseFreq * 1.6, now);
      snapOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, now + 0.025);

      snapGain.gain.setValueAtTime(0.22, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      snapOsc.connect(snapGain);
      snapGain.connect(this.ctx.destination);

      snapOsc.start(now);
      snapOsc.stop(now + 0.03);

      // Layer 3: Low warm body thud
      const thudOsc = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();

      thudOsc.type = 'sine';
      thudOsc.frequency.setValueAtTime(140, now);
      thudOsc.frequency.exponentialRampToValueAtTime(60, now + 0.07);

      thudGain.gain.setValueAtTime(0.25, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      thudOsc.connect(thudGain);
      thudGain.connect(this.ctx.destination);

      thudOsc.start(now);
      thudOsc.stop(now + 0.07);

      // Layer 4: Sweet harmonic chime sparkle on matches greater than 3
      if (candyCount > 3 || pitchMultiplier > 1.2) {
        const chimeOsc = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();

        chimeOsc.type = 'sine';
        chimeOsc.frequency.setValueAtTime(baseFreq * 2.5, now + 0.02);
        chimeOsc.frequency.exponentialRampToValueAtTime(baseFreq * 3.2, now + 0.12);

        chimeGain.gain.setValueAtTime(0.18, now + 0.02);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        chimeOsc.connect(chimeGain);
        chimeGain.connect(this.ctx.destination);

        chimeOsc.start(now + 0.02);
        chimeOsc.stop(now + 0.14);
      }
    } catch {
      // Audio fallback
    }
  }

  /** Alias for playPop */
  playCandyPop(pitchMultiplier = 1, candyCount = 3) {
    this.playPop(pitchMultiplier, candyCount);
  }

  /** Celebratory, vibrant 'TADA!' fanfare sound when level is cleared */
  playTada() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Note 1: "Ta-" (G4 - 392Hz) staccato fanfare prep
      const prepOsc1 = this.ctx.createOscillator();
      const prepOsc2 = this.ctx.createOscillator();
      const prepGain = this.ctx.createGain();

      prepOsc1.type = 'sawtooth';
      prepOsc2.type = 'triangle';
      prepOsc1.frequency.setValueAtTime(392.00, now);
      prepOsc2.frequency.setValueAtTime(783.99, now);

      prepGain.gain.setValueAtTime(0.28, now);
      prepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      prepOsc1.connect(prepGain);
      prepOsc2.connect(prepGain);
      prepGain.connect(this.ctx.destination);

      prepOsc1.start(now);
      prepOsc2.start(now);
      prepOsc1.stop(now + 0.14);
      prepOsc2.stop(now + 0.14);

      // Note 2: "-DAAA! 🎺✨" (Triumphant C Major Chord: C5, E5, G5, C6) with brassy richness
      const chordNotes = [
        { freq: 523.25, type: 'sawtooth' as OscillatorType, vol: 0.32 }, // C5
        { freq: 659.25, type: 'triangle' as OscillatorType, vol: 0.30 }, // E5
        { freq: 783.99, type: 'sawtooth' as OscillatorType, vol: 0.28 }, // G5
        { freq: 1046.50, type: 'triangle' as OscillatorType, vol: 0.25 }, // C6
        { freq: 1318.51, type: 'sine' as OscillatorType, vol: 0.18 }, // E6 sparkle
      ];

      const resolveTime = now + 0.15;
      const duration = 0.85;

      chordNotes.forEach(({ freq, type, vol }) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, resolveTime);
        // Subtle brass vibrato
        osc.frequency.linearRampToValueAtTime(freq * 1.015, resolveTime + 0.2);
        osc.frequency.linearRampToValueAtTime(freq, resolveTime + duration);

        gain.gain.setValueAtTime(0.01, resolveTime);
        gain.gain.exponentialRampToValueAtTime(vol, resolveTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, resolveTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(resolveTime);
        osc.stop(resolveTime + duration);
      });

      // Sparkle arpeggiated glockenspiel chimes during resolve
      const sparkleNotes = [1046.50, 1318.51, 1567.98, 2093.00, 2637.02];
      sparkleNotes.forEach((freq, idx) => {
        const sparkleTime = resolveTime + 0.08 + idx * 0.06;
        const sOsc = this.ctx!.createOscillator();
        const sGain = this.ctx!.createGain();

        sOsc.type = 'sine';
        sOsc.frequency.setValueAtTime(freq, sparkleTime);

        sGain.gain.setValueAtTime(0.18, sparkleTime);
        sGain.gain.exponentialRampToValueAtTime(0.001, sparkleTime + 0.28);

        sOsc.connect(sGain);
        sGain.connect(this.ctx!.destination);

        sOsc.start(sparkleTime);
        sOsc.stop(sparkleTime + 0.28);
      });
    } catch {
      // Audio fallback
    }
  }

  /** Triumphant success sound played when a level goal is reached */
  playSuccess() {
    this.playTada();
  }

  playGoalReached() {
    this.playTada();
  }

  playLevelWin() {
    this.playTada();
  }

  /** Upbeat combo chord progression for combo matches */
  playCombo(multiplier: number = 1) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const baseFreq = 440 + Math.min(multiplier * 65, 500);
      const notes = [baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 2];

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const t = now + idx * 0.04;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.08, t + 0.16);

        gain.gain.setValueAtTime(0.24, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(t);
        osc.stop(t + 0.2);
      });
    } catch {
      // Audio fallback
    }
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

  /** Ascending musical note played as player trails finger across candies (C4, D4, E4, F4, G4, A4, B4, C5, D5...) */
  playTrailConnect(step: number) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      // Major pentatonic & diatonic scale frequencies
      const scale = [
        261.63, // C4
        293.66, // D4
        329.63, // E4
        349.23, // F4
        392.00, // G4
        440.00, // A4
        493.88, // B4
        523.25, // C5
        587.33, // D5
        659.25, // E5
        698.46, // F5
        783.99, // G5
        880.00, // A5
        1046.50 // C6
      ];

      const noteIdx = Math.min(step - 1, scale.length - 1);
      const freq = scale[Math.max(0, noteIdx)];
      const now = this.ctx.currentTime;

      // Soft crystalline bell tone
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.02, now + 0.12);

      const gainLevel = step >= 3 ? 0.35 : 0.22;
      gain.gain.setValueAtTime(gainLevel, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);

      // Add harmonic sparkle on longer chains (>= 4)
      if (step >= 4) {
        const harmonicOsc = this.ctx.createOscillator();
        const harmonicGain = this.ctx.createGain();

        harmonicOsc.type = 'triangle';
        harmonicOsc.frequency.setValueAtTime(freq * 2, now);
        harmonicGain.gain.setValueAtTime(0.12, now);
        harmonicGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        harmonicOsc.connect(harmonicGain);
        harmonicGain.connect(this.ctx.destination);

        harmonicOsc.start(now);
        harmonicOsc.stop(now + 0.15);
      }
    } catch {
      // Audio fallback
    }
  }

  /** Soft descending note for trail backtracking */
  playTrailBacktrack() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.06);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Audio fallback
    }
  }

  /** Big satisfying trail release crush chord */
  playTrailCrush(chainLength: number) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Multi-tone chord burst
      const baseFreq = 440 + Math.min(chainLength * 30, 400);
      const freqs = [baseFreq, baseFreq * 1.25, baseFreq * 1.5];

      freqs.forEach((f, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const t = now + idx * 0.03;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, t);
        osc.frequency.exponentialRampToValueAtTime(f * 0.6, t + 0.2);

        gain.gain.setValueAtTime(0.28, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(t);
        osc.stop(t + 0.22);
      });
    } catch {
      // Audio fallback
    }
  }

  playGameOver() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [392.00, 369.99, 349.23, 311.13]; // G4, F#4, F4, D#4 descending sad chord
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const t = now + idx * 0.16;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.linearRampToValueAtTime(freq * 0.95, t + 0.32);

        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(t);
        osc.stop(t + 0.35);
      });
    } catch {
      // Audio fallback
    }
  }

  playHint() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const hintNotes = [587.33, 739.99, 880.00, 1174.66]; // D5, F#5, A5, D6 sparkling glissando
      hintNotes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const t = now + idx * 0.07;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.05, t + 0.2);

        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(t);
        osc.stop(t + 0.25);
      });
    } catch {
      // Audio fallback
    }
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
