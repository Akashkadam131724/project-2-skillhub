# 05 — Items & fields

Many sections are **item-driven** (`items[]` on the placement). CMS forms and validation are driven by config — not hard-coded per editor.

## Config

`src/lib/sections/section-items-config.ts`

```ts
export const SECTION_ITEMS_CONFIG = {
  faq: {
    label: "FAQ",
    actionLabel: "FAQ",
    fields: [
      {
        key: "title",
        type: "text",
        label: "Question",
        required: true,
        minLength: 5,
        errors: {
          required: "Question is required",
          minLength: "Question must be at least 5 characters",
        },
      },
      { key: "body", type: "richtext", label: "Answer", required: true },
      { key: "buttons", type: "buttons", label: "Buttons" },
    ],
    preview: "faq",
  },
  // …
};
```

Nested tab sections set `nestedTabs: true` plus `childFields` / `childFieldLabels`.

Resolve behavior key with `resolveSectionBehaviorKey(sectionKey, renderKey)` (aliases e.g. `tabs_vertical` → `feature_tabs`).

## Field types

From `section-items-fields.ts` → `ITEM_FIELD_TYPES`:

| `type` | Control |
|--------|---------|
| `text` / `textarea` | Inputs |
| `richtext` | `CmsRichTextEditor` |
| `url` / `image` | URL + optional upload |
| `select` / `radio` | Requires `options: [{ value, label }]` |
| `bg_color` | Banner / panel color picker |
| `buttons` | Nested `CmsButtonsEditor` |

## Validation rules (Zod)

Supported on field defs:

| Rule | Notes |
|------|-------|
| `required` | Empty check (richtext uses `isRichTextEmpty`) |
| `minLength` / `maxLength` | Plain text length; richtext strips tags |
| `min` / `max` | Numeric string values |
| `pattern` | Regex string |
| `format` | `url` \| `email` \| `tel` \| `slug` |
| `options` | Enum for select/radio |
| `errors.*` | Custom messages (`required`, `minLength`, `invalid`, …) |

Helpers:

- `getItemFieldDefs(config, { child })`
- `buildItemFieldsZodSchema(defs)`
- `validateSectionItem(item, config, { child })`
- `validateItemsDraft(draft, sectionKey, renderKey)` in `CmsItemsEditor`

Empty draft rows are skipped on save validation; only rows with content are checked.

## Editors

| UI | Path |
|----|------|
| Items list | `CmsItemsEditor` + `ItemFieldControl` |
| Live field drawer | `CmsLiveFieldEditDrawer` |
| Section live editor | `CmsSectionLiveEditor` |
| Preview cards | `GenericItemPreviewCard` / `preview` key in config |

## Item accessors

Prefer helpers in `src/lib/sections/item-types.ts` (`itemQuestion`, `itemAnswer`, `resolveItemsForSection`, …) over reading raw keys in section JSX.
