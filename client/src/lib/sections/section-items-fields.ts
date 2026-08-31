import { z } from "zod";
import { isRichTextEmpty } from "@/lib/utils/rich-text";

/** Supported CMS item field input types */
export const ITEM_FIELD_TYPES = [
  "text",
  "textarea",
  "richtext",
  "url",
  "image",
  "select",
  "radio",
  "bg_color",
  "buttons",
];

/** Built-in string formats for `format` on field defs */
export const ITEM_FIELD_FORMATS = ["url", "email", "tel", "slug"];

const DEFAULT_TYPE_BY_KEY: Record<string, string> = {
  title: "text",
  subtitle: "text",
  label: "text",
  value: "text",
  body: "richtext",
  image_url: "image",
  href: "url",
  icon: "text",
  bg_color: "bg_color",
  buttons: "buttons",
};

const DEFAULT_LABEL_BY_KEY: Record<string, string> = {
  title: "Title",
  subtitle: "Subtitle",
  label: "Label",
  value: "Value",
  body: "Body",
  image_url: "Image URL",
  href: "Link URL",
  icon: "Icon",
  bg_color: "Background",
  buttons: "Buttons",
};

const RULE_KEYS = [
  "minLength",
  "maxLength",
  "min",
  "max",
  "pattern",
  "format",
];

export type ItemFieldOption = { value: string; label: string };

export type ItemFieldDef = {
  key: string;
  type: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  options?: ItemFieldOption[];
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  format?: string;
  errors?: Record<string, string>;
};

type ItemFieldOverrides = Partial<ItemFieldDef> & Record<string, unknown>;

export type ItemFieldsConfig = {
  fields?: Array<string | ItemFieldDef>;
  fieldLabels?: Record<string, string>;
  fieldDefaults?: Record<string, ItemFieldOverrides>;
  childFields?: Array<string | ItemFieldDef>;
  childFieldLabels?: Record<string, string>;
  childFieldDefaults?: Record<string, ItemFieldOverrides>;
};

/** Section-owned CMS items config (fields + editor chrome). */
export type SectionItemsConfig = ItemFieldsConfig & {
  label?: string;
  actionLabel?: string;
  nestedTabs?: boolean;
  preview?: string;
};

function pickRuleOverrides(overrides: ItemFieldOverrides = {}) {
  const out: ItemFieldOverrides = {};
  for (const k of RULE_KEYS) {
    if (overrides[k] != null && overrides[k] !== "") out[k] = overrides[k];
  }
  return out;
}

/** Build a field def from a short key + optional overrides. */
export function itemField(key: string, overrides: ItemFieldOverrides = {}): ItemFieldDef {
  const type = overrides.type || DEFAULT_TYPE_BY_KEY[key] || "text";
  const label = overrides.label || DEFAULT_LABEL_BY_KEY[key] || key;
  return {
    key,
    type,
    label,
    required: Boolean(overrides.required),
    ...(overrides.placeholder ? { placeholder: overrides.placeholder } : {}),
    ...(overrides.hint ? { hint: overrides.hint } : {}),
    ...(Array.isArray(overrides.options) ? { options: overrides.options } : {}),
    ...pickRuleOverrides(overrides),
    ...(overrides.errors ? { errors: overrides.errors } : {}),
  };
}

/**
 * Normalize config.fields / childFields to ItemFieldDef[].
 * Accepts legacy string[] + fieldLabels, or modern object[].
 */
export function normalizeItemFields(
  fields: Array<string | ItemFieldDef> | undefined,
  fieldLabels: Record<string, string> = {},
  defaults: Record<string, ItemFieldOverrides> = {}
): ItemFieldDef[] {
  if (!Array.isArray(fields) || !fields.length) return [];
  return fields.map((entry) => {
    if (entry && typeof entry === "object" && entry.key) {
      return itemField(entry.key, {
        type: entry.type,
        label: entry.label || fieldLabels[entry.key],
        required: entry.required,
        placeholder: entry.placeholder,
        hint: entry.hint,
        options: entry.options,
        minLength: entry.minLength,
        maxLength: entry.maxLength,
        min: entry.min,
        max: entry.max,
        pattern: entry.pattern,
        format: entry.format,
        errors: entry.errors,
        ...defaults[entry.key],
      });
    }
    const key = String(entry);
    return itemField(key, {
      label: fieldLabels[key],
      ...defaults[key],
    });
  });
}

