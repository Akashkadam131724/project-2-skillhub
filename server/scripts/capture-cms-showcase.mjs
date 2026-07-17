/**
 * Capture CMS admin + live-edit screenshots for the /cms-preview client page.
 *
 * Requires client on :3001.
 *
 *   npm run capture:cms-showcase
 */
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS = path.join(__dirname, "../uploads/cms-showcase");
const BASE = process.env.CMS_SHOWCASE_BASE || "http://localhost:3001";

/** @type {Array<{ id: string, path: string, label: string, setup?: (page: import('playwright').Page) => Promise<void> }>} */
const SHOTS = [
  { id: "cms-home", path: "/cms", label: "CMS home" },
  { id: "cms-contents", path: "/cms/contents", label: "Content pages" },
  { id: "cms-pages", path: "/cms/pages", label: "Page templates" },
  {
    id: "cms-page-home",
    path: "/cms/pages/home",
    label: "Home template placements",
  },
  {
    id: "cms-sections",
    path: "/cms/pages-content-sections",
    label: "All content sections",
  },
  {
    id: "cms-sections-previews",
    path: "/cms/pages-content-sections",
    label: "Sections with previews on",
    setup: async (page) => {
      await page.addInitScript(() => {
        localStorage.setItem("cms-show-section-previews", "1");
        localStorage.setItem("cms-show-section-filters", "0");
      });
    },
  },
  { id: "cms-site-theme", path: "/cms/site-theme", label: "Site theme" },
  { id: "cms-vendors", path: "/cms/vendors", label: "Vendors CMS" },
  { id: "cms-products", path: "/cms/products", label: "Products CMS" },
  { id: "cms-courses", path: "/cms/courses", label: "Courses CMS" },
  { id: "cms-blogs", path: "/cms/blogs", label: "Blogs CMS" },
  {
    id: "live-cms-mode",
    path: "/?cms=true",
    label: "Live page CMS mode",
  },
  {
    id: "live-cms-previews",
    path: "/?cms=true",
    label: "Live page section previews",
    setup: async (page) => {
      await page.addInitScript(() => {
        localStorage.setItem("cms-show-section-previews", "1");
      });
    },
  },
  {
    id: "live-cms-settings",
    path: "/?cms=true",
    label: "Page settings drawer",
    setup: async (page) => {
      await page.waitForSelector('[aria-label="Open page settings"]', {
        timeout: 30000,
      });
      await page.click('[aria-label="Open page settings"]');
      await page.waitForTimeout(800);
    },
  },
  {
    id: "live-vendor-cms",
    path: "/vendor/aws?cms=true",
    label: "Vendor page live CMS",
  },
];

async function captureOne(browser, shot) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  if (shot.setup && shot.id.includes("previews")) {
    // init script must be registered before navigation
    await shot.setup(page);
  } else if (shot.setup && shot.id === "live-cms-settings") {
    // settings opens after load — navigate first
  } else if (shot.setup) {
    await shot.setup(page);
  }

  // Re-apply preview init when needed after context create
  if (shot.id === "cms-sections-previews" || shot.id === "live-cms-previews") {
    await page.addInitScript(() => {
      localStorage.setItem("cms-show-section-previews", "1");
      if (location.pathname.includes("pages-content-sections")) {
        localStorage.setItem("cms-show-section-filters", "0");
      }
    });
  }

  const url = `${BASE}${shot.path}`;
  console.log(`  → ${shot.id}: ${url}`);
  await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(1200);

  if (shot.id === "live-cms-settings") {
    await page.click('[aria-label="Open page settings"]');
    await page.waitForTimeout(900);
  }

  const file = path.join(UPLOADS, `${shot.id}.png`);
  await page.screenshot({
    path: file,
    type: "png",
    fullPage: false,
    animations: "disabled",
  });
  await context.close();
  return `/uploads/cms-showcase/${shot.id}.png`;
}

async function main() {
  await mkdir(UPLOADS, { recursive: true });
  console.log(`Capturing CMS showcase shots from ${BASE}`);
  console.log(`Saving to ${UPLOADS}`);

  const browser = await chromium.launch({ headless: true });
  let ok = 0;
  let fail = 0;

  for (const shot of SHOTS) {
    try {
      const urlPath = await captureOne(browser, shot);
      console.log(`  ✓ ${shot.label} → ${urlPath}`);
      ok += 1;
    } catch (err) {
      console.warn(`  ✗ ${shot.id}: ${err.message}`);
      fail += 1;
    }
  }

  await browser.close();
  console.log(`Done. ${ok} ok, ${fail} failed.`);
  if (fail && !ok) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
