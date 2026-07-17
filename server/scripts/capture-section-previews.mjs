/**
 * Capture section screenshots → uploads/section-previews → Mongo section_preview_img
 *
 * The temporary /cms/section-gallery page was removed after the initial capture.
 * To re-capture, restore a gallery page (or set SECTION_GALLERY_URL) that renders
 * `[data-section-key]` nodes for each section, then run:
 *
 *   npx playwright install chromium
 *   npm run capture:section-previews
 *
 * Requires client on :3001 and Mongo available.
 */
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { chromium } from "playwright";
import connectDB from "../src/config/db.js";
import Section from "../src/modules/cms/section.model.js";
import { getSectionCatalogMeta } from "../src/modules/cms/section.catalog.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS = path.join(__dirname, "../uploads/section-previews");
const GALLERY_URL =
  process.env.SECTION_GALLERY_URL || "http://localhost:3001/cms/section-gallery";
const API_ORIGIN = process.env.PUBLIC_API_ORIGIN || "http://localhost:3000";

async function ensureSection(key) {
  const catalog = getSectionCatalogMeta(key) || {};
  let section = await Section.findOne({ key });
  if (!section) {
    section = await Section.create({
      key,
      name: key
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      description: "Auto-created from section gallery capture",
      status: true,
      category: catalog.category || "",
      tags: catalog.tags || [],
      content_scope: "page",
    });
    console.log(`  + created section ${key}`);
  }
  return section;
}

async function main() {
  await mkdir(UPLOADS, { recursive: true });
  await connectDB();

  console.log(`Opening ${GALLERY_URL}`);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1,
  });

  await page.goto(GALLERY_URL, { waitUntil: "networkidle", timeout: 120000 });
  // Let fonts / images settle
  await page.waitForTimeout(1500);

  const keys = await page.$$eval("[data-section-capture]", (nodes) =>
    nodes.map((n) => n.getAttribute("data-section-capture")).filter(Boolean)
  );

  console.log(`Found ${keys.length} sections to capture`);

  let ok = 0;
  let fail = 0;

  for (const key of keys) {
    try {
      const el = page.locator(`[data-section-capture="${key}"]`);
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);

      const filename = `${key}.png`;
      const abs = path.join(UPLOADS, filename);
      await el.screenshot({
        path: abs,
        type: "png",
        animations: "disabled",
      });

      const urlPath = `/uploads/section-previews/${filename}`;
      await ensureSection(key);
      await Section.updateOne(
        { key },
        { $set: { section_preview_img: urlPath } }
      );

      console.log(`  ✓ ${key} → ${urlPath}`);
      ok += 1;
    } catch (err) {
      console.warn(`  ✗ ${key}: ${err.message}`);
      fail += 1;
    }
  }

  await browser.close();
  await mongoose.disconnect();

  console.log(`\nDone. ${ok} captured, ${fail} failed.`);
  console.log(`Previews served from ${API_ORIGIN}/uploads/section-previews/…`);
  console.log("Open http://localhost:3001/cms/section-gallery");
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
