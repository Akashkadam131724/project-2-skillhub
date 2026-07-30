import mongoose from "mongoose";
import connectDB from "../../../config/db.js";
import Vendor from "../../../modules/vendor/vendor.model.js";
import Navigation from "../../../modules/navigation/navigation.model.js";
import NavigationColumn from "../../../modules/navigation/navigation-column.model.js";
import NavigationLink from "../../../modules/navigation/navigation-link.model.js";
import { seedSafeMode, logSafeMode } from "../../lib/seed-env.js";
import { netcomNavigationSeedData } from "../../lib/netcom-category-content-pages.js";
import {
  ensureNavContentPages,
  validateNavUrls,
} from "../../lib/nav-content-sync.js";

/**
 * Seeds header navigation from NetCom CMS category tree (netcom-categories.json).
 *
 * Top-level menus: Trainings, Services, Solutions, Resources, Company
 *
 * Usage:
 *   npm run netcom:categories          # refresh JSON from NetCom (optional)
 *   npm run seed:step -- navigation
 */

const VENDOR_LIMIT = Number(process.env.NAV_VENDOR_LIMIT) || 30;

async function fetchCatalogData() {
  const vendors = await Vendor.find({ status: { $in: ["active", "pending"] } })
    .select("name slug status courseCount productCount")
    .sort({ courseCount: -1, name: 1 })
    .limit(VENDOR_LIMIT)
    .lean();

  console.log(`Fetched → vendors: ${vendors.length}`);
  return { vendors };
}

function buildSeedData({ vendors }) {
  const nav = netcomNavigationSeedData();
  nav.sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99));

  const trainings = nav.find((n) => n.name === "Trainings");
  if (trainings && vendors.length) {
    const vendorCol = trainings.columns.find((c) => c.name === "Training by Vendor");
    if (vendorCol) {
      const existingUrls = new Set(vendorCol.links.map((l) => l.url));
      for (const vendor of vendors) {
        const url = `/vendor/${vendor.slug}`;
        if (existingUrls.has(url)) continue;
        vendorCol.links.push({
          name: vendor.name,
          url,
          sort_order: 100 + vendorCol.links.length,
        });
      }
    }
  }

  return nav.map(({ sort_order: _sort, ...item }) => item);
}

async function clearNavigation() {
  await NavigationLink.deleteMany({});
  await NavigationColumn.deleteMany({});
  await Navigation.deleteMany({});
}

async function seed() {
  await connectDB();

  if (seedSafeMode()) {
    const existing = await Navigation.countDocuments();
    if (existing > 0) {
      logSafeMode(
        `navigation already has ${existing} top-level item(s) — skip (no wipe)`
      );
      await mongoose.disconnect();
      console.log("Done. Disconnected.");
      return;
    }
    logSafeMode("navigation empty — seeding header menu (no delete)");
  }

  try {
    await NavigationColumn.collection.dropIndex("name_1");
    console.log("Dropped unique index navigationcolumns.name_1");
  } catch (error) {
    if (error.codeName !== "IndexNotFound") {
      if (error.codeName !== "NamespaceNotFound") throw error;
    }
  }

  const catalog = await fetchCatalogData();
  const seedData = buildSeedData(catalog);

  const contentUpserts = await ensureNavContentPages(seedData);
  console.log(`  ✓ ensured ${contentUpserts} Content route(s) for header links`);

  const check = await validateNavUrls(seedData);
  if (check.missing.length) {
    console.warn(`  ! ${check.missing.length} nav link(s) missing server targets:`);
    for (const m of check.missing) {
      console.warn(`    ${m.url} — ${m.reason}`);
    }
  } else {
    console.log(`  ✓ all ${check.total} header link(s) resolve on server`);
  }

  if (!seedSafeMode()) {
    await clearNavigation();
    console.log("Cleared existing navigation collections");
  }

  let navOrder = 1;
  let columnOrder = 1;
  let linkOrder = 1;

  const navDocs = [];
  const columnDocs = [];
  const linkDocs = [];

  for (const navItem of seedData) {
    const navId = new mongoose.Types.ObjectId();
    navDocs.push({
      _id: navId,
      name: navItem.name,
      language: navItem.language,
      country: navItem.country,
      status: true,
      sort_order: navOrder++,
    });

    for (const columnItem of navItem.columns) {
      const columnId = new mongoose.Types.ObjectId();
      columnDocs.push({
        _id: columnId,
        name: columnItem.name,
        navigation: navId,
        status: true,
        sort_order: columnOrder++,
      });

      for (const linkItem of columnItem.links) {
        linkDocs.push({
          name: linkItem.name,
          url: linkItem.url,
          navigationColumn: columnId,
          status: true,
          sort_order: linkOrder++,
        });
      }
    }
  }

  await Navigation.insertMany(navDocs);
  await NavigationColumn.insertMany(columnDocs);
  await NavigationLink.insertMany(linkDocs);

  console.log(
    `Seeded → navigations: ${navDocs.length}, columns: ${columnDocs.length}, links: ${linkDocs.length}`
  );

  for (const nav of seedData) {
    console.log(`\n${nav.name}`);
    for (const col of nav.columns) {
      console.log(`  ▸ ${col.name} (${col.links.length})`);
    }
  }

  console.log("\nDone. GET http://localhost:3000/navigation");
}

try {
  await seed();
} catch (error) {
  console.error("Seed failed:", error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect().catch(() => {});
}
