// Games Folder Window - Shows available games

import React from "react";
import { useWindowManager } from "@/context/WindowManager";

interface GameItem {
  id: string;
  name: string;
  icon: string;
  windowId: string;
}

const GAMES: GameItem[] = [
  { id: "minesweeper", name: "Buscaminas", icon: "/icons/minesweeper.png", windowId: "minesweeper" },
  { id: "tetris", name: "Tetris", icon: "/icons/tetris.png", windowId: "tetris" },
];

export const GamesWindow: React.FC = () => {
  const { openWindow, windows, focusWindow, restoreWindow } = useWindowManager();

  const handleGameClick = (game: GameItem) => {
    const existingWindow = windows.find((w) => w.id === game.windowId);
    
    if (existingWindow?.isOpen) {
      if (existingWindow.isMinimized) {
        restoreWindow(game.windowId);
      } else {
        focusWindow(game.windowId);
      }
    } else {
      openWindow(game.windowId, game.name);
    }
  };

  return (
    <div className="p-4 font-retro bg-white min-h-[200px]">
      <div className="grid grid-cols-3 gap-4">
        {GAMES.map((game) => (
          <button
            key={game.id}
            onClick={() => handleGameClick(game)}
            className="flex flex-col items-center gap-2 p-3 hover:bg-mac-gray/50 rounded transition-colors group"
          >
            <img
              src={game.icon}
              alt={game.name}
              width={48}
              height={48}
              className="group-hover:scale-110 transition-transform"
              style={{ imageRendering: "pixelated" }}
              draggable={false}
            />
            <span className="text-sm text-center">{game.name}</span>
          </button>
        ))}
      </div>

      {GAMES.length === 0 && (
        <p className="text-gray-500 text-center">No hay juegos disponibles</p>
      )}
    </div>
  );
};
