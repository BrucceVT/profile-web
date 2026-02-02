// MenuBar - Top menu bar with clock and language toggle

import React, { useState, useEffect } from "react";
import { useI18n } from "@/i18n";

export const MenuBar: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const { lang, toggleLang, t } = useI18n();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  const menuItems = [t.menu.file, t.menu.edit, t.menu.view, t.menu.special];

  return (
    <div className="h-9 bg-white border-b-2 border-black flex items-center justify-between px-2 select-none fixed top-0 w-full z-[100] shadow-sm">
      {/* Left - Apple logo + menu items */}
      <div className="flex items-center gap-0">
        {/* Apple-like logo */}
        <div className="px-3 py-1 hover:bg-black hover:text-white cursor-pointer font-bold">
          <span className="text-xl">🍎</span>
        </div>

        {menuItems.map((item) => (
          <div
            key={item}
            className="px-3 py-1 hover:bg-black hover:text-white cursor-pointer font-retro text-lg"
          >
            {item}
          </div>
        ))}
      </div>

      {/* Right - Language toggle + Clock */}
      <div className="font-retro text-lg px-2 flex items-center gap-3">
        {/* Language Toggle */}
        <button
          onClick={toggleLang}
          className="flex items-center gap-1 px-2 py-0.5 border border-black bg-mac-gray hover:bg-white retro-border-outset active:retro-border-inset"
          title={t.menu.language}
        >
          <span className={lang === "es" ? "font-bold" : "opacity-60"}>ES</span>
          <span className="opacity-40">|</span>
          <span className={lang === "en" ? "font-bold" : "opacity-60"}>EN</span>
        </button>

        {/* Clock */}
        <span>{formatTime(time)}</span>
      </div>
    </div>
  );
};
