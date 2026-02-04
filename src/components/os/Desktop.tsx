// Desktop - Main desktop component with icons and windows

import React, { type FC, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowManager, type ExitReason } from "@/context/WindowManager";
import { useDesktopSelection, useIconDrag } from "@/hooks";
import { useI18n } from "@/i18n";
import { MenuBar } from "./MenuBar";
import { DesktopIcon } from "./DesktopIcon";
import { Dock } from "./Dock";
import { Window } from "./Window";
import {
  AboutWindow,
  ProjectsWindow,
  SkillsWindow,
  ContactWindow,
  TrashWindow,
  WelcomeWindow,
  GamesWindow,
  MinesweeperWindow,
  TetrisWindow,
} from "@/features";

// Window component registry
const windowComponents: Record<string, FC> = {
  about: AboutWindow,
  projects: ProjectsWindow,
  skills: SkillsWindow,
  contact: ContactWindow,
  trash: TrashWindow,
  welcome: WelcomeWindow,
  games: GamesWindow,
  minesweeper: MinesweeperWindow,
  tetris: TetrisWindow,
};

// Icon configurations (static, uses PNG icon sources)
const iconConfigs = [
  { id: "about", iconSrc: "/icons/about.png", windowId: "about" },
  { id: "projects", iconSrc: "/icons/projects.png", windowId: "projects" },
  { id: "skills", iconSrc: "/icons/skills.png", windowId: "skills" },
  { id: "games", iconSrc: "/icons/games.png", windowId: "games" },
];

const trashConfig = { id: "trash", iconSrc: "/icons/trash.png", windowId: "trash" };


// Check for reduced motion preference
const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Mac-like animation variants
const getWindowVariants = (exitReason: ExitReason) => {
  const openVariant = prefersReducedMotion
    ? { opacity: 1 }
    : { opacity: 1, scale: 1, y: 0 };

  const initialVariant = prefersReducedMotion
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.96, y: 10 };

  // Different exit animations for minimize vs close
  let exitVariant;
  if (prefersReducedMotion) {
    exitVariant = { opacity: 0 };
  } else if (exitReason === "minimize") {
    // Minimize: shrink and move toward dock (bottom)
    exitVariant = { opacity: 0, scale: 0.88, y: 120 };
  } else {
    // Close: fade with slight shrink
    exitVariant = { opacity: 0, scale: 0.98, y: 8 };
  }

  return {
    initial: initialVariant,
    animate: openVariant,
    exit: exitVariant,
  };
};

const getTransition = (exitReason: ExitReason) => {
  if (prefersReducedMotion) {
    return { duration: 0.1 };
  }
  
  if (exitReason === "minimize") {
    return { duration: 0.25, ease: [0.2, 0.8, 0.2, 1] as const };
  }
  
  return { duration: 0.2, ease: [0.2, 0.8, 0.2, 1] as const };
};

