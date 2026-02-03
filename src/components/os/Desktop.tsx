// Desktop - Main desktop component with icons and windows

import React, { type FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowManager, type ExitReason } from "@/context/WindowManager";
import { useDesktopSelection } from "@/hooks";
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
} from "@/features";

// Window component registry
const windowComponents: Record<string, FC> = {
  about: AboutWindow,
  projects: ProjectsWindow,
  skills: SkillsWindow,
  contact: ContactWindow,
  trash: TrashWindow,
  welcome: WelcomeWindow,
};

// Icon configurations (static, only IDs and emojis)
const iconConfigs = [
  { id: "about", icon: "👨‍💻", windowId: "about" },
  { id: "projects", icon: "📂", windowId: "projects" },
  { id: "skills", icon: "🛠️", windowId: "skills" },
];

const trashConfig = { id: "trash", icon: "🗑️", windowId: "trash" };

// Default positions for windows
const windowPositions: Record<string, { x: number; y: number }> = {
  about: { x: 60, y: 70 },
  projects: { x: 110, y: 100 },
  skills: { x: 160, y: 130 },
  contact: { x: 210, y: 160 },
  trash: { x: 260, y: 190 },
  welcome: { x: 100, y: 70 },
};

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
    return { duration: 0.25, ease: [0.2, 0.8, 0.2, 1] };
  }
  
  return { duration: 0.2, ease: [0.2, 0.8, 0.2, 1] };
};

export const Desktop: React.FC = () => {
  const { windows, openWindow, exitReasons } = useWindowManager();
  const { t } = useI18n();
  const allIcons = [...iconConfigs, trashConfig];
  const iconIds = allIcons.map((icon) => icon.id);
  const { selectedIconId, selectIcon, clearSelection } = useDesktopSelection(iconIds);

  // Get translated label for an icon
  const getIconLabel = (id: string): string => {
    return t.icons[id as keyof typeof t.icons] || id;
  };

  // Get translated title for a window
  const getWindowTitle = (id: string): string => {
    return t.windows[id as keyof typeof t.windows] || id;
  };

  // Handle opening a window
  const handleOpenWindow = (windowId: string) => {
    const position = windowPositions[windowId] || { x: 100, y: 100 };
    const title = getWindowTitle(windowId);
    openWindow(windowId, title, position);
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
        ease: [0.2, 0.8, 0.2, 1],
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

      {/* Desktop Icons Area */}
      <div className="pt-12 pb-14 px-4 h-full flex flex-col flex-wrap content-start gap-2">
        {/* Main Icons with stagger animation */}
        {iconConfigs.map((icon, index) => (
          <motion.div
            key={icon.id}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={iconVariants}
          >
            <DesktopIcon
              id={icon.id}
              label={getIconLabel(icon.id)}
              icon={icon.icon}
              isSelected={selectedIconId === icon.id}
              onSelect={selectIcon}
              onOpen={() => handleOpenWindow(icon.windowId)}
            />
          </motion.div>
        ))}

        {/* Trash Icon - Bottom Right */}
        <motion.div
          className="absolute bottom-14 right-4"
          initial="hidden"
          animate="visible"
          custom={iconConfigs.length}
          variants={iconVariants}
        >
          <DesktopIcon
            id={trashConfig.id}
            label={getIconLabel(trashConfig.id)}
            icon={trashConfig.icon}
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
