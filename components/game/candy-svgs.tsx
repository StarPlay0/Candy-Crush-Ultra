'use client';

import React from 'react';
import { CandyColor, SpecialType, ObstacleType } from '@/lib/game-types';

interface CandySvgProps {
  color: CandyColor | 'rainbow';
  special?: SpecialType;
  className?: string;
  size?: number;
}

export const CandySvg = React.memo(function CandySvg({ color, special = 'none', className = '', size = 52 }: CandySvgProps) {
  // If it's a Color Bomb (Choco Truffle with Rainbow Sprinkles)
  if (color === 'rainbow' || special === 'color-bomb') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={`select-none ${className}`}>
        <defs>
          <radialGradient id="chocoBallGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#6D4C41" />
            <stop offset="45%" stopColor="#4E342E" />
            <stop offset="85%" stopColor="#2A1713" />
            <stop offset="100%" stopColor="#150805" />
          </radialGradient>
        </defs>
        
        {/* Pulsing Golden Rainbow Halo */}
        <circle 
          cx="50" 
          cy="50" 
          r="46" 
          fill="none" 
          stroke="#FFD54F" 
          strokeWidth="2.5" 
          strokeDasharray="6,4" 
        />
        
        {/* Main Decadent Chocolate Sphere */}
        <circle cx="50" cy="50" r="42" fill="url(#chocoBallGrad)" stroke="#8D6E63" strokeWidth="1" />
        
        {/* Glossy Chocolate Glaze Highlight */}
        <ellipse cx="36" cy="28" rx="16" ry="9" fill="#FFFFFF" fillOpacity="0.32" transform="rotate(-25 36 28)" />
        <circle cx="28" cy="34" r="3.5" fill="#FFFFFF" fillOpacity="0.55" />

        {/* 3D Colorful Candy Sprinkles */}
        {/* Yellows */}
        <circle cx="28" cy="36" r="4.5" fill="#FFD600" stroke="#F57F17" strokeWidth="0.8" />
        <circle cx="68" cy="38" r="4.5" fill="#FFEA00" stroke="#F57F17" strokeWidth="0.8" />
        <circle cx="48" cy="72" r="4" fill="#FFD600" stroke="#F57F17" strokeWidth="0.8" />
        
        {/* Reds & Pinks */}
        <circle cx="50" cy="22" r="4.5" fill="#FF1744" stroke="#B71C1C" strokeWidth="0.8" />
        <circle cx="22" cy="54" r="4.5" fill="#FF4081" stroke="#C2185B" strokeWidth="0.8" />
        <circle cx="66" cy="66" r="4.2" fill="#FF1744" stroke="#B71C1C" strokeWidth="0.8" />
        
        {/* Cyans & Blues */}
        <circle cx="40" cy="40" r="4.8" fill="#00E5FF" stroke="#00838F" strokeWidth="0.8" />
        <circle cx="72" cy="24" r="4.2" fill="#2979FF" stroke="#1565C0" strokeWidth="0.8" />
        <circle cx="30" cy="70" r="4.2" fill="#00B0FF" stroke="#0277BD" strokeWidth="0.8" />
        
        {/* Greens */}
        <circle cx="58" cy="48" r="4.8" fill="#76FF03" stroke="#33691E" strokeWidth="0.8" />
        <circle cx="34" cy="18" r="3.8" fill="#00E676" stroke="#1B5E20" strokeWidth="0.8" />
        <circle cx="78" cy="52" r="4" fill="#64DD17" stroke="#33691E" strokeWidth="0.8" />
        
        {/* Oranges */}
        <circle cx="18" cy="38" r="4" fill="#FF9100" stroke="#E65100" strokeWidth="0.8" />
        <circle cx="46" cy="58" r="4.5" fill="#FF6D00" stroke="#BF360C" strokeWidth="0.8" />
        
        {/* Purples */}
        <circle cx="58" cy="30" r="4.2" fill="#E040FB" stroke="#7B1FA2" strokeWidth="0.8" />
        <circle cx="58" cy="80" r="3.5" fill="#D500F9" stroke="#6A1B9A" strokeWidth="0.8" />

        {/* Center Star Glimmer */}
        <path d="M50,42 L52,48 L58,50 L52,52 L50,58 L48,52 L42,50 L48,48 Z" fill="#FFFFFF" fillOpacity="0.95" />
      </svg>
    );
  }

  // Jelly Fish Special
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
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={`select-none ${className}`}>
        <defs>
          <linearGradient id={`fishGrad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
            <stop offset="30%" stopColor={c.body} />
            <stop offset="100%" stopColor={c.fin} />
          </linearGradient>
        </defs>
        {/* Tail Fin */}
        <path d="M15,50 Q5,30 18,35 Q22,50 18,65 Q5,70 15,50 Z" fill={c.fin} />
        {/* Dorsal Fin */}
        <path d="M45,26 Q60,16 70,28 Q55,32 45,26 Z" fill={c.fin} opacity="0.95" />
        {/* Main Body */}
        <path d="M18,50 Q28,25 65,30 Q92,42 88,52 Q85,65 60,72 Q28,75 18,50 Z" fill={`url(#fishGrad-${color})`} stroke="#FFFFFF" strokeWidth="1.8" />
        {/* Scales pattern */}
        <path d="M40,42 Q45,38 50,42 M48,48 Q53,44 58,48 M40,54 Q45,50 50,54 M56,58 Q61,54 66,58" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        {/* Eye */}
        <circle cx="76" cy="45" r="5" fill="#FFFFFF" />
        <circle cx="77.5" cy="44" r="2.8" fill="#0D47A1" />
        <circle cx="78.5" cy="43" r="1.2" fill="#FFFFFF" />
        {/* Specular shine */}
        <ellipse cx="60" cy="36" rx="14" ry="4" fill="#FFFFFF" fillOpacity="0.45" transform="rotate(-5 60 36)" />
      </svg>
    );
  }

  const isWrapped = special === 'wrapped';
  const isStripedH = special === 'striped-h';
  const isStripedV = special === 'striped-v';

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`} style={{ width: size, height: size }}>
      {/* Wrapped Cellophane background wrapper */}
      {isWrapped && (
        <svg width={size * 1.25} height={size * 1.25} viewBox="0 0 100 100" className="absolute inset-0 m-auto pointer-events-none z-0">
          {/* Left twist */}
          <path d="M14,50 L2,32 Q12,50 2,68 Z" fill="#FFFFFF" fillOpacity="0.85" stroke="#FFFFFF" strokeWidth="1.2" />
          <path d="M14,50 L6,40 M14,50 L6,60" stroke="#E2E8F0" strokeWidth="1" />
          {/* Right twist */}
          <path d="M86,50 L98,32 Q88,50 98,68 Z" fill="#FFFFFF" fillOpacity="0.85" stroke="#FFFFFF" strokeWidth="1.2" />
          <path d="M86,50 L94,40 M86,50 L94,60" stroke="#E2E8F0" strokeWidth="1" />
          {/* Wrapper bag glow */}
          <rect x="12" y="12" width="76" height="76" rx="22" fill="#FFFFFF" fillOpacity="0.28" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="5,2" />
        </svg>
      )}

      {/* Main Cute Candy SVG Shape */}
      <div className="relative z-10 flex items-center justify-center">
        {renderCandyShape(color as CandyColor, size)}
      </div>

      {/* Striped Sugar Ribbons Overlay */}
      {(isStripedH || isStripedV) && (
        <svg width={size} height={size} viewBox="0 0 100 100" className="absolute inset-0 pointer-events-none z-20">
          <defs>
            <linearGradient id="stripeShine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#FFF9C4" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          {isStripedH ? (
            <g stroke="url(#stripeShine)" strokeWidth="6" strokeLinecap="round">
              <line x1="22" y1="36" x2="78" y2="36" />
              <line x1="16" y1="50" x2="84" y2="50" />
              <line x1="22" y1="64" x2="78" y2="64" />
            </g>
          ) : (
            <g stroke="url(#stripeShine)" strokeWidth="6" strokeLinecap="round">
              <line x1="36" y1="22" x2="36" y2="78" />
              <line x1="50" y1="16" x2="50" y2="84" />
              <line x1="64" y1="22" x2="64" y2="78" />
            </g>
          )}
        </svg>
      )}
    </div>
  );
});

function renderCandyShape(color: CandyColor, size: number) {
  switch (color) {
    // 🔴 RED: Cute Strawberry Jelly Bean / Heart Bonbon
    case 'red':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="select-none">
          <defs>
            <radialGradient id="redStrawberryGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FF7096" />
              <stop offset="25%" stopColor="#FF1358" />
              <stop offset="70%" stopColor="#D00036" />
              <stop offset="100%" stopColor="#7A001C" />
            </radialGradient>
            <linearGradient id="redGleam" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Main Rounded Strawberry Bean */}
          <path
            d="M32,24 C46,14 74,18 82,34 C90,50 86,74 72,84 C56,94 36,90 24,78 C12,64 16,36 32,24 Z"
            fill="url(#redStrawberryGrad)"
            stroke="#FFB3C6"
            strokeWidth="1.8"
          />
          {/* Inner 3D depth lip */}
          <path
            d="M36,28 C48,20 70,22 76,36 C82,50 78,70 66,78 C52,86 38,82 28,72 C18,60 22,38 36,28 Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeOpacity="0.25"
          />
          {/* Primary Top Glaze Specular */}
          <ellipse cx="44" cy="30" rx="14" ry="7" fill="url(#redGleam)" transform="rotate(-18 44 30)" />
          <circle cx="35" cy="36" r="2.8" fill="#FFFFFF" fillOpacity="0.75" />
          
          {/* Cute Strawberry Sugar Dots */}
          <circle cx="48" cy="48" r="1.8" fill="#FFF0F5" fillOpacity="0.8" />
          <circle cx="62" cy="42" r="1.8" fill="#FFF0F5" fillOpacity="0.8" />
          <circle cx="58" cy="62" r="1.8" fill="#FFF0F5" fillOpacity="0.8" />
          <circle cx="40" cy="64" r="1.8" fill="#FFF0F5" fillOpacity="0.8" />

          {/* Bottom Crescent Soft Glow */}
          <path d="M34,80 Q50,86 64,78" fill="none" stroke="#FFA3B8" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        </svg>
      );

    // 🟠 ORANGE: Juicy Mandarin / Sunkissed Lozenge
    case 'orange':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="select-none">
          <defs>
            <radialGradient id="orangeMandarinGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFE082" />
              <stop offset="25%" stopColor="#FFAA00" />
              <stop offset="70%" stopColor="#FF6B00" />
              <stop offset="100%" stopColor="#C73E00" />
            </radialGradient>
            <linearGradient id="orangeSwirl" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {/* Plump Oval Lozenge */}
          <ellipse cx="50" cy="50" rx="34" ry="40" fill="url(#orangeMandarinGrad)" stroke="#FFE8B2" strokeWidth="1.8" />
          
          {/* Concentric Candy Swirl Rings */}
          <ellipse cx="50" cy="50" rx="24" ry="30" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeOpacity="0.3" />
          <ellipse cx="50" cy="50" rx="14" ry="18" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeOpacity="0.35" />
          
          {/* Big Glossy Specular Gleam */}
          <ellipse cx="40" cy="32" rx="15" ry="10" fill="#FFFFFF" fillOpacity="0.65" transform="rotate(-15 40 32)" />
          <circle cx="32" cy="40" r="3" fill="#FFFFFF" fillOpacity="0.75" />

          {/* Star Sparkle */}
          <path d="M60,40 L62,45 L67,47 L62,49 L60,54 L58,49 L53,47 L58,45 Z" fill="#FFFFFF" fillOpacity="0.85" />
        </svg>
      );

    // 🟡 YELLOW: Butterscotch Honey Drop / Star Bonbon
    case 'yellow':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="select-none">
          <defs>
            <radialGradient id="yellowButterscotchGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFFFB3" />
              <stop offset="30%" stopColor="#FFE600" />
              <stop offset="75%" stopColor="#FFB703" />
              <stop offset="100%" stopColor="#FB8500" />
            </radialGradient>
          </defs>
          {/* Cute Pointed Bonbon Teardrop */}
          <path
            d="M50,14 C62,28 82,46 82,64 C82,82 68,90 50,90 C32,90 18,82 18,64 C18,46 38,28 50,14 Z"
            fill="url(#yellowButterscotchGrad)"
            stroke="#FFFDE7"
            strokeWidth="1.8"
          />
          {/* Inner Facet Lines */}
          <path
            d="M50,18 L50,86 M24,64 Q50,76 76,64"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeOpacity="0.3"
          />
          {/* Luscious Teardrop Glaze */}
          <ellipse cx="40" cy="50" rx="12" ry="22" fill="#FFFFFF" fillOpacity="0.7" transform="rotate(-14 40 50)" />
          <circle cx="34" cy="62" r="3" fill="#FFFFFF" fillOpacity="0.8" />
          
          {/* Center Sweet Sparkle */}
          <path d="M50,44 L52,48 L56,50 L52,52 L50,56 L48,52 L44,50 L48,48 Z" fill="#FFFFFF" fillOpacity="0.9" />
        </svg>
      );

    // 🟢 GREEN: Refreshing Lime / Green Apple Gummy Cushion
    case 'green':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="select-none">
          <defs>
            <radialGradient id="greenAppleGrad" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#D8F3DC" />
              <stop offset="25%" stopColor="#52B788" />
              <stop offset="70%" stopColor="#2D6A4F" />
              <stop offset="100%" stopColor="#081C15" />
            </radialGradient>
          </defs>
          {/* Beveled Pillow Square Lozenge */}
          <rect x="16" y="16" width="68" height="68" rx="22" fill="url(#greenAppleGrad)" stroke="#B7E4C7" strokeWidth="1.8" />
          
          {/* Inset Cushion Bevel Ring */}
          <rect x="23" y="23" width="54" height="54" rx="15" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.4" />
          
          {/* Curving Glass Reflection */}
          <ellipse cx="36" cy="32" rx="15" ry="8" fill="#FFFFFF" fillOpacity="0.8" transform="rotate(-16 36 32)" />
          <circle cx="28" cy="38" r="3" fill="#FFFFFF" fillOpacity="0.85" />
          
          {/* Cross Sweet Glimmer */}
          <path d="M60,60 L62,64 L66,66 L62,68 L60,72 L58,68 L54,66 L58,64 Z" fill="#FFFFFF" fillOpacity="0.8" />
        </svg>
      );

    // 🔵 BLUE: Blueberry Soda Bubble / Lollipop Drop
    case 'blue':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="select-none">
          <defs>
            <radialGradient id="blueSodaGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#CAF0F8" />
              <stop offset="25%" stopColor="#48CAE4" />
              <stop offset="70%" stopColor="#0077B6" />
              <stop offset="100%" stopColor="#03045E" />
            </radialGradient>
          </defs>
          {/* Round Bubble Sphere */}
          <circle cx="50" cy="50" r="39" fill="url(#blueSodaGrad)" stroke="#ADE8F4" strokeWidth="1.8" />
          
          {/* Milky Cream Spiral Swirl */}
          <path
            d="M50,22 C64,22 78,34 78,50 C78,66 64,78 50,78 C36,78 24,66 24,52 C24,40 34,32 46,32 C56,32 64,40 64,49 C64,56 58,62 50,62 C44,62 40,57 40,51"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeOpacity="0.45"
          />
          
          {/* Glossy Double Crescent Highlights */}
          <ellipse cx="36" cy="30" rx="14" ry="8" fill="#FFFFFF" fillOpacity="0.85" transform="rotate(-28 36 30)" />
          <circle cx="28" cy="36" r="3.2" fill="#FFFFFF" fillOpacity="0.9" />
          <ellipse cx="64" cy="68" rx="8" ry="4" fill="#FFFFFF" fillOpacity="0.3" transform="rotate(35 64 68)" />
        </svg>
      );

    // 🟣 PURPLE: Grape Jelly Gumdrop / Flower Jewel
    case 'purple':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="select-none">
          <defs>
            <radialGradient id="purpleGrapeGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#F72585" />
              <stop offset="30%" stopColor="#B5179E" />
              <stop offset="75%" stopColor="#7209B7" />
              <stop offset="100%" stopColor="#3A0CA3" />
            </radialGradient>
          </defs>
          {/* Rounded 6-Petal Crystal Jewel */}
          <path
            d="M50,14 C62,14 74,20 80,30 C86,40 86,54 82,66 C76,78 64,86 50,86 C36,86 24,78 18,66 C14,54 14,40 20,30 C26,20 38,14 50,14 Z"
            fill="url(#purpleGrapeGrad)"
            stroke="#F1C0E8"
            strokeWidth="1.8"
          />
          {/* Facet Structure */}
          <path 
            d="M50,16 L50,50 M80,30 L50,50 M82,66 L50,50 M50,86 L50,50 M18,66 L50,50 M20,30 L50,50" 
            stroke="#FFFFFF" 
            strokeWidth="1.6" 
            strokeOpacity="0.35" 
          />
          <circle cx="50" cy="50" r="9" fill="#FFFFFF" fillOpacity="0.3" />
          
          {/* Shiny Specular Glare */}
          <ellipse cx="36" cy="28" rx="12" ry="7" fill="#FFFFFF" fillOpacity="0.8" transform="rotate(-15 36 28)" />
          <circle cx="28" cy="34" r="2.8" fill="#FFFFFF" fillOpacity="0.85" />
        </svg>
      );
  }
}

export const ObstacleSvg = React.memo(function ObstacleSvg({ type, size = 52 }: { type: ObstacleType; size?: number }) {
  if (type === 'licorice') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="select-none">
        <defs>
          <radialGradient id="licoriceGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#616161" />
            <stop offset="40%" stopColor="#212121" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
        </defs>
        {/* Licorice Spiral */}
        <circle cx="50" cy="50" r="40" fill="url(#licoriceGrad)" stroke="#424242" strokeWidth="3" />
        <path d="M50,50 m-30,0 a30,30 0 1,0 60,0 a30,30 0 1,0 -60,0" fill="none" stroke="#000000" strokeWidth="6" />
        <path d="M50,50 m-18,0 a18,18 0 1,0 36,0 a18,18 0 1,0 -36,0" fill="none" stroke="#424242" strokeWidth="4" />
        {/* Center Pearl */}
        <circle cx="50" cy="50" r="8" fill="#E0E0E0" stroke="#9E9E9E" strokeWidth="1" />
        <circle cx="48" cy="48" r="2.5" fill="#FFFFFF" />
      </svg>
    );
  }

  if (type === 'chocolate') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="select-none">
        <defs>
          <linearGradient id="chocoTile" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6D4C41" />
            <stop offset="100%" stopColor="#3E2723" />
          </linearGradient>
        </defs>
        <rect x="12" y="12" width="76" height="76" rx="12" fill="url(#chocoTile)" stroke="#8D6E63" strokeWidth="3" />
        <rect x="22" y="22" width="56" height="56" rx="8" fill="none" stroke="#27130E" strokeWidth="3" />
        <text x="50" y="55" fontSize="11" fontWeight="900" fill="#A1887F" textAnchor="middle" fontFamily="sans-serif">CANDY</text>
      </svg>
    );
  }

  if (type === 'waffle') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="select-none">
        <rect x="12" y="12" width="76" height="76" rx="14" fill="#D7CCC8" stroke="#8D6E63" strokeWidth="3" />
        <rect x="20" y="20" width="60" height="60" rx="8" fill="#EFEBE9" />
        <path d="M35,20 L35,80 M50,20 L50,80 M65,20 L65,80 M20,35 L80,35 M20,50 L80,50 M20,65 L80,65" stroke="#BCAAA4" strokeWidth="2.5" strokeLinecap="round" />
        {/* Powdered sugar frosting corners */}
        <circle cx="28" cy="28" r="4" fill="#FFFFFF" fillOpacity="0.8" />
        <circle cx="72" cy="28" r="4" fill="#FFFFFF" fillOpacity="0.8" />
        <circle cx="28" cy="72" r="4" fill="#FFFFFF" fillOpacity="0.8" />
        <circle cx="72" cy="72" r="4" fill="#FFFFFF" fillOpacity="0.8" />
      </svg>
    );
  }

  return null;
});
