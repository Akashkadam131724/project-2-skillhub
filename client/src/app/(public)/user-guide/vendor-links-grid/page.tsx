import type { Metadata } from "next";
import Link from "next/link";
import { VendorLinksGridStatic } from "@/components/sections/content/vendor-links-grid";
import SectionWrapper from "@/components/sections/SectionWrapper";
import GuideStepsPanel, {
  type GuideStep,
} from "@/app/(public)/user-guide/_components/GuideStepsPanel";

export const metadata: Metadata = {
  title: "Vendor link grid · SkillHub",
  description:
    "Static UI preview and full integration steps for vendor_link_grid.",
};

const BUILD_STEPS: GuideStep[] = [
  {
    title: "Ui + Static",
    detail:
      "VendorLinksGridUi (left copy + link grid), VendorLinksGridStatic, VendorLinksGridLinkCard. Gradient decor uses var(--ink) and var(--brand).",
    status: "done",
  },
  {
    title: "lib/ adapters",
    detail:
      "types.ts, static-demo.ts, map.ts (items → links + static fallback), placement.ts, band.ts, cms-config (title, href, image_url per row).",
    status: "done",
  },
  {
    title: "Public + Section adapters",
    detail:
      "VendorLinksGridPublicSection (public) and VendorLinksGridSection (CMS pencils on title, body, buttons, items).",
    status: "done",
  },
  {
    title: "Register in section-registry.js",
    detail:
      'SECTION_CATALOG key vendor_link_grid, content_scope: "global", category: content. Server section.catalog.js matches.',
    status: "done",
  },
  {
    title: "section-manifest.ts + registry-sync",
    detail:
      "loadPublic / loadStatic in manifest; VendorLinksGridSection in section-registry-sync.js for live edit.",
    status: "done",
  },
  {
    title: "configs/index.js",
    detail: "VENDOR_LINK_GRID_ITEMS_CONFIG registered for the items[] drawer.",
    status: "done",
  },
  {
    title: "lib/cms-capabilities.ts",
    detail:
      'mode: "content" — fields: section_title, body, buttons, items; sectionBand: true (light/dark/inherit + bg).',
    status: "done",
  },
  {
    title: "Section band + theme",
    detail:
      "Uses SectionBand inside SectionSurface (page alternation). Dark band → ink→brand gradient; light band → brand glow. Buttons invert on dark.",
    status: "done",
  },
  {
    title: "Reuse render_key",
    detail:
      "Additional DB section rows can use a different section_key with render_key: vendor_link_grid to share this UI.",
    status: "done",
  },
];

const CMS_STEPS: GuideStep[] = [
  {
    title: "Create global section row",
    detail:
      'Section key vendor_link_grid, content_scope global. Seed or CMS → Content sections → Vendor Link Grid.',
  },
  {
    title: "Edit global content (source layer)",
    detail:
      "Open /cms/pages-content-sections/vendor_link_grid — pencil icons on title, body, buttons, and vendor links. Saves catalog defaults for all pages.",
  },
  {
    title: "Add to page template",
    detail:
      "CMS → Pages → home (or other) → add mapping with section_key vendor_link_grid. Content is locked on template/entity editors.",
  },
  {
    title: "Live page editor",
    detail:
      "e.g. /cms/home/edit — section shows Global badge + Locked · edit source. Link opens global editor in a new tab. Visibility toggle still works here.",
  },
  {
    title: "Section band",
    detail:
      "Toolbar ⋮ → Section band… — set light / dark / inherit, background image or color. Gradient picks up site ink & brand when inherit/dark.",
  },
  {
    title: "Left column fields",
    detail:
      "Title (section_title), body (rich text in data.body), buttons at bottom of left column (SectionButtonsFooter).",
  },
  {
    title: "Right column — vendor links",
    detail:
      "items[] rows: label (title), URL (href), optional icon (image_url). Empty items on public pages fall back to built-in NetCom vendor list.",
  },
];

const DB_EXAMPLE = `{
  "key": "vendor_link_grid",
  "content_scope": "global",
  "section_key": "vendor_link_grid",
  "render_key": "vendor_link_grid"
}`;

export default function VendorLinksGridTestPage() {
  return (
    <main className="min-h-screen bg-transparent">
      <SectionWrapper className="py-8 sm:py-10">
        <p className="m-0 text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
          <Link href="/user-guide" className="hover:underline">
            User guide
          </Link>
          {" / Vendor link grid"}
        </p>
        <h1 className="section-theme-heading mt-2 mb-0 text-2xl font-semibold tracking-tight sm:text-3xl">
          Vendor link grid
        </h1>
        <p className="section-theme-muted mt-3 mb-0 max-w-3xl text-sm leading-relaxed">
          Legacy port of <strong>TWListOfLinksSection</strong>. Behavior key:{" "}
          <code className="text-xs">vendor_link_grid</code> (global content).
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <GuideStepsPanel title="Developer — build & register" steps={BUILD_STEPS} />
          <GuideStepsPanel title="CMS — edit & publish" steps={CMS_STEPS} />
        </div>

        <div className="section-theme-muted mt-6 rounded-2xl border border-slate-200 p-5 text-sm dark:border-slate-800">
          <p className="section-theme-heading m-0 font-medium">
            Example section + placement
          </p>
          <pre className="mt-3 mb-0 overflow-x-auto rounded-lg bg-slate-50 p-3 text-xs dark:bg-slate-900">
            {DB_EXAMPLE}
          </pre>
          <p className="m-0 mt-3 text-xs leading-relaxed">
            Global scope: edit copy and links only at{" "}
            <code className="text-xs">/cms/pages-content-sections/vendor_link_grid</code>
            . Page live edit controls visibility and band overrides where allowed.
          </p>
        </div>
      </SectionWrapper>

      <VendorLinksGridStatic />

      <SectionWrapper className="border-t border-slate-200 py-8 dark:border-slate-800">
        <p className="section-theme-muted m-0 text-sm">
          Source:{" "}
          <code className="text-xs">
            components/sections/content/vendor-links-grid/
          </code>
        </p>
      </SectionWrapper>
    </main>
  );
}
