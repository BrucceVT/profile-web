// Dock - Bottom bar showing open/minimized windows

import React from "react";
import { useWindowManager } from "@/context/WindowManager";

export const Dock: React.FC = () => {
  const { windows, activeWindowId, focusWindow, restoreWindow } = useWindowManager();

  // Filter only open windows (including minimized)
  const openWindows = windows.filter((w) => w.isOpen);

  if (openWindows.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-10 bg-mac-gray border-t-2 border-black flex items-center justify-center gap-1 px-4 z-50">
      {openWindows.map((win) => {
        const isActive = win.id === activeWindowId;
        const isMinimized = win.isMinimized;

        return (
          <button
            key={win.id}
            onClick={() => (isMinimized ? restoreWindow(win.id) : focusWindow(win.id))}
            className={`
              px-3 py-1 border border-black text-sm font-retro truncate max-w-[150px]
              transition-all duration-100
              ${isMinimized ? "opacity-60 italic" : ""}
              ${isActive && !isMinimized ? "bg-white retro-border-inset" : "bg-mac-gray retro-border-outset"}
              hover:bg-white
            `}
            title={win.title}
          >
            {win.title}
          </button>
        );
      })}
    </div>
  );
};
