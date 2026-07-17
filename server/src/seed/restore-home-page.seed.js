import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Content from "../modules/content/content.model.js";
import Page from "../modules/cms/page.model.js";
import Section from "../modules/cms/section.model.js";
import EntityPageSection from "../modules/cms/entity-page-section.model.js";

/**
 * Reverse of migrate-home-to-content:
 * Restore Page key `home` and move homepage entity extras (page_key=content
 * on Content path `/`) back onto Section.pages tags with page_key=home.
 *
 * Usage:
 *   npm run seed:restore-home-page
 */

const HOME_PAGE_KEY = "home";
const CONTENT_PAGE_KEY = "content";

async function restoreHomePage() {
  await Page.findOneAndUpdate(
    { key: HOME_PAGE_KEY },
    {
      $set: {
        key: HOME_PAGE_KEY,
        name: "Home",
        description:
          "Marketing home page template (separate for page-level permissions)",
        entity_type: "content",
        status: true,
        is_sort_disabled: true,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log("Upserted Page template: home");

  await Page.findOneAndUpdate(
    { key: CONTENT_PAGE_KEY },
    {
      $set: {
        key: CONTENT_PAGE_KEY,
        name: "Content pages",
        description: "Free-form content pages. No predefined sections.",
        entity_type: "content",
        status: true,
        is_sort_disabled: false,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const homeContent = await Content.findOne({
    $or: [{ path: "/" }, { slug: "home" }],
  });
  if (!homeContent) {
    console.log("No Content for / — Page home restored; re-run seed:heroes");
    return;
  }

  const homePage = await Page.findByKey(HOME_PAGE_KEY);
  const extras = await EntityPageSection.find({
    page_key: CONTENT_PAGE_KEY,
    entity_id: homeContent._id,
    page_tag_id: null,
  });

  let restored = 0;
  for (const extra of extras) {
    const section = await Section.findOne({ key: extra.section_key });
    if (!section) continue;

    const tagPayload = {
      page: homePage._id,
      page_key: HOME_PAGE_KEY,
      sort_order: extra.sort_order ?? 0,
      status: extra.status !== false,
      section_title: extra.section_title ?? null,
      sub_title: extra.sub_title ?? null,
      in_page_nav_title: extra.in_page_nav_title ?? null,
      section_bg_img: extra.section_bg_img ?? null,
      section_bg_color: extra.section_bg_color ?? null,
      section_img_url: extra.section_img_url ?? null,
      data: extra.data ?? null,
      ...(extra.buttons !== undefined ? { buttons: extra.buttons } : {}),
      ...(extra.items !== undefined ? { items: extra.items } : {}),
    };

    const idx = (section.pages || []).findIndex(
      (p) => p.page_key === HOME_PAGE_KEY
    );
    if (idx >= 0) {
      const existing = section.pages[idx].toObject
        ? section.pages[idx].toObject()
        : section.pages[idx];
      section.pages[idx] = { ...existing, ...tagPayload };
    } else {
      section.pages.push(tagPayload);
    }
    await section.save();
    await EntityPageSection.deleteOne({ _id: extra._id });
    restored += 1;
  }

  console.log(
    `Restored ${restored} homepage placement(s) onto Page key=home and removed content-entity extras`
  );
}

async function main() {
  await connectDB();
  await restoreHomePage();
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
