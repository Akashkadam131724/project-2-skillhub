# Architecture map (Graphify)

Generated from the SkillHub **client** code graph (`graphify-out/graph.json`). Use this to see what a change will touch.

Interactive: open [`../graphify-out/graph.html`](../graphify-out/graph.html).

Refresh the graph after large refactors:

```bash
cd client
graphify update .
# optional: graphify cluster-only .   # rebuild communities / report
```

Useful queries:

```bash
graphify explain "section-design-system" --graph graphify-out/graph.json
graphify explain "DsButton" --graph graphify-out/graph.json
graphify explain "SectionFrame" --graph graphify-out/graph.json
graphify query "section buttons surfaces theme" --budget 3000 --graph graphify-out/graph.json
graphify god-nodes --top 15 --graph graphify-out/graph.json
```

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
   section-theme.js      design/* primitives    many section *.js
   section-theme.css     SectionLightCard       forms, stats, FAQ…
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
                                            DsButton  (~25 consumers)
                                                │
                              ┌─────────────────┼─────────────────┐
                              ▼                 ▼                 ▼
                       button-types.js   section-buttons.css   CMS editors
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
  CmsLivePageSections / CmsPageSectionRender (cmsMode: true)
    → same section components + CmsEditable / items bar / drawers
```

---

## Button community (Graphify)

Community centered on `button-types.js` / `DsButton.js` also includes:

- `CmsButtonsEditor`, `button-class-catalog`, `button-system`
- `SectionButtons`, header / search / catalog CTAs
- Pricing, contact, domain search, page banner

Changing `BUTTON_VARIANTS`, action resolution, or `.section-btn` CSS affects this whole community.

---

## Items / CMS community

- `section-items-config.js` + `section-items-fields.js` (Zod)
- `CmsItemsEditor` / `ItemFieldControl`
- `CmsLiveFieldEditDrawer` / `CmsSectionLiveEditor`
- Preview: `GenericItemPreviewCard`, per-section `preview` keys

---

## When you change X, also check Y

| Change | Also verify |
|--------|-------------|
| Max-width / gutters | `SectionWrapper`, skeleton, `SectionImage` sizes |
| Band tokens | `section-theme.css`, light-card / glass presets |
| Button variant | `button-types.js`, `section-buttons.css`, server `button.schema.js` |
| Item field shape | `section-items-config.js`, Zod helpers, `ItemFieldControl` |
| New section | Registry loaders, items config (if item-driven), showcase sample |

---

## Existing override docs

Theme / band / content priority: [`../docs/CMS-OVERRIDE-GUIDE.md`](../docs/CMS-OVERRIDE-GUIDE.md).
