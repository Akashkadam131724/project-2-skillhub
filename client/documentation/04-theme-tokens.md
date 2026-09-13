# 04 — Theme & tokens

CSS lives in `src/styles/section-theme.css` (imported via `src/styles/globals.css` in the root layout). Runtime theme merge lives in `src/lib/theme/` + `src/lib/sections/section-theme.ts` (data in `theme/section-theme.data.ts`, resolve in `theme/section-theme.runtime.ts`).

Override priority (site → template → built-in section paint) is documented in [CMS-OVERRIDE-GUIDE.md](./CMS-OVERRIDE-GUIDE.md).

## What CMS controls

| Editor | Controls |
|--------|----------|
| Theme → **Colors** | Brand, brand hover, ink |
| Theme → **Surface** | Repeating band colors for normal section rows |

There is **no** per-section background CMS — only Theme → **Colors** and **Surface**.

## Band themes (runtime)

`SectionSurface` / placement resolve sets:

```html
<div data-section-theme="light">…</div>
<div data-section-theme="dark">…</div>
```

- **Light** rows usually come from the page **surface pattern** (white/grey stripes).
- **Dark** rows for certain section keys are fixed in code via `SECTION_DARK_BG_KEYS` (component owns the fill; skips striping).

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

## Surface pattern vs own-band sections

| Layer | What |
|-------|------|
| Theme → Surface | Stripe / solid / transparent pattern for **normal** placements |
| Own-band / dark keys | Section component paints full-bleed; listed in `SECTION_DARK_BG_KEYS` / `SECTION_OWN_BAND_KEYS` |

Opaque own-band sections cover whatever sits behind them. Transparent surface mode leaves more of the page stack visible between normal rows.

## Tabs

Tab strips use `src/styles/section-tabs.css` (separate from band tokens). Prefer existing tab section components over inventing new tab chrome.
