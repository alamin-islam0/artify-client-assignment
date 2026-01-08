import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const ThemeContext = createContext();

const STORAGE_KEY = "artify-theme";
const LIGHT_DATATHEME = "artify";
const DARK_DATATHEME = "dark";

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") return stored;
    } catch (e) {}
    // Default to light, ignore system preference
    return "light";
  });

  // apply theme to documentElement
  const applyTheme = useCallback((t) => {
    const html = document.documentElement;
    if (!html) return;
    if (t === "dark") {
      html.classList.add("dark");
      html.setAttribute("data-theme", DARK_DATATHEME);
    } else {
      html.classList.remove("dark");
      html.setAttribute("data-theme", LIGHT_DATATHEME);
    }
  }, []);

  // toggle handler
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  // effect: when theme changes, persist and apply
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {}
    applyTheme(theme);
  }, [theme, applyTheme]);

  // sync across tabs/windows (storage event)
  useEffect(() => {
    const onStorage = (ev) => {
      if (ev.key !== STORAGE_KEY) return;
      const val = ev.newValue === "dark" ? "dark" : "light";
      setTheme(val);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Sync with system preference if no manual override
  // Removed system preference sync to enforce default light theme
  // unless user manually toggles it.

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
