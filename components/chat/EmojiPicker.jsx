"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SmilePlus } from "lucide-react";

const EMOJI_CATEGORIES = {
  "Smileys": ["😀","😃","😄","😁","😅","😂","🤣","😊","😇","🙂","🥰","😍","🤩","😘","😉","😗","😚","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🫣","🤫","🤔","🫡","🤐","😐","😑","😶","😏","😒","🙄","😬","😮","😯","😲","😳","🥺","😢","😭","😤","😡","🤬","😈","👿","💀","☠️","💩","🤡","👹","👺","👻","👽","👾","🤖"],
  "Gestures": ["👍","👎","👊","✊","🤛","🤜","👋","🤚","✋","🖐","✌️","🤞","🫰","🤟","🤘","🤙","👆","👇","👈","👉","🖕","👌","🤌","🤏","✍️","💅","👏","🙌","👐","🤲","🤝","🙏","💪","🦵","🦶","👂","🦻","👃","🧠","🫀","🫁","👀","👁","👅","👄"],
  "Hearts": ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💕","💞","💓","💗","💖","💘","💝","❣️","💟","🫶","💔"],
  "Objects": ["🎉","🎊","🎈","🎁","🏆","🥇","🥈","🥉","🏅","🎯","🎮","🎲","🎭","🎨","🎵","🎶","🎤","🎧","📱","💻","⌚️","📸","📷","🔒","🔓","🔑","🗝","💡","🔦","📚","📖","✏️","🖊","✂️","📎","📍","🧷","📌","🔗","🧩","🎪","🎟","🎫","🎬"],
  "Nature": ["🌺","🌸","🌹","🌻","🌷","🌿","🍀","🌴","🌵","🌲","☀️","🌙","⭐️","✨","🌈","☁️","⛅️","🔥","💧","❄️","🌊","⚡️","🍎","🍕","🍔","🌮","🍦","🍩","🍪","☕️","🍺","🍻","🥂"],
};

const EMOJIS = Object.values(EMOJI_CATEGORIES).flat();

export default function EmojiPicker({ onSelect }) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(Object.keys(EMOJI_CATEGORIES)[0]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        title="Emoji"
      >
        <SmilePlus className="w-5 h-5" />
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
              className="absolute bottom-14 left-0 z-50 w-[320px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <div className="flex gap-1 p-2 border-b border-slate-100 dark:border-slate-700 overflow-x-auto">
                {Object.keys(EMOJI_CATEGORIES).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                      category === cat
                        ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    {EMOJI_CATEGORIES[cat][0]} {cat}
                  </button>
                ))}
              </div>
              <div className="p-2 max-h-60 overflow-y-auto grid grid-cols-8 gap-1">
                {EMOJI_CATEGORIES[category].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => { onSelect(emoji); setOpen(false); }}
                    className="w-8 h-8 flex items-center justify-center text-lg hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all hover:scale-110"
                  >
                    {emoji}
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
