# 08 — Layout system (grid & spacing)

Global layout tokens and primitives — use these instead of one-off `gap-*` / `mb-*` in section UIs. Aligns with the dev **layout ruler** (`NEXT_PUBLIC_DEV_LAYOUT_RULER`) and `SectionWrapper` (1440px rail).

## Layers

```
SectionSurface (band)
  └── SectionWrapper (horizontal rail + gutters)
        └── SectionShell (top header + body — no double gap)
              ├── SectionHeader  ← headerBody margin → body
              └── SectionStack (body blocks only)
                    ├── SectionSplit | SectionItemGrid | custom body
                    └── footer / SectionButtonsFooter
```

Side-column copy (e.g. `vendor_link_grid`) uses `SectionSplit` + `SectionStack gap="stackSm"` in the left column — **no** `SectionHeader` margin; stack gap is the rhythm there.

## Tokens — `section-layout-system.ts`

Import from `@/lib/layout/section-layout-system` or re-exports in `section-design-system.ts`.

### Spacing (`DS_SPACE`)

| Token | Classes | Use |
|-------|---------|-----|
| `headerStack` | `gap-2.5 sm:gap-3` | Eyebrow → title → subtitle |
| `headerBody` | `mb-8 sm:mb-10` | Below header, before body |
| `stackSm` | `gap-6` | Tight vertical stacks |
| `stackMd` | `gap-8` | Default block spacing |
| `stackLg` | `gap-10 lg:gap-12` | Split columns |
| `gridGap` | `gap-4 sm:gap-5 lg:gap-6` | Card grids |
| `gridGapTight` | `gap-3 sm:gap-4` | Dense grids |
| `inlineGap` | `gap-4 sm:gap-x-6` | Button rows |
| `trackGap` | `gap-x-4 sm:gap-x-5` | Marquee / logo tracks |

### Grid columns (`DS_GRID` / `sectionGridColsClass`)

| Cols | Breakpoints |
|------|-------------|
| `1` | single column |
| `2` | `sm:grid-cols-2` |
| `3` | `sm:2` · `lg:3` |
| `4` | `sm:2` · `lg:4` |

### Typography (`DS_TYPE`)

| Token | Role |
|-------|------|
| `eyebrow` | Uppercase brand label |
| `displayTitle` | Section `h2` |
| `subtitle` | Muted intro under title |
| `body` / `bodyBlock` | Paragraph copy on bands |

Pair with `DS_TEXT.*` CSS utilities for token-driven color on light/dark bands.

### Border radius (`DS_RADIUS`)

Pick one tier per card surface — do not use ad-hoc `rounded-[*]` in migrated sections.

| Token | Radius | Use |
|-------|--------|-----|
| `tile` | `1.35rem` (~22px) | Compact tiles — `stats`, `why_choose` |
| `accordion` | `1.25rem` (~20px) | FAQ accordion rows |
| `card` | `1.5rem` (24px) | Default section cards — `training_options`, `awards` |
| `media` | `1.75rem` (28px) | Media frames — `text_media`, `latest_blogs`, `feature_tabs` panel |
| `nested` | `rounded-2xl` | Child cards inside a panel — tab child cards |
| `panel` | `rounded-xl` | Grouped link shells — `vendor_link_grid` |
| `empty` | `rounded-3xl` | Dashed empty-state shells |
| `icon` / `iconSm` | `2xl` / `xl` | Icon wells inside cards |
| `pill` | `rounded-full` | Badges, index chips, decorative orbs |

```tsx
import { DS_RADIUS, sectionClassNames } from "@/lib/layout/section-layout-system";

<article className={sectionClassNames(DS_RADIUS.card, "border p-6 …")} />
```

Helper: `sectionCardRadiusClass("media", "border …")` from `section-design-system.ts`.

## Primitives — `components/sections/layout/`

### `SectionHeader`

Standard eyebrow + title + subtitle (+ optional action). Used by grid sections with a **top** band header.

- Set `spaced={hasBody}` — applies `DS_SPACE.headerBody` (`mb-8 sm:mb-10`) below the header.
- **Do not** put `SectionHeader` and body siblings inside `SectionStack` with gap — flex `gap-*` stacks on top of header margin and doubles the space. Use `SectionShell` instead.

```tsx
<SectionShell
  header={
    <SectionHeader
      eyebrow="Ecosystem"
      title="Our partners"
      subtitle="Trusted by industry leaders."
      spaced={hasBody}
    />
  }
>
  <SectionItemGrid cols={3}>…</SectionItemGrid>
</SectionShell>
```

### `SectionShell`

Top header + body layout. Header sits outside the body stack so only `headerBody` margin separates header from content; `bodyGap` (`stackMd` by default) spaces body blocks only.

### `SectionStack`

