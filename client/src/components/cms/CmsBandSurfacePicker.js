"use client";

import { useMemo } from "react";
import {
  SECTION_BAND_SURFACE_GROUPS,
  BAND_SURFACE_PAGE_DEFAULT,
  bandSurfaceSwatchStyle,
  matchBandSurfacePreset,
  normalizeBandBgValue,
} from "@/lib/section-band-surfaces";

function isActivePreset(preset, bgColor) {
  if (preset.id === BAND_SURFACE_PAGE_DEFAULT.id) {
    return !String(bgColor || "").trim();
  }
  return (
    normalizeBandBgValue(preset.bg) === normalizeBandBgValue(bgColor)
  );
}

function groupsForToneRole(tone, role) {
  const prefix = tone === "dark" ? "dark" : "light";
  if (role === "alternate") {
    return SECTION_BAND_SURFACE_GROUPS.filter(
      (g) => g.id === `${prefix}_grad_alt`
    );
  }
  if (role === "best") {
    return SECTION_BAND_SURFACE_GROUPS.filter((g) =>
      [`${prefix}_solids`, `${prefix}_grad_best`].includes(g.id)
    );
  }
  if (tone === "light" || tone === "dark") {
    return SECTION_BAND_SURFACE_GROUPS.filter((g) => g.tone === tone);
  }
  return SECTION_BAND_SURFACE_GROUPS;
}

/**
 * Visual grid of named band surfaces (soft mint, ink, gradients, …).
 */
export default function CmsBandSurfacePicker({
  bgColor = "",
  onSelect,
  disabled = false,
  tone = null,
  role = "all",
  compact = false,
  /** @deprecated use tone + role */
  variant = null,
}) {
  const customActive =
    Boolean(String(bgColor || "").trim()) && !matchBandSurfacePreset(bgColor);

  const groups = useMemo(() => {
    if (variant === "primary") {
      return SECTION_BAND_SURFACE_GROUPS.filter((g) =>
        ["light_solids", "light_grad_best", "dark_solids", "dark_grad_best"].includes(
          g.id
        )
      );
    }
    if (variant === "alternate") {
      return SECTION_BAND_SURFACE_GROUPS.filter((g) =>
        ["light_grad_alt", "dark_grad_alt"].includes(g.id)
      );
    }
    return groupsForToneRole(tone, role);
  }, [tone, role, variant]);

  return (
    <div className="space-y-3">
      {!compact ? (
        <p className="m-0 text-[11px] text-slate-500">
          Pick a band surface — sets background and light/dark text on the band.
        </p>
      ) : null}
      {customActive ? (
        <p className="m-0 rounded-md border border-dashed border-brand/40 bg-brand/5 px-2 py-1.5 text-[11px] font-medium text-brand">
          Custom value — pick a preset or clear via System default.
        </p>
      ) : null}
      {groups.map((group) => (
        <div key={group.id || group.title}>
          {!compact ? (
            <>
              <p className="mb-1 mt-0 text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
                {group.title}
              </p>
              {group.description ? (
                <p className="mb-2 mt-0 text-[10px] leading-snug text-slate-400">
                  {group.description}
                </p>
              ) : null}
            </>
          ) : null}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {group.presets.map((preset) => {
              const active = isActivePreset(preset, bgColor);
              return (
                <button
                  key={preset.id}
                  type="button"
                  disabled={disabled}
                  title={preset.hint || preset.label}
                  onClick={() => onSelect?.(preset)}
                  className={`flex flex-col overflow-hidden rounded-xl border text-left transition ${
                    active
                      ? "border-brand ring-2 ring-brand/25"
                      : "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
                  } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
                >
                  <span
                    className="h-11 w-full border-b border-slate-200/80 dark:border-slate-700/80"
                    style={bandSurfaceSwatchStyle(preset.bg)}
                    aria-hidden
                  />
                  <span className="px-2 py-1.5 text-[10px] leading-tight font-semibold text-slate-700 dark:text-slate-200">
                    {preset.label}
                  </span>
                  {!compact && preset.hint ? (
                    <span className="line-clamp-2 px-2 pb-1.5 text-[9px] leading-snug text-slate-500">
                      {preset.hint}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
