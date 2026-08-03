"use client";

import CmsButtonsEditor from "@/components/cms/editors/CmsButtonsEditor";
import CmsRichTextEditor from "@/components/cms/editors/CmsRichTextEditor";
import {
  BANNER_SOLID_PRESETS,
  BANNER_GRADIENT_PRESETS,
  isBannerGradient,
} from "@/lib/theme/banner-bg";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm outline-none focus:border-brand dark:border-slate-700 dark:bg-slate-900";

function FieldLabel({ field }) {
  return (
    <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
      {field.label}
      {field.required ? (
        <span className="ml-0.5 text-rose-600" aria-hidden>
          *
        </span>
      ) : null}
    </span>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 mb-0 text-[11px] font-medium text-rose-600">{message}</p>;
}

function FieldHint({ field }) {
  if (!field.hint) return null;
  return <p className="mt-0 mb-1.5 text-[11px] text-slate-500">{field.hint}</p>;
}

/** Renders one item field from SECTION_ITEMS_CONFIG field def. */
export default function ItemFieldControl({
  field,
  item,
  itemKey,
  error,
  onChange,
  onButtonsChange,
  buttonsOpen,
  onToggleButtons,
}) {
  const value = item?.[field.key] ?? (field.type === "buttons" ? [] : "");
  const err = error || "";

  if (field.type === "richtext") {
    return (
      <div className="block text-sm">
        <FieldLabel field={field} />
        <FieldHint field={field} />
        <CmsRichTextEditor
          key={`${itemKey}-body`}
          value={value}
          onChange={(html) => onChange({ [field.key]: html })}
          placeholder={field.placeholder || `${field.label}…`}
        />
        <FieldError message={err} />
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <label className="block text-sm">
        <FieldLabel field={field} />
        <FieldHint field={field} />
        <textarea
          className={`${inputClass} min-h-[88px]`}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange({ [field.key]: e.target.value })}
        />
        <FieldError message={err} />
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <label className="block text-sm">
        <FieldLabel field={field} />
        <FieldHint field={field} />
        <select
          className={inputClass}
          value={value || ""}
          onChange={(e) => onChange({ [field.key]: e.target.value })}
        >
          <option value="">Select…</option>
          {(field.options || []).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <FieldError message={err} />
      </label>
    );
  }

  if (field.type === "radio") {
    return (
      <div className="block text-sm">
        <FieldLabel field={field} />
        <FieldHint field={field} />
        <div className="flex flex-wrap gap-1.5">
          {(field.options || []).map((opt) => {
            const active = String(value || "") === String(opt.value);
            return (
              <button
                key={`${opt.value}-${opt.label}`}
                type="button"
                onClick={() => onChange({ [field.key]: opt.value })}
                className={`rounded-md border px-2.5 py-1.5 text-[11px] font-semibold ${
                  active
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        <FieldError message={err} />
      </div>
    );
  }

  if (field.type === "bg_color") {
    return (
      <div className="block text-sm">
        <FieldLabel field={field} />
        <FieldHint field={field} />
        <p className="mt-0 mb-2 text-[11px] text-slate-500">
          Solids and themed gradients for white text — with or without an image.
        </p>
        <p className="mb-1.5 text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
          Solid
        </p>
        <div className="mb-3 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => onChange({ [field.key]: "" })}
            className={`rounded-md border px-2 py-1 text-[11px] font-semibold ${
              !value
                ? "border-brand bg-brand/10 text-brand"
                : "border-slate-200 text-slate-600 dark:border-slate-700"
            }`}
          >
            Default
          </button>
          {BANNER_SOLID_PRESETS.map((preset) => {
            const active =
              String(value || "").toLowerCase() ===
              preset.value.toLowerCase();
            return (
              <button
                key={preset.value}
                type="button"
                title={preset.label}
                onClick={() => onChange({ [field.key]: preset.value })}
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
          {BANNER_GRADIENT_PRESETS.map((preset) => {
            const active =
              String(value || "").replace(/\s+/g, "") ===
              preset.value.replace(/\s+/g, "");
            return (
              <button
                key={preset.label}
                type="button"
                title={preset.label}
                onClick={() => onChange({ [field.key]: preset.value })}
                className={`flex flex-col overflow-hidden rounded-lg border text-left ${
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
                <span className="px-2 py-1 text-[10px] font-semibold text-slate-700 dark:text-slate-200">
                  {preset.label}
                </span>
              </button>
            );
          })}
        </div>
        <label className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
            Custom
          </span>
          {!isBannerGradient(value) ? (
            <input
              type="color"
              value={
                /^#[0-9a-fA-F]{6}$/.test(String(value || ""))
                  ? value
                  : "#0b1f4d"
              }
              onChange={(e) => onChange({ [field.key]: e.target.value })}
              className="h-8 w-10 cursor-pointer rounded border border-slate-300 bg-white p-0.5 dark:border-slate-700"
              aria-label="Custom background color"
            />
          ) : null}
          <input
            className={`${inputClass} min-w-0 flex-1 font-mono text-xs`}
            placeholder={field.placeholder || "#0b1f4d or linear-gradient(…)"}
            value={value || ""}
            onChange={(e) => onChange({ [field.key]: e.target.value })}
          />
        </label>
        <FieldError message={err} />
      </div>
    );
  }

  if (field.type === "buttons") {
    const btnCount = Array.isArray(value)
      ? value.filter((b) => String(b?.label || "").trim()).length
      : 0;
    return (
      <div className="rounded-lg border border-slate-200 bg-white/70 p-2 dark:border-slate-700 dark:bg-slate-950/40">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left text-xs font-semibold text-slate-700 dark:text-slate-200"
          onClick={onToggleButtons}
        >
          <span>
            {field.label}
            {btnCount ? ` (${btnCount})` : ""}
            {field.required ? (
              <span className="ml-0.5 text-rose-600">*</span>
            ) : null}
          </span>
          <span className="text-slate-400">{buttonsOpen ? "▾" : "▸"}</span>
        </button>
        {buttonsOpen ? (
          <div className="mt-2">
            <CmsButtonsEditor
              value={Array.isArray(value) ? value : []}
              onChange={onButtonsChange}
            />
          </div>
        ) : null}
        <FieldError message={err} />
      </div>
    );
  }

  // text | url | image (and default)
  const placeholder =
    field.placeholder ||
    (field.type === "image"
      ? "https://… or /uploads/…"
      : field.type === "url"
        ? "/path or https://"
        : undefined);

  return (
    <label className="block text-sm">
      <FieldLabel field={field} />
      <FieldHint field={field} />
      <input
        className={inputClass}
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange({ [field.key]: e.target.value })}
      />
      <FieldError message={err} />
    </label>
  );
}
