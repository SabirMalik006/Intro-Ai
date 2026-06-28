"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sticker } from "lucide-react";

const STICKERS = [
  { id: "wave", emoji: "👋", label: "Wave" },
  { id: "clap", emoji: "👏", label: "Clap" },
  { id: "fire", emoji: "🔥", label: "Fire" },
  { id: "100", emoji: "💯", label: "100" },
  { id: "party", emoji: "🎉", label: "Party" },
  { id: "rocket", emoji: "🚀", label: "Rocket" },
  { id: "heart_eyes", emoji: "😍", label: "Love" },
  { id: "thumbsup", emoji: "👍", label: "Thumbs Up" },
  { id: "thumbsdown", emoji: "👎", label: "Thumbs Down" },
  { id: "clown", emoji: "🤡", label: "Clown" },
  { id: "alien", emoji: "👽", label: "Alien" },
  { id: "skull", emoji: "💀", label: "Skull" },
  { id: "trophy", emoji: "🏆", label: "Trophy" },
  { id: "star", emoji: "⭐", label: "Star" },
  { id: "rainbow", emoji: "🌈", label: "Rainbow" },
  { id: "check", emoji: "✅", label: "Check" },
  { id: "cross", emoji: "❌", label: "Cross" },
  { id: "eyes", emoji: "👀", label: "Eyes" },
  { id: "folded_hands", emoji: "🙏", label: "Pray" },
  { id: "muscle", emoji: "💪", label: "Muscle" },
  { id: "brain", emoji: "🧠", label: "Brain" },
  { id: "money", emoji: "💰", label: "Money" },
  { id: "coffee", emoji: "☕", label: "Coffee" },
  { id: "beer", emoji: "🍺", label: "Beer" },
  { id: "pizza", emoji: "🍕", label: "Pizza" },
  { id: "burger", emoji: "🍔", label: "Burger" },
  { id: "dog", emoji: "🐶", label: "Dog" },
  { id: "cat", emoji: "🐱", label: "Cat" },
  { id: "unicorn", emoji: "🦄", label: "Unicorn" },
  { id: "ghost", emoji: "👻", label: "Ghost" },
];

export default function StickerPicker({ onSelect }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg text-slate-400 hover:text-purple-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        title="Sticker"
      >
        <Sticker className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 8 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-14 left-10 z-50 w-[280px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <div className="p-3 border-b border-slate-100 dark:border-slate-700">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Stickers</p>
              </div>
              <div className="p-3 max-h-64 overflow-y-auto grid grid-cols-5 gap-2">
                {STICKERS.map((sticker) => (
                  <button
                    key={sticker.id}
                    type="button"
                    onClick={() => { onSelect(sticker); setOpen(false); }}
                    className="w-12 h-12 flex items-center justify-center text-2xl bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-xl transition-all hover:scale-110 border border-slate-100 dark:border-slate-600"
                    title={sticker.label}
                  >
                    {sticker.emoji}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
