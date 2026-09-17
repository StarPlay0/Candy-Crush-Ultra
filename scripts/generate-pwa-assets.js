const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateAssets() {
  // 1. Icon 512x512
  const iconSvg = `
  <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FF3388" />
        <stop offset="50%" stop-color="#FF1493" />
        <stop offset="100%" stop-color="#7928CA" />
      </linearGradient>
      <linearGradient id="candyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFE066" />
        <stop offset="100%" stop-color="#FF5E3A" />
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.35" />
      </filter>
      <filter id="innerGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" />
      </filter>
    </defs>
    <!-- Background rounded square with safe padding -->
    <rect x="32" y="32" width="448" height="448" rx="112" fill="url(#bgGrad)" filter="url(#shadow)" stroke="#FFFFFF" stroke-width="8" />
    
    <!-- Central Sweet Candy Jewel -->
    <g transform="translate(256, 240)">
      <!-- Candy Drop Silhouette -->
      <circle cx="0" cy="0" r="110" fill="url(#candyGrad)" filter="url(#shadow)" stroke="#FFFFFF" stroke-width="6" />
      <!-- Swirl Stripe 1 -->
      <path d="M-80,-20 Q0,-80 80,-20 Q0,40 -80,-20 Z" fill="#FFFFFF" opacity="0.65" />
      <!-- Swirl Stripe 2 -->
      <path d="M-60,30 Q0,-30 60,30 Q0,80 -60,30 Z" fill="#FFFFFF" opacity="0.5" />
      <!-- Gloss Highlight -->
      <ellipse cx="-35" cy="-45" rx="30" ry="16" transform="rotate(-30, -35, -45)" fill="#FFFFFF" opacity="0.85" />
      <!-- Sparkle stars -->
      <path d="M80,-70 L85,-55 L100,-50 L85,-45 L80,-30 L75,-45 L60,-50 L75,-55 Z" fill="#FFF275" />
      <path d="M-90,60 L-86,72 L-74,76 L-86,80 L-90,92 L-94,80 L-106,76 L-94,72 Z" fill="#FFF275" />
    </g>

    <!-- App Name Banner inside safe zone -->
    <rect x="96" y="375" width="320" height="60" rx="30" fill="#FFFFFF" filter="url(#shadow)" />
    <text x="256" y="415" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="28" fill="#FF1493" text-anchor="middle" letter-spacing="3">CANDY ULTRA</text>
  </svg>
  `;

  // 2. Screenshot Mobile (1080 x 1920)
  const screenshotMobileSvg = `
  <svg width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="mBg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#BAE6FD" />
        <stop offset="45%" stop-color="#FBCFE8" />
        <stop offset="100%" stop-color="#E0D4FD" />
      </linearGradient>
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="100%" stop-color="#FDF2F8" />
      </linearGradient>
      <filter id="mShadow">
        <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.12" />
      </filter>
    </defs>
    <!-- Screen background -->
    <rect width="1080" height="1920" fill="url(#mBg)" />

    <!-- Mobile Status Bar -->
    <rect width="1080" height="70" fill="#FFFFFF" opacity="0.4" />
    <text x="60" y="46" font-family="system-ui, sans-serif" font-weight="700" font-size="28" fill="#1E293B">9:41</text>
    <text x="960" y="46" font-family="system-ui, sans-serif" font-weight="700" font-size="26" fill="#1E293B">5G 100%</text>

    <!-- Top App Header -->
    <rect y="70" width="1080" height="150" fill="#FFFFFF" opacity="0.95" filter="url(#mShadow)" />
    <circle cx="120" cy="145" r="45" fill="#FF1493" />
    <text x="120" y="157" font-size="44" text-anchor="middle">🍬</text>
    <text x="190" y="140" font-family="system-ui, sans-serif" font-weight="900" font-size="40" fill="#0F172A">CANDY CRUSH ULTRA</text>
    <text x="190" y="172" font-family="system-ui, sans-serif" font-weight="700" font-size="22" fill="#EC4899">OFFLINE MATCH-3 SAGA • 199 LEVELS</text>
    <rect x="880" y="115" width="140" height="60" rx="30" fill="#10B981" />
    <text x="950" y="154" font-family="system-ui, sans-serif" font-weight="800" font-size="22" fill="#FFFFFF" text-anchor="middle">PRO</text>

    <!-- Trust Marquee Banner -->
    <rect y="235" width="1080" height="80" fill="#FFF1F2" stroke="#FECDD3" stroke-width="2" />
    <text x="540" y="285" font-family="system-ui, sans-serif" font-weight="800" font-size="26" fill="#BE123C" text-anchor="middle">⭐ 100% FREE • NO ADS • 100% OFFLINE PWA • INSTANT 60 FPS</text>

    <!-- Main Game Board Container -->
    <rect x="70" y="340" width="940" height="1100" rx="48" fill="url(#cardGrad)" filter="url(#mShadow)" stroke="#FFFFFF" stroke-width="6" />

    <!-- Stats Bar -->
    <rect x="110" y="380" width="860" height="110" rx="28" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2" />
    <text x="160" y="445" font-family="system-ui, sans-serif" font-weight="900" font-size="34" fill="#0F172A">LEVEL 1</text>
    <text x="440" y="445" font-family="system-ui, sans-serif" font-weight="900" font-size="34" fill="#E11D48">MOVES: 25</text>
    <text x="740" y="445" font-family="system-ui, sans-serif" font-weight="900" font-size="34" fill="#7C3AED">SCORE: 2,450</text>

    <!-- 7x7 Candy Board Grid -->
    <g transform="translate(140, 520)">
      <!-- Board Background -->
      <rect width="800" height="800" rx="32" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="3" />
      
      <!-- Candies (simulated grid) -->
      ${Array.from({ length: 6 }).map((_, r) => 
        Array.from({ length: 6 }).map((_, c) => {
          const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
          const symbols = ['🍬', '🍭', '🍫', '🧁', '🍩', '🍒'];
          const idx = (r * 3 + c * 2) % colors.length;
          const x = 30 + c * 125;
          const y = 30 + r * 125;
          return `
            <rect x="${x}" y="${y}" width="105" height="105" rx="24" fill="${colors[idx]}" filter="url(#mShadow)" stroke="#FFFFFF" stroke-width="3" />
            <text x="${x + 52}" y="${y + 68}" font-size="52" text-anchor="middle">${symbols[idx]}</text>
          `;
        }).join('')
      ).join('')}
    </g>

    <!-- Action Bar / Boosters -->
    <g transform="translate(70, 1470)">
      <rect width="940" height="120" rx="32" fill="#FFFFFF" filter="url(#mShadow)" />
      <text x="140" y="72" font-size="44">🔨</text>
      <text x="210" y="72" font-family="system-ui, sans-serif" font-weight="800" font-size="28" fill="#1E293B">Hammer (3)</text>

      <text x="470" y="72" font-size="44">🔄</text>
      <text x="540" y="72" font-family="system-ui, sans-serif" font-weight="800" font-size="28" fill="#1E293B">Shuffle (2)</text>

      <text x="770" y="72" font-size="44">💣</text>
      <text x="840" y="72" font-family="system-ui, sans-serif" font-weight="800" font-size="28" fill="#1E293B">Bomb (1)</text>
    </g>

    <!-- Bottom App Navigation Tab Bar -->
    <rect y="1740" width="1080" height="180" fill="#FFFFFF" filter="url(#mShadow)" stroke="#E2E8F0" stroke-width="2" />
    <g transform="translate(100, 1780)">
      <text x="60" y="45" font-size="40" text-anchor="middle">🎮</text>
      <text x="60" y="85" font-family="system-ui, sans-serif" font-weight="800" font-size="22" fill="#EC4899" text-anchor="middle">Play</text>

      <text x="270" y="45" font-size="40" text-anchor="middle">🏆</text>
      <text x="270" y="85" font-family="system-ui, sans-serif" font-weight="700" font-size="22" fill="#64748B" text-anchor="middle">Why Us</text>

      <text x="470" y="45" font-size="40" text-anchor="middle">⚡</text>
      <text x="470" y="85" font-family="system-ui, sans-serif" font-weight="700" font-size="22" fill="#64748B" text-anchor="middle">Features</text>

      <text x="670" y="45" font-size="40" text-anchor="middle">🌍</text>
      <text x="670" y="85" font-family="system-ui, sans-serif" font-weight="700" font-size="22" fill="#64748B" text-anchor="middle">Locations</text>

      <text x="840" y="45" font-size="40" text-anchor="middle">⭐</text>
      <text x="840" y="85" font-family="system-ui, sans-serif" font-weight="700" font-size="22" fill="#64748B" text-anchor="middle">Reviews</text>
    </g>
  </svg>
  `;

  // 3. Screenshot Desktop (1920 x 1080)
  const screenshotDesktopSvg = `
  <svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="dBg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#BAE6FD" />
        <stop offset="50%" stop-color="#FBCFE8" />
        <stop offset="100%" stop-color="#E0D4FD" />
      </linearGradient>
      <filter id="dShadow">
        <feDropShadow dx="0" dy="12" stdDeviation="20" flood-color="#000000" flood-opacity="0.12" />
      </filter>
    </defs>
    <!-- Desktop Background -->
    <rect width="1920" height="1080" fill="url(#dBg)" />

    <!-- Desktop Header -->
    <rect width="1920" height="88" fill="#FFFFFF" opacity="0.95" filter="url(#dShadow)" />
    <circle cx="100" cy="44" r="28" fill="#FF1493" />
    <text x="100" y="52" font-size="28" text-anchor="middle">🍬</text>
    <text x="145" y="52" font-family="system-ui, sans-serif" font-weight="900" font-size="26" fill="#0F172A">CANDY CRUSH ULTRA</text>
    <rect x="420" y="32" width="70" height="26" rx="6" fill="#EC4899" />
    <text x="455" y="49" font-family="system-ui, sans-serif" font-weight="800" font-size="12" fill="#FFFFFF" text-anchor="middle">PWA</text>

    <!-- Header Navigation -->
    <text x="650" y="52" font-family="system-ui, sans-serif" font-weight="700" font-size="16" fill="#0F172A">Saga Map</text>
    <text x="780" y="52" font-family="system-ui, sans-serif" font-weight="700" font-size="16" fill="#64748B">Why Choose Us</text>
    <text x="940" y="52" font-family="system-ui, sans-serif" font-weight="700" font-size="16" fill="#64748B">Game Features</text>
    <text x="1100" y="52" font-family="system-ui, sans-serif" font-weight="700" font-size="16" fill="#64748B">Locations (34)</text>
    <text x="1260" y="52" font-family="system-ui, sans-serif" font-weight="700" font-size="16" fill="#64748B">Reviews &amp; FAQ</text>

    <!-- Trust pill & Install CTA -->
    <rect x="1500" y="24" width="200" height="40" rx="20" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="1.5" />
    <text x="1600" y="49" font-family="system-ui, sans-serif" font-weight="800" font-size="13" fill="#065F46" text-anchor="middle">🛡️ 100% Offline • 0 Ads</text>
    <rect x="1730" y="22" width="130" height="44" rx="22" fill="#FF1493" />
    <text x="1795" y="49" font-family="system-ui, sans-serif" font-weight="800" font-size="14" fill="#FFFFFF" text-anchor="middle">Install PWA</text>

    <!-- Trust Marquee Bar -->
    <rect y="88" width="1920" height="44" fill="#FFF1F2" stroke="#FECDD3" stroke-width="1" />
    <text x="960" y="116" font-family="system-ui, sans-serif" font-weight="800" font-size="15" fill="#BE123C" text-anchor="middle">⭐ 100% FREE SAGA • 199 HANDCRAFTED LEVELS • 0 AD INTERRUPTIONS • 100% PRIVATE CLIENT-SIDE ENGINE</text>

    <!-- Left Panel: Saga Map Progression (Levels 1 to 199) -->
    <rect x="100" y="160" width="400" height="740" rx="28" fill="#FFFFFF" filter="url(#dShadow)" />
    <text x="140" y="210" font-family="system-ui, sans-serif" font-weight="900" font-size="22" fill="#0F172A">SAGA PROGRESSION</text>
    <text x="140" y="235" font-family="system-ui, sans-serif" font-weight="600" font-size="14" fill="#64748B">Handcrafted 199 levels unlocked</text>
    ${[1,2,3,4,5].map((lvl, i) => `
      <rect x="130" y="${260 + i * 90}" width="340" height="70" rx="18" fill="${lvl === 1 ? '#FDF2F8' : '#F8FAFC'}" stroke="${lvl === 1 ? '#F472B6' : '#E2E8F0'}" stroke-width="2" />
      <circle cx="170" cy="${295 + i * 90}" r="22" fill="${lvl === 1 ? '#FF1493' : '#CBD5E1'}" />
      <text x="170" y="${302 + i * 90}" font-family="system-ui, sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle">${lvl}</text>
      <text x="210" y="${293 + i * 90}" font-family="system-ui, sans-serif" font-weight="800" font-size="16" fill="#0F172A">Level ${lvl}: Sugar Falls</text>
      <text x="210" y="${315 + i * 90}" font-family="system-ui, sans-serif" font-weight="600" font-size="13" fill="${lvl === 1 ? '#EC4899' : '#64748B'}">⭐ 3 Stars • Target: 1,500</text>
    `).join('')}

    <!-- Center Panel: Interactive Match-3 Game Board -->
    <rect x="530" y="160" width="860" height="740" rx="28" fill="#FFFFFF" filter="url(#dShadow)" />
    <!-- Game Board Header -->
    <rect x="560" y="190" width="800" height="80" rx="20" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2" />
    <text x="610" y="240" font-family="system-ui, sans-serif" font-weight="900" font-size="24" fill="#0F172A">LEVEL 1</text>
    <text x="880" y="240" font-family="system-ui, sans-serif" font-weight="900" font-size="24" fill="#E11D48">MOVES: 25</text>
    <text x="1160" y="240" font-family="system-ui, sans-serif" font-weight="900" font-size="24" fill="#7C3AED">SCORE: 2,450</text>

    <!-- Candies 7x7 Grid inside Center -->
    <g transform="translate(680, 290)">
      <rect width="560" height="560" rx="24" fill="#F1F5F9" stroke="#E2E8F0" stroke-width="2" />
      ${Array.from({ length: 6 }).map((_, r) => 
        Array.from({ length: 6 }).map((_, c) => {
          const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
          const symbols = ['🍬', '🍭', '🍫', '🧁', '🍩', '🍒'];
          const idx = (r * 2 + c * 3) % colors.length;
          const x = 20 + c * 88;
          const y = 20 + r * 88;
          return `
            <rect x="${x}" y="${y}" width="74" height="74" rx="18" fill="${colors[idx]}" filter="url(#dShadow)" stroke="#FFFFFF" stroke-width="2" />
            <text x="${x + 37}" y="${y + 48}" font-size="36" text-anchor="middle">${symbols[idx]}</text>
          `;
        }).join('')
      ).join('')}
    </g>

    <!-- Right Panel: Powerups & Boosters -->
    <rect x="1420" y="160" width="400" height="740" rx="28" fill="#FFFFFF" filter="url(#dShadow)" />
    <text x="1460" y="210" font-family="system-ui, sans-serif" font-weight="900" font-size="22" fill="#0F172A">POWERUP VAULT</text>
    <text x="1460" y="235" font-family="system-ui, sans-serif" font-weight="600" font-size="14" fill="#64748B">Equip your candy superpowers</text>

    <g transform="translate(1450, 260)">
      <rect width="340" height="110" rx="20" fill="#FEF3C7" stroke="#FDE68A" stroke-width="2" />
      <text x="40" y="65" font-size="44">🔨</text>
      <text x="100" y="55" font-family="system-ui, sans-serif" font-weight="800" font-size="18" fill="#92400E">Lollipop Hammer</text>
      <text x="100" y="80" font-family="system-ui, sans-serif" font-weight="600" font-size="13" fill="#B45309">Smashes any single candy (3 ready)</text>
    </g>

    <g transform="translate(1450, 390)">
      <rect width="340" height="110" rx="20" fill="#EDE9FE" stroke="#DDD6FE" stroke-width="2" />
      <text x="40" y="65" font-size="44">🔄</text>
      <text x="100" y="55" font-family="system-ui, sans-serif" font-weight="800" font-size="18" fill="#5B21B6">Free Hand Shuffle</text>
      <text x="100" y="80" font-family="system-ui, sans-serif" font-weight="600" font-size="13" fill="#6D28D9">Rearranges entire board (2 ready)</text>
    </g>

    <g transform="translate(1450, 520)">
      <rect width="340" height="110" rx="20" fill="#FCE7F3" stroke="#FBCFE8" stroke-width="2" />
      <text x="40" y="65" font-size="44">💣</text>
      <text x="100" y="55" font-family="system-ui, sans-serif" font-weight="800" font-size="18" fill="#9D174D">Color Bomb Blast</text>
      <text x="100" y="80" font-family="system-ui, sans-serif" font-weight="600" font-size="13" fill="#BE185D">Clears all matching candies (1 ready)</text>
    </g>

    <!-- Desktop Footer Snippet -->
    <rect y="930" width="1920" height="150" fill="#0F172A" />
    <text x="100" y="990" font-family="system-ui, sans-serif" font-weight="900" font-size="20" fill="#FFFFFF">CANDY CRUSH ULTRA</text>
    <text x="100" y="1020" font-family="system-ui, sans-serif" font-weight="500" font-size="14" fill="#94A3B8">© 2026 Candy Crush Ultra. 100% Free • No In-App Purchases • Google Play Ready PWA</text>
    <text x="1400" y="1000" font-family="system-ui, sans-serif" font-weight="700" font-size="15" fill="#38BDF8">Privacy Policy (/privacy.html)  •  Terms  •  Saga Map  •  Why Choose Us</text>
  </svg>
  `;

  console.log('Generating PNG assets via sharp...');

  // Generate 512x512
  const icon512Png = await sharp(Buffer.from(iconSvg))
    .resize(512, 512)
    .png()
    .toBuffer();

  // Generate 192x192
  const icon192Png = await sharp(Buffer.from(iconSvg))
    .resize(192, 192)
    .png()
    .toBuffer();

  // Generate mobile screenshot 1080x1920
  const screenshotMobilePng = await sharp(Buffer.from(screenshotMobileSvg))
    .resize(1080, 1920)
    .png()
    .toBuffer();

  // Generate desktop screenshot 1920x1080
  const screenshotDesktopPng = await sharp(Buffer.from(screenshotDesktopSvg))
    .resize(1920, 1080)
    .png()
    .toBuffer();

  // Write to ./public and ./
  const targets = [path.join(process.cwd(), 'public'), process.cwd()];
  for (const dir of targets) {
    fs.writeFileSync(path.join(dir, 'icon-512.png'), icon512Png);
    fs.writeFileSync(path.join(dir, 'icon-192.png'), icon192Png);
    fs.writeFileSync(path.join(dir, 'screenshot-mobile.png'), screenshotMobilePng);
    fs.writeFileSync(path.join(dir, 'screenshot-desktop.png'), screenshotDesktopPng);
  }

  // Also write SVGs
  const pubDir = path.join(process.cwd(), 'public');
  const rootDir = process.cwd();
  fs.writeFileSync(path.join(pubDir, 'icon-512.svg'), iconSvg);
  fs.writeFileSync(path.join(rootDir, 'icon-512.svg'), iconSvg);
  fs.writeFileSync(path.join(pubDir, 'screenshot-mobile.svg'), screenshotMobileSvg);
  fs.writeFileSync(path.join(rootDir, 'screenshot-mobile.svg'), screenshotMobileSvg);
  fs.writeFileSync(path.join(pubDir, 'screenshot-desktop.svg'), screenshotDesktopSvg);
  fs.writeFileSync(path.join(rootDir, 'screenshot-desktop.svg'), screenshotDesktopSvg);

  console.log('All image assets successfully written to ./public and ./');
}

generateAssets().catch(err => {
  console.error(err);
  process.exit(1);
});
