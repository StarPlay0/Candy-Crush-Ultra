'use client';

import React from 'react';
import { CandyColor, SpecialType, ObstacleType } from '@/lib/game-types';

interface CandySvgProps {
  color: CandyColor | 'rainbow';
  special?: SpecialType;
  className?: string;
  size?: number;
}

export function CandySvg({ color, special = 'none', className = '', size = 52 }: CandySvgProps) {
  // If it's a Color Bomb (Choco Ball with Rainbow Sprinkles)
  if (color === 'rainbow' || special === 'color-bomb') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={`filter drop-shadow-md select-none ${className}`}>
        <defs>
          <radialGradient id="chocoBallGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#5D4037" />
            <stop offset="50%" stopColor="#3E2723" />
            <stop offset="90%" stopColor="#1B0000" />
            <stop offset="100%" stopColor="#0D0000" />
          </radialGradient>
          <radialGradient id="sprinkleShine" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
          <filter id="chocoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Pulsing golden aura */}
        <circle cx="50" cy="50" r="46" fill="url(#chocoBallGrad)" stroke="#FFD54F" strokeWidth="2.5" strokeDasharray="6,3" className="animate-spin" style={{ transformOrigin: '50px 50px', animationDuration: '8s' }} />
        
        {/* Main Chocolate Sphere */}
        <circle cx="50" cy="50" r="43" fill="url(#chocoBallGrad)" />
        
        {/* Specular 3D Highlight */}
        <ellipse cx="38" cy="30" rx="16" ry="10" fill="#FFFFFF" fillOpacity="0.25" transform="rotate(-20 38 30)" />

        {/* 3D Multi-Colored Rainbow Sprinkles (matching screenshot) */}
        {/* Yellows */}
        <circle cx="30" cy="32" r="5" fill="#FFEB3B" stroke="#F57F17" strokeWidth="0.8" />
        <circle cx="68" cy="40" r="4.5" fill="#FFEB3B" stroke="#F57F17" strokeWidth="0.8" />
        <circle cx="48" cy="72" r="4" fill="#FFEB3B" stroke="#F57F17" strokeWidth="0.8" />
        
        {/* Reds */}
        <circle cx="52" cy="24" r="4.5" fill="#F44336" stroke="#B71C1C" strokeWidth="0.8" />
        <circle cx="24" cy="54" r="5" fill="#F44336" stroke="#B71C1C" strokeWidth="0.8" />
        <circle cx="64" cy="66" r="4" fill="#F44336" stroke="#B71C1C" strokeWidth="0.8" />
        
        {/* Cyans / Blues */}
        <circle cx="42" cy="42" r="5" fill="#00E5FF" stroke="#00838F" strokeWidth="0.8" />
        <circle cx="72" cy="26" r="4.5" fill="#2979FF" stroke="#1565C0" strokeWidth="0.8" />
        <circle cx="32" cy="70" r="4.5" fill="#00E5FF" stroke="#00838F" strokeWidth="0.8" />
        
        {/* Greens */}
        <circle cx="58" cy="46" r="5" fill="#76FF03" stroke="#33691E" strokeWidth="0.8" />
        <circle cx="34" cy="18" r="3.5" fill="#00E676" stroke="#1B5E20" strokeWidth="0.8" />
        <circle cx="76" cy="54" r="4" fill="#76FF03" stroke="#33691E" strokeWidth="0.8" />
        
        {/* Oranges */}
        <circle cx="20" cy="38" r="4" fill="#FF9100" stroke="#E65100" strokeWidth="0.8" />
        <circle cx="46" cy="58" r="4.5" fill="#FF6D00" stroke="#BF360C" strokeWidth="0.8" />
        
        {/* Pinks / Purples */}
        <circle cx="58" cy="32" r="4.5" fill="#FF4081" stroke="#C2185B" strokeWidth="0.8" />
        <circle cx="60" cy="80" r="3.5" fill="#E040FB" stroke="#7B1FA2" strokeWidth="0.8" />
        <circle cx="42" cy="84" r="3.5" fill="#FF4081" stroke="#C2185B" strokeWidth="0.8" />

        {/* Center Star Sparkle */}
        <path d="M50,42 L52,48 L58,50 L52,52 L50,58 L48,52 L42,50 L48,48 Z" fill="#FFFFFF" fillOpacity="0.9" />
      </svg>
    );
  }

  // Jelly Fish
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
      <svg width={size} height={size} viewBox="0 0 100 100" className={`filter drop-shadow-md select-none ${className}`}>
        <defs>
          <linearGradient id={`fishGrad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="30%" stopColor={c.body} />
            <stop offset="100%" stopColor={c.fin} />
          </linearGradient>
        </defs>
        {/* Tail Fin */}
        <path d="M15,50 Q5,30 18,35 Q22,50 18,65 Q5,70 15,50 Z" fill={c.fin} />
        {/* Dorsal Fin */}
        <path d="M45,28 Q60,18 70,30 Q55,34 45,28 Z" fill={c.fin} opacity="0.9" />
        {/* Main Body */}
        <path d="M18,50 Q28,25 65,30 Q92,42 88,52 Q85,65 60,72 Q28,75 18,50 Z" fill={`url(#fishGrad-${color})`} stroke="#FFFFFF" strokeWidth="1.5" />
        {/* Scales pattern */}
        <path d="M40,42 Q45,38 50,42 M48,48 Q53,44 58,48 M40,54 Q45,50 50,54 M56,58 Q61,54 66,58" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        {/* Eye */}
        <circle cx="76" cy="45" r="4.5" fill="#FFFFFF" />
        <circle cx="77.5" cy="44" r="2.5" fill="#0D47A1" />
        <circle cx="78.5" cy="43" r="1" fill="#FFFFFF" />
        {/* Specular shine */}
        <ellipse cx="60" cy="36" rx="14" ry="4" fill="#FFFFFF" fillOpacity="0.4" transform="rotate(-5 60 36)" />
      </svg>
    );
  }

  // Wrapped Candy
  const isWrapped = special === 'wrapped';
  // Striped Candies
  const isStripedH = special === 'striped-h';
  const isStripedV = special === 'striped-v';

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`} style={{ width: size, height: size }}>
      {/* Wrapped Cellophane background wrapper */}
      {isWrapped && (
        <svg width={size * 1.15} height={size * 1.15} viewBox="0 0 100 100" className="absolute inset-0 m-auto pointer-events-none">
          {/* Left twist */}
          <path d="M12,50 L2,35 Q10,50 2,65 Z" fill="#FFFFFF" fillOpacity="0.75" stroke="#FFFFFF" strokeWidth="1" />
          {/* Right twist */}
          <path d="M88,50 L98,35 Q90,50 98,65 Z" fill="#FFFFFF" fillOpacity="0.75" stroke="#FFFFFF" strokeWidth="1" />
          {/* Wrapper bag glow */}
          <rect x="14" y="14" width="72" height="72" rx="20" fill="#FFFFFF" fillOpacity="0.25" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="4,2" />
        </svg>
      )}

      {/* Main Candy SVG Shape */}
      {renderCandyShape(color as CandyColor, size)}

      {/* Striped Laser Lines Overlay */}
      {(isStripedH || isStripedV) && (
        <svg width={size} height={size} viewBox="0 0 100 100" className="absolute inset-0 pointer-events-none">
          <defs>
            <linearGradient id="stripeShine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          {isStripedH ? (
            <g stroke="url(#stripeShine)" strokeWidth="6" strokeLinecap="round">
              <line x1="20" y1="36" x2="80" y2="36" />
              <line x1="16" y1="50" x2="84" y2="50" />
              <line x1="20" y1="64" x2="80" y2="64" />
            </g>
          ) : (
            <g stroke="url(#stripeShine)" strokeWidth="6" strokeLinecap="round">
              <line x1="36" y1="20" x2="36" y2="80" />
              <line x1="50" y1="16" x2="50" y2="84" />
              <line x1="64" y1="20" x2="64" y2="80" />
            </g>
          )}
        </svg>
      )}
    </div>
  );
}

function renderCandyShape(color: CandyColor, size: number) {
  switch (color) {
    case 'red': // Jelly Bean (Matching screenshot 2)
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="filter drop-shadow-md">
          <defs>
            <radialGradient id="redBeanGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FF8A80" />
              <stop offset="40%" stopColor="#FF1744" />
              <stop offset="85%" stopColor="#D50000" />
              <stop offset="100%" stopColor="#8A0000" />
            </radialGradient>
          </defs>
          {/* Curved Jelly Bean Path */}
          <path
            d="M26,38 C22,22 46,14 66,20 C84,26 88,48 82,68 C76,86 52,90 36,82 C22,74 30,50 26,38 Z"
            fill="url(#redBeanGrad)"
            stroke="#FFCDD2"
            strokeWidth="1.5"
          />
          {/* Specular Curved Highlight */}
          <path
            d="M38,26 C52,24 72,30 74,42 C74,34 56,26 42,28 Z"
            fill="#FFFFFF"
            fillOpacity="0.75"
          />
          <ellipse cx="40" cy="74" rx="8" ry="4" fill="#FFFFFF" fillOpacity="0.3" transform="rotate(-15 40 74)" />
        </svg>
      );

    case 'orange': // Oval / Teardrop (Matching screenshot 2 & 5)
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="filter drop-shadow-md">
          <defs>
            <radialGradient id="orangeGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFE082" />
              <stop offset="35%" stopColor="#FF9100" />
              <stop offset="85%" stopColor="#E65100" />
              <stop offset="100%" stopColor="#BF360C" />
            </radialGradient>
          </defs>
          {/* Symmetrical Rounded Oval */}
          <ellipse cx="50" cy="50" rx="30" ry="38" fill="url(#orangeGrad)" stroke="#FFE0B2" strokeWidth="1.5" />
          {/* Specular Core Highlight */}
          <ellipse cx="42" cy="34" rx="14" ry="20" fill="#FFFFFF" fillOpacity="0.6" transform="rotate(-10 42 34)" />
          <ellipse cx="50" cy="50" rx="18" ry="26" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.4" />
        </svg>
      );

    case 'yellow': // Lemon Drop / Teardrop (Matching screenshot 3 & 4)
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="filter drop-shadow-md">
          <defs>
            <radialGradient id="yellowGrad" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFFF8D" />
              <stop offset="40%" stopColor="#FFEA00" />
              <stop offset="85%" stopColor="#FFD600" />
              <stop offset="100%" stopColor="#F57F17" />
            </radialGradient>
          </defs>
          {/* Pointed Teardrop Shape */}
          <path
            d="M50,14 C58,28 78,46 78,64 C78,80 65,90 50,90 C35,90 22,80 22,64 C22,46 42,28 50,14 Z"
            fill="url(#yellowGrad)"
            stroke="#FFF9C4"
            strokeWidth="1.5"
          />
          {/* 3D Specular Highlight */}
          <ellipse cx="42" cy="52" rx="12" ry="20" fill="#FFFFFF" fillOpacity="0.65" transform="rotate(-12 42 52)" />
        </svg>
      );

    case 'green': // Square / Lozenge (Matching screenshot 2 & 3)
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="filter drop-shadow-md">
          <defs>
            <radialGradient id="greenGrad" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#B9F6CA" />
              <stop offset="35%" stopColor="#00E676" />
              <stop offset="85%" stopColor="#00C853" />
              <stop offset="100%" stopColor="#1B5E20" />
            </radialGradient>
          </defs>
          {/* Beveled Rounded Square */}
          <rect x="18" y="18" width="64" height="64" rx="20" fill="url(#greenGrad)" stroke="#C8E6C9" strokeWidth="1.5" />
          {/* Inset Cushion Bevel */}
          <rect x="24" y="24" width="52" height="52" rx="14" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.4" />
          <ellipse cx="36" cy="34" rx="14" ry="8" fill="#FFFFFF" fillOpacity="0.75" transform="rotate(-15 36 34)" />
        </svg>
      );

    case 'blue': // Lollipop / Sphere (Matching screenshot 2, 3, 4)
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="filter drop-shadow-md">
          <defs>
            <radialGradient id="blueGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#E1F5FE" />
              <stop offset="30%" stopColor="#40C4FF" />
              <stop offset="75%" stopColor="#0091EA" />
              <stop offset="100%" stopColor="#01579B" />
            </radialGradient>
          </defs>
          {/* Sphere with Swirl */}
          <circle cx="50" cy="50" r="36" fill="url(#blueGrad)" stroke="#B3E5FC" strokeWidth="1.5" />
          <ellipse cx="50" cy="50" rx="26" ry="18" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.4" transform="rotate(-15 50 50)" />
          <ellipse cx="38" cy="32" rx="14" ry="8" fill="#FFFFFF" fillOpacity="0.75" transform="rotate(-25 38 32)" />
        </svg>
      );

    case 'purple': // Hexagon / Flower Jewel (Matching screenshot 4)
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="filter drop-shadow-md">
          <defs>
            <radialGradient id="purpleGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#F3E5F5" />
              <stop offset="35%" stopColor="#EA80FC" />
              <stop offset="75%" stopColor="#AA00FF" />
              <stop offset="100%" stopColor="#4A148C" />
            </radialGradient>
          </defs>
          {/* 6-Lobed Crystal Flower */}
          <path
            d="M50,14 L78,28 L82,62 L54,84 L22,72 L18,36 Z"
            fill="url(#purpleGrad)"
            stroke="#E1BEE7"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Internal Facets */}
          <path d="M50,14 L50,50 M78,28 L50,50 M82,62 L50,50 M54,84 L50,50 M22,72 L50,50 M18,36 L50,50" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.4" />
          <circle cx="50" cy="50" r="10" fill="#FFFFFF" fillOpacity="0.4" />
          <ellipse cx="38" cy="30" rx="10" ry="6" fill="#FFFFFF" fillOpacity="0.75" />
        </svg>
      );
  }
}

export function ObstacleSvg({ type, size = 52 }: { type: ObstacleType; size?: number }) {
  if (type === 'licorice') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="filter drop-shadow-md select-none">
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
      <svg width={size} height={size} viewBox="0 0 100 100" className="filter drop-shadow-md select-none">
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
      <svg width={size} height={size} viewBox="0 0 100 100" className="filter drop-shadow-md select-none">
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
}
