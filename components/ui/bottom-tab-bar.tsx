'use client';

import React from 'react';
import { sound } from '@/lib/audio';
import { haptics } from '@/lib/haptics';

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
    haptics.touch();
    onSelectTab(tab);
  };

  return (
    <div className="relative z-30 w-full max-w-md mx-auto pointer-events-auto">
      {/* Pink Base Bar matching Image 2 */}
      <div className="bg-[#FF85A2] dark:bg-pink-900 border-t-2 border-white/60 shadow-2xl flex items-center justify-between h-16 px-1">
        
        {/* Tab 1: MAP (Yellow highlighted tab block in Image 2) */}
        <button
          type="button"
          onClick={() => handleTabClick('map')}
          className={`flex-1 h-full flex flex-col items-center justify-center transition-all cursor-pointer relative ${
            currentTab === 'map'
              ? 'bg-[#FFD100] shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)] border-t-4 border-white'
              : 'hover:bg-white/10 opacity-90'
          }`}
        >
          {/* Candy Stepping Stone / Map Icon */}
          <div className="relative -mt-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-400 to-cyan-300 border-2 border-white shadow-md flex items-center justify-center">
              <div className="w-5 h-3 rounded-full bg-pink-500 border border-white shadow-xs" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border border-white" />
          </div>
          <span
            className={`font-black text-[11px] uppercase tracking-wider mt-0.5 ${
              currentTab === 'map' ? 'text-amber-950 font-black' : 'text-white'
            }`}
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            MAP
          </span>
        </button>

        {/* Tab 2: EVENTS (Calendar Checkmark Icon matching Image 2) */}
        <button
          type="button"
          onClick={() => handleTabClick('events')}
          className={`flex-1 h-full flex flex-col items-center justify-center transition-all cursor-pointer relative ${
            currentTab === 'events'
              ? 'bg-[#FFD100] shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)] border-t-4 border-white'
              : 'hover:bg-white/10 opacity-90'
          }`}
        >
          {/* Calendar Check Icon */}
          <div className="relative -mt-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-cyan-400 border-2 border-white shadow-md flex items-center justify-center p-1">
              <div className="w-full h-full bg-white rounded-xs flex items-center justify-center">
                <span className="text-emerald-600 font-black text-sm">✓</span>
              </div>
            </div>
            {/* Top gold rings */}
            <div className="absolute -top-1 left-1.5 flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-300 border border-amber-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-300 border border-amber-500" />
            </div>
          </div>
          <span
            className={`font-black text-[11px] uppercase tracking-wider mt-0.5 ${
              currentTab === 'events' ? 'text-amber-950 font-black' : 'text-white'
            }`}
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            EVENTS
          </span>
        </button>

        {/* Tab 3: SHOP (Striped Awning Kiosk Icon matching Image 2) */}
        <button
          type="button"
          onClick={() => handleTabClick('shop')}
          className={`flex-1 h-full flex flex-col items-center justify-center transition-all cursor-pointer relative ${
            currentTab === 'shop'
              ? 'bg-[#FFD100] shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)] border-t-4 border-white'
              : 'hover:bg-white/10 opacity-90'
          }`}
        >
          {/* Candy Shop Awning Kiosk Icon */}
          <div className="relative -mt-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-pink-500 to-rose-400 border-2 border-white shadow-md flex flex-col items-center justify-between p-1 overflow-hidden">
              {/* Striped Awning */}
              <div className="w-full h-2.5 bg-white rounded-xs flex overflow-hidden border-b border-pink-300">
                <div className="flex-1 bg-pink-500" />
                <div className="flex-1 bg-white" />
                <div className="flex-1 bg-pink-500" />
                <div className="flex-1 bg-white" />
                <div className="flex-1 bg-pink-500" />
              </div>
              <div className="w-4 h-2 bg-pink-700 rounded-xs" />
            </div>
          </div>
          <span
            className={`font-black text-[11px] uppercase tracking-wider mt-0.5 ${
              currentTab === 'shop' ? 'text-amber-950 font-black' : 'text-white'
            }`}
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            SHOP
          </span>
        </button>

      </div>
    </div>
  );
}