export function getItemFieldDefs(
  config: ItemFieldsConfig | null | undefined,
  { child = false }: { child?: boolean } = {}
) {
  if (!config) return [];
  if (child && Array.isArray(config.childFields)) {
    return normalizeItemFields(
      config.childFields,
      config.childFieldLabels || {},
      config.childFieldDefaults || {}
    );
  }
  return normalizeItemFields(
    config.fields || [],
    config.fieldLabels || {},
    config.fieldDefaults || {}
  );
}

export function getItemFieldKeys(
  config: ItemFieldsConfig | null | undefined,
  { child = false }: { child?: boolean } = {}
) {
  return getItemFieldDefs(config, { child }).map((f) => f.key);
}

export function findItemFieldDef(
  config: ItemFieldsConfig | null | undefined,
  key: string,
  { child = false }: { child?: boolean } = {}
) {
  return getItemFieldDefs(config, { child }).find((f) => f.key === key) || null;
}

function plainTextLength(value: unknown) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim().length;
}

function matchesFormat(format: string, value: unknown) {
  const s = String(value || "").trim();
  if (!s) return true;
  switch (format) {
    case "url":
      return /^(https?:\/\/|\/|mailto:|tel:|#)/i.test(s);
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
    case "tel":
      return /^[\d\s+().-]{7,}$/.test(s);
    case "slug":
      return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s);
    default:
      return true;
  }
}

/** Apply min/max length, pattern, format, numeric min/max after base string checks. */
function applyStringRules(
  schema: z.ZodTypeAny,
  field: ItemFieldDef,
  { measure }: { measure?: (value: unknown) => number } = {}
) {
  const lengthOf =
    typeof measure === "function"
      ? measure
      : (v: unknown) => String(v || "").trim().length;

  let next = schema;

  if (field.minLength != null && Number(field.minLength) > 0) {
    const n = Number(field.minLength);
    next = next.refine((v: unknown) => {
      const s = String(v || "").trim();
      if (!s) return !field.required;
      return lengthOf(v) >= n;
    }, {
      message:
        field.errors?.minLength ||
        `${field.label} must be at least ${n} characters`,
    });
  }

  if (field.maxLength != null && Number(field.maxLength) > 0) {
    const n = Number(field.maxLength);
    next = next.refine((v) => lengthOf(v) <= n, {
      message:
        field.errors?.maxLength ||
        `${field.label} must be at most ${n} characters`,
    });
  }

  if (field.pattern) {
    let re;
    try {
      re = new RegExp(field.pattern);
    } catch {
      re = null;
    }
    if (re) {
      next = next.refine((v: unknown) => {
        const s = String(v || "").trim();
        if (!s) return !field.required;
        return re.test(s);
      }, {
        message:
          field.errors?.pattern ||
          field.errors?.invalid ||
          `${field.label} format is invalid`,
      });
    }
  }

  const format =
    field.format || (field.type === "url" || field.type === "image" ? "url" : null);
  if (format) {
    next = next.refine((v) => matchesFormat(format, v), {
      message:
        field.errors?.format ||
        field.errors?.invalid ||
        `Enter a valid ${field.label.toLowerCase()}`,
    });
  }

  if (field.min != null || field.max != null) {
    next = next.refine((v: unknown) => {
      const s = String(v || "").trim();
      if (!s) return !field.required;
      const num = Number(s);
      if (Number.isNaN(num)) return false;
      if (field.min != null && num < Number(field.min)) return false;
      if (field.max != null && num > Number(field.max)) return false;
      return true;
    }, {
      message:
        field.errors?.min ||
        field.errors?.max ||
        field.errors?.invalid ||
        (field.min != null && field.max != null
          ? `${field.label} must be between ${field.min} and ${field.max}`
          : field.min != null
            ? `${field.label} must be at least ${field.min}`
            : `${field.label} must be at most ${field.max}`),
    });
  }

  return next;
}

