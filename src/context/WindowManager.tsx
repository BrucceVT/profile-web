// Window Manager Context - With initial window and canClose support

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
  canClose: boolean;
  zIndex: number;
  position: { x: number; y: number };
}

// Reason for window exit animation
export type ExitReason = "close" | "minimize" | null;

interface WindowManagerContextType {
  windows: WindowState[];
  activeWindowId: string | null;
  exitReasons: Record<string, ExitReason>;
  openWindow: (id: string, title: string, position?: { x: number; y: number }, canClose?: boolean) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  getWindow: (id: string) => WindowState | undefined;
}

const WindowManagerContext = createContext<WindowManagerContextType | undefined>(undefined);

const BASE_Z_INDEX = 10;

// Windows that cannot be closed
const UNCLOSABLE_WINDOWS = ["welcome"];

interface WindowManagerProviderProps {
  children: ReactNode;
  initialWindow?: {
    id: string;
    title: string;
    position: { x: number; y: number };
    canClose?: boolean;
  };
}

export const WindowManagerProvider: React.FC<WindowManagerProviderProps> = ({ 
  children, 
  initialWindow 
}) => {
  // Initialize with the welcome window already open if provided
  const [windows, setWindows] = useState<WindowState[]>(() => {
    if (initialWindow) {
      return [{
        id: initialWindow.id,
        title: initialWindow.title,
        isOpen: true,
        isMinimized: false,
        canClose: initialWindow.canClose ?? !UNCLOSABLE_WINDOWS.includes(initialWindow.id),
        zIndex: BASE_Z_INDEX + 1,
        position: initialWindow.position,
      }];
    }
    return [];
  });
  
  const [activeWindowId, setActiveWindowId] = useState<string | null>(
    initialWindow ? initialWindow.id : null
  );
  const [, setZIndexCounter] = useState(BASE_Z_INDEX + (initialWindow ? 1 : 0));
  
  // Track exit reasons for animation differentiation
  const [exitReasons, setExitReasons] = useState<Record<string, ExitReason>>({});

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
    // Clear exit reason on focus/restore
    setExitReasons((prev) => ({ ...prev, [id]: null }));
  }, []);

  const openWindow = useCallback(
    (id: string, title: string, position?: { x: number; y: number }, canClose?: boolean) => {
      setZIndexCounter((prevZ) => {
        const newZ = prevZ + 1;

        setWindows((prevWindows) => {
          const existing = prevWindows.find((w) => w.id === id);

          if (existing) {
            // Window exists - restore and focus it
            return prevWindows.map((w) =>
              w.id === id
                ? { ...w, isOpen: true, isMinimized: false, zIndex: newZ, title }
                : w
            );
          }

          // Create new window
          const safePosition = position || { x: 100, y: 100 };
          const windowCanClose = canClose ?? !UNCLOSABLE_WINDOWS.includes(id);
          
          return [
            ...prevWindows,
            {
              id,
              title,
              isOpen: true,
              isMinimized: false,
              canClose: windowCanClose,
              zIndex: newZ,
              position: safePosition,
            },
          ];
        });

        setActiveWindowId(id);
        return newZ;
      });
      // Clear exit reason on open
      setExitReasons((prev) => ({ ...prev, [id]: null }));
    },
    []
  );

  const closeWindow = useCallback((id: string) => {
    // DEFENSE: Prevent closing unclosable windows
    if (UNCLOSABLE_WINDOWS.includes(id)) {
      if (import.meta.env.DEV) {
        console.warn(`[WindowManager] Cannot close window "${id}" - it is marked as unclosable`);
      }
      return;
    }
    
    // Set exit reason for animation
    setExitReasons((prev) => ({ ...prev, [id]: "close" }));
    
    // Small delay to allow exit animation
    setTimeout(() => {
      setWindows((prev) => prev.filter((w) => w.id !== id));
      setActiveWindowId((prevActive) => (prevActive === id ? null : prevActive));
      setExitReasons((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }, 200);
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    // Set exit reason for minimize animation
    setExitReasons((prev) => ({ ...prev, [id]: "minimize" }));
    
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
      exitReasons,
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
      exitReasons,
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
