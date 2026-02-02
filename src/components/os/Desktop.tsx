// Desktop - Main desktop component with icons and windows

import React, { type FC } from "react";
import { useWindowManager } from "@/context/WindowManager";
import { useDesktopSelection } from "@/hooks";
import { desktopIcons, trashIcon, windowConfigs } from "@/data";
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
} from "@/features";

// Window component registry
const windowComponents: Record<string, FC> = {
  about: AboutWindow,
  projects: ProjectsWindow,
  skills: SkillsWindow,
  contact: ContactWindow,
  trash: TrashWindow,
};

export const Desktop: React.FC = () => {
  const { windows, openWindow } = useWindowManager();
  const allIcons = [...desktopIcons, trashIcon];
  const iconIds = allIcons.map((icon) => icon.id);
  const { selectedIconId, selectIcon, clearSelection } = useDesktopSelection(iconIds);

  // Handle opening a window
  const handleOpenWindow = (windowId: string) => {
    const config = windowConfigs[windowId];
    if (config) {
      openWindow(windowId, config.title, config.defaultPosition);
    }
  };

  // Click on desktop background clears selection
  const handleDesktopClick = () => {
    clearSelection();
  };

  return (
    <div
      className="h-screen w-screen overflow-hidden relative"
      style={{
        backgroundColor: "#555",
        backgroundImage: "radial-gradient(#777 1px, transparent 1px)",
        backgroundSize: "4px 4px",
      }}
      onClick={handleDesktopClick}
    >
      {/* Menu Bar */}
      <MenuBar />

      {/* Desktop Icons Area */}
      <div className="pt-12 pb-14 px-4 h-full flex flex-col flex-wrap content-start gap-2">
        {/* Main Icons */}
        {desktopIcons.map((icon) => (
          <DesktopIcon
            key={icon.id}
            id={icon.id}
            label={icon.label}
            icon={icon.icon}
            isSelected={selectedIconId === icon.id}
            onSelect={selectIcon}
            onOpen={() => handleOpenWindow(icon.windowId)}
          />
        ))}

        {/* Trash Icon - Bottom Right */}
        <div className="absolute bottom-14 right-4">
          <DesktopIcon
            id={trashIcon.id}
            label={trashIcon.label}
            icon={trashIcon.icon}
            isSelected={selectedIconId === trashIcon.id}
            onSelect={selectIcon}
            onOpen={() => handleOpenWindow(trashIcon.windowId)}
          />
        </div>
      </div>

      {/* Windows Layer */}
      {windows.map((win) =>
        win.isOpen && !win.isMinimized ? (
          <Window
            key={win.id}
            id={win.id}
            title={win.title}
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