function stringSchema(field: ItemFieldDef): z.ZodTypeAny {
  const requiredMsg =
    field.errors?.required || `${field.label} is required`;

  let schema: z.ZodString = z.string();
  if (field.required) {
    schema = schema.trim().min(1, requiredMsg);
  } else {
    schema = schema.optional().or(z.literal("")) as unknown as z.ZodString;
  }

  return applyStringRules(schema, field);
}

function richtextSchema(field: ItemFieldDef): z.ZodTypeAny {
  const requiredMsg =
    field.errors?.required || `${field.label} is required`;

  let schema: z.ZodString = z.string();
  if (field.required) {
    schema = schema.refine((v) => !isRichTextEmpty(String(v)), {
      message: requiredMsg,
    }) as unknown as z.ZodString;
  } else {
    schema = schema.optional().or(z.literal("")) as unknown as z.ZodString;
  }

  return applyStringRules(schema, field, { measure: plainTextLength });
}

function buttonsSchema(field: ItemFieldDef) {
  const base = z.array(z.any());
  if (field.required) {
    return base.min(
      1,
      field.errors?.required || `Add at least one ${field.label.toLowerCase()}`
    );
  }
  return base.optional().default([]);
}

function enumSchema(field: ItemFieldDef) {
  const values = (field.options || []).map((o) => String(o.value));
  const requiredMsg =
    field.errors?.required || `Select a ${field.label.toLowerCase()}`;
  const invalidMsg =
    field.errors?.invalid || `Choose a valid ${field.label.toLowerCase()}`;

  if (!values.length) return stringSchema(field);

  if (field.required) {
    return z
      .string()
      .trim()
      .min(1, requiredMsg)
      .refine((v) => values.includes(String(v)), { message: invalidMsg });
  }
  return z
    .string()
    .refine((v) => !String(v || "").trim() || values.includes(String(v)), {
      message: invalidMsg,
    })
    .optional()
    .or(z.literal(""));
}

/** Zod schema for one item given field defs. */
export function buildItemFieldsZodSchema(fieldDefs: ItemFieldDef[] = []) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const field of fieldDefs) {
    switch (field.type) {
      case "richtext":
        shape[field.key] = richtextSchema(field);
        break;
      case "buttons":
        shape[field.key] = buttonsSchema(field);
        break;
      case "select":
      case "radio":
        shape[field.key] = enumSchema(field);
        break;
      case "bg_color":
      case "image":
      case "url":
      case "textarea":
      case "text":
      default:
        shape[field.key] = stringSchema(field);
        break;
    }
  }
  return z.object(shape).passthrough();
}

/**
 * Validate one item against section field defs.
 * @returns {{ ok: true, data } | { ok: false, errors: Record<string,string> }}
 */
export function validateItemFields(
  item: Record<string, unknown>,
  fieldDefs: ItemFieldDef[]
) {
  const schema = buildItemFieldsZodSchema(fieldDefs);
  const payload: Record<string, unknown> = {};
  for (const field of fieldDefs) {
    payload[field.key] =
      field.type === "buttons"
        ? item?.[field.key] || []
        : item?.[field.key] ?? "";
  }
  const result = schema.safeParse(payload);
  if (result.success) {
    return { ok: true, data: result.data };
  }
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && errors[key] == null) {
      errors[key] = issue.message;
    }
  }
  return { ok: false, errors };
}

export function validateSectionItem(
  item: Record<string, unknown>,
  config: ItemFieldsConfig | null | undefined,
  { child = false }: { child?: boolean } = {}
) {
  const defs = getItemFieldDefs(config, { child });
  return validateItemFields(item, defs);
}
