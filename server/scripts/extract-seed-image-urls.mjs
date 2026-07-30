/**
 * Extract all image/media URLs referenced in seed source files (and optionally MongoDB).
 *
 * Usage (from server/):
 *   node scripts/extract-seed-image-urls.mjs
 *   node scripts/extract-seed-image-urls.mjs --db          # include DB after seed
 *   node scripts/extract-seed-image-urls.mjs --db-only
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEED_ROOT = path.join(__dirname, "../src/seed");
const OUT_FILE = path.join(__dirname, "../uploads/seed-image-urls.json");
const NET_OUT_FILE = path.join(__dirname, "../uploads/net-image-urls.json");

const IMAGE_EXT =
  /\.(jpg|jpeg|png|webp|gif|svg|avif|ico)(\?[^"'`\s]*)?$/i;

const IMAGE_HOST_HINT =
  /(images\.|img\.|cdn\.|cloudinary|unsplash|netcomlearning|motionpictures|moviefone|picsum|awsstatic|cloudfront)/i;

/** HTTP(S) only — avoid matching inside HTML paragraphs */
const HTTPS_URL = /https?:\/\/[a-zA-Z0-9][-a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=%]*/gi;

const LOCAL_UPLOAD_URL = /\/uploads\/[a-zA-Z0-9][-a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=%]*/gi;

const IMG_SRC_IN_HTML = /<img\b[^>]*\bsrc=["']([^"']+)["']/gi;

const IMAGE_FIELD_KEYS = new Set([
  "image_url",
  "icon",
  "section_bg_img",
  "section_img_url",
  "section_preview_img",
  "page_bg_img",
  "logo_url",
  "avatar_url",
  "thumbnail",
  "thumb_url",
  "banner_url",
  "photo_url",
  "src",
  "poster",
  "background_image",
]);

function isImageUrl(url) {
  const u = String(url || "").trim();
  if (!u) return false;
  if (u.length > 600) return false;
  if (u.includes("${") || u.includes("{")) return false;
  if (u.includes("<") || u.includes(">")) return false;
  if (u.startsWith("/uploads/")) return true;
  if (!/^https?:\/\//i.test(u)) return false;
  if (IMAGE_EXT.test(u)) return true;
  if (IMAGE_HOST_HINT.test(u)) return true;
  return false;
}

function isRemoteImageUrl(url) {
  const u = normalizeUrl(url);
  return /^https?:\/\//i.test(u) && isImageUrl(u);
}

function normalizeUrl(url) {
  return String(url || "")
    .trim()
    .replace(/\\$/g, "")
    .replace(/[),.;]+$/g, "")
    .replace(/&amp;/g, "&");
}

function hostnameOf(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return "unknown";
  }
}

function walkSeedFiles(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name.startsWith(".")) continue;
    const abs = path.join(dir, name);
    const st = statSync(abs);
    if (st.isDirectory()) {
      walkSeedFiles(abs, out);
      continue;
    }
    if (/\.(js|mjs|json|yaml|yml|md)$/i.test(name)) {
      out.push(abs);
    }
  }
  return out;
}

function extractUrlsFromText(text, sourceFile) {
  const found = new Map();

  const add = (url, context = {}) => {
    const normalized = normalizeUrl(url);
    if (!isImageUrl(normalized)) return;
    const key = normalized;
    if (!found.has(key)) {
      found.set(key, {
        url: normalized,
        sources: [],
      });
    }
    const row = found.get(key);
    const srcKey = `${sourceFile}:${context.line || "?"}`;
    if (!row.sources.some((s) => s.file === sourceFile && s.line === context.line)) {
      row.sources.push({
        file: path.relative(path.join(__dirname, ".."), sourceFile),
        line: context.line || null,
        field: context.field || null,
      });
    }
  };

  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNo = i + 1;

    for (const match of line.matchAll(HTTPS_URL)) {
      add(match[0], { line: lineNo });
    }
    for (const match of line.matchAll(LOCAL_UPLOAD_URL)) {
      add(match[0], { line: lineNo });
    }
    for (const match of line.matchAll(IMG_SRC_IN_HTML)) {
      add(match[1], { line: lineNo, field: "img[src]" });
    }

    for (const key of IMAGE_FIELD_KEYS) {
      const fieldRe = new RegExp(
        `${key}\\s*:\\s*["'\`]([^"'\`]+)["'\`]`,
        "i"
      );
      const m = fieldRe.exec(line);
      if (m) add(m[1], { line: lineNo, field: key });
    }
  }

  return [...found.values()];
}

function scanSeedSources() {
  const files = walkSeedFiles(SEED_ROOT);
  const byUrl = new Map();

  for (const file of files) {
    const text = readFileSync(file, "utf8");
    const rows = extractUrlsFromText(text, file);
    for (const row of rows) {
      if (!byUrl.has(row.url)) {
        byUrl.set(row.url, { url: row.url, sources: [] });
      }
      const target = byUrl.get(row.url);
      for (const s of row.sources) {
        if (
          !target.sources.some(
            (x) => x.file === s.file && x.line === s.line && x.field === s.field
          )
        ) {
          target.sources.push(s);
        }
      }
    }
  }

  return [...byUrl.values()].sort((a, b) => a.url.localeCompare(b.url));
}

