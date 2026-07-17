/**
 * Seeds a client-facing CMS showcase Content page at /cms-preview.
 * Uses screenshots from uploads/cms-showcase/ (run capture:cms-showcase first).
 *
 * Usage:
 *   npm run capture:cms-showcase
 *   npm run seed:cms-preview
 */
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Content from "../modules/content/content.model.js";
import Page from "../modules/cms/page.model.js";
import Section from "../modules/cms/section.model.js";
import EntityPageSection from "../modules/cms/entity-page-section.model.js";
import { getSectionCatalogMeta } from "../modules/cms/section.catalog.js";

function btn(label, opts = {}) {
  return {
    label,
    variant: opts.variant || "primary",
    action_type: opts.action_type || "url",
    target_url: opts.target_url || "",
    target_id: opts.target_id || "",
    form_key: opts.form_key || "",
    open_in_new_tab: Boolean(opts.open_in_new_tab),
    sort_order: opts.sort_order ?? 0,
    status: opts.status !== false,
  };
}

function item(fields, i = 0) {
  return {
    title: "",
    subtitle: "",
    body: "",
    label: "",
    value: "",
    image_url: "",
    icon: "",
    href: "",
    buttons: [],
    sort_order: i,
    status: true,
    ...fields,
  };
}

/** Screenshot paths from capture:cms-showcase */
const SHOT = {
  home: "/uploads/cms-showcase/cms-home.png",
  contents: "/uploads/cms-showcase/cms-contents.png",
  pages: "/uploads/cms-showcase/cms-pages.png",
  pageHome: "/uploads/cms-showcase/cms-page-home.png",
  sections: "/uploads/cms-showcase/cms-sections.png",
  sectionsPreviews: "/uploads/cms-showcase/cms-sections-previews.png",
  theme: "/uploads/cms-showcase/cms-site-theme.png",
  vendors: "/uploads/cms-showcase/cms-vendors.png",
  products: "/uploads/cms-showcase/cms-products.png",
  courses: "/uploads/cms-showcase/cms-courses.png",
  blogs: "/uploads/cms-showcase/cms-blogs.png",
  live: "/uploads/cms-showcase/live-cms-mode.png",
  livePreviews: "/uploads/cms-showcase/live-cms-previews.png",
  liveSettings: "/uploads/cms-showcase/live-cms-settings.png",
  vendorLive: "/uploads/cms-showcase/live-vendor-cms.png",
};

const SECTION_DEFS = [
  {
    key: "in_page_nav",
    name: "In-page Nav",
    description: "Sticky section jump links",
    content_scope: "page",
  },
  {
    key: "hero_centered",
    name: "Hero Centered",
    description: "Centered hero with CTAs",
    content_scope: "page",
  },
  {
    key: "metric_rail",
    name: "Metric Rail",
    description: "Metric strip",
    content_scope: "page",
  },
  {
    key: "feature_tabs",
    name: "Feature Tabs",
    description: "Tabbed features with preview",
    content_scope: "page",
  },
  {
    key: "feature_spotlight",
    name: "Feature Spotlight",
    description: "Asymmetric spotlight cards",
    content_scope: "page",
  },
  {
    key: "horizon_gallery",
    name: "Horizon Gallery",
    description: "Horizontal snap gallery",
    content_scope: "page",
  },
  {
    key: "split_narrative",
    name: "Split Narrative",
    description: "Sticky media + chapters",
    content_scope: "page",
  },
  {
    key: "builder_feature_cards",
    name: "Builder Feature Cards",
    description: "Feature card grid",
    content_scope: "page",
  },
  {
    key: "cta_band",
    name: "CTA Band",
    description: "Full-bleed call to action",
    content_scope: "page",
  },
];

