# 02 — Sections

## Shells

### `SectionWrapper`

`src/components/sections/SectionWrapper.js`

Global **content width** for every section (header, public stack, section interiors).

```
max-w-[1440px]  +  px-4 sm:px-6 lg:px-8
```

- Sections themselves stay **full-bleed** (background on `SectionSurface` / outer `<section>`).
- Inner content wraps with `SectionWrapper`.
- Keep a horizontal gutter at every breakpoint — do **not** use `lg:px-0` on this shell.

Details: [06 — Layout shell](./06-layout-shell.md).

### `SectionFrame`

`src/components/sections/SectionFrame.js`

Standard section chrome used by FAQ, stats, tabs, benefits, directories, etc.

| Prop | Role |
|------|------|
| `title` / `subtitle` | Header copy (CMS pencils via `CmsEditable` when `cmsMode`) |
| `eyebrow` | Small uppercase label above title |
| `cmsMode` / `onEditField` | Live-edit wiring |
| `buttons` / `button_title` / `target_url` | Footer CTAs |
| `onFormOpen` | Form action buttons |
| `buttonsFooter` | Set `false` if the section places CTAs itself |
| `buttonsInverted` | Dark-band CTA palette |
| `action` | Optional right-side header slot |
| `id` | Anchor for in-page nav |

`SectionFrame` always wraps children in `SectionWrapper` and applies standard vertical padding (`py-14 sm:py-16 lg:py-20`).

### `SectionSurface`

`src/components/sections/SectionSurface.js`

Placement-level band background + `data-section-theme`. Applied by CMS/public placement shells — section authors usually don’t call this directly.

---

## Design primitives

**Not CMS sections** — shared layout surfaces under `shared/` (alongside `CardPlaceholder`). Category folders (`content/`, `data/`, …) are registry sections.

`src/components/sections/shared/design/`

| Component | Use when |
|-----------|----------|
| `SectionBand` | Transparent band content shell (inherits surface) |
| `SectionLightCard` | White card / form island on any band |
| `SectionMediaOverlay` | Text/CTA over photo or gradient |
| `SectionBrandGlow` | Soft brand radial decoration |

Helpers from `section-design-system.js`:

```js
import {
  sectionLightCardSurfaceProps,
  sectionGlassCardSurfaceProps,
  sectionDarkOverlaySurfaceProps,
  DS_TEXT,
  DS_FIELD,
  DS_CARD,
} from "@/lib/sections/section-design-system";
```

### Surface presets

| `data-section-surface` | Meaning |
|------------------------|---------|
| `light-card` | White island — resets `--card-*` / `--field-*` / button tokens |
| `glass-card` | Translucent panel on dark bands (FAQ rows, stat tiles) |
| `dark-overlay` | Cinematic / image overlay type |

Also set `data-light-surface` with light cards so nested buttons/fields inherit the light palette.

---

## Typography & fields

```js
DS_TEXT.heading      // section-theme-heading
DS_TEXT.muted        // section-theme-muted
DS_TEXT.subtle       // section-theme-subtle
DS_TEXT.placeholder  // section-theme-placeholder
DS_TEXT.eyebrow      // section-ds-eyebrow

DS_FIELD.input       // section-field
DS_FIELD.label       // section-field-label
DS_FIELD.checkbox    // section-field-checkbox

DS_CARD.ui           // section-ui-card
DS_CARD.chip         // section-ui-chip
```

---

## CMS wiring inside sections

Typical pattern (see `FaqSection.js`):

1. Accept `cmsMode`, `onEditField`, `buttons`, `onFormOpen`.
2. Pass them through to `SectionFrame`.
3. Optionally render `CmsSectionItemsBar` (returns `null` when `!cmsMode`).
4. On empty items: `if (!items.length && !cmsMode) return null;` else show `EmptyItemsHint` in CMS.

Public path builds props with `cmsMode: false` in `PageSectionRender` / `buildSectionCompProps`.

---

## Padding tokens

```js
SECTION_BAND_PADDING_SM  // py-14 sm:py-16 lg:py-20  (SectionFrame default)
SECTION_BAND_PADDING_LG  // py-16 sm:py-20 lg:py-24
```
