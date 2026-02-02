// Window Manager Context - Refactored with fixed z-index management

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  position: { x: number; y: number };
}

interface WindowManagerContextType {
  windows: WindowState[];
  activeWindowId: string | null;
  openWindow: (id: string, title: string, position?: { x: number; y: number }) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  getWindow: (id: string) => WindowState | undefined;
}

const WindowManagerContext = createContext<WindowManagerContextType | undefined>(undefined);

const BASE_Z_INDEX = 10;

export const WindowManagerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [, setZIndexCounter] = useState(BASE_Z_INDEX);

  const focusWindow = useCallback((id: string) => {
    setZIndexCounter((prevZ) => {
      const newZ = prevZ + 1;
      setWindows((prevWindows) =>
        prevWindows.map((w) =>
          w.id === id ? { ...w, zIndex: newZ, isMinimized: false } : w
        )
      );
      setActiveWindowId(id);
      return newZ;
    });
  }, []);

  const openWindow = useCallback(
    (id: string, title: string, position?: { x: number; y: number }) => {
      setZIndexCounter((prevZ) => {
        const newZ = prevZ + 1;

        setWindows((prevWindows) => {
          const existing = prevWindows.find((w) => w.id === id);

          if (existing) {
            // Window exists - restore and focus it
            return prevWindows.map((w) =>
              w.id === id
                ? { ...w, isOpen: true, isMinimized: false, zIndex: newZ }
                : w
            );
          }

          // Create new window
          const safePosition = position || { x: 100, y: 100 };
          return [
            ...prevWindows,
            {
              id,
              title,
              isOpen: true,
              isMinimized: false,
              zIndex: newZ,
              position: safePosition,
            },
          ];
        });

        setActiveWindowId(id);
        return newZ;
      });
    },
    []
  );

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    setActiveWindowId((prevActive) => (prevActive === id ? null : prevActive));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
    setActiveWindowId((prevActive) => (prevActive === id ? null : prevActive));
  }, []);

  const restoreWindow = useCallback((id: string) => {
    focusWindow(id);
  }, [focusWindow]);

  const updateWindowPosition = useCallback(
    (id: string, position: { x: number; y: number }) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, position } : w))
      );
    },
    []
  );

  const getWindow = useCallback(
    (id: string) => windows.find((w) => w.id === id),
    [windows]
  );

  const value = useMemo(
    () => ({
      windows,
      activeWindowId,
      openWindow,
      closeWindow,
      focusWindow,
      minimizeWindow,
      restoreWindow,
      updateWindowPosition,
      getWindow,
    }),
    [
      windows,
      activeWindowId,
      openWindow,
      closeWindow,
      focusWindow,
      minimizeWindow,
      restoreWindow,
      updateWindowPosition,
      getWindow,
    ]
  );

  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  );
};

export const useWindowManager = () => {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error("useWindowManager must be used within a WindowManagerProvider");
  }
  return context;
};
