// Minesweeper Game Window - With difficulty modes, bot scores and player ranking

import React, { useState, useCallback, useEffect } from "react";

type CellState = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
};

type GameState = "playing" | "won" | "lost";
type Difficulty = "easy" | "medium" | "hard";

interface RankingEntry {
  name: string;
  time: number;
  date: string;
  isBot: boolean;
}

// Difficulty settings
const DIFFICULTY_CONFIG: Record<Difficulty, { gridSize: number; mines: number; label: string }> = {
  easy: { gridSize: 8, mines: 10, label: "Fácil" },
  medium: { gridSize: 12, mines: 25, label: "Medio" },
  hard: { gridSize: 14, mines: 40, label: "Difícil" },  // Reduced from 16x16 to avoid scroll
};

// Bot scores for each difficulty
const BOT_SCORES: Record<Difficulty, RankingEntry[]> = {
  easy: [
    { name: "SpeedBot", time: 15, date: "01/01/2026", isBot: true },
    { name: "MineHunter", time: 22, date: "15/01/2026", isBot: true },
    { name: "QuickSweep", time: 28, date: "20/01/2026", isBot: true },
  ],
  medium: [
    { name: "ProSweeper", time: 45, date: "02/01/2026", isBot: true },
    { name: "MineExpert", time: 58, date: "10/01/2026", isBot: true },
    { name: "GridMaster", time: 72, date: "18/01/2026", isBot: true },
  ],
  hard: [
    { name: "EliteBot", time: 120, date: "05/01/2026", isBot: true },
    { name: "MasterMiner", time: 145, date: "12/01/2026", isBot: true },
    { name: "LegendSweep", time: 180, date: "25/01/2026", isBot: true },
  ],
};

const RANKING_KEY = "minesweeper_ranking_v3";
const MAX_RANKING = 5;

// Load player rankings from localStorage
const loadPlayerRankings = (): Record<Difficulty, RankingEntry[]> => {
  try {
    const saved = localStorage.getItem(RANKING_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // Ignore errors
  }
  return { easy: [], medium: [], hard: [] };
};

// Save player rankings to localStorage
const savePlayerRankings = (ranking: Record<Difficulty, RankingEntry[]>) => {
  try {
    localStorage.setItem(RANKING_KEY, JSON.stringify(ranking));
  } catch {
    // Ignore storage errors
  }
};

// Merge bot and player scores
const getMergedRanking = (difficulty: Difficulty, playerRankings: Record<Difficulty, RankingEntry[]>): RankingEntry[] => {
  const bots = BOT_SCORES[difficulty];
  const players = playerRankings[difficulty];
  return [...bots, ...players]
    .sort((a, b) => a.time - b.time)
    .slice(0, MAX_RANKING);
};

// Generate board for specific difficulty
const generateBoard = (difficulty: Difficulty): CellState[][] => {
  const { gridSize, mines } = DIFFICULTY_CONFIG[difficulty];
  
  const board: CellState[][] = Array(gridSize)
    .fill(null)
    .map(() =>
      Array(gridSize)
        .fill(null)
        .map(() => ({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          adjacentMines: 0,
        }))
    );

  let minesPlaced = 0;
  while (minesPlaced < mines) {
    const row = Math.floor(Math.random() * gridSize);
    const col = Math.floor(Math.random() * gridSize);
    if (!board[row][col].isMine) {
      board[row][col].isMine = true;
      minesPlaced++;
    }
  }

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (!board[row][col].isMine) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = row + dr;
            const nc = col + dc;
            if (nr >= 0 && nr < gridSize && nc >= 0 && nc < gridSize) {
              if (board[nr][nc].isMine) count++;
            }
          }
        }
        board[row][col].adjacentMines = count;
      }
    }
  }

  return board;
};

const NUMBER_COLORS: Record<number, string> = {
  1: "text-blue-600",
  2: "text-green-600",
  3: "text-red-600",
  4: "text-purple-800",
  5: "text-red-800",
  6: "text-cyan-600",
  7: "text-black",
  8: "text-gray-600",
};

