'use client';

import React from 'react';
import { motion } from 'motion/react';
import { X, ShoppingBag } from 'lucide-react';
import { CandySvg } from './candy-svgs';
import { sound } from '@/lib/audio';
import { haptics } from '@/lib/haptics';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  boosters?: {
    colorBomb: number;
    striped: number;
    wrapped: number;
  };
  onBuyBooster: (type: string, cost: number) => void;
  isDark?: boolean;
}

export function ShopModal({
  isOpen,
  onClose,
  coins,
  boosters,
  onBuyBooster,
  isDark = false,
}: ShopModalProps) {
  if (!isOpen) return null;

  const items = [
    {
      id: 'color-bomb',
      name: 'Color Bomb ("Boll")',
      description: 'Zaps all candies of one color with lightning!',
      cost: 150,
      icon: <CandySvg color="rainbow" special="color-bomb" size={36} />,
      bg: 'bg-[#FBCFE8]',
      owned: boosters?.colorBomb ?? 0,
    },
    {
      id: 'hammer',
      name: 'Lollipop Hammer',
      description: 'Smashes any single candy or blocker instantly',
      cost: 100,
      icon: <span className="text-3xl">🔨</span>,
      bg: 'bg-[#BAE6FD]',
      owned: boosters?.wrapped ?? 0,
    },
    {
      id: 'switch',
      name: 'Free Switch Hand',
      description: 'Swaps any two candies without spending a move',
      cost: 80,
      icon: <span className="text-3xl">✋</span>,
      bg: 'bg-[#99F6E4]',
      owned: boosters?.striped ?? 0,
    },
    {
      id: 'extra-moves',
      name: '+5 Extra Moves',
      description: 'Adds 5 emergency moves to beat tough levels',
      cost: 120,
      icon: <span className="text-2xl font-black text-amber-700">+5</span>,
      bg: 'bg-[#FEF08A]',
      owned: 0,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="w-full max-w-md bg-white/95 dark:bg-slate-900/95 rounded-[2.5rem] border-6 border-pink-300 dark:border-indigo-600 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={() => {
            haptics.touch();
            onClose();
          }}
          className="absolute top-5 right-5 w-9 h-9 bg-pink-100 dark:bg-slate-800 text-pink-800 dark:text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black text-xs uppercase tracking-widest px-4 py-1 rounded-full shadow-md mb-2">
            <ShoppingBag size={14} />
            Candy Emporium
          </div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            Sweet Boosters Shop
          </h2>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-900/50 rounded-full border border-amber-300 text-amber-900 dark:text-amber-200 font-black text-sm">
            <span>Your Gold Bars: {coins}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {items.map(item => {
            const canAfford = coins >= item.cost;

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border-2 border-black/5 shadow-md flex items-center justify-between gap-3 ${item.bg}`}
              >
                <div className="w-12 h-12 bg-white/80 rounded-2xl flex items-center justify-center shadow-xs flex-shrink-0 relative">
                  {item.icon}
                  {item.id !== 'extra-moves' && (
                    <span className="absolute -top-1.5 -right-1.5 bg-pink-600 text-white font-black text-[10px] px-1.5 py-0.5 rounded-full shadow-xs border border-white">
                      x{item.owned}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-slate-900 text-sm tracking-tight truncate">
                      {item.name}
                    </h4>
                  </div>
                  <p className="text-[11px] font-bold text-slate-700 leading-tight">
                    {item.description}
                  </p>
                </div>

                <button
                  disabled={!canAfford}
                  onClick={() => {
                    sound.playPop(1.3);
                    haptics.special();
                    onBuyBooster(item.id, item.cost);
                  }}
                  className={`px-3 py-2 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1 shadow-md transition-all cursor-pointer ${
                    canAfford
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 hover:scale-105 active:scale-95'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span>{item.cost}</span>
                  <div className="w-2.5 h-2 bg-amber-700 rounded-xs" />
                </button>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
