# Section test sandbox

Prototype new sections here before promoting them into `content/`, `hero/`, etc.

## Quick start

1. Copy `_template/` → `your-section-name/` (kebab-case folder).
2. Rename files/components (`TemplateBand` → `YourSection`).
3. Set `section.blueprint.ts` — pick archetype + band.
4. Preview at `/user-guide/test/your-section-name` (add a page — copy `example-callout`).
5. When ready, wire production registries (checklist below) and move the folder out of `test/`.

## Folder layout (every variant)

```
your-section-name/
  section.blueprint.ts      # archetype, band, catalog hints
  YourSectionUi.tsx         # pure layout — no CMS imports
  YourSectionStatic.tsx     # user-guide + static demo
  YourSectionPublicSection.tsx
  YourSectionSection.tsx    # CMS live edit (when not static-only)
  lib/
    types.ts
    static-demo.ts
    cms-config.ts          # item fields (if items/hybrid)
    cms-capabilities.ts
  index.ts
```

## Production wiring (when promoting)

| Step | File |
|------|------|
| Catalog row | `lib/sections/section-catalog.entries.js` |
| Server catalog | `server/src/modules/cms/section.catalog.js` |
| Manifest loaders | `lib/sections/section-manifest.ts` |
| CMS live edit | `lib/sections/section-registry-sync.js` |
| Item fields (if items) | `lib/sections/configs/index.js` |
| CMS capabilities | `lib/sections/section-cms-capabilities.ts` |
| Theme band sets (if needed) | `lib/sections/theme/section-theme.data.js` |

See `lib/sections/test/integration-checklist.ts` for a typed checklist helper.

## Live examples

| Folder | Preview |
|--------|---------|
| `example-callout/` | [/user-guide/test/example-callout](/user-guide/test/example-callout) |
