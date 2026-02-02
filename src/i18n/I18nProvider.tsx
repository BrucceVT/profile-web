// i18n Provider - Minimal internationalization context

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react";
import { messages, type Lang, type Messages } from "./messages";

const STORAGE_KEY = "portfolio_lang";
const DEFAULT_LANG: Lang = "es";

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Messages;
  toggleLang: () => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    // Initialize from localStorage or default
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "es" || stored === "en") {
        return stored;
      }
    }
    return DEFAULT_LANG;
  });

  // Persist language changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => (prev === "es" ? "en" : "es"));
  }, []);

  // Get current translations
  const t = useMemo(() => messages[lang], [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t,
      toggleLang,
    }),
    [lang, setLang, t, toggleLang]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};
