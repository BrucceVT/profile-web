// useIconDrag - Simple free positioning for desktop icons

import { useState, useCallback, useRef } from "react";

const MENUBAR_HEIGHT = 36;
const DOCK_HEIGHT = 48;

export interface IconPosition {
  x: number;
  y: number;
}

// Generate default positions in a column layout
const generateDefaultPositions = (iconIds: string[]): Record<string, IconPosition> => {
  const positions: Record<string, IconPosition> = {};
  const iconHeight = 130; // Icon + label height
  const iconWidth = 110;
  const startX = 20;
  const startY = MENUBAR_HEIGHT + 20;
  const iconsPerColumn = 4;
  
  iconIds.forEach((id, index) => {
    if (id === "trash") {
      // Trash will be positioned dynamically
      positions[id] = { x: -1, y: -1 };
    } else {
      const col = Math.floor(index / iconsPerColumn);
      const row = index % iconsPerColumn;
      positions[id] = {
        x: startX + col * iconWidth,
        y: startY + row * iconHeight,
      };
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
  
  // Get position for an icon
  const getIconPosition = useCallback((id: string): IconPosition => {
    const pos = positions[id];
    
    // Handle trash icon - position at bottom right
    if (id === trashId && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      return {
        x: rect.width - 130,
        y: rect.height - DOCK_HEIGHT - 140,
      };
    }
    
    return pos || { x: 20, y: MENUBAR_HEIGHT + 20 };
  }, [positions, trashId]);
  
  // Start dragging
  const startDrag = useCallback((id: string, clientX: number, clientY: number) => {
    // Don't allow dragging trash
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
  
  // Update position while dragging
  const updateDrag = useCallback((clientX: number, clientY: number) => {
    if (!draggingId || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate new position
    let newX = clientX - rect.left - dragOffset.current.x;
    let newY = clientY - rect.top - dragOffset.current.y;
    
    // Clamp within bounds
    const iconWidth = 112;
    const iconHeight = 130;
    newX = Math.max(0, Math.min(newX, rect.width - iconWidth));
    newY = Math.max(MENUBAR_HEIGHT, Math.min(newY, rect.height - DOCK_HEIGHT - iconHeight));
    
    setPositions(prev => ({
      ...prev,
      [draggingId]: { x: newX, y: newY },
    }));
  }, [draggingId]);
  
  // End dragging
  const endDrag = useCallback(() => {
    setDraggingId(null);
  }, []);
  
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