Vertical rhythm **between body blocks** (grid, footer, nested stacks). Not for wrapping a top `SectionHeader` + body.

### `SectionSplit`

Two-column layouts.

| `ratio` | Layout |
|---------|--------|
| `50-50` | Equal columns (`lg:col-span-6` with `variant="rail"`) |
| `40-60` | Copy narrow · cards wide — `vendor_link_grid` (`lg:col-span-5` / `7`) |
| `60-40` | Wide copy |
| `sidebar-380` | Fixed 380px sidebar + fluid — `sarder_ecosystem` (`variant="grid"`) |

```tsx
<SectionSplit variant="rail" ratio="40-60" gap="md" left={copy} right={cards} />
<SectionSplit variant="grid" ratio="sidebar-380" gap="lg" left={sidebar} right={main} />
```

### `SectionItemGrid`

Card grids with shared gap + column presets. Wraps `MobileCardPeekRow` (peek on mobile by default).

```tsx
<SectionItemGrid cols={4} gap="default">
  {items.map((item) => (
    <TrainingOptionCard key={item.id} {...item} />
  ))}
</SectionItemGrid>
```

### `SectionStack`

Vertical rhythm **between body blocks** (not after a top `SectionHeader`).

```tsx
<SectionStack gap="stackXl">
  {rows.map((row) => (
    <TextMediaRow key={row.id} item={row} />
  ))}
</SectionStack>
```

### Full-bleed hero (`DS_HERO_LAYOUT`)

Split heroes use a **12-column grid inside `SectionWrapper`** — copy `lg:col-span-7`, image bleeds `w-1/2` on the right. See `hero_gradient_slider`.

```tsx
<SectionWrapper className={DS_HERO_LAYOUT.grid}>
  <div className={DS_HERO_LAYOUT.copyCol}>...</div>
  <div className={DS_HERO_LAYOUT.mediaReserve} aria-hidden />
</SectionWrapper>
<div className={DS_HERO_LAYOUT.mediaBleed}>...</div>
```

## Section → layout map (examples)

| Section | Header | Body layout | Grid cols | Card radius |
|---------|--------|-------------|-----------|-------------|
| `partners_marquee` | `SectionHeader` | marquee track | — | `nested` (logo chips) |
| `vendor_link_grid` | inline title | `SectionSplit` 40/60 | 2 (link cards) | `panel` |
| `feature_tabs` | `SectionHeader` | rail 4/8 or stack | nested grid | `media` + `nested` |
| `text_media` | `SectionHeader` | `SectionSplit` 50/50 | — | `media` (image frame) |
| `latest_blogs` | `SectionHeader` | `SectionItemGrid` | 3 | `media` |
| `why_choose` | `SectionHeader` | `SectionItemGrid` | 3 | `tile` |
| `stats` | `SectionHeader` | `SectionItemGrid` | 4 | `tile` |
| `training_options` | `SectionHeader` | `SectionItemGrid` | 4 | `card` |
| `awards` | `SectionHeader` | `SectionItemGrid` | 3 | `card` |
| `sarder_ecosystem` | inline (brand) | `SectionSplit` grid sidebar-380 | inner card grid | — |
| `faq` | `SectionHeader` | `SectionStack` gridGapTight | 1 | `accordion` |

## Rules

1. **Horizontal alignment** — always inside `SectionWrapper` (or `SECTION_CONTENT_INSET_CLASS` for full-bleed heroes).
2. **Gaps** — pick `DS_SPACE.*`; don’t invent new `gap-7` unless adding a token.
3. **Header → body** — `SectionShell` + `SectionHeader spaced={hasBody}`; never `SectionStack` gap + header margin together.
4. **Columns** — pick `SectionItemGrid` `cols` or `SectionSplit` `ratio`; don’t hand-roll `lg:grid-cols-3` unless the layout is truly unique.
5. **Typography** — band copy uses `DS_TYPE` + `DS_TEXT`; avoid raw `text-gray-*` on CMS placements.
6. **Radius** — pick `DS_RADIUS.*` for every card surface; don't invent new `rounded-[*]` values.
7. **Dev ruler** — pink lines = content area; purple = 12 columns inside the rail.

## Related

- [06 — Layout shell](./06-layout-shell.md) — `SectionWrapper`
- [02 — Sections](./02-sections.md) — `SectionFrame`, surfaces
- [00 — `src/` layout](./00-src-layout.md) — folder roles

## DRY section helpers

Four **section families** share one pattern (layout → CMS adapter → public adapter), each with its own shared helpers:

