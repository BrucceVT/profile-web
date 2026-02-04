// Window component - Fixed drag/resize with inline document listeners

import React, { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useWindowManager, MIN_WINDOW_WIDTH, MIN_WINDOW_HEIGHT, MENUBAR_HEIGHT, DOCK_HEIGHT } from "@/context/WindowManager";

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
  initialSize: { width: number; height: number };
  isMaximized: boolean;
  canClose?: boolean;
}

type ResizeHandle = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

// Cursor styles for resize handles
const RESIZE_CURSORS: Record<ResizeHandle, string> = {
  n: "ns-resize",
  s: "ns-resize",
  e: "ew-resize",
  w: "ew-resize",
  ne: "nesw-resize",
  sw: "nesw-resize",
  nw: "nwse-resize",
  se: "nwse-resize",
};

export const Window: React.FC<WindowProps> = ({
  id,
  title,
  children,
  zIndex,
  initialPosition,
  initialSize,
  isMaximized,
  canClose = true,
}) => {
  const { 
    closeWindow, 
    focusWindow, 
    minimizeWindow, 
    toggleMaximize,
    activeWindowId, 
    updateWindowBounds,
  } = useWindowManager();
  
  const isActive = activeWindowId === id;
  
  // Position and size state
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  
  // Store position/size in refs for use in global listener closures
  const positionRef = useRef(position);
  const sizeRef = useRef(size);
  
  // Keep refs in sync with state
  useEffect(() => { positionRef.current = position; }, [position]);
  useEffect(() => { sizeRef.current = size; }, [size]);
  
  // Drag state refs
  const isDraggingRef = useRef(false);
  
  // Resize state refs
  const isResizingRef = useRef(false);

  // Calculate work area
  const getWorkArea = useCallback(() => ({
    top: MENUBAR_HEIGHT,
    left: 0,
    right: window.innerWidth,
    bottom: window.innerHeight - DOCK_HEIGHT,
    width: window.innerWidth,
    height: window.innerHeight - MENUBAR_HEIGHT - DOCK_HEIGHT,
  }), []);

  // Sync with external state (for maximize/restore)
  useEffect(() => {
    setPosition(initialPosition);
    setSize(initialSize);
  }, [initialPosition.x, initialPosition.y, initialSize.width, initialSize.height]);

  // Striped background for active title bar
  const stripedBackground = `repeating-linear-gradient(
    90deg,
    #c0c0c0,
    #c0c0c0 2px,
    #808080 2px,
    #808080 4px
  )`;

  // ============ RESIZE START (INLINE LISTENERS) ============

  const handleResizeStart = useCallback((e: React.PointerEvent, handle: ResizeHandle) => {
    if (isMaximized || isDraggingRef.current || isResizingRef.current) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    if (import.meta.env.DEV) {
      console.log(`[Window ${id}] resize start pointerId=${e.pointerId} edge=${handle}`);
    }
    
    // Mark as resizing
    isResizingRef.current = true;
    
    // Capture initial state
    const startPointer = { x: e.clientX, y: e.clientY };
    const startBounds = {
      posX: position.x,
      posY: position.y,
      width: size.width,
      height: size.height,
    };
    const pointerId = e.pointerId;
    const target = e.currentTarget as HTMLElement;
    
    // Capture pointer
    target.setPointerCapture(pointerId);
    
    // Set body styles
    document.body.style.cursor = RESIZE_CURSORS[handle];
    document.body.style.userSelect = "none";
    
    // Move handler
    const onMove = (ev: PointerEvent) => {
      if (!isResizingRef.current) return;
      
      const workArea = getWorkArea();
      const dx = ev.clientX - startPointer.x;
      const dy = ev.clientY - startPointer.y;
      
      let newX = startBounds.posX;
      let newY = startBounds.posY;
      let newWidth = startBounds.width;
      let newHeight = startBounds.height;
      
      if (handle.includes("e")) newWidth = Math.max(MIN_WINDOW_WIDTH, startBounds.width + dx);
      if (handle.includes("w")) {
        const pw = startBounds.width - dx;
        if (pw >= MIN_WINDOW_WIDTH) { newWidth = pw; newX = startBounds.posX + dx; }
      }
      if (handle.includes("s")) newHeight = Math.max(MIN_WINDOW_HEIGHT, startBounds.height + dy);
      if (handle.includes("n")) {
        const ph = startBounds.height - dy;
        if (ph >= MIN_WINDOW_HEIGHT) { newHeight = ph; newY = startBounds.posY + dy; }
      }
      
      // Clamp
      newX = Math.max(0, newX);
      newY = Math.max(workArea.top, newY);
      newWidth = Math.min(newWidth, workArea.width - newX);
      newHeight = Math.min(newHeight, workArea.bottom - newY);
      
      setPosition({ x: newX, y: newY });
      setSize({ width: newWidth, height: newHeight });
    };
    
    // End handler (called from multiple sources)
    const endResize = (source: string) => {
      if (!isResizingRef.current) return;
      
      if (import.meta.env.DEV) {
        console.log(`[Window ${id}] endResize from: ${source}`);
      }
      
      isResizingRef.current = false;
      
      // Release pointer
      try { target.releasePointerCapture(pointerId); } catch {}
      
      // Restore styles
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      
      // Update context with final bounds
      updateWindowBounds(id, { position: positionRef.current, size: sizeRef.current });
      
      // Remove all listeners
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointercancel", onCancel);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibility);
    };
    
    const onPointerUp = () => endResize("pointerup");
    const onCancel = () => endResize("pointercancel");
    const onBlur = () => endResize("blur");
    const onVisibility = () => { if (document.hidden) endResize("visibilitychange"); };
    
    // Add listeners
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointercancel", onCancel);
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisibility);
    
    focusWindow(id);
  }, [isMaximized, position, size, focusWindow, id, getWorkArea, updateWindowBounds]);

  // ============ DRAG HANDLING (INLINE LISTENERS) ============
  
  const handleDragStart = useCallback((e: React.PointerEvent) => {
    if (isMaximized || isResizingRef.current || isDraggingRef.current) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    isDraggingRef.current = true;
    
    const startPointer = { x: e.clientX, y: e.clientY };
    const startPos = { x: position.x, y: position.y };
    const pointerId = e.pointerId;
    const target = e.currentTarget as HTMLElement;
    
    target.setPointerCapture(pointerId);
    
    const onMove = (ev: PointerEvent) => {
      if (!isDraggingRef.current) return;
      
      const workArea = getWorkArea();
      const dx = ev.clientX - startPointer.x;
      const dy = ev.clientY - startPointer.y;
      
      let newX = startPos.x + dx;
      let newY = startPos.y + dy;
      
      // Clamp
      newX = Math.max(0, Math.min(newX, workArea.width - 100));
      newY = Math.max(workArea.top, Math.min(newY, workArea.bottom - 50));
      
      setPosition({ x: newX, y: newY });
    };
    
    const endDrag = (source: string) => {
      if (!isDraggingRef.current) return;
      
      if (import.meta.env.DEV) {
        console.log(`[Window ${id}] endDrag from: ${source}`);
      }
      
      isDraggingRef.current = false;
      
      try { target.releasePointerCapture(pointerId); } catch {}
      
      updateWindowBounds(id, { position: positionRef.current, size: sizeRef.current });
      
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointercancel", onCancel);
      window.removeEventListener("blur", onBlur);
    };
    
    const onPointerUp = () => endDrag("pointerup");
    const onCancel = () => endDrag("pointercancel");
    const onBlur = () => endDrag("blur");
    
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointercancel", onCancel);
    window.addEventListener("blur", onBlur);
    
    focusWindow(id);
  }, [isMaximized, position, focusWindow, id, getWorkArea, updateWindowBounds]);

  // ============ BUTTON HANDLERS ============

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canClose) closeWindow(id);
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    minimizeWindow(id);
  };

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleMaximize(id);
  };

  const handleTitlebarDoubleClick = () => {
    toggleMaximize(id);
  };

  return (
    <motion.div
      style={{
        position: "fixed",
        top: position.y,
        left: position.x,
        width: size.width,
        height: size.height,
        zIndex: zIndex,
        minWidth: MIN_WINDOW_WIDTH,
        minHeight: MIN_WINDOW_HEIGHT,
        touchAction: "none",
      }}
      animate={{
        top: position.y,
        left: position.x,
        width: size.width,
        height: size.height,
        boxShadow: isActive
          ? "3px 3px 0px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.25)"
          : "2px 2px 0px rgba(0,0,0,0.4)",
      }}
      transition={{
        top: { duration: isDraggingRef.current || isResizingRef.current ? 0 : (prefersReducedMotion ? 0 : 0.22), ease: [0.2, 0.8, 0.2, 1] },
        left: { duration: isDraggingRef.current || isResizingRef.current ? 0 : (prefersReducedMotion ? 0 : 0.22), ease: [0.2, 0.8, 0.2, 1] },
        width: { duration: isResizingRef.current ? 0 : (prefersReducedMotion ? 0 : 0.22), ease: [0.2, 0.8, 0.2, 1] },
        height: { duration: isResizingRef.current ? 0 : (prefersReducedMotion ? 0 : 0.22), ease: [0.2, 0.8, 0.2, 1] },
        boxShadow: { duration: 0.12 },
      }}
      className="bg-mac-gray border border-black flex flex-col retro-border-outset"
      onMouseDown={() => focusWindow(id)}
    >
      {/* Title Bar */}
      <div
        className="flex items-center justify-between px-1 py-0.5 border-b border-black select-none"
        style={{
          background: isActive ? stripedBackground : "#c0c0c0",
          height: "28px",
          cursor: isMaximized ? "default" : "grab",
          touchAction: "none",
        }}
        onPointerDown={handleDragStart}
        onDoubleClick={handleTitlebarDoubleClick}
      >
        {/* Close Button */}
        {canClose ? (
          <motion.button
            onClick={handleClose}
            onPointerDown={(e) => e.stopPropagation()}
            whileHover={{ scale: prefersReducedMotion ? 1 : 1.1 }}
            whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
            className="w-5 h-5 bg-white border border-black flex items-center justify-center text-sm font-bold hover:bg-red-100 active:bg-red-500 active:text-white transition-colors"
            style={{ boxShadow: "inset 1px 1px 0px #fff, inset -1px -1px 0px #888" }}
            title="Close"
          >
            ×
          </motion.button>
        ) : (
          <div className="w-5 h-5" />
        )}

        {/* Title */}
        <span
          className="flex-1 text-center font-retro text-base uppercase tracking-wider px-2 truncate pointer-events-none"
          style={{
            color: isActive ? "black" : "#666",
            fontWeight: isActive ? "bold" : "normal",
          }}
        >
          <span className="bg-mac-gray px-2">{title}</span>
        </span>

        {/* Window Control Buttons */}
        <div className="flex items-center gap-0.5">
          <motion.button
            onClick={handleMaximize}
            onPointerDown={(e) => e.stopPropagation()}
            whileHover={{ scale: prefersReducedMotion ? 1 : 1.1 }}
            whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
            className="w-5 h-5 bg-white border border-black flex items-center justify-center text-xs font-bold hover:bg-green-100 active:bg-green-500 active:text-white transition-colors"
            style={{ boxShadow: "inset 1px 1px 0px #fff, inset -1px -1px 0px #888" }}
            title={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? "❐" : "□"}
          </motion.button>

          <motion.button
            onClick={handleMinimize}
            onPointerDown={(e) => e.stopPropagation()}
            whileHover={{ scale: prefersReducedMotion ? 1 : 1.1 }}
            whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
            className="w-5 h-5 bg-white border border-black flex items-center justify-center text-sm font-bold hover:bg-yellow-100 active:bg-yellow-500 active:text-white transition-colors"
            style={{ boxShadow: "inset 1px 1px 0px #fff, inset -1px -1px 0px #888" }}
            title="Minimize"
          >
            −
          </motion.button>
        </div>
      </div>

      {/* Content Area */}
      <div 
        className="flex-1 overflow-auto bg-white m-1.5 border border-black retro-border-inset"
        style={{ touchAction: "pan-y" }}
      >
        <div className="p-2">{children}</div>
      </div>

      {/* Resize Handles */}
      {!isMaximized && (
        <>
          {/* Edges - top edge starts after title bar */}
          <div className="absolute bottom-0 left-3 right-3 h-1.5 z-10" style={{ cursor: "ns-resize", touchAction: "none" }} onPointerDown={(e) => handleResizeStart(e, "s")} />
          <div className="absolute right-0 top-8 bottom-3 w-1.5 z-10" style={{ cursor: "ew-resize", touchAction: "none" }} onPointerDown={(e) => handleResizeStart(e, "e")} />
          <div className="absolute left-0 top-8 bottom-3 w-1.5 z-10" style={{ cursor: "ew-resize", touchAction: "none" }} onPointerDown={(e) => handleResizeStart(e, "w")} />
          {/* Corners - top corners positioned below title bar to avoid buttons */}
          <div className="absolute bottom-0 left-0 w-4 h-4 z-20" style={{ cursor: "nesw-resize", touchAction: "none" }} onPointerDown={(e) => handleResizeStart(e, "sw")} />
          <div className="absolute bottom-0 right-0 w-4 h-4 z-20" style={{ cursor: "nwse-resize", touchAction: "none" }} onPointerDown={(e) => handleResizeStart(e, "se")} />
        </>
      )}
    </motion.div>
  );
};
