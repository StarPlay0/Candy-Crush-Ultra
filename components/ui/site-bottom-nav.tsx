'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gamepad2, Award, Flame, MapPin, MessageSquareText } from 'lucide-react';
import { sound } from '@/lib/audio';
import { haptics } from '@/lib/haptics';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
  isActive: (pathname: string) => boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    name: 'Play',
    href: '/',
    icon: Gamepad2,
    badge: '199',
    isActive: (pathname) => pathname === '/',
  },
  {
    name: 'Why Us',
    href: '/comparison',
    icon: Award,
    isActive: (pathname) => pathname === '/comparison',
  },
  {
    name: 'Features',
    href: '/features/free-match-3-game',
    icon: Flame,
    isActive: (pathname) => pathname.startsWith('/features'),
  },
  {
    name: 'Locations',
    href: '/locations/us',
    icon: MapPin,
    isActive: (pathname) => pathname.startsWith('/locations'),
  },
  {
    name: 'Reviews & FAQ',
    href: '/reviews',
    icon: MessageSquareText,
    badge: '5.0★',
    isActive: (pathname) => pathname === '/reviews' || pathname === '/faq',
  },
];

export function SiteBottomNav() {
  const pathname = usePathname() || '/';

  const handleClick = () => {
    try {
      sound.playClick();
      haptics.touch();
    } catch {
      // Safe fallback
    }
  };

  return (
    <aside 
      aria-label="Bottom Navigation"
      className="fixed bottom-0 inset-x-0 z-40 pointer-events-none pb-safe transition-all duration-300"
    >
      <div className="max-w-xl mx-auto px-3 sm:px-6 pb-2.5 sm:pb-3 pointer-events-auto">
        <nav 
          role="navigation"
          aria-label="Main Site Navigation"
          className="bg-white/92 dark:bg-slate-900/95 backdrop-blur-xl border-2 border-pink-200/90 dark:border-pink-900/60 shadow-[0_12px_36px_rgba(236,72,153,0.22)] rounded-3xl p-1.5 flex items-center justify-between gap-1"
        >
          {NAV_ITEMS.map((item) => {
            const active = item.isActive(pathname);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleClick}
                aria-current={active ? 'page' : undefined}
                className={`relative flex-1 py-1.5 sm:py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 select-none group ${
                  active
                    ? 'bg-gradient-to-b from-pink-500 via-rose-500 to-purple-600 text-white shadow-md shadow-pink-500/25 scale-[1.03]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50/70 dark:hover:bg-slate-800/60'
                }`}
              >
                {/* Badge if present */}
                {item.badge && !active && (
                  <span className="absolute -top-1.5 -right-0.5 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-black text-[9px] px-1.5 py-0.2 rounded-full border border-white dark:border-slate-800 shadow-xs scale-90">
                    {item.badge}
                  </span>
                )}

                <div className={`p-1 rounded-xl transition-transform ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                  <Icon size={19} className={active ? 'text-white drop-shadow-xs' : 'text-slate-500 dark:text-slate-400 group-hover:text-pink-500'} />
                </div>

                <span className={`text-[10px] sm:text-[11px] font-black tracking-tight mt-0.5 truncate max-w-[68px] ${
                  active ? 'text-white' : 'text-slate-700 dark:text-slate-300'
                }`}>
                  {item.name}
                </span>

                {/* Subtle active glow dot */}
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 shadow-[0_0_6px_#FDE047] mt-0.5" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
