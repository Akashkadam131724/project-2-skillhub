# 04 — Theme & tokens

CSS lives in `src/styles/section-theme.css` (imported via `src/styles/globals.css` in the root layout). Runtime theme merge lives in `src/lib/theme/` + `src/lib/sections/section-theme.ts`.

Override priority (site → page → section band) is documented in [CMS-OVERRIDE-GUIDE.md](./CMS-OVERRIDE-GUIDE.md).

## Band themes

Set on the placement surface:

```html
<div data-section-theme="light">…</div>
<div data-section-theme="dark">…</div>
```

| Token family | Role |
|--------------|------|
| `--band-bg` / `--band-fg` / `--band-muted` / `--band-subtle` / `--band-border` | Band chrome & default copy |
| `--card-*` | Card panels (swapped by surface presets) |
| `--field-*` | Inputs / selects |
| `--section-fg` / `--section-muted` / … | Aliases used by utility classes |

### Utility classes (prefer these)

| Class | Uses |
|-------|------|
| `section-theme-heading` | Titles on the band |
| `section-theme-muted` | Body / secondary |
| `section-theme-subtle` | Meta / captions |
| `section-theme-placeholder` | Empty CMS placeholders |
| `section-field` / `section-field-label` | Form controls |

Equivalent TS: `DS_TEXT`, `DS_FIELD` from `section-design-system.ts`.

## Fixed palettes (never swap with band alone)

Defined on `:root` in `section-theme.css`:

| Prefix | Use |
|--------|-----|
| `--ds-light-card-*` / `--ds-light-field-*` | White islands |
| `--ds-glass-card-*` / `--ds-glass-field-*` | Glass on dark |
| `--surface-dark-bg` | Default dark band fill |

Light islands apply these via `[data-section-surface="light-card"]` / `[data-light-surface]`.

## Brand theme

Site / page theme sets `--brand`, `--brand-hover`, `--ink` (see `globals.css` `[data-theme="…"]`).

`text-brand` and brand focus rings remain valid on any band.

## Page background vs section band

| Layer | What |
|-------|------|
| Page theme | Color / image **behind** transparent sections |
| Section band | Per-placement bg color, gradient, or image |

Transparent sections show the page background; opaque bands cover it.

## Tabs

Tab strips use `src/styles/section-tabs.css` (separate from band tokens). Prefer existing tab section components over inventing new tab chrome.
