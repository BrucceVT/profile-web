// Desktop - Main desktop component with icons and windows

import React, { type FC } from "react";
import { useWindowManager } from "@/context/WindowManager";
import { useDesktopSelection } from "@/hooks";
import { useI18n } from "@/i18n";
import { MenuBar } from "./MenuBar";
import { DesktopHero } from "./DesktopHero";
import { DesktopIcon } from "./DesktopIcon";
import { Dock } from "./Dock";
import { Window } from "./Window";
import {
  AboutWindow,
  ProjectsWindow,
  SkillsWindow,
  ContactWindow,
  TrashWindow,
} from "@/features";

// Window component registry
const windowComponents: Record<string, FC> = {
  about: AboutWindow,
  projects: ProjectsWindow,
  skills: SkillsWindow,
  contact: ContactWindow,
  trash: TrashWindow,
};

// Icon configurations (static, only IDs and emojis)
// Note: Contact window is opened via CTA button in DesktopHero, no icon needed
const iconConfigs = [
  { id: "about", icon: "👨‍💻", windowId: "about" },
  { id: "projects", icon: "📂", windowId: "projects" },
  { id: "skills", icon: "🛠️", windowId: "skills" },
];

const trashConfig = { id: "trash", icon: "🗑️", windowId: "trash" };

// Default positions for windows
const windowPositions: Record<string, { x: number; y: number }> = {
  about: { x: 50, y: 50 },
  projects: { x: 100, y: 80 },
  skills: { x: 150, y: 110 },
  contact: { x: 200, y: 140 },
  trash: { x: 250, y: 170 },
};

export const Desktop: React.FC = () => {
  const { windows, openWindow } = useWindowManager();
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

  return (
    <div
      className="h-screen w-screen overflow-hidden relative"
      style={{
        background: "linear-gradient(135deg, #1a4a5e 0%, #2d6b7a 50%, #1e5566 100%)",
      }}
      onClick={handleDesktopClick}
    >
      {/* Menu Bar */}
      <MenuBar />

      {/* Hero Banner (wallpaper-style) */}
      <DesktopHero />

      {/* Desktop Icons Area */}
      <div className="pt-12 pb-14 px-4 h-full flex flex-col flex-wrap content-start gap-2">
        {/* Main Icons */}
        {iconConfigs.map((icon) => (
          <DesktopIcon
            key={icon.id}
            id={icon.id}
            label={getIconLabel(icon.id)}
            icon={icon.icon}
            isSelected={selectedIconId === icon.id}
            onSelect={selectIcon}
            onOpen={() => handleOpenWindow(icon.windowId)}
          />
        ))}

        {/* Trash Icon - Bottom Right */}
        <div className="absolute bottom-14 right-4">
          <DesktopIcon
            id={trashConfig.id}
            label={getIconLabel(trashConfig.id)}
            icon={trashConfig.icon}
            isSelected={selectedIconId === trashConfig.id}
            onSelect={selectIcon}
            onOpen={() => handleOpenWindow(trashConfig.windowId)}
          />
        </div>
      </div>

      {/* Windows Layer */}
      {windows.map((win) =>
        win.isOpen && !win.isMinimized ? (
          <Window
            key={win.id}
            id={win.id}
            title={getWindowTitle(win.id)}
            zIndex={win.zIndex}
            initialPosition={win.position}
          >
            {windowComponents[win.id] ? (
              React.createElement(windowComponents[win.id])
            ) : (
              <div className="p-4 font-retro">Unknown window: {win.id}</div>
            )}
          </Window>
        ) : null
      )}

      {/* Dock */}
      <Dock />
    </div>
  );
};
