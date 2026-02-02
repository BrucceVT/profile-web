// MenuBar - Top menu bar with clock

import React, { useState, useEffect } from "react";

export const MenuBar: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  const menuItems = ["File", "Edit", "View", "Special"];

  return (
    <div className="h-8 bg-white border-b-2 border-black flex items-center justify-between px-2 select-none fixed top-0 w-full z-[100] shadow-sm">
      {/* Left - Apple logo + menu items */}
      <div className="flex items-center gap-0">
        {/* Apple-like logo */}
        <div className="px-3 py-1 hover:bg-black hover:text-white cursor-pointer font-bold">
          <span className="text-lg">🍎</span>
        </div>

        {menuItems.map((item) => (
          <div
            key={item}
            className="px-3 py-1 hover:bg-black hover:text-white cursor-pointer font-retro text-base"
          >
            {item}
          </div>
        ))}
      </div>

      {/* Right - Clock */}
      <div className="font-retro text-base px-2 flex items-center gap-2">
        <span>{formatTime(time)}</span>
      </div>
    </div>
  );
};
