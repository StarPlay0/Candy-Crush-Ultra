'use client';

import React from 'react';
import { Map, CalendarCheck, ShoppingCart, Sparkles } from 'lucide-react';
import { sound } from '@/lib/audio';

interface BottomTabBarProps {
  currentTab: 'map' | 'events' | 'shop';
  onSelectTab: (tab: 'map' | 'events' | 'shop') => void;
  isDark?: boolean;
}

export function BottomTabBar({
  currentTab,
  onSelectTab,
  isDark = false,
}: BottomTabBarProps) {
  const handleTabClick = (tab: 'map' | 'events' | 'shop') => {
    sound.playClick();
    onSelectTab(tab);
  };

  return (
    <div className="relative z-30 w-full max-w-lg mx-auto px-4 pb-2 pt-1 pointer-events-auto">
      <div className="bg-gradient-to-r from-pink-300 via-rose-200 to-pink-300 dark:from-indigo-950 dark:via-purple-900 dark:to-indigo-950 rounded-[2rem] border-3 border-white shadow-2xl p-1.5 flex items-center justify-around backdrop-blur-md">
        {/* Tab 1: MAP (Matching Screenshot 1 Yellow Tab) */}
        <button
          onClick={() => handleTabClick('map')}
          className={`flex-1 py-2 px-3 rounded-2xl flex flex-col items-center justify-center transition-all ${
            currentTab === 'map'
              ? 'bg-gradient-to-b from-yellow-300 to-amber-400 border-2 border-white shadow-lg scale-105 text-amber-950'
              : 'hover:bg-white/30 text-rose-900 dark:text-pink-200'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-cyan-400 border border-white flex items-center justify-center shadow-xs">
            <Map size={18} className="text-white" />
          </div>
          <span className="font-black text-xs uppercase tracking-wider mt-1 drop-shadow-xs">
            MAP
          </span>
        </button>

        {/* Tab 2: EVENTS / TASKS (Matching Screenshot 1) */}
        <button
          onClick={() => handleTabClick('events')}
          className={`flex-1 py-2 px-3 rounded-2xl flex flex-col items-center justify-center transition-all ${
            currentTab === 'events'
              ? 'bg-gradient-to-b from-yellow-300 to-amber-400 border-2 border-white shadow-lg scale-105 text-amber-950'
              : 'hover:bg-white/30 text-rose-900 dark:text-pink-200'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-lime-400 border border-white flex items-center justify-center shadow-xs">
            <CalendarCheck size={18} className="text-white" />
          </div>
          <span className="font-black text-xs uppercase tracking-wider mt-1 drop-shadow-xs">
            EVENTS
          </span>
        </button>

        {/* Tab 3: SHOP (Matching Screenshot 1) */}
        <button
          onClick={() => handleTabClick('shop')}
          className={`flex-1 py-2 px-3 rounded-2xl flex flex-col items-center justify-center transition-all ${
            currentTab === 'shop'
              ? 'bg-gradient-to-b from-yellow-300 to-amber-400 border-2 border-white shadow-lg scale-105 text-amber-950'
              : 'hover:bg-white/30 text-rose-900 dark:text-pink-200'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-pink-500 border border-white flex items-center justify-center shadow-xs">
            <ShoppingCart size={18} className="text-white" />
          </div>
          <span className="font-black text-xs uppercase tracking-wider mt-1 drop-shadow-xs">
            SHOP
          </span>
        </button>
      </div>
    </div>
  );
}
