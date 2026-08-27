// High-performance Asset Loader & Cache Manager
// Pre-fetches and caches all game sprite textures and sound effect blobs
// into the browser's Cache API during initial splash screen load.

import { CandyColor, SpecialType, ObstacleType } from './game-types';

export interface PreloadProgress {
  stage: string;
  loaded: number;
  total: number;
  percentage: number;
}

export interface PreloadResult {
  success: boolean;
  textureCount: number;
  soundCount: number;
  totalTimeMs: number;
}

const TEXTURE_CACHE_NAME = 'candy-ultra-textures-v1';
const AUDIO_CACHE_NAME = 'candy-ultra-audio-v1';

// In-memory quick lookup caches for zero-latency DOM/Canvas access
const inMemoryTextureCache = new Map<string, HTMLImageElement>();
const inMemoryAudioBlobCache = new Map<string, Blob>();

let isPreloaded = false;
let currentProgress = 0;

/**
 * Generate standalone SVG markup strings for candy textures
 */
function generateCandySvgString(color: CandyColor | 'rainbow', special: SpecialType = 'none', size = 100): string {
  if (color === 'rainbow' || special === 'color-bomb') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
      <defs>
        <radialGradient id="chocoBallGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#6D4C41" />
          <stop offset="45%" stop-color="#4E342E" />
          <stop offset="85%" stop-color="#2A1713" />
          <stop offset="100%" stop-color="#150805" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="none" stroke="#FFD54F" stroke-width="2.5" stroke-dasharray="6,4" />
      <circle cx="50" cy="50" r="42" fill="url(#chocoBallGrad)" stroke="#8D6E63" stroke-width="1" />
      <ellipse cx="36" cy="28" rx="16" ry="9" fill="#FFFFFF" fill-opacity="0.32" transform="rotate(-25 36 28)" />
      <circle cx="28" cy="34" r="3.5" fill="#FFFFFF" fill-opacity="0.55" />
      <circle cx="28" cy="36" r="4.5" fill="#FFD600" stroke="#F57F17" stroke-width="0.8" />
      <circle cx="68" cy="38" r="4.5" fill="#FFEA00" stroke="#F57F17" stroke-width="0.8" />
      <circle cx="48" cy="72" r="4" fill="#FFD600" stroke="#F57F17" stroke-width="0.8" />
      <circle cx="50" cy="22" r="4.5" fill="#FF1744" stroke="#B71C1C" stroke-width="0.8" />
      <circle cx="22" cy="54" r="4.5" fill="#FF4081" stroke="#C2185B" stroke-width="0.8" />
      <circle cx="66" cy="66" r="4.2" fill="#FF1744" stroke="#B71C1C" stroke-width="0.8" />
      <circle cx="40" cy="40" r="4.8" fill="#00E5FF" stroke="#00838F" stroke-width="0.8" />
      <circle cx="72" cy="24" r="4.2" fill="#2979FF" stroke="#1565C0" stroke-width="0.8" />
      <circle cx="30" cy="70" r="4.2" fill="#00B0FF" stroke="#0277BD" stroke-width="0.8" />
      <circle cx="58" cy="48" r="4.8" fill="#76FF03" stroke="#33691E" stroke-width="0.8" />
      <circle cx="34" cy="18" r="3.8" fill="#00E676" stroke="#1B5E20" stroke-width="0.8" />
      <circle cx="78" cy="52" r="4" fill="#64DD17" stroke="#33691E" stroke-width="0.8" />
      <circle cx="18" cy="38" r="4" fill="#FF9100" stroke="#E65100" stroke-width="0.8" />
      <circle cx="46" cy="58" r="4.5" fill="#FF6D00" stroke="#BF360C" stroke-width="0.8" />
      <circle cx="58" cy="30" r="4.2" fill="#E040FB" stroke="#7B1FA2" stroke-width="0.8" />
      <circle cx="58" cy="80" r="3.5" fill="#D500F9" stroke="#6A1B9A" stroke-width="0.8" />
      <path d="M50,42 L52,48 L58,50 L52,52 L50,58 L48,52 L42,50 L48,48 Z" fill="#FFFFFF" fill-opacity="0.95" />
    </svg>`;
  }

  if (special === 'fish') {
    const fishColors: Record<CandyColor, { body: string; fin: string }> = {
      blue: { body: '#00B0FF', fin: '#0081CB' },
      red: { body: '#FF1744', fin: '#B2002D' },
      green: { body: '#00E676', fin: '#00A152' },
      yellow: { body: '#FFEA00', fin: '#C7B800' },
      orange: { body: '#FF6D00', fin: '#C43E00' },
      purple: { body: '#D500F9', fin: '#9E00C5' },
    };
    const c = fishColors[color as CandyColor] || fishColors.blue;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="fishGrad-${color}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.7" />
          <stop offset="30%" stop-color="${c.body}" />
          <stop offset="100%" stop-color="${c.fin}" />
        </linearGradient>
      </defs>
      <path d="M15,50 Q5,30 18,35 Q22,50 18,65 Q5,70 15,50 Z" fill="${c.fin}" />
      <path d="M45,26 Q60,16 70,28 Q55,32 45,26 Z" fill="${c.fin}" opacity="0.95" />
      <path d="M18,50 Q28,25 65,30 Q92,42 88,52 Q85,65 60,72 Q28,75 18,50 Z" fill="url(#fishGrad-${color})" stroke="#FFFFFF" stroke-width="1.8" />
      <path d="M40,42 Q45,38 50,42 M48,48 Q53,44 58,48 M40,54 Q45,50 50,54 M56,58 Q61,54 66,58" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" opacity="0.6" />
      <circle cx="76" cy="45" r="5" fill="#FFFFFF" />
      <circle cx="77.5" cy="44" r="2.8" fill="#0D47A1" />
      <circle cx="78.5" cy="43" r="1.2" fill="#FFFFFF" />
      <ellipse cx="60" cy="36" rx="14" ry="4" fill="#FFFFFF" fill-opacity="0.45" transform="rotate(-5 60 36)" />
    </svg>`;
  }

  // Base candy color shapes
  let shapeInner = '';
  switch (color) {
    case 'red':
      shapeInner = `<defs>
        <radialGradient id="redStrawberryGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#FF7096" />
          <stop offset="25%" stop-color="#FF0040" />
          <stop offset="80%" stop-color="#C20030" />
          <stop offset="100%" stop-color="#800020" />
        </radialGradient>
      </defs>
      <path d="M50,88 C20,70 12,48 16,30 C20,14 36,12 50,22 C64,12 80,14 84,30 C88,48 80,70 50,88 Z" fill="url(#redStrawberryGrad)" stroke="#FFE4E6" stroke-width="2" />
      <ellipse cx="36" cy="28" rx="10" ry="5" fill="#FFFFFF" fill-opacity="0.65" transform="rotate(-20 36 28)" />
      <circle cx="28" cy="35" r="2.5" fill="#FFFFFF" fill-opacity="0.8" />
      <circle cx="34" cy="48" r="1.8" fill="#FFFFFF" fill-opacity="0.5" />
      <circle cx="48" cy="62" r="1.8" fill="#FFFFFF" fill-opacity="0.5" />
      <circle cx="64" cy="45" r="1.8" fill="#FFFFFF" fill-opacity="0.5" />`;
      break;

    case 'orange':
      shapeInner = `<defs>
        <radialGradient id="orangeMandarinGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#FFE082" />
          <stop offset="25%" stop-color="#FF8F00" />
          <stop offset="80%" stop-color="#E65100" />
          <stop offset="100%" stop-color="#BF360C" />
        </radialGradient>
      </defs>
      <path d="M50,14 C74,14 88,28 88,50 C88,72 74,86 50,86 C26,86 12,72 12,50 C12,28 26,14 50,14 Z" fill="url(#orangeMandarinGrad)" stroke="#FFF3E0" stroke-width="2" />
      <ellipse cx="38" cy="28" rx="14" ry="6" fill="#FFFFFF" fill-opacity="0.6" transform="rotate(-15 38 28)" />
      <circle cx="28" cy="36" r="3" fill="#FFFFFF" fill-opacity="0.75" />
      <path d="M50,22 L50,78 M24,50 L76,50 M32,32 L68,68 M32,68 L68,32" stroke="#FFE082" stroke-width="1.2" stroke-dasharray="3,3" opacity="0.45" />`;
      break;

    case 'yellow':
      shapeInner = `<defs>
        <radialGradient id="yellowButterscotchGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#FFFFB3" />
          <stop offset="25%" stop-color="#FFD600" />
          <stop offset="80%" stop-color="#FF9100" />
          <stop offset="100%" stop-color="#E65100" />
        </radialGradient>
      </defs>
      <path d="M50,12 L60,34 L84,36 L66,52 L72,76 L50,62 L28,76 L34,52 L16,36 L40,34 Z" fill="url(#yellowButterscotchGrad)" stroke="#FFFDE7" stroke-width="2" stroke-linejoin="round" />
      <polygon points="50,22 56,36 70,38 60,48 64,62 50,54 36,62 40,48 30,38 44,36" fill="#FFE57F" opacity="0.65" />
      <ellipse cx="42" cy="32" rx="6" ry="3" fill="#FFFFFF" fill-opacity="0.8" transform="rotate(-20 42 32)" />`;
      break;

    case 'green':
      shapeInner = `<defs>
        <radialGradient id="greenAppleGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#D8F3DC" />
          <stop offset="25%" stop-color="#52B788" />
          <stop offset="75%" stop-color="#1B4332" />
          <stop offset="100%" stop-color="#081C15" />
        </radialGradient>
      </defs>
      <rect x="14" y="14" width="72" height="72" rx="26" fill="url(#greenAppleGrad)" stroke="#E8F5E9" stroke-width="2" />
      <ellipse cx="36" cy="28" rx="14" ry="7" fill="#FFFFFF" fill-opacity="0.6" transform="rotate(-20 36 28)" />
      <circle cx="26" cy="36" r="3" fill="#FFFFFF" fill-opacity="0.8" />
      <rect x="24" y="24" width="52" height="52" rx="18" fill="none" stroke="#A7F3D0" stroke-width="1.5" opacity="0.5" />`;
      break;

    case 'blue':
      shapeInner = `<defs>
        <radialGradient id="blueSodaGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#CAF0F8" />
          <stop offset="25%" stop-color="#00B4D8" />
          <stop offset="80%" stop-color="#0077B6" />
          <stop offset="100%" stop-color="#03045E" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="38" fill="url(#blueSodaGrad)" stroke="#E0F2FE" stroke-width="2" />
      <ellipse cx="36" cy="30" rx="14" ry="7" fill="#FFFFFF" fill-opacity="0.7" transform="rotate(-30 36 30)" />
      <circle cx="26" cy="38" r="3" fill="#FFFFFF" fill-opacity="0.85" />
      <circle cx="62" cy="58" r="8" fill="#90E0EF" fill-opacity="0.35" />
      <circle cx="42" cy="64" r="5" fill="#90E0EF" fill-opacity="0.35" />`;
      break;

    case 'purple':
      shapeInner = `<defs>
        <radialGradient id="purpleGrapeGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#F72585" />
          <stop offset="25%" stop-color="#B5179E" />
          <stop offset="80%" stop-color="#7209B7" />
          <stop offset="100%" stop-color="#3F37C9" />
        </radialGradient>
      </defs>
      <path d="M50,14 L86,50 L50,86 L14,50 Z" fill="url(#purpleGrapeGrad)" stroke="#F3E8FF" stroke-width="2" stroke-linejoin="round" />
      <polygon points="50,24 76,50 50,76 24,50" fill="#E879F9" opacity="0.45" />
      <ellipse cx="38" cy="32" rx="9" ry="4" fill="#FFFFFF" fill-opacity="0.75" transform="rotate(-40 38 32)" />
      <circle cx="30" cy="42" r="2.8" fill="#FFFFFF" fill-opacity="0.85" />`;
      break;
  }

  // Striped overlays
  let stripeOverlay = '';
  if (special === 'striped-h') {
    stripeOverlay = `<g stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity="0.9">
      <line x1="22" y1="36" x2="78" y2="36" />
      <line x1="16" y1="50" x2="84" y2="50" />
      <line x1="22" y1="64" x2="78" y2="64" />
    </g>`;
  } else if (special === 'striped-v') {
    stripeOverlay = `<g stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity="0.9">
      <line x1="36" y1="22" x2="36" y2="78" />
      <line x1="50" y1="16" x2="50" y2="84" />
      <line x1="64" y1="22" x2="64" y2="78" />
    </g>`;
  }

  // Wrapped overlay
  let wrappedOverlay = '';
  if (special === 'wrapped') {
    wrappedOverlay = `<path d="M14,50 L2,32 Q12,50 2,68 Z" fill="#FFFFFF" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2" />
    <path d="M86,50 L98,32 Q88,50 98,68 Z" fill="#FFFFFF" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2" />
    <rect x="12" y="12" width="76" height="76" rx="22" fill="#FFFFFF" fill-opacity="0.25" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="5,2" />`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
    ${wrappedOverlay}
    ${shapeInner}
    ${stripeOverlay}
  </svg>`;
}

/**
 * Generate standalone SVG markup strings for obstacle textures
 */
function generateObstacleSvgString(type: ObstacleType, size = 100): string {
  switch (type) {
    case 'licorice':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
        <defs>
          <radialGradient id="licoriceGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#616161" />
            <stop offset="45%" stop-color="#212121" />
            <stop offset="100%" stop-color="#000000" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="38" fill="url(#licoriceGrad)" stroke="#424242" stroke-width="3" />
        <path d="M25,25 Q50,75 75,75 M25,75 Q50,25 75,25" stroke="#E0E0E0" stroke-width="4" fill="none" stroke-linecap="round" />
        <ellipse cx="36" cy="30" rx="10" ry="4" fill="#FFFFFF" fill-opacity="0.4" transform="rotate(-30 36 30)" />
      </svg>`;

    case 'chocolate':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="chocoTile" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#6D4C41" />
            <stop offset="100%" stop-color="#3E2723" />
          </linearGradient>
        </defs>
        <rect x="14" y="14" width="72" height="72" rx="12" fill="url(#chocoTile)" stroke="#8D6E63" stroke-width="2.5" />
        <rect x="22" y="22" width="24" height="24" rx="4" fill="#4E342E" stroke="#5D4037" stroke-width="1.5" />
        <rect x="54" y="22" width="24" height="24" rx="4" fill="#4E342E" stroke="#5D4037" stroke-width="1.5" />
        <rect x="22" y="54" width="24" height="24" rx="4" fill="#4E342E" stroke="#5D4037" stroke-width="1.5" />
        <rect x="54" y="54" width="24" height="24" rx="4" fill="#4E342E" stroke="#5D4037" stroke-width="1.5" />
      </svg>`;

    case 'waffle':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
        <rect x="12" y="12" width="76" height="76" rx="14" fill="#D7CCC8" stroke="#8D6E63" stroke-width="3" />
        <rect x="20" y="20" width="60" height="60" rx="8" fill="#EFEBE9" />
        <path d="M35,20 L35,80 M50,20 L50,80 M65,20 L65,80 M20,35 L80,35 M20,50 L80,50 M20,65 L80,65" stroke="#BCAAA4" stroke-width="2.5" stroke-linecap="round" />
      </svg>`;

    case 'jelly':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
        <rect x="8" y="8" width="84" height="84" rx="18" fill="#F472B6" fill-opacity="0.38" stroke="#EC4899" stroke-width="2.5" stroke-dasharray="5,2" />
      </svg>`;

    case 'none':
    default:
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100"></svg>`;
  }
}

