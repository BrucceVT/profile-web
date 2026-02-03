// Window Manager Context - With maximize and resize support

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

// Work area constants (must match actual component heights)
export const MENUBAR_HEIGHT = 36;
export const DOCK_HEIGHT = 48;
export const MIN_WINDOW_WIDTH = 280;
export const MIN_WINDOW_HEIGHT = 200;

export interface WindowSize {
  width: number;
  height: number;
}

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowBounds {
  position: WindowPosition;
  size: WindowSize;
}

export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  canClose: boolean;
  zIndex: number;
  position: WindowPosition;
  size: WindowSize;
  restoreBounds: WindowBounds | null;
}

// Reason for window exit animation
export type ExitReason = "close" | "minimize" | null;

interface WindowManagerContextType {
  windows: WindowState[];
  activeWindowId: string | null;
  exitReasons: Record<string, ExitReason>;
  openWindow: (id: string, title: string, position?: WindowPosition, canClose?: boolean) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  updateWindowPosition: (id: string, position: WindowPosition) => void;
  updateWindowSize: (id: string, size: WindowSize) => void;
  updateWindowBounds: (id: string, bounds: WindowBounds) => void;
  getWindow: (id: string) => WindowState | undefined;
  getWorkArea: () => { top: number; left: number; width: number; height: number };
}

const WindowManagerContext = createContext<WindowManagerContextType | undefined>(undefined);

const BASE_Z_INDEX = 10;

// Windows that cannot be closed
const UNCLOSABLE_WINDOWS = ["welcome"];

// Default window size
const DEFAULT_SIZE: WindowSize = { width: 500, height: 400 };

interface WindowManagerProviderProps {
  children: ReactNode;
  initialWindow?: {
    id: string;
    title: string;
    position: WindowPosition;
    size?: WindowSize;
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
        isMaximized: false,
        canClose: initialWindow.canClose ?? !UNCLOSABLE_WINDOWS.includes(initialWindow.id),
        zIndex: BASE_Z_INDEX + 1,
        position: initialWindow.position,
        size: initialWindow.size || { width: 420, height: 380 },
        restoreBounds: null,
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

  // Get usable work area (excluding MenuBar and Dock)
  const getWorkArea = useCallback(() => {
    const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
    const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 800;
    
    return {
      top: MENUBAR_HEIGHT,
      left: 0,
      width: viewportWidth,
      height: viewportHeight - MENUBAR_HEIGHT - DOCK_HEIGHT,
    };
  }, []);

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
    (id: string, title: string, position?: WindowPosition, canClose?: boolean) => {
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
              isMaximized: false,
              canClose: windowCanClose,
              zIndex: newZ,
              position: safePosition,
              size: { ...DEFAULT_SIZE },
              restoreBounds: null,
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

  const toggleMaximize = useCallback((id: string) => {
    const workArea = getWorkArea();
    
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        
        if (w.isMaximized) {
          // Restore from maximized
          const restored = w.restoreBounds || {
            position: { x: 100, y: 70 },
            size: { ...DEFAULT_SIZE },
          };
          return {
            ...w,
            isMaximized: false,
            position: restored.position,
            size: restored.size,
            restoreBounds: null,
          };
        } else {
          // Maximize
          return {
            ...w,
            isMaximized: true,
            restoreBounds: {
              position: { ...w.position },
              size: { ...w.size },
            },
            position: { x: workArea.left, y: workArea.top },
            size: { width: workArea.width, height: workArea.height },
          };
        }
      })
    );
    
    focusWindow(id);
  }, [getWorkArea, focusWindow]);

  const updateWindowPosition = useCallback(
    (id: string, position: WindowPosition) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, position } : w))
      );
    },
    []
  );

  const updateWindowSize = useCallback(
    (id: string, size: WindowSize) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, size } : w))
      );
    },
    []
  );

  const updateWindowBounds = useCallback(
    (id: string, bounds: WindowBounds) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, position: bounds.position, size: bounds.size } : w))
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
      toggleMaximize,
      updateWindowPosition,
      updateWindowSize,
      updateWindowBounds,
      getWindow,
      getWorkArea,
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
      toggleMaximize,
      updateWindowPosition,
      updateWindowSize,
      updateWindowBounds,
      getWindow,
      getWorkArea,
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
