/**
 * Fetch NetCom CMS category/navigation tree.
 *
 * Tries authenticated API when NETCOM_CMS_TOKEN is set; otherwise parses
 * public homepage __NEXT_DATA__.navData (same source as production header).
 *
 *   NETCOM_CMS_TOKEN=... npm run netcom:categories
 *   npm run netcom:categories
 */
import { writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../src/seed/data/netcom-categories.json");
const API_URL =
  process.env.NETCOM_CATEGORIES_API_URL ||
  "https://cms.netcomlearning.com/api/v1/category/categories/";
const HOME_URL = process.env.NETCOM_HOME_URL || "https://www.netcomlearning.com/";

function normalizePath(url) {
  if (!url || typeof url !== "string") return "";
  const raw = url.trim();
  if (!raw || raw === "#") return "";
  try {
    const u = raw.startsWith("http") ? new URL(raw) : new URL(raw, HOME_URL);
    return u.pathname.replace(/\/+$/, "") || "/";
  } catch {
    return raw.split("?")[0].replace(/\/+$/, "") || "";
  }
}

function mapNavItem(top) {
  const columns = [];
  for (const lab of top.labels || []) {
    if (lab.status === false) continue;
    const links = [];
    const mainPath = normalizePath(lab.target_url || lab.mobile_link);
    if (mainPath) {
      links.push({ name: lab.label || mainPath, url: mainPath, sort_order: lab.sort_order ?? 0 });
    }
    for (const sub of lab.subcategories || []) {
      if (sub.status === false) continue;
      const p = normalizePath(sub.sub_cat_url || sub.url || sub.mobile_link);
      if (p) {
        links.push({
          name: sub.title || p.split("/").pop(),
          url: p,
          sort_order: sub.sort_order ?? links.length,
        });
      }
    }
    for (const btn of lab.buttons || []) {
      if (btn.status === false) continue;
      const p = normalizePath(btn.target_url);
      if (p && !links.some((l) => l.url === p)) {
        links.push({
          name: btn.button_title || p.split("/").pop(),
          url: p,
          sort_order: btn.sort_order ?? links.length,
        });
      }
    }
    if (links.length) {
      columns.push({
        name: lab.label || top.name,
        links: links.sort((a, b) => a.sort_order - b.sort_order),
      });
    }
  }
  return {
    name: top.name,
    language: top.language || "EN",
    country: top.country || "US",
    sort_order: top.sort_order ?? 99,
    columns,
  };
}

async function fetchFromApi(token) {
  const res = await fetch(API_URL, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  const list = Array.isArray(data) ? data : data.results || data.nav || data.categories || [];
  if (!list.length) throw new Error("API returned empty category list");
  return {
    source: "api",
    fetched_at: new Date().toISOString(),
    navigation: list.map(mapNavItem).filter((n) => n.columns.length),
  };
}

async function fetchFromHomepage() {
  const res = await fetch(HOME_URL, {
    headers: { "User-Agent": "SkillHub-seed/1.0" },
  });
  if (!res.ok) throw new Error(`Homepage ${res.status}`);
  const html = await res.text();
  const m = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
  if (!m) throw new Error("No __NEXT_DATA__ on homepage");
  const data = JSON.parse(m[1]);
  const nav = data?.props?.pageProps?.navData?.nav;
  if (!Array.isArray(nav) || !nav.length) throw new Error("navData.nav missing");
  return {
    source: "homepage",
    fetched_at: new Date().toISOString(),
    navigation: nav.map(mapNavItem).filter((n) => n.columns.length),
  };
}

const token = process.env.NETCOM_CMS_TOKEN || process.env.NETCOM_API_TOKEN;

let payload;
try {
  if (token) {
    console.log("Fetching NetCom categories from API…");
    payload = await fetchFromApi(token);
  } else {
    console.log("No NETCOM_CMS_TOKEN — using public homepage navData…");
    payload = await fetchFromHomepage();
  }
} catch (err) {
  console.warn(`Primary fetch failed (${err.message}) — trying homepage fallback…`);
  payload = await fetchFromHomepage();
}

writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`);
console.log(`Wrote ${OUT}`);
console.log(`  source: ${payload.source}`);
console.log(`  top-level menus: ${payload.navigation.length}`);
for (const nav of payload.navigation) {
  const links = nav.columns.reduce((n, c) => n + c.links.length, 0);
  console.log(`    ${nav.name}: ${nav.columns.length} columns, ${links} links`);
}
