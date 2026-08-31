# 00 — `src/` layout

SkillHub client is **TypeScript end-to-end** under `src/` (no `.js` source files). Imports use the `@/` alias → `src/`.

## Top-level folders

```
src/
├── app/           Next.js App Router — routes, layouts, API routes, route-local glue
├── components/    UI — sections, CMS, catalog, layout, icons
├── context/       React context providers + context modules
├── hooks/         Shared hooks (+ thin re-exports from context where useful)
├── lib/           Non-UI logic — API clients, section registry, theme, CMS helpers
└── styles/        Global CSS — Tailwind entry + section design tokens
```

## Responsibilities

| Folder | Owns | Does not own |
|--------|------|----------------|
| `app/` | `page.tsx`, `layout.tsx`, metadata, server fetches for a route | Large forms, business rules, reusable UI |
| `components/` | JSX, section variants, CMS editors | API wiring internals |
| `context/` | Providers (`CmsLiveEditProvider`, …), context state | Generic utilities |
| `hooks/` | `useDebouncedValue`, `useSlugParam`, CMS hook re-exports | Heavy domain logic (use `lib/`) |
| `lib/` | `cms-api`, section registry, theme math, Zod item schemas | React components |
| `styles/` | `globals.css`, `section-theme.css`, button/tab tokens | Per-component CSS (colocate with component) |
| `lib/layout/` | Section rail tokens, `DS_SPACE` / `DS_GRID` / `DS_TYPE` | React components |

## Key entry points

| Concern | Path |
|---------|------|
| Root layout + global CSS | `src/app/layout.tsx` → `@/styles/globals.css` |
| Public section stack | `src/components/cms/pages/PublicPageSections.tsx` |
| Live-edit stack | `src/components/cms/pages/CmsLivePageSections.tsx` |
| Live-edit identity | `src/context/CmsLiveEditContext.tsx` |
| Live-edit placements | `src/context/CmsLivePlacementsContext.tsx` |
| Section CMS keys | `src/context/SectionCmsContext.tsx` |
| Theme editor state | `src/context/CmsThemeEditorContext.tsx` |
| Route param hooks | `src/hooks/useSlugParam.ts` |
| Section registry (eager) | `src/lib/sections/section-registry-sync.ts` |
| Section registry (lazy) | `src/lib/sections/section-manifest.ts` |
| Design-system constants | `src/lib/sections/section-design-system.ts` |

## Types

Types are **co-located** with features (no global `src/types/` folder):

- `src/app/types.ts` — shared app-level types
- `src/components/cms/pages/types.ts` — placements, live-edit
- `src/components/cms/sections/types.ts` — section live editor
- `src/components/cms/theme/types.ts` — theme editor

## Tooling

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run test:run    # vitest
npm run build       # next build
```

Graphify (architecture map): `client/graphify-out/` — see [ARCHITECTURE.md](./ARCHITECTURE.md).
