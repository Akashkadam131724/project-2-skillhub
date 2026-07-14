import mongoose from "mongoose";
import Page from "./page.model.js";
import Section, { normalizeContentScope } from "./section.model.js";
import EntityPageSection from "./entity-page-section.model.js";

/** Overridable on page tags / entity mappings */
const MAPPING_CONTENT_KEYS = [
  "section_title",
  "sub_title",
  "in_page_nav_title",
  "section_bg_img",
  "section_img_url",
  "data",
];

/** Legacy single-CTA — still exposed from Section defaults for fallback UI */
const SECTION_ONLY_KEYS = ["button_title", "target_url"];

/**
 * Array fields: present array wins (including []); missing → fallback.
 */
function pickArrayField(field, ...sources) {
  for (const source of sources) {
    if (source != null && Array.isArray(source[field])) return source[field];
  }
  return [];
}

function pickMappingContent(source, fallback) {
  const out = {};
  for (const key of MAPPING_CONTENT_KEYS) {
    const value = source?.[key];
    if (value !== null && value !== undefined) {
      out[key] = value;
    } else {
      out[key] = fallback?.[key] ?? (key === "data" ? {} : "");
    }
  }
  return out;
}

/**
 * @param {object|null} override - EntityPageSection (or null)
 * @param {object|null} tag - Section.pages[] tag
 * @param {object} section - Section doc
 */
function pickPlacementContent(override, tag, section) {
  const scope = normalizeContentScope(section?.content_scope);

  if (scope === "global") {
    const content = pickMappingContent(section, null);
    content.buttons = Array.isArray(section.buttons) ? section.buttons : [];
    content.items = Array.isArray(section.items) ? section.items : [];
    content.content_scope = "global";
    return content;
  }

  if (scope === "template") {
    // Template + Section only — ignore entity content overrides
    const fromSection = pickMappingContent(section, null);
    const content = pickMappingContent(tag, fromSection);
    content.buttons = pickArrayField("buttons", tag, section);
    content.items = pickArrayField("items", tag, section);
    content.content_scope = "template";
    return content;
  }

  // page (full cascade)
  const fromSection = pickMappingContent(section, null);
  const fromTag = pickMappingContent(tag, fromSection);
  const content = pickMappingContent(override, fromTag);
  content.buttons = pickArrayField("buttons", override, tag, section);
  content.items = pickArrayField("items", override, tag, section);
  content.content_scope = "page";
  return content;
}

function withSectionMeta(content, section, tag = null) {
  const out = { ...content };
  for (const key of SECTION_ONLY_KEYS) {
    out[key] = section?.[key] ?? "";
  }
  // Copied onto page tag at map time; fall back to live section default
  const copied = tag?.section_preview_img;
  out.section_preview_img =
    copied !== null && copied !== undefined && copied !== ""
      ? copied
      : section?.section_preview_img ?? "";
  return out;
}

/**
 * Resolve visible section placements for a page (+ optional entity).
 *
 * Includes:
 *  - Template Section.pages[] tags (with entity overrides when cascading)
 *  - Entity-only extras (EntityPageSection with page_tag_id null)
 *
 * content_scope:
 *  - global   → always Section content/items/buttons
 *  - template → tag → Section (entity content ignored)
 *  - page     → entity → tag → Section
 */
