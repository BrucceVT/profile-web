import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: Theme;
  effectiveTheme: "light" | "dark";
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyThemeClass(theme: Theme) {
  const root = document.documentElement;
  const resolved: "light" | "dark" =
    theme === "system" ? getSystemTheme() : theme;

  // Usamos la estrategia "class" para Tailwind / shadcn
  if (resolved === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  // (opcional) útil si quieres estilos por data-attr
  root.setAttribute("data-theme", resolved);
}

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    return saved ?? "system";
  });

  const effectiveTheme = useMemo(
    () => (theme === "system" ? getSystemTheme() : theme),
    [theme]
  );

  // Aplica clase al cargar y cuando cambie 'theme'
  useEffect(() => {
    applyThemeClass(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Escucha cambios del sistema si estamos en 'system'
  useEffect(() => {
    if (theme !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyThemeClass("system");
    mql.addEventListener?.("change", handler);
    return () => mql.removeEventListener?.("change", handler);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, effectiveTheme, setTheme: (t) => setThemeState(t) }),
    [theme, effectiveTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
