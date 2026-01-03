import React, { useEffect, useState, useCallback } from "react";
import { Sun, Moon } from "lucide-react";

/**
 * ThemeSwitcher
 *
 * - Stores theme in localStorage key "artify-theme" with values "light" | "dark"
 * - On mount: uses stored value, else system preference
 * - Applies:
 *     document.documentElement.classList.toggle("dark")
 *     document.documentElement.setAttribute("data-theme", themeName)
 *   so both Tailwind `dark:` utilities and DaisyUI theme are respected.
 */
const STORAGE_KEY = "artify-theme";
const LIGHT_DATATHEME = "artify"; // your custom light theme name in daisyui
const DARK_DATATHEME = "dark";

export default function ThemeSwitcher({ size = 18 }) {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") return stored;
    } catch (e) {}
    // no stored value -> infer from system
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
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
  const toggle = useCallback(() => {
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

  // If user changes system theme, keep existing choice unless they haven't explicitly chosen.
  // (Optional) we could listen to matchMedia events and respect system when no stored value existed.
  useEffect(() => {
    let mq;
    try {
      mq = window.matchMedia("(prefers-color-scheme: dark)");
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored && mq) {
        const handler = (e) => {
          setTheme(e.matches ? "dark" : "light");
        };
        mq.addEventListener
          ? mq.addEventListener("change", handler)
          : mq.addListener(handler);
        return () => {
          mq.removeEventListener
            ? mq.removeEventListener("change", handler)
            : mq.removeListener(handler);
        };
      }
    } catch (e) {}
    // nothing to cleanup if not attached
  }, []);

  // small accessible label
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={`
        inline-flex items-center gap-2 rounded-full px-3 py-1
        border transition-shadow duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
        bg-base-100 text-sm
      `}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <span
        className="flex items-center justify-center rounded-full p-1"
        style={{
          width: 28,
          height: 28,
          background: isDark
            ? "linear-gradient(135deg,#1f2937,#0f172a)"
            : "linear-gradient(135deg,#fff,#f3f4f6)",
          boxShadow: isDark
            ? "inset 0 -6px 18px rgba(0,0,0,0.4)"
            : "0 1px 2px rgba(0,0,0,0.06)",
          transition: "all 220ms ease",
        }}
      >
        {isDark ? (
          <Sun size={size} color="#FFD166" />
        ) : (
          <Moon size={size} color="#374151" />
        )}
      </span>

      <span className="hidden sm:inline montserrat-font font-medium">
        {isDark ? "Dark" : "Light"}
      </span>
    </button>
  );
}
