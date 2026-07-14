#!/usr/bin/env node
/**
 * Approximate Next 15-style Size / First Load JS table for Next 16+.
 *
 * Next 16 intentionally removed those columns from `next build`.
 * This reconstructs them from webpack client chunks after:
 *   npm run build:webpack
 *
 * Notes:
 *  - Shared = rootMainFiles from build-manifest (app runtime)
 *  - Size   = page/layout client chunks unique to the route (approx)
 *  - First Load JS = Shared + Size
 *  - Gzipped sizes (same spirit as old CLI)
 */

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextDir = path.join(root, ".next");

function fail(msg) {
  console.error(`\n[report-route-sizes] ${msg}\n`);
  process.exit(1);
}

if (!fs.existsSync(nextDir)) {
  fail("No .next folder. Run: npm run build:webpack");
}

const buildManifestPath = path.join(nextDir, "build-manifest.json");
const routesManifestPath = path.join(nextDir, "app-path-routes-manifest.json");

if (!fs.existsSync(buildManifestPath) || !fs.existsSync(routesManifestPath)) {
  fail("Missing build manifests. Run: npm run build:webpack");
}

const buildManifest = JSON.parse(fs.readFileSync(buildManifestPath, "utf8"));
const routeMap = JSON.parse(fs.readFileSync(routesManifestPath, "utf8"));

const sizeCache = new Map();

function gzipSize(absPath) {
  if (sizeCache.has(absPath)) return sizeCache.get(absPath);
  if (!fs.existsSync(absPath)) {
    sizeCache.set(absPath, 0);
    return 0;
  }
  const raw = fs.readFileSync(absPath);
  const gz = zlib.gzipSync(raw, { level: 9 });
  sizeCache.set(absPath, gz.length);
  return gz.length;
}

function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  const kb = n / 1024;
  if (kb < 100) return `${kb.toFixed(1)} kB`;
  return `${Math.round(kb)} kB`;
}

function toAbsChunk(rel) {
  const clean = String(rel).replace(/^\/+/, "");
  return path.join(nextDir, clean);
}

/** Collect unique static/chunks/*.js paths from a client-reference manifest */
function chunksFromManifest(manifestPath) {
  if (!fs.existsSync(manifestPath)) return new Set();
  const text = fs.readFileSync(manifestPath, "utf8");
  const files = new Set();
  const re = /static\/chunks\/[A-Za-z0-9/_.;\-]+\.js/g;
  let m;
  while ((m = re.exec(text))) {
    files.add(m[0]);
  }
  return files;
}

const sharedFiles = new Set(
  (buildManifest.rootMainFiles || []).filter((f) => f.endsWith(".js"))
);
const sharedBytes = [...sharedFiles].reduce(
  (sum, f) => sum + gzipSize(toAbsChunk(f)),
  0
);

const rows = [];

for (const [appPath, route] of Object.entries(routeMap)) {
  if (!appPath.endsWith("/page") && !appPath.endsWith("/page.js")) continue;
  if (route === "/favicon.ico") continue;

  // appPath like "/cms/page" or "/courses/[slug]/page"
  const fsRel = appPath.replace(/^\//, "").replace(/\/page$/, "");
  const manifestCandidates = [
    path.join(nextDir, "server/app", fsRel, "page_client-reference-manifest.js"),
    path.join(
      nextDir,
      "server/app",
      fsRel === "" ? "page_client-reference-manifest.js" : `${fsRel}/page_client-reference-manifest.js`
    ),
  ];
  if (fsRel === "" || route === "/") {
    manifestCandidates.unshift(
      path.join(nextDir, "server/app/page_client-reference-manifest.js")
    );
  }

  let pageChunks = new Set();
  for (const c of manifestCandidates) {
    const found = chunksFromManifest(c);
    if (found.size) {
      pageChunks = found;
      break;
    }
  }

  // Page-only ≈ chunks not in shared rootMainFiles
  const unique = [...pageChunks].filter((f) => !sharedFiles.has(f));
  const sizeBytes = unique.reduce((sum, f) => sum + gzipSize(toAbsChunk(f)), 0);
  const firstLoad = sharedBytes + sizeBytes;

  rows.push({
    route,
    size: sizeBytes,
    firstLoad,
  });
}

rows.sort((a, b) => a.route.localeCompare(b.route));

const routeW = Math.max(12, ...rows.map((r) => r.route.length));
const sizeW = 10;
const firstW = 14;

console.log("");
console.log(
  "Route (app)".padEnd(routeW),
  "Size".padStart(sizeW),
  "First Load JS".padStart(firstW)
);
console.log("-".repeat(routeW + sizeW + firstW + 4));

for (const r of rows) {
  console.log(
    r.route.padEnd(routeW),
    formatBytes(r.size).padStart(sizeW),
    formatBytes(r.firstLoad).padStart(firstW)
  );
}

console.log("-".repeat(routeW + sizeW + firstW + 4));
console.log(
  `+ First Load JS shared by all`.padEnd(routeW),
  "".padStart(sizeW),
  formatBytes(sharedBytes).padStart(firstW)
);
console.log("");
console.log(
  "Note: Approximate gzip sizes reconstructed for Next 16 (official Size / First Load JS columns were removed)."
);
console.log("Build with: npm run build:webpack");
console.log("");
