# Architecture map (Graphify)

Generated from the SkillHub **client** code graph (`graphify-out/graph.json`). Use this to see what a change will touch.

Interactive: open [`../graphify-out/graph.html`](../graphify-out/graph.html).

Refresh the graph after large refactors:

```bash
cd project-2-skillhub/client
graphify update client
# optional: graphify cluster-only client/graphify-out/graph.json
```

Useful queries:

```bash
graphify explain "section-design-system" --graph client/graphify-out/graph.json
graphify explain "DsButton" --graph client/graphify-out/graph.json
graphify explain "SectionFrame" --graph client/graphify-out/graph.json
graphify query "section buttons surfaces theme" --budget 3000 --graph client/graphify-out/graph.json
graphify god-nodes --top 15 --graph client/graphify-out/graph.json
```

---

## `src/` layout (summary)

| Folder | Role |
|--------|------|
| `app/` | Routes, layouts, API routes |
| `components/` | Sections, CMS UI, catalog |
| `context/` | `CmsLiveEdit`, placements, section CMS keys, theme editor |
| `hooks/` | Shared hooks (`useSlugParam`, debounce, CMS re-exports) |
| `lib/` | API, section registry, theme, item schemas |
| `styles/` | Global CSS + section tokens |

Details: [00-src-layout.md](./00-src-layout.md).

---

## Design-system hubs

```
                    ┌──────────────────────────┐
                    │  section-design-system   │
                    │  DS_TEXT / DS_FIELD /    │
                    │  surface prop helpers    │
                    └────────────┬─────────────┘
           ┌─────────────────────┼─────────────────────┐
           ▼                     ▼                     ▼
   section-theme.ts       design/* primitives    many section *.tsx
   styles/section-theme   SectionLightCard       forms, stats, FAQ…
                         SectionBand
                         SectionMediaOverlay

                    ┌──────────────────────────┐
                    │      SectionFrame        │  (~39 consumers)
                    │  title · CMS · footer    │
                    └────────────┬─────────────┘
                                 │
                    ┌────────────┴─────────────┐
                    ▼                          ▼
             SectionWrapper              SectionButtonsFooter
             (max-w + gutters)                  │
                                                ▼
                                         SectionButtons
                                                │
                                                ▼
                                            DsButton
                                                │
                              ┌─────────────────┼─────────────────┐
                              ▼                 ▼                 ▼
                       button-types.ts   section-buttons.css   CMS editors
                       normalizeButton   .section-btn--*
```

---

## Render paths

```
Public
  PublicPageSections
    → PageSectionRender (cmsMode: false)
      → LazySectionBody (dynamic import by section_key / render_key)
        → FaqSection | TabsSection | … (shared components)

Live edit
  CmsLivePageSections
    → CmsLiveEditProvider (context/)
    → CmsLivePlacementsProvider (context/)
    → CmsPageSectionRender (cmsMode: true)
      → same section components + CmsEditable / items bar / drawers
```

---

## Button community (Graphify)

Community centered on `button-types.ts` / `DsButton.tsx` also includes:

- `CmsButtonsEditor`, `button-class-catalog`, `button-system`
- `SectionButtons`, header / search / catalog CTAs
- Pricing, contact, domain search, page banner

Changing `BUTTON_VARIANTS`, action resolution, or `.section-btn` CSS affects this whole community.

---

## Items / CMS community

- `section-items-config.ts` + `section-items-fields.ts` (Zod)
- `CmsItemsEditor` / `ItemFieldControl`
- `CmsLiveFieldEditDrawer` / `CmsSectionLiveEditor`
- Preview: `GenericItemPreviewCard`, per-section `preview` keys

---

## When you change X, also check Y

| Change | Also verify |
|--------|-------------|
| Max-width / gutters | `SectionWrapper`, skeleton, `SectionImage` sizes |
| Band tokens | `styles/section-theme.css`, light-card / glass presets |
| Button variant | `button-types.ts`, `styles/section-buttons.css`, server `button.schema.js` |
| Item field shape | `section-items-config.ts`, Zod helpers, `ItemFieldControl` |
| New section | `section-manifest.ts` + `section-registry-sync.ts`, items config, showcase sample |
| Live-edit state | `context/CmsLivePlacementsContext.tsx`, `components/cms/pages/types.ts` |

---

## Existing override docs

Theme / band / content priority: [CMS-OVERRIDE-GUIDE.md](./CMS-OVERRIDE-GUIDE.md).
