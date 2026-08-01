#!/usr/bin/env node
/**
 * Enrich all CMS buttons with design-system fields inferred from label + link.
 *
 * Updates:
 *  - Section.buttons, Section.pages[].buttons, Section.items[].buttons
 *  - EntityPageSection.buttons, EntityPageSection.items[].buttons
 *
 * Usage:
 *   npm run buttons:enrich
 *   npm run buttons:enrich -- --dry-run
 *   npm run buttons:enrich -- --layout-only   # size md + shape rounded only
 */
import connectDB from "../src/config/db.js";
import Section from "../src/modules/cms/section.model.js";
import EntityPageSection from "../src/modules/cms/entity-page-section.model.js";
import {
  applyButtonsLayout,
  applyItemsLayout,
  enrichButton,
  enrichButtons,
  enrichItems,
} from "../src/modules/cms/button-enrich.utils.js";

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const useRandom = args.has("--random");
const layoutOnly = args.has("--layout-only");

function mapButtons(buttons) {
  const list = buttons.map((b) => b.toObject?.() ?? b);
  if (layoutOnly) return applyButtonsLayout(list);
  return enrichButtons(list, { random: useRandom });
}

function mapItems(items) {
  const list = items.map((it) => it.toObject?.() ?? it);
  if (layoutOnly) return applyItemsLayout(list);
  return enrichItems(list, { random: useRandom });
}

let sectionButtonCount = 0;
let tagButtonCount = 0;
let sectionItemButtonCount = 0;
let entityButtonCount = 0;
let entityItemButtonCount = 0;

function countButtons(arr) {
  return Array.isArray(arr) ? arr.length : 0;
}

async function processSections() {
  const sections = await Section.find({}).lean(false);
  let sectionsSaved = 0;

  for (const section of sections) {
    let dirty = false;

    if (Array.isArray(section.buttons) && section.buttons.length) {
      section.buttons = mapButtons(section.buttons);
      sectionButtonCount += section.buttons.length;
      dirty = true;
    }

    if (Array.isArray(section.items) && section.items.length) {
      const before = section.items.reduce(
        (n, it) => n + countButtons(it?.buttons),
        0
      );
      section.items = mapItems(section.items);
      sectionItemButtonCount += before;
      dirty = true;
    }

    if (Array.isArray(section.pages)) {
      for (const tag of section.pages) {
        if (!Array.isArray(tag.buttons) || !tag.buttons.length) continue;
        tag.buttons = mapButtons(tag.buttons);
        tagButtonCount += tag.buttons.length;
        dirty = true;
      }
    }

    if (dirty) {
      section.markModified("buttons");
      section.markModified("items");
      section.markModified("pages");
      if (!dryRun) await section.save();
      sectionsSaved += 1;
    }
  }

  return { sections: sections.length, sectionsSaved };
}

async function processEntityPageSections() {
  const rows = await EntityPageSection.find({}).lean(false);
  let rowsSaved = 0;

  for (const row of rows) {
    let dirty = false;

    if (Array.isArray(row.buttons) && row.buttons.length) {
      row.buttons = mapButtons(row.buttons);
      entityButtonCount += row.buttons.length;
      dirty = true;
    }

    if (Array.isArray(row.items) && row.items.length) {
      const before = row.items.reduce(
        (n, it) => n + countButtons(it?.buttons),
        0
      );
      row.items = mapItems(row.items);
      entityItemButtonCount += before;
      dirty = true;
    }

    if (dirty) {
      row.markModified("buttons");
      row.markModified("items");
      if (!dryRun) await row.save();
      rowsSaved += 1;
    }
  }

  return { rows: rows.length, rowsSaved };
}

async function main() {
  await connectDB();

  console.log(
    layoutOnly
      ? "Setting all buttons to size md + shape rounded…"
      : "Enriching CMS buttons from label + link…"
  );
  if (dryRun) console.log("  (dry run — no writes)");
  if (useRandom && !layoutOnly) console.log("  (random mode — styling varies each run)");

  const sectionStats = await processSections();
  const entityStats = await processEntityPageSections();

  const total =
    sectionButtonCount +
    tagButtonCount +
    sectionItemButtonCount +
    entityButtonCount +
    entityItemButtonCount;

  console.log("\nDone.");
  console.log(`  Sections scanned:     ${sectionStats.sections}`);
  console.log(`  Sections updated:     ${sectionStats.sectionsSaved}`);
  console.log(`  Entity rows scanned:  ${entityStats.rows}`);
  console.log(`  Entity rows updated:  ${entityStats.rowsSaved}`);
  console.log(`  Buttons enriched:`);
  console.log(`    section.buttons:        ${sectionButtonCount}`);
  console.log(`    section.pages[].buttons ${tagButtonCount}`);
  console.log(`    section.items[].buttons  ${sectionItemButtonCount}`);
  console.log(`    entity.buttons:         ${entityButtonCount}`);
  console.log(`    entity.items[].buttons   ${entityItemButtonCount}`);
  console.log(`    TOTAL:                  ${total}`);

  // Sample output
  const sample = enrichButton(
    {
      label: "Get started",
      target_url: "/courses",
      sort_order: 0,
    },
    { random: useRandom }
  );
  console.log("\n  Sample enrichment:");
  console.log(
    `    "${sample.label}" → ${sample.variant} ${sample.size} ${sample.shape}, icon=${sample.icon}@${sample.icon_position}, action=${sample.action_type}`
  );

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
