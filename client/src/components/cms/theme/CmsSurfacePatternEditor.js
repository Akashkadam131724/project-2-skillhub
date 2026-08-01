"use client";

import { useMemo } from "react";
import { inputClass, btnSecondary } from "@/components/cms/admin/CmsUi";
import {
  defaultSurfacePattern,
  normalizeSurfacePattern,
  resolveSurfacePattern,
  surfacePatternLabel,
} from "@/lib/theme";

const LAYOUT_OPTIONS = [
  {
    value: "cycle",
    label: "Repeat sequence",
    hint: "Cycle through your band colors on each section.",
  },
  {
    value: "solid",
    label: "One color",
    hint: "Same band color on every section.",
  },
  {
    value: "transparent",
    label: "Transparent",
    hint: "No band fill — page background shows through.",
  },
];

const QUICK_COLORS = [
  { label: "White", bg: "#ffffff" },
  { label: "Grey", bg: "#f1f5f9" },
  { label: "Sky", bg: "#eef6fc" },
  { label: "Mint", bg: "#eef9f4" },
  { label: "Lavender", bg: "#f5f3ff" },
  { label: "Charcoal", bg: "#0f172a", fg: "rgba(255,255,255,0.92)" },
  { label: "Brand ink", bg: "var(--ink)" },
];

