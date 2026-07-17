"use client";

import {
  LIGHT_SOLID_PRESETS,
  LIGHT_GRADIENT_PRESETS,
  DARK_SOLID_PRESETS,
  DARK_GRADIENT_PRESETS,
  BAND_SOLID_PRESETS,
  BAND_GRADIENT_PRESETS,
  isBannerGradient,
} from "@/lib/banner-bg";

function PresetSolidRow({ presets, current, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {presets.map((preset) => {
        const active =
          current.toLowerCase() === String(preset.value).toLowerCase();
        return (
          <button
            key={`${preset.label}-${preset.value}`}
            type="button"
            title={preset.label}
            onClick={() => onChange?.(preset.value)}
            className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-semibold ${
              active
                ? "border-brand ring-2 ring-brand/25"
                : "border-slate-200 dark:border-slate-700"
            }`}
          >
            <span
              className="size-3.5 rounded-sm ring-1 ring-black/10"
              style={{ backgroundColor: preset.value }}
              aria-hidden
            />
            {preset.label}
          </button>
        );
      })}
    </div>
  );
}

function PresetGradientGrid({ presets, current, onChange }) {
  const normalized = current.replace(/\s+/g, "");
  return (
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
      {presets.map((preset) => {
        const active =
          normalized === String(preset.value).replace(/\s+/g, "");
        return (
          <button
            key={preset.label}
            type="button"
            title={preset.label}
            onClick={() => onChange?.(preset.value)}
            className={`flex flex-col overflow-hidden rounded-lg border text-left transition ${
              active
                ? "border-brand ring-2 ring-brand/25"
                : "border-slate-200 dark:border-slate-700"
            }`}
          >
            <span
              className="h-10 w-full"
              style={{ backgroundImage: preset.value }}
              aria-hidden
            />
            <span className="px-1.5 py-1 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
              {preset.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ToneSection({ title, hint, solids, gradients, current, onChange }) {
  return (
    <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
      <div className="mb-2">
        <p className="m-0 text-[11px] font-semibold tracking-wide text-slate-700 uppercase dark:text-slate-200">
          {title}
        </p>
        {hint ? (
          <p className="mt-0.5 mb-0 text-[11px] text-slate-500">{hint}</p>
        ) : null}
      </div>
      <p className="mb-1.5 text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
        Solids
      </p>
      <div className="mb-3">
        <PresetSolidRow
          presets={solids}
          current={current}
          onChange={onChange}
        />
      </div>
      <p className="mb-1.5 text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
        Gradients
      </p>
      <PresetGradientGrid
        presets={gradients}
        current={current}
        onChange={onChange}
      />
    </div>
  );
}

/**
 * Solid + gradient background picker, grouped for light vs dark editing.
 *
 * @param {"theme"|"banner"|"band"} [variant]
 *   - theme (default): Light + Dark categories
 *   - banner: dark-only (hero slides)
 *   - band: light/cyan-only (stats strip legacy)
 */
export default function CmsBgColorPicker({
  value = "",
  onChange,
  variant = "theme",
  defaultLabel = "Default",
}) {
  const current = String(value || "");
  const showLight = variant === "theme" || variant === "band";
  const showDark = variant === "theme" || variant === "banner";
  const showBoth = showLight && showDark;

  const lightSolids =
    variant === "band" ? BAND_SOLID_PRESETS : LIGHT_SOLID_PRESETS;
  const lightGradients =
    variant === "band" ? BAND_GRADIENT_PRESETS : LIGHT_GRADIENT_PRESETS;

  return (
    <div className="block space-y-3 text-sm">
      <p className="m-0 text-[11px] text-slate-500">
        {showBoth
          ? "Pick by light or dark look — section text should contrast with the bg."
          : variant === "band"
            ? "Light / bright bands — usually with white titles."
            : "Dark backgrounds — usually with white text."}
      </p>

      <button
        type="button"
        onClick={() => onChange?.("")}
        className={`rounded-md border px-2.5 py-1.5 text-[11px] font-semibold ${
          !current
            ? "border-brand bg-brand/10 text-brand"
            : "border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300"
        }`}
      >
        {defaultLabel}
      </button>

      {showLight ? (
        <ToneSection
          title="Light"
          hint="Soft / bright — works with dark text (or white on cyan)"
          solids={lightSolids}
          gradients={lightGradients}
          current={current}
          onChange={onChange}
        />
      ) : null}

      {showDark ? (
        <ToneSection
          title="Dark"
          hint="Deep tones — works with light / white text"
          solids={DARK_SOLID_PRESETS}
          gradients={DARK_GRADIENT_PRESETS}
          current={current}
          onChange={onChange}
        />
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        {!isBannerGradient(current) ? (
          <input
            type="color"
            className="size-9 cursor-pointer rounded border border-slate-200 bg-white p-0.5 dark:border-slate-700"
            value={/^#[0-9a-fA-F]{6}$/.test(current) ? current : "#5ec8e8"}
            onChange={(e) => onChange?.(e.target.value)}
            aria-label="Custom color"
          />
        ) : null}
        <input
          className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm outline-none focus:border-brand dark:border-slate-700 dark:bg-slate-900"
          placeholder="#5ec8e8 or linear-gradient(…)"
          value={current}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </div>
    </div>
  );
}
