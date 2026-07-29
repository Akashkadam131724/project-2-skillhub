import Page from "../../modules/cms/page.model.js";
import Section from "../../modules/cms/section.model.js";
import EntityPageSection from "../../modules/cms/entity-page-section.model.js";
import { getSectionCatalogMeta } from "../../modules/cms/section.catalog.js";
import { resolveSectionCategoryId } from "../../modules/cms/section-category.utils.js";
import { replaceEntityExtras } from "./replace-entity-extras.js";

export function btn(label, opts = {}) {
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

export function item(fields, i = 0) {
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

export async function ensureContentPageTemplate() {
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

export async function ensureContent(doc) {
  const Content = (await import("../../modules/content/content.model.js"))
    .default;
  return Content.findOneAndUpdate(
    { path: doc.path },
    { $set: doc },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

export async function loadSectionsByKeys(keys) {
  const sectionByKey = new Map();
  for (const key of keys) {
    let section = await Section.findOne({ key });
    if (!section) {
      const catalog = getSectionCatalogMeta(key);
      const catId = catalog?.category
        ? await resolveSectionCategoryId(catalog.category)
        : null;
      section = await Section.create({
        key,
        name: key,
        description: "",
        status: true,
        content_scope: "page",
        ...(catId ? { section_category: catId } : {}),
        pages: [],
      });
      console.warn(`  + created missing section ${key}`);
    }
    sectionByKey.set(key, section);
  }
  return sectionByKey;
}

export async function applyContentPlacements(contentDoc, placements) {
  const keys = [...new Set(placements.map((p) => p.section_key))];
  const sectionByKey = await loadSectionsByKeys(keys);
  await replaceEntityExtras(EntityPageSection, {
    pageKey: "content",
    entityId: contentDoc._id,
    placements,
    sectionByKey,
    pageTagId: null,
  });
  return placements.length;
}

export function genericPlacements(content) {
  const title = content.name || "SkillHub";
  const desc =
    content.description ||
    "Explore programs, partners, and learning paths on SkillHub.";
  return [
    { section_key: "in_page_nav", sort_order: 0 },
    {
      section_key: "hero_centered",
      sort_order: 1,
      section_title: title,
      sub_title: desc,
      in_page_nav_title: "Intro",
    },
    {
      section_key: "overview",
      sort_order: 2,
      section_title: title,
      data: { body: `<p>${desc}</p>` },
      in_page_nav_title: "Overview",
    },
    {
      section_key: "cta_band",
      sort_order: 3,
      section_title: "Talk with our team",
      sub_title: "We can help you scope the right learning path.",
      buttons: [
        btn("Contact us", { target_url: "/contact-us", sort_order: 0 }),
        btn("Browse courses", {
          variant: "secondary",
          target_url: "/courses",
          sort_order: 1,
        }),
      ],
    },
  ];
}
