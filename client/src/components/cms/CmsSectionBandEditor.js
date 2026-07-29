"use client";

import { useMemo } from "react";
import CmsBgColorPicker from "@/components/cms/CmsBgColorPicker";
import {
  SECTION_BAND_PRIORITY_LINES,
  activeBandSummary,
  effectiveBandThemeInfo,
  effectiveBandToneForDraft,
} from "@/lib/section-band-cms";
import { mediaUrl, uploadCmsImage } from "@/lib/cms-api";
import { mediaAlt } from "@/lib/media-alt";
import { isBannerGradient } from "@/lib/banner-bg";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm outline-none focus:border-brand dark:border-slate-700 dark:bg-slate-900";

function bandPreviewStyle(draft, themeInfo) {
  if (draft.bgImg) return null;
  if (draft.bgColor) {
    const c = draft.bgColor.trim();
    if (isBannerGradient(c)) {
      return { backgroundImage: c };
    }
    return { backgroundColor: c };
  }
  if (themeInfo.defaultBg === "transparent") {
    return {
      background:
        "repeating-linear-gradient(-45deg, #e2e8f0 0, #e2e8f0 8px, #f8fafc 8px, #f8fafc 16px)",
    };
  }
  return { backgroundColor: themeInfo.defaultBg };
}

/**
 * Unified section band editor — background image and color.
 */
export default function CmsSectionBandEditor({
  draft,
  onChange,
  showBgImage = true,
  showBgColor = true,
  bgFieldsLocked = false,
  bgLockedMessage = "",
  inheritedSurfaceTone,
  pageSurfaceMode = "alternating",
  pageInk = "",
  saving = false,
  onSubmit,
  onCancel,
  saveLabel = "Save",
}) {
  const set = (patch) => onChange({ ...draft, ...patch });

  const themeInfo = useMemo(
    () =>
      effectiveBandThemeInfo(draft, {
        inheritedSurfaceTone,
        pageSurfaceMode,
        pageInk,
      }),
    [draft, inheritedSurfaceTone, pageSurfaceMode, pageInk]
  );

  const bandTone = effectiveBandToneForDraft(draft, inheritedSurfaceTone);
  const previewStyle = bandPreviewStyle(draft, themeInfo);
  const customBgActive = Boolean(draft.bgImg || draft.bgColor?.trim());
  const sampleTitleClass = draft.bgImg
    ? "relative m-0 text-[11px] font-semibold text-white drop-shadow-sm"
    : "relative m-0 text-[11px] font-semibold text-[var(--band-fg)]";
  const sampleMutedClass = draft.bgImg
    ? "relative m-0 mt-0.5 text-[10px] text-white/80 drop-shadow-sm"
    : "relative m-0 mt-0.5 text-[10px] text-[var(--band-muted)]";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-3 text-xs leading-relaxed text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300">
        <p className="m-0 font-semibold text-slate-800 dark:text-slate-100">
          Priority (top wins for the band look)
        </p>
        <ol className="mb-0 mt-2 list-decimal space-y-1 pl-4">
          {SECTION_BAND_PRIORITY_LINES.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
        <p className="mb-0 mt-3 text-[11px] font-medium text-slate-500 dark:text-slate-400">
          Active: {activeBandSummary(draft)}
        </p>
        <p className="mb-0 mt-2 text-[10px] text-slate-400">
          Light/dark bands and surfaces are set under{" "}
          <strong>Page settings → Theme</strong> (site, template, or this page).
        </p>
      </div>

      <div
        className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700"
        data-section-theme={bandTone}
      >
        <div
          className="section-band-bg relative flex min-h-[4.5rem] flex-col justify-end px-3 py-2.5"
          style={previewStyle || undefined}
        >
          {draft.bgImg ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mediaUrl(draft.bgImg)}
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-90"
              aria-hidden
            />
          ) : null}
          <p className={sampleTitleClass}>Band preview</p>
          <p className={sampleMutedClass}>Sample text on this band</p>
        </div>
        <div className="border-t border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
          <p className="m-0 text-xs font-semibold text-slate-800 dark:text-slate-100">
            {themeInfo.title}
          </p>
          <p className="m-0 mt-0.5 text-[11px] text-slate-500">{themeInfo.detail}</p>
        </div>
      </div>

      {showBgImage ? (
        <fieldset
          className="space-y-2 rounded-lg border border-slate-200 p-3 dark:border-slate-700"
          disabled={bgFieldsLocked || saving}
        >
          <legend className="px-1 text-sm font-medium text-slate-700 dark:text-slate-200">
            Background image
          </legend>
          {bgFieldsLocked && bgLockedMessage ? (
            <p className="m-0 text-xs text-amber-800 dark:text-amber-200">
              {bgLockedMessage}
            </p>
          ) : null}
          {draft.bgImg ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mediaUrl(draft.bgImg)}
              alt={mediaAlt("Background", "Preview")}
              className="h-28 w-full rounded-lg object-cover"
            />
          ) : null}
          <input
            className={inputClass}
            value={draft.bgImg}
            onChange={(e) => set({ bgImg: e.target.value })}
            placeholder="/uploads/… or https://…"
            disabled={bgFieldsLocked}
          />
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="block w-full text-xs"
            disabled={bgFieldsLocked}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file || bgFieldsLocked) return;
              const dataUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject(new Error("Could not read file"));
                reader.readAsDataURL(file);
              });
              const res = await uploadCmsImage(dataUrl, "sections");
              set({ bgImg: res.data?.url || "" });
            }}
          />
          {draft.bgImg ? (
            <button
              type="button"
              className="text-xs font-semibold text-rose-600"
              disabled={bgFieldsLocked}
              onClick={() => set({ bgImg: "" })}
            >
              Remove image
            </button>
          ) : null}
        </fieldset>
      ) : null}

      {showBgColor ? (
        <fieldset
          className="space-y-2 rounded-lg border border-slate-200 p-3 dark:border-slate-700"
          disabled={bgFieldsLocked || saving}
        >
          <legend className="px-1 text-sm font-medium text-slate-700 dark:text-slate-200">
            Section background color
            <span className="ml-1 font-normal text-slate-500">
              (overrides page surfaces)
            </span>
          </legend>
          {bgFieldsLocked && bgLockedMessage ? (
            <p className="m-0 text-xs text-amber-800 dark:text-amber-200">
              {bgLockedMessage}
            </p>
          ) : null}
          <CmsBgColorPicker
            value={draft.bgColor}
            onChange={(v) => set({ bgColor: v })}
            variant="theme"
            toneFilter={bandTone}
            defaultLabel="None (use page / theme default)"
          />
          {draft.bgColor ? (
            <button
              type="button"
              className="text-xs font-semibold text-rose-600"
              disabled={bgFieldsLocked}
              onClick={() => set({ bgColor: "" })}
            >
              Clear color
            </button>
          ) : null}
        </fieldset>
      ) : null}

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center rounded-lg border-0 bg-brand px-3 py-2 text-sm font-semibold text-white hover:bg-brand-hover disabled:opacity-60"
        >
          {saving ? "Saving…" : saveLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