export const MinesweeperWindow: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [board, setBoard] = useState<CellState[][]>(() => generateBoard("easy"));
  const [gameState, setGameState] = useState<GameState>("playing");
  const [flagCount, setFlagCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [playerRankings, setPlayerRankings] = useState<Record<Difficulty, RankingEntry[]>>(() => loadPlayerRankings());

  const config = DIFFICULTY_CONFIG[difficulty];
  const gridSize = config.gridSize;

  // Timer effect
  useEffect(() => {
    if (gameState !== "playing" || isFirstClick) return;
    
    const interval = setInterval(() => {
      setTimer((t) => Math.min(t + 1, 999));
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, isFirstClick]);

  // Save to ranking on win
  useEffect(() => {
    if (gameState === "won") {
      const newEntry: RankingEntry = {
        name: "Tú",
        time: timer,
        date: new Date().toLocaleDateString(),
        isBot: false,
      };
      
      const currentPlayerRanking = playerRankings[difficulty];
      const newPlayerRanking = [...currentPlayerRanking, newEntry]
        .sort((a, b) => a.time - b.time)
        .slice(0, MAX_RANKING);
      
      const updatedRankings = { ...playerRankings, [difficulty]: newPlayerRanking };
      setPlayerRankings(updatedRankings);
      savePlayerRankings(updatedRankings);
    }
  }, [gameState]);

  const checkWin = useCallback((currentBoard: CellState[][]) => {
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const cell = currentBoard[row][col];
        if (!cell.isMine && !cell.isRevealed) return false;
      }
    }
    return true;
  }, [gridSize]);

  const revealCell = useCallback((currentBoard: CellState[][], row: number, col: number) => {
    if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return;
    
    const cell = currentBoard[row][col];
    if (cell.isRevealed || cell.isFlagged) return;

    cell.isRevealed = true;

    if (cell.adjacentMines === 0 && !cell.isMine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr !== 0 || dc !== 0) {
            revealCell(currentBoard, row + dr, col + dc);
          }
        }
      }
    }
  }, [gridSize]);

  const handleClick = useCallback((row: number, col: number) => {
    if (gameState !== "playing") return;

    const cell = board[row][col];
    if (cell.isRevealed || cell.isFlagged) return;

    if (isFirstClick) {
      setIsFirstClick(false);
    }

    const newBoard = board.map((r) => r.map((c) => ({ ...c })));

    if (newBoard[row][col].isMine) {
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          if (newBoard[r][c].isMine) {
            newBoard[r][c].isRevealed = true;
          }
        }
      }
      setBoard(newBoard);
      setGameState("lost");
      return;
    }

    revealCell(newBoard, row, col);
    setBoard(newBoard);

    if (checkWin(newBoard)) {
      setGameState("won");
    }
  }, [board, gameState, isFirstClick, revealCell, checkWin, gridSize]);

  const handleRightClick = useCallback((e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameState !== "playing") return;

    const cell = board[row][col];
    if (cell.isRevealed) return;

    const newBoard = board.map((r) => r.map((c) => ({ ...c })));
    newBoard[row][col].isFlagged = !cell.isFlagged;
    setBoard(newBoard);
    setFlagCount((c) => c + (cell.isFlagged ? -1 : 1));
  }, [board, gameState]);

  const resetGame = useCallback(() => {
    setBoard(generateBoard(difficulty));
    setGameState("playing");
    setFlagCount(0);
    setTimer(0);
    setIsFirstClick(true);
  }, [difficulty]);

  const changeDifficulty = (newDiff: Difficulty) => {
    setDifficulty(newDiff);
    setBoard(generateBoard(newDiff));
    setGameState("playing");
    setFlagCount(0);
    setTimer(0);
    setIsFirstClick(true);
  };

  const clearPlayerRanking = () => {
    const clearedRankings = { ...playerRankings, [difficulty]: [] };
    setPlayerRankings(clearedRankings);
    savePlayerRankings(clearedRankings);
  };

  // Cell sizes - larger for readability
  const cellSizeClass = difficulty === "hard" 
    ? "w-6 h-6 text-sm" 
    : difficulty === "medium" 
      ? "w-7 h-7 text-base" 
      : "w-9 h-9 text-lg";

  const renderCell = (cell: CellState, row: number, col: number) => {
    const baseClass = `${cellSizeClass} flex items-center justify-center font-bold border border-gray-400 cursor-pointer select-none`;

    if (!cell.isRevealed) {
      return (
        <button
          key={`${row}-${col}`}
          className={`${baseClass} bg-gray-300 hover:bg-gray-200 border-t-white border-l-white border-t-2 border-l-2`}
          onClick={() => handleClick(row, col)}
          onContextMenu={(e) => handleRightClick(e, row, col)}
        >
          {cell.isFlagged && "🚩"}
        </button>
      );
    }

    if (cell.isMine) {
      return (
        <div key={`${row}-${col}`} className={`${baseClass} bg-red-500 text-black`}>
          💣
        </div>
      );
    }

    return (
      <div key={`${row}-${col}`} className={`${baseClass} bg-gray-200 ${NUMBER_COLORS[cell.adjacentMines] || ""}`}>
        {cell.adjacentMines > 0 ? cell.adjacentMines : ""}
      </div>
    );
  };

  const statusFace = gameState === "won" ? "😎" : gameState === "lost" ? "😵" : "🙂";
  const mergedRanking = getMergedRanking(difficulty, playerRankings);

  return (
    <div className="p-4 font-retro bg-mac-gray select-none">
      {/* Difficulty Selector */}
      <div className="flex gap-2 mb-3">
        {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((diff) => (
          <button
            key={diff}
            onClick={() => changeDifficulty(diff)}
            className={`flex-1 py-2 text-sm font-bold border-2 transition-colors ${
              difficulty === diff
                ? "bg-mac-blue text-white border-black"
                : "bg-gray-300 border-t-white border-l-white border-r-gray-600 border-b-gray-600 hover:bg-gray-200"
            }`}
          >
            {DIFFICULTY_CONFIG[diff].label}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-3 p-2 bg-gray-300 border-2 border-gray-500">
        <div className="bg-black text-red-500 font-mono px-2 py-1 text-lg min-w-[50px] text-center">
          {String(config.mines - flagCount).padStart(3, "0")}
        </div>

        <button
          onClick={resetGame}
          className="w-10 h-10 bg-gray-300 border-2 border-t-white border-l-white border-r-gray-600 border-b-gray-600 flex items-center justify-center text-xl hover:bg-gray-200 active:border-t-gray-600 active:border-l-gray-600 active:border-r-white active:border-b-white"
        >
          {statusFace}
        </button>

        <div className="bg-black text-red-500 font-mono px-2 py-1 text-lg min-w-[50px] text-center">
          {String(timer).padStart(3, "0")}
        </div>
      </div>

      {/* Game Layout */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Game board */}
        <div className="flex-shrink-0">
          <div className="inline-block border-4 border-t-gray-600 border-l-gray-600 border-r-white border-b-white">
            {board.map((row, rowIndex) => (
              <div key={rowIndex} className="flex">
                {row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))}
              </div>
            ))}
          </div>
        </div>

        {/* Ranking Panel */}
        <div className="flex-1 min-w-[160px]">
          <div className="bg-white border-2 border-gray-500 p-3 h-full">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-sm">🏆 Ranking</span>
              {playerRankings[difficulty].length > 0 && (
                <button
                  onClick={clearPlayerRanking}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Limpiar
                </button>
              )}
            </div>
            
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-1 w-6">#</th>
                  <th className="text-left py-1">Jugador</th>
                  <th className="text-right py-1">Tiempo</th>
                </tr>
              </thead>
              <tbody>
                {mergedRanking.map((entry, index) => (
                  <tr 
                    key={index} 
                    className={`${
                      !entry.isBot ? "text-green-600 font-bold" : ""
                    } ${index === 0 ? "bg-yellow-50" : ""}`}
                  >
                    <td className="py-1">{index + 1}</td>
                    <td className="py-1 truncate max-w-[80px]">
                      {entry.isBot ? `🤖 ${entry.name}` : `⭐ ${entry.name}`}
                    </td>
                    <td className="text-right py-1">{entry.time}s</td>
                  </tr>
                ))}
                {mergedRanking.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-3 text-gray-400">
                      Sin registros
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Game over message */}
      {gameState !== "playing" && (
        <div className="mt-2 text-center">
          <span className={`font-bold text-sm ${gameState === "won" ? "text-green-600" : "text-red-600"}`}>
            {gameState === "won" ? `¡Ganaste en ${timer}s! 🎉` : "¡Perdiste! 💥"}
          </span>
          <button
            onClick={resetGame}
            className="ml-2 px-2 py-0.5 text-xs bg-mac-blue text-white border-2 border-black hover:bg-blue-700"
          >
            Nuevo Juego
          </button>
        </div>
      )}
    </div>
  );
};
