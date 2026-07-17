/**
 * Capture tab section screenshots from /tabs-showcase → section_preview_img
 *
 * Prerequisites:
 *   npm run seed:tabs-showcase
 *   Client on :3001, Mongo available
 *
 *   npx playwright install chromium
 *   npm run capture:tabs-previews
 */
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { chromium } from "playwright";
import connectDB from "../src/config/db.js";
import Section from "../src/modules/cms/section.model.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS = path.join(__dirname, "../uploads/section-previews");
const SHOWCASE_URL =
  process.env.TABS_SHOWCASE_URL || "http://localhost:3001/tabs-showcase";
const TAB_KEYS = (
  process.env.TAB_SECTION_KEYS ||
  "feature_tabs,tabs_vertical,tabs_horizontal,tabs_underline,tabs_success_stories"
)
  .split(",")
  .map((k) => k.trim())
  .filter(Boolean);

async function main() {
  await mkdir(UPLOADS, { recursive: true });
  await connectDB();

  console.log(`Opening ${SHOWCASE_URL}`);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1,
  });

  await page.goto(SHOWCASE_URL, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(2000);

  let ok = 0;
  let fail = 0;

  for (const key of TAB_KEYS) {
    try {
      const el = page.locator(`[data-section-capture="${key}"]`);
      await el.waitFor({ state: "visible", timeout: 15000 });
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);

      const filename = `${key}.png`;
      const abs = path.join(UPLOADS, filename);
      await el.screenshot({
        path: abs,
        type: "png",
        animations: "disabled",
      });

      const urlPath = `/uploads/section-previews/${filename}`;
      await Section.updateOne({ key }, { $set: { section_preview_img: urlPath } });

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
  console.log(`View page: ${SHOWCASE_URL}`);
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
