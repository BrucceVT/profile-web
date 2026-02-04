// Tetris Game Window - Improved gameplay

import React, { useState, useEffect, useCallback, useRef } from "react";

type TetrisPiece = {
  shape: number[][];
  color: string;
};

type GameState = "playing" | "paused" | "gameover";

interface RankingEntry {
  name: string;
  score: number;
  lines: number;
  date: string;
  isBot: boolean;
}

// Tetris pieces (Tetrominos)
const PIECE_TEMPLATES = [
  { shape: [[1, 1, 1, 1]], color: "bg-cyan-400" }, // I
  { shape: [[1, 1], [1, 1]], color: "bg-yellow-400" }, // O
  { shape: [[0, 1, 0], [1, 1, 1]], color: "bg-purple-500" }, // T
  { shape: [[1, 0, 0], [1, 1, 1]], color: "bg-orange-500" }, // L
  { shape: [[0, 0, 1], [1, 1, 1]], color: "bg-blue-500" }, // J
  { shape: [[0, 1, 1], [1, 1, 0]], color: "bg-green-500" }, // S
  { shape: [[1, 1, 0], [0, 1, 1]], color: "bg-red-500" }, // Z
];

// Ghost piece colors (more transparent versions)
const GHOST_COLORS: Record<string, string> = {
  "bg-cyan-400": "bg-cyan-400/30",
  "bg-yellow-400": "bg-yellow-400/30",
  "bg-purple-500": "bg-purple-500/30",
  "bg-orange-500": "bg-orange-500/30",
  "bg-blue-500": "bg-blue-500/30",
  "bg-green-500": "bg-green-500/30",
  "bg-red-500": "bg-red-500/30",
};

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const RANKING_KEY = "tetris_ranking_v1";
const MAX_RANKING = 5;

// Bot scores
const BOT_SCORES: RankingEntry[] = [
  { name: "TetrisPro", score: 15000, lines: 45, date: "01/01/2026", isBot: true },
  { name: "BlockMaster", score: 8500, lines: 28, date: "10/01/2026", isBot: true },
  { name: "LineKing", score: 5200, lines: 18, date: "20/01/2026", isBot: true },
];

const loadPlayerRankings = (): RankingEntry[] => {
  try {
    const saved = localStorage.getItem(RANKING_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const savePlayerRankings = (rankings: RankingEntry[]) => {
  try {
    localStorage.setItem(RANKING_KEY, JSON.stringify(rankings));
  } catch {}
};

const getMergedRanking = (playerRankings: RankingEntry[]): RankingEntry[] => {
  return [...BOT_SCORES, ...playerRankings]
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RANKING);
};

const createEmptyBoard = (): (string | null)[][] => {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null));
};

const clonePiece = (piece: TetrisPiece): TetrisPiece => ({
  shape: piece.shape.map(row => [...row]),
  color: piece.color,
});

const getRandomPiece = (): TetrisPiece => {
  const template = PIECE_TEMPLATES[Math.floor(Math.random() * PIECE_TEMPLATES.length)];
  return clonePiece(template);
};

