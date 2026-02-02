// Desktop icon selection hook - manages single-click selection vs double-click open

import { useState, useCallback, useEffect } from "react";

export function useDesktopSelection(iconIds: string[]) {
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);

  const selectIcon = useCallback((id: string) => {
    setSelectedIconId(id);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIconId(null);
  }, []);

  const selectNext = useCallback(() => {
    if (iconIds.length === 0) return;
    if (selectedIconId === null) {
      setSelectedIconId(iconIds[0]);
      return;
    }
    const currentIndex = iconIds.indexOf(selectedIconId);
    const nextIndex = (currentIndex + 1) % iconIds.length;
    setSelectedIconId(iconIds[nextIndex]);
  }, [iconIds, selectedIconId]);

  const selectPrevious = useCallback(() => {
    if (iconIds.length === 0) return;
    if (selectedIconId === null) {
      setSelectedIconId(iconIds[iconIds.length - 1]);
      return;
    }
    const currentIndex = iconIds.indexOf(selectedIconId);
    const prevIndex = (currentIndex - 1 + iconIds.length) % iconIds.length;
    setSelectedIconId(iconIds[prevIndex]);
  }, [iconIds, selectedIconId]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
          e.preventDefault();
          selectNext();
          break;
        case "ArrowUp":
        case "ArrowLeft":
          e.preventDefault();
          selectPrevious();
          break;
        case "Escape":
          clearSelection();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectNext, selectPrevious, clearSelection]);

  return {
    selectedIconId,
    selectIcon,
    clearSelection,
    selectNext,
    selectPrevious,
  };
}