/**
 * Synthesize a clean 16-bit PCM WAV Audio Blob for sound effect caching
 */
function createSyntheticWavBlob(options: {
  durationSeconds: number;
  sampleRate?: number;
  generator: (t: number, duration: number) => number;
}): Blob {
  const sampleRate = options.sampleRate || 22050;
  const numSamples = Math.floor(sampleRate * options.durationSeconds);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  // Helper to write ASCII strings to DataView
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  // RIFF Chunk Descriptor
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, 'WAVE');

  // fmt Sub-chunk
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, 1, true); // NumChannels (1 mono)
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, sampleRate * 2, true); // ByteRate (SampleRate * NumChannels * BitsPerSample/8)
  view.setUint16(32, 2, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample (16-bit)

  // data Sub-chunk
  writeString(36, 'data');
  view.setUint32(40, numSamples * 2, true);

  // Write PCM audio samples
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const sample = Math.max(-1, Math.min(1, options.generator(t, options.durationSeconds)));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
    offset += 2;
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

/**
 * Pre-synthesize all core sound effect blobs for Cache API pre-caching
 */
function generateCoreSoundBlobs(): Record<string, Blob> {
  const sounds: Record<string, Blob> = {};

  // 1. Pop / Candy Match Pop Sound
  sounds['pop'] = createSyntheticWavBlob({
    durationSeconds: 0.12,
    generator: (t, d) => {
      const envelope = Math.exp(-t * 35);
      const freq = 450 + 600 * (1 - t / d);
      return Math.sin(2 * Math.PI * freq * t) * envelope * 0.8;
    },
  });

  // 2. Swap Swoosh Sound
  sounds['swap'] = createSyntheticWavBlob({
    durationSeconds: 0.09,
    generator: (t, d) => {
      const envelope = Math.sin((t / d) * Math.PI);
      const freq = 320 + 400 * (t / d);
      return Math.sin(2 * Math.PI * freq * t) * envelope * 0.6;
    },
  });

  // 3. Drop / Candy Fall Land Sound
  sounds['drop'] = createSyntheticWavBlob({
    durationSeconds: 0.07,
    generator: (t) => {
      const envelope = Math.exp(-t * 45);
      return Math.sin(2 * Math.PI * 180 * t) * envelope * 0.7;
    },
  });

  // 4. Click / UI Button Tap Sound
  sounds['click'] = createSyntheticWavBlob({
    durationSeconds: 0.05,
    generator: (t) => {
      const envelope = Math.exp(-t * 60);
      return Math.sin(2 * Math.PI * 750 * t) * envelope * 0.5;
    },
  });

  // 5. Combo Harmonic Chime Sound
  sounds['combo'] = createSyntheticWavBlob({
    durationSeconds: 0.25,
    generator: (t, d) => {
      const envelope = Math.exp(-t * 12);
      const s1 = Math.sin(2 * Math.PI * 523.25 * t);
      const s2 = Math.sin(2 * Math.PI * 659.25 * t);
      const s3 = Math.sin(2 * Math.PI * 783.99 * t);
      return ((s1 + s2 + s3) / 3) * envelope * 0.8;
    },
  });

  // 6. Laser / Striped Candy Beam Sound
  sounds['laser'] = createSyntheticWavBlob({
    durationSeconds: 0.22,
    generator: (t, d) => {
      const envelope = Math.exp(-t * 15);
      const freq = 900 - 650 * (t / d);
      return Math.sin(2 * Math.PI * freq * t) * envelope * 0.85;
    },
  });

  // 7. Bomb Explosion Sound
  sounds['explosion'] = createSyntheticWavBlob({
    durationSeconds: 0.35,
    generator: (t, d) => {
      const envelope = Math.exp(-t * 9);
      const noise = Math.random() * 2 - 1;
      const lowThump = Math.sin(2 * Math.PI * 80 * t);
      return (lowThump * 0.7 + noise * 0.3) * envelope * 0.9;
    },
  });

  // 8. TADA / Level Complete Fanfare Chord
  sounds['tada'] = createSyntheticWavBlob({
    durationSeconds: 0.6,
    generator: (t, d) => {
      const envelope = Math.exp(-t * 4);
      const c = Math.sin(2 * Math.PI * 523.25 * t);
      const e = Math.sin(2 * Math.PI * 659.25 * t);
      const g = Math.sin(2 * Math.PI * 783.99 * t);
      const cHigh = Math.sin(2 * Math.PI * 1046.5 * t);
      return ((c + e + g + cHigh) / 4) * envelope * 0.85;
    },
  });

  return sounds;
}

/**
 * Main Asset Loader: Pre-fetches, synthesizes, and stores sprite textures & sound blobs
 * in Cache API and memory during the splash screen sequence.
 */
export async function preloadGameAssets(
  onProgress?: (progress: PreloadProgress) => void
): Promise<PreloadResult> {
  const startTime = performance.now();
  const colors: (CandyColor | 'rainbow')[] = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'rainbow'];
  const specials: SpecialType[] = ['none', 'striped-h', 'striped-v', 'wrapped', 'color-bomb', 'fish'];
  const obstacles: ObstacleType[] = ['licorice', 'chocolate', 'waffle', 'jelly'];

  // Calculate total items to preload
  const totalTextures = colors.length * specials.length + obstacles.length + 1; // +1 for app icon
  const soundBlobs = generateCoreSoundBlobs();
  const totalSounds = Object.keys(soundBlobs).length;
  const totalItems = totalTextures + totalSounds;

  let loadedCount = 0;

  const update = (stage: string) => {
    loadedCount++;
    const percentage = Math.min(100, Math.round((loadedCount / totalItems) * 100));
    currentProgress = percentage;
    onProgress?.({
      stage,
      loaded: loadedCount,
      total: totalItems,
      percentage,
    });
  };

  // Open Cache API instances
  let textureCache: Cache | null = null;
  let audioCache: Cache | null = null;

  if (typeof window !== 'undefined' && 'caches' in window) {
    try {
      textureCache = await caches.open(TEXTURE_CACHE_NAME);
      audioCache = await caches.open(AUDIO_CACHE_NAME);
    } catch {
      // Non-blocking fallback if Cache API is unavailable
    }
  }

  // 1. Preload & Cache Candy Sprite Textures
  for (const color of colors) {
    for (const special of specials) {
      const key = `candy-${color}-${special}`;
      const svgStr = generateCandySvgString(color, special, 100);
      const blob = new Blob([svgStr], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);

      // Pre-warm HTMLImageElement for instant GPU upload
      if (typeof window !== 'undefined') {
        const img = new Image();
        img.src = url;
        inMemoryTextureCache.set(key, img);
      }

      // Store in Cache API
      if (textureCache) {
        try {
          const response = new Response(blob, {
            headers: {
              'Content-Type': 'image/svg+xml',
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          });
          await textureCache.put(new Request(`/assets/sprites/${key}.svg`), response);
        } catch {
          // Continue if cache put fails
        }
      }

      update(`Caching ${color} ${special !== 'none' ? special : ''} candy sprite`);
    }
  }

  // 2. Preload & Cache Obstacle Textures
  for (const obstacle of obstacles) {
    const key = `obstacle-${obstacle}`;
    const svgStr = generateObstacleSvgString(obstacle, 100);
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    if (typeof window !== 'undefined') {
      const img = new Image();
      img.src = url;
      inMemoryTextureCache.set(key, img);
    }

    if (textureCache) {
      try {
        const response = new Response(blob, {
          headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
        await textureCache.put(new Request(`/assets/sprites/${key}.svg`), response);
      } catch {
        // Non-blocking
      }
    }

    update(`Caching ${obstacle} obstacle texture`);
  }

  // 3. Preload Core App Icon
  try {
    const iconRes = await fetch('/icon.svg');
    if (iconRes.ok && textureCache) {
      await textureCache.put('/icon.svg', iconRes.clone());
    }
  } catch {
    // Ignore offline fetch error
  }
  update('Caching UI icon assets');

  // 4. Preload & Cache Synthesized Audio Blobs
  for (const [soundName, audioBlob] of Object.entries(soundBlobs)) {
    inMemoryAudioBlobCache.set(soundName, audioBlob);

    if (audioCache) {
      try {
        const response = new Response(audioBlob, {
          headers: {
            'Content-Type': 'audio/wav',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
        await audioCache.put(new Request(`/assets/audio/${soundName}.wav`), response);
      } catch {
        // Non-blocking
      }
    }

    update(`Pre-caching sound blob: ${soundName}`);
  }

  // 5. Pre-warm Web Audio API Context
  if (typeof window !== 'undefined') {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
          // Add touch/click listener to resume instantly upon first interaction
          const unlock = () => {
            ctx.resume().catch(() => {});
            window.removeEventListener('pointerdown', unlock);
            window.removeEventListener('touchstart', unlock);
          };
          window.addEventListener('pointerdown', unlock, { once: true, passive: true });
          window.addEventListener('touchstart', unlock, { once: true, passive: true });
        }
      }
    } catch {
      // Ignore audio context initialization error
    }
  }

  isPreloaded = true;
  currentProgress = 100;
  const totalTimeMs = Math.round(performance.now() - startTime);

  return {
    success: true,
    textureCount: totalTextures,
    soundCount: totalSounds,
    totalTimeMs,
  };
}

/**
 * Check if assets have completed pre-caching
 */
export function isAssetsPreloaded(): boolean {
  return isPreloaded;
}

/**
 * Get current preload percentage (0 - 100)
 */
export function getPreloadProgress(): number {
  return currentProgress;
}

/**
 * Retrieve cached texture image element
 */
export function getCachedTexture(key: string): HTMLImageElement | null {
  return inMemoryTextureCache.get(key) || null;
}

/**
 * Retrieve cached audio blob
 */
export function getCachedAudioBlob(soundName: string): Blob | null {
  return inMemoryAudioBlobCache.get(soundName) || null;
}
