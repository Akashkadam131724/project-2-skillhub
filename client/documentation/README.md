# SkillHub client — design system documentation

Living docs for the **section design system**: bands, surfaces, typography, buttons, items/fields, and layout shells.

| Doc | Topic |
|-----|--------|
| [00 — `src/` layout](./00-src-layout.md) | Folder structure, TypeScript, entry points |
| [01 — Overview](./01-overview.md) | Layers, rules, source-of-truth files |
| [02 — Sections](./02-sections.md) | `SectionFrame`, surfaces, primitives, CMS mode |
| [03 — Buttons](./03-buttons.md) | `DsButton`, variants, actions, surfaces |
| [04 — Theme & tokens](./04-theme-tokens.md) | CSS variables, light/dark bands, cards |
| [05 — Items & fields](./05-items-fields.md) | `SECTION_ITEMS_CONFIG`, Zod rules, CMS editors |
| [06 — Layout shell](./06-layout-shell.md) | `SectionWrapper`, max-width, gutters |
| [07 — Create a new component](./07-create-new-component.md) | End-to-end guide: CMS section + shared UI |
| [08 — Layout system](./08-layout-system.md) | `DS_SPACE`, grids, `SectionHeader`, `SectionSplit` |
| [ARCHITECTURE](./ARCHITECTURE.md) | Graphify map — hubs & dependency paths |

Related:

- [CMS override guide](./CMS-OVERRIDE-GUIDE.md) — theme / band / content override priority
- Interactive graph: [`../graphify-out/graph.html`](../graphify-out/graph.html)

---

## Quick start for a new section

Full walkthrough (registration, catalogs, items, smoke-test): **[07 — Create a new component](./07-create-new-component.md)**.

Minimal component shape:

```tsx
import SectionFrame from "@/components/sections/SectionFrame";
import { DS_TEXT } from "@/lib/sections/section-design-system";

export default function MySection({
  section_title,
  sub_title,
  cmsMode,
  onEditField,
  buttons,
  onFormOpen,
  ...frameProps
}: MySectionProps) {
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
      <p className={DS_TEXT.muted}>…</p>
    </SectionFrame>
  );
}
```

**Do**

- Use `section-theme-*` / `DS_TEXT.*` for copy on bands  
- Put forms / white cards in `SectionLightCard` on dark bands  
- Render CTAs with `DsButton` / `SectionButtons`  

**Don’t**

- Put `bg-white` / `dark:bg-slate-*` on the outer CMS `<section>`  
- Use raw `text-ink` / `text-white` for band body copy  
- Apply `hidden` display utilities directly on `.section-btn` without a wrapper (CSS `display: inline-flex` wins)

---

## Canonical code entry points

| Concern | Path |
|---------|------|
| `src/` layout | [00-src-layout.md](./00-src-layout.md) |
| DS constants & helpers | `src/lib/sections/section-design-system.ts` |
| Layout spacing + grids | `src/lib/layout/section-layout-system.ts` |
| Layout primitives | `src/components/sections/layout/` |
| Theme computation | `src/lib/sections/section-theme.ts`, `src/lib/theme/` |
| Global + band CSS | `src/styles/globals.css`, `section-theme.css` |
| Button CSS | `src/styles/section-buttons.css` |
| Tab strip CSS | `src/styles/section-tabs.css` |
| Button model | `src/lib/utils/button-types.ts` |
| Button UI | `src/components/ui/DsButton.tsx`, `SectionButtons.tsx` |
| Section chrome | `src/components/sections/SectionFrame.tsx` |
| Content width | `src/components/sections/SectionWrapper.tsx` |
| Design primitives | `src/components/sections/shared/design/` |
| Items field schema | `src/lib/sections/section-items-config.ts`, `section-items-fields.ts` |
| Live-edit context | `src/context/CmsLiveEditContext.tsx`, `CmsLivePlacementsContext.tsx` |
| Shared hooks | `src/hooks/` |
