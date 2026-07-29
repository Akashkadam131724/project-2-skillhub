import { seedSafeMode, logSafeMode } from "./seed-env.js";

/**
 * Apply entity-only placements (page_tag_id null) or tagged overrides.
 * In safe mode: upsert per section — does not delete existing extras on that entity.
 */
export async function replaceEntityExtras(
  EntityPageSection,
  { pageKey, entityId, placements, sectionByKey, pageTagId = null }
) {
  const safe = seedSafeMode();
  if (safe) {
    logSafeMode(
      `upsert ${placements.length} placement(s) · page=${pageKey} entity=${entityId}`
    );
  } else {
    await EntityPageSection.deleteMany({
      page_key: pageKey,
      entity_id: entityId,
      page_tag_id: pageTagId,
    });
  }

  for (const p of placements) {
    const section = sectionByKey.get(p.section_key);
    if (!section) {
      console.warn(`  ! missing section ${p.section_key} — skip`);
      continue;
    }

    const doc = {
      page_key: pageKey,
      entity_id: entityId,
      page_tag_id: pageTagId,
      section: section._id,
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
    };

    if (safe) {
      const filter = {
        page_key: pageKey,
        entity_id: entityId,
        page_tag_id: pageTagId,
        section: section._id,
      };
      await EntityPageSection.findOneAndUpdate(
        filter,
        { $set: doc },
        { upsert: true, new: true }
      );
    } else {
      await EntityPageSection.create(doc);
    }
  }
}

/**
 * Upsert EntityPageSection rows keyed by page_tag_id (entity CMS overrides).
 */
export async function upsertEntityOverrides(EntityPageSection, docs) {
  if (!docs.length) return 0;
  const safe = seedSafeMode();
  let n = 0;
  for (const doc of docs) {
    const filter = {
      page_key: doc.page_key,
      entity_id: doc.entity_id,
      page_tag_id: doc.page_tag_id,
    };
    if (safe) {
      await EntityPageSection.findOneAndUpdate(
        filter,
        { $set: doc },
        { upsert: true }
      );
      n += 1;
    } else {
      // batch path uses insertMany after global delete
      n += 1;
    }
  }
  return n;
}