function collectImageUrlsFromValue(value, pathKey, out, source) {
  if (value == null) return;

  if (typeof value === "string") {
    if (isImageUrl(value)) {
      const key = normalizeUrl(value);
      if (!out.has(key)) {
        out.set(key, { url: key, sources: [] });
      }
      const row = out.get(key);
      if (!row.sources.some((s) => s.collection === source.collection && s.path === pathKey)) {
        row.sources.push({
          collection: source.collection,
          path: pathKey,
          id: source.id || null,
        });
      }
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((v, i) =>
      collectImageUrlsFromValue(v, `${pathKey}[${i}]`, out, source)
    );
    return;
  }

  if (typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      const next = pathKey ? `${pathKey}.${k}` : k;
      if (IMAGE_FIELD_KEYS.has(k) && typeof v === "string") {
        collectImageUrlsFromValue(v, next, out, source);
      } else {
        collectImageUrlsFromValue(v, next, out, source);
      }
    }
  }
}

async function scanDatabase() {
  const connectDB = (await import("../src/config/db.js")).default;
  const Section = (await import("../src/modules/cms/section.model.js")).default;
  const EntityPageSection = (
    await import("../src/modules/cms/entity-page-section.model.js")
  ).default;
  const SiteTheme = (await import("../src/modules/cms/site-theme.model.js"))
    .default;
  const Content = (await import("../src/modules/content/content.model.js"))
    .default;
  const Blog = (await import("../src/modules/blog/blog.model.js")).default;
  const Vendor = (await import("../src/modules/vendor/vendor.model.js"))
    .default;
  const Product = (await import("../src/modules/product/product.model.js"))
    .default;
  const Course = (await import("../src/modules/course/course.model.js"))
    .default;

  await connectDB();

  const byUrl = new Map();

  const ingest = (doc, collection) => {
    if (!doc) return;
    const plain = doc.toObject ? doc.toObject() : doc;
    collectImageUrlsFromValue(plain, collection, byUrl, {
      collection,
      id: String(plain._id || plain.id || ""),
    });
  };

  const sections = await Section.find({}).lean();
  for (const s of sections) ingest(s, "sections");

  const eps = await EntityPageSection.find({}).lean();
  for (const e of eps) ingest(e, "entity_page_sections");

  const themes = await SiteTheme.find({}).lean();
  for (const t of themes) ingest(t, "site_themes");

  const contents = await Content.find({}).lean();
  for (const c of contents) ingest(c, "contents");

  const blogs = await Blog.find({}).lean();
  for (const b of blogs) ingest(b, "blogs");

  const vendors = await Vendor.find({}).lean();
  for (const v of vendors) ingest(v, "vendors");

  const products = await Product.find({}).lean();
  for (const p of products) ingest(p, "products");

  const courses = await Course.find({}).lean();
  for (const c of courses) ingest(c, "courses");

  const mongoose = (await import("mongoose")).default;
  await mongoose.disconnect();

  return [...byUrl.values()].sort((a, b) => a.url.localeCompare(b.url));
}

function groupByOrigin(urls) {
  const local = [];
  const remote = [];
  for (const row of urls) {
    if (row.url.startsWith("/uploads/")) local.push(row);
    else remote.push(row);
  }
  return { local, remote };
}

async function main() {
  const dbOnly = process.argv.includes("--db-only");
  const includeDb = process.argv.includes("--db") || dbOnly;

  let fromSeed = [];
  if (!dbOnly) {
    fromSeed = scanSeedSources();
  }

  let fromDb = [];
  if (includeDb) {
    try {
      fromDb = await scanDatabase();
    } catch (err) {
      console.warn("DB scan skipped:", err.message);
    }
  }

  const merged = new Map();
  for (const row of [...fromSeed, ...fromDb]) {
    if (!merged.has(row.url)) {
      merged.set(row.url, { url: row.url, sources: [] });
    }
    merged.get(row.url).sources.push(...row.sources);
  }

  const all = [...merged.values()].sort((a, b) => a.url.localeCompare(b.url));
  const grouped = groupByOrigin(all);
  const remoteOnly = all.filter((r) => isRemoteImageUrl(r.url));

  const byHost = {};
  for (const row of remoteOnly) {
    const host = hostnameOf(row.url);
    if (!byHost[host]) {
      byHost[host] = { host, count: 0, urls: [] };
    }
    byHost[host].count += 1;
    byHost[host].urls.push({
      url: row.url,
      sources: row.sources,
    });
  }

  const netManifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    description:
      "Remote image URLs used in seed data (sourced from the internet — Unsplash, NetCom CDN, etc.).",
    stats: {
      total: remoteOnly.length,
      hosts: Object.keys(byHost).length,
    },
    hosts: Object.values(byHost).sort((a, b) => b.count - a.count),
    urls: remoteOnly,
    urlList: remoteOnly.map((r) => r.url).sort(),
  };

  writeFileSync(NET_OUT_FILE, `${JSON.stringify(netManifest, null, 2)}\n`, "utf8");

  const manifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    description:
      "Image/media URLs referenced in seed source files and (optionally) MongoDB after seed.",
    stats: {
      total: all.length,
      fromSeedFiles: fromSeed.length,
      fromDatabase: fromDb.length,
      localUploads: grouped.local.length,
      remote: grouped.remote.length,
    },
    urls: all,
    localUploads: grouped.local.map((r) => r.url),
    remoteUrls: grouped.remote.map((r) => r.url),
  };

  writeFileSync(OUT_FILE, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`Wrote ${OUT_FILE}`);
  console.log(`Wrote ${NET_OUT_FILE}`);
  console.log(
    `  ${manifest.stats.total} unique URLs (${manifest.stats.localUploads} local, ${manifest.stats.remote} remote)`
  );
  console.log(`  ${netManifest.stats.total} net/remote image URLs in net-image-urls.json`);
  if (!dbOnly) console.log(`  ${manifest.stats.fromSeedFiles} from seed files`);
  if (includeDb) console.log(`  ${manifest.stats.fromDatabase} from database`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
