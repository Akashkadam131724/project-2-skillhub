"use client";

import { useCallback, useEffect, useState } from "react";
import {
  devLayoutRulerDefaultVisible,
  isDevLayoutRulerAvailable,
} from "@/lib/layout/dev-layout-ruler-env";
import { SECTION_LAYOUT_MAX_WIDTH_PX } from "@/lib/layout/section-layout-tokens";
import "./dev-layout-ruler.css";

const STORAGE_KEY = "skillhub-dev-layout-ruler";

function readStoredEnabled() {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (value === "1") return true;
    if (value === "0") return false;
    return null;
  } catch {
    return null;
  }
}

function writeStoredEnabled(enabled: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
  } catch {
    /* ignore */
  }
}

function isToggleShortcut(event: KeyboardEvent) {
  if (!event.shiftKey) return false;
  const key = event.key.toLowerCase();
  if (key !== "g") return false;
  return event.altKey || event.metaKey || event.ctrlKey;
}

/**
 * Dev overlay: 1440px rail, content gutters, center line, 12-col grid, 4rem rows.
 * Requires NEXT_PUBLIC_DEV_LAYOUT_RULER=true in .env.local
 */
export default function DevLayoutRuler() {
  const [enabled, setEnabled] = useState(() => devLayoutRulerDefaultVisible());
  const available = isDevLayoutRulerAvailable();

  useEffect(() => {
    if (!available) return;
    const stored = readStoredEnabled();
    if (stored !== null) setEnabled(stored);
    else setEnabled(devLayoutRulerDefaultVisible());
  }, [available]);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      writeStoredEnabled(next);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!available) return undefined;

    function onKeyDown(event: KeyboardEvent) {
      if (!isToggleShortcut(event)) return;
      event.preventDefault();
      toggle();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [available, toggle]);

  if (!available) return null;

  if (!enabled) {
    return (
      <button
        type="button"
        onClick={toggle}
        className="dev-layout-ruler__toggle"
        aria-label="Show layout guides"
        title="Show layout guides (Alt+Shift+G)"
      >
        Layout guides
      </button>
    );
  }

  return (
    <>
      <div className="dev-layout-ruler" aria-hidden data-dev-layout-ruler="">
        <div className="dev-layout-ruler__rows" />
        <div className="dev-layout-ruler__line dev-layout-ruler__line--rail-left" />
        <div className="dev-layout-ruler__line dev-layout-ruler__line--rail-right" />
        <div className="dev-layout-ruler__line dev-layout-ruler__line--content-left" />
        <div className="dev-layout-ruler__line dev-layout-ruler__line--content-right" />
        <div className="dev-layout-ruler__line dev-layout-ruler__line--center" />
        <div className="dev-layout-ruler__columns">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="dev-layout-ruler__col" />
          ))}
        </div>
        <span className="dev-layout-ruler__label dev-layout-ruler__label--rail-left">
          rail {SECTION_LAYOUT_MAX_WIDTH_PX}
        </span>
        <span className="dev-layout-ruler__label dev-layout-ruler__label--rail-right">
          rail {SECTION_LAYOUT_MAX_WIDTH_PX}
        </span>
        <span className="dev-layout-ruler__label dev-layout-ruler__label--content-left">
          content
        </span>
        <span className="dev-layout-ruler__label dev-layout-ruler__label--content-right">
          content
        </span>
      </div>
      <button
        type="button"
        onClick={toggle}
        className="dev-layout-ruler__hud dev-layout-ruler__hud--clickable"
        aria-label="Hide layout guides"
        title="Hide layout guides (Alt+Shift+G)"
      >
        Layout guides on
        <span aria-hidden>·</span>
        click or <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>G</kbd>
      </button>
    </>
  );
}
