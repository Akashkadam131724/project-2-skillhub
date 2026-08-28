# SkillHub client — design system documentation

Living docs for the **section design system**: bands, surfaces, typography, buttons, items/fields, and layout shells.

| Doc | Topic |
|-----|--------|
| [01 — Overview](./01-overview.md) | Layers, rules, source-of-truth files |
| [02 — Sections](./02-sections.md) | `SectionFrame`, surfaces, primitives, CMS mode |
| [03 — Buttons](./03-buttons.md) | `DsButton`, variants, actions, surfaces |
| [04 — Theme & tokens](./04-theme-tokens.md) | CSS variables, light/dark bands, cards |
| [05 — Items & fields](./05-items-fields.md) | `SECTION_ITEMS_CONFIG`, Zod rules, CMS editors |
| [06 — Layout shell](./06-layout-shell.md) | `SectionWrapper`, max-width, gutters |
| [07 — Create a new component](./07-create-new-component.md) | End-to-end guide: CMS section + shared UI |
| [ARCHITECTURE](./ARCHITECTURE.md) | Graphify map — hubs & dependency paths |

Related (existing):

- [`../docs/CMS-OVERRIDE-GUIDE.md`](../docs/CMS-OVERRIDE-GUIDE.md) — theme / band / content override priority
- Interactive graph: [`../graphify-out/graph.html`](../graphify-out/graph.html)

---

## Quick start for a new section

Full walkthrough (registration, catalogs, items, smoke-test): **[07 — Create a new component](./07-create-new-component.md)**.

Minimal component shape:

```jsx
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
}) {
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
| DS constants & helpers | `src/lib/sections/section-design-system.js` |
| Theme computation | `src/lib/sections/section-theme.js` |
| Band / card CSS tokens | `src/app/section-theme.css` |
| Button CSS | `src/app/section-buttons.css` |
| Button model | `src/lib/utils/button-types.js` |
| Button UI | `src/components/ui/DsButton.js`, `SectionButtons.js` |
| Section chrome | `src/components/sections/SectionFrame.js` |
| Content width | `src/components/sections/SectionWrapper.js` |
| Design primitives | `src/components/sections/shared/design/` |
| Items field schema | `src/lib/sections/section-items-config.js`, `section-items-fields.js` |
