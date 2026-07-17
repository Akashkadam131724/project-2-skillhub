"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

function TocList({ items, activeId, onNavigate, className = "" }) {
  return (
    <ol className={`mb-0 list-none space-y-1 p-0 ${className}`.trim()}>
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={onNavigate}
              className={`block rounded-lg px-2.5 py-2 text-sm leading-snug no-underline transition ${
                active
                  ? "bg-white font-semibold text-ink shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-950 dark:text-white dark:ring-slate-700"
                  : "text-slate-600 hover:bg-white/80 hover:text-ink dark:text-slate-300 dark:hover:bg-slate-950/70 dark:hover:text-white"
              }`}
            >
              {item.text}
            </a>
          </li>
        );
      })}
    </ol>
  );
}

/** Sticky left TOC on desktop; floating tooltip popover on mobile / tablet. */
export default function BlogTableOfContents({ items = [] }) {
  const [activeId, setActiveId] = useState(items[0]?.id || "");
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelId = useId();
  const rootRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!items.length) return undefined;

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    if (!headings.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0, 0.25, 0.5, 1],
      }
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    if (!open) return undefined;

    function onPointerDown(event) {
      if (rootRef.current?.contains(event.target)) return;
      setOpen(false);
    }

    function onKey(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!items.length) return null;

  const activeLabel =
    items.find((item) => item.id === activeId)?.text || "On this page";

  const mobilePopover = (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center p-4 lg:hidden"
    >
        <div className="pointer-events-auto relative max-w-[min(100%,30rem)]">
          {open ? (
            <div
              id={panelId}
              role="dialog"
              aria-label="Table of contents"
              className="absolute bottom-[calc(100%+0.65rem)] left-1/2 w-[min(92vw,30rem)] -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-950"
            >
            <div
              className="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 border-r border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950"
              aria-hidden
            />
            <p className="m-0 text-[11px] font-semibold tracking-[0.18em] text-brand uppercase">
              On this page
            </p>
            <div className="mt-3 max-h-[min(50vh,20rem)] overflow-y-auto">
              <TocList
                items={items}
                activeId={activeId}
                onNavigate={() => setOpen(false)}
              />
            </div>
          </div>
        ) : null}

        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex max-w-full items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-4 py-2.5 text-sm font-semibold text-ink shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-950/95 dark:text-white"
        >
          <span
            className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] text-white"
            aria-hidden
          >
            ≡
          </span>
          <span className="truncate">{open ? "Close" : activeLabel}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <nav
        aria-label="Table of contents"
        className="sticky top-24 hidden self-start rounded-[1.5rem] border border-slate-200/80 bg-slate-50/90 p-5 lg:block dark:border-slate-800 dark:bg-slate-900/70"
      >
        <p className="m-0 text-[11px] font-semibold tracking-[0.18em] text-brand uppercase">
          On this page
        </p>
        <TocList items={items} activeId={activeId} className="mt-4" />
      </nav>
      {mounted ? createPortal(mobilePopover, document.body) : null}
    </>
  );
}