export const Desktop: React.FC = () => {
  const { windows, openWindow, exitReasons } = useWindowManager();
  const { t } = useI18n();
  const allIcons = [...iconConfigs, trashConfig];
  const iconIds = allIcons.map((icon) => icon.id);
  const { selectedIconId, selectIcon, clearSelection } = useDesktopSelection(iconIds);
  
  // Icon drag functionality
  const {
    containerRef,
    getIconPosition,
    startDrag,
    updateDrag,
    endDrag,
    draggingId,
  } = useIconDrag(iconIds, "trash");

  // Global mouse event handlers for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggingId) {
        updateDrag(e.clientX, e.clientY);
      }
    };

    const handleMouseUp = () => {
      if (draggingId) {
        endDrag();
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingId, updateDrag, endDrag]);

  // Get translated label for an icon
  const getIconLabel = (id: string): string => {
    return t.icons[id as keyof typeof t.icons] || id;
  };

  // Get translated title for a window
  const getWindowTitle = (id: string): string => {
    return t.windows[id as keyof typeof t.windows] || id;
  };

  // Handle opening a window - no position passed = auto-center
  const handleOpenWindow = (windowId: string) => {
    const title = getWindowTitle(windowId);
    openWindow(windowId, title);  // No position = centered
  };

  // Click on desktop background clears selection
  const handleDesktopClick = () => {
    clearSelection();
  };

  // Stagger animation for icons
  const iconVariants = {
    hidden: prefersReducedMotion 
      ? { opacity: 0 } 
      : { opacity: 0, y: 20, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: prefersReducedMotion ? 0 : i * 0.08,
        duration: prefersReducedMotion ? 0.1 : 0.28,
        ease: [0.2, 0.8, 0.2, 1] as const,
      },
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: prefersReducedMotion ? 0.1 : 0.25 }}
      className="h-screen w-screen overflow-hidden relative"
      style={{
        background: "linear-gradient(135deg, #1a4a5e 0%, #2d6b7a 50%, #1e5566 100%)",
      }}
      onClick={handleDesktopClick}
    >
      {/* Menu Bar */}
      <MenuBar />

      {/* Desktop Icons Area - Absolute positioning for drag support */}
      <div 
        ref={containerRef}
        className="absolute inset-0 pt-12 pb-14 overflow-hidden"
        style={{ pointerEvents: "none" }}
      >
        {/* Draggable Icons (excluding trash) */}
        {iconConfigs.map((icon, index) => {
          const pos = getIconPosition(icon.id);
          const isDragging = draggingId === icon.id;
          
          return (
            <motion.div
              key={icon.id}
              className="absolute"
              style={{
                left: pos.x,
                top: pos.y,
                zIndex: isDragging ? 1000 : 1,
                cursor: isDragging ? "grabbing" : "grab",
                pointerEvents: "auto",
              }}
              initial="hidden"
              animate="visible"
              custom={index}
              variants={iconVariants}
              onMouseDown={(e) => {
                e.preventDefault();
                startDrag(icon.id, e.clientX, e.clientY);
              }}
            >
              <DesktopIcon
                id={icon.id}
                label={getIconLabel(icon.id)}
                iconSrc={icon.iconSrc}
                isSelected={selectedIconId === icon.id}
                onSelect={selectIcon}
                onOpen={() => handleOpenWindow(icon.windowId)}
              />
            </motion.div>
          );
        })}

        {/* Trash Icon - Fixed at bottom right with CSS */}
        <motion.div
          className="absolute"
          style={{
            right: 16,
            bottom: 70,
            zIndex: 1,
            cursor: "pointer",
            pointerEvents: "auto",
          }}
          initial="hidden"
          animate="visible"
          custom={iconConfigs.length}
          variants={iconVariants}
        >
          <DesktopIcon
            id={trashConfig.id}
            label={getIconLabel(trashConfig.id)}
            iconSrc={trashConfig.iconSrc}
            isSelected={selectedIconId === trashConfig.id}
            onSelect={selectIcon}
            onOpen={() => handleOpenWindow(trashConfig.windowId)}
          />
        </motion.div>
      </div>

      {/* Windows Layer with Mac-like animations */}
      <AnimatePresence mode="popLayout">
        {windows.map((win) =>
          win.isOpen && !win.isMinimized ? (
            <motion.div
              key={win.id}
              {...getWindowVariants(exitReasons[win.id] || null)}
              transition={getTransition(exitReasons[win.id] || null)}
            >
              <Window
                id={win.id}
                title={getWindowTitle(win.id)}
                zIndex={win.zIndex}
                initialPosition={win.position}
                initialSize={win.size}
                isMaximized={win.isMaximized}
                canClose={win.canClose}
              >
                {windowComponents[win.id] ? (
                  React.createElement(windowComponents[win.id])
                ) : (
                  <div className="p-4 font-retro">Unknown window: {win.id}</div>
                )}
              </Window>
            </motion.div>
          ) : null
        )}
      </AnimatePresence>

      {/* Dock - Always visible */}
      <Dock />
    </motion.div>
  );
};
