"use client";

import {
  BANNER_SOLID_PRESETS,
  BANNER_GRADIENT_PRESETS,
  BAND_SOLID_PRESETS,
  BAND_GRADIENT_PRESETS,
  isBannerGradient,
} from "@/lib/banner-bg";

/**
 * Solid + gradient background picker (same UX as hero banner slides).
 * @param {"banner"|"band"} [variant] — banner = dark navy presets; band = cyan/light for stats
 */
export default function CmsBgColorPicker({
  value = "",
  onChange,
  variant = "banner",
  defaultLabel = "Default",
}) {
  const solids =
    variant === "band" ? BAND_SOLID_PRESETS : BANNER_SOLID_PRESETS;
  const gradients =
    variant === "band" ? BAND_GRADIENT_PRESETS : BANNER_GRADIENT_PRESETS;
  const current = String(value || "");

  return (
    <div className="block text-sm">
      <p className="mt-0 mb-2 text-[11px] text-slate-500">
        Solids and themed gradients
        {variant === "band" ? " — best with white titles." : " for white text."}
      </p>

      <p className="mb-1.5 text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
        Solid
      </p>
      <div className="mb-3 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => onChange?.("")}
          className={`rounded-md border px-2 py-1 text-[11px] font-semibold ${
            !current
              ? "border-brand bg-brand/10 text-brand"
              : "border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300"
          }`}
        >
          {defaultLabel}
        </button>
        {solids.map((preset) => {
          const active =
            current.toLowerCase() === preset.value.toLowerCase();
          return (
            <button
              key={preset.value}
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

      <p className="mb-1.5 text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
        Gradients
      </p>
      <div className="mb-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {gradients.map((preset) => {
          const active =
            current.replace(/\s+/g, "") === preset.value.replace(/\s+/g, "");
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

      <div className="flex flex-wrap items-center gap-2">
        {!isBannerGradient(current) ? (
          <input
            type="color"
            className="size-9 cursor-pointer rounded border border-slate-200 bg-white p-0.5 dark:border-slate-700"
            value={
              /^#[0-9a-fA-F]{6}$/.test(current) ? current : "#5ec8e8"
            }
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
