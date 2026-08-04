# Guide — Create a new component in SkillHub client

This project has two common “new component” paths:

| Kind | When | Where |
|------|------|--------|
| **A. CMS section** | New page block editors can add/reorder | `src/components/sections/…` + registries |
| **B. Shared UI / card** | Reused inside sections (not a placement) | `components/ui`, `components/sections/cards`, `components/layout` |

Most of this guide is **A** — registering a new section end-to-end. For design tokens, buttons, and surfaces see the [design system docs](./README.md).

---

## A. New CMS section (checklist)

Use a **snake_case key** that will never change casually (e.g. `value_props`). Keys must match React registration, catalogs, and Mongo `Section.key`.

### 1. Decide category & folder

Pick a category from `SECTION_CATEGORIES` (hero, features, content, …) and put the file under the matching folder:

```
src/components/sections/
  accordion/ | catalog/ | comparison/ | content/ | cta/ | data/
  features/  | forms/   | hero/       | learning/ | media/
  navigation/| overlays/| social_proof/| tabs/ | timeline/ | trust/
```

Example: features → `src/components/sections/features/ValuePropsSection.js`.

### 2. Write the section component

Follow an existing simple item section such as `KeyBenefitsSection.js`.

```jsx
"use client";

import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionFrame from "@/components/sections/SectionFrame";
import { resolveItemsForSection } from "@/lib/sections/item-types";
import { DS_TEXT } from "@/lib/sections/section-design-system";

export default function ValuePropsSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "value_props",
  cmsMode,
  onEditField,
  buttons,
  onFormOpen,
  ...frameProps
}) {
  const items = resolveItemsForSection(section_key, mappingItems);
  if (!items.length && !cmsMode) return null;

  return (
    <SectionFrame
      title={section_title}
      subtitle={sub_title}
      cmsMode={cmsMode}
      onEditField={onEditField}
      buttons={buttons}
      onFormOpen={onFormOpen}
      {...frameProps}
    >
      <CmsSectionItemsBar
        sectionKey={section_key}
        cmsMode={cmsMode}
        onEditField={onEditField}
        itemCount={items.length}
      />
      {items.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <li
              key={item._id || item.id || i}
              className="section-ui-card rounded-2xl border p-5"
            >
              <h3 className={`${DS_TEXT.heading} m-0 text-lg`}>
                {item.title}
              </h3>
              <p className={`${DS_TEXT.muted} mt-2 mb-0 text-sm`}>
                {item.subtitle}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
      )}
    </SectionFrame>
  );
}
```

**Rules**

- Mark `"use client"` if you use hooks, events, or CMS client helpers.
- Prefer `SectionFrame` + `SectionWrapper` (inside Frame) — don’t invent a new max-width.
- Band copy: `DS_TEXT.*` / `section-theme-*` — not raw `text-slate-*` / `text-white`.
- Don’t put `bg-white` on the outer placement `<section>` — band color comes from `SectionSurface`.
- Accept `cmsMode` / `onEditField` / `buttons` / `onFormOpen` and pass through.
- Public: hide empty item sections (`!items.length && !cmsMode → null`).

Optional card extraction: `src/components/sections/cards/ValuePropCard.js`.

### 3. Export from the folder barrel

```js
// features/index.js
export { default as ValuePropsSection } from "./ValuePropsSection";
```

### 4. Register for **live edit** (eager)

`src/lib/sections/section-registry-sync.js`

1. Import `ValuePropsSection` from the features barrel.  
2. Add to `SECTION_COMPONENTS`:

```js
value_props: ValuePropsSection,
```

### 5. Register for **public pages** (lazy)

`src/lib/sections/section-component-loaders.js`

```js
value_props: () =>
  import("@/components/sections/features/ValuePropsSection"),
```

Public path: `PublicPageSections` → `LazySectionBody` → this map.  
Live edit path: eager `SECTION_COMPONENTS`. **Both must stay in sync.**

### 6. Client catalog metadata

`src/lib/sections/section-registry.js`

```js
// SECTION_CATALOG
{ key: "value_props", name: "Value Props", category: "features", tags: ["cards", "benefits"] },

// SECTION_SURFACE — "alt" = page band alternation; "fixed" = own / non-row chrome
value_props: "alt",
```

If the layout uses `section_img_url`, add the key to `SECTION_USES_IMAGE`.

### 7. Items CMS form (if item-driven)

`src/lib/sections/section-items-config.js`

```js
value_props: {
  label: "Value props",
  actionLabel: "props",
  fields: [
    { key: "title", type: "text", label: "Title", required: true },
    { key: "subtitle", type: "text", label: "Subtitle" },
    { key: "body", type: "richtext", label: "Description" },
    { key: "image_url", type: "image", label: "Icon / image" },
    { key: "buttons", type: "buttons", label: "Buttons" },
  ],
  preview: "benefit", // or add a dedicated preview in GenericItemPreviewCard
},
```

