"use client";

import { useState } from "react";
import {
  BUTTON_APPEARANCE_DEFAULT,
  BUTTON_APPEARANCE_FIELD_LABELS,
  BUTTON_APPEARANCE_FIELDS,
  BUTTON_APPEARANCE_PRESETS,
  BUTTON_CLASS_SUGGESTION_GROUPS,
  BUTTON_HOVER_SUGGESTION_GROUPS,
  buttonAppearanceSummary,
} from "@/lib/ui/button-class-catalog";
import type {
  ButtonAppearanceFieldsProps,
  AppearanceSelectProps,
  PresetCardProps,
} from "./types";
import type { CmsButtonData } from "@/components/ui/types";

const selectClass =
  "w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm outline-none focus:border-brand dark:border-slate-700 dark:bg-slate-900";

function AppearanceSelect({ field, value, onChange, group }: AppearanceSelectProps) {
  const label = BUTTON_APPEARANCE_FIELD_LABELS[field as keyof typeof BUTTON_APPEARANCE_FIELD_LABELS] || field;
  const current = String(value || "");
  const inList = group?.suggestions?.some((s) => s.value === current);
  const showCustom = current && !inList;
  const selectValue = showCustom ? "__custom__" : current;

  return (
    <label className="block min-w-0 text-sm">
      <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
        {label}
      </span>
      {group?.hint ? (
        <span className="mb-1 block text-[10px] text-slate-400">{group.hint}</span>
      ) : null}
      <select
        className={selectClass}
        value={selectValue}
        onChange={(e) => {
          const next = e.target.value;
          if (next === "__custom__") {
            onChange(current || "!bg-");
            return;
          }
          onChange(next);
        }}
      >
        {group?.suggestions?.map((s) => (
          <option key={s.value || "default"} value={s.value}>
            {s.label}
          </option>
        ))}
        <option value="__custom__">Custom class…</option>
      </select>
      {showCustom || selectValue === "__custom__" ? (
        <input
          className={`${selectClass} mt-1.5 font-mono text-xs`}
          value={current}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Custom class"
          spellCheck={false}
        />
      ) : null}
    </label>
  );
}

function PresetCard({ preset, active, onSelect }: PresetCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-xl border p-2.5 text-left transition ${
        active
          ? "border-brand bg-brand/5 ring-1 ring-brand/30"
          : "border-slate-200 bg-white hover:border-brand/30 dark:border-slate-700 dark:bg-slate-900"
      }`}
    >
      <span className="block text-xs font-semibold text-slate-800 dark:text-slate-100">
        {preset.label}
      </span>
      <span className="mt-0.5 block text-[10px] leading-snug text-slate-500 dark:text-slate-400">
        {preset.description}
      </span>
    </button>
  );
}

/**
 * CMS button colors — friendly presets + dropdowns (advanced hover optional).
 */
export default function ButtonAppearanceFields({
  value = {},
  onChange,
  onPatch,
}: ButtonAppearanceFieldsProps) {
  const v = (value || {}) as CmsButtonData;
  const summary = buttonAppearanceSummary(v);
  const hasCustom = Boolean(summary);
  const [open, setOpen] = useState(hasCustom);
  const [hoverOpen, setHoverOpen] = useState(
    BUTTON_HOVER_SUGGESTION_GROUPS.some((g) => String(v[g.field] || "").trim())
  );

  const activePresetId =
    BUTTON_APPEARANCE_PRESETS.find((p) =>
      BUTTON_APPEARANCE_FIELDS.every(
        (f) =>
          String(v[f as keyof CmsButtonData] || "") ===
          String(p.patch[f as keyof typeof p.patch] || "")
      )
    )?.id || (hasCustom ? "custom" : "default");

  function patch(next: Partial<CmsButtonData>) {
    if (onPatch) onPatch(next);
    else onChange?.({ ...v, ...next });
  }

  function setField(field: string, next: string) {
    patch({ [field]: next });
  }

  function applyPreset(preset: PresetCardProps["preset"]) {
    patch({ ...preset.patch });
    if (preset.id !== "default") setOpen(true);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 bg-slate-50/80 px-3 py-2.5 text-left transition hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-900"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="min-w-0">
          <span className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
            Customize colors
            <span className="ml-1.5 font-normal text-slate-400">(optional)</span>
          </span>
          {!open && summary ? (
            <span className="mt-0.5 block truncate text-[10px] text-brand">
              {summary}
            </span>
          ) : !open ? (
            <span className="mt-0.5 block text-[10px] text-slate-400">
              Override the button style when needed
            </span>
          ) : null}
        </span>
        <span
          className={`shrink-0 text-slate-400 transition ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          ▾
        </span>
      </button>

      {open ? (
        <div className="space-y-4 border-t border-slate-200 p-3 dark:border-slate-700">
          <div>
            <p className="m-0 mb-2 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
              Quick look
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              {BUTTON_APPEARANCE_PRESETS.map((preset) => (
                <PresetCard
                  key={preset.id}
                  preset={preset}
                  active={activePresetId === preset.id}
                  onSelect={() => applyPreset(preset)}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="m-0 mb-2 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
              Button colors
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {BUTTON_CLASS_SUGGESTION_GROUPS.map((g) => (
                <AppearanceSelect
                  key={g.field}
                  field={g.field}
                  group={g}
                  value={String(v[g.field as keyof CmsButtonData] ?? "")}
                  onChange={(next) => setField(g.field, next)}
                />
              ))}
            </div>
          </div>

          <div>
            <button
              type="button"
              className="flex w-full items-center justify-between text-left text-xs font-semibold text-slate-600 dark:text-slate-300"
              onClick={() => setHoverOpen((o) => !o)}
              aria-expanded={hoverOpen}
            >
              <span>Hover colors (optional)</span>
              <span className={`text-slate-400 transition ${hoverOpen ? "rotate-180" : ""}`}>
                ▾
              </span>
            </button>
            {hoverOpen ? (
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {BUTTON_HOVER_SUGGESTION_GROUPS.map((g) => (
                  <AppearanceSelect
                    key={g.field}
                    field={g.field}
                    group={g}
                    value={String(v[g.field as keyof CmsButtonData] ?? "")}
                    onChange={(next) => setField(g.field, next)}
                  />
                ))}
              </div>
            ) : null}
          </div>

          {hasCustom ? (
            <button
              type="button"
              className="text-xs font-semibold text-slate-500 underline-offset-2 hover:text-rose-600 hover:underline"
              onClick={() => applyPreset(BUTTON_APPEARANCE_PRESETS[0])}
            >
              Reset to style default
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