const PLACEMENTS = [
  { section_key: "in_page_nav", sort_order: 0 },
  {
    section_key: "hero_centered",
    sort_order: 1,
    in_page_nav_title: "Overview",
    section_title: "SkillHub CMS",
    sub_title:
      "A visual content system for marketing pages, catalogs, and entity detail pages — edit live on the site, manage sections globally, and ship without waiting on engineering.",
    buttons: [
      btn("Try live edit", {
        target_url: "/?cms=true",
        sort_order: 0,
      }),
      btn("Open CMS home", {
        variant: "secondary",
        target_url: "/cms",
        sort_order: 1,
      }),
    ],
  },
  {
    section_key: "metric_rail",
    sort_order: 2,
    in_page_nav_title: "Scope",
    section_title: "What this CMS covers",
    items: [
      item({ value: "50+", title: "Section types", subtitle: "Reusable layouts" }, 0),
      item({ value: "3", title: "Content layers", subtitle: "Global · Template · Page" }, 1),
      item({ value: "Live", title: "On-page editing", subtitle: "?cms=true mode" }, 2),
      item({ value: "Full", title: "Entity pages", subtitle: "Vendors, products, courses…" }, 3),
    ],
  },
  {
    section_key: "feature_tabs",
    sort_order: 3,
    in_page_nav_title: "Capabilities",
    section_title: "Everything your team can do",
    sub_title:
      "From free-form content pages to catalog entities — one editing model across the site.",
    items: [
      item(
        {
          label: "Live edit",
          title: "Edit on the real page",
          subtitle: "What you see is what ships",
          body: "<p>Flip <strong>CMS mode</strong> on any public page. The emerald bar unlocks section toolbars, field pencils, page settings, theme overrides, and a stacked preview of section screenshots.</p><p>No separate preview environment — marketers edit the live layout with draft-safe controls.</p>",
          image_url: SHOT.live,
        },
        0
      ),
      item(
        {
          label: "Templates",
          title: "Page templates",
          subtitle: "Home, vendor, product, content…",
          body: "<p>Each page type has a template of section placements. Add, reorder, hide, and override copy at the template layer — then refine per entity when needed.</p>",
          image_url: SHOT.pages,
        },
        1
      ),
      item(
        {
          label: "Sections",
          title: "Global section library",
          subtitle: "One catalog, many pages",
          body: "<p>Register every section type once. Set default titles, images, and cards globally — then place them on templates. Preview thumbs and full-width gallery mode help pick the right layout.</p>",
          image_url: SHOT.sectionsPreviews,
        },
        2
      ),
      item(
        {
          label: "Theme",
          title: "Brand & surfaces",
          subtitle: "Site → template → page",
          body: "<p>Control brand colors and alternating section surfaces from Site theme. Override per template or per entity page without touching code.</p>",
          image_url: SHOT.theme,
        },
        3
      ),
      item(
        {
          label: "Entities",
          title: "Catalog CMS",
          subtitle: "Vendors, products, courses, blogs",
          body: "<p>CRUD for every catalog entity, plus deep links into that entity’s live page with CMS mode on — so product marketing can update a vendor page in context.</p>",
          image_url: SHOT.vendors,
        },
        4
      ),
    ],
  },
  {
    section_key: "feature_spotlight",
    sort_order: 4,
    in_page_nav_title: "Live mode",
    section_title: "On-page CMS mode",
    sub_title:
      "The green bar is the control plane — previews, settings, and exit — without leaving the customer-facing URL.",
    items: [
      item(
        {
          title: "CMS bar & section toolbars",
          subtitle: "Edit titles, cards, images, and visibility",
          body: "<p>Each section gets a toolbar: preview thumb, page-only badge, hide/show, background, and field shortcuts. Inline pencils open drawers for rich text, buttons, and structured cards.</p>",
          image_url: SHOT.live,
          href: "/?cms=true",
        },
        0
      ),
      item(
        {
          title: "Section preview toggle",
          subtitle: "Screenshot wireframe of the whole page",
          body: "<p>Turn <strong>Previews on</strong> to replace live sections with captured section images — perfect for reviewing layout order before diving into content edits.</p>",
          image_url: SHOT.livePreviews,
        },
        1
      ),
      item(
        {
          title: "Page settings drawer",
          subtitle: "Mapped sections · Add · Preview · Theme",
          body: "<p>Open the gear to manage placements for this page only, search the section catalog with filters, see a stacked preview, and tune entity theme overrides.</p>",
          image_url: SHOT.liveSettings,
        },
        2
      ),
      item(
        {
          title: "Works on entity pages too",
          subtitle: "Vendor, product, course, industry…",
          body: "<p>The same live editor powers catalog detail pages — add page-only sections, override template copy, and keep global defaults locked when content scope requires it.</p>",
          image_url: SHOT.vendorLive,
          href: "/vendor/aws?cms=true",
        },
        3
      ),
    ],
  },
  {
    section_key: "horizon_gallery",
    sort_order: 5,
    in_page_nav_title: "Admin",
    section_title: "CMS admin screens",
    sub_title:
      "Every admin surface — captured from the running app — so stakeholders can see the full toolkit.",
    items: [
      item({ title: "CMS home", subtitle: "Quick links & nav refresh", image_url: SHOT.home }, 0),
      item({ title: "Content pages", subtitle: "Free-form URLs like /about-us", image_url: SHOT.contents }, 1),
      item({ title: "Page templates", subtitle: "Placements by page type", image_url: SHOT.pages }, 2),
      item({ title: "Home template", subtitle: "Section order & overrides", image_url: SHOT.pageHome }, 3),
      item({ title: "Section library", subtitle: "Filters + preview thumbs", image_url: SHOT.sections }, 4),
      item({ title: "Section previews", subtitle: "Full-width gallery mode", image_url: SHOT.sectionsPreviews }, 5),
      item({ title: "Site theme", subtitle: "Brand & surface tones", image_url: SHOT.theme }, 6),
      item({ title: "Vendors", subtitle: "Entity list → live CMS", image_url: SHOT.vendors }, 7),
      item({ title: "Products", subtitle: "Catalog CMS", image_url: SHOT.products }, 8),
      item({ title: "Courses", subtitle: "Learning catalog", image_url: SHOT.courses }, 9),
      item({ title: "Blogs", subtitle: "Editorial CMS", image_url: SHOT.blogs }, 10),
    ],
  },
  {
    section_key: "split_narrative",
    sort_order: 6,
    in_page_nav_title: "Workflow",
    section_title: "How teams publish",
    sub_title: "A simple loop from library → template → live page.",
    items: [
      item(
        {
          title: "1. Register sections",
          subtitle: "Global defaults",
          body: "<p>Define section types once in <strong>Content sections</strong>. Upload preview images, set default titles and cards, and choose content scope (global, template, or page).</p>",
          image_url: SHOT.sections,
        },
        0
      ),
      item(
        {
          title: "2. Place on templates",
          subtitle: "Home, vendor, content…",
          body: "<p>Attach sections to a page template, set sort order, and lock fields that should not change per entity. Template CMS lives under <strong>/cms/pages</strong>.</p>",
          image_url: SHOT.pageHome,
        },
        1
      ),
      item(
        {
          title: "3. Edit live",
          subtitle: "Per page / per entity",
          body: "<p>Open the public URL with <code>?cms=true</code>. Adjust copy, images, cards, and page-only extras. Theme overrides cascade site → template → page.</p>",
          image_url: SHOT.liveSettings,
        },
        2
      ),
      item(
        {
          title: "4. Ship free-form pages",
          subtitle: "Content catalog",
          body: "<p>Create paths like <strong>/cms-preview</strong> or <strong>/about-us</strong> in Content pages — blank canvas on the <code>content</code> template, fully editable in live mode.</p>",
          image_url: SHOT.contents,
        },
        3
      ),
    ],
  },
  {
    section_key: "builder_feature_cards",
    sort_order: 7,
    in_page_nav_title: "Features",
    section_title: "Feature checklist",
    sub_title: "Talking points for a client walkthrough.",
    items: [
      item(
        {
          title: "Live CMS mode",
          subtitle: "Emerald control bar on any page",
          body: "Toggle CMS on/off, exit cleanly, open page settings.",
        },
        0
      ),
      item(
        {
          title: "Section toolbars",
          subtitle: "Per-section chrome",
          body: "Preview thumb, hide/show, background, nav title, remove page-only extras.",
        },
        1
      ),
      item(
        {
          title: "Field drawers",
          subtitle: "Titles, rich text, buttons, cards",
          body: "Structured editors match each section’s layout — not a generic form dump.",
        },
        2
      ),
      item(
        {
          title: "Three-layer content",
          subtitle: "Global → template → page",
          body: "Cascade with locks so brand defaults stay safe while pages stay flexible.",
        },
        3
      ),
      item(
        {
          title: "Section previews",
          subtitle: "Screenshot library",
          body: "Thumbs in admin lists, full gallery toggle, and on-page preview mode.",
        },
        4
      ),
      item(
        {
          title: "Theme system",
          subtitle: "Brand + surfaces",
          body: "Site theme with template and entity overrides via PageThemeShell.",
        },
        5
      ),
      item(
        {
          title: "Entity CMS",
          subtitle: "Vendors through blogs",
          body: "List/edit entities and jump straight into that entity’s live CMS page.",
        },
        6
      ),
      item(
        {
          title: "Content pages",
          subtitle: "Any URL path",
          body: "Marketing pages without a new deploy — this /cms-preview page is one of them.",
        },
        7
      ),
    ],
  },
  {
    section_key: "cta_band",
    sort_order: 8,
    in_page_nav_title: "Try it",
    section_title: "Walk the product with us",
    sub_title:
      "Open live CMS on the homepage, or start from the CMS dashboard. This showcase page itself is a Content page — editable the same way.",
    buttons: [
      btn("Homepage live CMS", {
        target_url: "/?cms=true",
        sort_order: 0,
      }),
      btn("CMS dashboard", {
        variant: "secondary",
        target_url: "/cms",
        sort_order: 1,
      }),
      btn("Edit this page", {
        variant: "secondary",
        target_url: "/cms-preview?cms=true",
        sort_order: 2,
      }),
    ],
  },
];

