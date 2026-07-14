"use client";

import { useEffect, useState } from "react";
import { mediaUrl } from "@/lib/cms-api";

export function CmsHeading({ title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="m-0 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 mb-0 text-sm text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function CmsPanel({ title, children, actions, className = "" }) {
  return (
    <section
      className={`rounded-xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-950 ${className}`}
    >
      {(title || actions) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          {title ? (
            <h2 className="m-0 text-sm font-semibold tracking-wide text-slate-800 uppercase dark:text-slate-100">
              {title}
            </h2>
          ) : (
            <span />
          )}
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatusBadge({ active, labelOn = "On", labelOff = "Off" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
        active
          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
      }`}
    >
      {active ? labelOn : labelOff}
    </span>
  );
}

export function Field({ label, children, hint, className = "" }) {
  return (
    <label className={`flex flex-col gap-1.5 text-sm ${className}`.trim()}>
      <span className="font-medium text-slate-700 dark:text-slate-200">{label}</span>
      {children}
      {hint ? (
        <span className="text-xs text-slate-500 dark:text-slate-400">{hint}</span>
      ) : null}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white";

export const btnPrimary =
  "inline-flex items-center justify-center rounded-lg bg-brand px-3.5 py-2 text-sm font-semibold text-white no-underline transition hover:bg-brand-hover disabled:opacity-50";

export const btnSecondary =
  "inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 no-underline transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800";

export const btnDanger =
  "inline-flex items-center justify-center rounded-lg border border-rose-300 bg-white px-3.5 py-2 text-sm font-semibold text-rose-700 no-underline transition hover:bg-rose-50 disabled:opacity-50 dark:border-rose-900 dark:bg-slate-900 dark:text-rose-300 dark:hover:bg-rose-950/40";

export function ErrorBanner({ error }) {
  if (!error) return null;
  return (
    <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
      {typeof error === "string" ? error : error.message || "Something went wrong"}
    </div>
  );
}

export function EmptyState({ message }) {
  return (
    <p className="m-0 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
      {message}
    </p>
  );
}

/** CMS thumbnail — click opens full-size preview modal when an image exists */
export function SectionPreviewThumb({
  src,
  alt = "",
  className = "size-12",
  rounded = "rounded-md",
  expandable = true,
}) {
  const [open, setOpen] = useState(false);
  const url = mediaUrl(src);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!url) {
    return (
      <div
        className={`shrink-0 bg-slate-100 dark:bg-slate-800 ${rounded} ${className}`}
        title="No preview image"
        aria-hidden
      />
    );
  }

  return (
    <>
      <div
        tabIndex={expandable ? 0 : undefined}
        onClick={(e) => {
          if (!expandable) return;
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (!expandable) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }
        }}
        className={`shrink-0 overflow-hidden ${rounded} ${
          expandable ? "cursor-zoom-in" : ""
        }`}
        title={expandable ? "View full preview" : alt || "Section preview"}
        aria-label={
          expandable ? `View full preview${alt ? `: ${alt}` : ""}` : undefined
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={alt}
          className={`pointer-events-none block object-cover ${rounded} ${className}`}
        />
      </div>

      {open && expandable ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-8">
          <button
            type="button"
            aria-label="Close preview"
            className="absolute inset-0 border-0 bg-slate-950/75"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(false);
            }}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={alt || "Section preview"}
            className="relative z-[1] flex max-h-full max-w-full flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={alt || "Section preview"}
              className="max-h-[min(85vh,900px)] max-w-[min(92vw,1100px)] rounded-lg object-contain shadow-2xl"
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow hover:bg-slate-100"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

