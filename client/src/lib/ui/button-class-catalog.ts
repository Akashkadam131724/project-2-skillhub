/**
 * Tailwind !-important class suggestions for CMS button appearance overrides.
 * Applied via cls_* fields on the button document → DsButton className.
 */

export const BUTTON_APPEARANCE_FIELDS = [
  "cls_bg",
  "cls_text",
  "cls_border",
  "cls_hover_bg",
  "cls_hover_text",
  "cls_hover_border",
];

export const BUTTON_APPEARANCE_FIELD_LABELS = {
  cls_bg: "Background",
  cls_text: "Text",
  cls_border: "Border",
  cls_hover_bg: "Background",
  cls_hover_text: "Text",
  cls_hover_border: "Border",
};

const DEFAULT_OPTION = { label: "Use button style default", value: "" };

function withDefault(suggestions: Array<{ label: string; value: string }>) {
  return [DEFAULT_OPTION, ...suggestions];
}

/** @type {{ id: string, field: string, label: string, hint?: string, suggestions: { label: string, value: string }[] }[]} */
export const BUTTON_CLASS_SUGGESTION_GROUPS = [
  {
    id: "bg",
    field: "cls_bg",
    label: "Background",
    hint: "Fill behind the label",
    suggestions: withDefault([
      { label: "Transparent", value: "!bg-transparent" },
      { label: "White", value: "!bg-white" },
      { label: "Brand blue", value: "!bg-brand" },
      { label: "Dark ink", value: "!bg-ink" },
      { label: "Soft white (10%)", value: "!bg-white/10" },
      { label: "Soft white (20%)", value: "!bg-white/20" },
    ]),
  },
  {
    id: "text",
    field: "cls_text",
    label: "Text",
    hint: "Label color",
    suggestions: withDefault([
      { label: "White", value: "!text-white" },
      { label: "Dark ink", value: "!text-ink" },
      { label: "Brand blue", value: "!text-brand" },
      { label: "Muted white", value: "!text-white/85" },
      { label: "Gray", value: "!text-slate-600" },
    ]),
  },
  {
    id: "border",
    field: "cls_border",
    label: "Border",
    hint: "Outline around the button",
    suggestions: withDefault([
      { label: "White outline (2px)", value: "!border-2 !border-white" },
      { label: "White outline", value: "!border-white" },
      { label: "Soft white outline", value: "!border-white/45" },
      { label: "Brand blue", value: "!border-brand" },
      { label: "Dark ink", value: "!border-ink" },
      { label: "No border", value: "!border-transparent" },
    ]),
  },
];

export const BUTTON_HOVER_SUGGESTION_GROUPS = [
  {
    id: "hover_bg",
    field: "cls_hover_bg",
    label: "Background",
    suggestions: withDefault([
      { label: "Soft white glow", value: "hover:!bg-white/12" },
      { label: "Stronger white glow", value: "hover:!bg-white/20" },
      { label: "Brand blue", value: "hover:!bg-brand" },
      { label: "Darker brand", value: "hover:!bg-brand-hover" },
      { label: "Stay transparent", value: "hover:!bg-transparent" },
    ]),
  },
  {
    id: "hover_text",
    field: "cls_hover_text",
    label: "Text",
    suggestions: withDefault([
      { label: "White", value: "hover:!text-white" },
      { label: "Dark ink", value: "hover:!text-ink" },
      { label: "Brand blue", value: "hover:!text-brand" },
    ]),
  },
  {
    id: "hover_border",
    field: "cls_hover_border",
    label: "Border",
    suggestions: withDefault([
      { label: "White", value: "hover:!border-white" },
      { label: "Brand blue", value: "hover:!border-brand" },
      { label: "Soft white", value: "hover:!border-white/55" },
    ]),
  },
];

/** Empty patch — use variant defaults */
export const BUTTON_APPEARANCE_DEFAULT = {
  cls_bg: "",
  cls_text: "",
  cls_border: "",
  cls_hover_bg: "",
  cls_hover_text: "",
  cls_hover_border: "",
};

/** White outline on dark bands */
export const BUTTON_CLASS_DARK_OUTLINE_PRESET = {
  cls_bg: "!bg-transparent",
  cls_text: "!text-white",
  cls_border: "!border-2 !border-white",
  cls_hover_bg: "hover:!bg-white/12",
  cls_hover_text: "hover:!text-white",
  cls_hover_border: "hover:!border-white",
};

/** Filled white CTA */
export const BUTTON_CLASS_SOLID_WHITE_PRESET = {
  cls_bg: "!bg-white",
  cls_text: "!text-ink",
  cls_border: "!border-transparent",
  cls_hover_bg: "hover:!bg-white/90",
  cls_hover_text: "hover:!text-ink",
  cls_hover_border: "hover:!border-transparent",
};

/** One-click looks for editors */
export const BUTTON_APPEARANCE_PRESETS = [
  {
    id: "default",
    label: "Style default",
    description: "Use colors from the Style dropdown only",
    patch: BUTTON_APPEARANCE_DEFAULT,
  },
  {
    id: "dark_outline",
    label: "White outline",
    description: "Transparent with white border — great on dark sections",
    patch: BUTTON_CLASS_DARK_OUTLINE_PRESET,
  },
  {
    id: "solid_white",
    label: "Solid white",
    description: "Filled white button with dark text",
    patch: BUTTON_CLASS_SOLID_WHITE_PRESET,
  },
];

/** All preset class strings — keep in sync for Tailwind @source scanning */
export const BUTTON_CLASS_SAFELIST = [
  ...BUTTON_CLASS_SUGGESTION_GROUPS,
  ...BUTTON_HOVER_SUGGESTION_GROUPS,
]
  .flatMap((g) => g.suggestions.map((s) => s.value))
  .filter(Boolean)
  .concat(
    Object.values(BUTTON_CLASS_DARK_OUTLINE_PRESET),
    Object.values(BUTTON_CLASS_SOLID_WHITE_PRESET)
  );

export function buttonAppearanceSummary(button: Record<string, unknown> = {}) {
  const preset = BUTTON_APPEARANCE_PRESETS.find((p) =>
    BUTTON_APPEARANCE_FIELDS.every(
      (f) => String(button[f] || "") === String(p.patch[f as keyof typeof p.patch] || "")
    )
  );
  if (preset && preset.id !== "default") return preset.label;

  const count = BUTTON_APPEARANCE_FIELDS.filter((f) =>
    String(button[f] || "").trim()
  ).length;
  if (!count) return null;
  return `${count} custom color${count === 1 ? "" : "s"}`;
}
