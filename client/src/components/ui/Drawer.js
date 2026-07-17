"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const SIZE_WIDTH = {
  sm: "w-[min(420px,90%)]",
  md: "w-[min(520px,92%)]",
  lg: "w-[min(640px,94%)]",
  xl: "w-[min(800px,96%)]",
  "2xl": "w-[min(960px,97%)]",
  full: "w-[min(1100px,98%)]",
};

const PCT_WIDTH = {
  50: "w-[50%]",
  70: "w-[70%]",
  75: "w-[75%]",
  100: "w-full",
};

const WIDTH_PRESETS = [50, 70, 100];
const STORAGE_KEY = "cms-drawer-width-pct";

function readStoredWidth() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const n = Number(raw);
    return WIDTH_PRESETS.includes(n) ? n : null;
  } catch {
    return null;
  }
}

function widthClassFor(size, pct) {
  if (pct && PCT_WIDTH[pct]) return PCT_WIDTH[pct];
  return SIZE_WIDTH[size] || SIZE_WIDTH.sm;
}

/**
 * @param {object} props
 * @param {boolean} [props.widthControl] — show 50/70/100% width toggles (CMS edit drawers)
 * @param {50|70|100} [props.defaultWidthPct] — initial % when widthControl is on
 */
export default function Drawer({
  open,
  onClose,
  title,
  children,
  side = "left",
  /** sm: 420 · md: 520 · lg: 640 · xl: 800 · 2xl: 960 · full: 1100 */
  size = "sm",
  widthControl = false,
  defaultWidthPct = 70,
}) {
  const [mounted, setMounted] = useState(false);
  const [widthPct, setWidthPct] = useState(() =>
    widthControl ? readStoredWidth() || defaultWidthPct : null
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || !widthControl) return;
    const stored = readStoredWidth();
    if (stored) setWidthPct(stored);
  }, [open, widthControl]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  const sideClass =
    side === "right" ? "right-0 border-l" : "left-0 border-r";

  const activePct = widthControl ? widthPct || defaultWidthPct : null;
  const widthClass = widthClassFor(size, activePct);

  function setPct(n) {
    setWidthPct(n);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(n));
    } catch {
      /* ignore */
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        aria-label="Close drawer"
        className="absolute inset-0 border-0 bg-ink/45"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`absolute top-0 ${sideClass} flex h-full ${widthClass} max-w-full flex-col border-slate-200 bg-white shadow-2xl transition-[width] duration-200 dark:border-slate-700 dark:bg-slate-950`}
      >
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <h2 className="m-0 min-w-0 flex-1 truncate text-lg font-bold text-ink dark:text-white">
            {title}
          </h2>

          {widthControl ? (
            <div
              className="inline-flex shrink-0 items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-900"
              role="group"
              aria-label="Drawer width"
            >
              {WIDTH_PRESETS.map((n) => {
                const active = activePct === n;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPct(n)}
                    className={`cursor-pointer rounded-md border-0 px-2.5 py-1 text-xs font-semibold transition ${
                      active
                        ? "bg-white text-ink shadow-sm dark:bg-slate-700 dark:text-white"
                        : "bg-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                    aria-pressed={active}
                    title={`${n}% width`}
                  >
                    {n}%
                  </button>
                );
              })}
            </div>
          ) : null}

          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-xl text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
      </aside>
    </div>,
    document.body
  );
}

export function HamburgerButton({ onClick, label = "Open menu" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex size-10 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-slate-200/80 bg-white/70 p-0 text-ink transition hover:border-ink/20 hover:bg-white hover:text-brand dark:border-slate-700 dark:bg-slate-900/70 dark:text-white dark:hover:bg-slate-900"
    >
      <span className="block h-0.5 w-[1.15rem] rounded-full bg-current" />
      <span className="block h-0.5 w-[1.15rem] rounded-full bg-current" />
      <span className="block h-0.5 w-[1.15rem] rounded-full bg-current" />
    </button>
  );
}
