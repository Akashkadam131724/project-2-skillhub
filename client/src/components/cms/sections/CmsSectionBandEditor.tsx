"use client";

import Link from "next/link";
import type { CmsSectionBandEditorProps } from "./types";

/**
 * Section band / per-section bg editors are retired.
 * Page look comes from Theme → Colors + Surface only.
 * Kept as a stub so old drawer routes fail closed with guidance.
 */
export default function CmsSectionBandEditor({
  onCancel,
}: CmsSectionBandEditorProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200">
        <p className="m-0 font-semibold text-slate-900 dark:text-slate-100">
          Section bands removed
        </p>
        <p className="mt-2 mb-0 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          Per-section background and band theme are no longer edited here. Use{" "}
          <strong>Theme → Colors</strong> and <strong>Theme → Surface</strong>{" "}
          for page stripes. Dark sections keep their built-in ink background.
        </p>
        <p className="mt-3 mb-0">
          <Link
            href="/cms/site-theme"
            className="text-sm font-semibold text-brand no-underline hover:underline"
          >
            Open site theme →
          </Link>
        </p>
      </div>
      {onCancel ? (
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          Close
        </button>
      ) : null}
    </div>
  );
}
