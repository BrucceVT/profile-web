// Window component - Draggable window with Mac-like animations

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useWindowManager } from "@/context/WindowManager";

// Check for reduced motion preference
const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  zIndex: number;
  initialPosition: { x: number; y: number };
  canClose?: boolean;
}

// Mac-like easing is handled in Desktop.tsx animation variants

export const Window: React.FC<WindowProps> = ({
  id,
  title,
  children,
  zIndex,
  initialPosition,
  canClose = true,
}) => {
  const { closeWindow, focusWindow, minimizeWindow, activeWindowId, updateWindowPosition } =
    useWindowManager();
  const isActive = activeWindowId === id;
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track current position for drag
  const [position, setPosition] = useState(initialPosition);

  // Striped background for active title bar
  const stripedBackground = `repeating-linear-gradient(
    90deg,
    #c0c0c0,
    #c0c0c0 2px,
    #808080 2px,
    #808080 4px
  )`;

  // Handle drag end - update position
  const handleDragEnd = (_: unknown, info: { point: { x: number; y: number } }) => {
    const newPosition = {
      x: info.point.x,
      y: info.point.y,
    };
    setPosition(newPosition);
    updateWindowPosition(id, newPosition);
  };

  // Handle close with defense
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canClose) {
      closeWindow(id);
    }
  };

  // Handle minimize
  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    minimizeWindow(id);
  };

  return (
    <motion.div
      ref={containerRef}
      drag
      dragMomentum={false}
      dragConstraints={{
        top: 32, // MenuBar height
        left: 0,
        right: typeof window !== "undefined" ? window.innerWidth - 300 : 800,
        bottom: typeof window !== "undefined" ? window.innerHeight - 100 : 600,
      }}
      onDragStart={() => focusWindow(id)}
      onMouseDown={() => focusWindow(id)}
      onDragEnd={handleDragEnd}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        x: position.x,
        y: position.y,
        zIndex: zIndex,
        width: "min(600px, 90vw)",
      }}
      className="bg-mac-gray border border-black flex flex-col retro-border-outset"
      // Dynamic shadow based on active state with smooth transition
      animate={{
        boxShadow: isActive
          ? "3px 3px 0px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.25)"
          : "2px 2px 0px rgba(0,0,0,0.4)",
      }}
      transition={{
        boxShadow: { duration: prefersReducedMotion ? 0 : 0.12 },
      }}
    >
      {/* Title Bar */}
      <div
        className="flex items-center justify-between px-1 py-0.5 border-b border-black select-none cursor-grab active:cursor-grabbing"
        style={{
          background: isActive ? stripedBackground : "#c0c0c0",
          height: "28px",
        }}
      >
        {/* Close Button - Only render if canClose is true */}
        {canClose ? (
          <motion.button
            onClick={handleClose}
            whileHover={{ scale: prefersReducedMotion ? 1 : 1.1 }}
            whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
            className="w-5 h-5 bg-white border border-black flex items-center justify-center text-sm font-bold hover:bg-red-100 active:bg-red-500 active:text-white transition-colors"
            style={{ boxShadow: "inset 1px 1px 0px #fff, inset -1px -1px 0px #888" }}
            title="Close"
          >
            ×
          </motion.button>
        ) : (
          // Empty spacer to maintain layout
          <div className="w-5 h-5" />
        )}

        {/* Title */}
        <span
          className="flex-1 text-center font-retro text-base uppercase tracking-wider px-2 truncate"
          style={{
            color: isActive ? "black" : "#666",
            fontWeight: isActive ? "bold" : "normal",
          }}
        >
          <span className="bg-mac-gray px-2">{title}</span>
        </span>

        {/* Minimize Button */}
        <motion.button
          onClick={handleMinimize}
          whileHover={{ scale: prefersReducedMotion ? 1 : 1.1 }}
          whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
          className="w-5 h-5 bg-white border border-black flex items-center justify-center text-sm font-bold hover:bg-yellow-100 active:bg-yellow-500 active:text-white transition-colors"
          style={{ boxShadow: "inset 1px 1px 0px #fff, inset -1px -1px 0px #888" }}
          title="Minimize"
        >
          −
        </motion.button>
      </div>

      {/* Content Area */}
      <div className="p-2 flex-1 overflow-auto bg-white m-1.5 border border-black retro-border-inset max-h-[70vh]">
        {children}
      </div>
    </motion.div>
  );
};
