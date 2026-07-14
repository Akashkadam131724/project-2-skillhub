"use client";

import { useEffect, useRef, useState } from "react";
import {
  THEMES,
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  isThemeId,
  applyTheme,
  getTheme,
} from "@/lib/themes";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    let stored = localStorage.getItem(THEME_STORAGE_KEY);
    // Migrate away from old light/dark toggle
    if (!isThemeId(stored)) {
      localStorage.removeItem("skillhub-theme");
      localStorage.removeItem("netcom-theme");
      stored = DEFAULT_THEME;
    }
    applyTheme(stored);
    setTheme(stored);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    function onDoc(e) {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function pickTheme(id) {
    applyTheme(id);
    setTheme(id);
    localStorage.setItem(THEME_STORAGE_KEY, id);
    setOpen(false);
  }

  const current = getTheme(theme);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 text-slate-700 transition hover:border-brand hover:bg-brand-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        aria-label="Change color theme"
        aria-expanded={open}
        title={mounted ? `Theme: ${current.label}` : "Color theme"}
      >
        <span
          className="size-5 rounded-full border border-black/10 shadow-sm"
          style={{ backgroundColor: mounted ? current.brand : "var(--brand)" }}
          aria-hidden
        />
        <span className="hidden text-xs font-semibold sm:inline">
          {mounted ? current.label : "Theme"}
        </span>
        <svg
          className="size-3.5 opacity-60"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open ? (
        <div
          className="absolute top-full right-0 z-50 mt-2 max-h-72 w-48 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
          role="listbox"
          aria-label="Color themes"
        >
          {THEMES.map((t) => {
            const active = t.id === theme;
            return (
              <button
                key={t.id}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => pickTheme(t.id)}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition ${
                  active
                    ? "bg-brand-soft font-semibold text-ink"
                    : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                <span
                  className="size-5 shrink-0 rounded-full border border-black/10 shadow-sm"
                  style={{ backgroundColor: t.brand }}
                  aria-hidden
                />
                <span className="flex-1">{t.label}</span>
                {active ? (
                  <span className="text-xs font-bold text-brand">Active</span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
