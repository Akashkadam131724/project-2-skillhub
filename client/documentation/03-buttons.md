# 03 — Buttons

Design-system CTAs are **data objects** (CMS-shaped) rendered by **`DsButton`**. Keep client + server schemas aligned (`lib/utils/button-types.js` ↔ `server/.../button.schema.js`).

## Components

| Component | Role |
|-----------|------|
| `DsButton` | Single button — Link / `<a>` / `<button>` by action |
| `SectionButtons` | Maps `buttons[]` (or legacy `button_title` + `target_url`) |
| `SectionButtonsFooter` | Standard footer under `SectionFrame` + CMS pencil |
| `CmsButtonsEditor` | CMS editor UI |
| `HeaderContactButton` | Site header CTA wrapper |

CSS: `src/app/section-buttons.css` (base class `.section-btn`).

Constants: `DS_BUTTON` in `section-design-system.js`.

---

## Button object shape

```js
{
  label: "Contact us",
  variant: "primary",      // see variants
  size: "md",              // sm | md | lg
  shape: "rounded",        // rounded | pill | square
  icon: "auto",            // preset or none
  icon_position: "start",  // start | end
  action_type: "url",
  target_url: "/contact-us",
  target_id: "",           // for anchor (without #)
  form_key: "",
  open_in_new_tab: false,
  full_width: false,
  aria_label: "",
  download_filename: "",
  // optional Tailwind ! overrides
  cls_bg: "", cls_text: "", cls_border: "",
  cls_hover_bg: "", cls_hover_text: "", cls_hover_border: "",
  sort_order: 0,
  status: true,
}
```

Normalize with `normalizeButton()` before trusting values.

---

## Variants

| Variant | Class | Typical use |
|---------|-------|-------------|
| `primary` | `section-btn--primary` | Main CTA |
| `secondary` | `section-btn--secondary` | Glass / secondary on dark |
| `outline` | `section-btn--outline` | Secondary outline |
| `ghost` | `section-btn--ghost` | Low emphasis |
| `link` | `section-btn--link` | Text link style |
| `inverse` | `section-btn--inverse` | Inverse fill |
| `danger` | `section-btn--danger` | Destructive |

Dark-band CTA pair (recommended):

```js
DS_BUTTON.darkCtaSet
// [{ variant: "primary", … }, { variant: "outline", … }]
```

---

## Action types

| `action_type` | Behavior |
|---------------|----------|
| `url` | Internal `Link` or external `<a>` |
| `anchor` | `#target_id` on-page |
| `form` | Calls `onFormOpen(form_key)` |
| `youtube` | Opens embed modal |
| `email` / `phone` | `mailto:` / `tel:` |
| `download` | File download |
| `scroll_top` | Smooth scroll to top |

---

## Surfaces (critical on dark bands)

Buttons inherit band/card tokens. Force palette when needed:

```jsx
<DsButton button={btn} surface="light" />   // white card on dark band
<DsButton button={btn} surface="dark" />    // glass / dark CTA
<DsButton button={btn} inverted />          // legacy alias → dark
```

Or data attrs from `DS_BUTTON.surfaceLight` / `surfaceDark`.

`SectionButtons` accepts `surface` and `inverted` and passes them through.

---

## Usage examples

```jsx
import DsButton from "@/components/ui/DsButton";
import SectionButtons from "@/components/ui/SectionButtons";

<DsButton
  button={{
    label: "Get started",
    variant: "primary",
    size: "md",
    action_type: "url",
    target_url: "/courses",
  }}
/>

<SectionButtons
  buttons={section.buttons}
  onFormOpen={onFormOpen}
  inverted={darkBand}
/>
```

Custom color tokens (CSS variables):

```jsx
<DsButton
  button={btn}
  custom={{ bg: "#fff", fg: "#0b1f4d", hoverBg: "#f1f5f9" }}
/>
```

Maps to `--ds-btn-custom-*` (see `buttonCustomStyle` / `DS_BUTTON.customTokens`).

---

## Visibility utilities vs `.section-btn`

`.section-btn { display: inline-flex }` is **unlayered CSS**, so Tailwind `hidden` on the same node can lose.

**Do this:**

```jsx
<span className="hidden lg:contents">
  <HeaderContactButton />
</span>
```

**Avoid:** `className="hidden lg:inline-flex"` directly on `DsButton` expecting it to hide.

---

## Graphify

`DsButton` is a hub (~25 edges): `SectionButtons`, header, search, catalog, CMS editor, pricing, contact forms. Changing button contracts ripples widely — prefer extending via `normalizeButton` + CSS variants over one-off class hacks.