async function ensureSection(def) {
  const catalog = getSectionCatalogMeta(def.key) || {};
  let section = await Section.findOne({ key: def.key });
  if (!section) {
    section = await Section.create({
      key: def.key,
      name: def.name,
      description: def.description || "",
      status: true,
      category: catalog.category || "",
      tags: catalog.tags || [],
      content_scope: def.content_scope || "page",
    });
    console.log(`  + section ${def.key}`);
  } else {
    let dirty = false;
    if (!section.name && def.name) {
      section.name = def.name;
      dirty = true;
    }
    if (catalog.category && section.category !== catalog.category) {
      section.category = catalog.category;
      dirty = true;
    }
    if (dirty) await section.save();
  }
  return section;
}

async function ensureContentPage() {
  return Page.findOneAndUpdate(
    { key: "content" },
    {
      $set: {
        key: "content",
        name: "Content page",
        description: "Free-form content pages.",
        entity_type: "content",
        status: true,
        is_sort_disabled: false,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function replaceExtras(pageKey, entityId, placements, sectionByKey) {
  await EntityPageSection.deleteMany({
    page_key: pageKey,
    entity_id: entityId,
    page_tag_id: null,
  });

  for (const p of placements) {
    const section = sectionByKey.get(p.section_key);
    if (!section) {
      console.warn(`  ! missing section ${p.section_key} — skip`);
      continue;
    }
    await EntityPageSection.create({
      page_key: pageKey,
      entity_id: entityId,
      page_tag_id: null,
      section: section._id,
      section_key: section.key,
      sort_order: p.sort_order,
      status: p.status !== false,
      section_title: p.section_title ?? null,
      sub_title: p.sub_title ?? null,
      in_page_nav_title: p.in_page_nav_title ?? null,
      section_bg_img: p.section_bg_img ?? null,
      section_bg_color: p.section_bg_color ?? null,
      section_img_url: p.section_img_url ?? null,
      data: p.data ?? null,
      buttons: Array.isArray(p.buttons) ? p.buttons : undefined,
      items: Array.isArray(p.items) ? p.items : undefined,
    });
  }
}

async function seed() {
  await connectDB();
  console.log("Seeding CMS preview showcase content page…");

  await ensureContentPage();

  const sectionByKey = new Map();
  for (const def of SECTION_DEFS) {
    const section = await ensureSection(def);
    sectionByKey.set(def.key, section);
  }

  const content = await Content.findOneAndUpdate(
    { path: "/cms-preview" },
    {
      $set: {
        path: "/cms-preview",
        slug: "cms-preview",
        name: "CMS Preview",
        description:
          "Client showcase of SkillHub CMS — live edit, section library, templates, theme, and entity admin. Screenshots captured from the running app.",
        status: "active",
        sortOrder: 5,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
  );

  await replaceExtras("content", content._id, PLACEMENTS, sectionByKey);

  console.log(
    `  ✓ /cms-preview (${PLACEMENTS.length} sections) — ${content._id}`
  );
  console.log("Done. Open http://localhost:3001/cms-preview");
  console.log("Live edit: http://localhost:3001/cms-preview?cms=true");
  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