export const TetrisWindow: React.FC = () => {
  const [board, setBoard] = useState<(string | null)[][]>(() => createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<TetrisPiece>(() => getRandomPiece());
  const [nextPiece, setNextPiece] = useState<TetrisPiece>(() => getRandomPiece());
  const [piecePosition, setPiecePosition] = useState({ x: 3, y: 0 });
  const [gameState, setGameState] = useState<GameState>("playing");
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [playerRankings, setPlayerRankings] = useState<RankingEntry[]>(() => loadPlayerRankings());
  const [isFocused, setIsFocused] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [lastLevelUp, setLastLevelUp] = useState(1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const lastDropTime = useRef<number>(Date.now());

  // Check collision
  const checkCollision = useCallback((piece: TetrisPiece, pos: { x: number; y: number }, boardState: (string | null)[][]) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = pos.x + x;
          const newY = pos.y + y;
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return true;
          }
          if (newY >= 0 && boardState[newY][newX]) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  // Calculate ghost piece position
  const getGhostPosition = useCallback(() => {
    let ghostY = piecePosition.y;
    while (!checkCollision(currentPiece, { x: piecePosition.x, y: ghostY + 1 }, board)) {
      ghostY++;
    }
    return ghostY;
  }, [piecePosition, currentPiece, board, checkCollision]);

  // Rotate piece
  const rotatePiece = useCallback((piece: TetrisPiece): TetrisPiece => {
    const rotated = piece.shape[0].map((_, i) =>
      piece.shape.map(row => row[i]).reverse()
    );
    return { color: piece.color, shape: rotated };
  }, []);

  // Clear completed lines
  const clearCompletedLines = useCallback((boardState: (string | null)[][]): { newBoard: (string | null)[][]; clearedCount: number } => {
    const newBoard = boardState.filter(row => row.some(cell => cell === null));
    const clearedCount = BOARD_HEIGHT - newBoard.length;
    
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(null));
    }
    
    return { newBoard, clearedCount };
  }, []);

  // Spawn new piece
  const spawnNewPiece = useCallback((clearedBoard: (string | null)[][], currentScore: number, currentLines: number) => {
    const newPiece = clonePiece(nextPiece);
    const startPos = { x: 3, y: 0 };
    
    if (checkCollision(newPiece, startPos, clearedBoard)) {
      setGameState("gameover");
      
      if (currentScore > 0) {
        const newEntry: RankingEntry = {
          name: "Tú",
          score: currentScore,
          lines: currentLines,
          date: new Date().toLocaleDateString(),
          isBot: false,
        };
        const newRankings = [...playerRankings, newEntry]
          .sort((a, b) => b.score - a.score)
          .slice(0, MAX_RANKING);
        setPlayerRankings(newRankings);
        savePlayerRankings(newRankings);
      }
      return;
    }
    
    setCurrentPiece(newPiece);
    setNextPiece(getRandomPiece());
    setPiecePosition(startPos);
    lastDropTime.current = Date.now();
  }, [nextPiece, checkCollision, playerRankings]);

  // Place piece on board
  const placePiece = useCallback((posY?: number) => {
    const placeY = posY ?? piecePosition.y;
    const newBoard = board.map(row => [...row]);
    
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          const boardY = placeY + y;
          const boardX = piecePosition.x + x;
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            newBoard[boardY][boardX] = currentPiece.color;
          }
        }
      }
    }
    
    const { newBoard: clearedBoard, clearedCount } = clearCompletedLines(newBoard);
    
    let newScore = score;
    let newLines = lines;
    let newLevel = level;
    
    if (clearedCount > 0) {
      const points = [0, 100, 300, 500, 800][clearedCount] * level;
      newScore = score + points;
      newLines = lines + clearedCount;
      newLevel = Math.floor(newLines / 10) + 1;
      setScore(newScore);
      setLines(newLines);
      
      // Check for level up
      if (newLevel > level) {
        setLevel(newLevel);
        setShowLevelUp(true);
        setLastLevelUp(newLevel);
        setTimeout(() => setShowLevelUp(false), 2000);
      }
    }
    
    setBoard(clearedBoard);
    spawnNewPiece(clearedBoard, newScore, newLines);
  }, [board, currentPiece, piecePosition, level, score, lines, clearCompletedLines, spawnNewPiece]);

  // Move piece down
  const moveDown = useCallback(() => {
    if (gameState !== "playing") return;
    
    const newPos = { x: piecePosition.x, y: piecePosition.y + 1 };
    
    if (checkCollision(currentPiece, newPos, board)) {
      placePiece();
    } else {
      setPiecePosition(newPos);
      lastDropTime.current = Date.now();
    }
  }, [gameState, piecePosition, currentPiece, board, checkCollision, placePiece]);

  // Move piece left/right (doesn't affect drop timing)
  const moveHorizontal = useCallback((direction: number) => {
    if (gameState !== "playing") return;
    
    const newPos = { x: piecePosition.x + direction, y: piecePosition.y };
    
    if (!checkCollision(currentPiece, newPos, board)) {
      setPiecePosition(newPos);
    }
  }, [gameState, piecePosition, currentPiece, board, checkCollision]);

  // Rotate current piece (doesn't affect drop timing)
  const rotate = useCallback(() => {
    if (gameState !== "playing") return;
    
    const rotated = rotatePiece(currentPiece);
    
    if (!checkCollision(rotated, piecePosition, board)) {
      setCurrentPiece(rotated);
    }
  }, [gameState, currentPiece, piecePosition, board, rotatePiece, checkCollision]);

  // Hard drop
  const hardDrop = useCallback(() => {
    if (gameState !== "playing") return;
    
    const ghostY = getGhostPosition();
    placePiece(ghostY);
  }, [gameState, getGhostPosition, placePiece]);

  // Keyboard controls
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (gameState !== "playing") return;
    
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        e.stopPropagation();
        moveHorizontal(-1);
        break;
      case "ArrowRight":
        e.preventDefault();
        e.stopPropagation();
        moveHorizontal(1);
        break;
      case "ArrowDown":
        e.preventDefault();
        e.stopPropagation();
        moveDown();
        break;
      case "ArrowUp":
        e.preventDefault();
        e.stopPropagation();
        rotate();
        break;
      case " ":
        e.preventDefault();
        e.stopPropagation();
        hardDrop();
        break;
    }
  }, [gameState, moveHorizontal, moveDown, rotate, hardDrop]);

  // Game loop - independent of keyboard input
  useEffect(() => {
    if (gameState !== "playing" || !isFocused) return;
    
    const speed = Math.max(100, 800 - (level - 1) * 100); // More noticeable speed increase
    
    const gameLoop = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastDropTime.current;
      
      if (elapsed >= speed) {
        moveDown();
      }
    }, 50); // Check every 50ms for smooth gameplay
    
    return () => clearInterval(gameLoop);
  }, [gameState, level, isFocused, moveDown]);

  // Focus on mount
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Reset game
  const resetGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPiece(getRandomPiece());
    setNextPiece(getRandomPiece());
    setPiecePosition({ x: 3, y: 0 });
    setGameState("playing");
    setScore(0);
    setLines(0);
    setLevel(1);
    setShowLevelUp(false);
    lastDropTime.current = Date.now();
    containerRef.current?.focus();
  };

  const clearPlayerRanking = () => {
    setPlayerRankings([]);
    savePlayerRankings([]);
  };

  // Render board with current piece and ghost
  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    const ghostY = getGhostPosition();
    
    // Add ghost piece first (so real piece renders on top)
    if (gameState === "playing" && ghostY > piecePosition.y) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = ghostY + y;
            const boardX = piecePosition.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              if (!displayBoard[boardY][boardX]) {
                displayBoard[boardY][boardX] = GHOST_COLORS[currentPiece.color] || "bg-gray-600/30";
              }
            }
          }
        }
      }
    }
    
    // Add current piece
    if (gameState === "playing") {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = piecePosition.y + y;
            const boardX = piecePosition.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.color;
            }
          }
        }
      }
    }
    
    return displayBoard.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => (
          <div
            key={x}
            className={`w-6 h-6 border border-gray-700 ${cell || "bg-gray-900"}`}
          />
        ))}
      </div>
    ));
  };

  // Render next piece preview
  const renderNextPiece = () => {
    const previewSize = 4;
    const preview: (string | null)[][] = Array(previewSize).fill(null).map(() => Array(previewSize).fill(null));
    
    const offsetX = Math.floor((previewSize - nextPiece.shape[0].length) / 2);
    const offsetY = Math.floor((previewSize - nextPiece.shape.length) / 2);
    
    for (let y = 0; y < nextPiece.shape.length; y++) {
      for (let x = 0; x < nextPiece.shape[y].length; x++) {
        if (nextPiece.shape[y][x]) {
          const py = offsetY + y;
          const px = offsetX + x;
          if (py >= 0 && py < previewSize && px >= 0 && px < previewSize) {
            preview[py][px] = nextPiece.color;
          }
        }
      }
    }
    
    return preview.map((row, y) => (
      <div key={y} className="flex justify-center">
        {row.map((cell, x) => (
          <div
            key={x}
            className={`w-5 h-5 border border-gray-600 ${cell || "bg-gray-800"}`}
          />
        ))}
      </div>
    ));
  };

  const mergedRanking = getMergedRanking(playerRankings);
  const currentSpeed = Math.max(100, 800 - (level - 1) * 100);

  return (
    <div 
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={`p-4 font-retro bg-mac-gray select-none outline-none ${!isFocused && gameState === "playing" ? "opacity-80" : ""}`}
    >
      {/* Focus indicator */}
      {!isFocused && gameState === "playing" && (
        <div className="mb-2 text-center text-sm text-orange-600 font-bold bg-orange-100 p-2 border border-orange-400">
          ⚠️ Haz clic aquí para jugar
        </div>
      )}

      {/* Level Up Indicator */}
      {showLevelUp && (
        <div className="mb-2 text-center text-lg text-green-600 font-bold bg-green-100 p-2 border-2 border-green-500 animate-pulse">
          🎉 ¡NIVEL {lastLevelUp}! 🎉
          <div className="text-xs mt-1">Velocidad: {currentSpeed}ms</div>
        </div>
      )}

      <div className="flex gap-4">
        {/* Game Board */}
        <div className="flex-shrink-0">
          <div className="border-4 border-gray-600 bg-gray-900">
            {renderBoard()}
          </div>
          
          {/* Controls hint */}
          <div className="mt-2 text-xs text-gray-600 text-center">
            ←→ Mover | ↑ Rotar | ↓ Bajar | Espacio: Soltar
          </div>
        </div>

        {/* Side Panel */}
        <div className="flex-1 min-w-[150px] space-y-3">
          {/* Score */}
          <div className="bg-white border-2 border-gray-500 p-2">
            <div className="text-sm font-bold mb-1">Puntuación</div>
            <div className="text-xl font-bold text-blue-600">{score.toLocaleString()}</div>
          </div>

          {/* Lines & Level & Speed */}
          <div className="bg-white border-2 border-gray-500 p-2">
            <div className="flex gap-3 mb-2">
              <div>
                <div className="text-sm font-bold">Líneas</div>
                <div className="text-base font-bold">{lines}</div>
              </div>
              <div>
                <div className="text-sm font-bold">Nivel</div>
                <div className="text-base font-bold text-purple-600">{level}</div>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Velocidad: {currentSpeed}ms
              <div className="w-full bg-gray-200 h-2 mt-1 rounded">
                <div 
                  className="bg-red-500 h-2 rounded transition-all"
                  style={{ width: `${Math.max(10, 100 - (level - 1) * 12)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Next Piece */}
          <div className="bg-white border-2 border-gray-500 p-2">
            <div className="text-sm font-bold mb-2">Siguiente</div>
            <div className="bg-gray-800 p-1 inline-block border border-gray-600">
              {renderNextPiece()}
            </div>
          </div>

          {/* New Game Button */}
          <button
            onClick={resetGame}
            className="w-full py-2 text-sm font-bold bg-gray-300 border-2 border-t-white border-l-white border-r-gray-600 border-b-gray-600 hover:bg-gray-200"
          >
            {gameState === "gameover" ? "🔄 Nuevo Juego" : "🔄 Reiniciar"}
          </button>

          {/* Ranking */}
          <div className="bg-white border-2 border-gray-500 p-2">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm">🏆 Ranking</span>
              {playerRankings.length > 0 && (
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
                  <th className="text-left py-1">#</th>
                  <th className="text-left py-1">Jugador</th>
                  <th className="text-right py-1">Puntos</th>
                </tr>
              </thead>
              <tbody>
                {mergedRanking.map((entry, index) => (
                  <tr 
                    key={index}
                    className={`${!entry.isBot ? "text-green-600 font-bold" : ""} ${index === 0 ? "bg-yellow-50" : ""}`}
                  >
                    <td className="py-1">{index + 1}</td>
                    <td className="py-1 truncate max-w-[70px]">
                      {entry.isBot ? `🤖 ${entry.name}` : `⭐ ${entry.name}`}
                    </td>
                    <td className="text-right py-1">{entry.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Game Over Overlay */}
      {gameState === "gameover" && (
        <div className="mt-3 text-center p-3 bg-red-100 border-2 border-red-500">
          <div className="text-lg font-bold text-red-600 mb-2">¡Game Over!</div>
          <div className="text-sm">Puntuación: <span className="font-bold">{score.toLocaleString()}</span></div>
          <div className="text-sm">Líneas: <span className="font-bold">{lines}</span> | Nivel: <span className="font-bold">{level}</span></div>
          <button
            onClick={resetGame}
            className="mt-2 px-4 py-1 bg-mac-blue text-white border-2 border-black hover:bg-blue-700"
          >
            Jugar de nuevo
          </button>
        </div>
      )}
    </div>
  );
};
