# 01 — Overview

SkillHub sections are **full-bleed bands** with a **constrained content shell**. Styling is token-driven so the same section works on light or dark bands and inside CMS live-edit.

## Layers (outside → in)

```
┌─────────────────────────────────────────────────────────────┐
│ PageThemeShell                                              │
│  brand colors, page surface pattern                         │
├─────────────────────────────────────────────────────────────┤
│ SectionSurface  (placement)                                 │
│  band bg / image / data-section-theme="light"|"dark"        │
├─────────────────────────────────────────────────────────────┤
│ SectionFrame / custom section                               │
│  title · subtitle · children · SectionButtonsFooter         │
│  └── SectionWrapper (max-w + horizontal gutters)            │
├─────────────────────────────────────────────────────────────┤
│ Content                                                     │
│  band copy (DS_TEXT) · cards · forms · DsButton             │
│  optional light island: data-section-surface="light-card"   │
└─────────────────────────────────────────────────────────────┘
```

Source of truth for this model: `src/lib/sections/section-design-system.js`.

## Rules (non-negotiable)

1. **Never** paint the outer CMS placement `<section>` with hard `bg-white` / `dark:bg-slate-*`. Band color comes from `SectionSurface` + theme tokens.
2. **Band copy** uses `section-theme-heading` | `muted` | `subtle` (or `DS_TEXT.*`) — not `text-ink` / `text-white` / `text-slate-*`.
3. **Forms on dark bands** sit inside a light island (`SectionLightCard` or `data-section-surface="light-card"`).
4. **Photos / gradients with light type** use `SectionMediaOverlay`.
5. **Brand accents** (`text-brand`) are OK on any layer.

## Public vs CMS

| Path | Entry | `cmsMode` |
|------|--------|-----------|
| Public pages | `PublicPageSections` → `PageSectionRender` → `LazySectionBody` | `false` |
| Live edit | `CmsLivePageSections` / `CmsPageSectionRender` | `true` |

The **same section component** is used in both paths. CMS helpers (`CmsEditable`, `CmsSectionItemsBar`, empty hints) no-op when `cmsMode` is false.

## CSS packages

Imported from `src/app/globals.css`:

| File | Role |
|------|------|
| `section-theme.css` | `--band-*`, `--card-*`, `--field-*`, typography utilities |
| `section-buttons.css` | `.section-btn` variants / sizes / shapes |
| `section-tabs.css` | Tab strip tokens |

## Graphify notes

From the client graph (`graphify-out/graph.json`):

- **`section-design-system.js`** — high-degree hub (~38 edges); imported by forms, stats, contact, design primitives, theme helpers.
- **`SectionFrame`** — used by most catalog / feature / FAQ / timeline sections (~39 edges).
- **`DsButton`** — shared by section footers, header CTA, search, catalog cards, CMS button editor.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the dependency map.