export async function resolvePageSections(pageKey, entityId = null) {
  const key = String(pageKey).toLowerCase();

  const page = await Page.findByKey(key).lean();
  if (!page) {
    return { error: { status: 404, message: "Page not found" } };
  }
  if (!page.status) {
    return {
      page,
      sections: [],
      meta: { reason: "page_disabled" },
    };
  }

  const sections = await Section.find({
    "pages.page_key": key,
  }).lean();

  const sectionById = new Map(sections.map((s) => [String(s._id), s]));
  const sectionByKey = new Map(sections.map((s) => [s.key, s]));

  let entityDocs = [];
  if (entityId && mongoose.Types.ObjectId.isValid(entityId)) {
    entityDocs = await EntityPageSection.find({
      page_key: key,
      entity_id: entityId,
    }).lean();
  }

  const overridesByTagId = new Map(
    entityDocs
      .filter((o) => o.page_tag_id)
      .map((o) => [String(o.page_tag_id), o])
  );
  const entityExtras = entityDocs.filter((o) => !o.page_tag_id);

  // Ensure section docs for extras are loaded
  const missingKeys = entityExtras
    .map((e) => e.section_key)
    .filter((k) => !sectionByKey.has(k));
  if (missingKeys.length) {
    const extraSections = await Section.find({
      key: { $in: [...new Set(missingKeys)] },
    }).lean();
    for (const s of extraSections) {
      sectionById.set(String(s._id), s);
      sectionByKey.set(s.key, s);
    }
  }

  const resolved = [];
  let taggedCount = 0;

  // 1) Template placements
  for (const section of sectionById.values()) {
    if (!section.status) continue;

    const tags = (section.pages || []).filter((p) => p.page_key === key);
    taggedCount += tags.length;

    for (const tag of tags) {
      const override = overridesByTagId.get(String(tag._id));
      const templateEnabled = tag.status !== false;
      const entityStatus = override?.status;

      if (entityStatus === false) continue;
      if (entityStatus !== true && !templateEnabled) continue;

      const content = withSectionMeta(
        pickPlacementContent(override, tag, section),
        section,
        tag
      );

      // Template sort wins when Page.is_sort_disabled (default true).
      // Entity extras always use EntityPageSection.sort_order (see below).
      // When page-level sort is enabled, prefer EntityPageSection mapping sort.
      const sortDisabled = page.is_sort_disabled !== false;
      const sort_order =
        !sortDisabled &&
        override?.sort_order !== null &&
        override?.sort_order !== undefined
          ? override.sort_order
          : tag.sort_order;

      resolved.push({
        section_key: section.key,
        section_id: section._id,
        page_tag_id: tag._id,
        placement_id: String(tag._id),
        is_entity_extra: false,
        name: section.name,
        content_scope: normalizeContentScope(section.content_scope),
        sort_order,
        ...content,
        status: {
          global: section.status,
          template: tag.status,
          entity: entityStatus ?? null,
          effective: true,
        },
        sources: {
          page_tag_id: tag._id,
          entity_page_section_id: override?._id ?? null,
        },
      });
    }
  }

  // 2) Entity-only extras (this page only — can duplicate a section)
  const sortDisabled = page.is_sort_disabled !== false;
  for (const extra of entityExtras) {
    if (extra.status === false) continue;

    const section =
      sectionByKey.get(extra.section_key) ||
      sectionById.get(String(extra.section));
    if (!section || !section.status) continue;

    const content = withSectionMeta(
      pickPlacementContent(extra, null, section),
      section,
      null
    );

    resolved.push({
      section_key: section.key,
      section_id: section._id,
      page_tag_id: null,
      placement_id: String(extra._id),
      is_entity_extra: true,
      name: section.name,
      content_scope: normalizeContentScope(section.content_scope),
      sort_order: extra.sort_order ?? 999,
      ...content,
      status: {
        global: section.status,
        template: null,
        entity: extra.status ?? true,
        effective: true,
      },
      sources: {
        page_tag_id: null,
        entity_page_section_id: extra._id,
      },
    });
  }

  resolved.sort((a, b) => a.sort_order - b.sort_order);

  return {
    page: {
      key: page.key,
      name: page.name,
      entity_type: page.entity_type,
      is_sort_disabled: page.is_sort_disabled !== false,
    },
    entity_id: entityId || null,
    sections: resolved,
    meta: {
      tagged: taggedCount,
      entity_extras: entityExtras.length,
      visible: resolved.length,
      sort_disabled: sortDisabled,
    },
  };
}
