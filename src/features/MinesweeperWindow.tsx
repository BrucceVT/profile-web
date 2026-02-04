// Minesweeper Game Window - Classic Minesweeper implementation

import React, { useState, useCallback, useEffect } from "react";

type CellState = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
};

type GameState = "playing" | "won" | "lost";

const GRID_SIZE = 9;
const MINE_COUNT = 10;

// Generate initial board
const generateBoard = (): CellState[][] => {
  // Create empty grid
  const board: CellState[][] = Array(GRID_SIZE)
    .fill(null)
    .map(() =>
      Array(GRID_SIZE)
        .fill(null)
        .map(() => ({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          adjacentMines: 0,
        }))
    );

  // Place mines randomly
  let minesPlaced = 0;
  while (minesPlaced < MINE_COUNT) {
    const row = Math.floor(Math.random() * GRID_SIZE);
    const col = Math.floor(Math.random() * GRID_SIZE);
    if (!board[row][col].isMine) {
      board[row][col].isMine = true;
      minesPlaced++;
    }
  }

  // Calculate adjacent mines for each cell
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!board[row][col].isMine) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = row + dr;
            const nc = col + dc;
            if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
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

// Cell colors for numbers
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
  const [board, setBoard] = useState<CellState[][]>(() => generateBoard());
  const [gameState, setGameState] = useState<GameState>("playing");
  const [flagCount, setFlagCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isFirstClick, setIsFirstClick] = useState(true);

  // Timer effect
  useEffect(() => {
    if (gameState !== "playing" || isFirstClick) return;
    
    const interval = setInterval(() => {
      setTimer((t) => Math.min(t + 1, 999));
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, isFirstClick]);

  // Check win condition
  const checkWin = useCallback((currentBoard: CellState[][]) => {
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const cell = currentBoard[row][col];
        if (!cell.isMine && !cell.isRevealed) return false;
      }
    }
    return true;
  }, []);

  // Reveal cell recursively
  const revealCell = useCallback((currentBoard: CellState[][], row: number, col: number) => {
    if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) return;
    
    const cell = currentBoard[row][col];
    if (cell.isRevealed || cell.isFlagged) return;

    cell.isRevealed = true;

    // If empty cell, reveal neighbors
    if (cell.adjacentMines === 0 && !cell.isMine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr !== 0 || dc !== 0) {
            revealCell(currentBoard, row + dr, col + dc);
          }
        }
      }
    }
  }, []);

  // Handle left click
  const handleClick = useCallback((row: number, col: number) => {
    if (gameState !== "playing") return;

    const cell = board[row][col];
    if (cell.isRevealed || cell.isFlagged) return;

    if (isFirstClick) {
      setIsFirstClick(false);
    }

    const newBoard = board.map((r) => r.map((c) => ({ ...c })));

    if (newBoard[row][col].isMine) {
      // Game over - reveal all mines
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
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
  }, [board, gameState, isFirstClick, revealCell, checkWin]);

  // Handle right click (flag)
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

  // Reset game
  const resetGame = useCallback(() => {
    setBoard(generateBoard());
    setGameState("playing");
    setFlagCount(0);
    setTimer(0);
    setIsFirstClick(true);
  }, []);

  // Render cell content
  const renderCell = (cell: CellState, row: number, col: number) => {
    const baseStyle = `
      w-6 h-6 flex items-center justify-center text-xs font-bold
      border border-gray-400 cursor-pointer select-none
      transition-all duration-75
    `;

    if (!cell.isRevealed) {
      return (
        <button
          key={`${row}-${col}`}
          className={`${baseStyle} bg-gray-300 hover:bg-gray-200 border-t-white border-l-white border-t-2 border-l-2`}
          onClick={() => handleClick(row, col)}
          onContextMenu={(e) => handleRightClick(e, row, col)}
        >
          {cell.isFlagged && "🚩"}
        </button>
      );
    }

    if (cell.isMine) {
      return (
        <div
          key={`${row}-${col}`}
          className={`${baseStyle} bg-red-500 text-black`}
        >
          💣
        </div>
      );
    }

    return (
      <div
        key={`${row}-${col}`}
        className={`${baseStyle} bg-gray-200 ${NUMBER_COLORS[cell.adjacentMines] || ""}`}
      >
        {cell.adjacentMines > 0 ? cell.adjacentMines : ""}
      </div>
    );
  };

  // Status face
  const statusFace = gameState === "won" ? "😎" : gameState === "lost" ? "😵" : "🙂";

  return (
    <div className="p-4 font-retro bg-mac-gray select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 p-2 bg-gray-300 border-2 border-gray-500">
        {/* Mine counter */}
        <div className="bg-black text-red-500 font-mono px-2 py-1 text-lg min-w-[50px] text-center">
          {String(MINE_COUNT - flagCount).padStart(3, "0")}
        </div>

        {/* Reset button */}
        <button
          onClick={resetGame}
          className="w-10 h-10 bg-gray-300 border-2 border-t-white border-l-white border-r-gray-600 border-b-gray-600 flex items-center justify-center text-xl hover:bg-gray-200 active:border-t-gray-600 active:border-l-gray-600 active:border-r-white active:border-b-white"
        >
          {statusFace}
        </button>

        {/* Timer */}
        <div className="bg-black text-red-500 font-mono px-2 py-1 text-lg min-w-[50px] text-center">
          {String(timer).padStart(3, "0")}
        </div>
      </div>

      {/* Game board */}
      <div className="inline-block border-4 border-t-gray-600 border-l-gray-600 border-r-white border-b-white">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))}
          </div>
        ))}
      </div>

      {/* Game over message */}
      {gameState !== "playing" && (
        <div className="mt-3 text-center">
          <span className={`font-bold ${gameState === "won" ? "text-green-600" : "text-red-600"}`}>
            {gameState === "won" ? "¡Ganaste! 🎉" : "¡Perdiste! 💥"}
          </span>
          <button
            onClick={resetGame}
            className="ml-3 px-3 py-1 bg-mac-blue text-white border-2 border-black hover:bg-blue-700"
          >
            Nuevo Juego
          </button>
        </div>
      )}
    </div>
  );
};