| Family | Layout (`*Ui`) | CMS (`*Section`) | Public (`*PublicSection`) |
|--------|----------------|------------------|---------------------------|
| **Bands** | `SectionLayoutRoot` | `cmsSectionHeaderSlots` + `cmsSectionChrome` | `publicSectionButtonsFooter` |
| **Heroes** | `DS_HERO_LAYOUT` / custom | `buildHeroLayoutCmsSlots` + `heroLayoutCmsFooter`¹ | `heroLayoutPublicFooter`¹ |
| **Catalog API** | `SectionLayoutRoot` | `catalogCmsSection` | header + client fetch |
| **Special** | custom (`promo_modal`, `in_page_nav`, test) | header and/or preview only | item-specific |

¹ `heroLayoutCmsFooter` and `heroLayoutPublicFooter` delegate to `cmsSectionChrome` / `publicSectionButtonsFooter`.

### Band sections — three-file pattern

| Layer | File | Responsibility |
|-------|------|----------------|
| Layout | `*Ui.tsx` | `SectionLayoutRoot` + body `children` |
| CMS | `*Section.tsx` | `cmsSectionHeaderSlots()` + `cmsSectionChrome()` |
| Public | `*PublicSection.tsx` | plain props → `*Ui` + `publicSectionButtonsFooter()` |

### `SectionLayoutRoot`

Standard band shell in `components/sections/layout/SectionLayoutRoot.tsx`.

```tsx
<SectionLayoutRoot
  title={title}
  subtitle={subtitle}
  itemsBar={itemsBar}
  footer={footer}
  items={items}
>
  <SectionItemGrid cols={3}>…</SectionItemGrid>
</SectionLayoutRoot>
```

| Prop | Use |
|------|-----|
| `layout="wrapper"` | Skip `SectionShell` — custom grids (`faq_two_column`, `split_cta`, `sarder_ecosystem`) |
| `padding="none"` | Flush vertical padding (split CTA, sarder) |
| `hasBodyContent` | Body-only bands without top `SectionHeader` |
| `sectionStyle` | Inline band background (split CTA custom color) |
| `decor` | `SectionBrandGlow`, vendor gradient, etc. |

**Intentional layout exceptions:** hero variants (full-bleed), `in_page_nav` (sticky nav), tab wrapper shells (delegate to `NestedTabsCmsSection`), test templates.

### `catalogCmsSection`

`components/sections/catalog/shared/catalog-cms-section.tsx` — header slots for API-driven catalog sections. Pass `withCatalogParams: true` for course-catalog locked filters.

```tsx
<CourseCatalogUi
  {...catalogCmsSection({
    section_title,
    sub_title,
    onEditField,
    pageContext,
    withCatalogParams: true,
  })}
/>
```

### Hero shared helpers

`components/sections/hero/shared/` — parallel DRY stack for heroes (do **not** use `SectionLayoutRoot`):

- `buildHeroLayoutCmsSlots()` — `HeroTitleCms` / `HeroSubtitleCms` / body slot
- `heroLayoutCmsFooter()` → `cmsSectionChrome({ withItems: false })`
- `heroLayoutPublicFooter()` → `publicSectionButtonsFooter()`
- `isHeroPlacementShowable()` — meaningful-content probe

### `cmsSectionChrome`

`components/sections/shared/cms-section-chrome.tsx` — CMS items bar, empty hint, and `SectionButtonsFooter`.

```tsx
{...cmsSectionChrome({
  section_key,
  itemCount: items.length,
  onEditField,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  onDarkBand,
})}
```

| Option | Use |
|--------|-----|
| `withItems: false` | Footer-only sections (CTA band, overview, contact-us) |
| `buttonsClassName` | Inline button row styling (split CTA) |

### `publicSectionButtonsFooter`

`components/sections/shared/public-section-footer.tsx` — public-page CTAs (no CMS manage strip). Pass raw `buttons` / `button_title` / `target_url`; do not pre-resolve with `sortActiveButtons`.

### `createPlacementGuard` factories

`lib/sections/placement-guard.ts` — per-section `isXPlacementShowable(props, cmsMode)`:

| Factory | When |
|---------|------|
| `createPlacementGuard` | Item-list sections + catalog probe |
| `createHeaderOrItemsPlacementGuard` | Title/subtitle/body OR items |
| `createContentPlacementGuard` | Title/subtitle/body only |
| `createProbePlacementGuard` | Catalog field probe (`overview`) |
| `createTitleSubtitleButtonsPlacementGuard` | Newsletter-style bands |
| `createSplitCtaPlacementGuard` | Split CTA image + copy |
| `createPageContextPlacementGuard` | Catalog context (`related_courses`) |
| `createMinBuiltItemsPlacementGuard` | Built nav lists (`in_page_nav`) |
| `createStaticFallbackItemsGuard` | Static demo fallback (`vendor_link_grid`, `sarder_ecosystem`) |

**Still manual:** `hero/shared` placement (meaningful-content probe only).
