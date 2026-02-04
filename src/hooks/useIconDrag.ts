// useIconDrag - Free drag with grid snap on drop, no overlap

import { useState, useCallback, useRef } from "react";

// Grid and layout constants  
const GRID_WIDTH = 130;   // Horizontal spacing between icons
const GRID_HEIGHT = 155;  // Vertical spacing (icon + label + padding)
const MENUBAR_HEIGHT = 36;
const DOCK_HEIGHT = 48;
const GRID_OFFSET_X = 20;
const GRID_OFFSET_Y = MENUBAR_HEIGHT + 20;

export interface IconPosition {
  x: number;
  y: number;
}

// Convert position to grid cell
const posToCell = (x: number, y: number) => ({
  col: Math.round((x - GRID_OFFSET_X) / GRID_WIDTH),
  row: Math.round((y - GRID_OFFSET_Y) / GRID_HEIGHT),
});

// Convert grid cell to position
const cellToPos = (col: number, row: number): IconPosition => ({
  x: GRID_OFFSET_X + col * GRID_WIDTH,
  y: GRID_OFFSET_Y + row * GRID_HEIGHT,
});

// Cell key for Set
const cellKey = (col: number, row: number) => `${col},${row}`;

// Generate default positions in grid layout
const generateDefaultPositions = (iconIds: string[]): Record<string, IconPosition> => {
  const positions: Record<string, IconPosition> = {};
  const iconsPerColumn = 4;
  
  let cellIndex = 0;
  iconIds.forEach((id) => {
    if (id === "trash") {
      positions[id] = { x: -1, y: -1 }; // Special marker
    } else {
      const col = Math.floor(cellIndex / iconsPerColumn);
      const row = cellIndex % iconsPerColumn;
      positions[id] = cellToPos(col, row);
      cellIndex++;
    }
  });
  
  return positions;
};

export const useIconDrag = (iconIds: string[], trashId: string = "trash") => {
  const [positions, setPositions] = useState<Record<string, IconPosition>>(() => 
    generateDefaultPositions(iconIds)
  );
  
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Get set of occupied cells (excluding current dragging icon)
  const getOccupiedCells = useCallback((excludeId?: string) => {
    const occupied = new Set<string>();
    Object.entries(positions).forEach(([id, pos]) => {
      if (id !== excludeId && id !== trashId && pos.x >= 0) {
        const cell = posToCell(pos.x, pos.y);
        occupied.add(cellKey(cell.col, cell.row));
      }
    });
    return occupied;
  }, [positions, trashId]);
  
  // Find nearest free cell
  const findFreeCell = useCallback((targetCol: number, targetRow: number, occupied: Set<string>, maxCols: number, maxRows: number) => {
    // Clamp target to valid range
    targetCol = Math.max(0, Math.min(targetCol, maxCols - 1));
    targetRow = Math.max(0, Math.min(targetRow, maxRows - 1));
    
    // Check if target is free
    if (!occupied.has(cellKey(targetCol, targetRow))) {
      return { col: targetCol, row: targetRow };
    }
    
    // Spiral search for nearest free cell
    for (let radius = 1; radius < Math.max(maxCols, maxRows) * 2; radius++) {
      for (let dc = -radius; dc <= radius; dc++) {
        for (let dr = -radius; dr <= radius; dr++) {
          if (Math.abs(dc) !== radius && Math.abs(dr) !== radius) continue;
          
          const col = targetCol + dc;
          const row = targetRow + dr;
          
          if (col >= 0 && col < maxCols && row >= 0 && row < maxRows) {
            if (!occupied.has(cellKey(col, row))) {
              return { col, row };
            }
          }
        }
      }
    }
    
    return { col: targetCol, row: targetRow };
  }, []);
  
  // Get position for an icon
  const getIconPosition = useCallback((id: string): IconPosition => {
    const pos = positions[id];
    
    // Trash - position at bottom right, higher to show label above dock
    if (id === trashId && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      return {
        x: rect.width - 130,
        y: rect.height - DOCK_HEIGHT - 165,
      };
    }
    
    return pos || { x: GRID_OFFSET_X, y: GRID_OFFSET_Y };
  }, [positions, trashId]);
  
  // Start dragging
  const startDrag = useCallback((id: string, clientX: number, clientY: number) => {
    if (id === trashId) return;
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const pos = positions[id] || { x: 0, y: 0 };
    
    dragOffset.current = {
      x: clientX - rect.left - pos.x,
      y: clientY - rect.top - pos.y,
    };
    
    setDraggingId(id);
  }, [positions, trashId]);
  
  // Update position while dragging (free movement)
  const updateDrag = useCallback((clientX: number, clientY: number) => {
    if (!draggingId || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    
    let newX = clientX - rect.left - dragOffset.current.x;
    let newY = clientY - rect.top - dragOffset.current.y;
    
    // Clamp within bounds
    newX = Math.max(0, Math.min(newX, rect.width - 112));
    newY = Math.max(MENUBAR_HEIGHT, Math.min(newY, rect.height - DOCK_HEIGHT - 130));
    
    setPositions(prev => ({
      ...prev,
      [draggingId]: { x: newX, y: newY },
    }));
  }, [draggingId]);
  
  // End dragging - snap to nearest free grid cell
  const endDrag = useCallback(() => {
    if (!draggingId || !containerRef.current) {
      setDraggingId(null);
      return;
    }
    
    const rect = containerRef.current.getBoundingClientRect();
    const currentPos = positions[draggingId];
    
    if (!currentPos) {
      setDraggingId(null);
      return;
    }
    
    // Calculate grid dimensions
    const maxCols = Math.floor((rect.width - GRID_OFFSET_X) / GRID_WIDTH);
    const maxRows = Math.floor((rect.height - MENUBAR_HEIGHT - DOCK_HEIGHT - 40) / GRID_HEIGHT);
    
    // Get target cell from current position
    const targetCell = posToCell(currentPos.x, currentPos.y);
    
    // Get occupied cells (excluding this icon)
    const occupied = getOccupiedCells(draggingId);
    
    // Find nearest free cell
    const freeCell = findFreeCell(targetCell.col, targetCell.row, occupied, maxCols, maxRows);
    
    // Snap to grid
    const snappedPos = cellToPos(freeCell.col, freeCell.row);
    
    setPositions(prev => ({
      ...prev,
      [draggingId]: snappedPos,
    }));
    
    setDraggingId(null);
  }, [draggingId, positions, getOccupiedCells, findFreeCell]);
  
  return {
    positions,
    draggingId,
    containerRef,
    getIconPosition,
    startDrag,
    updateDrag,
    endDrag,
  };
};
