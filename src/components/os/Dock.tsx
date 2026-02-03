// Dock - Bottom bar showing open/minimized windows (always visible)

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowManager } from "@/context/WindowManager";

// Check for reduced motion preference
const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const Dock: React.FC = () => {
  const { windows, activeWindowId, focusWindow, restoreWindow } = useWindowManager();

  // Filter only open windows (including minimized)
  const openWindows = windows.filter((w) => w.isOpen);

  // Always render Dock, even if empty (for consistent UI)
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-mac-gray border-t-2 border-black flex items-center justify-center gap-2 px-4 z-50" style={{ height: "48px" }}>
      <AnimatePresence mode="popLayout">
        {openWindows.length === 0 ? (
          <span className="font-retro text-gray-500 text-sm italic">
            No windows open
          </span>
        ) : (
          openWindows.map((win) => {
            const isActive = win.id === activeWindowId;
            const isMinimized = win.isMinimized;

            return (
              <motion.button
                key={win.id}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
                whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
                onClick={() => (isMinimized ? restoreWindow(win.id) : focusWindow(win.id))}
                className={`
                  px-4 py-1.5 border border-black text-base font-retro truncate max-w-[180px]
                  transition-colors duration-100
                  ${isMinimized ? "opacity-60 italic" : ""}
                  ${isActive && !isMinimized ? "bg-white retro-border-inset" : "bg-mac-gray retro-border-outset"}
                  hover:bg-white
                `}
                title={win.title}
              >
                {win.title}
              </motion.button>
            );
          })
        )}
      </AnimatePresence>
    </div>
  );
};