function newBandId() {
  return `band_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function swatchStyle(bg) {
  const value = String(bg || "").trim();
  if (!value) {
    return {
      background:
        "repeating-linear-gradient(-45deg, #e2e8f0 0, #e2e8f0 6px, #f8fafc 6px, #f8fafc 12px)",
    };
  }
  if (value.includes("gradient(")) {
    return { backgroundImage: value, backgroundColor: "#f1f5f9" };
  }
  return { backgroundColor: value };
}

function BandRow({ band, index, total, onChange, onRemove, onMove }) {
  const hexFallback =
    band.bg?.startsWith("#") && band.bg.length >= 7 ? band.bg : "#ffffff";

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 p-2 dark:border-slate-700">
      <span className="w-5 text-center text-[10px] font-bold text-slate-400">
        {index + 1}
      </span>
      <span
        className="size-8 shrink-0 rounded-md ring-1 ring-black/10"
        style={swatchStyle(band.bg)}
        aria-hidden
      />
      <input
        className={`${inputClass} min-w-[6rem] flex-1`}
        value={band.label || ""}
        placeholder="Label"
        onChange={(e) => onChange({ ...band, label: e.target.value })}
      />
      <input
        type="color"
        className="h-9 w-10 cursor-pointer rounded border border-slate-300 bg-white p-0.5 dark:border-slate-600"
        value={hexFallback}
        onChange={(e) => onChange({ ...band, bg: e.target.value })}
        title="Pick color"
      />
      <input
        className={`${inputClass} min-w-[7rem] flex-1 font-mono text-[11px]`}
        value={band.bg || ""}
        placeholder="#ffffff or gradient()"
        onChange={(e) => onChange({ ...band, bg: e.target.value })}
      />
      <div className="flex gap-1">
        <button
          type="button"
          className={btnSecondary}
          disabled={index === 0}
          onClick={() => onMove(index, index - 1)}
          title="Move up"
        >
          ↑
        </button>
        <button
          type="button"
          className={btnSecondary}
          disabled={index >= total - 1}
          onClick={() => onMove(index, index + 1)}
          title="Move down"
        >
          ↓
        </button>
        <button
          type="button"
          className={btnSecondary}
          onClick={onRemove}
          title="Remove band"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

/**
 * Visual builder for `surface_pattern` — arbitrary band colors, no code changes.
 */
export default function CmsSurfacePatternEditor({
  value,
  onChange,
  inheritedTheme = null,
  isPage = false,
  onInherit,
}) {
  const inheritedPattern = useMemo(
    () => resolveSurfacePattern(inheritedTheme || {}),
    [inheritedTheme]
  );

  const editing = value != null;
  const pattern = normalizeSurfacePattern(
    editing ? value : inheritedPattern || defaultSurfacePattern()
  );

  function commit(next) {
    onChange?.(normalizeSurfacePattern(next));
  }

  function setLayout(layout) {
    if (layout === "transparent") {
      commit({ layout: "transparent", bands: [] });
      return;
    }
    if (layout === "solid") {
      commit({
        layout: "solid",
        bands: pattern.bands.length ? [pattern.bands[0]] : defaultSurfacePattern().bands.slice(0, 1),
      });
      return;
    }
    commit({
      layout: "cycle",
      bands: pattern.bands.length
        ? pattern.bands
        : defaultSurfacePattern().bands,
    });
  }

  function updateBand(index, band) {
    const bands = [...pattern.bands];
    bands[index] = band;
    commit({ ...pattern, bands });
  }

  function removeBand(index) {
    const bands = pattern.bands.filter((_, i) => i !== index);
    commit({ ...pattern, bands });
  }

  function moveBand(from, to) {
    if (to < 0 || to >= pattern.bands.length) return;
    const bands = [...pattern.bands];
    const [item] = bands.splice(from, 1);
    bands.splice(to, 0, item);
    commit({ ...pattern, bands });
  }

  function addBand(preset) {
    const bands = [
      ...pattern.bands,
      {
        id: newBandId(),
        label: preset?.label || `Band ${pattern.bands.length + 1}`,
        bg: preset?.bg || "#ffffff",
        fg: preset?.fg || "",
      },
    ];
    commit({ ...pattern, layout: pattern.layout === "solid" ? "cycle" : pattern.layout, bands });
  }

  const previewLabel = surfacePatternLabel(pattern);

  return (
    <div className="space-y-3">
      {isPage ? (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onInherit?.()}
            className={`rounded-md border px-2.5 py-1.5 text-[11px] font-semibold ${
              !editing
                ? "border-brand bg-brand/10 text-brand"
                : "border-slate-200 text-slate-600 dark:border-slate-700"
            }`}
          >
            Inherit
          </button>
          {!editing ? (
            <span className="text-[11px] text-slate-500">
              Using {previewLabel.toLowerCase()} from parent theme
            </span>
          ) : (
            <button
              type="button"
              className="text-[11px] font-semibold text-slate-500 underline-offset-2 hover:text-brand hover:underline"
              onClick={() => onInherit?.()}
            >
              Reset to inherit
            </button>
          )}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-1.5">
        {LAYOUT_OPTIONS.map((opt) => {
          const active = pattern.layout === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              title={opt.hint}
              onClick={() => setLayout(opt.value)}
              className={`rounded-md border px-2.5 py-1.5 text-[11px] font-semibold ${
                active
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-slate-200 text-slate-600 dark:border-slate-700"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {pattern.layout !== "transparent" ? (
        <>
          <div className="flex flex-wrap gap-1">
            {pattern.bands.map((band, index) => (
              <span
                key={band.id || index}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2 py-0.5 text-[10px] font-semibold dark:border-slate-700"
                title={band.label}
              >
                <span
                  className="size-3 rounded-full ring-1 ring-black/10"
                  style={swatchStyle(band.bg)}
                  aria-hidden
                />
                {band.label || `Band ${index + 1}`}
              </span>
            ))}
          </div>

          <p className="m-0 text-[10px] text-slate-500">{previewLabel}</p>

          <div className="space-y-2">
            {(pattern.layout === "solid" ? pattern.bands.slice(0, 1) : pattern.bands).map(
              (band, index) => (
                <BandRow
                  key={band.id || index}
                  band={band}
                  index={index}
                  total={pattern.bands.length}
                  onChange={(next) => updateBand(index, next)}
                  onRemove={() => removeBand(index)}
                  onMove={moveBand}
                />
              )
            )}
          </div>

          {pattern.layout === "cycle" ? (
            <div className="space-y-2">
              <p className="m-0 text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                Add band color
              </p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_COLORS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => addBand(preset)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-2 py-1 text-[11px] font-semibold dark:border-slate-700"
                  >
                    <span
                      className="size-3 rounded-sm ring-1 ring-black/10"
                      style={swatchStyle(preset.bg)}
                      aria-hidden
                    />
                    {preset.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => addBand()}
                  className="rounded-md border border-dashed border-slate-300 px-2 py-1 text-[11px] font-semibold text-slate-600 dark:border-slate-600"
                >
                  + Custom color
                </button>
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <p className="m-0 text-[11px] text-slate-500">
          Sections have no default band fill. Use page background or per-section
          band overrides.
        </p>
      )}
    </div>
  );
}