Field types / Zod rules: [05 — Items & fields](./05-items-fields.md).

Presence of a config entry is what makes `sectionUsesItems()` true.

### 8. Server catalog (keep in sync)

`server/src/modules/cms/section.catalog.js` → `SECTION_CATALOG_META`:

```js
value_props: { category: "features" },
```

Then create/seed a `Section` document with `key: "value_props"` (CMS UI or seed script). Without a DB row, the library won’t list it for mapping.

### 9. Optional polish

| Task | Where |
|------|--------|
| Showcase / library sample | `src/lib/sections/showcase/static-samples.js` |
| Theme band exceptions | `section-theme.js` (`SECTION_OWN_BAND_KEYS`, skip keys, fixed theme) |
| Behavior alias | `BEHAVIOR_ALIASES` in `section-items-config.js` (e.g. old key → new render) |
| Item preview art | `GenericItemPreviewCard` + `preview` key |

### 10. Smoke-test

1. `npm run dev` (client **3001**, API **3000**).  
2. CMS → Sections / library — new key appears.  
3. Map it on a page template or entity.  
4. **Public** page: content renders; empty items stay hidden.  
5. **Live edit**: pencils, items editor, save, band theme.  
6. Dark band: cards/forms still readable (use light island / glass card if needed).

---

## Registration map (what talks to what)

```
┌─────────────────────┐     ┌──────────────────────────────┐
│ ValuePropsSection.js│◄────│ section-registry-sync.js     │  live edit
│                     │     │ SECTION_COMPONENTS           │
│                     │◄────│ section-component-loaders.js │  public lazy
└──────────┬──────────┘     └──────────────────────────────┘
           │
           ▼
┌─────────────────────┐     ┌──────────────────────────────┐
│ SECTION_CATALOG     │     │ SECTION_ITEMS_CONFIG         │
│ SECTION_SURFACE     │     │ (CMS item fields + Zod)      │
│ (client registry)   │     └──────────────────────────────┘
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ section.catalog.js  │  server meta + DB Section.key
│ (server)            │
└─────────────────────┘
```

Forget one registration → section missing in CMS, blank on public, or FallbackSection.

---

## B. Shared UI / card (not a CMS section)

Use when the piece is **not** a page placement.

| Type | Location | Notes |
|------|----------|--------|
| Design-system button | Prefer `DsButton` / `SectionButtons` | Don’t invent a third button system |
| Layout chrome | `components/layout/` | Header, nav, banners |
| Section card | `components/sections/cards/` | Presentational; props only |
| Primitive | `components/ui/` | Drawer, modal, etc. |
| Icon | `components/icons/` | Small SVG components |

**Conventions**

- Default export for the main component file.  
- Import alias `@/` → `src/`.  
- Client interactivity → `"use client"` at top.  
- Server Components by default in `app/` — only push `"use client"` down to the leaf that needs it.  
- Match existing Tailwind + DS tokens; avoid one-off purple/glow themes (see project design rules).

Example card:

```jsx
export default function ValuePropCard({ title, subtitle, onDarkBand = false }) {
  return (
    <div
      {...(onDarkBand
        ? { "data-section-surface": "glass-card" }
        : { "data-section-surface": "light-card", "data-light-surface": "" })}
      className="section-ui-card rounded-2xl border p-5"
    >
      …
    </div>
  );
}
```

No catalog / loader registration for pure cards.

---

## C. Variant of an existing section

If layout is 90% the same:

1. Prefer a **`render_key`** catalog entry that points at an existing component (see `page_testimonials` → `customer_testimonials`).  
2. Or a thin wrapper (e.g. `FeatureTabsSection` → `TabsSection`) with a prop.  
3. Register the **new catalog key**; loader can map alias via `BEHAVIOR_ALIASES` / `resolveSectionBehaviorKey`.

Avoid copy-pasting entire sections for a spacing tweak.

---

## Do / don’t

| Do | Don’t |
|----|--------|
| Keep client + server catalogs aligned | Add only a React file and expect CMS to find it |
| Register eager **and** lazy loaders | Register only one path |
| Use `SectionFrame` + DS text classes | Hard-code section padding / max-width |
| Define item fields in config | Hard-code form fields only in the editor |
| Hide empty item sections on public | Show empty CMS placeholders on the live site |
| Wrap `DsButton` to hide with a parent `hidden` span | Rely on `hidden` on `.section-btn` alone |

---

## Related docs

- [01 — Overview](./01-overview.md)  
- [02 — Sections](./02-sections.md)  
- [03 — Buttons](./03-buttons.md)  
- [05 — Items & fields](./05-items-fields.md)  
- [ARCHITECTURE](./ARCHITECTURE.md) (Graphify)  
- [CMS override guide](../docs/CMS-OVERRIDE-GUIDE.md)
