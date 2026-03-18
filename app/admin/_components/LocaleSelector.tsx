"use client";

import { createContext, useContext, useState, useEffect } from "react";

type Locale = { code: string; name: string; locale: string };

type LocaleContextType = {
  locale: string;
  setLocale: (code: string) => void;
  locales: Locale[];
  localesLoading: boolean;
};

const LocaleContext = createContext<LocaleContextType>({
  locale: "en",
  setLocale: () => {},
  locales: [],
  localesLoading: true,
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState]    = useState("en");
  const [locales, setLocales]        = useState<Locale[]>([]);
  const [localesLoading, setLoading] = useState(true);

  useEffect(() => {
    const saved = typeof window !== "undefined"
      ? localStorage.getItem("admin_locale")
      : null;
    if (saved) setLocaleState(saved);

    fetch("/api/admin/locales")
      .then(r => r.json())
      .then(d => setLocales(Array.isArray(d) ? d : []))
      .catch(() => setLocales([{ code: "en", name: "English", locale: "en-US" }]))
      .finally(() => setLoading(false));
  }, []);

  function setLocale(code: string) {
    setLocaleState(code);
    localStorage.setItem("admin_locale", code);
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, locales, localesLoading }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocaleContext() {
  return useContext(LocaleContext);
}