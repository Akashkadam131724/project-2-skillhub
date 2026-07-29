# Seed pipeline

All runnable seeds live under **`steps/`**, grouped by phase and run in order via **`pipeline/manifest.js`**.

## Quick start

```bash
# Safe: keep sections, previews, catalog, and custom CMS rows
npm run seed:replenish

# Full reset (wipers catalog + pages + all EntityPageSection)
npm run seed:pipeline

# Legacy destructive full core
npm run seed:all
```

## Profiles

| Profile   | What runs |
|-----------|-----------|
| **replenish** | Same steps as core with **`SEED_SAFE=1`** — no `Section`/`Page` wipe, catalog upsert by slug, EPS upsert (skips nav wipe) |
| **core**  | Full replace: `pages` deletes all sections & EPS; catalog `deleteMany` |
| **showcase** | Only `07-showcase/*` (run **after** core, or use `full`) |
| **full**  | core + showcase |

## Safe mode (`SEED_SAFE=1`)

Set automatically for `npm run seed:replenish`, or on any step:

```bash
SEED_SAFE=1 npm run seed:entity-cms
npm run seed:pipeline -- --safe --only=entity-cms,content-pages
```

| Area | Safe behavior |
|------|----------------|
| `seed:pages` | Upsert page templates; **add missing section keys only** — existing sections (e.g. `section_preview_img`) unchanged |
| Catalog seeds | Upsert by `slug` — **no** `deleteMany` |
| `entity-cms` | Upsert overrides per `page_tag_id` — **no** bulk delete on vendor/product/course |
| Content/catalog/contact/library seeds | Upsert placements per section — **no** delete-all on that entity |
| `navigation` | **Skipped** in safe mode (would wipe header/footer) |

**Important (destructive core):** `seed:pages` without safe runs `EntityPageSection.deleteMany({})` and `Section.deleteMany({})`. Use **`seed:replenish`** after you've added CMS data you want to keep.

| Step | Fills |
|------|--------|
| `entity-cms` | Every **vendor**, **product**, and **course** detail page |
| `content-pages` | Marketing **Content** routes (`/about-us`, …) |
| `catalog-pages` | Catalog hub content pages |
| `contact-page` | Contact content page |
| `blog` (catalog) | Blog article detail pages |
| `section-library` | Section library showcase (`page_key: section`) |
| `section-previews` | Sets `section_preview_img` from `uploads/section-previews/{key}.png` |
| `content-missing-eps` | Careers, `/sections/*`, showcase demos, any other content URL still at 0 EPS |

**Important:** `seed:pages` without safe runs `EntityPageSection.deleteMany({})` and rebuilds templates. Always run **`entity-cms`** and layout seeds **after** `pages` in the same pipeline.

## Folder layout

```
src/seed/
  lib/                 shared builders (cms-seed-shared, section-showcase-samples)
  pipeline/
    manifest.js        ordered step list + profiles
    run.js             orchestrator CLI
  steps/
    01-catalog/        vendors, products, courses, blogs, content routes
    02-cms/            page templates + sections (destructive)
    03-home/           home section tag upserts
    04-entity/         entity-cms (+ optional cms-content demo)
    05-layouts/        content-pages, catalog-pages, contact
    06-site/           section-library, theme, navigation
    07-showcase/       optional demo pages
```

## Targeted runs

```bash
npm run seed:pipeline -- --only=entity-cms
npm run seed:pipeline -- --profile=core --from=entity-cms
npm run seed:pipeline -- --dry-run
```

Individual scripts still work, e.g. `npm run seed:entity-cms`.
